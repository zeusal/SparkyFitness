package com.sparkyapps.sparkyfitness.widget

import android.content.Context
import android.os.Build
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.state.updateAppWidgetState
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.OutOfQuotaPolicy
import androidx.work.WorkManager
import com.sparkyapps.sparkyfitness.backgroundwater.WATER_WIDGET_ACCOUNT_EPOCH
import com.sparkyapps.sparkyfitness.backgroundwater.WaterChangeOutcome
import com.sparkyapps.sparkyfitness.backgroundwater.waterRequestConstraints
import kotlin.math.max
import kotlinx.coroutines.CancellationException
import org.json.JSONObject

/** The water widget's snapshot as it is drawn, or null when there is none for today. */
internal data class WaterSnapshot(
    val consumedMl: Double,
    val goalMl: Double,
    /** One drink of the dashboard's container; null when it is linked to a food. */
    val drinkMl: Double?,
    val unit: String,
    val canLog: Boolean,
    /**
     * The part of today's water logged by hand, which is all a − can remove;
     * null when unknown (a server without the breakdown), which leaves − on.
     */
    val manualMl: Double?,
    /** Taps waiting to be sent, and taps being sent: shown before the server answers. */
    val pendingDrinks: Int,
    val sendingDrinks: Int,
    val status: String?,
) {
    private val queuedMl: Double = (pendingDrinks + sendingDrinks) * (drinkMl ?: 0.0)
    val shownMl: Double = max(0.0, consumedMl + queuedMl)
    val showsButtons: Boolean = canLog && (drinkMl ?: 0.0) > 0.0
    val canRemove: Boolean = shownMl > 0.0 && (manualMl == null || manualMl + queuedMl > 0.0)
}

/**
 * Everything that changes the water widget's figures, all under
 * [WidgetSnapshotLock]: the app's pushes (CalorieWidgetModule), the − and +
 * buttons ([WaterChangeAction]), the worker that sends them
 * ([WaterWidgetWorker]), a drink logged by the shortcut or the tile
 * (WaterWidgetReceiver), and the clear on an account change.
 *
 * The snapshot is one JSON object kept, like the other widgets', in
 * SharedPreferences and in each instance's Glance state. Besides what the app
 * sends it holds the taps not yet answered and the last error to show.
 */
internal object WaterWidgetStore {
    const val WORK_NAME = "water-widget-change"

    const val STATUS_SIGN_IN = "sign_in"
    const val STATUS_PICK_CONTAINER = "pick_container"
    const val STATUS_EXPIRED = "expired"
    const val STATUS_UNREACHABLE = "unreachable"
    const val STATUS_BLOCKED = "blocked"
    const val STATUS_MAYBE_BLOCKED = "maybe_blocked"
    const val STATUS_FAILED = "failed"
    const val STATUS_NOTHING_TO_REMOVE = "nothing_to_remove"
    const val STATUS_WAITING = "waiting"
    const val STATUS_UNCONFIRMED = "unconfirmed"

    private const val KEY_ACCOUNT_EPOCH = WATER_WIDGET_ACCOUNT_EPOCH
    private const val KEY_PENDING = "pendingDrinks"
    private const val KEY_SENDING = "sendingDrinks"
    private const val KEY_STATUS = "status"
    // Taps from earlier days still waiting to be sent, by day: they go out
    // dated the day they were made, and never count in today's figures.
    private const val KEY_EARLIER = "earlierDrinks"
    // An earlier day's taps taken by a worker that has not answered yet.
    private const val KEY_EARLIER_SENDING = "earlierSendingDrinks"
    // Set when a failure dropped today's taps, waiting or in the failed batch,
    // until the next tap or app push (which builds the snapshot afresh):
    // drinks kept after that never show as "Waiting to send", whatever has
    // cleared the error since.
    private const val KEY_DROPPED = "droppedToday"
    // The server accepts up to 100 drinks a request.
    private const val MAX_DRINKS_PER_REQUEST = 100

    /**
     * Taps taken by the worker: the account they were made for, the day of
     * the snapshot they were taken from ([date]), the day they were made
     * ([entryDate]), and whether they were left over from an earlier day
     * ([fromEarlier]), which are counted apart from today's.
     */
    class Batch(
        val drinks: Int,
        val accountEpoch: Long,
        val date: String,
        val entryDate: String,
        val fromEarlier: Boolean,
    )

    fun parse(json: String?): WaterSnapshot? {
        if (json == null) return null
        return try {
            val obj = JSONObject(json)
            if (!isSnapshotToday(obj.optString("date", ""))) return null
            val pending = obj.optInt(KEY_PENDING, 0)
            val sending = obj.optInt(KEY_SENDING, 0)
            val earlier = obj.optJSONObject(KEY_EARLIER)?.length() ?: 0
            WaterSnapshot(
                consumedMl = obj.finiteDouble("consumedMl") ?: 0.0,
                goalMl = obj.finiteDouble("goalMl") ?: 0.0,
                drinkMl = obj.finiteDouble("drinkMl")?.takeIf { it > 0.0 },
                unit = obj.optString("unit", "ml"),
                canLog = obj.optBoolean("canLog", false),
                manualMl = obj.finiteDouble("manualMl"),
                pendingDrinks = pending,
                sendingDrinks = sending,
                // "Waiting to send" only while something waits: taps that
                // cancel out, or an ended day's batch that is out or went
                // through, leave none.
                status = obj.optString(KEY_STATUS, "").ifEmpty { null }
                    ?.takeUnless { it == STATUS_WAITING && pending == 0 && sending == 0 && earlier == 0 },
            )
        } catch (e: Exception) {
            null
        }
    }

    fun loadSnapshot(context: Context): WaterSnapshot? = parse(storedJson(context))

    /**
     * Stores what the app sent. A background refresh leaves out the drink,
     * unit and whether the buttons may show, and the Dashboard leaves out the
     * drink until its container has loaded; whatever is left out is kept from
     * the stored copy. The manual part comes with every push and is never
     * kept, as the day's water may have changed since. Taps not yet sent are
     * always kept, and when the day changes they move to [KEY_EARLIER] under
     * the day they were made; the request still out is forgotten: its answer
     * no longer changes the counters or the figures, though a failure is
     * still shown and handled like any other ([applyOutcomeLocked]). A push
     * from the app answers any error the widget was showing. Redraws
     * nothing: the app reloads the widget after it.
     * True when drinks still wait to be sent, which the caller then sends.
     */
    suspend fun mergeFromAppLocked(context: Context, json: String): Boolean {
        val incoming = JSONObject(json)
        // The widget only shows the device's day; a background refresh built
        // for another day (the account's timezone) would blank it.
        if (!isSnapshotToday(incoming.optString("date", ""))) return false
        val stored = storedObject(context)
        if (stored != null) {
            for (key in listOf("drinkMl", "unit", "canLog")) {
                if (!incoming.has(key) && stored.has(key)) incoming.put(key, stored.get(key))
            }
            stored.optJSONObject(KEY_EARLIER)?.let { incoming.put(KEY_EARLIER, it) }
            val pending = stored.optInt(KEY_PENDING, 0)
            if (stored.optString("date") == incoming.optString("date")) {
                if (stored.has(KEY_PENDING)) incoming.put(KEY_PENDING, pending)
                if (stored.has(KEY_SENDING)) incoming.put(KEY_SENDING, stored.get(KEY_SENDING))
                if (stored.has(KEY_EARLIER_SENDING)) incoming.put(KEY_EARLIER_SENDING, stored.get(KEY_EARLIER_SENDING))
            } else if (pending != 0) {
                keepEarlier(incoming, stored.optString("date"), pending)
            }
        }
        incoming.remove(KEY_STATUS)
        writeLocked(context, incoming, redraw = false)
        return incoming.optInt(KEY_PENDING, 0) != 0 || (incoming.optJSONObject(KEY_EARLIER)?.length() ?: 0) > 0
    }

    /**
     * Adds a tap to send, showing "Waiting to send" when it was made with no
     * usable network ([waiting]). False when there is nothing to change (no
     * snapshot for today, or nothing to remove).
     */
    suspend fun addTapLocked(context: Context, change: Int, waiting: Boolean): Boolean {
        if (change == 0) return false
        val obj = storedObject(context) ?: return false
        val snapshot = parse(obj.toString()) ?: return false
        if (!snapshot.showsButtons) return false
        if (change < 0 && !snapshot.canRemove) return false
        obj.put(KEY_PENDING, snapshot.pendingDrinks + change)
        obj.remove(KEY_DROPPED)
        if (waiting) obj.put(KEY_STATUS, STATUS_WAITING) else obj.remove(KEY_STATUS)
        writeLocked(context, obj, redraw = true)
        return true
    }

    /**
     * Forgets taps an earlier worker took and never answered: it was stopped
     * (a lost network stops it now that it needs one) or its process died
     * mid-request. Called when a worker starts. A stopped worker's request may
     * still be finishing, but its coroutine was cancelled, so its answer is
     * never applied. The taps are not sent again, as that request may have
     * reached the server, and the widget says the change may not have been
     * saved until a tap, a push or today's total answers it; the next app push
     * brings the day's real total. Across midnight nothing says so: an ended
     * day's snapshot is not shown, and the new day's push forgets that day's
     * request.
     */
    suspend fun reclaimSendingLocked(context: Context) {
        val obj = storedObject(context) ?: return
        if (obj.optInt(KEY_SENDING, 0) == 0 && obj.optInt(KEY_EARLIER_SENDING, 0) == 0) return
        obj.put(KEY_SENDING, 0)
        obj.remove(KEY_EARLIER_SENDING)
        obj.put(KEY_STATUS, STATUS_UNCONFIRMED)
        writeLocked(context, obj, redraw = true)
    }

    /**
     * Takes the taps waiting to be sent, an earlier day's first, or null when
     * there are none. An earlier day's taps are not shown, so while they are
     * out they are counted apart from today's ([KEY_EARLIER_SENDING]), for a
     * rerun to say they may not have been saved.
     */
    suspend fun takePendingLocked(context: Context): Batch? {
        val obj = storedObject(context) ?: return null
        val date = obj.optString("date", "")
        val earlier = obj.optJSONObject(KEY_EARLIER)
        val earliestDay = earlier?.keys()?.asSequence()?.filter { earlier.optInt(it, 0) != 0 }?.minOrNull()
        if (earlier != null && earliestDay != null) {
            val waiting = earlier.optInt(earliestDay, 0)
            val drinks = waiting.coerceIn(-MAX_DRINKS_PER_REQUEST, MAX_DRINKS_PER_REQUEST)
            if (waiting == drinks) earlier.remove(earliestDay) else earlier.put(earliestDay, waiting - drinks)
            if (earlier.length() == 0) obj.remove(KEY_EARLIER)
            obj.put(KEY_EARLIER_SENDING, obj.optInt(KEY_EARLIER_SENDING, 0) + drinks)
            writeLocked(context, obj, redraw = false)
            return Batch(drinks, accountEpoch(context), date, entryDate = earliestDay, fromEarlier = true)
        }
        val pending = obj.optInt(KEY_PENDING, 0)
        if (pending == 0) return null
        val drinks = pending.coerceIn(-MAX_DRINKS_PER_REQUEST, MAX_DRINKS_PER_REQUEST)
        obj.put(KEY_PENDING, pending - drinks)
        obj.put(KEY_SENDING, obj.optInt(KEY_SENDING, 0) + drinks)
        writeLocked(context, obj, redraw = false)
        return Batch(drinks, accountEpoch(context), date, entryDate = date, fromEarlier = false)
    }

    /**
     * Shows what the server answered. Dropped when the account changed after
     * the taps were taken, so the previous account's total never comes back.
     * When the app has since sent another day, whose push forgot this
     * request, a success changes nothing and a failure is still shown there.
     * A failure drops today's taps still waiting too, whichever day it was
     * for: the person can tap again. A day that has ended cannot be tapped
     * again, so its drinks are kept for the next send, the failed batch too
     * when it was not logged and sending it again may go through.
     */
    suspend fun applyOutcomeLocked(context: Context, batch: Batch, outcome: WaterChangeOutcome) {
        if (accountEpoch(context) != batch.accountEpoch) return
        val obj = storedObject(context) ?: return
        if (obj.optString("date", "") != batch.date) {
            // The new day's push dropped this request from the counters, and
            // a success for another day changes nothing shown. A failure is
            // still said, and drinks worth sending again are kept, which
            // cannot count them twice once their day has ended.
            if (outcome is WaterChangeOutcome.Changed) return
            val shown = isSnapshotToday(obj.optString("date", ""))
            // Kept unless its day is the day shown (only after the device's
            // date went back), whose batch is dropped with the error below
            // rather than kept out of its figure. On a snapshot that is not
            // shown it is kept even then: the next push for its day carries
            // it in earlierDrinks.
            val kept = !(shown && isSnapshotToday(batch.entryDate)) && worthSendingAgain(outcome)
            if (kept) keepEarlier(obj, batch.entryDate, batch.drinks)
            // As after any failure, the shown day's taps still waiting are
            // dropped: the error then holds for them, and they can be tapped
            // again without being sent twice. A snapshot that is not shown
            // says nothing, as below.
            if (shown) {
                val droppedToday = obj.optInt(KEY_PENDING, 0) != 0 || isSnapshotToday(batch.entryDate)
                if (droppedToday) {
                    obj.put(KEY_PENDING, 0)
                    obj.put(KEY_DROPPED, true)
                }
                putFailureStatus(obj, outcome, onlyKept = kept && !droppedToday)
            }
            writeLocked(context, obj, redraw = true)
            return
        }
        val before = obj.finiteDouble("consumedMl") ?: 0.0
        val drinkMl = obj.finiteDouble("drinkMl") ?: 0.0
        // One batch is out at a time, so its counter holds it, unless a push
        // for another day forgot it and the device's date then came back to
        // this one. An earlier day's taps are counted apart, as the widget
        // does not show them.
        val counter = if (batch.fromEarlier) KEY_EARLIER_SENDING else KEY_SENDING
        if (obj.optInt(counter, 0) == batch.drinks) obj.remove(counter)
        // The server's totals are today's only for taps made on the
        // snapshot's day.
        val forToday = batch.entryDate == batch.date
        when (outcome) {
            is WaterChangeOutcome.Changed -> if (forToday) {
                val total = outcome.totalMl ?: max(0.0, before + batch.drinks * drinkMl)
                obj.put("consumedMl", total)
                outcome.manualMl?.let { obj.put("manualMl", it) }
                // The server removes only drinks logged by hand: a − that
                // found none leaves the total where it was.
                if (batch.drinks < 0 && total >= before) {
                    obj.put(KEY_STATUS, STATUS_NOTHING_TO_REMOVE)
                } else {
                    obj.remove(KEY_STATUS)
                }
            }
            else -> {
                val shown = isSnapshotToday(batch.date)
                // As above: only the day shown drops its own batch.
                val kept = !(shown && isSnapshotToday(batch.entryDate)) && worthSendingAgain(outcome)
                // Today's taps, this batch's or still waiting, are dropped and
                // can be tapped again.
                val droppedToday = shown && (forToday || obj.optInt(KEY_PENDING, 0) != 0)
                if (shown) {
                    obj.put(KEY_PENDING, 0)
                    obj.put(KEY_SENDING, 0)
                }
                if (droppedToday) obj.put(KEY_DROPPED, true)
                if (kept) {
                    if (batch.fromEarlier) {
                        keepEarlier(obj, batch.entryDate, batch.drinks)
                    } else {
                        obj.put(KEY_PENDING, obj.optInt(KEY_PENDING, 0) + batch.drinks)
                    }
                }
                // A snapshot that is not shown says nothing: going forward the
                // next push clears it, and if the device's date came back to
                // its day the status would show over taps it did not drop.
                if (shown) putFailureStatus(obj, outcome, onlyKept = kept && !droppedToday)
            }
        }
        writeLocked(context, obj, redraw = true)
    }

    /**
     * Shows a failure without inviting a tap that would log drinks twice:
     * "may not have been saved" stays until a tap, a push or a total answers
     * it, and a failure that only kept an ended day's drinks to send again
     * ([onlyKept]) shows them waiting, unless the person has to act first
     * (sign in, pick a container, log in again) or today's taps were dropped
     * since the last tap or push ([KEY_DROPPED]), when it shows its own
     * error, or an error is already showing, which then stays: "Waiting to
     * send" would say dropped taps still wait.
     */
    private fun putFailureStatus(obj: JSONObject, outcome: WaterChangeOutcome, onlyKept: Boolean) {
        val current = obj.optString(KEY_STATUS)
        if (current == STATUS_UNCONFIRMED) return
        val actFirst = outcome == WaterChangeOutcome.NotSignedIn ||
            outcome == WaterChangeOutcome.NoContainer || outcome == WaterChangeOutcome.Expired
        if (!onlyKept || actFirst || obj.optBoolean(KEY_DROPPED, false)) {
            obj.put(KEY_STATUS, statusFor(outcome))
        } else if (current.isEmpty() || current == STATUS_WAITING || current == STATUS_NOTHING_TO_REMOVE) {
            obj.put(KEY_STATUS, STATUS_WAITING)
        }
    }

    /**
     * Adds [drinks] to those kept for [day], a day other than the one shown
     * (normally one that has ended), to be sent dated that day.
     */
    private fun keepEarlier(obj: JSONObject, day: String, drinks: Int) {
        val earlier = obj.optJSONObject(KEY_EARLIER) ?: JSONObject()
        val kept = earlier.optInt(day, 0) + drinks
        if (kept == 0) earlier.remove(day) else earlier.put(day, kept)
        if (earlier.length() == 0) obj.remove(KEY_EARLIER) else obj.put(KEY_EARLIER, earlier)
    }

    /**
     * Whether the server did not log a batch that got [outcome] and sending
     * it again may go through: never sent, refused for the login, or turned
     * away for now (a 408 or a 429). Any other redirect or 4xx would be
     * refused at every send, and as an ended day's drinks go first, each
     * send would then drop today's taps.
     */
    private fun worthSendingAgain(outcome: WaterChangeOutcome): Boolean = when (outcome) {
        WaterChangeOutcome.NotSignedIn,
        WaterChangeOutcome.NoContainer,
        WaterChangeOutcome.Expired,
        WaterChangeOutcome.Blocked,
        WaterChangeOutcome.MaybeBlocked -> true
        is WaterChangeOutcome.Unreachable -> !outcome.requestSent
        is WaterChangeOutcome.Failed -> outcome.status == 408 || outcome.status == 429
        is WaterChangeOutcome.Changed -> false
    }

    /**
     * A drink logged by the shortcut or the tile: show the server's new total,
     * unless the account changed while that request was out.
     */
    suspend fun applyTotalsLocked(context: Context, totalMl: Double, manualMl: Double?, accountEpoch: Long?) {
        if (accountEpoch != null && accountEpoch != accountEpoch(context)) return
        val obj = storedObject(context) ?: return
        if (!isSnapshotToday(obj.optString("date", ""))) return
        obj.put("consumedMl", totalMl)
        if (manualMl != null) obj.put("manualMl", manualMl)
        obj.remove(KEY_STATUS)
        writeLocked(context, obj, redraw = true)
    }

    /**
     * The account changed: taps not yet sent belong to the previous account.
     * The snapshot itself is erased with the others (CalorieWidgetModule).
     */
    fun onAccountChangedLocked(context: Context) {
        prefs(context).edit().putLong(KEY_ACCOUNT_EPOCH, accountEpoch(context) + 1).commit()
        WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME)
    }

    /** Sends the waiting taps in the order they were made, one request after another. */
    fun enqueueSend(context: Context) {
        val request = OneTimeWorkRequestBuilder<WaterWidgetWorker>()
            .setConstraints(waterRequestConstraints())
        // Before Android 12 an expedited job runs as a foreground service,
        // and this worker does not supply ForegroundInfo.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            request.setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
        }
        WorkManager.getInstance(context)
            .enqueueUniqueWork(WORK_NAME, ExistingWorkPolicy.APPEND_OR_REPLACE, request.build())
    }

    /**
     * The status a failed change leaves. Every outcome is listed, so a new one
     * cannot silently read as "Could not log the water"; a change that went
     * through never gets here.
     */
    private fun statusFor(outcome: WaterChangeOutcome): String = when (outcome) {
        WaterChangeOutcome.NotSignedIn -> STATUS_SIGN_IN
        WaterChangeOutcome.NoContainer -> STATUS_PICK_CONTAINER
        WaterChangeOutcome.Expired -> STATUS_EXPIRED
        // A request that may have reached the server does not invite another
        // tap, which would log the drinks twice.
        is WaterChangeOutcome.Unreachable -> if (outcome.mayHaveLogged) STATUS_UNCONFIRMED else STATUS_UNREACHABLE
        is WaterChangeOutcome.Failed -> if (outcome.mayHaveLogged) STATUS_UNCONFIRMED else STATUS_FAILED
        WaterChangeOutcome.Blocked -> STATUS_BLOCKED
        WaterChangeOutcome.MaybeBlocked -> STATUS_MAYBE_BLOCKED
        is WaterChangeOutcome.Changed -> STATUS_FAILED
    }

    private fun accountEpoch(context: Context): Long = prefs(context).getLong(KEY_ACCOUNT_EPOCH, 0L)

    private fun prefs(context: Context) =
        context.getSharedPreferences(WaterWidgetReceiver.PREFS_NAME, Context.MODE_PRIVATE)

    private fun storedJson(context: Context): String? =
        prefs(context).getString(WaterWidgetReceiver.PREFS_KEY_SNAPSHOT, null)

    private fun storedObject(context: Context): JSONObject? = try {
        storedJson(context)?.let { JSONObject(it) }
    } catch (e: Exception) {
        null
    }

    /** Stores [obj] and copies it into every instance's state, redrawing each when asked. */
    private suspend fun writeLocked(context: Context, obj: JSONObject, redraw: Boolean) {
        val json = obj.toString()
        if (!prefs(context).edit().putString(WaterWidgetReceiver.PREFS_KEY_SNAPSHOT, json).commit()) {
            throw IllegalStateException("Failed to persist water widget snapshot")
        }
        val widget = WaterWidget()
        GlanceAppWidgetManager(context).getGlanceIds(WaterWidget::class.java).forEach { id ->
            try {
                updateAppWidgetState(context, id) { state -> state[WaterWidget.SNAPSHOT_STATE_KEY] = json }
                if (redraw) widget.update(context, id)
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                // That instance keeps its previous copy until a later write
                // reaches it.
            }
        }
    }

    private fun JSONObject.finiteDouble(name: String): Double? {
        if (!has(name) || isNull(name)) return null
        val value = optDouble(name, Double.NaN)
        return if (value.isFinite()) value else null
    }
}

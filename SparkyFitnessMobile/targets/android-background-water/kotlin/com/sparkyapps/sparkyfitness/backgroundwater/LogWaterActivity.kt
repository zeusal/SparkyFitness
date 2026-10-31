package com.sparkyapps.sparkyfitness.backgroundwater

import android.app.Activity
import android.app.PendingIntent
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import android.widget.Toast
import androidx.core.app.NotificationChannelCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.Constraints
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.OutOfQuotaPolicy
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.SocketException
import java.net.URL
import java.net.UnknownHostException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Target of the "Log water" launcher shortcut. Has no UI: it hands the POST to
 * WorkManager and finishes at once, so the app never comes to the front and
 * the request is not dropped when this activity is gone.
 */
class LogWaterActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Shown while this activity is still in front, so from Android 10 it
        // appears even with the app's notifications off.
        if (enqueueLogWater(applicationContext)) {
            Toast.makeText(applicationContext, WAITING_MESSAGE, Toast.LENGTH_LONG).show()
        }
        finish()
    }
}

/**
 * Logs one drink in the background and reports how it went. Shared by the
 * launcher shortcut and, with [fromTile], the Quick Settings tile
 * (targets/android-widget). True when the drink waits for a usable network:
 * the tile says so at once in its notification, the shortcut in a Toast, so
 * a second tap is not taken for a retry. The drinks go out one at a time, in
 * the order they were tapped.
 */
fun enqueueLogWater(context: Context, fromTile: Boolean = false): Boolean {
    return try {
        // Said before the request is queued, so a quick answer replaces it
        // rather than the other way round.
        val waiting = !hasUsableNetwork(context)
        if (waiting && fromTile) notify(context, LogWaterResult(false, WAITING_MESSAGE, waiting = true))
        val requestBuilder = OneTimeWorkRequestBuilder<LogWaterWorker>()
            .setInputData(
                workDataOf(
                    KEY_FROM_TILE to fromTile,
                    // The drink belongs to the day and the account of the tap,
                    // even when the request waits for a network.
                    KEY_ENTRY_DATE to today(),
                    KEY_ACCOUNT_EPOCH to waterWidgetAccountEpoch(context),
                ),
            )
            .setConstraints(waterRequestConstraints())
        // Before Android 12 an expedited job runs as a foreground service,
        // and this worker does not supply ForegroundInfo.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            requestBuilder.setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
        }
        val request = requestBuilder.build()
        WorkManager.getInstance(context)
            .enqueueUniqueWork(LOG_WATER_WORK, ExistingWorkPolicy.APPEND_OR_REPLACE, request)
        waiting
    } catch (e: Exception) {
        report(context, LogWaterResult(false, "SparkyFitness could not log the water"), fromTile)
        false
    }
}

/** Owns the POST that [enqueueLogWater] queued, after its caller has gone. */
class LogWaterWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result {
        // A run is repeated only when an earlier one was stopped, maybe after
        // its request reached the server, which logs a drink every time.
        val fromTile = inputData.getBoolean(KEY_FROM_TILE, false)
        if (runAttemptCount > 0) {
            Log.w(TAG, "Log water stopped before it finished; not sent again")
            report(applicationContext, LogWaterResult(false, unconfirmedMessage()), fromTile)
            return Result.success()
        }
        // An account change while the request waited moved the epoch on: the
        // drink was meant for the previous account.
        val accountEpoch = inputData.getLong(KEY_ACCOUNT_EPOCH, 0L)
        if (accountEpoch != waterWidgetAccountEpoch(applicationContext)) {
            Log.w(TAG, "Log water dropped: the account changed while it waited")
            report(
                applicationContext,
                LogWaterResult(false, "The water was not logged: the account changed."),
                fromTile,
            )
            return Result.success()
        }
        val entryDate = inputData.getString(KEY_ENTRY_DATE) ?: today()
        val outcome = postWaterChange(applicationContext, 1, entryDate)
        // A stopped run carries on until its request ends, but WorkManager
        // runs it again and that run answers for the drink, so this one stays
        // quiet: one answer per drink, and no late total on the widget.
        if (isStopped) return Result.success()
        // An earlier day's total is not what the widget shows.
        if (outcome is WaterChangeOutcome.Changed && entryDate == today()) {
            showTotalOnWaterWidget(applicationContext, outcome, accountEpoch)
        }
        report(applicationContext, resultFor(outcome), fromTile)
        return Result.success()
    }
}

// The water widget (targets/android-widget) is reached by its receiver's
// class name, so this code builds without it.
private const val WATER_WIDGET_RECEIVER = "com.sparkyapps.sparkyfitness.widget.WaterWidgetReceiver"
const val ACTION_WATER_TOTALS = "com.sparkyapps.sparkyfitness.widget.ACTION_WATER_TOTALS"
const val EXTRA_TOTAL_ML = "totalMl"
const val EXTRA_MANUAL_ML = "manualMl"
const val EXTRA_ACCOUNT_EPOCH = "accountEpoch"

/** Where the water widget keeps its snapshot and its account epoch (WaterWidgetStore). */
const val WATER_WIDGET_PREFS = "SparkyWaterWidget"
const val WATER_WIDGET_ACCOUNT_EPOCH = "accountEpoch"

private fun waterWidgetAccountEpoch(context: Context): Long =
    context.getSharedPreferences(WATER_WIDGET_PREFS, Context.MODE_PRIVATE)
        .getLong(WATER_WIDGET_ACCOUNT_EPOCH, 0L)

/** Lets a placed water widget show the total after a drink logged from the shortcut or the tile. */
private fun showTotalOnWaterWidget(context: Context, outcome: WaterChangeOutcome.Changed, accountEpoch: Long) {
    val total = outcome.totalMl ?: return
    val intent = Intent(ACTION_WATER_TOTALS)
        .setComponent(ComponentName(context.packageName, WATER_WIDGET_RECEIVER))
        .putExtra(EXTRA_TOTAL_ML, total)
        .putExtra(EXTRA_ACCOUNT_EPOCH, accountEpoch)
    outcome.manualMl?.let { intent.putExtra(EXTRA_MANUAL_ML, it) }
    try {
        context.sendBroadcast(intent)
    } catch (e: Exception) {
        // No water widget in this build.
    }
}

/** A logged drink, from the shortcut, the tile or the water widget, answers the tile's last failure. */
fun clearWaterFailureNotice(context: Context) {
    NotificationManagerCompat.from(context).cancel(FAILED_NOTIFICATION_ID)
}

private const val KEY_FROM_TILE = "from_tile"
private const val KEY_ENTRY_DATE = "entry_date"
private const val KEY_ACCOUNT_EPOCH = "account_epoch"
private const val CHANNEL_ID = "quick-logging"
private const val LOGGED_NOTIFICATION_ID = 7301
private const val FAILED_NOTIFICATION_ID = 7302
private const val WAITING_NOTIFICATION_ID = 7303
private const val LOGGED_SHOWN_FOR_MS = 30_000L
private const val LOG_WATER_WORK = "log-water"
private const val WAITING_MESSAGE = "Waiting for a connection. The water will be logged then."

/**
 * For a request that may have reached the server, which logs a drink for
 * every one: unlike "could not reach" or "could not log", it does not invite
 * another tap. [status] is the server's error, when it answered with one.
 */
private fun unconfirmedMessage(status: Int? = null): String =
    "Not sure the water was logged${status?.let { " (error $it)" } ?: ""}. Check the app."

/**
 * [opensAppInfo]: the notification opens the app's App info, where its
 * battery use is set. [waiting]: the drink waits for a network, a notice the
 * result replaces.
 */
private class LogWaterResult(
    val logged: Boolean,
    val message: String,
    val opensAppInfo: Boolean = false,
    val waiting: Boolean = false,
)

/**
 * The shortcut is tapped on the home screen, so a Toast is enough. Over the
 * tile a Toast would be drawn under the open panel or hidden by the lock
 * screen, so the tile's result goes to the notification list instead. Unless
 * the app is on screen, either way needs the app's notifications on: Android
 * drops a Toast from an app in the background while they are off.
 */
private fun report(context: Context, result: LogWaterResult, fromTile: Boolean) {
    NotificationManagerCompat.from(context).cancel(WAITING_NOTIFICATION_ID)
    if (result.logged) clearWaterFailureNotice(context)
    if (!fromTile || !notify(context, result)) toast(context, result.message)
}

/**
 * Lists [result] without sound, vibration or a heads-up pop-up, since it only
 * confirms a tap; tapping it opens the app, or its App info for a block
 * ([LogWaterResult.opensAppInfo]). A logged drink goes away after 30
 * seconds, a failure stays until a drink is logged or the tile fails again.
 * A lock screen that hides sensitive content shows a logged drink's public
 * version, which does not name the container; a failure never names it, so it
 * stays readable there. False when the app's notifications are off. A user who turned off just this
 * channel gets nothing.
 */
private fun notify(context: Context, result: LogWaterResult): Boolean {
    val manager = NotificationManagerCompat.from(context)
    if (!manager.areNotificationsEnabled()) return false
    return try {
        manager.createNotificationChannel(
            NotificationChannelCompat.Builder(CHANNEL_ID, NotificationManagerCompat.IMPORTANCE_DEFAULT)
                .setName("Quick logging")
                .setSound(null, null)
                .setVibrationEnabled(false)
                .build(),
        )
        // The tile's own icon (targets/android-widget), looked up by name like
        // the shortcut's because R's package differs between builds.
        val icon = context.resources.getIdentifier("ic_tile_log_water", "drawable", context.packageName)
        val smallIcon = if (icon != 0) icon else context.applicationInfo.icon
        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(smallIcon)
            .setContentText(result.message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(result.message))
            .setCategory(NotificationCompat.CATEGORY_STATUS)
            .setAutoCancel(true)
        if (result.logged) {
            builder.setTimeoutAfter(LOGGED_SHOWN_FOR_MS)
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setPublicVersion(
                    NotificationCompat.Builder(context, CHANNEL_ID)
                        .setSmallIcon(smallIcon)
                        .setContentText("Water logged")
                        .build(),
                )
        } else {
            builder.setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
        }
        val target = if (result.opensAppInfo) {
            appInfoIntent(context)
        } else {
            context.packageManager.getLaunchIntentForPackage(context.packageName)
        }
        target?.let {
            builder.setContentIntent(PendingIntent.getActivity(context, 0, it, PendingIntent.FLAG_IMMUTABLE))
        }
        // Separate ids, because on many Android versions a logged drink's
        // timeout would also remove a failure posted under the same id.
        val id = when {
            result.waiting -> WAITING_NOTIFICATION_ID
            result.logged -> LOGGED_NOTIFICATION_ID
            else -> FAILED_NOTIFICATION_ID
        }
        if (id == FAILED_NOTIFICATION_ID) manager.cancel(LOGGED_NOTIFICATION_ID)
        manager.notify(id, builder.build())
        true
    } catch (e: SecurityException) {
        // The permission was taken back after the check above.
        false
    }
}

private fun resultFor(outcome: WaterChangeOutcome): LogWaterResult {
    return when (outcome) {
        is WaterChangeOutcome.Changed -> LogWaterResult(true, "Logged 1 × ${outcome.containerLabel}")
        WaterChangeOutcome.NotSignedIn ->
            LogWaterResult(false, "Open SparkyFitness and sign in to a server first.")
        WaterChangeOutcome.NoContainer ->
            LogWaterResult(false, "Pick a water container in SparkyFitness first.")
        WaterChangeOutcome.Expired ->
            LogWaterResult(false, "Your SparkyFitness login expired. Open the app once to sign in again.")
        is WaterChangeOutcome.Failed -> if (outcome.mayHaveLogged) {
            LogWaterResult(false, unconfirmedMessage(outcome.status))
        } else {
            LogWaterResult(false, "SparkyFitness could not log the water (error ${outcome.status})")
        }
        is WaterChangeOutcome.Unreachable -> if (outcome.mayHaveLogged) {
            LogWaterResult(false, unconfirmedMessage())
        } else {
            LogWaterResult(false, "SparkyFitness could not reach your server")
        }
        // Short enough for the two lines Android 12+ gives a Toast, at the
        // default and the Large font size, in Roboto and in a Pixel's wider
        // system font.
        WaterChangeOutcome.Blocked -> LogWaterResult(
            false,
            "SparkyFitness was blocked. Allow it unrestricted battery use.",
            opensAppInfo = true,
        )
        WaterChangeOutcome.MaybeBlocked -> LogWaterResult(
            false,
            "Could not find your server. Check the app's battery use.",
            opensAppInfo = true,
        )
    }
}

/** How a change to one day's drinks went, for the shortcut, the tile and the water widget. */
sealed class WaterChangeOutcome {
    /**
     * Whether the server may have logged the change although it did not say
     * so: another tap would then log it twice.
     */
    open val mayHaveLogged: Boolean get() = false

    /**
     * The server took it. [totalMl] is the day's water after the change and
     * [manualMl] the part logged by hand, when the server reports them.
     */
    data class Changed(
        val totalMl: Double?,
        val manualMl: Double?,
        val containerLabel: String,
    ) : WaterChangeOutcome()
    object NotSignedIn : WaterChangeOutcome()
    object NoContainer : WaterChangeOutcome()
    object Expired : WaterChangeOutcome()

    /**
     * The server answered with an error. A redirect or a 4xx means the
     * drinks were not stored. Anything else, a 5xx or an answer that is not
     * HTTP, can come after they were: the server stores the drinks before it
     * works out the day's totals.
     */
    data class Failed(val status: Int) : WaterChangeOutcome() {
        override val mayHaveLogged: Boolean get() = status !in 300..499
    }

    /** No answer. [requestSent]: it failed after connecting, so it may have reached the server. */
    data class Unreachable(val requestSent: Boolean) : WaterChangeOutcome() {
        override val mayHaveLogged: Boolean get() = requestSent
    }

    /**
     * The phone kept the app offline in the background (a battery saver mode,
     * or a limit on background data), so the request never left it.
     */
    object Blocked : WaterChangeOutcome()

    /**
     * The server's name did not resolve while the phone was online, for an app
     * not exempt from battery optimisation: a phone maker's battery mode can
     * block lookups without Android saying so, but the name itself may also
     * not resolve from here. The request never left the phone.
     */
    object MaybeBlocked : WaterChangeOutcome()
}

/**
 * Adds [drinks] of the dashboard's container to the water of [entryDate], the
 * day they were tapped, or removes them when negative (the server removes the
 * newest drinks logged by hand). Blocking network call: run it off the main
 * thread.
 */
fun postWaterChange(context: Context, drinks: Int, entryDate: String): WaterChangeOutcome {
    // Where a failure happened: only one while connecting can be the phone
    // blocking the app, as nothing has been sent to the server yet.
    var phase = "reading the stored login"
    return try {
        val json = BackgroundWaterStore.load(context) ?: return WaterChangeOutcome.NotSignedIn
        val config = JSONObject(json)
        if (config.isNull("containerId") || config.isNull("containerName")) {
            return WaterChangeOutcome.NoContainer
        }
        val baseUrl = config.getString("baseUrl")
        val containerName = config.getString("containerName")
        val volume = config.optString("volumeLabel", "")
        val body = JSONObject()
            .put("entry_date", entryDate)
            .put("change_drinks", drinks)
            .put("container_id", config.getInt("containerId"))

        val connection = URL("$baseUrl/api/measurements/water-intake").openConnection() as HttpURLConnection
        try {
            connection.requestMethod = "POST"
            connection.connectTimeout = 15000
            connection.readTimeout = 15000
            // A redirect would resend the configured headers (a proxy credential
            // can live in one) to another host; a 3xx fails below instead.
            connection.instanceFollowRedirects = false
            connection.doOutput = true
            val headers = config.getJSONObject("headers")
            for (name in headers.keys()) {
                connection.setRequestProperty(name, headers.getString(name))
            }
            connection.setRequestProperty("Content-Type", "application/json")
            phase = "connecting"
            connection.connect()
            phase = "sending"
            connection.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
            val status = connection.responseCode
            when {
                status in 200..299 -> {
                    val totals = try {
                        JSONObject(connection.inputStream.bufferedReader().use { it.readText() })
                    } catch (e: Exception) {
                        null
                    }
                    WaterChangeOutcome.Changed(
                        totalMl = totals?.optionalNumber("water_ml"),
                        manualMl = totals?.optionalNumber("manual_ml"),
                        containerLabel = if (volume.isNotEmpty()) "$containerName ($volume)" else containerName,
                    )
                }
                status == 401 || status == 403 -> WaterChangeOutcome.Expired
                else -> WaterChangeOutcome.Failed(status)
            }
        } finally {
            connection.disconnect()
        }
    } catch (e: Exception) {
        // Never the URL or the headers, which carry the login. The message is
        // logged only for a failure on the network, where it can name the
        // server: one from setting a header can quote the header's value.
        val detail = if (phase == "connecting" || phase == "sending") ": ${e.message}" else ""
        Log.w(TAG, "Water change failed while $phase: ${e.javaClass.simpleName}$detail; ${networkSummary(context)}")
        (if (phase == "connecting") blockedOutcome(context, e) else null)
            ?: WaterChangeOutcome.Unreachable(requestSent = phase == "sending")
    }
}

/** Today on the device, the day a drink is logged for, as the server takes it. */
fun today(): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

/**
 * The water requests wait for a usable network instead of failing without
 * one. Without it WorkManager also starts them at once in the app's process,
 * where a battery saver can block the network, and from Android 14 QPR2 an
 * expedited job may use the network under battery saver, Doze and App
 * Standby only when it declares that it needs one. WorkManager judges the
 * network by what Android reports for the app, so a phone maker's battery
 * mode that Android does not report still lets a request start, and it ends
 * as [WaterChangeOutcome.Blocked] or [WaterChangeOutcome.MaybeBlocked], or as
 * [WaterChangeOutcome.Unreachable] for an app exempt from battery
 * optimisation or a connection that times out instead of being refused. A
 * network Android never validates (a Wi-Fi with no internet, even one that
 * reaches the server) is never usable: requests wait for another.
 */
fun waterRequestConstraints(): Constraints =
    Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()

/** Whether this app can use a network with working internet right now. */
fun hasUsableNetwork(context: Context): Boolean {
    val connectivity = context.getSystemService(ConnectivityManager::class.java) ?: return false
    val network = connectivity.activeNetwork ?: return false
    val capabilities = connectivity.getNetworkCapabilities(network) ?: return false
    return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
        capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
}

/** The app's App info screen, where its battery use (and its background data) is set. */
fun appInfoIntent(context: Context): Intent =
    Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", context.packageName, null))
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

/**
 * What [error], raised while connecting, says about the phone keeping the app
 * offline in the background, or null when it points at the network or the
 * server. A block Android reports, or a socket the phone refused (EPERM), can
 * only be the phone: [WaterChangeOutcome.Blocked]. A failed lookup while the
 * phone is online, for an app not exempt from battery optimisation, may be a
 * phone maker's battery mode that Android does not report, or a server name
 * that does not resolve from here: [WaterChangeOutcome.MaybeBlocked].
 */
private fun blockedOutcome(context: Context, error: Exception): WaterChangeOutcome? {
    val connectivity = context.getSystemService(ConnectivityManager::class.java) ?: return null
    @Suppress("DEPRECATION") // The only call that tells a blocked network from none.
    if (connectivity.activeNetworkInfo?.detailedState == android.net.NetworkInfo.DetailedState.BLOCKED) {
        return WaterChangeOutcome.Blocked
    }
    if (error is SocketException && error.message?.contains("EPERM") == true) return WaterChangeOutcome.Blocked
    if (error !is UnknownHostException || !phoneIsOnline(connectivity)) return null
    val power = context.getSystemService(PowerManager::class.java) ?: return null
    return if (power.isIgnoringBatteryOptimizations(context.packageName)) null else WaterChangeOutcome.MaybeBlocked
}

/** Whether any network has working internet, whatever this app may use. */
private fun phoneIsOnline(connectivity: ConnectivityManager): Boolean {
    @Suppress("DEPRECATION") // The per-app calls hide a default network the app is blocked from.
    return connectivity.allNetworks.any { network ->
        connectivity.getNetworkCapabilities(network)
            ?.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED) == true
    }
}

/** What the phone reported when a change failed, for the log. */
private fun networkSummary(context: Context): String {
    val connectivity = context.getSystemService(ConnectivityManager::class.java)
    val power = context.getSystemService(PowerManager::class.java)
    @Suppress("DEPRECATION")
    val network = connectivity?.activeNetworkInfo?.detailedState
    return "network=$network, phoneOnline=${connectivity?.let { phoneIsOnline(it) }}, " +
        "batteryExempt=${power?.isIgnoringBatteryOptimizations(context.packageName)}, " +
        "powerSave=${power?.isPowerSaveMode}, sdk=${Build.VERSION.SDK_INT}"
}

private const val TAG = "SparkyWater"

/** Absent, null and non-finite all read as unknown. */
private fun JSONObject.optionalNumber(name: String): Double? {
    if (!has(name) || isNull(name)) return null
    val value = optDouble(name, Double.NaN)
    return if (value.isFinite()) value else null
}

private fun toast(context: Context, message: String) {
    Handler(Looper.getMainLooper()).post {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show()
    }
}

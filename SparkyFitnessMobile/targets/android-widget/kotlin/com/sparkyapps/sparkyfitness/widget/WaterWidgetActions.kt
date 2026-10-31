package com.sparkyapps.sparkyfitness.widget

import android.content.Context
import androidx.glance.GlanceId
import androidx.glance.action.ActionParameters
import androidx.glance.appwidget.action.ActionCallback
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.sparkyapps.sparkyfitness.backgroundwater.WaterChangeOutcome
import com.sparkyapps.sparkyfitness.backgroundwater.clearWaterFailureNotice
import com.sparkyapps.sparkyfitness.backgroundwater.hasUsableNetwork
import com.sparkyapps.sparkyfitness.backgroundwater.postWaterChange
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext

/**
 * The water widget's − and + buttons. Glance runs this inside a broadcast,
 * which has only seconds, so it records the tap (the widget shows it at once)
 * and leaves the request to [WaterWidgetWorker]. Glance creates it by its class
 * name, so it stays a public class with no constructor arguments.
 */
class WaterChangeAction : ActionCallback {
    override suspend fun onAction(context: Context, glanceId: GlanceId, parameters: ActionParameters) {
        // A greyed-out − sends 0, so a tap on it does nothing rather than
        // reach the open-the-app action behind it.
        val change = parameters[WaterWidget.CHANGE_KEY] ?: return
        if (change == 0) return
        // With no usable network the request waits for one, and the widget
        // says so rather than looking stuck.
        val waiting = !hasUsableNetwork(context)
        val added = WidgetSnapshotLock.mutex.withLock { WaterWidgetStore.addTapLocked(context, change, waiting) }
        if (added) {
            WaterWidgetStore.enqueueSend(context)
        } else {
            // The launcher can still show buttons the snapshot no longer
            // allows, such as yesterday's figures before the midnight refresh.
            WaterWidget().update(context, glanceId)
        }
    }
}

/**
 * Sends the taps waiting in the snapshot, one day at a time, an ended day's
 * first, in requests of up to 100 drinks, and shows the day's total the
 * server answers. Taps made while a request is out
 * are sent by the next pass of the loop, or by the next worker in the chain,
 * unless that request fails: today's waiting taps are then dropped and the
 * run ends.
 * Not renamed lightly: WorkManager stores the class name of queued work.
 */
class WaterWidgetWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val context = applicationContext
        WidgetSnapshotLock.mutex.withLock { WaterWidgetStore.reclaimSendingLocked(context) }
        while (true) {
            val batch = WidgetSnapshotLock.mutex.withLock { WaterWidgetStore.takePendingLocked(context) }
                ?: return Result.success()
            val outcome = withContext(Dispatchers.IO) { postWaterChange(context, batch.drinks, batch.entryDate) }
            // A drink logged from here answers the tile's last failure, as a
            // drink logged from the shortcut or the tile does.
            if (outcome is WaterChangeOutcome.Changed) clearWaterFailureNotice(context)
            WidgetSnapshotLock.mutex.withLock { WaterWidgetStore.applyOutcomeLocked(context, batch, outcome) }
            // After a failure the next tap or app push sends again: drinks
            // kept for an ended day would otherwise be tried in a loop.
            if (outcome !is WaterChangeOutcome.Changed) return Result.success()
        }
    }
}

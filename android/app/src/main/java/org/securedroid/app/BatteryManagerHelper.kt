package org.securedroid.app

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.getcapacitor.JSObject

class BatteryManagerHelper(private val context: Context) {

    fun getRealBatteryStatus(): JSObject {
        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus = context.registerReceiver(null, filter)

        if (batteryStatus == null) {
            return JSObject().apply {
                put("status", "error")
                put("errorCode", "HARDWARE_UNAVAILABLE")
                put("message", "Android did not provide battery state.")
            }
        }

        val level = batteryStatus.getIntExtra(
            BatteryManager.EXTRA_LEVEL,
            -1
        )

        val scale = batteryStatus.getIntExtra(
            BatteryManager.EXTRA_SCALE,
            -1
        )

        if (level < 0 || scale <= 0) {
            return JSObject().apply {
                put("status", "error")
                put("errorCode", "UNKNOWN_ERROR")
                put("message", "Battery percentage is unavailable.")
            }
        }

        val percentage = (level * 100) / scale

        val status = batteryStatus.getIntExtra(
            BatteryManager.EXTRA_STATUS,
            -1
        )

        val isCharging =
            status == BatteryManager.BATTERY_STATUS_CHARGING ||
            status == BatteryManager.BATTERY_STATUS_FULL

        return JSObject().apply {
            put("status", "ok")
            put("data", JSObject().apply {
                put("percentage", percentage)
                put("isCharging", isCharging)
            })
        }
    }
}

package org.securedroid.app

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import com.getcapacitor.JSObject

class BatteryManagerHelper(private val context: Context) {

    fun getRealBatteryStatus(): JSObject {
        val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus: Intent? = context.registerReceiver(null, ifilter)

        val data = JSObject()

        if (batteryStatus != null) {
            val level: Int = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
            val scale: Int = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
            val pct: Int = if (level != -1 && scale != -1) (level * 100 / scale) else -1
            data.put("percentage", pct)

            val status: Int = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
            val isCharging = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                             status == BatteryManager.BATTERY_STATUS_FULL
            data.put("isCharging", isCharging)
        }

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}

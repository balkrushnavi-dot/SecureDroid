package org.securedroid.app

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import com.getcapacitor.JSObject

class DeviceInfoManager(private val context: Context) {

    fun getRealDeviceInfo(): JSObject {
        val activityManager =
            context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
                ?: return JSObject().apply {
                    put("status", "error")
                    put("errorCode", "UNKNOWN_ERROR")
                    put("message", "ActivityManager is unavailable.")
                }

        val memoryInfo = ActivityManager.MemoryInfo()
        activityManager.getMemoryInfo(memoryInfo)

        val data = JSObject().apply {
            put("manufacturer", Build.MANUFACTURER)
            put("brand", Build.BRAND)
            put("model", Build.MODEL)
            put("device", Build.DEVICE)
            put("androidVersion", Build.VERSION.RELEASE ?: "unknown")
            put("sdkVersion", Build.VERSION.SDK_INT)
            put("totalRamMb", memoryInfo.totalMem / (1024 * 1024))
            put("availableRamMb", memoryInfo.availMem / (1024 * 1024))
        }

        return JSObject().apply {
            put("status", "ok")
            put("data", data)
        }
    }
}

package org.securedroid.app

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import android.os.SystemClock
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class DeviceInfoManager(private val context: Context) {

    fun getRealDeviceInfo(): JSObject {
        val data = JSObject()

        data.put("manufacturer", Build.MANUFACTURER)
        data.put("brand", Build.BRAND)
        data.put("model", Build.MODEL)
        data.put("device", Build.DEVICE)
        data.put("androidVersion", Build.VERSION.RELEASE)
        data.put("sdkVersion", Build.VERSION.SDK_INT)

        val actManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val memoryInfo = ActivityManager.MemoryInfo()
        actManager.getMemoryInfo(memoryInfo)
        
        data.put("totalRamMb", memoryInfo.totalMem / (1024 * 1024))
        data.put("availableRamMb", memoryInfo.availMem / (1024 * 1024))

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}

package org.securedroid.app

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject

class PermissionManagerHelper(private val context: Context) {

    private fun isGranted(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(context, permission) == PackageManager.PERMISSION_GRANTED
    }

    fun getAppPermissionStatus(): JSObject {
        val permissions = JSObject()

        permissions.put("camera", isGranted(Manifest.permission.CAMERA))
        permissions.put("microphone", isGranted(Manifest.permission.RECORD_AUDIO))
        permissions.put("location", isGranted(Manifest.permission.ACCESS_FINE_LOCATION) || isGranted(Manifest.permission.ACCESS_COARSE_LOCATION))
        permissions.put("contacts", isGranted(Manifest.permission.READ_CONTACTS))
        permissions.put("calendar", isGranted(Manifest.permission.READ_CALENDAR))

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.put("notifications", isGranted(Manifest.permission.POST_NOTIFICATIONS))
        } else {
            permissions.put("notifications", true)
        }

        val data = JSObject()
        data.put("permissions", permissions)

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}

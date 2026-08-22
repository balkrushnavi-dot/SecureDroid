package org.securedroid.app

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.getcapacitor.JSObject

class PermissionManagerHelper(private val context: Context) {

    private fun isGranted(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            permission
        ) == PackageManager.PERMISSION_GRANTED
    }

    fun getAppPermissionStatus(): JSObject {
        return try {
            val permissions = JSObject().apply {
                put(
                    "camera",
                    isGranted(Manifest.permission.CAMERA)
                )

                put(
                    "microphone",
                    isGranted(Manifest.permission.RECORD_AUDIO)
                )

                put(
                    "location",
                    isGranted(Manifest.permission.ACCESS_FINE_LOCATION) ||
                    isGranted(Manifest.permission.ACCESS_COARSE_LOCATION)
                )

                put(
                    "contacts",
                    isGranted(Manifest.permission.READ_CONTACTS)
                )

                put(
                    "calendar",
                    isGranted(Manifest.permission.READ_CALENDAR)
                )

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    put(
                        "notifications",
                        isGranted(Manifest.permission.POST_NOTIFICATIONS)
                    )
                } else {
                    put("notifications", true)
                }
            }

            JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put("permissions", permissions)
                })
            }
        } catch (e: Exception) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "UNKNOWN_ERROR")
                put(
                    "message",
                    e.localizedMessage ?: "Unable to inspect permissions."
                )
            }
        }
    }
}

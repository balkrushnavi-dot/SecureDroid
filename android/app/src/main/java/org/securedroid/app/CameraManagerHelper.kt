package org.securedroid.app

import android.content.Context
import android.content.pm.PackageManager
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import com.getcapacitor.JSObject

class CameraManagerHelper(private val context: Context) {

    fun getCameraStatus(): JSObject {
        val packageManager = context.packageManager

        val hasAnyCamera =
            packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)

        val hasFrontCamera =
            packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FRONT)

        val hasFlash =
            packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)

        if (!hasAnyCamera) {
            return JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put("hasCamera", false)
                    put("hasFrontCamera", false)
                    put("hasBackCamera", false)
                    put("hasFlash", false)
                    put("cameraCount", 0)
                })
            }
        }

        val cameraManager =
            context.getSystemService(Context.CAMERA_SERVICE) as? CameraManager
                ?: return JSObject().apply {
                    put("status", "unsupported")
                    put("errorCode", "NOT_SUPPORTED")
                    put("message", "CameraManager is unavailable.")
                }

        return try {
            val cameraIdList = cameraManager.cameraIdList

            var isBackAvailable = false

            for (id in cameraIdList) {
                val characteristics =
                    cameraManager.getCameraCharacteristics(id)

                val facing =
                    characteristics.get(CameraCharacteristics.LENS_FACING)

                if (facing == CameraCharacteristics.LENS_FACING_BACK) {
                    isBackAvailable = true
                }
            }

            JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put("hasCamera", true)
                    put("hasFrontCamera", hasFrontCamera)
                    put("hasBackCamera", isBackAvailable)
                    put("hasFlash", hasFlash)
                    put("cameraCount", cameraIdList.size)
                })
            }
        } catch (e: SecurityException) {
            JSObject().apply {
                put("status", "permission_required")
                put("errorCode", "PERMISSION_DENIED")
                put("message", "Camera access was denied by Android.")
            }
        } catch (e: Exception) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "HARDWARE_UNAVAILABLE")
                put(
                    "message",
                    e.localizedMessage ?: "Camera hardware could not be queried."
                )
            }
        }
    }
}

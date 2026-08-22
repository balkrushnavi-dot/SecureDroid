package org.securedroid.app

import android.content.Context
import android.content.pm.PackageManager
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import com.getcapacitor.JSObject

class CameraManagerHelper(private val context: Context) {
    fun getCameraStatus(): JSObject {
        val packageManager = context.packageManager
        val hasAnyCamera = packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)
        val hasFrontCamera = packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FRONT)
        val hasFlash = packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)

        var cameraCount = 0
        var isBackAvailable = false

        if (hasAnyCamera) {
            try {
                val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
                val cameraIdList = cameraManager.cameraIdList
                cameraCount = cameraIdList.size

                for (id in cameraIdList) {
                    val characteristics = cameraManager.getCameraCharacteristics(id)
                    val facing = characteristics.get(CameraCharacteristics.LENS_FACING)
                    if (facing == CameraCharacteristics.LENS_FACING_BACK) {
                        isBackAvailable = true
                    }
                }
            } catch (e: Exception) {
                // Fallback to basic package manager query if HAL is busy
                isBackAvailable = true
            }
        }

        val data = JSObject()
        data.put("hasCamera", hasAnyCamera)
        data.put("hasFrontCamera", hasFrontCamera)
        data.put("hasBackCamera", isBackAvailable)
        data.put("hasFlash", hasFlash)
        data.put("cameraCount", cameraCount)

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}


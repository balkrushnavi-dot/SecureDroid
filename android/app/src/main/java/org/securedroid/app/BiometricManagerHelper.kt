package org.securedroid.app

import android.app.KeyguardManager
import android.content.Context
import android.content.pm.PackageManager
import com.getcapacitor.JSObject

class BiometricManagerHelper(private val context: Context) {
    fun getBiometricStatus(): JSObject {
        val packageManager = context.packageManager
        val keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

        val hasFingerprint = packageManager.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)
        val hasFace = packageManager.hasSystemFeature(PackageManager.FEATURE_FACE)
        val isDeviceSecure = keyguardManager.isDeviceSecure

        var biometricType = "NONE"
        if (hasFace) biometricType = "FACE"
        else if (hasFingerprint) biometricType = "FINGERPRINT"

        val data = JSObject()
        data.put("isBiometricsAvailable", hasFingerprint || hasFace)
        data.put("biometricType", biometricType)
        data.put("isSecureLockScreenConfigured", isDeviceSecure)

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}

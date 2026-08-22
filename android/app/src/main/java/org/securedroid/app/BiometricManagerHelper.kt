package org.securedroid.app

import android.app.KeyguardManager
import android.content.Context
import android.content.pm.PackageManager
import com.getcapacitor.JSObject

class BiometricManagerHelper(private val context: Context) {

    fun getBiometricStatus(): JSObject {
        return try {
            val packageManager = context.packageManager

            val keyguardManager =
                context.getSystemService(Context.KEYGUARD_SERVICE)
                    as? KeyguardManager
                    ?: return JSObject().apply {
                        put("status", "unsupported")
                        put("errorCode", "NOT_SUPPORTED")
                        put("message", "KeyguardManager is unavailable.")
                    }

            val hasFingerprint =
                packageManager.hasSystemFeature(
                    PackageManager.FEATURE_FINGERPRINT
                )

            val hasFace =
                packageManager.hasSystemFeature(
                    PackageManager.FEATURE_FACE
                )

            val isDeviceSecure =
                keyguardManager.isDeviceSecure

            val biometricType = when {
                hasFace -> "FACE"
                hasFingerprint -> "FINGERPRINT"
                else -> "NONE"
            }

            JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put(
                        "isBiometricsAvailable",
                        hasFingerprint || hasFace
                    )
                    put("biometricType", biometricType)
                    put(
                        "isSecureLockScreenConfigured",
                        isDeviceSecure
                    )
                })
            }
        } catch (e: Exception) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "UNKNOWN_ERROR")
                put(
                    "message",
                    e.localizedMessage ?: "Unable to query biometric state."
                )
            }
        }
    }
}

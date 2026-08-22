package org.securedroid.app

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "SecureDroid")
class SecureDroidPlugin : Plugin() {

    private lateinit var deviceInfoManager: DeviceInfoManager
    private lateinit var batteryManagerHelper: BatteryManagerHelper
    private lateinit var networkManagerHelper: NetworkManagerHelper
    private lateinit var storageManagerHelper: StorageManagerHelper
    private lateinit var sensorManagerHelper: SensorManagerHelper
    private lateinit var biometricManagerHelper: BiometricManagerHelper
    private lateinit var cameraManagerHelper: CameraManagerHelper
    private lateinit var permissionManagerHelper: PermissionManagerHelper
    private lateinit var appManagerHelper: AppManagerHelper

    override fun load() {
        super.load()

        deviceInfoManager = DeviceInfoManager(context)
        batteryManagerHelper = BatteryManagerHelper(context)
        networkManagerHelper = NetworkManagerHelper(context)
        storageManagerHelper = StorageManagerHelper()
        sensorManagerHelper = SensorManagerHelper(context)
        biometricManagerHelper = BiometricManagerHelper(context)
        cameraManagerHelper = CameraManagerHelper(context)
        permissionManagerHelper = PermissionManagerHelper(context)
        appManagerHelper = AppManagerHelper(context)
    }

    private fun errorResult(
        message: String,
        errorCode: String = "UNKNOWN_ERROR"
    ): JSObject {
        return JSObject().apply {
            put("status", "error")
            put("errorCode", errorCode)
            put("message", message)
        }
    }

    @PluginMethod
    fun getDeviceInfo(call: PluginCall) {
        try {
            call.resolve(deviceInfoManager.getRealDeviceInfo())
        } catch (e: SecurityException) {
            call.resolve(errorResult(
                "Device information permission was denied.",
                "PERMISSION_DENIED"
            ))
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to read device information."
            ))
        }
    }

    @PluginMethod
    fun getBatteryStatus(call: PluginCall) {
        try {
            call.resolve(batteryManagerHelper.getRealBatteryStatus())
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to read battery status."
            ))
        }
    }

    @PluginMethod
    fun getNetworkState(call: PluginCall) {
        try {
            call.resolve(networkManagerHelper.getRealNetworkState())
        } catch (e: SecurityException) {
            call.resolve(errorResult(
                "Network state permission was denied.",
                "PERMISSION_DENIED"
            ))
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to read network state."
            ))
        }
    }

    @PluginMethod
    fun getStorageState(call: PluginCall) {
        try {
            call.resolve(storageManagerHelper.getRealStorageState())
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to read storage state."
            ))
        }
    }

    @PluginMethod
    fun getAvailableSensors(call: PluginCall) {
        try {
            call.resolve(sensorManagerHelper.getAvailableSensors())
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to enumerate sensors."
            ))
        }
    }

    @PluginMethod
    fun getBiometricStatus(call: PluginCall) {
        try {
            call.resolve(biometricManagerHelper.getBiometricStatus())
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to read biometric status."
            ))
        }
    }

    @PluginMethod
    fun getCameraStatus(call: PluginCall) {
        try {
            call.resolve(cameraManagerHelper.getCameraStatus())
        } catch (e: SecurityException) {
            call.resolve(errorResult(
                "Camera access was denied.",
                "PERMISSION_DENIED"
            ))
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to query camera hardware."
            ))
        }
    }

    @PluginMethod
    fun getAppPermissions(call: PluginCall) {
        try {
            call.resolve(permissionManagerHelper.getAppPermissionStatus())
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to read application permissions."
            ))
        }
    }

    @PluginMethod
    fun getInstalledApps(call: PluginCall) {
        try {
            call.resolve(appManagerHelper.getInstalledLaunchableApps())
        } catch (e: SecurityException) {
            call.resolve(errorResult(
                "Installed application information is restricted.",
                "ANDROID_RESTRICTION"
            ))
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to enumerate installed applications."
            ))
        }
    }

    @PluginMethod
    fun launchApp(call: PluginCall) {
        val packageName = call.getString("packageName")?.trim()

        if (packageName.isNullOrBlank()) {
            call.resolve(errorResult(
                "Package name is required.",
                "INVALID_ARGUMENT"
            ))
            return
        }

        try {
            call.resolve(appManagerHelper.launchApp(packageName))
        } catch (e: SecurityException) {
            call.resolve(errorResult(
                "Android denied launching this application.",
                "ANDROID_RESTRICTION"
            ))
        } catch (e: Exception) {
            call.resolve(errorResult(
                e.localizedMessage ?: "Unable to launch application."
            ))
        }
    }
}

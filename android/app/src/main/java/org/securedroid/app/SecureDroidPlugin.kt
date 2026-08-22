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

    override fun load() {
        deviceInfoManager = DeviceInfoManager(context)
        batteryManagerHelper = BatteryManagerHelper(context)
        networkManagerHelper = NetworkManagerHelper(context)
        storageManagerHelper = StorageManagerHelper()
        sensorManagerHelper = SensorManagerHelper(context)
        biometricManagerHelper = BiometricManagerHelper(context)
        cameraManagerHelper = CameraManagerHelper(context)
        permissionManagerHelper = PermissionManagerHelper(context)
    }

    @PluginMethod
    fun getDeviceInfo(call: PluginCall) {
        try { call.resolve(deviceInfoManager.getRealDeviceInfo()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getBatteryStatus(call: PluginCall) {
        try { call.resolve(batteryManagerHelper.getRealBatteryStatus()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getNetworkState(call: PluginCall) {
        try { call.resolve(networkManagerHelper.getRealNetworkState()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getStorageState(call: PluginCall) {
        try { call.resolve(storageManagerHelper.getRealStorageState()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getAvailableSensors(call: PluginCall) {
        try { call.resolve(sensorManagerHelper.getAvailableSensors()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getBiometricStatus(call: PluginCall) {
        try { call.resolve(biometricManagerHelper.getBiometricStatus()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getCameraStatus(call: PluginCall) {
        try { call.resolve(cameraManagerHelper.getCameraStatus()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }

    @PluginMethod
    fun getAppPermissions(call: PluginCall) {
        try { call.resolve(permissionManagerHelper.getAppPermissionStatus()) } 
        catch (e: Exception) { call.resolve(JSObject().put("success", false).put("message", e.localizedMessage)) }
    }
}

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

    override fun load() {
        deviceInfoManager = DeviceInfoManager(context)
        batteryManagerHelper = BatteryManagerHelper(context)
        networkManagerHelper = NetworkManagerHelper(context)
        storageManagerHelper = StorageManagerHelper()
    }

    @PluginMethod
    fun getDeviceInfo(call: PluginCall) {
        try {
            val res = deviceInfoManager.getRealDeviceInfo()
            call.resolve(res)
        } catch (e: Exception) {
            val err = JSObject()
            err.put("success", false)
            err.put("message", e.localizedMessage)
            call.resolve(err)
        }
    }

    @PluginMethod
    fun getBatteryStatus(call: PluginCall) {
        try {
            val res = batteryManagerHelper.getRealBatteryStatus()
            call.resolve(res)
        } catch (e: Exception) {
            val err = JSObject()
            err.put("success", false)
            err.put("message", e.localizedMessage)
            call.resolve(err)
        }
    }

    @PluginMethod
    fun getNetworkState(call: PluginCall) {
        try {
            val res = networkManagerHelper.getRealNetworkState()
            call.resolve(res)
        } catch (e: Exception) {
            val err = JSObject()
            err.put("success", false)
            err.put("message", e.localizedMessage)
            call.resolve(err)
        }
    }

    @PluginMethod
    fun getStorageState(call: PluginCall) {
        try {
            val res = storageManagerHelper.getRealStorageState()
            call.resolve(res)
        } catch (e: Exception) {
            val err = JSObject()
            err.put("success", false)
            err.put("message", e.localizedMessage)
            call.resolve(err)
        }
    }
}

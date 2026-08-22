package org.securedroid.app

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class SensorManagerHelper(private val context: Context) {
    fun getAvailableSensors(): JSObject {
        val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val deviceSensors: List<Sensor> = sensorManager.getSensorList(Sensor.TYPE_ALL)

        val activeSensors = JSObject()
        var hasCamera = false // Camera is handled separately via CameraManager, but we prep the flag
        
        deviceSensors.forEach { sensor ->
            when (sensor.type) {
                Sensor.TYPE_ACCELEROMETER -> activeSensors.put("accelerometer", true)
                Sensor.TYPE_GYROSCOPE -> activeSensors.put("gyroscope", true)
                Sensor.TYPE_MAGNETIC_FIELD -> activeSensors.put("magnetometer", true)
                Sensor.TYPE_PROXIMITY -> activeSensors.put("proximity", true)
                Sensor.TYPE_LIGHT -> activeSensors.put("light", true)
            }
        }

        val data = JSObject()
        data.put("availableSensors", activeSensors)

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}

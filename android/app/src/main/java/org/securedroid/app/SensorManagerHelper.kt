package org.securedroid.app

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import com.getcapacitor.JSObject

class SensorManagerHelper(private val context: Context) {

    fun getAvailableSensors(): JSObject {
        val sensorManager =
            context.getSystemService(Context.SENSOR_SERVICE)
                as? SensorManager
                ?: return JSObject().apply {
                    put("status", "unsupported")
                    put("errorCode", "NOT_SUPPORTED")
                    put("message", "SensorManager is unavailable.")
                }

        return try {
            val deviceSensors =
                sensorManager.getSensorList(Sensor.TYPE_ALL)

            val activeSensors = JSObject()

            deviceSensors.forEach { sensor ->
                when (sensor.type) {
                    Sensor.TYPE_ACCELEROMETER ->
                        activeSensors.put("accelerometer", true)

                    Sensor.TYPE_GYROSCOPE ->
                        activeSensors.put("gyroscope", true)

                    Sensor.TYPE_MAGNETIC_FIELD ->
                        activeSensors.put("magnetometer", true)

                    Sensor.TYPE_PROXIMITY ->
                        activeSensors.put("proximity", true)

                    Sensor.TYPE_LIGHT ->
                        activeSensors.put("light", true)
                }
            }

            JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put("availableSensors", activeSensors)
                })
            }
        } catch (e: Exception) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "HARDWARE_UNAVAILABLE")
                put(
                    "message",
                    e.localizedMessage ?: "Unable to enumerate sensors."
                )
            }
        }
    }
}

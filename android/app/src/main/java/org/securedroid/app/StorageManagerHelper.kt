package org.securedroid.app

import android.os.Environment
import android.os.StatFs
import com.getcapacitor.JSObject
import kotlin.math.round

class StorageManagerHelper {

    fun getRealStorageState(): JSObject {
        return try {
            val statFs = StatFs(Environment.getDataDirectory().path)

            val bytesToGb =
                1024.0 * 1024.0 * 1024.0

            val totalGb =
                (statFs.blockCountLong * statFs.blockSizeLong) / bytesToGb

            val availableGb =
                (statFs.availableBlocksLong * statFs.blockSizeLong) / bytesToGb

            val usedGb = totalGb - availableGb

            JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put("totalStorageGb", round(totalGb * 100) / 100)
                    put("availableStorageGb", round(availableGb * 100) / 100)
                    put("usedStorageGb", round(usedGb * 100) / 100)
                })
            }
        } catch (e: Exception) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "UNKNOWN_ERROR")
                put(
                    "message",
                    e.localizedMessage ?: "Unable to read storage state."
                )
            }
        }
    }
}

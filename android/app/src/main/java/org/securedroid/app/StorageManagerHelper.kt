package org.securedroid.app

import android.os.Environment
import android.os.StatFs
import com.getcapacitor.JSObject
import kotlin.math.round

class StorageManagerHelper {
    fun getRealStorageState(): JSObject {
        val statFs = StatFs(Environment.getDataDirectory().path)
        
        // Convert to Gigabytes
        val bytesToGb = 1024.0 * 1024.0 * 1024.0
        val totalGb = (statFs.blockCountLong * statFs.blockSizeLong) / bytesToGb
        val availableGb = (statFs.availableBlocksLong * statFs.blockSizeLong) / bytesToGb
        val usedGb = totalGb - availableGb

        val data = JSObject()
        // Round to 2 decimal places
        data.put("totalStorageGb", round(totalGb * 100) / 100)
        data.put("availableStorageGb", round(availableGb * 100) / 100)
        data.put("usedStorageGb", round(usedGb * 100) / 100)

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}


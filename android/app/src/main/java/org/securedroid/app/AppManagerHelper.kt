package org.securedroid.app

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject

class AppManagerHelper(private val context: Context) {

    fun getInstalledLaunchableApps(): JSObject {
        val packageManager = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }

        val resolveInfos = packageManager.queryIntentActivities(mainIntent, 0)
        val appsArray = JSArray()

        for (resolveInfo in resolveInfos) {
            val pkgName = resolveInfo.activityInfo.packageName
            val appLabel = resolveInfo.loadLabel(packageManager).toString()
            val isSystem = (resolveInfo.activityInfo.applicationInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

            var versionName = "1.0"
            try {
                val pkgInfo = packageManager.getPackageInfo(pkgName, 0)
                versionName = pkgInfo.versionName ?: "1.0"
            } catch (e: Exception) {
                // Ignore fallback
            }

            val appObj = JSObject().apply {
                put("packageName", pkgName)
                put("name", appLabel)
                put("version", versionName)
                put("isSystemApp", isSystem)
                put("networkAccess", "ALLOW")
            }
            appsArray.put(appObj)
        }

        val data = JSObject().apply {
            put("apps", appsArray)
            put("totalCount", appsArray.length())
        }

        val result = JSObject().apply {
            put("success", true)
            put("data", data)
        }
        return result
    }

    fun launchApp(packageName: String): JSObject {
        val packageManager = context.packageManager
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)

        val result = JSObject()
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
            result.put("success", true)
            result.put("message", "App launched successfully.")
        } else {
            result.put("success", false)
            result.put("errorCode", "NOT_SUPPORTED")
            result.put("message", "Unable to find launch intent for $packageName.")
        }
        return result
    }
}


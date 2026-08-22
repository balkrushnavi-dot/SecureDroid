package org.securedroid.app

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
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
            val activityInfo = resolveInfo.activityInfo
                ?: continue

            val pkgName = activityInfo.packageName
            val appLabel = resolveInfo.loadLabel(packageManager).toString()

            val isSystem =
                (activityInfo.applicationInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

            val packageInfo = packageManager.getPackageInfo(pkgName, 0)

            val versionName = packageInfo.versionName ?: "unknown"

            val appObj = JSObject().apply {
                put("packageName", pkgName)
                put("name", appLabel)
                put("version", versionName)
                put("isSystemApp", isSystem)

                // This is application policy data, not an Android network inspection.
                put("networkAccess", "UNKNOWN")
            }

            appsArray.put(appObj)
        }

        val data = JSObject().apply {
            put("apps", appsArray)
            put("totalCount", appsArray.length())
        }

        return JSObject().apply {
            put("status", "ok")
            put("data", data)
        }
    }

    fun launchApp(packageName: String): JSObject {
        val packageManager = context.packageManager
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)

        if (launchIntent == null) {
            return JSObject().apply {
                put("status", "unsupported")
                put("errorCode", "NOT_SUPPORTED")
                put("message", "No launch intent exists for $packageName.")
            }
        }

        return try {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)

            JSObject().apply {
                put("status", "ok")

                put("data", JSObject().apply {
                    put("packageName", packageName)
                    put("launched", true)
                })
            }
        } catch (e: SecurityException) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "ANDROID_RESTRICTION")
                put(
                    "message",
                    e.localizedMessage ?: "Android denied application launch."
                )
            }
        }
    }
}

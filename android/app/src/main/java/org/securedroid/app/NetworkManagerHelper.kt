package org.securedroid.app

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.getcapacitor.JSObject

class NetworkManagerHelper(private val context: Context) {

    fun getRealNetworkState(): JSObject {
        val connectivityManager =
            context.getSystemService(Context.CONNECTIVITY_SERVICE)
                as? ConnectivityManager
                ?: return JSObject().apply {
                    put("status", "error")
                    put("errorCode", "UNKNOWN_ERROR")
                    put("message", "ConnectivityManager is unavailable.")
                }

        return try {
            val network = connectivityManager.activeNetwork
            val capabilities =
                connectivityManager.getNetworkCapabilities(network)

            var type = "NONE"
            var isVpn = false

            if (capabilities != null) {
                when {
                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ->
                        type = "WIFI"

                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ->
                        type = "CELLULAR"

                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) ->
                        type = "ETHERNET"
                }

                if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                    isVpn = true

                    if (type == "NONE") {
                        type = "VPN"
                    }
                }
            }

            val isConnected =
                capabilities != null &&
                capabilities.hasCapability(
                    NetworkCapabilities.NET_CAPABILITY_INTERNET
                ) &&
                capabilities.hasCapability(
                    NetworkCapabilities.NET_CAPABILITY_VALIDATED
                )

            JSObject().apply {
                put("status", "ok")
                put("data", JSObject().apply {
                    put("isConnected", isConnected)
                    put("networkType", type)
                    put("isVpnActive", isVpn)
                })
            }
        } catch (e: SecurityException) {
            JSObject().apply {
                put("status", "permission_required")
                put("errorCode", "PERMISSION_DENIED")
                put("message", "Android denied network state access.")
            }
        } catch (e: Exception) {
            JSObject().apply {
                put("status", "error")
                put("errorCode", "UNKNOWN_ERROR")
                put(
                    "message",
                    e.localizedMessage ?: "Unable to determine network state."
                )
            }
        }
    }
}

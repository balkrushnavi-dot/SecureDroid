package org.securedroid.app

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.getcapacitor.JSObject

class NetworkManagerHelper(private val context: Context) {
    fun getRealNetworkState(): JSObject {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(network)

        val isConnected = capabilities != null &&
            capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
            capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)

        var type = "NONE"
        var isVpn = false

        if (capabilities != null) {
            if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) type = "WIFI"
            else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) type = "CELLULAR"
            else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) type = "ETHERNET"
            
            if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                isVpn = true
                if (type == "NONE") type = "VPN"
            }
        }

        val data = JSObject()
        data.put("isConnected", isConnected)
        data.put("networkType", type)
        data.put("isVpnActive", isVpn)

        val result = JSObject()
        result.put("success", true)
        result.put("data", data)
        return result
    }
}

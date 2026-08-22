import React, { useEffect, useState } from 'react';
import { SecureDroidNative } from '../services/native/SecureDroidNative';

interface AdvancedDiagnosticsScreenProps {
  profile: any;
  capabilities: any[];
  onBack: () => void;
  onNavigate: (screen: string) => void;
  isLight: boolean;
}

export function AdvancedDiagnosticsScreen({
  profile,
  capabilities,
  onBack,
  onNavigate,
  isLight
}: AdvancedDiagnosticsScreenProps) {
  const [nativeData, setNativeData] = useState({
    sensors: null as any,
    camera: null as any,
    permissions: null as any,
    storage: null as any,
    network: null as any,
    loading: true
  });

  useEffect(() => {
    async function fetchAllDiagnostics() {
      try {
        const [sensors, camera, permissions, storage, network] = await Promise.all([
          SecureDroidNative.getAvailableSensors().catch(() => null),
          SecureDroidNative.getCameraStatus().catch(() => null),
          SecureDroidNative.getAppPermissions().catch(() => null),
          SecureDroidNative.getStorageState().catch(() => null),
          SecureDroidNative.getNetworkState().catch(() => null),
        ]);

        setNativeData({
          sensors: sensors?.data || null,
          camera: camera?.data || null,
          permissions: permissions?.data || null,
          storage: storage?.data || null,
          network: network?.data || null,
          loading: false
        });
      } catch (e) {
        console.warn("Could not fetch native diagnostics");
        setNativeData(prev => ({ ...prev, loading: false }));
      }
    }

    fetchAllDiagnostics();
  }, []);

  return (
    <div className={`p-4 space-y-6 ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 border-zinc-700/40">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${isLight ? 'bg-zinc-200 hover:bg-zinc-300' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            ←
          </button>
          <h1 className="text-xl font-bold">Advanced Diagnostics Console</h1>
        </div>
      </div>

      {/* Loading state */}
      {nativeData.loading ? (
        <div className="text-center py-10 text-zinc-400">Loading native hardware diagnostics...</div>
      ) : (
        <div className="space-y-4">
          {/* Storage Section */}
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className="font-semibold text-lg mb-2">Real Device Storage</h2>
            <p>Total Storage: {nativeData.storage?.totalStorageGb ?? profile.totalStorageGb} GB</p>
            <p>Available Space: {nativeData.storage?.availableStorageGb ?? 'Unknown'} GB</p>
            <p>Used Storage: {nativeData.storage?.usedStorageGb ?? 'Unknown'} GB</p>
          </div>

          {/* Network Section */}
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className="font-semibold text-lg mb-2">Network & Connectivity</h2>
            <p>Connection Type: {nativeData.network?.networkType ?? 'Unknown'}</p>
            <p>Internet Active: {nativeData.network?.isConnected ? 'Yes' : 'No'}</p>
            <p>VPN Active: {nativeData.network?.isVpnActive ? 'Yes' : 'No'}</p>
          </div>

          {/* Camera Section */}
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
            <h2 className="font-semibold text-lg mb-2">Camera Hardware</h2>
            <p>Camera Available: {nativeData.camera?.hasCamera ? 'Yes' : 'No'}</p>
            <p>Front Camera: {nativeData.camera?.hasFrontCamera ? 'Yes' : 'No'}</p>
            <p>Back Camera: {nativeData.camera?.hasBackCamera ? 'Yes' : 'No'}</p>
            <p>Flash Available: {nativeData.camera?.hasFlash ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { registerPlugin } from '@capacitor/core';
import { NativeResult, RealDeviceInfo, RealBatteryStatus, RealNetworkState, RealStorageState } from '../../types/native';

export interface SecureDroidPlugin {
  getDeviceInfo(): Promise<NativeResult<RealDeviceInfo>>;
  getBatteryStatus(): Promise<NativeResult<RealBatteryStatus>>;
  getNetworkState(): Promise<NativeResult<RealNetworkState>>;
  getStorageState(): Promise<NativeResult<RealStorageState>>;
}

export const SecureDroidNative = registerPlugin<SecureDroidPlugin>('SecureDroid');

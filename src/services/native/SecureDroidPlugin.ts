import { registerPlugin } from '@capacitor/core';
import { NativeResult, RealDeviceInfo, RealBatteryStatus } from '../../types/native';

export interface SecureDroidPlugin {
  getDeviceInfo(): Promise<NativeResult<RealDeviceInfo>>;
  getBatteryStatus(): Promise<NativeResult<RealBatteryStatus>>;
}

export const SecureDroidNative = registerPlugin<SecureDroidPlugin>('SecureDroid');


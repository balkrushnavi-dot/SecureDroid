import { registerPlugin } from '@capacitor/core';
import {
  NativeResult,
  RealDeviceInfo,
  RealBatteryStatus,
  RealNetworkState,
  RealStorageState
} from '../../types/native';

export interface SecureDroidPlugin {
  getDeviceInfo(): Promise<NativeResult<RealDeviceInfo>>;
  getBatteryStatus(): Promise<NativeResult<RealBatteryStatus>>;
  getNetworkState(): Promise<NativeResult<RealNetworkState>>;
  getStorageState(): Promise<NativeResult<RealStorageState>>;
  getAvailableSensors(): Promise<NativeResult<any>>;
  getBiometricStatus(): Promise<NativeResult<any>>;
  getCameraStatus(): Promise<NativeResult<any>>;
  getAppPermissions(): Promise<NativeResult<any>>;
  getInstalledApps(): Promise<NativeResult<{ apps: any[]; totalCount: number }>>;
  launchApp(options: { packageName: string }): Promise<NativeResult<void>>;
}

export const SecureDroidNative = registerPlugin<SecureDroidPlugin>('SecureDroid');

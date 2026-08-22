import { Capacitor, registerPlugin } from '@capacitor/core';
import {
  NativeResult,
  RealDeviceInfo,
  RealBatteryStatus,
  RealNetworkState,
  RealStorageState,
  InstalledAppsData,
  LaunchAppData,
} from '../../types/native';

export interface SecureDroidPlugin {
  getDeviceInfo(): Promise<NativeResult<RealDeviceInfo>>;
  getBatteryStatus(): Promise<NativeResult<RealBatteryStatus>>;
  getNetworkState(): Promise<NativeResult<RealNetworkState>>;
  getStorageState(): Promise<NativeResult<RealStorageState>>;
  getAvailableSensors(): Promise<NativeResult<Record<string, boolean>>>;
  getBiometricStatus(): Promise<NativeResult<any>>;
  getCameraStatus(): Promise<NativeResult<any>>;
  getAppPermissions(): Promise<NativeResult<any>>;
  getInstalledApps(): Promise<NativeResult<InstalledAppsData>>;
  launchApp(options: { packageName: string }): Promise<NativeResult<LaunchAppData>>;
}

const SecureDroidPlugin = registerPlugin<SecureDroidPlugin>('SecureDroid');

const unsupportedResult = <T>(message: string): NativeResult<T> => ({
  status: 'unsupported',
  errorCode: 'NATIVE_UNAVAILABLE',
  message,
});

const errorResult = <T>(error: unknown): NativeResult<T> => ({
  status: 'error',
  errorCode: 'UNKNOWN_ERROR',
  message:
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown native bridge error.',
});

function nativeOnly<T>(
  operation: () => Promise<NativeResult<T>>
): Promise<NativeResult<T>> {
  if (!Capacitor.isNativePlatform()) {
    return Promise.resolve(
      unsupportedResult<T>(
        'SecureDroid native functionality is unavailable in web mode. Use VmSimulator for web development.'
      )
    );
  }

  return operation().catch(errorResult<T>);
}

export const SecureDroidNative = {
  getDeviceInfo(): Promise<NativeResult<RealDeviceInfo>> {
    return nativeOnly(() => SecureDroidPlugin.getDeviceInfo());
  },

  getBatteryStatus(): Promise<NativeResult<RealBatteryStatus>> {
    return nativeOnly(() => SecureDroidPlugin.getBatteryStatus());
  },

  getNetworkState(): Promise<NativeResult<RealNetworkState>> {
    return nativeOnly(() => SecureDroidPlugin.getNetworkState());
  },

  getStorageState(): Promise<NativeResult<RealStorageState>> {
    return nativeOnly(() => SecureDroidPlugin.getStorageState());
  },

  getAvailableSensors(): Promise<NativeResult<Record<string, boolean>>> {
    return nativeOnly(() => SecureDroidPlugin.getAvailableSensors());
  },

  getBiometricStatus(): Promise<NativeResult<any>> {
    return nativeOnly(() => SecureDroidPlugin.getBiometricStatus());
  },

  getCameraStatus(): Promise<NativeResult<any>> {
    return nativeOnly(() => SecureDroidPlugin.getCameraStatus());
  },

  getAppPermissions(): Promise<NativeResult<any>> {
    return nativeOnly(() => SecureDroidPlugin.getAppPermissions());
  },

  getInstalledApps(): Promise<NativeResult<InstalledAppsData>> {
    return nativeOnly(() => SecureDroidPlugin.getInstalledApps());
  },

  launchApp(
    options: { packageName: string }
  ): Promise<NativeResult<LaunchAppData>> {
    if (!options?.packageName?.trim()) {
      return Promise.resolve({
        status: 'error',
        errorCode: 'INVALID_ARGUMENT',
        message: 'Package name is required.',
      });
    }

    return nativeOnly(() =>
      SecureDroidPlugin.launchApp({
        packageName: options.packageName.trim(),
      })
    );
  },
};

export type NativeStatus =
  | 'ok'
  | 'unsupported'
  | 'permission_required'
  | 'error';

export type NativeErrorCode =
  | 'PERMISSION_DENIED'
  | 'NOT_SUPPORTED'
  | 'HARDWARE_UNAVAILABLE'
  | 'ANDROID_RESTRICTION'
  | 'INVALID_ARGUMENT'
  | 'NATIVE_UNAVAILABLE'
  | 'UNKNOWN_ERROR';

export interface NativeResult<T> {
  status: NativeStatus;
  data?: T;
  errorCode?: NativeErrorCode;
  message?: string;
}

export interface RealDeviceInfo {
  manufacturer: string;
  brand: string;
  model: string;
  device: string;
  androidVersion: string;
  sdkVersion: number;
  totalRamMb: number;
  availableRamMb: number;
}

export interface RealBatteryStatus {
  percentage: number;
  isCharging: boolean;
}

export interface RealNetworkState {
  isConnected: boolean;
  networkType: 'WIFI' | 'CELLULAR' | 'ETHERNET' | 'VPN' | 'NONE';
  isVpnActive: boolean;
}

export interface RealStorageState {
  totalStorageGb: number;
  availableStorageGb: number;
  usedStorageGb: number;
}

export interface InstalledApp {
  packageName: string;
  name: string;
  version: string;
  isSystemApp: boolean;
  networkAccess: string;
}

export interface InstalledAppsData {
  apps: InstalledApp[];
  totalCount: number;
}

export interface LaunchAppData {
  packageName: string;
  launched: boolean;
}

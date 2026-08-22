export type NativeErrorCode =
  | 'PERMISSION_DENIED'
  | 'NOT_SUPPORTED'
  | 'HARDWARE_UNAVAILABLE'
  | 'ANDROID_RESTRICTION'
  | 'UNKNOWN_ERROR';

export interface NativeResult<T> {
  success: boolean;
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

export type NativeErrorCode =
  | 'PERMISSION_DENIED'
  | 'NOT_SUPPORTED'
  | 'HARDWARE_UNAVAILABLE'
  | 'AUTHENTICATION_FAILED'
  | 'USER_CANCELLED'
  | 'ANDROID_RESTRICTION'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_ARGUMENT'
  | 'UNKNOWN_ERROR';

export interface NativeResult<T> {
  success: boolean;
  data?: T;
  errorCode?: NativeErrorCode;
  message?: string;
  recoverable?: boolean;
}

export interface RealDeviceInfo {
  manufacturer: string;
  brand: string;
  model: string;
  device: string;
  product: string;
  androidVersion: string;
  sdkVersion: number;
  securityPatchLevel: string;
  cpuArchitecture: string;
  supportedABIs: string[];
  totalRamMb: number;
  availableRamMb: number;
  uptimeMs: number;
}

export interface RealBatteryStatus {
  percentage: number;
  isCharging: boolean;
  chargingSource: 'AC' | 'USB' | 'WIRELESS' | 'BATTERY' | 'UNKNOWN';
  health: 'GOOD' | 'OVERHEAT' | 'DEAD' | 'OVER_VOLTAGE' | 'UNSPECIFIED_FAILURE' | 'COLD' | 'UNKNOWN';
  temperatureCelsius: number;
  voltageMilliVolts: number;
}

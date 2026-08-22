import React, { useState, useMemo, useEffect } from 'react';

import { SystemStatusBar } from './components/SystemStatusBar';
import { SystemNavigationBar } from './components/navigation/SystemNavigationBar';
import { VolumePanel } from './components/system/VolumePanel';
import { PowerMenu } from './components/system/PowerMenu';
import { QuickSettingsShade } from './components/QuickSettingsShade';
import { LockScreenView } from './components/LockScreenView';
import { SystemHomeScreen } from './components/SystemHomeScreen';
import { AppDrawerScreen } from './components/launcher/AppDrawerScreen';
import { RecentAppsScreen } from './components/launcher/RecentAppsScreen';
import { GlobalSearchScreen } from './components/launcher/GlobalSearchScreen';

// Native Bridge
import { SecureDroidNative } from './services/native/SecureDroidNative';
import { RealDeviceInfo } from './types/native';

// Settings Screens
import {
  SettingsHomeScreen,
  SettingsNetworkScreen,
  SettingsConnectedScreen,
  SettingsBatteryScreen,
  SettingsStorageScreen,
  SettingsWallpaperScreen,
  SettingsAboutScreen,
} from './components/settings/SettingsScreens';

import { SettingsNavigationScreen } from './components/settings/SettingsNavigationScreen';
import { InstallAppScreen } from './components/settings/InstallAppScreen';

// Security & Privacy Screens
import { SecurityCenterScreen } from './components/SecurityCenterScreen';
import { PrivacyCenterScreen } from './components/PrivacyCenterScreen';
import { PermissionManagerScreen } from './components/PermissionManagerScreen';
import { SecureEnvironmentScreen } from './components/SecureEnvironmentScreen';
import { SystemUpdatesScreen } from './components/SystemUpdatesScreen';
import { AppSandboxScreen } from './components/AppSandboxScreen';
import { AppDetailScreen } from './components/AppDetailScreen';

// Advanced Diagnostics
import { AdvancedDiagnosticsScreen } from './components/AdvancedDiagnosticsScreen';

// Security Feature Screens
import { AdvancedProtectionScreen } from './components/security/AdvancedProtectionScreen';
import { ExploitProtectionScreen } from './components/security/ExploitProtectionScreen';
import { DeviceSecurityStateScreen } from './components/security/DeviceSecurityStateScreen';
import { AuthenticationDuressScreen } from './components/security/AuthenticationDuressScreen';
import { EmergencyProtectionScreen } from './components/security/EmergencyProtectionScreen';
import { TheftProtectionScreen } from './components/security/TheftProtectionScreen';
import { AppVerificationScreen } from './components/security/AppVerificationScreen';
import { SecureDroidStoreScreen } from './components/security/SecureDroidStoreScreen';
import { BrowserWebSecurityScreen } from './components/security/BrowserWebSecurityScreen';
import { CompleteSensorPrivacyScreen } from './components/security/CompleteSensorPrivacyScreen';
import { CertificatesPasskeysScreen } from './components/security/CertificatesPasskeysScreen';
import { BackupRestoreScreen } from './components/security/BackupRestoreScreen';
import { SecurityAuditLogScreen } from './components/security/SecurityAuditLogScreen';
import { ThreatModelCenterScreen } from './components/security/ThreatModelCenterScreen';

import {
  DeveloperDebugSecurityScreen,
  SecurityPostureProfilesScreen,
} from './components/security/SystemIntegrityScreens';

// Data
import { DEVICE_PROFILES } from './data/deviceProfiles';
import { getCapabilitiesForProfile } from './data/capabilitiesData';
import { calculateSecurityScore } from './utils/securityCalculator';

import {
  INITIAL_PRIVACY_STATE,
  SAMPLE_SANDBOX_APPS,
  GUEST_IMAGES,
  SAMPLE_SNAPSHOTS,
  INITIAL_SYSTEM_NOTIFICATIONS,
} from './data/osArchitectureData';

// Types
import {
  CapabilityItem,
  DeviceProfile,
  SecurityScoreFormula,
  PrivacyCenterState,
  AppSandboxInfo,
  NetworkAccessLevel,
  SystemScreen,
  VmSnapshot,
  VmStorageInfo,
  AccentColor,
  ThemeMode,
  NavigationMode,
  SystemNotification,
} from './types/securedroid';

export default function App() {
  /*
   * --------------------------------------------------------------------------
   * Navigation
   * --------------------------------------------------------------------------
   */

  const [currentScreen, setCurrentScreen] =
    useState<SystemScreen>('homescreen');

  const [screenHistory, setScreenHistory] = useState<SystemScreen[]>([
    'homescreen',
  ]);

  const [selectedAppPackage, setSelectedAppPackage] =
    useState<string | null>(null);

  /*
   * --------------------------------------------------------------------------
   * Device Profile
   * --------------------------------------------------------------------------
   */

  const [currentProfile, setCurrentProfile] =
    useState<DeviceProfile>(DEVICE_PROFILES[0]);

  /*
   * --------------------------------------------------------------------------
   * Native Hardware State
   * --------------------------------------------------------------------------
   */

  const [realDeviceInfo, setRealDeviceInfo] =
    useState<RealDeviceInfo | null>(null);

  const [batteryLevel, setBatteryLevel] = useState<number>(84);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  /*
   * --------------------------------------------------------------------------
   * Native data loader
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadNativeData() {
      try {
        const battery = await SecureDroidNative.getBatteryStatus().catch(
          () => null
        );

        if (
          !cancelled &&
          battery &&
          battery.success &&
          battery.data
        ) {
          setBatteryLevel(battery.data.percentage);
          setIsCharging(battery.data.isCharging);
        }

        const device = await SecureDroidNative.getDeviceInfo().catch(
          () => null
        );

        if (
          !cancelled &&
          device &&
          device.success &&
          device.data
        ) {
          setRealDeviceInfo(device.data);

          setCurrentProfile((prev) => ({
            ...prev,
            manufacturer: device.data!.manufacturer,
            model: device.data!.model,
            androidVersion: `Android ${device.data!.androidVersion} (API ${device.data!.sdkVersion})`,
            totalRamGb: Math.max(
              1,
              Math.round(device.data!.totalRamMb / 1024)
            ),
          }));
        }
      } catch (error) {
        console.warn(
          'Native bridge check skipped safely.',
          error
        );
      }
    }

    loadNativeData();

    const interval = window.setInterval(
      loadNativeData,
      30000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  /*
   * --------------------------------------------------------------------------
   * Device lock / overlays
   * --------------------------------------------------------------------------
   */

  const [isDeviceLocked, setIsDeviceLocked] =
    useState<boolean>(false);

  const [isLockdownModeActive, setIsLockdownModeActive] =
    useState<boolean>(false);

  const [isShadeOpen, setIsShadeOpen] =
    useState<boolean>(false);

  const [isVolumePanelOpen, setIsVolumePanelOpen] =
    useState<boolean>(false);

  const [isPowerMenuOpen, setIsPowerMenuOpen] =
    useState<boolean>(false);

  /*
   * --------------------------------------------------------------------------
   * Navigation mode
   * --------------------------------------------------------------------------
   */

  const [navigationMode, setNavigationMode] =
    useState<NavigationMode>('3-button');

  /*
   * --------------------------------------------------------------------------
   * PWA installation
   * --------------------------------------------------------------------------
   */

  const [deferredPrompt, setDeferredPrompt] =
    useState<any>(null);

  const [isStandalone, setIsStandalone] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      setNavigationMode('native_mobile');
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      deferredPrompt.prompt();

      const choiceResult =
        await deferredPrompt.userChoice;

      if (choiceResult?.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.warn(
        'PWA installation prompt failed.',
        error
      );
    }
  };

  /*
   * --------------------------------------------------------------------------
   * Browser history / Android back
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.history
    ) {
      window.history.replaceState(
        { screen: 'homescreen' },
        '',
        window.location.href
      );
    }

    const handlePopState = () => {
      if (isShadeOpen) {
        setIsShadeOpen(false);
        return;
      }

      if (isVolumePanelOpen) {
        setIsVolumePanelOpen(false);
        return;
      }

      if (isPowerMenuOpen) {
        setIsPowerMenuOpen(false);
        return;
      }

      setScreenHistory((prev) => {
        if (prev.length > 1) {
          const nextHistory = [...prev];
          nextHistory.pop();

          const targetScreen =
            nextHistory[nextHistory.length - 1];

          setCurrentScreen(targetScreen);

          return nextHistory;
        }

        setCurrentScreen('homescreen');

        return ['homescreen'];
      });
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, [
    isShadeOpen,
    isVolumePanelOpen,
    isPowerMenuOpen,
  ]);

  /*
   * --------------------------------------------------------------------------
   * Edge swipe back
   * --------------------------------------------------------------------------
   */

  const [touchStartX, setTouchStartX] =
    useState<number | null>(null);

  const [touchStartY, setTouchStartY] =
    useState<number | null>(null);

  const handleTouchStart = (
    event: React.TouchEvent
  ) => {
    if (event.touches.length !== 1) {
      return;
    }

    setTouchStartX(
      event.touches[0].clientX
    );

    setTouchStartY(
      event.touches[0].clientY
    );
  };

  const handleTouchEnd = (
    event: React.TouchEvent
  ) => {
    if (
      touchStartX === null ||
      touchStartY === null
    ) {
      return;
    }

    const touchEndX =
      event.changedTouches[0]?.clientX ?? touchStartX;

    const touchEndY =
      event.changedTouches[0]?.clientY ?? touchStartY;

    const deltaX =
      touchEndX - touchStartX;

    const deltaY =
      Math.abs(touchEndY - touchStartY);

    if (
      touchStartX < 40 &&
      deltaX > 70 &&
      deltaY < 80
    ) {
      handleBack();
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  /*
   * --------------------------------------------------------------------------
   * Audio state
   * --------------------------------------------------------------------------
   */

  const [mediaVolume, setMediaVolume] =
    useState<number>(70);

  const [ringVolume, setRingVolume] =
    useState<number>(85);

  const [alarmVolume, setAlarmVolume] =
    useState<number>(90);

  const [isDnd, setIsDnd] =
    useState<boolean>(false);

  /*
   * --------------------------------------------------------------------------
   * Theme
   * --------------------------------------------------------------------------
   */

  const [themeMode, setThemeMode] =
    useState<ThemeMode>('system');

  const [systemPrefersDark, setSystemPrefersDark] =
    useState<boolean>(() => {
      if (
        typeof window !== 'undefined' &&
        window.matchMedia
      ) {
        return window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
      }

      return true;
    });

  const [accentColor, setAccentColor] =
    useState<AccentColor>('slate');

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia
    ) {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

    const handleThemeChange = (
      event: MediaQueryListEvent
    ) => {
      setSystemPrefersDark(event.matches);
    };

    setSystemPrefersDark(mediaQuery.matches);

    mediaQuery.addEventListener(
      'change',
      handleThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleThemeChange
      );
    };
  }, []);

  const isDarkMode =
    themeMode === 'system'
      ? systemPrefersDark
      : themeMode === 'dark';

  const isLight = !isDarkMode;

  /*
   * --------------------------------------------------------------------------
   * Notifications / privacy / apps / networking
   * --------------------------------------------------------------------------
   */

  const [notifications, setNotifications] =
    useState<SystemNotification[]>(
      INITIAL_SYSTEM_NOTIFICATIONS
    );

  const [privacyState, setPrivacyState] =
    useState<PrivacyCenterState>(
      INITIAL_PRIVACY_STATE
    );

  const [apps, setApps] =
    useState<AppSandboxInfo[]>(
      SAMPLE_SANDBOX_APPS
    );

  const [isInternetOff, setIsInternetOff] =
    useState<boolean>(false);

  const [isVpnOnlyActive, setIsVpnOnlyActive] =
    useState<boolean>(true);

  const [snapshots, setSnapshots] =
    useState<VmSnapshot[]>(
      SAMPLE_SNAPSHOTS
    );

  /*
   * --------------------------------------------------------------------------
   * VM storage
   * --------------------------------------------------------------------------
   */

  const vmStorage: VmStorageInfo = useMemo(
    () => ({
      usedGb: 54.2,
      maximumGb: currentProfile.totalStorageGb,
      hostFreeSpaceGb:
        currentProfile.totalStorageGb - 54.2,
      safetyReserveGb: 20,
      safeGrowthGb:
        currentProfile.totalStorageGb - 54.2 - 20,
      sparseAllocationActive: true,
    }),
    [currentProfile.totalStorageGb]
  );

  /*
   * --------------------------------------------------------------------------
   * System clock
   * --------------------------------------------------------------------------
   */

  const [timeString, setTimeString] =
    useState<string>('14:32');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTimeString(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();

    const interval = window.setInterval(
      updateTime,
      20000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
   * --------------------------------------------------------------------------
   * Calculated security state
   * --------------------------------------------------------------------------
   */

  const capabilities = useMemo<CapabilityItem[]>(
    () => getCapabilitiesForProfile(currentProfile),
    [currentProfile]
  );

  const securityScore =
    useMemo<SecurityScoreFormula>(
      () => calculateSecurityScore(currentProfile),
      [currentProfile]
    );

  /*
   * --------------------------------------------------------------------------
   * Navigation helpers
   * --------------------------------------------------------------------------
   */

  const navigateTo = (
    screen: SystemScreen
  ) => {
    if (
      typeof window !== 'undefined' &&
      window.history
    ) {
      window.history.pushState(
        { screen },
        '',
        window.location.href
      );
    }

    setScreenHistory((prev) => [
      ...prev,
      screen,
    ]);

    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen('homescreen');
        return ['homescreen'];
      }

      const nextHistory = [...prev];

      nextHistory.pop();

      const previousScreen =
        nextHistory[nextHistory.length - 1];

      setCurrentScreen(previousScreen);

      return nextHistory;
    });
  };

  const handleHome = () => {
    if (
      typeof window !== 'undefined' &&
      window.history
    ) {
      window.history.pushState(
        { screen: 'homescreen' },
        '',
        window.location.href
      );
    }

    setScreenHistory(['homescreen']);
    setCurrentScreen('homescreen');
  };

  const handleRecents = () => {
    if (currentScreen === 'recents') {
      handleBack();
      return;
    }

    navigateTo('recents');
  };

  const handleSearch = () => {
    navigateTo('search');
  };

  /*
   * --------------------------------------------------------------------------
   * App selection
   * --------------------------------------------------------------------------
   */

  const handleOpenAppDetail = (
    packageName: string
  ) => {
    setSelectedAppPackage(packageName);
    navigateTo('settings_app_detail');
  };

  /*
   * --------------------------------------------------------------------------
   * Privacy kill switches
   * --------------------------------------------------------------------------
   */

  const handleToggleCameraKillswitch = () => {
    setPrivacyState((previous) => {
      const nextState =
        !previous.cameraKillSwitch;

      const newLog = {
        id: `acc-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString(),
        appName:
          'Camera HAL Controller',
        packageName:
          'android.hardware.camera',
        uid: 1047,
        sensor: 'CAMERA' as const,
        actionTaken: nextState
          ? ('BLOCKED' as const)
          : ('AUTHORIZED' as const),
        details: nextState
          ? 'Global camera killswitch active.'
          : 'Camera hardware feed active.',
        isDemo: false,
      };

      return {
        ...previous,
        cameraKillSwitch: nextState,
        activeCameraApps: nextState
          ? []
          : previous.activeCameraApps,
        accessLog: [
          newLog,
          ...previous.accessLog,
        ].slice(0, 40),
      };
    });
  };

  const handleToggleMicKillswitch = () => {
    setPrivacyState((previous) => {
      const nextState =
        !previous.micKillSwitch;

      const newLog = {
        id: `acc-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString(),
        appName:
          'AudioFlinger Subsystem',
        packageName:
          'android.hardware.audio',
        uid: 1041,
        sensor: 'MIC' as const,
        actionTaken: nextState
          ? ('BLOCKED' as const)
          : ('AUTHORIZED' as const),
        details: nextState
          ? 'Microphone muted with zero-bytes.'
          : 'Microphone audio feed restored.',
        isDemo: false,
      };

      return {
        ...previous,
        micKillSwitch: nextState,
        activeMicApps: nextState
          ? []
          : previous.activeMicApps,
        accessLog: [
          newLog,
          ...previous.accessLog,
        ].slice(0, 40),
      };
    });
  };

  const handleToggleSensorKillswitch = () => {
    setPrivacyState((previous) => {
      const nextState =
        !previous.sensorKillSwitch;

      const newLog = {
        id: `acc-${Date.now()}`,
        timestamp:
          new Date().toLocaleTimeString(),
        appName:
          'SensorManager HAL',
        packageName:
          'android.hardware.sensors',
        uid: 1000,
        sensor: 'SENSORS' as const,
        actionTaken: nextState
          ? ('BLOCKED' as const)
          : ('AUTHORIZED' as const),
        details: nextState
          ? 'Motion/gyro sensors disconnected.'
          : 'Sensors polling resumed.',
        isDemo: false,
      };

      return {
        ...previous,
        sensorKillSwitch: nextState,
        accessLog: [
          newLog,
          ...previous.accessLog,
        ].slice(0, 40),
      };
    });
  };

  const handleToggleClipboardAlerts = () => {
    setPrivacyState((previous) => ({
      ...previous,
      clipboardAccessAlerts:
        !previous.clipboardAccessAlerts,
    }));
  };

  /*
   * --------------------------------------------------------------------------
   * Lockdown
   * --------------------------------------------------------------------------
   */

  const handleToggleLockdownMode = () => {
    setIsLockdownModeActive((previous) => {
      const nextState = !previous;

      if (nextState) {
        setIsDeviceLocked(true);
      }

      return nextState;
    });
  };

  /*
   * --------------------------------------------------------------------------
   * App network / permissions
   * --------------------------------------------------------------------------
   */

  const handleUpdateAppNetwork = (
    packageName: string,
    level: NetworkAccessLevel
  ) => {
    setApps((previous) =>
      previous.map((app) =>
        app.packageName === packageName
          ? {
              ...app,
              networkAccess: level,
            }
          : app
      )
    );
  };

  const handleUpdateAppPermission = (
    packageName: string,
    permKey: string,
    granted: boolean
  ) => {
    setApps((previous) =>
      previous.map((app) => {
        if (
          app.packageName !== packageName
        ) {
          return app;
        }

        const currentPermissions =
          app.permissions || {};

        return {
          ...app,
          permissions: {
            ...currentPermissions,
            [permKey]: granted
              ? 'GRANTED'
              : 'DENIED',
          },
        };
      })
    );
  };

  /*
   * --------------------------------------------------------------------------
   * Snapshots
   * --------------------------------------------------------------------------
   */

  const handleCreateSnapshot = (
    name: string
  ) => {
    const newSnapshot: VmSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      createdAt:
        new Date().toLocaleString(),
      guestVersion:
        '2.0.4-signed',
      sizeMb: 140,
      sha256:
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'READY',
      note:
        'User point-in-time snapshot',
    };

    setSnapshots((previous) => [
      newSnapshot,
      ...previous,
    ]);
  };

  const handleRestoreSnapshot = (
    id: string
  ) => {
    window.alert(
      `Restoring snapshot ${id}. Memory state rolling back to verified baseline.`
    );
  };

  const handleDeleteSnapshot = (
    id: string
  ) => {
    setSnapshots((previous) =>
      previous.filter(
        (snapshot) =>
          snapshot.id !== id
      )
    );
  };

  /*
   * --------------------------------------------------------------------------
   * Notifications
   * --------------------------------------------------------------------------
   */

  const handleDismissNotification = (
    id: string
  ) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          notification.id !== id
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((previous) =>
      previous.filter(
        (notification) =>
          !notification.isDismissible
      )
    );
  };

  /*
   * --------------------------------------------------------------------------
   * Selected application
   * --------------------------------------------------------------------------
   */

  const activeSelectedApp =
    apps.find(
      (app) =>
        app.packageName ===
        selectedAppPackage
    ) || apps[0];

  /*
   * --------------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------------
   */

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isLight
          ? 'bg-zinc-50 text-zinc-900'
          : 'bg-zinc-950 text-zinc-100'
      }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Android status bar                                                 */}
      {/* ------------------------------------------------------------------ */}

      <SystemStatusBar
        privacyState={privacyState}
        onOpenQuickSettings={() =>
          setIsShadeOpen(true)
        }
        onOpenPrivacyCenter={() =>
          navigateTo('privacy_center')
        }
        isLockdownActive={
          isLockdownModeActive
        }
        timeString={timeString}
        isLight={isLight}
        batteryLevel={batteryLevel}
        isVpnActive={isVpnOnlyActive}
        isDndActive={isDnd}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Lock screen                                                        */}
      {/* ------------------------------------------------------------------ */}

      <LockScreenView
        isLocked={isDeviceLocked}
        onUnlock={() =>
          setIsDeviceLocked(false)
        }
        isLockdownActive={
          isLockdownModeActive
        }
        onToggleLockdown={
          handleToggleLockdownMode
        }
        hostStatus={
          securityScore.hostStatus
        }
        qualitativeTier={
          securityScore.qualitativeTier
        }
        timeString={timeString}
        isLight={isLight}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Quick settings                                                     */}
      {/* ------------------------------------------------------------------ */}

      <QuickSettingsShade
        isOpen={isShadeOpen}
        onClose={() =>
          setIsShadeOpen(false)
        }
        privacyState={privacyState}
        onToggleCameraKillswitch={
          handleToggleCameraKillswitch
        }
        onToggleMicKillswitch={
          handleToggleMicKillswitch
        }
        onToggleSensorKillswitch={
          handleToggleSensorKillswitch
        }
        isVpnOnlyActive={
          isVpnOnlyActive
        }
        onToggleVpnOnly={() =>
          setIsVpnOnlyActive(
            (previous) => !previous
          )
        }
        isInternetOff={isInternetOff}
        onToggleInternet={() =>
          setIsInternetOff(
            (previous) => !previous
          )
        }
        isLockdownActive={
          isLockdownModeActive
        }
        onToggleLockdown={
          handleToggleLockdownMode
        }
        onNavigateTab={(screen) => {
          navigateTo(screen);
          setIsShadeOpen(false);
        }}
        notifications={notifications}
        onDismissNotification={
          handleDismissNotification
        }
        onClearAllNotifications={
          handleClearAllNotifications
        }
        themeMode={themeMode}
        onCycleThemeMode={() => {
          if (themeMode === 'system') {
            setThemeMode('dark');
          } else if (
            themeMode === 'dark'
          ) {
            setThemeMode('light');
          } else {
            setThemeMode('system');
          }
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => {
          setThemeMode(
            isDarkMode ? 'light' : 'dark'
          );
        }}
        isDnd={isDnd}
        onToggleDnd={() =>
          setIsDnd(
            (previous) => !previous
          )
        }
        isLight={isLight}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Volume panel                                                       */}
      {/* ------------------------------------------------------------------ */}

      <VolumePanel
        isOpen={isVolumePanelOpen}
        onClose={() =>
          setIsVolumePanelOpen(false)
        }
        isLight={isLight}
        mediaVolume={mediaVolume}
        setMediaVolume={setMediaVolume}
        ringVolume={ringVolume}
        setRingVolume={setRingVolume}
        alarmVolume={alarmVolume}
        setAlarmVolume={setAlarmVolume}
        isDnd={isDnd}
        setIsDnd={setIsDnd}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Power menu                                                         */}
      {/* ------------------------------------------------------------------ */}

      <PowerMenu
        isOpen={isPowerMenuOpen}
        onClose={() =>
          setIsPowerMenuOpen(false)
        }
        onLockdown={
          handleToggleLockdownMode
        }
        onRestart={() =>
          window.alert(
            'Soft rebooting SecureDroid OS...'
          )
        }
        onPowerOff={() =>
          window.alert(
            'Powering off SecureDroid OS...'
          )
        }
        isLight={isLight}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Main viewport                                                      */}
      {/* ------------------------------------------------------------------ */}

      <main
        className={`flex-1 max-w-4xl w-full mx-auto overflow-y-auto ${
          navigationMode === 'native_mobile'
            ? 'pb-6'
            : 'pb-16'
        }`}
      >
        {/* ================================================================ */}
        {/* Level 1 - Launcher                                               */}
        {/* ================================================================ */}

        {currentScreen === 'homescreen' && (
          <SystemHomeScreen
            profile={currentProfile}
            hostStatus={
              securityScore.hostStatus
            }
            qualitativeTier={
              securityScore.qualitativeTier
            }
            privacyState={privacyState}
            onNavigateTab={navigateTo}
            onOpenAppDrawer={() =>
              navigateTo('app_drawer')
            }
            onOpenSearch={handleSearch}
            isLight={isLight}
          />
        )}

        {currentScreen === 'app_drawer' && (
          <AppDrawerScreen
            apps={apps}
            onOpenApp={
              handleOpenAppDetail
            }
            onOpenAppDetail={
              handleOpenAppDetail
            }
            onNavigate={navigateTo}
            isLight={isLight}
          />
        )}

        {currentScreen === 'recents' && (
          <RecentAppsScreen
            apps={apps}
            onSelectApp={navigateTo}
            onClearAll={() =>
              navigateTo('homescreen')
            }
            onOpenAppDetail={
              handleOpenAppDetail
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'search' && (
          <GlobalSearchScreen
            onClose={handleBack}
            onNavigate={navigateTo}
            onOpenAppDetail={
              handleOpenAppDetail
            }
            apps={apps}
            isLight={isLight}
          />
        )}

        {/* ================================================================ */}
        {/* Android Settings                                                 */}
        {/* ================================================================ */}

        {currentScreen === 'settings' && (
          <SettingsHomeScreen
            onNavigate={navigateTo}
            profile={currentProfile}
            hostStatus={
              securityScore.hostStatus
            }
            qualitativeTier={
              securityScore.qualitativeTier
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_network' && (
          <SettingsNetworkScreen
            onBack={handleBack}
            isInternetOff={isInternetOff}
            onToggleInternet={() =>
              setIsInternetOff(
                (previous) => !previous
              )
            }
            isVpnOnlyActive={
              isVpnOnlyActive
            }
            onToggleVpnOnly={() =>
              setIsVpnOnlyActive(
                (previous) => !previous
              )
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_connected' && (
          <SettingsConnectedScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_navigation' && (
          <SettingsNavigationScreen
            onBack={handleBack}
            navigationMode={
              navigationMode
            }
            onSelectNavigationMode={
              setNavigationMode
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_install_app' && (
          <InstallAppScreen
            onBack={handleBack}
            deferredPrompt={
              deferredPrompt
            }
            onInstallPwa={
              handleInstallPwa
            }
            isStandalone={
              isStandalone
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_apps' && (
          <AppSandboxScreen
            apps={apps}
            onUpdateAppNetwork={
              handleUpdateAppNetwork
            }
            onUpdateAppPermission={(
              packageName,
              permission,
              state
            ) =>
              handleUpdateAppPermission(
                packageName,
                permission,
                state === 'GRANTED'
              )
            }
          />
        )}

        {currentScreen === 'settings_app_detail' && (
          activeSelectedApp && (
            <AppDetailScreen
              app={activeSelectedApp}
              onBack={handleBack}
              onUpdateNetworkAccess={
                handleUpdateAppNetwork
              }
              onToggleHardenedMalloc={() => {}}
              onToggleStrictIoctl={() => {}}
              onTogglePermission={(
                packageName,
                permission
              ) => {
                const currentGranted =
                  (
                    activeSelectedApp.permissions as any
                  )?.[
                    permission.toLowerCase()
                  ] === 'GRANTED';

                handleUpdateAppPermission(
                  packageName,
                  permission.toLowerCase(),
                  !currentGranted
                );
              }}
              isLight={isLight}
            />
          )
        )}

        {currentScreen === 'settings_battery' && (
          <SettingsBatteryScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_storage' && (
          <SettingsStorageScreen
            onBack={handleBack}
            profile={currentProfile}
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_wallpaper' && (
          <SettingsWallpaperScreen
            onBack={handleBack}
            accent={accentColor}
            setAccent={setAccentColor}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            isLight={isLight}
          />
        )}

        {currentScreen === 'settings_sound' && (
          <div className="p-4">
            <VolumePanel
              isOpen={true}
              onClose={handleBack}
              isLight={isLight}
              mediaVolume={mediaVolume}
              setMediaVolume={
                setMediaVolume
              }
              ringVolume={ringVolume}
              setRingVolume={
                setRingVolume
              }
              alarmVolume={alarmVolume}
              setAlarmVolume={
                setAlarmVolume
              }
              isDnd={isDnd}
              setIsDnd={setIsDnd}
            />
          </div>
        )}

        {currentScreen === 'settings_about' && (
          <SettingsAboutScreen
            onBack={handleBack}
            onOpenDiagnostics={() =>
              navigateTo(
                'advanced_diagnostics'
              )
            }
            profile={currentProfile}
            isLight={isLight}
          />
        )}

        {/* ================================================================ */}
        {/* Level 2 - Security & Privacy                                     */}
        {/* ================================================================ */}

        {currentScreen === 'security_center' && (
          <SecurityCenterScreen
            onBack={handleBack}
            onNavigate={navigateTo}
            hostStatus={
              securityScore.hostStatus
            }
            qualitativeTier={
              securityScore.qualitativeTier
            }
            profile={currentProfile}
            isLight={isLight}
          />
        )}

        {currentScreen === 'privacy_center' && (
          <PrivacyCenterScreen
            privacyState={privacyState}
            onToggleCameraKillswitch={
              handleToggleCameraKillswitch
            }
            onToggleMicKillswitch={
              handleToggleMicKillswitch
            }
            onToggleSensorKillswitch={
              handleToggleSensorKillswitch
            }
            onToggleClipboardAlerts={
              handleToggleClipboardAlerts
            }
            sensorLogs={
              privacyState.accessLog
            }
            onNavigate={navigateTo}
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'permission_manager' && (
          <PermissionManagerScreen
            apps={apps}
            onBack={handleBack}
            onUpdateAppPermission={(
              packageName,
              permission,
              value
            ) =>
              handleUpdateAppPermission(
                packageName,
                permission.toLowerCase(),
                value
              )
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'secure_environment' && (
          <SecureEnvironmentScreen
            profile={currentProfile}
            vmStorage={vmStorage}
            guestImages={GUEST_IMAGES}
            snapshots={snapshots}
            onCreateSnapshot={
              handleCreateSnapshot
            }
            onRestoreSnapshot={
              handleRestoreSnapshot
            }
            onDeleteSnapshot={
              handleDeleteSnapshot
            }
            onNavigate={navigateTo}
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'system_updates' && (
          <SystemUpdatesScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'app_sandbox' && (
          <AppSandboxScreen
            apps={apps}
            onUpdateAppNetwork={
              handleUpdateAppNetwork
            }
            onUpdateAppPermission={(
              packageName,
              permission,
              state
            ) =>
              handleUpdateAppPermission(
                packageName,
                permission,
                state === 'GRANTED'
              )
            }
          />
        )}

        {/* ================================================================ */}
        {/* Security Feature Pack                                            */}
        {/* ================================================================ */}

        {currentScreen === 'advanced_protection' && (
          <AdvancedProtectionScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'exploit_protection' && (
          <ExploitProtectionScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'device_security_state' && (
          <DeviceSecurityStateScreen
            onBack={handleBack}
            onTriggerLockdown={
              handleToggleLockdownMode
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'authentication_duress' && (
          <AuthenticationDuressScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'emergency_protection' && (
          <EmergencyProtectionScreen
            onBack={handleBack}
            onLockdown={
              handleToggleLockdownMode
            }
            isLight={isLight}
          />
        )}

        {currentScreen === 'theft_protection' && (
          <TheftProtectionScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'app_verification' && (
          <AppVerificationScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'securedroid_store' && (
          <SecureDroidStoreScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'browser_web_security' && (
          <BrowserWebSecurityScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'complete_sensor_privacy' && (
          <CompleteSensorPrivacyScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'certificates_passkeys' && (
          <CertificatesPasskeysScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'backup_restore' && (
          <BackupRestoreScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'security_audit_log' && (
          <SecurityAuditLogScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'threat_model_center' && (
          <ThreatModelCenterScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'developer_debug_security' && (
          <DeveloperDebugSecurityScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {currentScreen === 'security_posture_profiles' && (
          <SecurityPostureProfilesScreen
            onBack={handleBack}
            isLight={isLight}
          />
        )}

        {/* ================================================================ */}
        {/* Level 3 - Advanced Diagnostics                                   */}
        {/* ================================================================ */}

        {currentScreen === 'advanced_diagnostics' && (
          <AdvancedDiagnosticsScreen
            profile={currentProfile}
            capabilities={capabilities}
            onBack={handleBack}
            onNavigate={navigateTo}
            isLight={isLight}
          />
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Android navigation bar                                             */}
      {/* ------------------------------------------------------------------ */}

      <SystemNavigationBar
        onBack={handleBack}
        onHome={handleHome}
        onRecents={handleRecents}
        onSearch={handleSearch}
        onOpenVolume={() =>
          setIsVolumePanelOpen(true)
        }
        onOpenPower={() =>
          setIsPowerMenuOpen(true)
        }
        currentScreen={currentScreen}
        navigationMode={navigationMode}
        isLight={isLight}
      />
    </div>
  );
}

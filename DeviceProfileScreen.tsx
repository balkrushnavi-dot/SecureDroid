import React from 'react';
import { DeviceProfile, SecurityScoreFormula } from '../types/securedroid';
import { DEVICE_PROFILES } from '../data/deviceProfiles';
import {
  Smartphone,
  Cpu,
  HardDrive,
  Shield,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DeviceProfileScreenProps {
  currentProfile: DeviceProfile;
  setProfile: (profile: DeviceProfile) => void;
  securityScore: SecurityScoreFormula;
}

export function DeviceProfileScreen({
  currentProfile,
  setProfile,
  securityScore,
}: DeviceProfileScreenProps) {
  // Reference Device (Pixel 8)
  const referenceDevice = DEVICE_PROFILES.find((p) => p.isReferenceDevice) || DEVICE_PROFILES[1];

  return (
    <div id="device-profile-screen-container" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              HARDWARE & ARCHITECTURE DIAGNOSTICS
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Device Profile</h2>
            <p className="text-xs text-slate-400">
              Live hardware introspection for {currentProfile.name}
            </p>
          </div>

          {/* Device Switcher for Diagnostic Simulation */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Active Target:</span>
            <select
              id="active-target-device-select"
              value={currentProfile.id}
              onChange={(e) => {
                const target = DEVICE_PROFILES.find((p) => p.id === e.target.value);
                if (target) setProfile(target);
              }}
              className="bg-slate-950 text-slate-200 border border-slate-700 text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              {DEVICE_PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.isReferenceDevice ? '(Reference)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Device Hardware Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-slate-500 font-mono text-[10px] uppercase">DEVICE IDENTITY</span>
          <div className="text-sm font-bold text-white">{currentProfile.manufacturer} • {currentProfile.model}</div>
          <p className="text-slate-400 text-[11px] font-mono">{currentProfile.name}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-slate-500 font-mono text-[10px] uppercase">SOC & CPU MICROARCHITECTURE</span>
          <div className="text-sm font-bold text-slate-200">{currentProfile.chipset}</div>
          <p className="text-slate-400 text-[11px] font-mono">ABI: {currentProfile.arch}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-slate-500 font-mono text-[10px] uppercase">OS & KERNEL VERSION</span>
          <div className="text-sm font-bold text-slate-200">{currentProfile.androidVersion}</div>
          <p className="text-slate-400 text-[11px] font-mono truncate">{currentProfile.kernelVersion}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-slate-500 font-mono text-[10px] uppercase">MEMORY (RAM)</span>
          <div className="text-sm font-bold text-slate-200">{currentProfile.totalRamGb} GB LPDDR4X / LPDDR5</div>
          <p className="text-slate-400 text-[11px]">Safe allocation floor: 2.0 GB minimum</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-slate-500 font-mono text-[10px] uppercase">HOST STORAGE HEADROOM</span>
          <div className="text-sm font-bold text-slate-200">
            {currentProfile.availableStorageGb.toFixed(1)} GB Free / {currentProfile.totalStorageGb} GB Total
          </div>
          <p className="text-emerald-400 text-[11px]">
            Safety reserve: 20 GB enforced (Headroom: {(Math.max(0, currentProfile.availableStorageGb - 20)).toFixed(1)} GB)
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5 shadow-sm">
          <span className="text-slate-500 font-mono text-[10px] uppercase">KEYMINT SECURITY LEVEL</span>
          <div className="text-sm font-bold text-slate-200">
            {currentProfile.keyMintSecurityLevel === 'HARDWARE_TEE' ? 'Qualcomm SoC TEE (QSEE)' : currentProfile.keyMintSecurityLevel}
          </div>
          <p className="text-slate-400 text-[11px]">Master encryption keys are hardware-bound</p>
        </div>
      </div>

      {/* Side-by-Side Comparison: Current Device vs Reference Device (Pixel 8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              CAPABILITY BENCHMARK
            </div>
            <h3 className="text-lg font-bold text-white">
              Current Device vs Reference Device
            </h3>
          </div>

          <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono rounded-lg">
            Reference device capabilities NEVER alter current device scores.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-3 px-3">Capability Vector</th>
                <th className="py-3 px-3 bg-slate-950/40 text-slate-200">
                  Current Target ({currentProfile.model})
                </th>
                <th className="py-3 px-3 text-indigo-300">
                  Reference Device (Pixel 8 / Titan M2)
                </th>
                <th className="py-3 px-3">Architectural Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {/* Row 1: Protected VM */}
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Protected VM (pKVM)</td>
                <td className="py-3 px-3 bg-slate-950/40">
                  {currentProfile.protectedVmSupported ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> SUPPORTED</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> UNAVAILABLE</span>
                  )}
                </td>
                <td className="py-3 px-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SUPPORTED (EL2)
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                  Pixel 8 configures ARM EL2 pKVM hypervisor at boot; stock POCO stock kernel disables it.
                </td>
              </tr>

              {/* Row 2: AVF Framework */}
              <tr>
                <td className="py-3 px-3 font-semibold text-white">AVF APEX Framework</td>
                <td className="py-3 px-3 bg-slate-950/40">
                  {currentProfile.avfPackagePresent ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> INSTALLED</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> NOT INCLUDED</span>
                  )}
                </td>
                <td className="py-3 px-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> COM.ANDROID.VIRT
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                  Google GKI builds bundle AVF by default; Xiaomi omits the virtualization APEX.
                </td>
              </tr>

              {/* Row 3: KeyMint Tier */}
              <tr>
                <td className="py-3 px-3 font-semibold text-white">KeyMint Hardware Tier</td>
                <td className="py-3 px-3 bg-slate-950/40">
                  <span className="text-sky-400">{currentProfile.keyMintSecurityLevel}</span>
                </td>
                <td className="py-3 px-3 text-indigo-400">
                  HARDWARE_STRONGBOX
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                  Pixel 8 uses discrete Titan M2 chip; POCO uses integrated Qualcomm Snapdragon TEE.
                </td>
              </tr>

              {/* Row 4: Verified Boot */}
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Verified Boot (AVB 2.0)</td>
                <td className="py-3 px-3 bg-slate-950/40">
                  <span className={currentProfile.verifiedBootState === 'GREEN' ? 'text-emerald-400' : 'text-amber-400'}>
                    {currentProfile.verifiedBootState}
                  </span>
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  GREEN
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                  Both enforce cryptographic bootloader image signature verification on stock firmware.
                </td>
              </tr>

              {/* Row 5: SELinux */}
              <tr>
                <td className="py-3 px-3 font-semibold text-white">SELinux Policy</td>
                <td className="py-3 px-3 bg-slate-950/40">
                  <span className={currentProfile.selinuxMode === 'ENFORCING' ? 'text-emerald-400' : 'text-rose-400'}>
                    {currentProfile.selinuxMode}
                  </span>
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  ENFORCING
                </td>
                <td className="py-3 px-3 text-slate-400 font-sans text-[11px]">
                  Mandatory Access Control active on both devices.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

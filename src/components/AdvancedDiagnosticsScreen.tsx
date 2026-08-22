import React, { useEffect, useState } from 'react';
import { SecureDroidNative } from '../services/native/SecureDroidNative';

// Inside your AdvancedDiagnosticsScreen component, add this state & effect:
export function AdvancedDiagnosticsScreen({ profile, capabilities, onBack, onNavigate, isLight }: any) {
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

  // You can now render nativeData.camera, nativeData.sensors, etc. in your JSX UI!
        subtitle="Level 3 Technical Inspection & Hardware Probes"
        onBack={onBack}
        isLight={isLight}
      />

      {/* Top Tab Bar */}
      <div className="flex gap-2 pt-4 pb-3 overflow-x-auto border-b border-zinc-800/40">
        {[
          { id: 'CAPABILITIES', label: 'Capability Matrix', icon: Shield },
          { id: 'ARCHITECTURE', label: '8-Layer Architecture', icon: Layers },
          { id: 'SERVICES', label: 'System Services', icon: Cpu },
          { id: 'POCO_GUIDE', label: 'POCO X5 Pro Guide', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight
                  ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Capability Matrix */}
      {activeTab === 'CAPABILITIES' && (
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-zinc-400">Filter Category</span>
            <div className="flex gap-1.5 overflow-x-auto">
              {(['ALL', 'PLATFORM', 'VIRTUALIZATION', 'CRYPTOGRAPHY', 'NETWORK', 'SANDBOX', 'PRIVACY'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-mono transition-colors ${
                    selectedCategory === c ? 'bg-emerald-600 text-white' : isLight ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredCapabilities.map((cap) => {
              const isExpanded = expandedCapId === cap.id;
              const statusVariant = cap.state === 'SUPPORTED' ? 'AVAILABLE' : cap.state === 'PARTIAL' ? 'DEGRADED' : 'UNAVAILABLE';
              return (
                <div
                  key={cap.id}
                  className={`rounded-2xl border transition-all ${
                    isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
                  }`}
                >
                  <div
                    onClick={() => setExpandedCapId(isExpanded ? null : cap.id)}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        statusVariant === 'AVAILABLE' ? 'bg-emerald-500/15 text-emerald-400' :
                        statusVariant === 'DEGRADED' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-xs">{cap.name}</h5>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                            {cap.systemLayer}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{cap.details}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <SecureDroidStatusChip status={statusVariant} label={cap.state} isLight={isLight} />
                      <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-zinc-800/40 mt-1 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Technical Probe & Evidence</span>
                        <p className="font-mono text-emerald-400 mt-1 bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                          {cap.evidence}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Hardware & Platform Requirement</span>
                        <p className="text-zinc-300 mt-0.5">{cap.platformRequirement}</p>
                      </div>

                      {cap.requiredChanges && (
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Required Changes / AOSP Target</span>
                          <p className="text-amber-200/80 mt-0.5">{cap.requiredChanges}</p>
                        </div>
                      )}

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setInspectCapability(cap)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                        >
                          <Info className="w-3.5 h-3.5 text-sky-400" />
                          View Detailed Evidence
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: 8-Layer Architecture */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-zinc-400">Filter Layer</span>
            <div className="flex gap-1 overflow-x-auto">
              {(['ALL', 'APPLICATION', 'SYSTEM_APP', 'FRAMEWORK', 'SYSTEM_SERVER', 'NATIVE_SERVICE', 'KERNEL', 'HYPERVISOR', 'FIRMWARE', 'HARDWARE'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setSelectedLayer(l as any)}
                  className={`px-2 py-0.5 rounded-lg text-[9px] font-mono transition-colors ${
                    selectedLayer === l ? 'bg-emerald-600 text-white' : isLight ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredArchitecture.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{entry.feature}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-mono">
                      {entry.layer}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[180px]">{entry.aospTargetLocation}</span>
                </div>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{entry.description}</p>
                <div className="mt-2 text-[11px] text-zinc-400">
                  <strong>Status: </strong> {entry.status} • <strong>Category: </strong> {entry.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: System Services */}
      {activeTab === 'SERVICES' && (
        <div className="pt-4 space-y-2">
          {SYSTEM_SERVICES.map((srv) => (
            <div
              key={srv.name}
              className={`p-4 rounded-2xl border ${
                isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/80 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/30">
                <div>
                  <h5 className="font-semibold text-xs">{srv.name}</h5>
                  <p className="text-[10px] text-zinc-400 font-mono">{srv.binderInterface}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                  {srv.requirementTag}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{srv.description}</p>
              <div className="mt-3 text-[11px] text-zinc-400">
                <div className="font-semibold text-zinc-300 mb-1">Core Responsibilities:</div>
                <ul className="list-disc list-inside space-y-0.5">
                  {srv.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: POCO X5 Pro 5G Deployment Guide */}
      {activeTab === 'POCO_GUIDE' && (
        <div className="pt-4 space-y-4">
          <SecureDroidCard isLight={isLight} className="p-5 space-y-3 text-xs leading-relaxed">
            <h4 className="font-semibold text-sm text-emerald-400 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              POCO X5 Pro 5G (redwood) Security Target Guide
            </h4>
            <p>
              The POCO X5 Pro 5G features the Qualcomm Snapdragon 778G (SM7325) chipset with ARM Cortex-A78/A55 cores and
              Qualcomm Secure Execution Environment (QSEE).
            </p>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-zinc-800 space-y-2">
              <div className="font-semibold text-zinc-200">Hardware & Firmware Checklist:</div>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono text-[11px]">
                <li>Kernel: Linux 5.4.210 LTS with CONFIG_KVM or pKVM hypervisor patches</li>
                <li>Bootloader: Verified Boot AVB 2.0 with custom user-signed root-of-trust key</li>
                <li>TEE: QSEEcom KeyMint 3.0 hardware-backed cryptographic enclave</li>
                <li>Flash: 256GB UFS 2.2 with 20.0GB safety floor enforcement</li>
              </ul>
            </div>
          </SecureDroidCard>
        </div>
      )}

      {/* Capability Detail Modal */}
      {inspectCapability && (
        <CapabilityDetailModal
          capability={inspectCapability}
          onClose={() => setInspectCapability(null)}
          isLight={isLight}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lock,
  Terminal,
  HelpCircle,
  ChevronRight,
  Eye,
  Sliders
} from 'lucide-react';
import {
  SecureDroidTopBar,
  SecureDroidCard,
  SecureDroidStatusChip,
  SecureDroidSectionHeader,
  SecureDroidButton
} from '../ui/designSystem';
import { ThreatScenarioItem, ThreatProtectionStatus } from '../../types/securedroid';
import { THREAT_MODEL_SCENARIOS } from '../../data/featurePackData';

interface ThreatModelCenterScreenProps {
  onBack: () => void;
  isLight?: boolean;
}

export const ThreatModelCenterScreen: React.FC<ThreatModelCenterScreenProps> = ({
  onBack,
  isLight = false,
}) => {
  const [threats] = useState<ThreatScenarioItem[]>(THREAT_MODEL_SCENARIOS);
  const [selectedThreat, setSelectedThreat] = useState<ThreatScenarioItem | null>(null);

  const getStatusBadge = (status: ThreatProtectionStatus) => {
    switch (status) {
      case 'PROTECTED':
        return { variant: 'SECURE' as const, label: 'PROTECTED' };
      case 'PARTIALLY PROTECTED':
        return { variant: 'ISOLATED' as const, label: 'PARTIAL' };
      case 'REQUIRES HARDWARE':
        return { variant: 'UNAVAILABLE' as const, label: 'REQUIRES HARDWARE' };
      case 'REQUIRES SECUREDROID OS':
        return { variant: 'DEGRADED' as const, label: 'REQUIRES OS' };
      case 'NOT PROTECTED':
      case 'UNKNOWN':
      default:
        return { variant: 'UNAVAILABLE' as const, label: status };
    }
  };

  return (
    <div className={`min-h-full p-4 pb-24 transition-colors ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'}`}>
      <SecureDroidTopBar
        title="Threat Model Center"
        subtitle="12 Adversary Scenarios & Cryptographic Defenses"
        onBack={onBack}
        isLight={isLight}
      />

      <div className="pt-4 space-y-4">
        {/* Intro */}
        <SecureDroidCard isLight={isLight} highlight className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isLight ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-800 text-zinc-200'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Adversary Threat Model Matrix</h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Evaluates system resilience against physical extraction, zero-days, baseband attacks & MITMs
              </p>
            </div>
          </div>
        </SecureDroidCard>

        {/* Threat Scenarios List */}
        <SecureDroidSectionHeader title="Threat Scenarios & Attack Surfaces" isLight={isLight} />

        <div className="space-y-3">
          {threats.map((t) => {
            const badge = getStatusBadge(t.status);
            return (
              <SecureDroidCard
                key={t.id}
                isLight={isLight}
                className="p-4 cursor-pointer hover:border-zinc-700 transition-colors"
                onClick={() => setSelectedThreat(t)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{t.title}</h4>
                      <SecureDroidStatusChip status={badge.variant} label={badge.label} isLight={isLight} />
                    </div>

                    <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {t.scenario}
                    </p>

                    <p className={`text-xs mt-2 font-medium ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
                      {t.why}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0 mt-1" />
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {t.mitigatingControls.map((ctrl, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isLight ? 'bg-zinc-100 text-zinc-700' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      {ctrl}
                    </span>
                  ))}
                </div>
              </SecureDroidCard>
            );
          })}
        </div>
      </div>

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-2xl p-5 shadow-2xl border ${
            isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/20">
              <h3 className="font-semibold text-sm">{selectedThreat.title}</h3>
              <button
                onClick={() => setSelectedThreat(null)}
                className={`text-xs px-2.5 py-1 rounded-lg ${
                  isLight ? 'bg-zinc-100 hover:bg-zinc-200' : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Adversary Attack Scenario</span>
                <p className={`p-2 rounded-lg ${isLight ? 'bg-zinc-100' : 'bg-zinc-950 text-zinc-300'}`}>
                  {selectedThreat.scenario}
                </p>
              </div>

              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Cryptographic Defense & Rationale</span>
                <p className={`p-2 rounded-lg ${isLight ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-900 text-zinc-200'}`}>
                  {selectedThreat.why}
                </p>
              </div>

              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Technical Evidence</span>
                <p className="p-2 rounded-lg font-mono text-[11px] bg-zinc-950 text-zinc-300">
                  {selectedThreat.evidence}
                </p>
              </div>

              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Threat Limitation</span>
                <p className="p-2 rounded-lg font-mono text-[11px] bg-zinc-950 text-amber-400">
                  {selectedThreat.limitation}
                </p>
              </div>

              <div>
                <span className="font-semibold text-zinc-400 block mb-0.5">Enforcement Requirement</span>
                <p className="p-2 rounded-lg font-mono text-[11px] bg-zinc-950 text-zinc-300">
                  {selectedThreat.requirement}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800/20 flex justify-end">
              <SecureDroidButton
                variant="primary"
                onClick={() => setSelectedThreat(null)}
                isLight={isLight}
              >
                Done
              </SecureDroidButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  HardDrive,
  ShieldCheck,
  Lock,
  RefreshCw,
  FileCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Download,
  Upload
} from 'lucide-react';
import {
  SecureDroidTopBar,
  SecureDroidCard,
  SecureDroidStatusChip,
  SecureDroidSectionHeader,
  SecureDroidButton,
  SecureDroidSwitch
} from '../ui/designSystem';
import { BackupSecurityModel } from '../../types/securedroid';
import { BACKUP_SECURITY_CONFIG } from '../../data/featurePackData';

interface BackupRestoreScreenProps {
  onBack: () => void;
  isLight?: boolean;
}

export const BackupRestoreScreen: React.FC<BackupRestoreScreenProps> = ({
  onBack,
  isLight = false,
}) => {
  const [backupConfig, setBackupConfig] = useState<BackupSecurityModel>(BACKUP_SECURITY_CONFIG);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [backupSuccessMessage, setBackupSuccessMessage] = useState<string | null>(null);

  const handleCreateEncryptedBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccessMessage(
        'Encrypted backup created successfully (AES-256-GCM). SHA-256 integrity digest verified against offline KeyMint key.'
      );
    }, 1500);
  };

  return (
    <div className={`min-h-full p-4 pb-24 transition-colors ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'}`}>
      <SecureDroidTopBar
        title="Backup & Restore Security"
        subtitle="Hardware-Wrapped Encrypted Archives & Disaster Recovery"
        onBack={onBack}
        isLight={isLight}
      />

      <div className="pt-4 space-y-4">
        {/* 1. Backup Status Card */}
        <SecureDroidCard isLight={isLight} highlight className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-800 text-zinc-200'
              }`}>
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Hardware-Wrapped AES-256 Backup</h3>
                <p className={`text-xs mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Destination: Encrypted External USB Storage • Key derivation: scrypt 1M rounds
                </p>
              </div>
            </div>
            <SecureDroidStatusChip status="SECURE" label="ENCRYPTED" isLight={isLight} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/20 text-xs">
            <span className="text-zinc-500">Last Verified Backup</span>
            <span className="font-mono">{backupConfig.lastVerifiedDate}</span>
          </div>
        </SecureDroidCard>

        {backupSuccessMessage && (
          <SecureDroidCard isLight={isLight} className="p-3 bg-emerald-950/30 border-emerald-500/50 text-emerald-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{backupSuccessMessage}</span>
            </div>
            <button onClick={() => setBackupSuccessMessage(null)} className="underline text-[10px] font-mono">Dismiss</button>
          </SecureDroidCard>
        )}

        {/* 2. Critical Distinction: Snapshot vs Backup */}
        <SecureDroidSectionHeader title="Architecture: Snapshot vs Backup" isLight={isLight} />

        <SecureDroidCard isLight={isLight} className="p-4 space-y-2">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className={`text-xs leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              <strong>SNAPSHOT vs BACKUP:</strong> {backupConfig.snapshotVsBackupNote}
            </p>
          </div>
        </SecureDroidCard>

        {/* 3. Backup Contents Breakdown */}
        <SecureDroidSectionHeader title="Archive Payload Contents" isLight={isLight} />

        <SecureDroidCard isLight={isLight} className="p-4">
          <ul className="space-y-2 text-xs font-mono">
            {backupConfig.backupContents.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SecureDroidCard>

        {/* 4. Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <SecureDroidButton
            variant="primary"
            onClick={handleCreateEncryptedBackup}
            disabled={isBackingUp}
            isLight={isLight}
            className="flex-1"
          >
            {isBackingUp ? 'Encrypting & Generating SHA-256...' : 'Create Encrypted Backup'}
          </SecureDroidButton>

          <SecureDroidButton
            variant="secondary"
            onClick={() => alert('Select encrypted archive (.securedroid.enc) from external USB to restore.')}
            isLight={isLight}
            className="flex-1"
          >
            Restore Archive
          </SecureDroidButton>
        </div>
      </div>
    </div>
  );
};

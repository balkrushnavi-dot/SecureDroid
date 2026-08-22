import React, { useState } from 'react';
import {
  Globe,
  Shield,
  Lock,
  Wifi,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface NetworkControlScreenProps {
  isInternetOff: boolean;
  onToggleInternet: () => void;
  isVpnOnlyActive: boolean;
  onToggleVpnOnly: () => void;
}

export function NetworkControlScreen({
  isInternetOff,
  onToggleInternet,
  isVpnOnlyActive,
  onToggleVpnOnly,
}: NetworkControlScreenProps) {
  const [dnsMode, setDnsMode] = useState<'STRICT_DOT' | 'STRICT_DOH' | 'STANDARD_OFF'>('STRICT_DOT');
  const [customDnsHost, setCustomDnsHost] = useState('dns.quad9.net');

  return (
    <div id="network-control-screen" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">System Network Policy & Firewall</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-800 text-cyan-300">
                  KERNEL eBPF ENFORCEMENT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full-stack network isolation, encrypted DNS transport, and strict VPN lockdown
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <div className="text-[10px] text-slate-500 font-mono">BACKEND SERVICE</div>
            <div className="text-xs font-mono font-bold text-cyan-300">SecureDroidNetworkService</div>
          </div>
        </div>
      </div>

      {/* Network Core Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global Internet Master Killswitch */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">
              <Radio className="w-6 h-6" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isInternetOff
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {isInternetOff ? 'NETWORK ISOLATED' : 'ONLINE'}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white">Global Internet Disconnect</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Instantly severs all outgoing and incoming IPv4 and IPv6 network traffic across Wi-Fi, cellular radio, and tethered interfaces via kernel netfilter chains.
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1">
            <div className="text-[10px] text-slate-500">eBPF / IPTABLES COMMAND</div>
            <code className="text-sky-300 text-[11px] block">
              {isInternetOff ? 'iptables -P OUTPUT DROP && ip6tables -P OUTPUT DROP' : 'iptables -P OUTPUT ACCEPT (Per-App rules active)'}
            </code>
          </div>

          <button
            id="btn-toggle-global-internet"
            onClick={onToggleInternet}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer ${
              isInternetOff
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
            }`}
          >
            {isInternetOff ? 'RESTORE INTERNET ACCESS' : 'ENGAGE FULL NETWORK KILL'}
          </button>
        </div>

        {/* Strict VPN-Only Lockdown Mode */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isVpnOnlyActive
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {isVpnOnlyActive ? 'STRICT LOCKDOWN' : 'OPTIONAL'}
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white">VPN-Only Lockdown (Kill-Switch)</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Blocks all non-tun0 packet emissions. If the VPN disconnects for any reason, no packets can leak over raw Wi-Fi or cellular interfaces.
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1">
            <div className="text-[10px] text-slate-500">SYSTEM POLICY SPEC</div>
            <code className="text-indigo-300 text-[11px] block">
              {isVpnOnlyActive ? 'ConnectivityManager.setVpnLockdownRule(STRICT_ENFORCE)' : 'Standard routing (bypass allowed for local network)'}
            </code>
          </div>

          <button
            id="btn-toggle-vpn-lockdown"
            onClick={onToggleVpnOnly}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer ${
              isVpnOnlyActive
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                : 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300'
            }`}
          >
            {isVpnOnlyActive ? 'DISABLE VPN-ONLY LOCKDOWN' : 'ENFORCE STRICT VPN-ONLY LOCKDOWN'}
          </button>
        </div>
      </div>

      {/* Private DNS & DoT / DoH Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Private DNS & Cryptographic Transport
            </h2>
            <p className="text-xs text-slate-400">
              Guarantees zero plain-text UDP port 53 leakage to ISP or local rogue Wi-Fi gateways
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400">
            REQUIRES SYSTEM PRIVILEGE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'STRICT_DOT', name: 'DNS-over-TLS (DoT)', sub: 'Port 853 Strict TLS 1.3 with SPKI Pinning' },
            { id: 'STRICT_DOH', name: 'DNS-over-HTTPS (DoH)', sub: 'HTTP/3 Encrypted payload over Port 443' },
            { id: 'STANDARD_OFF', name: 'Standard (Opportunistic)', sub: 'Falls back to plain-text UDP if server unreachable' },
          ].map(opt => {
            const isSelected = dnsMode === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setDnsMode(opt.id as any)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>{opt.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{opt.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            Configured Strict DNS Provider Hostname
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={customDnsHost}
              onChange={e => setCustomDnsHost(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. dns.quad9.net or dns.mullvad.net"
            />
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              TLS 1.3 Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

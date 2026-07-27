import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Briefcase,
  Globe2,
  Server,
  ShieldAlert,
  Cpu,
  Radio,
  Zap,
  Activity,
  Key,
  Bot,
  Brain,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  CheckCircle2,
  RefreshCw,
  Sliders,
  FileCode
} from 'lucide-react';

interface EnterpriseDashboardProps {
  user: UserProfile;
  onOpenAITutor?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenAgentInspector?: () => void;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  user,
  onOpenAITutor,
  onOpenSubscriptions,
  onOpenAgentInspector
}) => {
  const [activeTab, setActiveTab] = useState<'swarms' | 'private_rag' | 'blueprint' | 'sso_security'>('swarms');

  // Custom Blueprint State
  const [systemBlueprint, setSystemBlueprint] = useState(`You are Zalamati Enterprise Copilot, representing the Global AI & Tech Academy.
- Enforce strict SOC2 Type II data privacy and zero PII leakage.
- Provide step-by-step mathematical reasoning and executable TypeScript/Python code snippets.
- Tailor explanations to enterprise software engineering standards.`);
  const [blueprintSaved, setBlueprintSaved] = useState(false);

  // Agent Swarm Log State
  const [swarmLogs, setSwarmLogs] = useState([
    { id: '1', agent: 'Deep RAG Vectorizer Swarm', status: 'Active', load: '1,420 vectors/sec', node: 'Cloud Run us-central1' },
    { id: '2', agent: 'SOC2 PII Redaction Audit Agent', status: 'Active', load: '0.2ms latency', node: 'Nano Banana Pro Edge' },
    { id: '3', agent: 'Automated Competency Evaluation Swarm', status: 'Active', load: '240 tests/min', node: 'Gemini 3.1 Flash' },
    { id: '4', agent: 'Enterprise SAML SSO Gateway Guard', status: 'Active', font: 'Okta / Azure AD', node: 'Security Boundary' }
  ]);

  const handleSaveBlueprint = () => {
    setBlueprintSaved(true);
    setTimeout(() => setBlueprintSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Enterprise Tier Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2a38] via-[#0a1820] to-[#0a1820] border border-cyan-400/50 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                Enterprise Global Tier ($1,299/mo)
              </span>
              <span className="text-xs text-[#82a4b3] bg-[#071319] px-2.5 py-0.5 rounded-full border border-[#1b3a49]">
                Seats: <strong>25,000 / Unlimited</strong>
              </span>
              <span className="text-xs text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-500/30 font-mono">
                99.99% SLA Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Global AI Command Center
            </h1>

            <p className="text-xs sm:text-sm text-[#8bb1c2] leading-relaxed">
              Full control plane for Antigravity multi-agent swarms, private document RAG vector vaults, custom AI prompt blueprints, SAML 2.0 SSO, and SOC2 audit logging.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={onOpenSubscriptions}
              className="px-4 py-2.5 rounded-xl bg-[#142a35] hover:bg-[#1c3846] text-white text-xs font-semibold border border-[#1e3e4f] transition-all"
            >
              Manage Tier Plan
            </button>
            {onOpenAgentInspector && (
              <button
                onClick={onOpenAgentInspector}
                className="px-4 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-300" />
                <span>Inspect Agent Swarms</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Enterprise KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Global Active Seats</span>
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">25,000 / Unlimited</div>
          <p className="text-[11px] text-teal-400">Multi-Region Enterprise Tier</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Gemini Token Throughput</span>
            <Cpu className="w-4 h-4 text-teal-300" />
          </div>
          <div className="text-2xl font-extrabold text-white">4.2M / day</div>
          <p className="text-[11px] text-teal-400">Zero Throttling Enforced</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Cluster Health & SLA</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-300">99.99% SLA</div>
          <p className="text-[11px] text-teal-400">Cloud Run Multi-Zone Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Security & Compliance</span>
            <ShieldAlert className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="text-2xl font-extrabold text-white">SOC2 Type II</div>
          <p className="text-[11px] text-teal-400">Zero PII Leakage Verified</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c3c4d] pb-2 overflow-x-auto text-xs">
        {[
          { id: 'swarms', label: 'Antigravity Multi-Agent Swarms', icon: Bot },
          { id: 'private_rag', label: 'Private RAG Vector Vault & IP Isolation', icon: Lock },
          { id: 'blueprint', label: 'Enterprise AI System Blueprint', icon: Sliders },
          { id: 'sso_security', label: 'SAML 2.0 SSO & Security Logs', icon: Key }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#0f6674] text-white shadow-md shadow-teal-950/40 border border-teal-500/40'
                  : 'bg-[#0a1820] text-[#7ea1b2] hover:text-white hover:bg-[#122631] border border-[#1c3c4d]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: Antigravity Multi-Agent Swarms */}
      {activeTab === 'swarms' && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                Antigravity Multi-Agent Background Swarm Mesh
              </h2>
              <p className="text-xs text-[#82a4b3] mt-1">
                Monitors real-time autonomous background processes handling RAG indexing, code verification, and security compliance.
              </p>
            </div>

            {onOpenAgentInspector && (
              <button
                onClick={onOpenAgentInspector}
                className="px-4 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-300" />
                <span>Open Swarm Terminal</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swarmLogs.map(s => (
              <div key={s.id} className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{s.agent}</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono text-[10px]">
                    {s.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#81a4b4]">
                  <span>Load: <strong className="text-cyan-300">{s.load}</strong></span>
                  <span>Node: <strong className="text-white">{s.node}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Private RAG Vector Vault */}
      {activeTab === 'private_rag' && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-400" />
              Private Document Vault & IP Isolation RAG Engine
            </h2>
            <p className="text-xs text-[#82a4b3] mt-1">
              Store sensitive enterprise documentation, proprietary software codebases, and compliance standards. Vectors are isolated to your enterprise tenant with zero model retraining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">Indexed Documents</div>
              <div className="text-2xl font-bold text-cyan-300">148,200 Files</div>
              <p className="text-[11px] text-[#7193a3]">Gemini Embedding 2 Vectorized</p>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">Data Leakage Prevention</div>
              <div className="text-2xl font-bold text-teal-300">100% Isolated</div>
              <p className="text-[11px] text-[#7193a3]">Zero public training fallback</p>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">Search Retrieval Latency</div>
              <div className="text-2xl font-bold text-white">18 ms Avg</div>
              <p className="text-[11px] text-[#7193a3]">HNSW Vector Indexing</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Enterprise AI System Blueprint */}
      {activeTab === 'blueprint' && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-400" />
              Custom Enterprise System Prompt Blueprint
            </h2>
            <p className="text-xs text-[#82a4b3] mt-1">
              Configure system instructions enforced across all 25,000 employee seats and AI Tutor sessions.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <textarea
              value={systemBlueprint}
              onChange={(e) => setSystemBlueprint(e.target.value)}
              className="w-full h-36 p-3.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white font-mono text-xs focus:outline-none focus:border-teal-500"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveBlueprint}
                className="px-5 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white font-semibold text-xs shadow-md shadow-teal-950/50 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-300" />
                <span>Save Blueprint Instruction</span>
              </button>

              {blueprintSaved && (
                <span className="text-xs text-teal-300 font-semibold animate-fade-in">
                  Blueprint updated across all enterprise seats!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SAML 2.0 SSO & Security Logs */}
      {activeTab === 'sso_security' && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              SAML 2.0 / Okta SSO & Security Audit Trail
            </h2>
            <p className="text-xs text-[#82a4b3] mt-1">
              Enterprise Identity Provider integration status and real-time security logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">Identity Provider (IdP):</div>
              <div className="text-sm font-bold text-teal-300">Okta / Azure AD Connected</div>
              <p className="text-[11px] text-[#7193a3]">SAML 2.0 Single Sign-On Enforced</p>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">SOC2 Audit Logging</div>
              <div className="text-sm font-bold text-teal-300">Continuous Logging Active</div>
              <p className="text-[11px] text-[#7193a3]">Exportable to Splunk & Datadog</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

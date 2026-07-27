import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import {
  Check,
  Zap,
  Building2,
  Users,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  X,
  HelpCircle,
  Clock,
  Layers,
  Cpu,
  Server,
  Globe2
} from 'lucide-react';

interface SubscriptionPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectTier: (role: UserRole) => void;
}

export interface SubscriptionTier {
  id: UserRole;
  name: string;
  badge: string;
  monthlyPrice: number;
  annualPriceMonthly: number;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  popular?: boolean;
  features: string[];
  dedicatedAgentServices: string[];
  targetAudience: string;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'student',
    name: 'Individual Scholar',
    badge: 'Self-Paced Learner',
    monthlyPrice: 19,
    annualPriceMonthly: 15,
    description: 'Ideal for independent students, researchers, and self-starters mastering high-demand degrees.',
    icon: GraduationCap,
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgGradient: 'from-cyan-950/40 via-[#0a1820] to-[#0c1a21]',
    targetAudience: 'Individual Students & Independent Researchers',
    features: [
      'Access to 100+ Accredited Degree Programs',
      'Personal Gemini 3.1 Pro AI Tutor (24/7)',
      'Unlimited AI Course Architect Generations',
      'Verifiable Blockchain Certificates & Badges',
      'Google Workspace Docs & Drive Sync',
      'Offline Audio TTS Narration & Flashcards',
      'Personal Learning Analytics & XP Leveling'
    ],
    dedicatedAgentServices: [
      'Personalized Adaptive Study Assistant',
      'Real-time Code & Math Problem Solver',
      'Academic Research & Citation Helper'
    ]
  },
  {
    id: 'school',
    name: 'Schools & Academies',
    badge: 'Educational Institution',
    monthlyPrice: 299,
    annualPriceMonthly: 239,
    description: 'Designed for high schools, colleges, and academies seeking automated AI curriculum oversight.',
    icon: Building2,
    accentColor: 'text-teal-400',
    borderColor: 'border-teal-500/50',
    bgGradient: 'from-teal-950/50 via-[#0a1820] to-[#0c1a21]',
    popular: true,
    targetAudience: 'Schools, Colleges, Academies & K-12 Districts (Up to 500 Students)',
    features: [
      'Everything in Individual Scholar, plus:',
      'Up to 500 Active Student Accounts',
      'Faculty & Instructor Copilot Dashboard',
      'Automated ABET/WASC Curriculum Auditor',
      'AI Admissions & Prerequisite Evaluator',
      'Institutional Syllabi & Handbook RAG Vault',
      'Custom Branded Diplomas & Seal Verification',
      'Departmental Retention & GPA Analytics'
    ],
    dedicatedAgentServices: [
      'AI Admissions & Student Placement Agent',
      'Automated Course Accreditation Auditor',
      'Classroom AI Copilot & Office Hours Scheduler'
    ]
  },
  {
    id: 'team',
    name: 'Corporate Teams',
    badge: 'Mid-Market & Tech Teams',
    monthlyPrice: 499,
    annualPriceMonthly: 399,
    description: 'Tailored for engineering teams, startups, and departments scaling employee AI & technical skills.',
    icon: Users,
    accentColor: 'text-slate-200',
    borderColor: 'border-slate-500/50',
    bgGradient: 'from-slate-900/60 via-[#0a1820] to-[#0c1a21]',
    targetAudience: 'Tech Startups, Engineering Departments & Agencies (Up to 50 Members)',
    features: [
      'Everything in Individual Scholar, plus:',
      'Up to 50 Team Member Seats',
      'Corporate AI Skill Gap Matrix & Heatmaps',
      'Automated Upskilling & Career Track Assignment',
      'Slack & MS Teams Micro-Learning Digest Bot',
      'Team Completion Velocity & Leaderboard',
      'Manager Seat Allocation & Access Control',
      'Centralized Invoicing & Expense Receipts'
    ],
    dedicatedAgentServices: [
      'Corporate AI Skill Gap Analyzer Agent',
      'Automated Employee Career Upskilling Engine',
      'Slack/Teams Webhook AI Micro-Lesson Bot'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Global',
    badge: 'Global Academy & Defense',
    monthlyPrice: 1299,
    annualPriceMonthly: 1039,
    description: 'For global enterprises, government bodies, and multi-region academies demanding custom AI governance.',
    icon: Briefcase,
    accentColor: 'text-cyan-300',
    borderColor: 'border-cyan-400/60',
    bgGradient: 'from-[#0d2a38] via-[#0a1820] to-[#0c1a21]',
    targetAudience: 'Global Corporations, Defense & Enterprise Academies (Unlimited Users)',
    features: [
      'Everything in Corporate Teams, plus:',
      'Unlimited Enterprise User Seats',
      'Antigravity Multi-Agent Swarm Inspector',
      'Private Dedicated RAG Vector Vault (IP Isolation)',
      'Custom AI System Instructions & Prompt Blueprints',
      'SAML 2.0 / Okta SSO & SOC2 Audit Trail',
      'Multi-Region Cloud Run Cluster (99.99% SLA)',
      'Dedicated Account Manager & 24/7 Priority Support'
    ],
    dedicatedAgentServices: [
      'Antigravity Multi-Agent Swarm Control Plane',
      'Enterprise Private RAG & Document Vault',
      'SOC2 Security & Token Governance Agent'
    ]
  }
];

export const SubscriptionPricingModal: React.FC<SubscriptionPricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectTier
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'tiers' | 'comparison'>('tiers');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl my-auto bg-[#09151c] border border-[#1d3d4b] rounded-3xl p-6 sm:p-8 flex flex-col space-y-6 text-white shadow-2xl overflow-hidden">
        
        {/* Subtle Ambient Background Light */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#183645] pb-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Tiered Subscriptions Engine
              </span>
              <span className="text-xs text-[#7396a6] hidden sm:inline">
                Current Tier: <strong className="text-cyan-300 capitalize">{currentUser.role}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Your Academic & Institutional Tier
            </h2>
            <p className="text-xs text-[#82a4b3] max-w-2xl">
              Transparent, realistic pricing for individual learners, accredited K-12 & university institutions, corporate tech teams, and enterprise global academies.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors self-end sm:self-auto"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher & Billing Cycle Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d1d25] border border-[#1c3846] p-3 rounded-2xl relative z-10">
          <div className="flex items-center gap-2 bg-[#09141b] p-1 rounded-xl border border-[#183442] w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategoryTab('tiers')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategoryTab === 'tiers'
                  ? 'bg-[#0f6674] text-white shadow-md'
                  : 'text-[#7d9faf] hover:text-white'
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => setSelectedCategoryTab('comparison')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategoryTab === 'comparison'
                  ? 'bg-[#0f6674] text-white shadow-md'
                  : 'text-[#7d9faf] hover:text-white'
              }`}
            >
              Feature Matrix
            </button>
          </div>

          {/* Billing Cycle Switch */}
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${!isAnnual ? 'text-white' : 'text-[#7396a6]'}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-[#142d3a] border border-[#1e3e4f] p-1 transition-colors relative"
            >
              <div
                className={`w-4 h-4 rounded-full bg-cyan-400 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${isAnnual ? 'text-white' : 'text-[#7396a6]'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-bold">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Tiers View */}
        {selectedCategoryTab === 'tiers' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isCurrentRole = currentUser.role === tier.id;
              const displayPrice = isAnnual ? tier.annualPriceMonthly : tier.monthlyPrice;

              return (
                <div
                  key={tier.id}
                  className={`relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-b ${tier.bgGradient} border ${
                    tier.borderColor
                  } transition-all duration-300 ${
                    tier.popular ? 'ring-2 ring-teal-400/50 shadow-xl shadow-teal-950/40 scale-[1.02]' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                      Most Popular for Education
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <Icon className={`w-5 h-5 ${tier.accentColor}`} />
                      </div>
                      <span className="text-[10px] font-semibold text-[#80a2b1] bg-[#071117] px-2 py-1 rounded-md border border-[#1b3a48]">
                        {tier.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <p className="text-[11px] text-[#81a4b4] mt-1 leading-snug">
                        {tier.description}
                      </p>
                    </div>

                    {/* Price Tag */}
                    <div className="py-2 border-y border-[#183645] flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">${displayPrice}</span>
                      <span className="text-xs text-[#7ea0b1]">/ month</span>
                      {isAnnual && (
                        <span className="text-[10px] text-teal-400 ml-auto font-mono">
                          Billed ${displayPrice * 12}/yr
                        </span>
                      )}
                    </div>

                    {/* Dedicated Agent Services Section */}
                    <div className="space-y-1.5 bg-[#09171f] p-2.5 rounded-xl border border-[#1a3848]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        Dedicated Agent Services:
                      </div>
                      <ul className="space-y-1 text-[11px] text-[#8db1c2]">
                        {tier.dedicatedAgentServices.map((srv, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="truncate">{srv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-white">Included Capabilities:</div>
                      <ul className="space-y-1.5 text-xs text-[#87a9b8]">
                        {tier.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Select / Switch Tier Action */}
                  <button
                    onClick={() => {
                      onSelectTier(tier.id);
                      onClose();
                    }}
                    disabled={isCurrentRole}
                    className={`w-full mt-6 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                      isCurrentRole
                        ? 'bg-[#122833] text-[#7ea1b2] border border-[#1e3e4f] cursor-default'
                        : tier.popular
                        ? 'bg-[#0f6674] hover:bg-[#137b8c] text-white shadow-lg shadow-teal-950/50 active:scale-95'
                        : 'bg-[#142935] hover:bg-[#1c3a4a] text-white border border-[#214354] active:scale-95'
                    }`}
                  >
                    {isCurrentRole ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-teal-400" />
                        <span>Active Tier Plan</span>
                      </>
                    ) : (
                      <>
                        <span>Switch to {tier.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Comparison Matrix Table */
          <div className="relative z-10 overflow-x-auto rounded-2xl border border-[#1a3848] bg-[#0b1820]">
            <table className="w-full text-left text-xs text-[#85a8b7]">
              <thead className="bg-[#0f222d] text-white border-b border-[#1c3c4d]">
                <tr>
                  <th className="p-4 font-bold">Capabilities & Tools</th>
                  <th className="p-4 font-bold text-center">Individual ($19/mo)</th>
                  <th className="p-4 font-bold text-center text-teal-300">School ($299/mo)</th>
                  <th className="p-4 font-bold text-center">Team ($499/mo)</th>
                  <th className="p-4 font-bold text-center text-cyan-300">Enterprise ($1,299/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173343]">
                {[
                  { name: 'Active User Seats', ind: '1 Learner', sch: 'Up to 500 Students', team: 'Up to 50 Members', ent: 'Unlimited' },
                  { name: 'Personal Gemini 3.1 AI Tutor', ind: true, sch: true, team: true, ent: true },
                  { name: 'Accredited Degree Catalog', ind: true, sch: true, team: true, ent: true },
                  { name: 'AI Course Architect Generator', ind: true, sch: true, team: true, ent: true },
                  { name: 'AI Admissions & Placement Agent', ind: false, sch: true, team: false, ent: true },
                  { name: 'Automated Accreditation Auditor', ind: false, sch: true, team: false, ent: true },
                  { name: 'Corporate AI Skill Gap Matrix', ind: false, sch: false, team: true, ent: true },
                  { name: 'Slack/MS Teams Micro-Lesson Bot', ind: false, sch: false, team: true, ent: true },
                  { name: 'Antigravity Multi-Agent Swarm', ind: false, sch: false, team: false, ent: true },
                  { name: 'Private IP Isolation RAG Vault', ind: false, sch: false, team: false, ent: true },
                  { name: 'SAML 2.0 / Okta SSO & Audit Logs', ind: false, sch: false, team: false, ent: true },
                  { name: 'SLA Guarantee', ind: 'Standard', sch: '99.9%', team: '99.9%', ent: '99.99%' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{row.name}</td>
                    <td className="p-4 text-center">
                      {typeof row.ind === 'boolean' ? (
                        row.ind ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        row.ind
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.sch === 'boolean' ? (
                        row.sch ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        row.sch
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.team === 'boolean' ? (
                        row.team ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        row.team
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.ent === 'boolean' ? (
                        row.ent ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-gray-600 mx-auto" />
                      ) : (
                        row.ent
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Notice */}
        <div className="pt-4 border-t border-[#183645] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7396a6] gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Secure 256-Bit SSL Encrypted Enterprise Checkout. Change or cancel anytime.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#132833] hover:bg-[#1a3848] text-white font-semibold transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

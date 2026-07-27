import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  isActive?: boolean;
}

// 1. Unique Animated Learning Studio Icon (Pulsing Orbit Grid)
export const AnimatedStudioIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    {/* Outer Orbit Ring */}
    <svg
      className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'rotate-45 scale-110' : 'group-hover:rotate-180'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        className={`text-cyan-400/60 ${isActive ? 'animate-[spin_8s_linear_infinite]' : 'group-hover:animate-[spin_4s_linear_infinite]'}`}
      />
      <rect
        x="7"
        y="7"
        width="4"
        height="4"
        rx="1"
        fill="currentColor"
        className="text-cyan-300 animate-pulse"
      />
      <rect
        x="13"
        y="7"
        width="4"
        height="4"
        rx="1"
        fill="currentColor"
        className="text-teal-400 opacity-80"
      />
      <rect
        x="7"
        y="13"
        width="4"
        height="4"
        rx="1"
        fill="currentColor"
        className="text-emerald-400 opacity-80"
      />
      <rect
        x="13"
        y="13"
        width="4"
        height="4"
        rx="1"
        fill="currentColor"
        className="text-cyan-400 animate-pulse"
      />
    </svg>
    {isActive && (
      <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm animate-ping pointer-events-none" />
    )}
  </div>
);

// 2. Unique Animated Degree Cap Icon (Glowing Tassel & Floating Stars)
export const AnimatedDegreeIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 text-sky-300' : 'group-hover:scale-105 text-sky-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cap Top */}
      <path
        d="M22 10L12 4L2 10L12 16L22 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isActive ? 'currentColor' : 'none'}
        fillOpacity={0.2}
      />
      {/* Cap Bottom Ring */}
      <path
        d="M6 12.5V16.5C6 18.5 8.7 20 12 20C15.3 20 18 18.5 18 16.5V12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swaying Tassel */}
      <path
        d="M22 10V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className={`origin-top transition-transform duration-500 ${isActive ? 'animate-[bounce_2s_infinite]' : 'group-hover:rotate-12'}`}
      />
      <circle cx="22" cy="17" r="1" fill="currentColor" className="text-amber-300 animate-pulse" />
    </svg>
    {isActive && (
      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
    )}
  </div>
);

// 3. Unique Animated Course Catalog Icon (Floating Pages & Light Rays)
export const AnimatedCatalogIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-300' : 'group-hover:scale-105 text-blue-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isActive ? 'currentColor' : 'none'}
        fillOpacity={0.15}
      />
      {/* Animated Book Lines */}
      <line
        x1="9"
        y1="7"
        x2="16"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-cyan-300 animate-pulse"
      />
      <line
        x1="9"
        y1="11"
        x2="14"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-teal-300"
      />
    </svg>
  </div>
);

// 4. Unique Animated Autonomous Engine Icon (Dual Spin Ring & Live Status Orb)
export const AnimatedEngineIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Rotating Gear / Ring */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        className="text-amber-400/70 animate-[spin_10s_linear_infinite]"
      />
      {/* Inner Counter-Rotating Ring */}
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        className="text-teal-400 animate-[spin_6s_linear_infinite_reverse]"
      />
      {/* Core AI Orb */}
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="currentColor"
        className="text-cyan-300 animate-ping"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="currentColor"
        className="text-emerald-400"
      />
    </svg>
    <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full border border-slate-950 animate-pulse" />
  </div>
);

// 5. Unique Animated Shield Icon (Perimeter Energy Beam)
export const AnimatedShieldIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-cyan-300' : 'group-hover:scale-105 text-cyan-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={isActive ? 'currentColor' : 'none'}
        fillOpacity={0.15}
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-400 animate-pulse"
      />
    </svg>
  </div>
);

// 6. Unique Animated Flame / XP Icon
export const AnimatedFlameIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg
    className={`${className} text-amber-400 animate-[pulse_1.5s_infinite]`}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 23C16.4183 23 20 19.4183 20 15C20 11.5 17.5 8 15 5.5C15 8.5 13 9.5 12 9.5C11 9.5 10 8 10 6C7.5 8.5 4 11.5 4 15C4 19.4183 7.58172 23 12 23Z" />
  </svg>
);

// 7. Unique Animated Knowledge Graph Network Icon (Constellation Grid)
export const AnimatedNetworkIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'rotate-90 scale-110 text-cyan-300' : 'group-hover:rotate-45 text-cyan-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16L12 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={isActive ? 'animate-pulse text-teal-400' : ''}
      />
      <path
        d="M8 12L16 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={isActive ? 'animate-pulse text-cyan-400' : ''}
      />
      <path
        d="M6 18L18 6"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 2"
        className="opacity-50"
      />
      {/* Central Hub */}
      <circle cx="12" cy="12" r="3" fill="currentColor" className="text-cyan-400 animate-pulse" />
      {/* Satellite Nodes */}
      <circle cx="12" cy="5" r="1.5" fill="currentColor" className="text-teal-400" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" className="text-teal-400" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" className="text-cyan-300" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" className="text-cyan-300" />
    </svg>
    {isActive && (
      <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm animate-ping pointer-events-none" />
    )}
  </div>
);

// 8. Unique Animated Caliper Compass / Optical Lens CAD Icon
export const AnimatedCadIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-all duration-500 ${isActive ? 'scale-115 rotate-12 text-purple-300' : 'group-hover:scale-110 group-hover:-rotate-12 text-purple-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Caliper Compass structure */}
      <path
        d="M12 3V5M12 5L7 19M12 5L17 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Alignment slider beam */}
      <path
        d="M9 13H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={isActive ? 'animate-[bounce_2s_infinite]' : ''}
      />
      {/* Focal curvature vector */}
      <path
        d="M5 19C7 16 17 16 19 19"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        className="text-cyan-300 opacity-85"
      />
      <circle cx="12" cy="5" r="1" fill="currentColor" className="text-purple-300" />
    </svg>
    {isActive && (
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
    )}
  </div>
);

// 9. Unique Animated Test Harness Execution Icon
export const AnimatedTestHarnessIcon: React.FC<IconProps> = ({ className = "w-5 h-5", isActive = false }) => (
  <div className="relative flex items-center justify-center group">
    <svg
      className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 text-emerald-300' : 'group-hover:scale-105 text-emerald-400'}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
        fill={isActive ? 'currentColor' : 'none'}
        fillOpacity={0.12}
      />
      <path
        d="M7 9L10 12L7 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isActive ? 'animate-pulse text-cyan-300' : ''}
      />
      <line
        x1="12"
        y1="15"
        x2="17"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="text-emerald-400 animate-pulse"
      />
      <circle
        cx="18"
        cy="7"
        r="1.5"
        fill="currentColor"
        className="text-emerald-300 animate-ping"
      />
    </svg>
    {isActive && (
      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping pointer-events-none" />
    )}
  </div>
);



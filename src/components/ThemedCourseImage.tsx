import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Brain,
  Globe,
  Database,
  Layers,
  Sparkles,
  BookOpen,
  Zap,
  Terminal,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface ThemedCourseImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
}

export const ThemedCourseImage: React.FC<ThemedCourseImageProps> = ({
  src,
  alt,
  category = 'Computer Science',
  className = 'w-full h-full object-cover'
}) => {
  const [imageError, setImageError] = useState(false);

  // Map category to a themed vector icon
  const getCategoryIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes('ai') || cat.includes('machine') || cat.includes('neural')) return Brain;
    if (cat.includes('data') || cat.includes('database')) return Database;
    if (cat.includes('cyber') || cat.includes('security')) return ShieldCheck;
    if (cat.includes('system') || cat.includes('hardware')) return Cpu;
    if (cat.includes('web') || cat.includes('cloud')) return Globe;
    return Code2;
  };

  const IconComponent = getCategoryIcon();

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={className}
      />
    );
  }

  // Fallback to a themed vector artwork matching LMDpro dark slate/cyan aesthetic
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#0c1f28] via-[#102a37] to-[#07131a] flex flex-col items-center justify-center p-4 border border-[#1c3e4e] ${className}`}>
      {/* Decorative background grid and glowing circles */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />

      {/* Center Vector Badge */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-900/50">
          <div className="w-full h-full bg-[#08151c] rounded-[14px] flex items-center justify-center text-cyan-300">
            <IconComponent className="w-6 h-6" />
          </div>
        </div>
        <span className="text-xs font-black text-white tracking-tight line-clamp-1">
          {alt}
        </span>
        <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-wider">
          LMDpro Academic Module
        </span>
      </div>
    </div>
  );
};

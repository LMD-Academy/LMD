import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  Sliders,
  Settings,
  Cpu,
  RefreshCw,
  CheckCircle,
  Play,
  Volume2,
  Bookmark,
  Sun,
  Moon,
  Compass,
  Code2,
  Terminal,
  Grid,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';

interface STEMPalette {
  id: string;
  name: string;
  isDark: boolean;
  bgCanvas: string;
  bgCard: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accentGradient: string;
  accentColor: string;
  gridColor: string;
}

const COLOR_PALETTES: STEMPalette[] = [
  {
    id: 'cyberpunk-dark',
    name: 'Liquid Obsidian (Dark)',
    isDark: true,
    bgCanvas: 'bg-[#090d16]',
    bgCard: 'bg-[#121826]/80',
    border: 'border-[#ff007f]/30',
    textPrimary: 'text-white',
    textSecondary: 'text-[#829bb0]',
    accentGradient: 'from-[#ff007f] via-[#a855f7] to-[#00e5ff]',
    accentColor: '#ff007f',
    gridColor: 'rgba(255, 0, 127, 0.05)'
  },
  {
    id: 'emerald-vault',
    name: 'Emerald Aurora (Medium Dark)',
    isDark: true,
    bgCanvas: 'bg-[#061412]',
    bgCard: 'bg-[#0b211e]/80',
    border: 'border-[#34d399]/30',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-200/60',
    accentGradient: 'from-[#34d399] via-[#059669] to-[#06b6d4]',
    accentColor: '#34d399',
    gridColor: 'rgba(52, 211, 153, 0.05)'
  },
  {
    id: 'solar-warmth',
    name: 'Solarized Amber (Warm Theme)',
    isDark: true,
    bgCanvas: 'bg-[#1a1105]',
    bgCard: 'bg-[#291b0a]/85',
    border: 'border-[#f59e0b]/30',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/50',
    accentGradient: 'from-[#f59e0b] via-[#d97706] to-[#ec4899]',
    accentColor: '#f59e0b',
    gridColor: 'rgba(245, 158, 11, 0.04)'
  },
  {
    id: 'alabaster-light',
    name: 'Alabaster Contrast (Light Mode)',
    isDark: false,
    bgCanvas: 'bg-[#f1f5f9]',
    bgCard: 'bg-white/90',
    border: 'border-slate-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accentGradient: 'from-[#6366f1] via-[#4f46e5] to-[#06b6d4]',
    accentColor: '#4f46e5',
    gridColor: 'rgba(79, 70, 229, 0.05)'
  }
];

export const StemCadSimulation: React.FC = () => {
  const [selectedPalette, setSelectedPalette] = useState<STEMPalette>(COLOR_PALETTES[0]);
  const [pitch, setPitch] = useState<number>(30); // 3D viewport rotation
  const [yaw, setYaw] = useState<number>(45);
  const [zoom, setZoom] = useState<number>(1.1);

  // CAD Constraint Parameters
  const [focalLength, setFocalLength] = useState<number>(150);
  const [refractiveIndex, setRefractiveIndex] = useState<number>(1.52);
  const [laserHeight, setLaserHeight] = useState<number>(40);
  const [lensCurvature, setLensCurvature] = useState<number>(100); // R1 & R2 curvature

  // STEM Sandbox Game Target matching
  const [laserTargetReached, setLaserTargetReached] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [pythonCode, setPythonCode] = useState<string>(
    `# CAD Lens Refraction Constraint Solvers\nimport math\n\ndef check_focus(focal_length, index, height, R):\n    # Lensmaker's Equation solver\n    # 1/f = (n - 1) * (1/R1 - 1/R2)\n    # For symmetric biconvex lens: 1/f = 2 * (n - 1) / R\n    f_calculated = R / (2 * (index - 1.0))\n    \n    # Calculate focal divergence angle\n    angle = math.atan(height / f_calculated)\n    \n    # We want perfect convergence at the receiver target (X = 350, Y = 0)\n    error = abs(focal_length - f_calculated)\n    return error < 5.0\n\n# Run constraints solver on UI inputs\nsolved = check_focus(150.0, ${refractiveIndex}, ${laserHeight}, ${lensCurvature})\nprint(f"Target status: {'SOLVED' if solved else 'CONVERGENCE_ERROR'}")`
  );
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'CAD Engine Initialized...',
    'Awaiting constraints solver compile...'
  ]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refresh code editor when parameter sliders change
  useEffect(() => {
    setPythonCode(
      `# CAD Lens Refraction Constraint Solvers\nimport math\n\ndef check_focus(focal_length, index, height, R):\n    # Lensmaker's Equation solver\n    # 1/f = (n - 1) * (1/R1 - 1/R2)\n    # For symmetric biconvex lens: 1/f = 2 * (n - 1) / R\n    f_calculated = R / (2 * (index - 1.0))\n    \n    # Calculate focal divergence angle\n    angle = math.atan(height / f_calculated)\n    \n    # We want perfect convergence at the receiver target (X = 350, Y = 0)\n    error = abs(focal_length - f_calculated)\n    return error < 5.0\n\n# Run constraints solver on UI inputs\nsolved = check_focus(150.0, ${refractiveIndex}, ${laserHeight}, ${lensCurvature})\nprint(f"Target status: {'SOLVED' if solved else 'CONVERGENCE_ERROR'}")`
    );
  }, [refractiveIndex, laserHeight, lensCurvature]);

  // Solver compiler simulation
  const handleCompileCode = () => {
    setIsCompiling(true);
    setTerminalOutput(prev => [...prev, '>>> Running constraint compiler...']);
    
    setTimeout(() => {
      // Calculate lensmaker's formula: 1/f = 2 * (n-1)/R => f = R / (2 * (n-1))
      const calculatedFocal = lensCurvature / (2 * (refractiveIndex - 1.0));
      const targetFocal = 150; // where the target sensor is located
      const error = Math.abs(calculatedFocal - targetFocal);
      const isSolved = error < 12.0; // Margin of tolerance

      setIsCompiling(false);
      if (isSolved) {
        setLaserTargetReached(true);
        setUserScore(prev => prev + 100);
        setTerminalOutput(prev => [
          ...prev,
          `SUCCESS: Lens focal convergence calculated at ${calculatedFocal.toFixed(2)}px.`,
          `Target convergence achieved within tolerance (Error: ${error.toFixed(2)}px).`,
          `Result: SOLVED. Golden Trophy +100 XP added to cloud.`
        ]);
      } else {
        setLaserTargetReached(false);
        setTerminalOutput(prev => [
          ...prev,
          `WARNING: Lens focal convergence at ${calculatedFocal.toFixed(2)}px.`,
          `Focal distance mismatch (Target: ${targetFocal}px, Error: ${error.toFixed(2)}px).`,
          `Result: CONVERGENCE_ERROR. Laser beams missed the receiver node.`
        ]);
      }
    }, 900);
  };

  // Render physical/optical simulation onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = selectedPalette.isDark;
    
    // Draw coordinates grids representing CAD system
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Midline axis
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate lens optics: f = R / (2 * (n - 1))
    const calculatedF = lensCurvature / (2 * (refractiveIndex - 1.0));
    const opticalCenter = 200; // X coordinate of the lens
    const centerY = canvas.height / 2;

    // 1. Draw Laser Emitter
    ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
    ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(20, centerY - laserHeight - 15, 40, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(60, centerY - laserHeight, 5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Target Receiver Node (fixed at X = 200 + 150 = 350)
    const targetX = opticalCenter + 150;
    const pulseRadius = 8 + Math.sin(Date.now() / 150) * 3;

    if (laserTargetReached) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetX, centerY, pulseRadius + 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = laserTargetReached ? '#10b981' : '#f59e0b';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(targetX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Receiver bracket housing
    ctx.strokeStyle = isDark ? '#334155' : '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(targetX, centerY + 8);
    ctx.lineTo(targetX, centerY + 40);
    ctx.lineTo(targetX - 15, centerY + 40);
    ctx.lineTo(targetX + 15, centerY + 40);
    ctx.stroke();

    // 3. Draw Biconvex Optical Lens (interactive CAD 3D projection representation)
    const lensThickness = 24 - (lensCurvature / 15);
    ctx.fillStyle = isDark ? 'rgba(0, 229, 255, 0.12)' : 'rgba(79, 70, 229, 0.1)';
    ctx.strokeStyle = selectedPalette.accentColor;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    // Left curvature edge
    ctx.arc(opticalCenter + lensCurvature / 2, centerY, lensCurvature / 2 + lensThickness, Math.PI - 0.5, Math.PI + 0.5);
    // Right curvature edge
    ctx.arc(opticalCenter - lensCurvature / 2, centerY, lensCurvature / 2 + lensThickness, -0.5, 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dimension labels
    ctx.fillStyle = isDark ? '#38bdf8' : '#4f46e5';
    ctx.font = '10px monospace';
    ctx.fillText(`Curvature (R) = ${lensCurvature}mm`, opticalCenter - 45, centerY - 65);
    ctx.fillText(`n = ${refractiveIndex.toFixed(2)}`, opticalCenter - 18, centerY + 65);

    // 4. Draw Optical Light Ray Refraction (The Explainer Physics Visualization)
    ctx.lineWidth = 2.5;
    
    // Unrefracted Laser Beam (Straight from laser height to Lens)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.beginPath();
    ctx.moveTo(60, centerY - laserHeight);
    ctx.lineTo(opticalCenter, centerY - laserHeight);
    ctx.stroke();

    // Draw secondary auxiliary center beam
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.moveTo(60, centerY);
    ctx.lineTo(opticalCenter, centerY);
    ctx.stroke();

    // Laser Beam inside Lens (Refracting towards normal)
    const midX = opticalCenter + 5;
    const midY = centerY - (laserHeight * 0.8);
    ctx.strokeStyle = '#f87171';
    ctx.beginPath();
    ctx.moveTo(opticalCenter, centerY - laserHeight);
    ctx.lineTo(midX, midY);
    ctx.stroke();

    // Refracted Laser Beam exiting Lens
    // Point of focus is (opticalCenter + calculatedF, centerY)
    const focusPointX = opticalCenter + calculatedF;
    ctx.strokeStyle = laserTargetReached ? '#10b981' : '#ef4444';
    ctx.lineWidth = laserTargetReached ? 3 : 2;

    // Draw path continuing past the lens focus point to the edge of the viewport
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    if (focusPointX > midX) {
      // Line equation: y - centerY = m * (x - focusPointX)
      // m = (midY - centerY) / (midX - focusPointX)
      const m = - (laserHeight * 0.8) / (midX - focusPointX);
      const endX = canvas.width - 40;
      const endY = centerY + m * (endX - focusPointX);
      ctx.lineTo(focusPointX, centerY);
      ctx.lineTo(endX, endY);
    } else {
      ctx.lineTo(canvas.width - 40, centerY);
    }
    ctx.stroke();

    // Draw auxiliary center ray continuing to focal point
    ctx.strokeStyle = laserTargetReached ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(midX, centerY);
    ctx.lineTo(focusPointX, centerY);
    ctx.stroke();

    // Focal point marker
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(focusPointX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = selectedPalette.textPrimary;
    ctx.font = '9px monospace';
    ctx.fillText(`Focus: F=${calculatedF.toFixed(0)}`, focusPointX - 25, centerY - 12);

    // Laser convergence path visual effects (glowing particles on success)
    if (laserTargetReached && Math.random() > 0.4) {
      ctx.fillStyle = '#34d399';
      for (let i = 0; i < 5; i++) {
        const randX = targetX + (Math.random() - 0.5) * 15;
        const randY = centerY + (Math.random() - 0.5) * 15;
        ctx.fillRect(randX, randY, 2, 2);
      }
    }

  }, [lensCurvature, refractiveIndex, laserHeight, laserTargetReached, selectedPalette]);

  return (
    <div className={`liquid-glass-card border overflow-hidden p-6 ${selectedPalette.bgCanvas} transition-all duration-300 relative shadow-2xl rounded-3xl`}>
      {/* Background CAD Ambient Grid Accent Glow (Permanent Layout, Custom Coloring) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-tr from-cyan-500/20 via-purple-500/10 to-transparent blur-3xl" />
      
      {/* Header Panel */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider font-black bg-gradient-to-r ${selectedPalette.accentGradient} text-black shadow-md`}>
              Brilliant STEM Engine
            </span>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-full">
              <Compass className="w-3.5 h-3.5" />
              <span>3D CAD Interactive v2.6</span>
            </div>
          </div>
          <h2 className={`text-xl font-black tracking-tight mt-1 ${selectedPalette.textPrimary}`}>
            Optical Aberration & Constraint solver
          </h2>
          <p className={`text-xs mt-0.5 ${selectedPalette.textSecondary}`}>
            Adjust the lens physical properties or compile constraint scripts to direct the laser ray to the convergence node.
          </p>
        </div>

        {/* Contrast / Color Theme Selectors */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/5 dark:bg-black/35 border border-white/10 p-1 rounded-2xl self-stretch md:self-auto justify-end">
          {COLOR_PALETTES.map((palette) => (
            <button
              key={palette.id}
              onClick={() => setSelectedPalette(palette)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                selectedPalette.id === palette.id
                  ? `bg-gradient-to-r ${palette.accentGradient} text-black shadow-md font-black`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border border-black/20"
                style={{ backgroundColor: palette.accentColor }}
              />
              <span>{palette.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Variable Controls */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Interactive Viewport Canvas Box (Left column, span 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md">
            {/* Action overlay buttons */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
              <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[9px] font-bold text-gray-300 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active CAD Viewport</span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[9px] font-bold flex items-center gap-1.5 ${
                laserTargetReached ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${laserTargetReached ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                <span>{laserTargetReached ? 'Target Locked' : 'Searching Focal Point'}</span>
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              <button
                onClick={() => {
                  setRefractiveIndex(1.52);
                  setLaserHeight(40);
                  setLensCurvature(100);
                  setLaserTargetReached(false);
                }}
                className="p-1.5 rounded-lg bg-black/80 hover:bg-black text-gray-400 hover:text-white border border-white/10 transition-colors"
                title="Reset Parameters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[9px] font-bold text-cyan-300 hover:bg-black transition-all flex items-center gap-1"
              >
                <span>{showExplanation ? 'Hide Guide' : 'Show Explanation'}</span>
              </button>
            </div>

            {/* Render Canvas */}
            <div className="w-full h-72 flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                width={550}
                height={260}
                className="w-full h-full block rounded-xl touch-none"
              />
            </div>

            {/* Bottom CAD HUD Status */}
            <div className="px-4 py-2 bg-black/60 border-t border-white/5 text-[9px] font-mono text-gray-400 flex justify-between items-center">
              <span>Projection: Isometric Orthogonal</span>
              <span className="flex items-center gap-2">
                <span>Viewport scale: {zoom}x</span>
                <span>Focal alignment: {laserTargetReached ? '100% OK' : 'MISALIGNED'}</span>
              </span>
            </div>
          </div>

          {/* Socratic Explanation block */}
          {showExplanation && (
            <div className={`p-4 rounded-2xl border ${selectedPalette.border} bg-white/5 space-y-2`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className={`text-xs font-bold uppercase tracking-wider ${selectedPalette.textPrimary}`}>
                  STEM Challenge: The Lensmaker's Equation
                </h4>
              </div>
              <p className={`text-xs leading-relaxed ${selectedPalette.textSecondary}`}>
                A thin symmetric biconvex lens's focal length <strong className={selectedPalette.textPrimary}>f</strong> is determined by its physical shape curvature <strong className={selectedPalette.textPrimary}>R</strong> and its material glass index of refraction <strong className={selectedPalette.textPrimary}>n</strong>:
              </p>
              <div className="flex justify-center py-2">
                <code className="px-4 py-2 rounded-xl bg-black/50 text-[#00e5ff] text-xs font-mono border border-white/5">
                  1/f = (n - 1) * (1/R1 - 1/R2) =&gt; f = R / (2 * (n - 1))
                </code>
              </div>
              <p className={`text-xs leading-relaxed ${selectedPalette.textSecondary}`}>
                The target receiver lies precisely <span className="font-extrabold text-white">150mm</span> to the right of the lens axis. Use the CAD physical parameter sliders on the right or compile your constraint script to solve the refraction mechanics!
              </p>
            </div>
          )}
        </div>

        {/* CAD Properties & Controllers (Right Column, span 4) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Slider Controls Container */}
          <div className="bg-[#121622]/40 border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${selectedPalette.textPrimary}`}>
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>CAD Constraints</span>
              </span>
              <span className="text-[10px] text-[#34d399] font-mono bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>

            {/* Slider 1: Lens Curvature R */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-gray-300">Curvature Radius (R)</span>
                <span className={`font-bold ${selectedPalette.textPrimary}`}>{lensCurvature}mm</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={lensCurvature}
                onChange={(e) => {
                  setLensCurvature(parseInt(e.target.value));
                  setLaserTargetReached(false);
                }}
                className="w-full accent-cyan-400 h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-500">
                <span>Highly Curved (50)</span>
                <span>Flat Profile (200)</span>
              </div>
            </div>

            {/* Slider 2: Refractive Index n */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-gray-300">Glass Refraction Index (n)</span>
                <span className={`font-bold ${selectedPalette.textPrimary}`}>{refractiveIndex.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.10"
                max="2.00"
                step="0.02"
                value={refractiveIndex}
                onChange={(e) => {
                  setRefractiveIndex(parseFloat(e.target.value));
                  setLaserTargetReached(false);
                }}
                className="w-full accent-purple-400 h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-500">
                <span>Water/Air (1.10)</span>
                <span>Diamond-like (2.00)</span>
              </div>
            </div>

            {/* Slider 3: Laser Height Y-offset */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-gray-300">Laser Height Offset</span>
                <span className={`font-bold ${selectedPalette.textPrimary}`}>{laserHeight}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="2"
                value={laserHeight}
                onChange={(e) => {
                  setLaserHeight(parseInt(e.target.value));
                  setLaserTargetReached(false);
                }}
                className="w-full accent-emerald-400 h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-gray-500">
                <span>Center Focus (10)</span>
                <span>High Offset (80)</span>
              </div>
            </div>
          </div>

          {/* Interactive Constraint Code Editor */}
          <div className="bg-[#090b11] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-black/60 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Lensmaker Solver (Python)</span>
              </span>
              <span className="text-[8px] font-mono text-gray-500">Constraint Engine v1.0</span>
            </div>

            {/* Code Field */}
            <div className="p-3 bg-[#080a0f] text-xs font-mono text-cyan-400 overflow-x-auto select-none border-b border-white/5 max-h-40 overflow-y-auto leading-relaxed whitespace-pre">
              {pythonCode}
            </div>

            {/* Terminal Log Console */}
            <div className="p-3 bg-black text-[10px] font-mono text-gray-400 h-24 overflow-y-auto space-y-1 select-none">
              <div className="text-gray-500 border-b border-white/5 pb-1 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Compiler Stdout Logs</span>
              </div>
              {terminalOutput.map((log, i) => (
                <div key={i} className={
                  log.startsWith('SUCCESS') ? 'text-emerald-400' :
                  log.startsWith('WARNING') ? 'text-amber-400' :
                  log.startsWith('>>>') ? 'text-cyan-400' : 'text-gray-400'
                }>
                  {log}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="p-2 bg-black/40 border-t border-white/5 flex gap-2">
              <button
                onClick={handleCompileCode}
                disabled={isCompiling}
                className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                  isCompiling
                    ? 'bg-purple-900/40 text-purple-300 border border-purple-800/30 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 hover:scale-102 active:scale-98'
                }`}
              >
                {isCompiling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run & Verify Constraints</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Success banner */}
      {laserTargetReached && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-500/40 flex items-center justify-between gap-4 animate-fade-in z-20 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">STEM Optical Challenge Mastered!</h4>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Excellent! The biconvex lens physical parameters perfectly align to direct the laser beam into the convergence collector sensor.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest font-black">REWARD</span>
            <span className="text-base font-black text-white">+100 XP POINTS</span>
          </div>
        </div>
      )}
    </div>
  );
};

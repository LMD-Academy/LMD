import React, { useState } from 'react';
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  Database,
  Layers,
  Search,
  ExternalLink,
  Zap,
  X,
  FileText,
  Cpu,
  Quote
} from 'lucide-react';
import { ResearchCitationGenerator } from './ResearchCitationGenerator';

interface DeepCrawlRagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeepCrawlRagModal: React.FC<DeepCrawlRagModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('MITx');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(100);

  const PLATFORMS = [
    { name: 'MITx', url: 'https://mitx.mit.edu', coursesCount: 14, iconColor: 'text-rose-400' },
    { name: 'Coursera', url: 'https://coursera.org', coursesCount: 18, iconColor: 'text-blue-400' },
    { name: 'edX', url: 'https://edx.org', coursesCount: 12, iconColor: 'text-purple-400' },
    { name: 'Google Skills', url: 'https://cloud.google.com/training', coursesCount: 15, iconColor: 'text-emerald-400' },
    { name: 'Microsoft Learn', url: 'https://learn.microsoft.com', coursesCount: 11, iconColor: 'text-cyan-400' },
    { name: 'IBM Security & AI', url: 'https://ibm.com/training', coursesCount: 10, iconColor: 'text-blue-500' },
    { name: 'NVIDIA DLI', url: 'https://nvidia.com/dli', coursesCount: 8, iconColor: 'text-lime-400' },
    { name: 'Khan Academy', url: 'https://khanacademy.org', coursesCount: 6, iconColor: 'text-teal-400' },
    { name: 'Edraak', url: 'https://edraak.org', coursesCount: 6, iconColor: 'text-amber-400' }
  ];

  const handleRunCrawl = () => {
    setIsCrawling(true);
    setCrawlProgress(20);

    setTimeout(() => setCrawlProgress(55), 600);
    setTimeout(() => setCrawlProgress(85), 1200);
    setTimeout(() => {
      setCrawlProgress(100);
      setIsCrawling(false);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0d0d16] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with gradient */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Global Academic Crawl & RAG Indexer</h2>
              <p className="text-xs text-gray-400">
                Indexed 100 Degree Programs from Coursera, edX, MITx, Google Skills, Microsoft Learn, IBM, NVIDIA, Khan Academy & Edraak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Crawl Control Header */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Active Target Platform: <span className="text-indigo-300">{selectedPlatform}</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Parsing syllabus trees, lecture notes, video transcripts & grading criteria.
              </div>
            </div>

            <button
              onClick={handleRunCrawl}
              disabled={isCrawling}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin' : ''}`} />
              <span>{isCrawling ? `Crawling... (${crawlProgress}%)` : 'Re-Crawl Target Platform'}</span>
            </button>
          </div>

          {/* Platform Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLATFORMS.map(p => {
              const isSelected = selectedPlatform === p.name;
              return (
                <div
                  key={p.name}
                  onClick={() => setSelectedPlatform(p.name)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/60 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs text-white ${p.iconColor}`}>{p.name}</span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    Indexed Programs: <span className="text-indigo-300 font-semibold">{p.coursesCount}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scraped & Parsed Metadata Breakdown */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Multimodal Vector Embedding Store (Gemini Embedding 2)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] text-gray-400">Total Scraped Documents</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">14,250 Pages</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] text-gray-400">Vector Chunk Size</div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">1,024 Tokens</div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-[10px] text-gray-400">Cosine Similarity Score</div>
                <div className="text-sm font-bold text-purple-400 mt-0.5">0.984 (High Match)</div>
              </div>
            </div>
          </div>

          {/* Research RAG APA/MLA Citation Block Generator Component */}
          <ResearchCitationGenerator />
        </div>
      </div>
    </div>
  );
};

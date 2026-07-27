import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Globe,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  Search,
  Quote
} from 'lucide-react';

export interface CitationItem {
  id: string;
  author: string;
  year: string;
  title: string;
  publisher: string;
  url: string;
  accessDate: string;
  synthesizedExcerpt: string;
}

export const ResearchCitationGenerator: React.FC = () => {
  const [citations, setCitations] = useState<CitationItem[]>([
    {
      id: 'cite-1',
      author: 'Ongaro, D., & Ousterhout, J.',
      year: '2024',
      title: 'In Search of an Understandable Consensus Algorithm (Raft Protocol)',
      publisher: 'USENIX Annual Technical Conference & MIT Press',
      url: 'https://raft.github.io/raft.pdf',
      accessDate: '27 Jul. 2026',
      synthesizedExcerpt: 'Raft decomposes consensus into leader election, log replication, and safety guarantees to simplify distributed state machine replication.'
    },
    {
      id: 'cite-2',
      author: 'Vaswani, A., Shazeer, N., & Parmar, N.',
      year: '2023',
      title: 'Attention Is All You Need: Scalable Multi-Head Self-Attention Architectures',
      publisher: 'Advances in Neural Information Processing Systems (NeurIPS)',
      url: 'https://arxiv.org/abs/1706.03762',
      accessDate: '27 Jul. 2026',
      synthesizedExcerpt: 'The Transformer architecture discards recurrence and convolutions entirely, relying solely on multi-head attention mechanisms to model global dependencies.'
    }
  ]);

  const [activeCitationStyle, setActiveCitationStyle] = useState<'APA' | 'MLA'>('APA');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Citation Form State
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('2026');
  const [url, setUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Formatters
  const formatAPA = (c: CitationItem) => {
    return `${c.author} (${c.year}). ${c.title}. ${c.publisher}. ${c.url}`;
  };

  const formatMLA = (c: CitationItem) => {
    return `${c.author}. "${c.title}." ${c.publisher}, ${c.year}, ${c.url}. Accessed ${c.accessDate}.`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newCitation: CitationItem = {
      id: `cite-${Date.now()}`,
      author: author.trim() || 'Anonymous / Web Source',
      year: year.trim() || '2026',
      title: title.trim(),
      publisher: publisher.trim() || 'Academic Web Index',
      url: url.trim(),
      accessDate: '27 Jul. 2026',
      synthesizedExcerpt: excerpt.trim() || 'Synthesized web content indexed for student project.'
    };

    setCitations([newCitation, ...citations]);
    setAuthor('');
    setTitle('');
    setPublisher('');
    setUrl('');
    setExcerpt('');
    setShowForm(false);
  };

  const handleCopyAllReferences = () => {
    const formattedList = citations
      .map((c, i) =>
        activeCitationStyle === 'APA'
          ? `[${i + 1}] ${formatAPA(c)}`
          : `[${i + 1}] ${formatMLA(c)}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(
      `--- ${activeCitationStyle} COMPLIANT CITATION REFERENCE LIST ---\n\n` + formattedList
    );
    setCopiedId('all-citations');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-[#07131b] border border-[#163647] p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#143242] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              Research RAG Citation Block Engine
            </h3>
            <p className="text-[11px] text-[#63879a]">
              Auto-generate APA (7th Ed) & MLA (9th Ed) references for web synthesized content
            </p>
          </div>
        </div>

        {/* Style Toggle & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#040e13] p-1 rounded-xl border border-[#143242]">
            <button
              onClick={() => setActiveCitationStyle('APA')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCitationStyle === 'APA'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-sm'
                  : 'text-[#63879a] hover:text-white'
              }`}
            >
              APA 7th
            </button>
            <button
              onClick={() => setActiveCitationStyle('MLA')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeCitationStyle === 'MLA'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
                  : 'text-[#63879a] hover:text-white'
              }`}
            >
              MLA 9th
            </button>
          </div>

          <button
            onClick={handleCopyAllReferences}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c222e] hover:bg-[#163647] border border-[#183d52] text-xs text-cyan-300 font-semibold transition-all active:scale-95"
          >
            {copiedId === 'all-citations' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Reference List</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual / Synthesized Citation Add Trigger */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 px-3 rounded-xl bg-[#040e13] hover:bg-[#081821] border border-dashed border-[#183b4d] text-xs text-cyan-400 font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Synthesize Custom Web Source for Citation</span>
        </button>
      ) : (
        <form onSubmit={handleAddCitation} className="p-3.5 rounded-xl bg-[#040e13] border border-[#143445] space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between font-bold text-white border-b border-[#122c3b] pb-2">
            <span>Add Synthesized Web Citation Source</span>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#63879a] hover:text-white text-[11px]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Author(s) (e.g. Smith, J. & Doe, A.)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#507080] focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Source Title (e.g. Machine Learning Systems)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#507080] focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              placeholder="Publisher / Journal / Platform (e.g. IEEE / MITx)"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#507080] focus:outline-none focus:border-cyan-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Year (e.g. 2026)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#507080] focus:outline-none focus:border-cyan-400"
              />
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#507080] focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Synthesized content excerpt used in student project..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-[#0a1c26] border border-[#183a4c] rounded-lg p-2.5 text-xs text-white placeholder-[#507080] focus:outline-none focus:border-cyan-400 resize-none"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Generate & Append Compliant Citation Block
          </button>
        </form>
      )}

      {/* Citations List Cards */}
      <div className="space-y-3">
        {citations.map((item, idx) => {
          const formattedString = activeCitationStyle === 'APA' ? formatAPA(item) : formatMLA(item);

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#051117] border border-[#143242] space-y-2 hover:border-purple-500/40 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-md">
                    {item.title}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-[#63879a] hover:text-white transition-colors"
                  title="Open Source URL"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Synthesized Excerpt */}
              <div className="p-2 rounded-lg bg-[#081822] border border-[#122e3e] text-[11px] text-gray-300 italic font-sans">
                "{item.synthesizedExcerpt}"
              </div>

              {/* Formatted Citation Block */}
              <div className="p-2.5 rounded-lg bg-[#030a0e] border border-[#112938] font-mono text-[11px] text-purple-200 flex items-start justify-between gap-3">
                <div className="leading-relaxed break-all">
                  <span className="text-cyan-400 font-sans font-bold mr-1">[{activeCitationStyle}]</span>
                  {formattedString}
                </div>

                <button
                  onClick={() => handleCopy(formattedString, item.id)}
                  className="px-2 py-1 rounded bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[10px] font-bold shrink-0 border border-purple-500/30 transition-all"
                >
                  {copiedId === item.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

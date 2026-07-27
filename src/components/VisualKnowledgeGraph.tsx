import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Course } from '../types';
import {
  Compass,
  Network,
  BookOpen,
  ArrowRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Search,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface VisualKnowledgeGraphProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: 'course' | 'concept' | 'discipline';
  description: string;
  courseId?: string;
  category?: string;
  val?: number; // visual scale size
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

export const VisualKnowledgeGraph: React.FC<VisualKnowledgeGraphProps> = ({
  courses,
  onSelectCourse
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [d3Simulation, setD3Simulation] = useState<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Fallback default node list if course list is empty
  const defaultCourses: Partial<Course>[] = [
    { id: 'c1', title: 'Generative AI & Agentic Architectures', category: 'ai', tags: ['Gemini', 'LLMs', 'Prompting'] },
    { id: 'c2', title: 'Full-Stack Playwright Scrapers', category: 'automation', tags: ['Scraping', 'Web', 'Steel.dev'] },
    { id: 'c3', title: 'Quantitative Trading with WebSockets', category: 'finance', tags: ['Trading', 'WebSockets', 'Risk'] },
    { id: 'c4', title: 'Next-Gen Vector Databases & RAG', category: 'database', tags: ['VectorDB', 'Embeddings', 'Search'] }
  ];

  const activeCourses = courses && courses.length > 0 ? courses : (defaultCourses as Course[]);

  // Construct nodes and link connections from courses list
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 1. Add major discipline cores
  const disciplines = [
    { id: 'disc-ai', label: 'Artificial Intelligence', group: 'discipline' as const, description: 'Cognitive routers, multi-agent orchestrations, and LLM tuning' },
    { id: 'disc-dev', label: 'Software Engineering', group: 'discipline' as const, description: 'API orchestration, web scrapers, and full-stack environments' },
    { id: 'disc-quant', label: 'Quantitative Analytics', group: 'discipline' as const, description: 'Financial pipelines, risk calculations, and telemetry charts' }
  ];
  disciplines.forEach(d => nodes.push({ ...d, val: 32 }));

  // 2. Add course nodes and connect them to discipline cores
  activeCourses.forEach((c) => {
    const courseNodeId = `course-${c.id}`;
    
    // Determine which discipline core to link this course to
    let discId = 'disc-dev';
    const cat = c.category?.toLowerCase() || '';
    if (cat.includes('ai') || cat.includes('model') || cat.includes('agent')) {
      discId = 'disc-ai';
    } else if (cat.includes('finance') || cat.includes('trade') || cat.includes('quant') || cat.includes('analytic')) {
      discId = 'disc-quant';
    }

    nodes.push({
      id: courseNodeId,
      label: c.title,
      group: 'course',
      description: `Course Module: Explore specialized lectures, interactive STEM labs, and adaptive quizzes.`,
      courseId: c.id,
      category: c.category || 'Core Study',
      val: 22
    });

    // Link course to discipline
    links.push({
      source: discId,
      target: courseNodeId,
      value: 3
    });

    // Add child concept tags from the course
    const tags = c.tags || ['General Topic', 'Theory'];
    tags.forEach((tag) => {
      const conceptNodeId = `concept-${tag.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Add concept node if not already added
      if (!nodes.some(n => n.id === conceptNodeId)) {
        nodes.push({
          id: conceptNodeId,
          label: tag,
          group: 'concept',
          description: `Key STEM Concept: Master ${tag} through hands-on workbench code and visual simulations.`,
          val: 14
        });
      }

      // Link concept node to course
      links.push({
        source: courseNodeId,
        target: conceptNodeId,
        value: 1.5
      });
    });
  });

  // Handle graph layout & render loop
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Use container dimensions or default
    const width = containerRef.current?.clientWidth || 800;
    const height = 480;

    // Clear previous rendering
    d3.select(svgElement).selectAll('*').remove();

    // Initialize D3 zoom behaviour
    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('class', 'graph-content-group');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Initial center viewport zoom positioning
    svg.call(zoomBehavior.transform, d3.zoomIdentity.translate(width / 2 - 100, height / 2 - 80).scale(0.85));

    // Force-directed simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(d => {
        if (d.value === 3) return 110; // discipline to course distance
        return 50; // course to concept distance
      }))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => (d.val || 12) + 12));

    setD3Simulation(simulation);

    // Draw link connections
    const link = g.append('g')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value) * 1.5)
      .attr('stroke', d => {
        if (d.value === 3) return 'rgba(34, 211, 238, 0.25)'; // bright cyan link
        return 'rgba(255, 255, 255, 0.06)';
      });

    // Define glow filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'neon-glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');
    filter.append('feMerge')
      .append('feMergeNode')
      .attr('in', 'blur');
    filter.select('feMerge')
      .append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Draw Nodes group
    const node = g.append('g')
      .attr('class', 'nodes-layer')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group-item')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node circles styling
    node.append('circle')
      .attr('r', d => d.val || 14)
      .attr('fill', d => {
        if (d.group === 'discipline') return 'rgba(14, 116, 144, 0.9)'; // Dark cyan core
        if (d.group === 'course') return 'rgba(124, 58, 237, 0.85)'; // Purple course
        return 'rgba(51, 65, 85, 0.85)'; // slate concept
      })
      .attr('stroke', d => {
        if (d.group === 'discipline') return '#22d3ee'; // bright cyan
        if (d.group === 'course') return '#a78bfa'; // violet
        return '#94a3b8'; // gray
      })
      .attr('stroke-width', d => {
        if (d.group === 'discipline') return 2.5;
        if (d.group === 'course') return 1.8;
        return 1.2;
      })
      .style('filter', d => d.group === 'discipline' ? 'url(#neon-glow)' : 'none');

    // Hover tooltip indicators & highlight triggers
    node.on('mouseover', (event, d) => {
      setHoveredNode(d);
      
      // highlight connections
      link.style('stroke', l => {
        if (l.source === d || l.target === d) return '#22d3ee';
        return 'rgba(255, 255, 255, 0.05)';
      }).style('stroke-opacity', l => {
        if (l.source === d || l.target === d) return 1.0;
        return 0.2;
      });

      d3.select(event.currentTarget).select('circle')
        .transition().duration(150)
        .attr('r', (d.val || 14) * 1.2)
        .style('filter', 'url(#neon-glow)');
    })
    .on('mouseout', (event, d) => {
      setHoveredNode(null);
      link.style('stroke', l => {
        if (l.value === 3) return 'rgba(34, 211, 238, 0.25)';
        return 'rgba(255, 255, 255, 0.06)';
      }).style('stroke-opacity', 0.6);

      d3.select(event.currentTarget).select('circle')
        .transition().duration(150)
        .attr('r', d.val || 14)
        .style('filter', d.group === 'discipline' ? 'url(#neon-glow)' : 'none');
    })
    .on('click', (event, d) => {
      setSelectedNode(d);
    });

    // Add node labels (text)
    node.append('text')
      .attr('dy', d => (d.val || 14) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', d => d.group === 'discipline' ? '11px' : '9px')
      .attr('font-weight', d => d.group === 'concept' ? 'normal' : 'bold')
      .attr('font-family', 'monospace')
      .text(d => d.label.length > 20 ? d.label.substring(0, 18) + '...' : d.label);

    // Update coordinates on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [courses]);

  // Handle searching and highlighting a matching node
  const handleSearchNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    const matched = nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matched) {
      setSelectedNode(matched);
      // Center simulation view on matched node
      if (d3Simulation && svgRef.current) {
        const width = containerRef.current?.clientWidth || 800;
        const height = 480;
        const svg = d3.select(svgRef.current);
        
        svg.transition().duration(750).call(
          // Smoothly animate view offset to focus on match
          d3.zoom<SVGSVGElement, unknown>().transform as any,
          d3.zoomIdentity.translate(width / 2 - (matched.x || 0), height / 2 - (matched.y || 0)).scale(1.1)
        );
      }
    }
  };

  const handleJumpToCourse = () => {
    if (!selectedNode || !selectedNode.courseId) return;
    const matchedCourse = activeCourses.find(c => c.id === selectedNode.courseId);
    if (matchedCourse) {
      onSelectCourse(matchedCourse);
    }
  };

  return (
    <div className="liquid-glass-card border border-[#162e3a] p-6 bg-[#091116]/95 rounded-3xl relative shadow-2xl">
      {/* Decorative Network Grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Upper Panel */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-mono tracking-wider font-black bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/30">
              Interactive Map
            </span>
            <div className="flex items-center gap-1 text-[10px] text-purple-300 font-bold bg-purple-950/40 border border-purple-800/30 px-2 py-0.5 rounded-full">
              <Network className="w-3.5 h-3.5" />
              <span>Force-Directed Concept Mesh</span>
            </div>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-1">
            Dynamic Academy Knowledge Graph
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Spatially visualize interconnected STEM modules and course requirements. Drag concepts, zoom in, or click nodes to jump to related material.
          </p>
        </div>

        {/* Concept Search Bar */}
        <form onSubmit={handleSearchNode} className="flex items-center gap-2 self-stretch md:self-auto">
          <div className="relative flex-1 md:w-60">
            <input
              type="text"
              placeholder="Search concepts or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition-all font-mono"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-cyan-600/20"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Main Grid: D3 Viewport + Side Concept Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">
        {/* D3 Force Canvas (Col span 8) */}
        <div ref={containerRef} className="lg:col-span-8 relative border border-white/10 rounded-2xl overflow-hidden bg-black/50 backdrop-blur-md">
          {/* Zoom Control UI overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
            <button
              onClick={() => {
                if (svgRef.current) {
                  d3.select(svgRef.current).transition().duration(300).call(
                    d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3
                  );
                }
              }}
              className="w-8 h-8 rounded-xl bg-black/85 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (svgRef.current) {
                  d3.select(svgRef.current).transition().duration(300).call(
                    d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7
                  );
                }
              }}
              className="w-8 h-8 rounded-xl bg-black/85 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (svgRef.current) {
                  const width = containerRef.current?.clientWidth || 800;
                  d3.select(svgRef.current).transition().duration(500).call(
                    d3.zoom<SVGSVGElement, unknown>().transform as any,
                    d3.zoomIdentity.translate(width / 2 - 100, 240 - 80).scale(0.85)
                  );
                }
              }}
              className="px-3 h-8 rounded-xl bg-black/85 border border-white/10 text-[10px] font-mono font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Recenter
            </button>
          </div>

          {/* Render SVG */}
          <svg
            ref={svgRef}
            className="w-full h-[450px] block select-none bg-[#020508]/40"
          />

          {/* Hover Status Overlay bar */}
          <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg border border-white/5 text-[9px] font-mono text-gray-400 flex items-center gap-1.5 z-20">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>
              {hoveredNode
                ? `Scanning node: ${hoveredNode.label} (${hoveredNode.group.toUpperCase()})`
                : 'Interactive physics active. Hover nodes to scan relationships.'}
            </span>
          </div>
        </div>

        {/* Side Inspector Details Panel (Col span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#121622]/40 border border-white/10 rounded-2xl p-5 relative overflow-hidden min-h-[450px]">
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

          {selectedNode ? (
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-mono font-black border ${
                  selectedNode.group === 'discipline' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                  selectedNode.group === 'course' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                  'bg-slate-500/20 text-slate-300 border-slate-500/30'
                }`}>
                  {selectedNode.group} Node
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[10px] font-mono text-gray-500 hover:text-white cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {selectedNode.group === 'course' && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Associated Module</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-normal">
                    This node links directly to the verified syllabus curriculum. You can unlock credits and submit projects.
                  </p>
                  <button
                    onClick={handleJumpToCourse}
                    className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    <span>Launch Lesson Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {selectedNode.group === 'concept' && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>Learning Pathway</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Master <strong className="text-white">{selectedNode.label}</strong> to unlock subsequent advanced engineering tracks.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/40 border border-cyan-800/30 flex items-center justify-center text-cyan-400 animate-pulse">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Concept Explorer</h3>
                <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                  Click on any interactive node inside the canvas viewport to inspect its specific details, relationships, and direct jump-links.
                </p>
              </div>
            </div>
          )}

          {/* Socratic Helper bottom stats */}
          <div className="border-t border-white/5 pt-4 text-[10px] font-mono text-gray-500 space-y-1 relative z-10">
            <div className="flex justify-between">
              <span>System nodes:</span>
              <span className="text-cyan-400 font-bold">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Synapse links:</span>
              <span className="text-purple-400 font-bold">{links.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Grounding API:</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

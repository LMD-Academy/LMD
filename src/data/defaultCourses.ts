import { Course, Certificate } from '../types';

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-ai-agentic-systems',
    title: 'Autonomous AI Agent Swarms & Cognitive Architectures',
    category: 'Artificial Intelligence & Computer Science',
    description: 'Master multi-agent orchestration, cognitive reasoning graphs, real-time tool calling, and autonomous memory systems powered by Gemini 3.1 & Antigravity engines.',
    level: 'Advanced',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    author: 'Dr. Zalamati AI Lab',
    rating: 4.9,
    durationHours: 12,
    tags: ['AI Agents', 'Gemini 3.1 Pro', 'RAG Memory', 'Tool Orchestration'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Cognitive Frameworks & Reactive vs Proactive Agents',
        description: 'Fundamentals of agentic loops, perception-action pipelines, and decision graphs.',
        lessons: [
          {
            id: 'les-1-1',
            title: 'Anatomy of an Autonomous Agent',
            durationMinutes: 18,
            content: `Autonomous AI agents differ from static language models by maintaining persistent state, utilizing tools, and executing multi-step goals autonomously.

### Key Pillars of Agentic Systems:
1. **Perception**: Real-time context ingestion via multimodal inputs, WebSockets, or DOM state.
2. **Cognitive Loop (ReAct / Plan-Execute)**: Decomposing high-level goals into deterministic executable steps.
3. **Memory Systems**:
   - **Episodic Memory**: Storing past session execution logs.
   - **Semantic RAG**: High-dimensional vector space search for facts and docs.
   - **Procedural Memory**: Learning tool execution routines over time.
4. **Action & Tool Calling**: Safe execution environments (sandboxed containers, browser automation SDKs).`,
            keyTakeaways: [
              'Agents combine cognition with real-time tool execution.',
              'ReAct pattern loops reasoning and execution back into context.',
              'Tri-tier memory architecture ensures persistence across sessions.'
            ],
            audioScript: 'Welcome to Anatomy of an Autonomous Agent. In this lesson, we break down how modern cognitive loops move beyond simple static prompting into self-directed tool invocation and memory retention.',
            quizzes: [
              {
                id: 'q-1-1-1',
                question: 'Which component enables an agent to retain factual context across multiple sessions?',
                options: [
                  'Ephemeral RAM buffer',
                  'Semantic RAG Memory',
                  'Context Window truncation',
                  'Deterministic Regex parser'
                ],
                correctAnswerIndex: 1,
                explanation: 'Semantic RAG Memory uses vector embeddings to retrieve relevant past facts and documents across sessions.',
                hint: 'Think about high-dimensional vector spaces.'
              },
              {
                id: 'q-1-1-2',
                question: 'What is the primary advantage of the ReAct (Reasoning + Acting) loop?',
                options: [
                  'It reduces GPU memory usage to zero',
                  'It continuously feeds tool outputs back into the model context for re-evaluation',
                  'It prevents the agent from making network calls',
                  'It translates code into binary instructions directly'
                ],
                correctAnswerIndex: 1,
                explanation: 'The ReAct loop evaluates tool outputs iteratively, allowing the agent to dynamically adapt its next action based on reality.',
                hint: 'It loops tool feedback into the prompt.'
              }
            ],
            flashcards: [
              {
                id: 'fc-1',
                front: 'What is ReAct in Agentic AI?',
                back: 'A design pattern combining Reasoning (thinking steps) and Acting (calling external tools or functions) in a continuous loop.'
              },
              {
                id: 'fc-2',
                front: 'Difference between Episodic and Semantic Memory?',
                back: 'Episodic memory logs specific past events/sessions; Semantic memory indexes facts and concept embeddings.'
              }
            ]
          },
          {
            id: 'les-1-2',
            title: 'Multi-Agent Swarms & Consensus Algorithms',
            durationMinutes: 24,
            content: `When a single agent encounters token limits or domain bottlenecks, multi-agent swarms divide responsibility across specialized roles.

### Swarm Topology:
- **Orchestrator-Worker Pattern**: A central manager delegates tasks to specialized sub-agents (e.g. Coder Agent, Reviewer Agent, Tester Agent).
- **Consensus Voting**: Multiple agents generate solutions in parallel and vote on the highest-confidence result.
- **Handoff Protocols**: Smooth transition of execution state between edge agents and cloud macro-engines.`,
            keyTakeaways: [
              'Multi-agent systems increase concurrency and specialization.',
              'Orchestrator agents balance cognitive workload across workers.',
              'Consensus voting reduces hallucination rates in critical decision making.'
            ],
            audioScript: 'In Multi-Agent Swarms, we learn how specialized sub-agents collaborate using handoff protocols and consensus voting to solve complex enterprise challenges.',
            quizzes: [
              {
                id: 'q-1-2-1',
                question: 'How does an Orchestrator-Worker pattern manage complex tasks?',
                options: [
                  'By forcing all tasks through a single monolithic prompt',
                  'By delegating sub-tasks to specialized domain agents and aggregating results',
                  'By ignoring error logs from workers',
                  'By converting all code to assembly language'
                ],
                correctAnswerIndex: 1,
                explanation: 'The orchestrator breaks the macro task down and delegates specific sub-problems to specialized worker agents.',
                hint: 'Delegation and aggregation.'
              }
            ],
            flashcards: [
              {
                id: 'fc-3',
                front: 'What is Consensus Voting in Multi-Agent systems?',
                back: 'An approach where multiple independent agents generate answers to the same query, and a coordinator selects the most consistent or validated response.'
              }
            ]
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Real-Time Multimodal Stream Processing',
        description: 'Handling audio, video, and live WebSockets with low latency model pipelines.',
        lessons: [
          {
            id: 'les-2-1',
            title: 'Low Latency Audio & Live API Streaming',
            durationMinutes: 20,
            content: `Real-time human-AI interaction requires sub-500ms audio response loops using WebSockets and 16kHz PCM audio streaming.

### Audio Pipeline Architecture:
- **Input**: Microphone capture at 16,000 Hz, converted to 16-bit little-endian PCM base64 chunks.
- **Transport**: Full-duplex WebSocket connection to model Live API endpoint.
- **Output**: 24,000 Hz PCM audio buffer playback with gapless scheduling using Web Audio API AudioContext.`,
            keyTakeaways: [
              'Use 16kHz for mic input and 24kHz for model playback.',
              'Schedule audio buffers with precise start times to eliminate jitter gaps.',
              'Full-duplex WebSockets enable low-latency bidirectional voice.'
            ],
            audioScript: 'In this lesson, we explore low-latency streaming audio pipelines. Learn how to handle 16kHz PCM audio capture and 24kHz buffer playback without pitch distortion or audio gaps.',
            quizzes: [
              {
                id: 'q-2-1-1',
                question: 'What sample rate is required for Live API audio input streaming in Gemini?',
                options: ['44,100 Hz', '16,000 Hz', '8,000 Hz', '96,000 Hz'],
                correctAnswerIndex: 1,
                explanation: 'The standard input sample rate for Gemini Live audio input is 16,000 Hz PCM.',
                hint: '16kHz standard.'
              }
            ],
            flashcards: [
              {
                id: 'fc-4',
                front: 'How to avoid audio stutter in Web Audio playback?',
                back: 'Maintain a cumulative nextStartTime variable and schedule each AudioBufferSourceNode with source.start(nextStartTime).'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-quantum-computing',
    title: 'Quantum Computing & Advanced Algorithmic Physics',
    category: 'Physics & Deep Tech',
    description: 'Explore qubit state vectors, quantum entanglement, Shor and Grover algorithms, and practical quantum circuit simulation.',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    author: 'Quantum Academy Network',
    rating: 4.8,
    durationHours: 10,
    tags: ['Quantum Physics', 'Qubits', 'Grover Algorithm', 'Quantum Circuits'],
    modules: [
      {
        id: 'mod-q1',
        title: 'Module 1: Superposition, Entanglement & Qubit Math',
        description: 'Linear algebra of quantum bits, Dirac notation, and Bloch Sphere geometry.',
        lessons: [
          {
            id: 'les-q1-1',
            title: 'Qubit State Representation & Bloch Sphere',
            durationMinutes: 22,
            content: `Unlike classical bits that hold binary values 0 or 1, a qubit exists in a linear superposition of state vectors.

$$\\vert \\psi \\rangle = \\alpha \\vert 0 \\rangle + \\beta \\vert 1 \\rangle$$

Where $\\vert \\alpha \\vert^2 + \\vert \\beta \\vert^2 = 1$.

### Bloch Sphere Geometry:
- **North Pole**: State $\\vert 0 \\rangle$
- **South Pole**: State $\\vert 1 \\rangle$
- **Equator**: Equal weight superposition states (e.g. Hadamard transformation).`,
            keyTakeaways: [
              'Qubits harness superposition to store complex probability amplitudes.',
              'Measuring a qubit collapses its state probabilistically.',
              'Bloch sphere visualizes pure single-qubit states geometrically.'
            ],
            audioScript: 'Welcome to Quantum Bit Representation. In this lesson we master superposition, state amplitudes, and geometrical visualization on the Bloch Sphere.',
            quizzes: [
              {
                id: 'q-q1-1',
                question: 'What happens when a superposition state qubit is measured classically?',
                options: [
                  'It doubles its state amplitudes',
                  'It collapses probabilistically into a definite state |0> or |1>',
                  'It remains in superposition indefinitely',
                  'It emits a photon of ultraviolet light'
                ],
                correctAnswerIndex: 1,
                explanation: 'Quantum measurement forces the wavefunction to collapse into one of the eigenbasis states.',
                hint: 'Wavefunction collapse.'
              }
            ],
            flashcards: [
              {
                id: 'fc-q1',
                front: 'What does the Hadamard Gate do?',
                back: 'It transforms basis states |0> and |1> into equal superposition states (|0>+|1>)/√2 and (|0>-|1>)/√2.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-executive-strategy',
    title: 'Enterprise Business AI Transformation & Strategy',
    category: 'Business & Management',
    description: 'Strategic frameworks for implementing enterprise AI, ROI evaluation, ethical governance, and change management.',
    level: 'Beginner',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    author: 'Zalamati Global Leadership Council',
    rating: 4.9,
    durationHours: 8,
    tags: ['Business Strategy', 'Enterprise AI', 'ROI', 'Governance'],
    modules: [
      {
        id: 'mod-b1',
        title: 'Module 1: Building the Enterprise AI Roadmap',
        description: 'Evaluating automation ROI, team upskilling, and data infrastructure readiness.',
        lessons: [
          {
            id: 'les-b1-1',
            title: 'Value Matrix & High-Impact AI Use Cases',
            durationMinutes: 15,
            content: `Enterprise AI adoption requires balancing business impact against implementation feasibility.

### The 2x2 AI Value Matrix:
1. **Quick Wins**: High ROI, Low Technical Complexity (e.g., Customer Support Copilots, Automated Document Parsing).
2. **Strategic Bets**: High ROI, High Technical Complexity (e.g., Autonomous Supply Chain Optimization, Predictive R&D).
3. **Fill-Ins**: Low ROI, Low Complexity (e.g., Internal FAQ Bot).
4. **Money Pits**: Low ROI, High Complexity (Avoid!).`,
            keyTakeaways: [
              'Target Quick Wins first to build organizational momentum.',
              'Quantify ROI using metric improvements in speed, accuracy, and labor hours.',
              'Establish strong data security guidelines before scaling.'
            ],
            audioScript: 'In Enterprise AI Strategy, we evaluate the 2x2 value matrix to identify high-impact AI investments that deliver fast ROI while building organizational readiness.',
            quizzes: [
              {
                id: 'q-b1-1',
                question: 'Which quadrant of the AI Value Matrix should enterprises prioritize first?',
                options: ['Money Pits', 'Quick Wins', 'Fill-Ins', 'Speculative Experiments'],
                correctAnswerIndex: 1,
                explanation: 'Quick Wins deliver high ROI with low implementation complexity, establishing trust and funding further innovation.',
                hint: 'High ROI, low friction.'
              }
            ],
            flashcards: [
              {
                id: 'fc-b1',
                front: 'What defines a Strategic Bet in AI roadmap planning?',
                back: 'A project with high long-term transformative business value but higher technical and integration complexity.'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-101',
    verificationId: 'ZAL-2026-88942-AI',
    studentName: 'Alex Rivera',
    courseTitle: 'Autonomous AI Agent Swarms & Cognitive Architectures',
    issuedDate: 'July 2026',
    score: 98,
    instructorName: 'Dr. Zalamati AI Lab',
    institutionName: 'Zalamati Global eLearning Academy',
    skillsAcquired: ['Multi-Agent Swarms', 'Gemini 3.1 Orchestration', 'RAG Memory Systems', 'Live API WebSockets']
  }
];

import { Course, Module, Lesson } from '../types';

export interface DegreeMetadata {
  institution: string;
  degreeLevel: 'Bachelor of Science (B.S.)' | 'Master of Science (M.S.)' | 'Bachelor of Engineering (B.Eng.)' | 'Master of Engineering (M.Eng.)';
  credits: number;
  tracks: string[];
  careerOutcomes: string[];
  accreditation: string;
  crawledSource: string;
}

export interface DegreeCourse extends Course {
  degreeMetadata: DegreeMetadata;
}

// Key Academic Discipline Domains
const DISCIPLINE_DOMAINS = [
  {
    category: 'Autonomous AI & Cognitive Systems',
    partner: 'LMDpro AI Research Faculty',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-teal-600 to-cyan-700',
    topics: [
      { name: 'M.S. in Autonomous AI Swarms & Antigravity Reasoning', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Applied Machine Learning & Agentic Systems', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Deep Neural Architectures & Transformer Engineering', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Cognitive Computer Vision & Spatial AI', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Generative AI Systems & Large Multimodal Models', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Natural Language Processing & Semantic Search', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Embodied AI & Humanoid Robotics Intelligence', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Reinforcement Learning & Autonomous Control', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Neuromorphic Computing & Spiking Neural Networks', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Speech Processing & Conversational AI Systems', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Cloud Engineering & Distributed Systems',
    partner: 'LMDpro Systems Institute',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-cyan-700 to-blue-700',
    topics: [
      { name: 'M.S. in Cloud Architecture & Serverless Microservices', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Cloud Infrastructure & Systems Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Distributed Systems & Resilient Database Engineering', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in DevOps, CI/CD Pipelines & Site Reliability Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Multi-Cloud Native Architecture & Kubernetes', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Linux Systems Programming & Virtualization', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Edge Cloud Computing & IoT Mesh Systems', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Network Infrastructure & Cloud Communications', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Platform Engineering & Infrastructure as Code', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Enterprise Cloud Operations & Cost Optimization', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Cybersecurity, Cryptography & Defense',
    partner: 'LMDpro Security Lab',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-slate-700 to-teal-800',
    topics: [
      { name: 'M.S. in Post-Quantum Cryptography & Zero-Trust Security', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Cybersecurity Operations & Threat Intelligence', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Offensive Cyber Operations & Penetration Testing', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Digital Forensics & Incident Response Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Cloud Security Architecture & DevSecOps', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Network Security & Intrusion Detection Systems', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Blockchain Security & Smart Contract Auditing', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Identity Management & Access Control Systems', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in AI Security, Adversarial Robustness & Safety', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Information Assurance & Compliance Standards', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Data Science, Analytics & Big Data',
    partner: 'LMDpro Data Science Center',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-emerald-700 to-teal-700',
    topics: [
      { name: 'M.S. in Enterprise Data Science & Predictive Analytics', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Data Analytics & Quantitative Decision Making', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Big Data Engineering & Real-Time Stream Processing', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Applied Statistics & Business Intelligence', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Causal Inference & Machine Learning Experiments', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Data Visualization & Storytelling Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Spatial Data Analytics & Geographic Information Systems', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Data Governance, Ethics & Privacy Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Graph Neural Networks & Complex Data Mining', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Database Administration & SQL Optimization', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Full-Stack Software Engineering',
    partner: 'LMDpro Engineering Academy',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-teal-700 to-blue-800',
    topics: [
      { name: 'M.S. in Modern Full-Stack Systems & High-Velocity Architecture', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Software Engineering & Web Application Development', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Mobile Operating Systems & Cross-Platform Engineering', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Front-End Engineering & Advanced UI/UX Frameworks', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Microservices, GraphQL & Event-Driven APIs', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Back-End Engineering with Node.js, Go & Rust', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Software Testing, Automation & Formal Verification', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Human-Computer Interaction & Interactive Design', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Progressive Web Apps & WebAssembly Engineering', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Object-Oriented Design & Clean Code Architecture', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Robotics, Embodied AI & IoT',
    partner: 'LMDpro Robotics Institute',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-teal-600 to-emerald-800',
    topics: [
      { name: 'M.S. in Embodied Robotics & Autonomous Navigation (SLAM)', level: 'Master of Engineering (M.Eng.)' as const },
      { name: 'B.S. in Mechatronics & Robotics Systems Engineering', level: 'Bachelor of Engineering (B.Eng.)' as const },
      { name: 'M.S. in Industrial Automation & Physical AI Twin Systems', level: 'Master of Engineering (M.Eng.)' as const },
      { name: 'B.S. in IoT Hardware Engineering & Embedded Sensors', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Drone Flight Dynamics & Autonomous Aerial Swarms', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Microcontroller Programming & RTOS Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Robotic Perception, Lidar & Sensor Fusion', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Computer Integrated Manufacturing & CAD Automation', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Bionic Prosthetics & Neural Engineering Interfaces', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Smart Home Systems & Wireless Sensor Networks', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Quantum Computing & Theoretical Physics',
    partner: 'LMDpro Quantum Center',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-indigo-800 to-slate-800',
    topics: [
      { name: 'M.S. in Quantum Information Science & Quantum Algorithms', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Quantum Physics & Computational Mechanics', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Quantum Hardware, Qubits & Cryogenic Systems', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Applied Mathematics & Quantum Computing Basics', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Quantum Error Correction & Fault-Tolerant AI', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Mathematical Physics & Linear Algebra Systems', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Quantum Cryptography & Key Distribution Networks', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in High-Energy Physics & Particle Simulations', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Quantum Machine Learning & Tensor Networks', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Theoretical Computer Science & Complexity Theory', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'FinTech, Blockchain & Quantitative Finance',
    partner: 'LMDpro Finance & Tech Institute',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-cyan-800 to-teal-900',
    topics: [
      { name: 'M.S. in Quantitative Finance & Algorithmic Trading Engines', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Financial Engineering & Risk Analytics', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Decentralized Finance (DeFi) & Smart Contracts', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Blockchain Development & Distributed Ledgers', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Computational Financial Modeling & Stochastic Calculi', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in FinTech Product Architecture & Digital Payments', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in High-Frequency Trading & Market Microstructure', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Corporate Financial Analytics & Portfolio Science', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in AI in Asset Management & Automated Risk Control', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Global Banking Technology & Compliance Systems', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'Bioinformatics & Digital Healthcare Technology',
    partner: 'LMDpro Health Technology Faculty',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-emerald-800 to-cyan-900',
    topics: [
      { name: 'M.S. in Computational Biology & Genomic Data Science', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Health Informatics & Electronic Medical Records', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in AI Medical Imaging & Diagnostic Computer Vision', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Digital Health Technologies & Wearable Devices', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Drug Discovery with Generative AI & Protein Folding', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Biomedical Engineering Systems & Signal Analysis', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Precision Medicine & Clinical Trial Data Science', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Medical Software Compliance & HIPAA Security', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Neuroscience & Brain-Computer Interface Systems', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Public Health Analytics & Epidemiological Modeling', level: 'Bachelor of Science (B.S.)' as const },
    ]
  },
  {
    category: 'AI Product Leadership & Digital Business',
    partner: 'LMDpro School of Management',
    crawledSource: 'LMDpro Academic Board',
    color: 'from-blue-700 to-indigo-900',
    topics: [
      { name: 'M.S. in AI Product Management & Enterprise Strategy', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Business Information Systems & Digital Leadership', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Technology Operations & Digital Transformation', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Agility, Scrum & Product Lifecycle Engineering', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Tech Entrepreneurship & Venture Architecture', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in E-Commerce Engineering & Growth Analytics', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in AI Ethics, Technology Governance & Policy', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in Digital Marketing Analytics & MarTech Systems', level: 'Bachelor of Science (B.S.)' as const },
      { name: 'M.S. in Supply Chain Optimization & AI Logistics', level: 'Master of Science (M.S.)' as const },
      { name: 'B.S. in User Research, Product Analytics & UX Metrics', level: 'Bachelor of Science (B.S.)' as const },
    ]
  }
];

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop'
];

function generateDegreeModules(programName: string, category: string): Module[] {
  return [
    {
      id: `mod-core-1`,
      title: `Module 1: Foundations & Core Architecture of ${programName.replace(/(M\.S\.|B\.S\.|M\.Eng\.|B\.Eng\.) in /, '')}`,
      description: `Comprehensive academic and practical foundations. Deep dive into theoretical frameworks and industry implementation practices.`,
      lessons: [
        {
          id: `les-1-1`,
          title: `Core Principles & Theoretical Paradigm`,
          durationMinutes: 45,
          content: `This course covers foundational principles, mathematical models, and architectural standards in ${programName}.\n\n### Core Academic Objectives:\n1. Master the mathematical models and structural foundations.\n2. Apply research-backed methodologies to enterprise systems.\n3. Implement real-world solutions using modern software engineering standards.\n\n### Practical Implementation:\nStudents utilize automated development environments, cloud infrastructure pipelines, and vector-backed knowledge graphs to build robust solutions.`,
          keyTakeaways: [
            'Master core theoretical and applied foundations.',
            'Develop hands-on competence with modern industry toolchains.',
            'Understand safety, performance, and scalability trade-offs.'
          ],
          audioScript: `Welcome to the core foundational lesson of ${programName}. We examine theoretical models alongside production implementation.`,
          quizzes: [
            {
              id: `q-1-1`,
              question: `What is the primary objective of this introductory module in ${programName}?`,
              options: [
                'To establish theoretical and practical competence in core frameworks',
                'To complete a superficial quick-start without depth',
                'To bypass foundational theory entirely',
                'To focus solely on legacy deprecated platforms'
              ],
              correctAnswerIndex: 0,
              explanation: 'Degree-level programs build rigorous theoretical comprehension combined with hands-on technical execution.',
              hint: 'Look for standard degree rigor.'
            }
          ],
          flashcards: [
            {
              id: `fc-1-1`,
              front: `Key Paradigm in ${programName.split(' ')[0]} Studies`,
              back: 'Integrating rigorous academic theory with real-time, production-ready engineering capabilities.'
            }
          ]
        },
        {
          id: `les-1-2`,
          title: `Advanced Design Patterns & System Architectures`,
          durationMinutes: 60,
          content: `In-depth analysis of architectural design patterns, distributed state handling, and component optimization.`,
          keyTakeaways: [
            'Analyze modern design patterns and execution pipelines.',
            'Optimize system throughput and minimize latency.',
            'Ensure full compliance with security and audit standards.'
          ],
          audioScript: `In this second lesson, we explore design patterns and system architecture optimizations required for high-availability deployments.`,
          quizzes: [
            {
              id: `q-1-2`,
              question: 'Which design strategy ensures system resilience during high concurrency workloads?',
              options: [
                'Distributed load management with failover routing',
                'Single-point centralized dependency',
                'Unencrypted unbuffered memory allocation',
                'Ignoring error telemetry logs'
              ],
              correctAnswerIndex: 0,
              explanation: 'Distributed load management with failover ensures continuous service availability and fault tolerance.',
              hint: 'Think about redundancy and distribution.'
            }
          ],
          flashcards: [
            {
              id: `fc-1-2`,
              front: 'What defines a robust system architecture?',
              back: 'Fault tolerance, low latency, clear separation of concerns, and verifiable state persistence.'
            }
          ]
        }
      ]
    },
    {
      id: `mod-core-2`,
      title: `Module 2: Advanced Implementation & Enterprise Deployment`,
      description: `Hands-on lab work, algorithm optimization, and enterprise integration strategies.`,
      lessons: [
        {
          id: `les-2-1`,
          title: `Enterprise Production Engineering & Real-World Case Studies`,
          durationMinutes: 50,
          content: `Focuses on deploying models, tools, and algorithms into enterprise infrastructure. Examines real-world case studies from industry leaders.`,
          keyTakeaways: [
            'Deploy scalable solutions to cloud and edge environments.',
            'Integrate automated testing and continuous deployment (CI/CD).',
            'Conduct comprehensive security and performance audits.'
          ],
          audioScript: `Module 2 brings your theoretical knowledge to life through enterprise production labs and real-world case studies.`,
          quizzes: [
            {
              id: `q-2-1`,
              question: 'Why is automated CI/CD critical in modern software degree programs?',
              options: [
                'It guarantees repeatable, tested releases without manual error',
                'It slows down release cycles intentionally',
                'It removes the need for version control',
                'It replaces developer code reviews'
              ],
              correctAnswerIndex: 0,
              explanation: 'CI/CD automates testing and deployment to ensure rapid, error-free iterations.',
              hint: 'Automation yields reliability.'
            }
          ],
          flashcards: [
            {
              id: `fc-2-1`,
              front: 'Role of CI/CD in production systems?',
              back: 'Automating build, test, and release cycles to ensure quality and prevent regressions.'
            }
          ]
        }
      ]
    },
    {
      id: `mod-capstone-3`,
      title: `Module 3: Degree Capstone Project & Peer Defense`,
      description: `Synthesize all program learnings to design, build, and defend an original capstone project reviewed by academic advisors.`,
      lessons: [
        {
          id: `les-3-1`,
          title: `Capstone Defense & Industry Portfolio Submission`,
          durationMinutes: 90,
          content: `The final degree milestone requires designing a fully operational prototype, submitting comprehensive documentation, and presenting a formal defense.\n\n### Deliverables:\n1. **Full Operational Source Code & Repository**.\n2. **Academic Research Paper / Technical Specification**.\n3. **Live Demonstration & Peer Evaluation**.\n4. **Verified Degree Certificate Generation**.`,
          keyTakeaways: [
            'Synthesize multi-disciplinary knowledge into a complete capstone project.',
            'Author professional technical documentation and research papers.',
            'Earn an accredited, shareable digital degree credential.'
          ],
          audioScript: `Congratulations on reaching the final Capstone milestone. Prepare your portfolio, defend your implementation, and claim your degree certificate.`,
          quizzes: [
            {
              id: `q-3-1`,
              question: 'What is required to complete the Master/Bachelor Capstone project?',
              options: [
                'Fully operational project codebase, technical documentation, and presentation defense',
                'A single multiple-choice quiz with no project work',
                'Only an attendance check',
                'Reading one introductory textbook'
              ],
              correctAnswerIndex: 0,
              explanation: 'Degree capstones demonstrate complete mastery through working code, technical write-ups, and oral defense.',
              hint: 'Full operational demonstration.'
            }
          ],
          flashcards: [
            {
              id: `fc-3-1`,
              front: 'Purpose of the Degree Capstone?',
              back: 'Demonstrate comprehensive domain mastery through applied design, implementation, and academic defense.'
            }
          ]
        }
      ]
    }
  ];
}

// Generate the complete list of Degree Programs
export const DEGREE_PROGRAMS: DegreeCourse[] = Array.from({ length: 100 }, (_, index) => {
  const domainIndex = Math.floor(index / 10);
  const topicIndex = index % 10;
  const domain = DISCIPLINE_DOMAINS[domainIndex];
  const topic = domain.topics[topicIndex];
  
  const id = `degree-prog-${index + 1}`;
  const isMaster = topic.level.includes('Master');
  const credits = isMaster ? 36 : 120;
  const durationHours = isMaster ? 48 : 96;

  const coverImage = COVER_IMAGES[index % COVER_IMAGES.length];

  return {
    id,
    title: topic.name,
    category: domain.category,
    description: `A comprehensive ${topic.level} program delivered by ${domain.partner}. Features structured academic modules, practical laboratory assignments, interactive evaluations, and capstone degree defense.`,
    level: isMaster ? 'Advanced' : 'Intermediate',
    coverImage,
    author: 'LMDpro Academic Faculty',
    rating: Number((4.7 + (index % 4) * 0.08).toFixed(1)),
    durationHours,
    modules: generateDegreeModules(topic.name, domain.category),
    tags: [
      topic.level.includes('Master') ? 'M.S. Degree' : 'B.S. Degree',
      domain.category.split(' ')[0],
      'LMDpro Certified',
      'Accredited'
    ],
    isAiGenerated: false,
    degreeMetadata: {
      institution: 'LMDpro Institute of Technology',
      degreeLevel: topic.level,
      credits,
      tracks: [domain.category, 'Applied Research', 'Enterprise Systems'],
      careerOutcomes: [
        `${isMaster ? 'Lead / Principal' : 'Senior'} ${domain.category.split(' ')[0]} Engineer`,
        'Academic & Industry Research Specialist',
        'Solutions Architect'
      ],
      accreditation: 'LMDpro Academic Board & ISO 21001 Certified',
      crawledSource: 'LMDpro Academic Repository'
    }
  };
});

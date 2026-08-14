import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import neo4j from 'neo4j-driver';

const uri = process.env.COGNODB_URI!;
const username = process.env.COGNODB_USERNAME!;
const password = process.env.COGNODB_PASSWORD!;

if (!uri || !username || !password) {
  console.error('Missing CognoDB credentials in .env.local');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
  maxConnectionPoolSize: 20,
  connectionTimeout: 30000,
});

// Seed data definitions
const domains = [
  { name: 'Web Development', description: 'Building web applications, browsers, and HTTP services', icon: 'globe' },
  { name: 'Machine Learning', description: 'Statistical modeling, deep learning, and predictive AI systems', icon: 'brain' },
  { name: 'Cloud & Infrastructure', description: 'Distributed computing, serverless architectures, and virtualization', icon: 'cloud' },
  { name: 'DevOps & CI/CD', description: 'Automated build, test, deployment, and infrastructure orchestration', icon: 'infinity' },
  { name: 'Data Engineering', description: 'Large-scale batch and streaming data pipelines, storage, and processing', icon: 'database' },
  { name: 'Computer Vision', description: 'Visual pattern recognition, object detection, and image analysis', icon: 'eye' },
  { name: 'Backend Engineering', description: 'High-throughput server architectures, distributed databases, and APIs', icon: 'server' },
  { name: 'Frontend Engineering', description: 'User interface development, state management, and 3D web graphics', icon: 'layout' },
  { name: 'Graph Systems & Analytics', description: 'Network analysis, graph databases, context graphs, and GraphRAG', icon: 'share-2' },
  { name: 'Security & Auth', description: 'Zero-trust architecture, identity management, and application security', icon: 'shield' },
];

const languages = [
  { name: 'TypeScript', description: 'Typed superset of JavaScript compiling to clean JavaScript', paradigm: 'Multi-paradigm', typedSystem: 'Static', year: 2012 },
  { name: 'Python', description: 'High-level interpreted language prized for AI, ML, and web servers', paradigm: 'Multi-paradigm', typedSystem: 'Dynamic', year: 1991 },
  { name: 'JavaScript', description: 'Core programming language of the modern web platform', paradigm: 'Multi-paradigm', typedSystem: 'Dynamic', year: 1995 },
  { name: 'Rust', description: 'Memory-safe systems programming language without garbage collection', paradigm: 'Multi-paradigm', typedSystem: 'Static', year: 2010 },
  { name: 'Go', description: 'Statically typed compiled language designed for concurrency and microservices', paradigm: 'Concurrent', typedSystem: 'Static', year: 2009 },
  { name: 'C++', description: 'High-performance systems programming language with direct memory control', paradigm: 'Multi-paradigm', typedSystem: 'Static', year: 1985 },
  { name: 'Java', description: 'Object-oriented enterprise language running on the JVM', paradigm: 'Object-oriented', typedSystem: 'Static', year: 1995 },
  { name: 'SQL', description: 'Domain-specific language for relational database queries', paradigm: 'Declarative', typedSystem: 'Static', year: 1974 },
  { name: 'Cypher', description: 'Declarative graph query language for property graphs', paradigm: 'Declarative', typedSystem: 'Dynamic', year: 2012 },
  { name: 'Kotlin', description: 'Modern concise JVM and multiplatform language', paradigm: 'Multi-paradigm', typedSystem: 'Static', year: 2011 },
  { name: 'Swift', description: 'Apple systems and client application programming language', paradigm: 'Multi-paradigm', typedSystem: 'Static', year: 2014 },
  { name: 'GraphQL Query', description: 'Declarative client-driven data specification language', paradigm: 'Declarative', typedSystem: 'Static', year: 2015 },
];

const technologies = [
  { name: 'Next.js', category: 'Fullstack Framework', description: 'The React framework for production-grade web applications with SSR and ISR', website: 'https://nextjs.org' },
  { name: 'React', category: 'Frontend UI', description: 'Component-based JavaScript library for building responsive user interfaces', website: 'https://react.dev' },
  { name: 'Three.js', category: '3D Graphics', description: 'Cross-browser WebGL library for cinematic 3D graphics in browser', website: 'https://threejs.org' },
  { name: 'FastAPI', category: 'Backend Framework', description: 'High-performance modern Python API framework with automatic OpenAPI docs', website: 'https://fastapi.tiangolo.com' },
  { name: 'PyTorch', category: 'Machine Learning', description: 'Dynamic neural network library for deep learning research and deployment', website: 'https://pytorch.org' },
  { name: 'TensorFlow', category: 'Machine Learning', description: 'End-to-end open source platform for machine learning from Google', website: 'https://tensorflow.org' },
  { name: 'Docker', category: 'DevOps & Containers', description: 'OS-level virtualization delivering software in lightweight packages', website: 'https://docker.com' },
  { name: 'Kubernetes', category: 'Cloud Orchestration', description: 'Automated container deployment, scaling, and operational management', website: 'https://kubernetes.io' },
  { name: 'CognoDB', category: 'Graph Database', description: 'Cloud-native context graph database with sub-millisecond multi-hop traversal', website: 'https://cognodb.com' },
  { name: 'Neo4j', category: 'Graph Database', description: 'Native graph database platform using property graphs and openCypher', website: 'https://neo4j.com' },
  { name: 'PostgreSQL', category: 'Relational Database', description: 'Advanced open-source relational database with robust ACID compliance', website: 'https://postgresql.org' },
  { name: 'Redis', category: 'In-Memory Store', description: 'Ultra-fast in-memory key-value cache and message broker', website: 'https://redis.io' },
  { name: 'Kafka', category: 'Data Streaming', description: 'Distributed event streaming platform for high-performance data pipelines', website: 'https://kafka.apache.org' },
  { name: 'OpenCV', category: 'Computer Vision', description: 'Comprehensive library for computer vision and real-time image processing', website: 'https://opencv.org' },
  { name: 'AWS Lambda', category: 'Serverless Cloud', description: 'Event-driven serverless computing service running code without server management', website: 'https://aws.amazon.com/lambda' },
  { name: 'Tailwind CSS', category: 'CSS Framework', description: 'Utility-first CSS framework for rapid and modern user interface styling', website: 'https://tailwindcss.com' },
  { name: 'Node.js', category: 'Backend Runtime', description: 'Asynchronous event-driven JavaScript runtime built on Chrome V8 engine', website: 'https://nodejs.org' },
  { name: 'Django', category: 'Backend Framework', description: 'Batteries-included Python web framework for clean and rapid development', website: 'https://djangoproject.com' },
  { name: 'GraphQL', category: 'API Architecture', description: 'Data query and manipulation language for flexible and strongly typed APIs', website: 'https://graphql.org' },
  { name: 'GitHub Actions', category: 'CI/CD Automation', description: 'Automate build, test, and deployment workflows directly inside GitHub', website: 'https://github.com/features/actions' },
  { name: 'Elasticsearch', category: 'Search Engine', description: 'Distributed JSON-based search and analytics engine for structured text', website: 'https://elastic.co' },
  { name: 'Vercel', category: 'Cloud Platform', description: 'Frontend cloud platform optimizing Next.js deployment and global edge routing', website: 'https://vercel.com' },
  { name: 'GSAP', category: 'Animation Engine', description: 'Professional-grade JavaScript animation library with ScrollTrigger capabilities', website: 'https://gsap.com' },
  { name: 'MongoDB', category: 'Document Database', description: 'Flexible schema document database storing data in JSON-like structures', website: 'https://mongodb.com' },
  { name: 'Terraform', category: 'Infrastructure as Code', description: 'Declarative tool for provisioning multi-cloud infrastructure safely', website: 'https://terraform.io' },
];

const skills = [
  { name: '3D Web Development', category: 'Frontend', description: 'Building interactive WebGL and 3D scenes with shaders and lighting', level: 'Advanced' },
  { name: 'Graph Modeling', category: 'Data', description: 'Designing property graph schemas, labels, relationships, and traversal paths', level: 'Expert' },
  { name: 'Cypher Query Optimization', category: 'Data', description: 'Writing efficient openCypher queries, query plans, and index lookups', level: 'Advanced' },
  { name: 'Deep Learning', category: 'Machine Learning', description: 'Training convolutional, transformer, and recurrent neural networks', level: 'Expert' },
  { name: 'Computer Vision Processing', category: 'Machine Learning', description: 'Real-time image segmentation, optical flow, and object classification', level: 'Advanced' },
  { name: 'Container Orchestration', category: 'DevOps', description: 'Deploying, auto-scaling, and managing Kubernetes pods and services', level: 'Advanced' },
  { name: 'CI/CD Pipeline Automation', category: 'DevOps', description: 'Building automated testing, linting, Docker builds, and deployment gates', level: 'Intermediate' },
  { name: 'REST API Architecture', category: 'Backend', description: 'Designing clean, stateless, versioned REST endpoints with OpenAPI contracts', level: 'Advanced' },
  { name: 'GraphQL Schema Design', category: 'Backend', description: 'Creating federated GraphQL graphs with optimized resolvers and caching', level: 'Intermediate' },
  { name: 'Real-Time Stream Processing', category: 'Data', description: 'Consuming and aggregating event streams with Kafka and Redis pub/sub', level: 'Advanced' },
  { name: 'Fullstack React Architecture', category: 'Frontend', description: 'Building modular React server components with optimistic UI mutations', level: 'Expert' },
  { name: 'Cloud Infrastructure Design', category: 'Cloud', description: 'Architecting resilient, highly available multi-region cloud systems', level: 'Expert' },
  { name: 'Database Indexing & Tuning', category: 'Data', description: 'Optimizing B-trees, hash joins, execution plans, and query latency', level: 'Advanced' },
  { name: 'Microservices Communication', category: 'Backend', description: 'Implementing gRPC, service mesh, circuit breakers, and event sourcing', level: 'Advanced' },
  { name: 'Zero-Trust Security', category: 'Security', description: 'Implementing mTLS, OAuth2, JWT verification, and RBAC authorization', level: 'Intermediate' },
  { name: 'Scroll-Driven UI Animation', category: 'Frontend', description: 'Synchronizing 3D camera motion and canvas states to DOM scroll coordinates', level: 'Expert' },
  { name: 'Vector Search & Embeddings', category: 'Data', description: 'Working with vector databases, cosine similarity, and semantic retrieval', level: 'Advanced' },
  { name: 'GraphRAG Integration', category: 'Machine Learning', description: 'Augmenting LLM reasoning with structured knowledge graph context paths', level: 'Advanced' },
  { name: 'High-Concurrency Systems', category: 'Backend', description: 'Tuning thread pools, event loops, and non-blocking I/O for 50k+ req/s', level: 'Expert' },
  { name: 'State Management & Signals', category: 'Frontend', description: 'Architecting predictable reactive UI state with minimal re-render churn', level: 'Intermediate' },
  { name: 'Multi-Cloud Provisioning', category: 'DevOps', description: 'Writing idempotent HCL modules for AWS, GCP, and Azure resources', level: 'Intermediate' },
  { name: 'Search Ranking & Indexing', category: 'Data', description: 'Tuning BM25 text relevance, fuzzy matching, and inverted indexes', level: 'Intermediate' },
  { name: 'Automated Testing Suites', category: 'Engineering', description: 'Writing end-to-end, integration, and property-based test suites', level: 'Intermediate' },
  { name: 'Performance Profiling', category: 'Engineering', description: 'Analyzing flame graphs, memory allocations, and network waterfalls', level: 'Advanced' },
  { name: 'Serverless Functions', category: 'Cloud', description: 'Building event-triggered compute lambdas with cold-start mitigations', level: 'Intermediate' },
];

const concepts = [
  { name: 'Property Graphs', category: 'Graph Systems', description: 'Graph data model where nodes and edges have arbitrary key-value properties' },
  { name: 'Multi-Hop Traversal', category: 'Graph Systems', description: 'Traversing consecutive relationship hops without expensive join multiplication' },
  { name: 'GraphRAG', category: 'AI & Data', description: 'Combining structured knowledge graph paths with vector retrieval for LLMs' },
  { name: 'Shortest Path Algorithms', category: 'Algorithms', description: 'Dijkstra and BFS algorithms finding optimal paths between network nodes' },
  { name: 'PageRank Centrality', category: 'Graph Systems', description: 'Determining node importance based on the density and weight of incoming links' },
  { name: 'Event-Driven Architecture', category: 'System Design', description: 'Decoupled systems communicating asynchronously through message events' },
  { name: 'Microservices Architecture', category: 'System Design', description: 'Decomposing application domains into independently deployable services' },
  { name: 'Zero-Trust Security Model', category: 'Security', description: 'Never trust, always verify every access request regardless of origin' },
  { name: 'Server-Side Rendering', category: 'Web Architecture', description: 'Generating HTML on the server to optimize initial load and SEO' },
  { name: 'Dynamic Computation Graphs', category: 'Machine Learning', description: 'Constructing neural network computational graphs on-the-fly during execution' },
  { name: 'Convolutional Feature Extraction', category: 'Computer Vision', description: 'Applying spatial kernels to extract visual hierarchies from pixel matrices' },
  { name: 'Infrastructure as Code', category: 'DevOps', description: 'Defining computing infrastructure through declarative version-controlled files' },
  { name: 'Continuous Delivery', category: 'DevOps', description: 'Automating software release cycles from code check-in to production staging' },
  { name: 'Inverted Indexing', category: 'Data Systems', description: 'Mapping words and terms directly to document locations for fast text search' },
  { name: 'Reactive Streams', category: 'Concurrency', description: 'Asynchronous stream processing standard with non-blocking backpressure' },
  { name: 'ACID Transactions', category: 'Databases', description: 'Atomicity, Consistency, Isolation, and Durability guarantees for data integrity' },
  { name: 'CAP Theorem', category: 'Distributed Systems', description: 'Tradeoff between Consistency, Availability, and Partition tolerance in networks' },
  { name: 'WebAssembly Execution', category: 'Web Architecture', description: 'Near-native bytecode execution directly in browser JavaScript sandboxes' },
  { name: 'Declarative UI Rendering', category: 'Frontend', description: 'Expressing UI as pure functions of state rather than imperative DOM mutations' },
  { name: 'Connection Pooling', category: 'Databases', description: 'Reusing database socket connections to eliminate repeated TCP/TLS handshake overhead' },
];

const developers = [
  { name: 'Elena Rostova', title: 'Principal Graph Architect', bio: 'Pioneering knowledge graphs, openCypher systems, and agent context memory layers', githubUrl: 'https://github.com/elena-rostova', avatarSeed: 'elena' },
  { name: 'Marcus Vance', title: 'Senior 3D Creative Engineer', bio: 'Specializing in WebGL, Three.js shaders, and cinematic scroll-driven interactions', githubUrl: 'https://github.com/marcus-vance', avatarSeed: 'marcus' },
  { name: 'Aria Takahashi', title: 'Staff ML Engineer', bio: 'Training real-time computer vision models and dynamic PyTorch neural pipelines', githubUrl: 'https://github.com/aria-takahashi', avatarSeed: 'aria' },
  { name: 'Devon Miller', title: 'Cloud Platform Lead', bio: 'Designing resilient multi-cloud Kubernetes clusters and automated CI/CD engines', githubUrl: 'https://github.com/devon-miller', avatarSeed: 'devon' },
  { name: 'Sofia Rodriguez', title: 'Fullstack Core Architect', bio: 'Building high-throughput Next.js and TypeScript web applications with clean architecture', githubUrl: 'https://github.com/sofia-rodriguez', avatarSeed: 'sofia' },
  { name: 'Kenji Sato', title: 'Data Streaming Specialist', bio: 'Architecting distributed Kafka event pipelines and sub-millisecond cache clusters', githubUrl: 'https://github.com/kenji-sato', avatarSeed: 'kenji' },
  { name: 'Chloe Bennett', title: 'Security & Auth Engineer', bio: 'Implementing zero-trust microservice networks and automated OAuth2 gateways', githubUrl: 'https://github.com/chloe-bennett', avatarSeed: 'chloe' },
  { name: 'Tariq Al-Mansoor', title: 'Backend Systems Engineer', bio: 'High-concurrency FastAPI microservices, database tuning, and connection pooling', githubUrl: 'https://github.com/tariq-mansoor', avatarSeed: 'tariq' },
  { name: 'Nadia Kowalski', title: 'Frontend UI/UX Specialist', bio: 'Focusing on accessible design systems, micro-animations, and fluid responsive layouts', githubUrl: 'https://github.com/nadia-kowalski', avatarSeed: 'nadia' },
  { name: 'Lucas Dubois', title: 'DevOps & Site Reliability Lead', bio: 'Automating multi-cloud Terraform deployments and observability monitoring stacks', githubUrl: 'https://github.com/lucas-dubois', avatarSeed: 'lucas' },
  { name: 'Ananya Iyer', title: 'AI Research Scientist', bio: 'Researching GraphRAG architectures and contextual graph memory for autonomous agents', githubUrl: 'https://github.com/ananya-iyer', avatarSeed: 'ananya' },
  { name: 'Liam O\'Connor', title: 'Search Engine Engineer', bio: 'Building distributed Elasticsearch clusters and semantic hybrid search indexes', githubUrl: 'https://github.com/liam-oconnor', avatarSeed: 'liam' },
  { name: 'Maya Lin', title: 'Mobile & Fullstack Engineer', bio: 'Bridging responsive web platforms and cross-platform native mobile ecosystems', githubUrl: 'https://github.com/maya-lin', avatarSeed: 'maya' },
  { name: 'Vikram Patel', title: 'Graph Database Engineer', bio: 'Master of Cypher query plans, shortest-path algorithms, and property graph modeling', githubUrl: 'https://github.com/vikram-patel', avatarSeed: 'vikram' },
  { name: 'Zoe Thorne', title: 'Creative WebGL Designer', bio: 'Crafting award-winning digital experiences with GSAP ScrollTrigger and Three.js', githubUrl: 'https://github.com/zoe-thorne', avatarSeed: 'zoe' },
];

const projects = [
  { name: 'GraphLens', category: 'Graph Systems', description: 'Cinematic technology knowledge graph explorer with 3D scroll storytelling and CognoDB backend', stars: 2840, githubUrl: 'https://github.com/wexa-ai/graphlens' },
  { name: 'OmniVision-Core', category: 'Machine Learning', description: 'Real-time multi-camera object detection and tracking pipeline running at 120 FPS', stars: 4120, githubUrl: 'https://github.com/wexa-ai/omnivision-core' },
  { name: 'KubeMesh Engine', category: 'Cloud & Infrastructure', description: 'Zero-configuration service mesh with automated mTLS and multi-cluster routing', stars: 1950, githubUrl: 'https://github.com/wexa-ai/kubemesh-engine' },
  { name: 'AgentContext-Graph', category: 'Graph Systems', description: 'Low-latency agent memory graph providing multi-hop context retrieval for LLM reasoning', stars: 3680, githubUrl: 'https://github.com/wexa-ai/agentcontext-graph' },
  { name: 'StreamPulse', category: 'Data Engineering', description: 'Distributed event processing platform handling 1M+ transactions per second over Kafka', stars: 2310, githubUrl: 'https://github.com/wexa-ai/streampulse' },
  { name: 'SecureGate Auth', category: 'Security & Auth', description: 'Zero-trust API gateway featuring dynamic JWT claims verification and rate limiting', stars: 1420, githubUrl: 'https://github.com/wexa-ai/securegate-auth' },
  { name: 'Canvas3D Studio', category: 'Frontend Engineering', description: 'Interactive browser-based 3D scene composer powered by Three.js and custom shaders', stars: 3190, githubUrl: 'https://github.com/wexa-ai/canvas3d-studio' },
  { name: 'FastQuery ORM', category: 'Backend Engineering', description: 'High-performance async query engine with compiled Cypher and SQL query caches', stars: 890, githubUrl: 'https://github.com/wexa-ai/fastquery-orm' },
  { name: 'NeuralSearch Hybrid', category: 'Data Engineering', description: 'Hybrid search platform combining inverted full-text indexes with vector graph similarity', stars: 2750, githubUrl: 'https://github.com/wexa-ai/neuralsearch-hybrid' },
  { name: 'AutoDeploy CI/CD', category: 'DevOps & CI/CD', description: 'GitOps deployment engine with automated progressive canary releases on Kubernetes', stars: 1670, githubUrl: 'https://github.com/wexa-ai/autodeploy-cicd' },
  { name: 'GraphRAG-Bench', category: 'Graph Systems', description: 'Standardized benchmark suite measuring context retrieval latency in graph databases', stars: 1240, githubUrl: 'https://github.com/wexa-ai/graphrag-bench' },
  { name: 'DeepFlow Visualizer', category: 'Machine Learning', description: 'Interactive neural network layer activation visualizer for PyTorch tensor flows', stars: 2080, githubUrl: 'https://github.com/wexa-ai/deepflow-visualizer' },
  { name: 'InfraScale Hub', category: 'Cloud & Infrastructure', description: 'Terraform blueprint orchestration engine with cost forecasting and security audits', stars: 1530, githubUrl: 'https://github.com/wexa-ai/infrascale-hub' },
  { name: 'HyperUI Components', category: 'Frontend Engineering', description: 'Tailwind CSS component design system engineered for maximum accessibility and performance', stars: 4890, githubUrl: 'https://github.com/wexa-ai/hyperui-components' },
  { name: 'CognitiveCache', category: 'Data Engineering', description: 'Predictive caching layer powered by Redis and automated relationship pre-fetching', stars: 1120, githubUrl: 'https://github.com/wexa-ai/cognitivecache' },
  { name: 'MicroTrace Observability', category: 'DevOps & CI/CD', description: 'Distributed tracing collector providing real-time dependency graph visualizations', stars: 1840, githubUrl: 'https://github.com/wexa-ai/microtrace-observability' },
  { name: 'EdgeRouter Gateway', category: 'Backend Engineering', description: 'Global serverless edge router with sub-10ms request routing across 200+ regions', stars: 2460, githubUrl: 'https://github.com/wexa-ai/edgerouter-gateway' },
  { name: 'VisionScan Anomaly', category: 'Computer Vision', description: 'Industrial visual defect detection using OpenCV and transfer-learned CNN models', stars: 1390, githubUrl: 'https://github.com/wexa-ai/visionscan-anomaly' },
  { name: 'VectorGraph DB', category: 'Graph Systems', description: 'Native hybrid graph database integrating dense vector embeddings directly into edge topologies', stars: 3950, githubUrl: 'https://github.com/wexa-ai/vectorgraph-db' },
  { name: 'ScrollMotion Engine', category: 'Frontend Engineering', description: 'Ultra-smooth scroll physics and virtual camera controller for WebGL presentations', stars: 2610, githubUrl: 'https://github.com/wexa-ai/scrollmotion-engine' },
];

const resources = [
  { name: 'Mastering Graph Databases with openCypher', type: 'Book', url: 'https://opencypher.org/resources', difficulty: 'Advanced', description: 'Complete practical manual on designing enterprise property graphs and writing optimized traversals' },
  { name: 'Three.js & WebGL Production Masterclass', type: 'Course', url: 'https://threejs.org/docs', difficulty: 'Intermediate', description: 'Comprehensive guide to shaders, instanced meshes, and scroll-driven 3D cameras' },
  { name: 'Building Scalable Next.js Fullstack Systems', type: 'Documentation', url: 'https://nextjs.org/docs', difficulty: 'Intermediate', description: 'Official reference for Next.js App Router, Server Components, and streaming architectures' },
  { name: 'Deep Learning with PyTorch in Practice', type: 'Course', url: 'https://pytorch.org/tutorials', difficulty: 'Advanced', description: 'From dynamic neural tensors to distributed multi-GPU training workflows' },
  { name: 'Kubernetes Production Best Practices', type: 'Guide', url: 'https://kubernetes.io/docs/concepts', difficulty: 'Advanced', description: 'Production patterns for container orchestration, ingress traffic, and high availability' },
  { name: 'GraphRAG: Knowledge Graphs for AI Agents', type: 'Whitepaper', url: 'https://cognodb.com/research/graphrag', difficulty: 'Expert', description: 'Architectural blueprint for grounding LLMs with multi-hop context graph lookups' },
  { name: 'Zero-Trust Architecture on Cloud Platforms', type: 'Guide', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final', difficulty: 'Intermediate', description: 'Comprehensive standards for identity-centric microservice security models' },
  { name: 'High-Performance Kafka Stream Pipelines', type: 'Book', url: 'https://kafka.apache.org/documentation', difficulty: 'Advanced', description: 'Architecting fault-tolerant streaming data fabrics with exact-once delivery semantics' },
  { name: 'GSAP ScrollTrigger Interactive Storytelling', type: 'Tutorial', url: 'https://gsap.com/docs/v3/Plugins/ScrollTrigger', difficulty: 'Intermediate', description: 'Synchronizing timeline animations and camera positions to vertical scroll coordinates' },
  { name: 'Database Internals: Indexing, B-Trees & Graph Engines', type: 'Book', url: 'https://www.databass.dev', difficulty: 'Expert', description: 'Deep dive into storage engines, pointer chasing, index structures, and traversal mechanics' },
];

// Relationship mappings
const projectUsesTech = [
  { project: 'GraphLens', tech: 'Next.js' },
  { project: 'GraphLens', tech: 'React' },
  { project: 'GraphLens', tech: 'Three.js' },
  { project: 'GraphLens', tech: 'GSAP' },
  { project: 'GraphLens', tech: 'CognoDB' },
  { project: 'GraphLens', tech: 'Tailwind CSS' },
  { project: 'GraphLens', tech: 'Vercel' },

  { project: 'OmniVision-Core', tech: 'PyTorch' },
  { project: 'OmniVision-Core', tech: 'OpenCV' },
  { project: 'OmniVision-Core', tech: 'FastAPI' },
  { project: 'OmniVision-Core', tech: 'Docker' },

  { project: 'KubeMesh Engine', tech: 'Kubernetes' },
  { project: 'KubeMesh Engine', tech: 'Docker' },
  { project: 'KubeMesh Engine', tech: 'Terraform' },
  { project: 'KubeMesh Engine', tech: 'GitHub Actions' },

  { project: 'AgentContext-Graph', tech: 'CognoDB' },
  { project: 'AgentContext-Graph', tech: 'FastAPI' },
  { project: 'AgentContext-Graph', tech: 'Redis' },
  { project: 'AgentContext-Graph', tech: 'PyTorch' },

  { project: 'StreamPulse', tech: 'Kafka' },
  { project: 'StreamPulse', tech: 'Redis' },
  { project: 'StreamPulse', tech: 'Kubernetes' },
  { project: 'StreamPulse', tech: 'Docker' },

  { project: 'SecureGate Auth', tech: 'FastAPI' },
  { project: 'SecureGate Auth', tech: 'Redis' },
  { project: 'SecureGate Auth', tech: 'PostgreSQL' },
  { project: 'SecureGate Auth', tech: 'Docker' },

  { project: 'Canvas3D Studio', tech: 'Three.js' },
  { project: 'Canvas3D Studio', tech: 'React' },
  { project: 'Canvas3D Studio', tech: 'GSAP' },
  { project: 'Canvas3D Studio', tech: 'Tailwind CSS' },

  { project: 'FastQuery ORM', tech: 'PostgreSQL' },
  { project: 'FastQuery ORM', tech: 'CognoDB' },
  { project: 'FastQuery ORM', tech: 'Node.js' },

  { project: 'NeuralSearch Hybrid', tech: 'Elasticsearch' },
  { project: 'NeuralSearch Hybrid', tech: 'PyTorch' },
  { project: 'NeuralSearch Hybrid', tech: 'FastAPI' },
  { project: 'NeuralSearch Hybrid', tech: 'Redis' },

  { project: 'AutoDeploy CI/CD', tech: 'GitHub Actions' },
  { project: 'AutoDeploy CI/CD', tech: 'Kubernetes' },
  { project: 'AutoDeploy CI/CD', tech: 'Docker' },
  { project: 'AutoDeploy CI/CD', tech: 'Terraform' },

  { project: 'GraphRAG-Bench', tech: 'CognoDB' },
  { project: 'GraphRAG-Bench', tech: 'Neo4j' },
  { project: 'GraphRAG-Bench', tech: 'PyTorch' },
  { project: 'GraphRAG-Bench', tech: 'Next.js' },

  { project: 'DeepFlow Visualizer', tech: 'PyTorch' },
  { project: 'DeepFlow Visualizer', tech: 'Three.js' },
  { project: 'DeepFlow Visualizer', tech: 'React' },
  { project: 'DeepFlow Visualizer', tech: 'FastAPI' },

  { project: 'InfraScale Hub', tech: 'Terraform' },
  { project: 'InfraScale Hub', tech: 'AWS Lambda' },
  { project: 'InfraScale Hub', tech: 'Kubernetes' },
  { project: 'InfraScale Hub', tech: 'Next.js' },

  { project: 'HyperUI Components', tech: 'React' },
  { project: 'HyperUI Components', tech: 'Tailwind CSS' },
  { project: 'HyperUI Components', tech: 'Next.js' },

  { project: 'CognitiveCache', tech: 'Redis' },
  { project: 'CognitiveCache', tech: 'CognoDB' },
  { project: 'CognitiveCache', tech: 'Node.js' },

  { project: 'MicroTrace Observability', tech: 'Kafka' },
  { project: 'MicroTrace Observability', tech: 'Elasticsearch' },
  { project: 'MicroTrace Observability', tech: 'React' },
  { project: 'MicroTrace Observability', tech: 'Three.js' },

  { project: 'EdgeRouter Gateway', tech: 'AWS Lambda' },
  { project: 'EdgeRouter Gateway', tech: 'Vercel' },
  { project: 'EdgeRouter Gateway', tech: 'Redis' },

  { project: 'VisionScan Anomaly', tech: 'OpenCV' },
  { project: 'VisionScan Anomaly', tech: 'TensorFlow' },
  { project: 'VisionScan Anomaly', tech: 'FastAPI' },
  { project: 'VisionScan Anomaly', tech: 'Docker' },

  { project: 'VectorGraph DB', tech: 'CognoDB' },
  { project: 'VectorGraph DB', tech: 'Neo4j' },
  { project: 'VectorGraph DB', tech: 'PyTorch' },
  { project: 'VectorGraph DB', tech: 'Kafka' },

  { project: 'ScrollMotion Engine', tech: 'GSAP' },
  { project: 'ScrollMotion Engine', tech: 'Three.js' },
  { project: 'ScrollMotion Engine', tech: 'TypeScript' },
];

const devBuiltProjects = [
  { dev: 'Elena Rostova', project: 'GraphLens' },
  { dev: 'Elena Rostova', project: 'AgentContext-Graph' },
  { dev: 'Marcus Vance', project: 'Canvas3D Studio' },
  { dev: 'Marcus Vance', project: 'ScrollMotion Engine' },
  { dev: 'Aria Takahashi', project: 'OmniVision-Core' },
  { dev: 'Aria Takahashi', project: 'VisionScan Anomaly' },
  { dev: 'Devon Miller', project: 'KubeMesh Engine' },
  { dev: 'Devon Miller', project: 'AutoDeploy CI/CD' },
  { dev: 'Sofia Rodriguez', project: 'GraphLens' },
  { dev: 'Sofia Rodriguez', project: 'HyperUI Components' },
  { dev: 'Kenji Sato', project: 'StreamPulse' },
  { dev: 'Kenji Sato', project: 'CognitiveCache' },
  { dev: 'Chloe Bennett', project: 'SecureGate Auth' },
  { dev: 'Tariq Al-Mansoor', project: 'FastQuery ORM' },
  { dev: 'Tariq Al-Mansoor', project: 'EdgeRouter Gateway' },
  { dev: 'Nadia Kowalski', project: 'HyperUI Components' },
  { dev: 'Lucas Dubois', project: 'InfraScale Hub' },
  { dev: 'Ananya Iyer', project: 'GraphRAG-Bench' },
  { dev: 'Ananya Iyer', project: 'AgentContext-Graph' },
  { dev: 'Liam O\'Connor', project: 'NeuralSearch Hybrid' },
  { dev: 'Liam O\'Connor', project: 'MicroTrace Observability' },
  { dev: 'Maya Lin', project: 'DeepFlow Visualizer' },
  { dev: 'Vikram Patel', project: 'VectorGraph DB' },
  { dev: 'Vikram Patel', project: 'GraphLens' },
  { dev: 'Zoe Thorne', project: 'Canvas3D Studio' },
  { dev: 'Zoe Thorne', project: 'GraphLens' },
];

const devContributedProjects = [
  { dev: 'Elena Rostova', project: 'VectorGraph DB' },
  { dev: 'Elena Rostova', project: 'GraphRAG-Bench' },
  { dev: 'Marcus Vance', project: 'GraphLens' },
  { dev: 'Marcus Vance', project: 'DeepFlow Visualizer' },
  { dev: 'Aria Takahashi', project: 'DeepFlow Visualizer' },
  { dev: 'Devon Miller', project: 'StreamPulse' },
  { dev: 'Sofia Rodriguez', project: 'SecureGate Auth' },
  { dev: 'Kenji Sato', project: 'MicroTrace Observability' },
  { dev: 'Chloe Bennett', project: 'EdgeRouter Gateway' },
  { dev: 'Tariq Al-Mansoor', project: 'AgentContext-Graph' },
  { dev: 'Nadia Kowalski', project: 'Canvas3D Studio' },
  { dev: 'Lucas Dubois', project: 'KubeMesh Engine' },
  { dev: 'Ananya Iyer', project: 'NeuralSearch Hybrid' },
  { dev: 'Liam O\'Connor', project: 'CognitiveCache' },
  { dev: 'Vikram Patel', project: 'FastQuery ORM' },
  { dev: 'Zoe Thorne', project: 'ScrollMotion Engine' },
];

const devKnowsSkills = [
  { dev: 'Elena Rostova', skill: 'Graph Modeling' },
  { dev: 'Elena Rostova', skill: 'Cypher Query Optimization' },
  { dev: 'Elena Rostova', skill: 'GraphRAG Integration' },
  { dev: 'Elena Rostova', skill: 'Database Indexing & Tuning' },

  { dev: 'Marcus Vance', skill: '3D Web Development' },
  { dev: 'Marcus Vance', skill: 'Scroll-Driven UI Animation' },
  { dev: 'Marcus Vance', skill: 'Fullstack React Architecture' },
  { dev: 'Marcus Vance', skill: 'Performance Profiling' },

  { dev: 'Aria Takahashi', skill: 'Deep Learning' },
  { dev: 'Aria Takahashi', skill: 'Computer Vision Processing' },
  { dev: 'Aria Takahashi', skill: 'Vector Search & Embeddings' },

  { dev: 'Devon Miller', skill: 'Container Orchestration' },
  { dev: 'Devon Miller', skill: 'CI/CD Pipeline Automation' },
  { dev: 'Devon Miller', skill: 'Cloud Infrastructure Design' },
  { dev: 'Devon Miller', skill: 'Multi-Cloud Provisioning' },

  { dev: 'Sofia Rodriguez', skill: 'Fullstack React Architecture' },
  { dev: 'Sofia Rodriguez', skill: 'REST API Architecture' },
  { dev: 'Sofia Rodriguez', skill: 'State Management & Signals' },
  { dev: 'Sofia Rodriguez', skill: 'Automated Testing Suites' },

  { dev: 'Kenji Sato', skill: 'Real-Time Stream Processing' },
  { dev: 'Kenji Sato', skill: 'High-Concurrency Systems' },
  { dev: 'Kenji Sato', skill: 'Database Indexing & Tuning' },

  { dev: 'Chloe Bennett', skill: 'Zero-Trust Security' },
  { dev: 'Chloe Bennett', skill: 'REST API Architecture' },
  { dev: 'Chloe Bennett', skill: 'Microservices Communication' },

  { dev: 'Tariq Al-Mansoor', skill: 'REST API Architecture' },
  { dev: 'Tariq Al-Mansoor', skill: 'High-Concurrency Systems' },
  { dev: 'Tariq Al-Mansoor', skill: 'Serverless Functions' },

  { dev: 'Nadia Kowalski', skill: 'Fullstack React Architecture' },
  { dev: 'Nadia Kowalski', skill: 'State Management & Signals' },
  { dev: 'Nadia Kowalski', skill: 'Scroll-Driven UI Animation' },

  { dev: 'Lucas Dubois', skill: 'Cloud Infrastructure Design' },
  { dev: 'Lucas Dubois', skill: 'CI/CD Pipeline Automation' },
  { dev: 'Lucas Dubois', skill: 'Multi-Cloud Provisioning' },

  { dev: 'Ananya Iyer', skill: 'GraphRAG Integration' },
  { dev: 'Ananya Iyer', skill: 'Deep Learning' },
  { dev: 'Ananya Iyer', skill: 'Vector Search & Embeddings' },

  { dev: 'Liam O\'Connor', skill: 'Search Ranking & Indexing' },
  { dev: 'Liam O\'Connor', skill: 'Real-Time Stream Processing' },
  { dev: 'Liam O\'Connor', skill: 'Database Indexing & Tuning' },

  { dev: 'Maya Lin', skill: 'Fullstack React Architecture' },
  { dev: 'Maya Lin', skill: '3D Web Development' },
  { dev: 'Maya Lin', skill: 'Deep Learning' },

  { dev: 'Vikram Patel', skill: 'Graph Modeling' },
  { dev: 'Vikram Patel', skill: 'Cypher Query Optimization' },
  { dev: 'Vikram Patel', skill: 'Vector Search & Embeddings' },
  { dev: 'Vikram Patel', skill: 'High-Concurrency Systems' },

  { dev: 'Zoe Thorne', skill: '3D Web Development' },
  { dev: 'Zoe Thorne', skill: 'Scroll-Driven UI Animation' },
  { dev: 'Zoe Thorne', skill: 'Performance Profiling' },
];

const techEnablesSkill = [
  { tech: 'Three.js', skill: '3D Web Development' },
  { tech: 'Three.js', skill: 'Scroll-Driven UI Animation' },
  { tech: 'GSAP', skill: 'Scroll-Driven UI Animation' },
  { tech: 'CognoDB', skill: 'Graph Modeling' },
  { tech: 'CognoDB', skill: 'Cypher Query Optimization' },
  { tech: 'CognoDB', skill: 'GraphRAG Integration' },
  { tech: 'Neo4j', skill: 'Graph Modeling' },
  { tech: 'Neo4j', skill: 'Cypher Query Optimization' },
  { tech: 'PyTorch', skill: 'Deep Learning' },
  { tech: 'PyTorch', skill: 'Vector Search & Embeddings' },
  { tech: 'TensorFlow', skill: 'Deep Learning' },
  { tech: 'OpenCV', skill: 'Computer Vision Processing' },
  { tech: 'Kubernetes', skill: 'Container Orchestration' },
  { tech: 'Docker', skill: 'Container Orchestration' },
  { tech: 'GitHub Actions', skill: 'CI/CD Pipeline Automation' },
  { tech: 'FastAPI', skill: 'REST API Architecture' },
  { tech: 'FastAPI', skill: 'High-Concurrency Systems' },
  { tech: 'GraphQL', skill: 'GraphQL Schema Design' },
  { tech: 'Kafka', skill: 'Real-Time Stream Processing' },
  { tech: 'Redis', skill: 'Real-Time Stream Processing' },
  { tech: 'Redis', skill: 'High-Concurrency Systems' },
  { tech: 'Next.js', skill: 'Fullstack React Architecture' },
  { tech: 'React', skill: 'Fullstack React Architecture' },
  { tech: 'React', skill: 'State Management & Signals' },
  { tech: 'PostgreSQL', skill: 'Database Indexing & Tuning' },
  { tech: 'Elasticsearch', skill: 'Search Ranking & Indexing' },
  { tech: 'AWS Lambda', skill: 'Serverless Functions' },
  { tech: 'AWS Lambda', skill: 'Cloud Infrastructure Design' },
  { tech: 'Terraform', skill: 'Multi-Cloud Provisioning' },
  { tech: 'Terraform', skill: 'Cloud Infrastructure Design' },
];

const projectRequiresSkill = [
  { project: 'GraphLens', skill: 'Graph Modeling' },
  { project: 'GraphLens', skill: 'Cypher Query Optimization' },
  { project: 'GraphLens', skill: '3D Web Development' },
  { project: 'GraphLens', skill: 'Scroll-Driven UI Animation' },
  { project: 'GraphLens', skill: 'Fullstack React Architecture' },

  { project: 'OmniVision-Core', skill: 'Computer Vision Processing' },
  { project: 'OmniVision-Core', skill: 'Deep Learning' },
  { project: 'OmniVision-Core', skill: 'REST API Architecture' },

  { project: 'KubeMesh Engine', skill: 'Container Orchestration' },
  { project: 'KubeMesh Engine', skill: 'Cloud Infrastructure Design' },
  { project: 'KubeMesh Engine', skill: 'Zero-Trust Security' },

  { project: 'AgentContext-Graph', skill: 'Graph Modeling' },
  { project: 'AgentContext-Graph', skill: 'GraphRAG Integration' },
  { project: 'AgentContext-Graph', skill: 'High-Concurrency Systems' },

  { project: 'StreamPulse', skill: 'Real-Time Stream Processing' },
  { project: 'StreamPulse', skill: 'High-Concurrency Systems' },
  { project: 'StreamPulse', skill: 'Container Orchestration' },

  { project: 'SecureGate Auth', skill: 'Zero-Trust Security' },
  { project: 'SecureGate Auth', skill: 'REST API Architecture' },

  { project: 'Canvas3D Studio', skill: '3D Web Development' },
  { project: 'Canvas3D Studio', skill: 'Fullstack React Architecture' },

  { project: 'FastQuery ORM', skill: 'Database Indexing & Tuning' },
  { project: 'FastQuery ORM', skill: 'Cypher Query Optimization' },

  { project: 'NeuralSearch Hybrid', skill: 'Search Ranking & Indexing' },
  { project: 'NeuralSearch Hybrid', skill: 'Vector Search & Embeddings' },

  { project: 'AutoDeploy CI/CD', skill: 'CI/CD Pipeline Automation' },
  { project: 'AutoDeploy CI/CD', skill: 'Multi-Cloud Provisioning' },

  { project: 'GraphRAG-Bench', skill: 'GraphRAG Integration' },
  { project: 'GraphRAG-Bench', skill: 'Performance Profiling' },

  { project: 'DeepFlow Visualizer', skill: 'Deep Learning' },
  { project: 'DeepFlow Visualizer', skill: '3D Web Development' },

  { project: 'InfraScale Hub', skill: 'Cloud Infrastructure Design' },
  { project: 'InfraScale Hub', skill: 'Multi-Cloud Provisioning' },

  { project: 'HyperUI Components', skill: 'Fullstack React Architecture' },
  { project: 'HyperUI Components', skill: 'Automated Testing Suites' },

  { project: 'CognitiveCache', skill: 'Database Indexing & Tuning' },
  { project: 'CognitiveCache', skill: 'High-Concurrency Systems' },

  { project: 'MicroTrace Observability', skill: 'Real-Time Stream Processing' },
  { project: 'MicroTrace Observability', skill: '3D Web Development' },

  { project: 'EdgeRouter Gateway', skill: 'Serverless Functions' },
  { project: 'EdgeRouter Gateway', skill: 'High-Concurrency Systems' },

  { project: 'VisionScan Anomaly', skill: 'Computer Vision Processing' },
  { project: 'VisionScan Anomaly', skill: 'Deep Learning' },

  { project: 'VectorGraph DB', skill: 'Graph Modeling' },
  { project: 'VectorGraph DB', skill: 'Vector Search & Embeddings' },

  { project: 'ScrollMotion Engine', skill: 'Scroll-Driven UI Animation' },
  { project: 'ScrollMotion Engine', skill: '3D Web Development' },
];

const techRelatedToTech = [
  { tech1: 'CognoDB', tech2: 'Neo4j' },
  { tech1: 'CognoDB', tech2: 'Redis' },
  { tech1: 'Next.js', tech2: 'React' },
  { tech1: 'Next.js', tech2: 'Vercel' },
  { tech1: 'Next.js', tech2: 'Tailwind CSS' },
  { tech1: 'React', tech2: 'Three.js' },
  { tech1: 'Three.js', tech2: 'GSAP' },
  { tech1: 'FastAPI', tech2: 'Django' },
  { tech1: 'FastAPI', tech2: 'PyTorch' },
  { tech1: 'PyTorch', tech2: 'TensorFlow' },
  { tech1: 'PyTorch', tech2: 'OpenCV' },
  { tech1: 'Docker', tech2: 'Kubernetes' },
  { tech1: 'Kubernetes', tech2: 'Terraform' },
  { tech1: 'Docker', tech2: 'GitHub Actions' },
  { tech1: 'Kafka', tech2: 'Redis' },
  { tech1: 'Elasticsearch', tech2: 'Kafka' },
  { tech1: 'PostgreSQL', tech2: 'Redis' },
  { tech1: 'GraphQL', tech2: 'FastAPI' },
  { tech1: 'AWS Lambda', tech2: 'Terraform' },
  { tech1: 'Node.js', tech2: 'FastAPI' },
];

const techPartOfDomain = [
  { tech: 'Next.js', domain: 'Web Development' },
  { tech: 'Next.js', domain: 'Frontend Engineering' },
  { tech: 'React', domain: 'Frontend Engineering' },
  { tech: 'Three.js', domain: 'Frontend Engineering' },
  { tech: 'GSAP', domain: 'Frontend Engineering' },
  { tech: 'Tailwind CSS', domain: 'Frontend Engineering' },
  { tech: 'FastAPI', domain: 'Backend Engineering' },
  { tech: 'Django', domain: 'Backend Engineering' },
  { tech: 'Node.js', domain: 'Backend Engineering' },
  { tech: 'GraphQL', domain: 'Backend Engineering' },
  { tech: 'CognoDB', domain: 'Graph Systems & Analytics' },
  { tech: 'Neo4j', domain: 'Graph Systems & Analytics' },
  { tech: 'PyTorch', domain: 'Machine Learning' },
  { tech: 'TensorFlow', domain: 'Machine Learning' },
  { tech: 'OpenCV', domain: 'Computer Vision' },
  { tech: 'Docker', domain: 'DevOps & CI/CD' },
  { tech: 'Kubernetes', domain: 'Cloud & Infrastructure' },
  { tech: 'Kubernetes', domain: 'DevOps & CI/CD' },
  { tech: 'Terraform', domain: 'Cloud & Infrastructure' },
  { tech: 'AWS Lambda', domain: 'Cloud & Infrastructure' },
  { tech: 'Vercel', domain: 'Cloud & Infrastructure' },
  { tech: 'GitHub Actions', domain: 'DevOps & CI/CD' },
  { tech: 'PostgreSQL', domain: 'Backend Engineering' },
  { tech: 'Redis', domain: 'Data Engineering' },
  { tech: 'Kafka', domain: 'Data Engineering' },
  { tech: 'Elasticsearch', domain: 'Data Engineering' },
];

const projectBelongsToDomain = [
  { project: 'GraphLens', domain: 'Graph Systems & Analytics' },
  { project: 'GraphLens', domain: 'Frontend Engineering' },
  { project: 'OmniVision-Core', domain: 'Computer Vision' },
  { project: 'OmniVision-Core', domain: 'Machine Learning' },
  { project: 'KubeMesh Engine', domain: 'Cloud & Infrastructure' },
  { project: 'AgentContext-Graph', domain: 'Graph Systems & Analytics' },
  { project: 'StreamPulse', domain: 'Data Engineering' },
  { project: 'SecureGate Auth', domain: 'Security & Auth' },
  { project: 'Canvas3D Studio', domain: 'Frontend Engineering' },
  { project: 'FastQuery ORM', domain: 'Backend Engineering' },
  { project: 'NeuralSearch Hybrid', domain: 'Data Engineering' },
  { project: 'AutoDeploy CI/CD', domain: 'DevOps & CI/CD' },
  { project: 'GraphRAG-Bench', domain: 'Graph Systems & Analytics' },
  { project: 'DeepFlow Visualizer', domain: 'Machine Learning' },
  { project: 'InfraScale Hub', domain: 'Cloud & Infrastructure' },
  { project: 'HyperUI Components', domain: 'Frontend Engineering' },
  { project: 'CognitiveCache', domain: 'Data Engineering' },
  { project: 'MicroTrace Observability', domain: 'DevOps & CI/CD' },
  { project: 'EdgeRouter Gateway', domain: 'Backend Engineering' },
  { project: 'VisionScan Anomaly', domain: 'Computer Vision' },
  { project: 'VectorGraph DB', domain: 'Graph Systems & Analytics' },
  { project: 'ScrollMotion Engine', domain: 'Frontend Engineering' },
];

const projectImplementsConcept = [
  { project: 'GraphLens', concept: 'Property Graphs' },
  { project: 'GraphLens', concept: 'Multi-Hop Traversal' },
  { project: 'GraphLens', concept: 'Server-Side Rendering' },
  { project: 'GraphLens', concept: 'Shortest Path Algorithms' },

  { project: 'OmniVision-Core', concept: 'Convolutional Feature Extraction' },
  { project: 'OmniVision-Core', concept: 'Dynamic Computation Graphs' },

  { project: 'KubeMesh Engine', concept: 'Zero-Trust Security Model' },
  { project: 'KubeMesh Engine', concept: 'Microservices Architecture' },

  { project: 'AgentContext-Graph', concept: 'GraphRAG' },
  { project: 'AgentContext-Graph', concept: 'Multi-Hop Traversal' },
  { project: 'AgentContext-Graph', concept: 'Property Graphs' },

  { project: 'StreamPulse', concept: 'Event-Driven Architecture' },
  { project: 'StreamPulse', concept: 'Reactive Streams' },

  { project: 'SecureGate Auth', concept: 'Zero-Trust Security Model' },

  { project: 'Canvas3D Studio', concept: 'Declarative UI Rendering' },

  { project: 'FastQuery ORM', concept: 'Connection Pooling' },
  { project: 'FastQuery ORM', concept: 'ACID Transactions' },

  { project: 'NeuralSearch Hybrid', concept: 'Inverted Indexing' },

  { project: 'AutoDeploy CI/CD', concept: 'Continuous Delivery' },
  { project: 'AutoDeploy CI/CD', concept: 'Infrastructure as Code' },

  { project: 'GraphRAG-Bench', concept: 'GraphRAG' },
  { project: 'GraphRAG-Bench', concept: 'Multi-Hop Traversal' },

  { project: 'DeepFlow Visualizer', concept: 'Dynamic Computation Graphs' },

  { project: 'InfraScale Hub', concept: 'Infrastructure as Code' },

  { project: 'HyperUI Components', concept: 'Declarative UI Rendering' },

  { project: 'CognitiveCache', concept: 'Connection Pooling' },

  { project: 'MicroTrace Observability', concept: 'Event-Driven Architecture' },

  { project: 'EdgeRouter Gateway', concept: 'Microservices Architecture' },

  { project: 'VisionScan Anomaly', concept: 'Convolutional Feature Extraction' },

  { project: 'VectorGraph DB', concept: 'Property Graphs' },
  { project: 'VectorGraph DB', concept: 'PageRank Centrality' },

  { project: 'ScrollMotion Engine', concept: 'Declarative UI Rendering' },
];

const resourceTeachesTech = [
  { resource: 'Mastering Graph Databases with openCypher', tech: 'CognoDB' },
  { resource: 'Mastering Graph Databases with openCypher', tech: 'Neo4j' },
  { resource: 'Three.js & WebGL Production Masterclass', tech: 'Three.js' },
  { resource: 'Building Scalable Next.js Fullstack Systems', tech: 'Next.js' },
  { resource: 'Building Scalable Next.js Fullstack Systems', tech: 'React' },
  { resource: 'Deep Learning with PyTorch in Practice', tech: 'PyTorch' },
  { resource: 'Kubernetes Production Best Practices', tech: 'Kubernetes' },
  { resource: 'Kubernetes Production Best Practices', tech: 'Docker' },
  { resource: 'GraphRAG: Knowledge Graphs for AI Agents', tech: 'CognoDB' },
  { resource: 'High-Performance Kafka Stream Pipelines', tech: 'Kafka' },
  { resource: 'GSAP ScrollTrigger Interactive Storytelling', tech: 'GSAP' },
  { resource: 'Database Internals: Indexing, B-Trees & Graph Engines', tech: 'PostgreSQL' },
  { resource: 'Database Internals: Indexing, B-Trees & Graph Engines', tech: 'CognoDB' },
];

const devFollowsDomain = [
  { dev: 'Elena Rostova', domain: 'Graph Systems & Analytics' },
  { dev: 'Marcus Vance', domain: 'Frontend Engineering' },
  { dev: 'Aria Takahashi', domain: 'Machine Learning' },
  { dev: 'Aria Takahashi', domain: 'Computer Vision' },
  { dev: 'Devon Miller', domain: 'Cloud & Infrastructure' },
  { dev: 'Devon Miller', domain: 'DevOps & CI/CD' },
  { dev: 'Sofia Rodriguez', domain: 'Web Development' },
  { dev: 'Sofia Rodriguez', domain: 'Frontend Engineering' },
  { dev: 'Kenji Sato', domain: 'Data Engineering' },
  { dev: 'Kenji Sato', domain: 'Backend Engineering' },
  { dev: 'Chloe Bennett', domain: 'Security & Auth' },
  { dev: 'Tariq Al-Mansoor', domain: 'Backend Engineering' },
  { dev: 'Nadia Kowalski', domain: 'Frontend Engineering' },
  { dev: 'Lucas Dubois', domain: 'DevOps & CI/CD' },
  { dev: 'Ananya Iyer', domain: 'Graph Systems & Analytics' },
  { dev: 'Ananya Iyer', domain: 'Machine Learning' },
  { dev: 'Liam O\'Connor', domain: 'Data Engineering' },
  { dev: 'Maya Lin', domain: 'Frontend Engineering' },
  { dev: 'Vikram Patel', domain: 'Graph Systems & Analytics' },
  { dev: 'Zoe Thorne', domain: 'Frontend Engineering' },
];

async function seed() {
  console.log('🚀 Starting GraphLens idempotent seed process against CognoDB...\n');
  const session = driver.session();

  try {
    // 1. Create Domains
    console.log('📦 Merging Domain nodes...');
    for (const d of domains) {
      await session.run(`
        MERGE (d:Domain {name: $name})
        ON CREATE SET d.description = $description, d.icon = $icon, d.createdAt = timestamp()
        ON MATCH SET d.description = $description, d.icon = $icon, d.updatedAt = timestamp()
      `, d);
    }
    console.log(`  ✓ ${domains.length} Domain nodes merged.`);

    // 2. Create Languages
    console.log('📦 Merging Language nodes...');
    for (const l of languages) {
      await session.run(`
        MERGE (l:Language {name: $name})
        ON CREATE SET l.description = $description, l.paradigm = $paradigm, l.typedSystem = $typedSystem, l.year = $year, l.createdAt = timestamp()
        ON MATCH SET l.description = $description, l.paradigm = $paradigm, l.typedSystem = $typedSystem, l.year = $year, l.updatedAt = timestamp()
      `, l);
    }
    console.log(`  ✓ ${languages.length} Language nodes merged.`);

    // 3. Create Technologies
    console.log('📦 Merging Technology nodes...');
    for (const t of technologies) {
      await session.run(`
        MERGE (t:Technology {name: $name})
        ON CREATE SET t.category = $category, t.description = $description, t.website = $website, t.createdAt = timestamp()
        ON MATCH SET t.category = $category, t.description = $description, t.website = $website, t.updatedAt = timestamp()
      `, t);
    }
    console.log(`  ✓ ${technologies.length} Technology nodes merged.`);

    // 4. Create Skills
    console.log('📦 Merging Skill nodes...');
    for (const s of skills) {
      await session.run(`
        MERGE (s:Skill {name: $name})
        ON CREATE SET s.category = $category, s.description = $description, s.level = $level, s.createdAt = timestamp()
        ON MATCH SET s.category = $category, s.description = $description, s.level = $level, s.updatedAt = timestamp()
      `, s);
    }
    console.log(`  ✓ ${skills.length} Skill nodes merged.`);

    // 5. Create Concepts
    console.log('📦 Merging Concept nodes...');
    for (const c of concepts) {
      await session.run(`
        MERGE (c:Concept {name: $name})
        ON CREATE SET c.category = $category, c.description = $description, c.createdAt = timestamp()
        ON MATCH SET c.category = $category, c.description = $description, c.updatedAt = timestamp()
      `, c);
    }
    console.log(`  ✓ ${concepts.length} Concept nodes merged.`);

    // 6. Create Developers
    console.log('📦 Merging Developer nodes...');
    for (const dev of developers) {
      await session.run(`
        MERGE (d:Developer {name: $name})
        ON CREATE SET d.title = $title, d.bio = $bio, d.githubUrl = $githubUrl, d.avatarSeed = $avatarSeed, d.createdAt = timestamp()
        ON MATCH SET d.title = $title, d.bio = $bio, d.githubUrl = $githubUrl, d.avatarSeed = $avatarSeed, d.updatedAt = timestamp()
      `, dev);
    }
    console.log(`  ✓ ${developers.length} Developer nodes merged.`);

    // 7. Create Projects
    console.log('📦 Merging Project nodes...');
    for (const p of projects) {
      await session.run(`
        MERGE (p:Project {name: $name})
        ON CREATE SET p.category = $category, p.description = $description, p.stars = $stars, p.githubUrl = $githubUrl, p.createdAt = timestamp()
        ON MATCH SET p.category = $category, p.description = $description, p.stars = $stars, p.githubUrl = $githubUrl, p.updatedAt = timestamp()
      `, p);
    }
    console.log(`  ✓ ${projects.length} Project nodes merged.`);

    // 8. Create Resources
    console.log('📦 Merging Resource nodes...');
    for (const r of resources) {
      await session.run(`
        MERGE (res:Resource {name: $name})
        ON CREATE SET res.type = $type, res.url = $url, res.difficulty = $difficulty, res.description = $description, res.createdAt = timestamp()
        ON MATCH SET res.type = $type, res.url = $url, res.difficulty = $difficulty, res.description = $description, res.updatedAt = timestamp()
      `, r);
    }
    console.log(`  ✓ ${resources.length} Resource nodes merged.\n`);

    // --- RELATIONSHIPS ---
    console.log('🔗 Connecting Relationships...');

    // Project -[:USES]-> Technology
    for (const r of projectUsesTech) {
      await session.run(`
        MATCH (p:Project {name: $project})
        MATCH (t:Technology {name: $tech})
        MERGE (p)-[rel:USES]->(t)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Project)-[:USES]->(:Technology) [${projectUsesTech.length} rels]`);

    // Developer -[:BUILT]-> Project
    for (const r of devBuiltProjects) {
      await session.run(`
        MATCH (d:Developer {name: $dev})
        MATCH (p:Project {name: $project})
        MERGE (d)-[rel:BUILT]->(p)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Developer)-[:BUILT]->(:Project) [${devBuiltProjects.length} rels]`);

    // Developer -[:CONTRIBUTED_TO]-> Project
    for (const r of devContributedProjects) {
      await session.run(`
        MATCH (d:Developer {name: $dev})
        MATCH (p:Project {name: $project})
        MERGE (d)-[rel:CONTRIBUTED_TO]->(p)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Developer)-[:CONTRIBUTED_TO]->(:Project) [${devContributedProjects.length} rels]`);

    // Developer -[:KNOWS]-> Skill
    for (const r of devKnowsSkills) {
      await session.run(`
        MATCH (d:Developer {name: $dev})
        MATCH (s:Skill {name: $skill})
        MERGE (d)-[rel:KNOWS]->(s)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Developer)-[:KNOWS]->(:Skill) [${devKnowsSkills.length} rels]`);

    // Technology -[:ENABLES]-> Skill
    for (const r of techEnablesSkill) {
      await session.run(`
        MATCH (t:Technology {name: $tech})
        MATCH (s:Skill {name: $skill})
        MERGE (t)-[rel:ENABLES]->(s)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Technology)-[:ENABLES]->(:Skill) [${techEnablesSkill.length} rels]`);

    // Project -[:REQUIRES]-> Skill
    for (const r of projectRequiresSkill) {
      await session.run(`
        MATCH (p:Project {name: $project})
        MATCH (s:Skill {name: $skill})
        MERGE (p)-[rel:REQUIRES]->(s)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Project)-[:REQUIRES]->(:Skill) [${projectRequiresSkill.length} rels]`);

    // Technology -[:RELATED_TO]-> Technology
    for (const r of techRelatedToTech) {
      await session.run(`
        MATCH (t1:Technology {name: $tech1})
        MATCH (t2:Technology {name: $tech2})
        MERGE (t1)-[rel:RELATED_TO]->(t2)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Technology)-[:RELATED_TO]->(:Technology) [${techRelatedToTech.length} rels]`);

    // Technology -[:PART_OF]-> Domain
    for (const r of techPartOfDomain) {
      await session.run(`
        MATCH (t:Technology {name: $tech})
        MATCH (d:Domain {name: $domain})
        MERGE (t)-[rel:PART_OF]->(d)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Technology)-[:PART_OF]->(:Domain) [${techPartOfDomain.length} rels]`);

    // Project -[:BELONGS_TO]-> Domain
    for (const r of projectBelongsToDomain) {
      await session.run(`
        MATCH (p:Project {name: $project})
        MATCH (d:Domain {name: $domain})
        MERGE (p)-[rel:BELONGS_TO]->(d)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Project)-[:BELONGS_TO]->(:Domain) [${projectBelongsToDomain.length} rels]`);

    // Project -[:IMPLEMENTS]-> Concept
    for (const r of projectImplementsConcept) {
      await session.run(`
        MATCH (p:Project {name: $project})
        MATCH (c:Concept {name: $concept})
        MERGE (p)-[rel:IMPLEMENTS]->(c)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Project)-[:IMPLEMENTS]->(:Concept) [${projectImplementsConcept.length} rels]`);

    // Resource -[:TEACHES]-> Technology
    for (const r of resourceTeachesTech) {
      await session.run(`
        MATCH (res:Resource {name: $resource})
        MATCH (t:Technology {name: $tech})
        MERGE (res)-[rel:TEACHES]->(t)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Resource)-[:TEACHES]->(:Technology) [${resourceTeachesTech.length} rels]`);

    // Developer -[:FOLLOWS]-> Domain
    for (const r of devFollowsDomain) {
      await session.run(`
        MATCH (d:Developer {name: $dev})
        MATCH (dom:Domain {name: $domain})
        MERGE (d)-[rel:FOLLOWS]->(dom)
        ON CREATE SET rel.createdAt = timestamp()
      `, r);
    }
    console.log(`  ✓ (:Developer)-[:FOLLOWS]->(:Domain) [${devFollowsDomain.length} rels]\n`);

    // Final verification count
    const statsResult = await session.run(`
      MATCH (n)
      WITH count(n) AS nodeCount
      MATCH ()-[r]->()
      RETURN nodeCount, count(r) AS relCount
    `);

    const finalNodeCount = statsResult.records[0].get('nodeCount').toNumber();
    const finalRelCount = statsResult.records[0].get('relCount').toNumber();

    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log(`📊 Total Nodes in CognoDB: ${finalNodeCount}`);
    console.log(`📊 Total Relationships in CognoDB: ${finalRelCount}`);
  } catch (error) {
    console.error('❌ Error seeding CognoDB:', (error as Error).message);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();

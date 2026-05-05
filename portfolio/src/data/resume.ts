export const resume = {
  name: 'Kshitij Bhardwaj',
  role: 'Full Stack Engineer',
  tagline: 'Building scalable web apps and AI-powered systems.',
  summary:
    '2+ years shipping production. Experienced in Python, Node.js, and Laravel, with modern frontend in React and JavaScript. Skilled in LLM post-training, prompt engineering, API development, and cloud deployment.',
  email: 'Kshitijbhardwajkb28@gmail.com',
  phone: '+91 97299 16844',
  location: 'Gurugram, India',
  links: {
    site: 'https://kshitijkb28.github.io',
    github: 'https://github.com/Kshitijkb28',
    linkedin: 'https://www.linkedin.com/in/kshitij-bhardwaj-067240232',
  },
  stats: [
    { label: 'Years of experience', value: '2+' },
    { label: 'Production projects', value: '6+' },
    { label: 'Tech stacks shipped', value: '10+' },
  ],
  skills: [
    {
      title: 'Languages',
      items: ['PHP', 'Python', 'JavaScript', 'C++'],
    },
    {
      title: 'Frontend',
      items: ['React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'],
    },
    {
      title: 'Backend',
      items: ['Node.js', 'FastAPI', 'Flask', 'Laravel'],
    },
    {
      title: 'Databases',
      items: ['PostgreSQL', 'MongoDB', 'MySQL'],
    },
    {
      title: 'Cloud & Tools',
      items: ['AWS S3', 'Docker', 'Git', 'Linux'],
    },
    {
      title: 'AI / LLM',
      items: ['LLM Post-Training', 'Prompt Engineering', 'Model Evaluation', 'Dataset Preparation'],
    },
  ],
  experience: [
    {
      role: 'Full Stack Engineer',
      company: 'Ethara AI',
      period: 'Jan 2026 — Present',
      location: 'Gurugram, India',
      bullets: [
        'Building APIs and backend systems using Python (FastAPI / Flask) for AI-powered applications.',
        'Contributing to LLM post-training workflows — dataset preparation, evaluation pipelines, and response quality improvement.',
        'Developing internal tools to support AI model evaluation and prompt optimization.',
        'Integrating LLM capabilities into products for intelligent automation and enhanced user experiences.',
        'Collaborating with cross-functional teams to improve AI system performance and reliability.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Mind2web LLP',
      period: 'Aug 2023 — Oct 2025',
      location: 'Remote',
      bullets: [
        'Configured and deployed multiple production projects on servers, ensuring optimal performance.',
        'Fixed critical bugs and optimized backend code to improve scalability and system reliability.',
        'Set up Linux servers and configured environments (Apache, Nginx, PHP, Node.js).',
        'Implemented security configurations, monitoring systems, and performance optimization strategies.',
      ],
    },
  ],
  projects: [
    {
      number: '01',
      name: 'Yot Ecommerce',
      period: 'Jan 2025 — Oct 2025',
      url: 'https://fuse.systems',
      tech: ['Meilisearch', 'Ragic DB', 'Twilio', 'OAuth2', 'PostgreSQL'],
      gradient: 'linear-gradient(135deg, #E27500 0%, #C96700 40%, #0F376E 100%)',
      bullets: [
        'Improved product search, workflows, and notifications using Meilisearch, Ragic DB, and Twilio.',
        'Developed product management modules with secure OAuth2 authentication.',
        'Built background jobs to fetch supplier data and auto-update product listings.',
        'Implemented optimized PostgreSQL queries for efficient listing retrieval.',
      ],
    },
    {
      number: '02',
      name: 'Remodely',
      period: 'Oct 2024 — Dec 2025',
      url: 'https://remodely.com',
      tech: ['Laravel', 'MySQL', 'Admin Dashboards', 'Service Booking'],
      gradient: 'linear-gradient(135deg, #0F376E 0%, #345a96 50%, #E27500 100%)',
      bullets: [
        'Built service booking modules and admin dashboards for bathroom and interior design services.',
        'Improved UI functionality and integrated backend services for seamless booking management.',
      ],
    },
    {
      number: '03',
      name: 'Service Points',
      period: 'Oct 2023 — Oct 2024',
      url: 'https://app.servicepoints.nl',
      tech: ['Node.js', 'WebSockets', 'CKEditor', 'Prompt Engineering'],
      gradient: 'linear-gradient(135deg, #333333 0%, #6D6D6D 45%, #E27500 100%)',
      bullets: [
        'Built and integrated chatbot functionalities using prompt engineering techniques.',
        'Developed real-time chat features using WebSockets and CKEditor in Node.js.',
        'Built performance monitoring charts showing 7-day page load trends via automated cURL requests.',
        'Resolved UI inconsistencies to improve visual quality and usability across the application.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Tech — Computer Science',
      school: 'Panipat Institute of Engineering and Technology',
      period: 'Jul 2019 — Jun 2023',
      score: 'Score: 67.4%',
    },
    {
      degree: '12th — Science',
      school: 'Hindu Vidya Peeth',
      period: 'Mar 2018 — Mar 2019',
      score: 'Score: 64%',
    },
  ],
  marqueeWords: [
    'React',
    'Python',
    'Node.js',
    'FastAPI',
    'Laravel',
    'PostgreSQL',
    'AWS',
    'Docker',
    'LLM Post-Training',
    'Prompt Engineering',
  ],
} as const;

export type Resume = typeof resume;

/**
 * Kannan Radhakrishnan M - Portfolio Chat Assistant
 * Standalone client-side AI assistant with instant intent matching,
 * Web Audio API synth sounds, sparkle particle effects, timestamps,
 * rich copyable responses, section navigation, and optional Gemini API support.
 */

(function () {
  'use strict';

  // Portfolio Knowledge Base
  const PORTFOLIO_DATA = {
    name: 'Kannan Radhakrishnan M',
    role: 'CSE Student · Full Stack Developer',
    education: 'B.E. Computer Science and Engineering',
    tagline: 'Building useful digital experiences',
    bio: 'A Computer Science and Engineering student focused on building a strong foundation across frontend, backend, and emerging AI technologies. Curious by nature and practical by habit, turning thoughtful ideas into clean, practical web experiences.',
    skills: {
      frontend: 'HTML5, CSS3, modern JavaScript (ES6+), responsive design, CSS Grid & Flexbox, component patterns.',
      backend: 'Node.js, RESTful APIs, data flows, reliable system architecture.',
      ai: 'Exploring intelligent AI features, Gemini API integration, multimodal prompts, and AI-powered products.',
      inProgress: ['React (Frontend framework)', 'Node.js (Backend runtime)', 'System Design (Scalable architectures)']
    },
    projects: [
      {
        name: 'Sri Krishna Textiles',
        type: 'E-commerce Storefront · Frontend',
        url: 'https://sri-krishna-textiles-psk-mu.vercel.app/',
        github: 'https://github.com/mkannanradhakrishnan',
        languages: ['HTML5', 'CSS3', 'JavaScript (ES6+)'],
        technologies: ['CSS Grid & Flexbox', 'Vercel Deployment', 'Responsive Design', 'Git & GitHub'],
        description: 'A live e-commerce web storefront built for a textiles brand featuring responsive catalog browsing, mobile-first layouts, and smooth micro-interactions.'
      },
      {
        name: 'KRM AI Portfolio & Intelligent Assistant',
        type: 'Interactive Web Application · AI Assistant',
        url: 'https://github.com/mkannanradhakrishnan',
        github: 'https://github.com/mkannanradhakrishnan',
        languages: ['HTML5', 'CSS3', 'Modern JavaScript (ES6+)'],
        technologies: ['Web Audio API Synthesizer', 'Google Gemini API Ready', 'CSS 3D Card Tilt', 'Custom Intent Engine', 'Vercel'],
        description: 'A cutting-edge developer portfolio featuring cinematic entrance animations, dynamic typewriter text motion, 3D card tilt & glare physics, and an interactive assistant powered by custom NLP and Web Audio synth.'
      }
    ],
    contact: {
      phone: '+91 9342709599',
      phoneRaw: '+919342709599',
      email: 'mradhakrishnan360@gmail.com',
      github: 'https://github.com/mkannanradhakrishnan',
      githubUser: 'mkannanradhakrishnan'
    },
    journey: [
      { step: '01 Learn', desc: 'Build strong fundamentals and stay curious.' },
      { step: '02 Build', desc: 'Turn lessons into projects with real purpose.' },
      { step: '03 Share', desc: 'Reflect, improve, and grow with others.' }
    ],
    quote: 'The best way to learn is to keep building.'
  };

  // Pre-configured Quick Suggestions
  const DEFAULT_SUGGESTIONS = [
    'Who is Kannan?',
    'What are his skills?',
    'Show me his projects',
    'How can I contact him?'
  ];

  // Helper to format local time (e.g. "10:15 AM")
  function formatCurrentTime() {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Helper to format bot responses with markdown-like tags and action buttons
  function parseMarkdown(text) {
    if (!text) return '';
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Line breaks
    parsed = parsed.replace(/\n/g, '<br>');
    // Markdown links [label](url)
    parsed = parsed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    return parsed;
  }

  // Smooth scroll to portfolio sections
  function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Smart Intent Matching Engine
  function getLocalResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Navigation / Scroll Intents
    const isNav = (topic) => {
      const patterns = ['go to', 'take me to', 'scroll to', 'jump to', 'navigate to', 'show me the ' + topic, 'view ' + topic];
      return patterns.some(p => q.includes(p) && q.includes(topic));
    };

    if (isNav('project')) {
      scrollToSection('projects');
      return {
        reply: `Scrolled to the **Projects** section! Kannan built the **Sri Krishna Textiles** e-commerce storefront website.`,
        actions: [
          { label: '🛍️ Open Live Storefront', url: 'https://sri-krishna-textiles-psk-mu.vercel.app/' },
          { label: '💼 Contact Kannan', action: 'contact' }
        ],
        suggestions: ['What are his skills?', 'Tell me about Kannan', 'How can I hire him?']
      };
    }

    if (isNav('skill')) {
      scrollToSection('skills');
      return {
        reply: `Navigated to **Skills**! Kannan specializes in Frontend, Backend, and AI exploration.`,
        actions: [{ label: '⚡ View Projects', action: 'projects' }],
        suggestions: ['Is he learning React?', 'Show me his projects', 'Contact Kannan']
      };
    }

    if (isNav('contact')) {
      scrollToSection('contact');
      return {
        reply: `Here is Kannan's **Contact** information! You can call or email him directly.`,
        actions: [
          { label: '📞 Call +91 9342709599', url: 'tel:+919342709599' },
          { label: '✉️ Send Email', url: 'mailto:mradhakrishnan360@gmail.com' }
        ],
        suggestions: ['Is he open to work?', 'Who is Kannan?', 'Show me projects']
      };
    }

    if (isNav('about')) {
      scrollToSection('about');
      return {
        reply: `Navigated to the **About** section! Kannan is a Computer Science and Engineering student focused on building practical web experiences.`,
        suggestions: ['What are his tech skills?', 'Show me projects', 'How to contact?']
      };
    }

    // 2. Greetings
    if (/^(hi|hello|hey|yo|hola|greetings|good\s*(morning|afternoon|evening))/i.test(q)) {
      return {
        reply: `Hello there! 👋 I'm **KRM Assistant**, Kannan's portfolio AI. How can I help you today? You can ask me about his **projects**, **skills**, **journey**, or how to get in touch!`,
        suggestions: ['Who is Kannan?', 'What are his skills?', 'Show me his projects', 'How can I contact him?']
      };
    }

    // 3. React specifically
    if (q.includes('react')) {
      return {
        reply: `Yes! Kannan is actively leveling up his **React** skills, building component-driven frontend interfaces and modern web applications.`,
        actions: [{ label: '🛠️ See Skills Section', action: 'skills' }],
        suggestions: ['What other skills does he have?', 'Show me projects', 'Contact Kannan']
      };
    }

    // 4. Node.js or Backend specifically
    if (q.includes('node') || q.includes('backend') || q.includes('api')) {
      return {
        reply: `Kannan works with **Node.js** for building RESTful APIs, routing, and designing reliable backend data flows to power full-stack experiences.`,
        actions: [{ label: '🛠️ See Skills Section', action: 'skills' }],
        suggestions: ['What frontend skills does he have?', 'Show me projects', 'Contact Kannan']
      };
    }

    // 5. AI / Gemini specifically
    if (q.includes('ai') || q.includes('gemini') || q.includes('machine learning') || q.includes('llm') || q.includes('bot')) {
      return {
        reply: `Kannan is deeply interested in AI application development! He experiments with intelligent features, Google Gemini API integration, and incorporating LLM-assisted workflows directly into modern web apps.`,
        suggestions: ['Show me projects', 'What are his tech skills?', 'Contact Kannan']
      };
    }

    // 6. Projects / Work / Portfolio
    if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('portfolio') || q.includes('sri krishna') || q.includes('textiles') || q.includes('storefront') || q.includes('app') || q.includes('assistant') || q.includes('website')) {
      if (q.includes('sri krishna') || q.includes('textiles') || q.includes('storefront')) {
        const proj = PORTFOLIO_DATA.projects[0];
        return {
          reply: `Here are details on **${proj.name}**:\n\n• **Type:** ${proj.type}\n• **Languages:** ${proj.languages.join(', ')}\n• **Technologies:** ${proj.technologies.join(', ')}\n• **Description:** ${proj.description}\n• **Status:** Live on Vercel 🚀`,
          actions: [
            { label: '🚀 Visit Live Storefront', url: proj.url },
            { label: '🐙 View on GitHub', url: proj.github },
            { label: '📂 Jump to Projects', action: 'projects' }
          ],
          suggestions: ['Tell me about the AI Portfolio project', 'What are his tech skills?', 'How to contact Kannan?']
        };
      }

      if (q.includes('ai') || q.includes('assistant') || q.includes('intelligent') || q.includes('bot') || q.includes('krm')) {
        const proj = PORTFOLIO_DATA.projects[1];
        return {
          reply: `Here are details on **${proj.name}**:\n\n• **Type:** ${proj.type}\n• **Languages:** ${proj.languages.join(', ')}\n• **Technologies:** ${proj.technologies.join(', ')}\n• **Description:** ${proj.description}\n• **Features:** Dynamic typewriter motion, page entrance animations, Web Audio synthesizer, and 3D card tilt physics!`,
          actions: [
            { label: '🐙 View on GitHub', url: proj.github },
            { label: '📂 Jump to Projects', action: 'projects' }
          ],
          suggestions: ['Tell me about Sri Krishna Textiles', 'What skills does he have?', 'Can I hire Kannan?']
        };
      }

      const p1 = PORTFOLIO_DATA.projects[0];
      const p2 = PORTFOLIO_DATA.projects[1];
      return {
        reply: `Kannan has built two highlighted projects showcasing his frontend, backend, and interactive development skills:\n\n1. **${p1.name}** (${p1.languages.join(', ')}) — ${p1.description}\n\n2. **${p2.name}** (${p2.languages.join(', ')}) — ${p2.description}`,
        actions: [
          { label: '🚀 Visit Sri Krishna Textiles', url: p1.url },
          { label: '🐙 GitHub Profile', url: PORTFOLIO_DATA.contact.github },
          { label: '📂 Jump to Projects', action: 'projects' }
        ],
        suggestions: ['Tell me about Sri Krishna Textiles', 'Tell me about the AI Portfolio', 'How can I contact Kannan?']
      };
    }

    // 7. Skills & Tech Stack
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('tool') || q.includes('framework') || q.includes('frontend')) {
      return {
        reply: `Here are Kannan's primary technical capabilities:\n\n• **Frontend:** ${PORTFOLIO_DATA.skills.frontend}\n• **Backend:** ${PORTFOLIO_DATA.skills.backend}\n• **AI Exploration:** ${PORTFOLIO_DATA.skills.ai}\n\n**Currently Learning:** React, Node.js, and System Design patterns.`,
        actions: [
          { label: '🎯 Jump to Skills Section', action: 'skills' },
          { label: '🚀 View Projects', action: 'projects' }
        ],
        suggestions: ['Show me his projects', 'Is he learning React?', 'How can I contact him?']
      };
    }

    // 8. Who is Kannan / About / Bio / Education
    if (q.includes('who is') || q.includes('about') || q.includes('bio') || q.includes('background') || q.includes('education') || q.includes('college') || q.includes('student') || q.includes('cse') || q.includes('yourself')) {
      return {
        reply: `**Kannan Radhakrishnan M** is a **B.E. Computer Science and Engineering** student and **Full Stack Developer** from India.\n\nHe is passionate about creating clean, practical web experiences, combining strong fundamentals in frontend & backend development with emerging AI technologies.`,
        actions: [
          { label: '📜 View About Section', action: 'about' },
          { label: '🛠️ See Skills', action: 'skills' }
        ],
        suggestions: ['What are his skills?', 'Show me his projects', 'How to contact Kannan?']
      };
    }

    // 9. GitHub / Code / Repositories
    if (q.includes('github') || q.includes('repo') || q.includes('git') || q.includes('source code')) {
      return {
        reply: `You can check out all of Kannan's open-source projects, repositories, and source code experiments on GitHub:\n\n🐙 **[@mkannanradhakrishnan](https://github.com/mkannanradhakrishnan)**`,
        actions: [
          { label: '🐙 Open GitHub Profile', url: 'https://github.com/mkannanradhakrishnan' },
          { label: '🚀 View Portfolio Projects', action: 'projects' }
        ],
        suggestions: ['Show me his projects', 'What are his skills?', 'How to contact Kannan?']
      };
    }

    // 10. Contact / Phone / Email / Hire / Internship / Opportunities
    if (q.includes('contact') || q.includes('hire') || q.includes('reach') || q.includes('email') || q.includes('phone') || q.includes('call') || q.includes('job') || q.includes('internship') || q.includes('collaborat') || q.includes('freelance') || q.includes('opportunity')) {
      return {
        reply: `Kannan is **open to internships, freelance projects, and exciting developer collaborations**!\n\nYou can reach him directly via:\n• **Phone:** [${PORTFOLIO_DATA.contact.phone}](tel:${PORTFOLIO_DATA.contact.phoneRaw})\n• **Email:** [${PORTFOLIO_DATA.contact.email}](mailto:${PORTFOLIO_DATA.contact.email})\n• **GitHub:** [@mkannanradhakrishnan](https://github.com/mkannanradhakrishnan)`,
        actions: [
          { label: '📞 Call Kannan', url: `tel:${PORTFOLIO_DATA.contact.phoneRaw}` },
          { label: '✉️ Send Email', url: `mailto:${PORTFOLIO_DATA.contact.email}` },
          { label: '🐙 GitHub Profile', url: PORTFOLIO_DATA.contact.github }
        ],
        suggestions: ['Show me his projects', 'What are his skills?', 'Who is Kannan?']
      };
    }

    // 11. Journey / Philosophy / Quote
    if (q.includes('journey') || q.includes('philosophy') || q.includes('quote') || q.includes('learn') || q.includes('goals')) {
      return {
        reply: `Kannan's engineering philosophy is:\n\n*“${PORTFOLIO_DATA.quote}”*\n\nHis roadmap is built around 3 pillars:\n1. **Learn:** Build strong fundamentals & stay curious.\n2. **Build:** Turn lessons into projects with real purpose.\n3. **Share:** Reflect, improve, and grow with others.`,
        actions: [{ label: '🧭 View Journey Section', action: 'journey' }],
        suggestions: ['Show me projects', 'What are his skills?', 'How to contact?']
      };
    }

    // 12. Thanks / Compliments
    if (q.includes('thank') || q.includes('thanks') || q.includes('cool') || q.includes('awesome') || q.includes('great') || q.includes('good job')) {
      return {
        reply: `You're very welcome! 😊 Feel free to explore the portfolio or drop Kannan a message anytime.`,
        actions: [{ label: '✉️ Contact Kannan', action: 'contact' }],
        suggestions: ['Show me his projects', 'What are his skills?']
      };
    }

    // 13. Help / What can you do
    if (q.includes('help') || q.includes('what can you do') || q.includes('commands') || q.includes('options')) {
      return {
        reply: `I can answer all your questions regarding Kannan! For example:\n• Ask about his **background & degree**\n• Explore his **frontend, backend, & AI skills**\n• Check out the **Sri Krishna Textiles project**\n• View his **GitHub profile (@mkannanradhakrishnan)**\n• Get his **phone number or email**\n• Tell me to navigate to any section!`,
        suggestions: ['Who is Kannan?', 'What are his skills?', 'Show me his projects', 'GitHub Profile']
      };
    }

    // 14. Fallback with smart recommendations
    return {
      reply: `That's a great question! I specialize in sharing info about **Kannan's full-stack development skills, projects, GitHub repositories, and contact details**.\n\nWould you like to know more about his background, view his work, or get in touch?`,
      actions: [
        { label: '💼 Contact Kannan', action: 'contact' },
        { label: '🐙 GitHub Profile', url: PORTFOLIO_DATA.contact.github },
        { label: '🚀 View Projects', action: 'projects' }
      ],
      suggestions: ['Who is Kannan?', 'What are his skills?', 'Show me his projects', 'How can I contact him?']
    };
  }

  // Gemini API Caller (Optional user key mode)
  async function callGeminiApi(apiKey, userMessage, conversationHistory) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `You are KRM Assistant, the friendly AI portfolio assistant for Kannan Radhakrishnan M.
Profile Details:
- Name: Kannan Radhakrishnan M
- Role: CSE Student · Full Stack Developer
- Phone: +91 9342709599
- Email: mradhakrishnan360@gmail.com
- GitHub: https://github.com/mkannanradhakrishnan (@mkannanradhakrishnan)
- Skills: Frontend (HTML, CSS, JavaScript, responsive design), Backend (Node.js, APIs), AI Exploration (Gemini API), Learning React & System Design.
- Projects: Sri Krishna Textiles (live e-commerce fashion storefront website: https://sri-krishna-textiles-psk-mu.vercel.app/).
- Tone: Helpful, enthusiastic, concise, professional. Keep answers under 3 short paragraphs. Recommend contacting Kannan when relevant.`;

    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      { role: 'model', parts: [{ text: "Understood! I am KRM Assistant and will help visitors explore Kannan's portfolio." }] }
    ];

    // Append recent turns
    conversationHistory.slice(-6).forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) throw new Error('No response text');

    return {
      reply: replyText,
      actions: [
        { label: '📞 Call Kannan', url: `tel:${PORTFOLIO_DATA.contact.phoneRaw}` },
        { label: '✉️ Email Kannan', url: `mailto:${PORTFOLIO_DATA.contact.email}` }
      ],
      suggestions: ['Tell me about projects', 'What are your skills?', 'Contact Kannan']
    };
  }

  // Chatbot UI Controller Class
  class PortfolioChatbot {
    constructor() {
      this.isOpen = false;
      this.isThinking = false;
      this.history = [];
      this.apiKey = localStorage.getItem('krm_gemini_api_key') || '';
      this.isSoundEnabled = localStorage.getItem('krm_chat_sound') !== 'false';
      this.audioCtx = null;

      this.initDom();
      this.attachEvents();
    }

    playAudio(type) {
      if (!this.isSoundEnabled) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        if (type === 'open') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.14);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        } else if (type === 'send') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(540, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'receive') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.setValueAtTime(880, now + 0.09);
          gain.gain.setValueAtTime(0.045, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        }
      } catch (e) {
        // Ignore audio failures
      }
    }

    spawnSparkles(x, y) {
      const colors = ['#2fd7d0', '#9b6bff', '#4f7fff', '#ec5bb4'];
      const count = 14;
      for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'krm-sparkle';
        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const distance = Math.random() * 55 + 35;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 650);
      }
    }

    initDom() {
      // 1. Teaser Badge + Launcher Button
      const launcherMarkup = `
        <div id="krm-chat-launcher-wrap" class="krm-chat-launcher-wrap">
          <div id="krm-chat-teaser" class="krm-chat-teaser" role="tooltip">
            <span>Ask me anything about Kannan! 👋</span>
            <button id="krm-teaser-close" class="krm-teaser-close" aria-label="Dismiss">&times;</button>
          </div>
          <button id="krm-chat-toggle" class="krm-chat-toggle" aria-label="Open AI Chat Assistant" title="Chat with KRM Assistant">
            <span class="krm-toggle-pulse"></span>
            <div class="krm-toggle-icon">
              <!-- Modern Chatbot SVG Icon -->
              <svg class="krm-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                <circle cx="9" cy="12" r="1" fill="currentColor"></circle>
                <circle cx="15" cy="12" r="1" fill="currentColor"></circle>
              </svg>
              <!-- Close SVG Icon -->
              <svg class="krm-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <span class="krm-badge-online"></span>
          </button>
        </div>
      `;

      // 2. Chatbot Window
      const windowMarkup = `
        <div id="krm-chat-window" class="krm-chat-window" role="dialog" aria-modal="true" aria-label="KRM Assistant Chat Window" hidden>
          <!-- Header -->
          <div class="krm-chat-header">
            <div class="krm-header-left">
              <div class="krm-bot-avatar">
                <div class="krm-avatar-inner">AI</div>
                <span class="krm-status-dot" title="Active"></span>
              </div>
              <div class="krm-bot-meta">
                <h3 class="krm-bot-title">KRM Assistant</h3>
                <span class="krm-bot-subtitle"><span class="krm-green-dot"></span> Online · Kannan's Portfolio AI</span>
              </div>
            </div>
            <div class="krm-header-actions">
              <!-- Sound Toggle -->
              <button id="krm-btn-sound" class="krm-hbtn ${this.isSoundEnabled ? '' : 'krm-muted'}" title="Toggle Sound" aria-label="Toggle Sound Effects">
                <svg class="krm-icon-sound-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <svg class="krm-icon-sound-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              </button>
              <!-- Reset Chat -->
              <button id="krm-btn-clear" class="krm-hbtn" title="Reset Conversation" aria-label="Reset Conversation">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
              </button>
              <!-- Close Chat -->
              <button id="krm-btn-close" class="krm-hbtn" title="Minimize Chat" aria-label="Close Chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <!-- Body Messages -->
          <div id="krm-chat-messages" class="krm-chat-messages" role="log" aria-live="polite">
            <!-- Messages rendered dynamically -->
          </div>

          <!-- Dynamic Suggestions Bar -->
          <div id="krm-chat-suggestions" class="krm-chat-suggestions">
            <!-- Chips rendered dynamically -->
          </div>

          <!-- Input Footer -->
          <form id="krm-chat-form" class="krm-chat-form" autocomplete="off">
            <input
              type="text"
              id="krm-chat-input"
              class="krm-chat-input"
              placeholder="Ask about skills, projects, contact..."
              maxlength="300"
              required
            />
            <button type="submit" id="krm-chat-send" class="krm-chat-send" aria-label="Send Message" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      `;

      const container = document.createElement('div');
      container.id = 'krm-chat-root';
      container.innerHTML = launcherMarkup + windowMarkup;
      document.body.appendChild(container);

      // Element References
      this.launcherWrap = document.getElementById('krm-chat-launcher-wrap');
      this.toggleBtn = document.getElementById('krm-chat-toggle');
      this.teaser = document.getElementById('krm-chat-teaser');
      this.teaserClose = document.getElementById('krm-teaser-close');
      this.chatWindow = document.getElementById('krm-chat-window');
      this.closeBtn = document.getElementById('krm-btn-close');
      this.clearBtn = document.getElementById('krm-btn-clear');
      this.soundBtn = document.getElementById('krm-btn-sound');
      this.messagesContainer = document.getElementById('krm-chat-messages');
      this.suggestionsContainer = document.getElementById('krm-chat-suggestions');
      this.form = document.getElementById('krm-chat-form');
      this.input = document.getElementById('krm-chat-input');
      this.sendBtn = document.getElementById('krm-chat-send');

      // Initialize welcome state
      this.renderWelcome();
    }

    renderWelcome() {
      this.messagesContainer.innerHTML = '';
      this.addBotMessage({
        reply: `Hi! 👋 I'm **KRM Assistant**, Kannan's interactive portfolio assistant.\n\nAsk me anything about Kannan's **projects**, **skills**, **background**, or how to collaborate with him!`,
        suggestions: DEFAULT_SUGGESTIONS
      });
    }

    attachEvents() {
      // Toggle chat & sparkles
      this.toggleBtn.addEventListener('click', (e) => {
        const rect = this.toggleBtn.getBoundingClientRect();
        this.spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        this.toggleChat();
      });

      this.closeBtn.addEventListener('click', () => this.closeChat());
      this.clearBtn.addEventListener('click', () => this.renderWelcome());

      // Toggle sound
      this.soundBtn.addEventListener('click', () => {
        this.isSoundEnabled = !this.isSoundEnabled;
        localStorage.setItem('krm_chat_sound', String(this.isSoundEnabled));
        this.soundBtn.classList.toggle('krm-muted', !this.isSoundEnabled);
        if (this.isSoundEnabled) {
          this.playAudio('open');
        }
      });

      // Teaser close
      this.teaserClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.teaser.style.display = 'none';
      });

      this.teaser.addEventListener('click', (e) => {
        const rect = this.toggleBtn.getBoundingClientRect();
        this.spawnSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        this.openChat();
      });

      // Enable/disable send button based on input
      this.input.addEventListener('input', () => {
        this.sendBtn.disabled = !this.input.value.trim();
      });

      // Submit form
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.input.value.trim();
        if (!text || this.isThinking) return;
        this.handleUserSend(text);
      });

      // Close on escape key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.chatWindow.hidden = false;
      this.chatWindow.classList.add('krm-open');
      this.toggleBtn.classList.add('krm-active');
      this.teaser.style.display = 'none';
      this.playAudio('open');
      this.scrollToBottom();

      setTimeout(() => {
        this.input.focus();
      }, 150);
    }

    closeChat() {
      this.isOpen = false;
      this.chatWindow.classList.remove('krm-open');
      this.toggleBtn.classList.remove('krm-active');
      setTimeout(() => {
        if (!this.isOpen) {
          this.chatWindow.hidden = true;
        }
      }, 300);
    }

    scrollToBottom() {
      const raf = typeof window !== 'undefined' && window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout;
      raf(() => {
        if (this.messagesContainer) {
          this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
      });
    }

    addUserMessage(text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'krm-msg krm-msg-user';
      msgDiv.innerHTML = `
        <div class="krm-bubble-wrap" style="align-items: flex-end;">
          <div class="krm-bubble krm-bubble-user">${parseMarkdown(text)}</div>
          <span class="krm-msg-time">${formatCurrentTime()}</span>
        </div>
      `;
      this.messagesContainer.appendChild(msgDiv);
      this.scrollToBottom();
      this.playAudio('send');
      this.history.push({ sender: 'user', text });
    }

    showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'krm-msg krm-msg-bot krm-typing-row';
      typingDiv.id = 'krm-typing-indicator';
      typingDiv.innerHTML = `
        <div class="krm-bot-avatar-sm">AI</div>
        <div class="krm-bubble krm-bubble-bot krm-typing-bubble">
          <span class="krm-dot"></span>
          <span class="krm-dot"></span>
          <span class="krm-dot"></span>
        </div>
      `;
      this.messagesContainer.appendChild(typingDiv);
      this.scrollToBottom();
      this.isThinking = true;
    }

    removeTypingIndicator() {
      const indicator = document.getElementById('krm-typing-indicator');
      if (indicator) {
        if (typeof indicator.remove === 'function') {
          indicator.remove();
        } else if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }
      this.isThinking = false;
    }

    addBotMessage(data) {
      this.removeTypingIndicator();

      const msgDiv = document.createElement('div');
      msgDiv.className = 'krm-msg krm-msg-bot';

      let actionsHtml = '';
      if (data.actions && data.actions.length > 0) {
        actionsHtml = `<div class="krm-actions-row">` +
          data.actions.map(act => {
            if (act.url) {
              return `<a href="${act.url}" target="_blank" rel="noopener noreferrer" class="krm-action-btn">${act.label}</a>`;
            } else if (act.action) {
              return `<button type="button" class="krm-action-btn" data-target="${act.action}">${act.label}</button>`;
            }
            return '';
          }).join('') +
          `</div>`;
      }

      msgDiv.innerHTML = `
        <div class="krm-bot-avatar-sm">AI</div>
        <div class="krm-bubble-wrap">
          <div class="krm-bubble krm-bubble-bot">${parseMarkdown(data.reply)}</div>
          ${actionsHtml}
          <div class="krm-bubble-footer">
            <span class="krm-msg-time">${formatCurrentTime()}</span>
            <button type="button" class="krm-copy-btn" title="Copy text" aria-label="Copy Message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            </button>
          </div>
        </div>
      `;

      this.messagesContainer.appendChild(msgDiv);

      // Copy message button handler
      const copyBtn = msgDiv.querySelector('.krm-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            const rawText = data.reply.replace(/\*\*/g, '').replace(/\*/g, '');
            await navigator.clipboard.writeText(rawText);
            copyBtn.classList.add('copied');
            copyBtn.querySelector('span').textContent = 'Copied!';
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.querySelector('span').textContent = 'Copy';
            }, 1800);
          } catch (err) {
            // Fallback for older browsers
          }
        });
      }

      // Attach click events to action buttons
      msgDiv.querySelectorAll('button[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-target');
          scrollToSection(target);
          if (window.innerWidth < 640) {
            this.closeChat();
          }
        });
      });

      // Render suggestions
      this.renderSuggestions(data.suggestions || DEFAULT_SUGGESTIONS);
      this.scrollToBottom();
      this.playAudio('receive');
      this.history.push({ sender: 'bot', text: data.reply });
    }

    renderSuggestions(suggestions) {
      if (!suggestions || suggestions.length === 0) {
        this.suggestionsContainer.innerHTML = '';
        return;
      }

      this.suggestionsContainer.innerHTML = suggestions.map(s => {
        return `<button type="button" class="krm-chip">${s}</button>`;
      }).join('');

      this.suggestionsContainer.querySelectorAll('.krm-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const question = chip.textContent.trim();
          this.handleUserSend(question);
        });
      });
    }

    async handleUserSend(text) {
      this.addUserMessage(text);
      this.input.value = '';
      this.sendBtn.disabled = true;
      this.suggestionsContainer.innerHTML = '';

      this.showTypingIndicator();

      // Check if Gemini API key exists
      if (this.apiKey) {
        try {
          const response = await callGeminiApi(this.apiKey, text, this.history);
          this.addBotMessage(response);
          return;
        } catch (err) {
          console.warn('Gemini API call failed, falling back to local engine:', err);
        }
      }

      // Default smart local response with human-like realistic typing delay
      setTimeout(() => {
        const response = getLocalResponse(text);
        this.addBotMessage(response);
      }, 450);
    }
  }

  // Initialize once DOM is ready and expose global helpers
  let chatbotInstance = null;
  function initChatbot() {
    if (!chatbotInstance) {
      chatbotInstance = new PortfolioChatbot();
      window.krmChatbotInstance = chatbotInstance;
    }
    return chatbotInstance;
  }

  // Global helper to trigger chat from project buttons or external links
  window.openKrmChatWithQuery = function (query) {
    const bot = chatbotInstance || initChatbot();
    bot.openChat();
    if (query) {
      setTimeout(() => {
        bot.handleUserSend(query);
      }, 350);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();

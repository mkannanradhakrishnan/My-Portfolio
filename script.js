/**
 * Kannan Radhakrishnan M - Main Portfolio Scripts
 * Typing effect, scroll reveal, scroll progress, cursor follower, 3D tilt, and navigation.
 */

// 0. Page Entrance Preloader & Reveal Animation
function initPageEntrance() {
  const pageLoader = document.getElementById('page-loader');

  function revealPage() {
    if (document.body.classList.contains('loaded')) return;
    document.body.classList.add('loaded');

    // Once fade-out transition finishes, hide loader element completely
    if (pageLoader) {
      setTimeout(() => {
        pageLoader.setAttribute('aria-hidden', 'true');
        pageLoader.style.display = 'none';
      }, 700);
    }

    // Trigger typewriter sequence on entrance
    setTimeout(initTypewriterEffect, 200);
  }

  if (document.readyState === 'complete') {
    revealPage();
  } else {
    window.addEventListener('load', revealPage);
    // Fallback safety timeout in case assets take long or stall
    setTimeout(revealPage, 1100);
  }
}

// 0.1 Typewriter Motion Effect for Headings & Badges
function initTypewriterEffect() {
  const elements = document.querySelectorAll('.typewriter-text');
  elements.forEach((el) => {
    const fullText = el.getAttribute('data-text') || el.textContent.trim();
    if (!fullText) return;

    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.parentNode.insertBefore(cursor, el.nextSibling);

    let charIdx = 0;
    function typeChar() {
      if (charIdx < fullText.length) {
        el.textContent += fullText.charAt(charIdx);
        charIdx++;
        // Slight variable delay for realistic typing motion
        const speed = 40 + Math.random() * 30;
        setTimeout(typeChar, speed);
      } else {
        // Keep cursor blinking for a brief period, then gracefully fade it
        setTimeout(() => {
          cursor.style.transition = 'opacity 0.6s ease';
          cursor.style.opacity = '0';
          setTimeout(() => cursor.remove(), 600);
        }, 2500);
      }
    }
    typeChar();
  });
}

// 1. Role Typing Animation
const roleElement = document.querySelector('#typed-role');
const roles = [
  'Building useful digital experiences',
  'Exploring full-stack development',
  'Learning through real projects'
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeRole() {
  if (!roleElement) return;

  const role = roles[roleIndex];
  roleElement.textContent = role.slice(0, characterIndex);

  if (!deleting && characterIndex < role.length) {
    characterIndex += 1;
    window.setTimeout(typeRole, 65);
    return;
  }

  if (!deleting) {
    deleting = true;
    window.setTimeout(typeRole, 1700);
    return;
  }

  if (characterIndex > 0) {
    characterIndex -= 1;
    window.setTimeout(typeRole, 32);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  window.setTimeout(typeRole, 280);
}

// 2. Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => revealObserver.observe(element));

// 3. Header Scroll Effect & Top Reading Progress Bar
const header = document.querySelector('header');
const scrollProgress = document.getElementById('scroll-progress');

function onScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  header?.classList.toggle('scrolled', scrollY > 24);

  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// 4. Smooth Mouse Follower for Cursor Glow
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursorGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateCursorGlow);
  }
  requestAnimationFrame(animateCursorGlow);
}

// 5. 3D Tilt & Dynamic Glare Effect on Cards
function initTiltEffects() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const tiltElements = document.querySelectorAll('.project-card, .skill-card, .about-card, .portrait-frame');

  tiltElements.forEach((card) => {
    // Add glare overlay element if not present
    if (!card.querySelector('.tilt-glare')) {
      const glare = document.createElement('div');
      glare.className = 'tilt-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (degrees)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      card.style.setProperty('--glare-x', `${x}px`);
      card.style.setProperty('--glare-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 6. Mobile Menu & Burger Toggle
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

// Close mobile menu when header links clicked
document.querySelectorAll('header a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// 7. Project Action Triggers & AI Chatbot Integration
function initProjectActions() {
  // "Ask AI About This" buttons on project cards
  document.querySelectorAll('.btn-ask-ai').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectName = btn.getAttribute('data-ask-project') || 'your projects';
      if (typeof window.openKrmChatWithQuery === 'function') {
        window.openKrmChatWithQuery(`Tell me about ${projectName}`);
      } else {
        const toggle = document.getElementById('krm-chat-toggle');
        toggle?.click();
      }
    });
  });

  // "Launch AI Assistant" buttons
  document.querySelectorAll('.btn-trigger-chat').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.openKrmChatWithQuery === 'function') {
        window.openKrmChatWithQuery('Tell me about the KRM AI Portfolio & Intelligent Assistant project');
      } else {
        const toggle = document.getElementById('krm-chat-toggle');
        toggle?.click();
      }
    });
  });
}

// Initialize on Load
initPageEntrance();
typeRole();
initTiltEffects();
initProjectActions();
onScroll();

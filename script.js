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

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => revealObserver.observe(element));

document.querySelectorAll('header a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelector('.mobile-menu')?.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

typeRole();

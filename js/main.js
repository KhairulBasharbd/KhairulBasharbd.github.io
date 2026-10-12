/**
 * Khairul Basar - Portfolio Main JavaScript
 * High-performance, clean vanilla JS for motion, mobile drawer, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initSmoothScroll();
  initCopyEmail();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initActiveNavSpy();
  initCurrentYear();
  initScrollAnimations();
  initCardSpotlight();
});

/**
 * Mobile Navigation Drawer & Morphing Hamburger
 */
function initMobileDrawer() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  if (!menuToggle || !mobileDrawer) return;

  function openMenu() {
    mobileDrawer.style.display = 'flex';
    requestAnimationFrame(() => {
      mobileDrawer.classList.add('open');
      menuToggle.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMenu() {
    mobileDrawer.classList.remove('open');
    menuToggle.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!mobileDrawer.classList.contains('open')) {
        mobileDrawer.style.display = 'none';
      }
    }, 350);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeMenu);
  }

  // Close when clicking any nav link inside drawer
  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when tapping outside drawer
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Smooth Scroll for Navigation Anchors with Header Offset
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('nav')?.offsetHeight || 75;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Copy Email to Clipboard with Toast Notification
 */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  const emailToCopy = 'khairulbasar.dev@gmail.com';
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailToCopy)
          .then(() => showToast(`Copied ${emailToCopy} to clipboard!`))
          .catch(() => fallbackCopy(emailToCopy));
      } else {
        fallbackCopy(emailToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      prompt('Copy email manually:', text);
    }
    document.body.removeChild(textarea);
  }
}

/**
 * Project Category Filter Tabs with Smooth Animation
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedCategory = this.getAttribute('data-filter');

      // Update button styling
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/50');
        b.classList.add('bg-slate-800/60', 'text-slate-400', 'border-slate-700/60');
      });
      this.classList.remove('bg-slate-800/60', 'text-slate-400', 'border-slate-700/60');
      this.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/50');

      // Filter cards
      projectCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category')?.split(' ') || [];
        if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
          card.style.display = 'flex';
          card.classList.remove('fade-in-up');
          void card.offsetWidth; // Trigger reflow
          card.classList.add('fade-in-up');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Contact Form Handler (Direct mailto + UI confirmation)
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const subject = document.getElementById('subject')?.value || 'Engineering Inquiry';
      const message = document.getElementById('message')?.value || '';

      const mailtoLink = `mailto:khairulbasar.dev@gmail.com?subject=${encodeURIComponent(`[Portfolio] ${subject} - from ${name}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;

      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        formSuccess.classList.add('fade-in-up');
      }

      form.reset();

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);
    });
  }
}

/**
 * Back to Top Floating Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Active Navigation Link Highlighting on Scroll
 */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Set Dynamic Current Year
 */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Scroll Triggered Animations for Cards
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.metric-card, .project-card, .glass-panel, .terminal-window');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/**
 * Interactive Mouse Spotlight Effect on Cards
 */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.glass-panel, .project-card, .metric-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
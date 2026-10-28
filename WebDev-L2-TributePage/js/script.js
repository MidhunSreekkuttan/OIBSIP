/**
 * Tribute Page JavaScript
 * Dr. A. P. J. Abdul Kalam
 * Features: Dark/Light Mode, Mobile Navigation, Interactive Quotes Carousel,
 * Timeline Filtering, Scroll Spy, Back-to-top button, and Offline Fallback.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Dark / Light Theme Toggle with LocalStorage
  // -------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Initialize theme from storage or system preference
  const savedTheme = localStorage.getItem('tribute-theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('tribute-theme', currentTheme);
    });
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Hamburger Navigation Menu
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a navigation item is clicked
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('open')) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Navbar Background Elevation on Scroll & Back to Top Button
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar blur background intensifier
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top floating button visibility
    if (backToTopBtn) {
      if (scrollPos > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Scroll Spy (Active Navigation Highlighting)
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // -------------------------------------------------------------------------
  // 5. Interactive Timeline Category Filter
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
          }, 10);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. Interactive Quotes Generator / Showcase
  // -------------------------------------------------------------------------
  const quotes = [
    {
      text: "If you want to shine like a sun, first burn like a sun.",
      source: "Dr. A. P. J. Abdul Kalam • Wings of Fire"
    },
    {
      text: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
      source: "Dr. A. P. J. Abdul Kalam • Address to Students"
    },
    {
      text: "You cannot change your future, but you can change your habits, and surely your habits will change your future.",
      source: "Dr. A. P. J. Abdul Kalam • Ignited Minds"
    },
    {
      text: "Failure will never overtake me if my determination to succeed is strong enough.",
      source: "Dr. A. P. J. Abdul Kalam • My Journey"
    },
    {
      text: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, knowledge makes you great.",
      source: "Dr. A. P. J. Abdul Kalam • Indomitable Spirit"
    },
    {
      text: "Excellence happens not by accident. It is a process requiring sustained devotion.",
      source: "Dr. A. P. J. Abdul Kalam • Convocation Address"
    },
    {
      text: "To succeed in your mission, you must have single-minded devotion to your goal.",
      source: "Dr. A. P. J. Abdul Kalam • India 2020"
    }
  ];

  let currentQuoteIndex = 0;
  const quoteTextEl = document.getElementById('quoteText');
  const quoteSourceEl = document.getElementById('quoteSource');
  const newQuoteBtn = document.getElementById('newQuoteBtn');
  const copyQuoteBtn = document.getElementById('copyQuoteBtn');
  const quoteDotsContainer = document.getElementById('quoteDots');

  // Generate navigation indicator dots
  if (quoteDotsContainer) {
    quotes.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('quote-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('title', `Quote ${idx + 1}`);
      dot.addEventListener('click', () => renderQuote(idx));
      quoteDotsContainer.appendChild(dot);
    });
  }

  function renderQuote(index) {
    currentQuoteIndex = index;

    if (quoteTextEl && quoteSourceEl) {
      quoteTextEl.style.opacity = '0';
      quoteSourceEl.style.opacity = '0';

      setTimeout(() => {
        quoteTextEl.innerHTML = `&ldquo;${quotes[index].text}&rdquo;`;
        quoteSourceEl.innerHTML = `&mdash; ${quotes[index].source}`;
        quoteTextEl.style.opacity = '1';
        quoteSourceEl.style.opacity = '1';
      }, 200);
    }

    // Update dots
    const dots = document.querySelectorAll('.quote-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  if (newQuoteBtn) {
    newQuoteBtn.addEventListener('click', () => {
      let nextIndex = (currentQuoteIndex + 1) % quotes.length;
      renderQuote(nextIndex);
    });
  }

  // Copy Quote to Clipboard with Toast Notification
  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', () => {
      const activeQuote = quotes[currentQuoteIndex];
      const textToCopy = `"${activeQuote.text}" — ${activeQuote.source}`;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Quote copied to clipboard! 📋");
      }).catch(() => {
        showToast("Quote copied!");
      });
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // -------------------------------------------------------------------------
  // 7. Royalty-free Image Offline / Error Fallback
  // -------------------------------------------------------------------------
  const heroImage = document.getElementById('heroImage');
  if (heroImage) {
    heroImage.addEventListener('error', () => {
      // Graceful high-resolution SVG fallback with artistic silhouette
      heroImage.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="%231E293B"/>
            <stop offset="100%" stop-color="%230F172A"/>
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="%23F59E0B"/>
            <stop offset="100%" stop-color="%23D97706"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="url(%23bg)"/>
        <circle cx="300" cy="280" r="140" fill="%23334155" stroke="url(%23gold)" stroke-width="6"/>
        <!-- Stylized Portrait Silhouette -->
        <circle cx="300" cy="240" r="75" fill="%23E2E8F0"/>
        <path d="M190 440 Q300 370 410 440 L410 520 L190 520 Z" fill="%23E2E8F0"/>
        <!-- Distinct Silver Hair Shape of Kalam -->
        <path d="M210 230 C205 170 240 140 300 140 C360 140 395 170 390 230 C380 200 360 180 300 180 C240 180 220 200 210 230 Z" fill="%2394A3B8"/>
        <!-- Laurels & Accents -->
        <text x="300" y="580" font-family="serif" font-size="28" font-weight="bold" fill="%23F59E0B" text-anchor="middle">DR. A. P. J. ABDUL KALAM</text>
        <text x="300" y="620" font-family="sans-serif" font-size="18" fill="%2394A3B8" text-anchor="middle">1931 – 2015</text>
        <text x="300" y="660" font-family="sans-serif" font-size="15" fill="%2364748B" text-anchor="middle">The Missile Man &amp; People's President</text>
      </svg>`;
    });
  }
});


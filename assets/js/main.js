/**
* Template Name: SnapFolio
* Template URL: https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/
* Updated: Jul 21 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Theme toggle (light / dark)
   */
  const THEME_KEY = 'portfolio-theme';

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function currentTheme() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function applyToggleUi(theme) {
      const icon = btn.querySelector('i');
      if (theme === 'dark') {
        btn.setAttribute('aria-label', 'Switch to light theme');
        btn.setAttribute('title', 'Light mode');
        if (icon) icon.className = 'bi bi-sun-fill';
      } else {
        btn.setAttribute('aria-label', 'Switch to dark theme');
        btn.setAttribute('title', 'Dark mode');
        if (icon) icon.className = 'bi bi-moon-stars-fill';
      }
    }

    applyToggleUi(currentTheme());

    btn.addEventListener('click', function() {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) { /* ignore */ }
      applyToggleUi(next);
    });
  }

  initThemeToggle();

  /**
   * GitHub asset images — blob URLs cannot be used in <img>; normalize to raw + local fallback
   */
  const GITHUB_ASSETS_RAW = 'https://raw.githubusercontent.com/Naol724/portfolio-assets/main/';
  const GITHUB_ASSET_LOCAL_FALLBACK = {
    'naol-2.png': 'assets/img/profile/naol-2.png',
    'naol-3.png': 'assets/img/profile/naol-3.png',
    'Amazon.png': 'assets/img/portfolio/AmazonClone.png',
    'Neflix.png': 'assets/img/portfolio/Neflix.png',
    'Debugsense.png': 'assets/img/portfolio/DebugSense.png',
    'Trest rewiew.png': 'assets/img/portfolio/TrustReview.png',
    'Yene beta.png': 'assets/img/portfolio/Nilehouse.png',
    'evan-forum.jpeg': 'assets/img/portfolio/evan-forum.jpeg',
    'Unihub.png': 'assets/img/portfolio/Unihub.png',
    'UnihubStudent.png': 'assets/img/portfolio/Unihub.png',
    'EvanCommunity.png': 'assets/img/portfolio/evan-forum.jpeg',
    'Weather app (2).png': 'assets/img/portfolio/WeatherApp.png',
    'Forecastly.png': 'assets/img/portfolio/Forecasty.png',
    'Resume Screen.png': 'assets/img/portfolio/ResumeScreen.png',
    'Nile school.png': 'assets/img/portfolio/NileSchool.png',
    'NileSchool.png': 'assets/img/portfolio/NileSchool.png',
    'Nile cafe.png': 'assets/img/portfolio/NileCafe.png',
    'Edulearn.png': 'assets/img/portfolio/EduLearn.png',
    'Syntax.png': 'assets/img/portfolio/Syntax.png',
    'Master30.png': 'assets/img/portfolio/Master30.png',
    'Flutter.png': 'assets/img/portfolio/Flutter.png'
  };

  function toGithubRawImageUrl(src) {
    if (!src) return src;
    return src.replace(
      /^https?:\/\/github\.com\/Naol724\/portfolio-assets\/blob\/main\//i,
      GITHUB_ASSETS_RAW
    );
  }

  function attachGithubImageFallback(img) {
    img.addEventListener('error', function handleGithubAssetImageError() {
      const fileName = decodeURIComponent((img.src.split('/').pop() || '').split('?')[0]);
      const fallback = GITHUB_ASSET_LOCAL_FALLBACK[fileName];
      if (fallback && img.src.indexOf(fallback) === -1) {
        img.src = fallback;
        return;
      }
      img.removeEventListener('error', handleGithubAssetImageError);
    });
  }

  function loadGithubImage(img) {
    const dataSrc = img.getAttribute('data-src');
    const original = dataSrc || img.getAttribute('src') || '';
    if (!original) return;

    const normalized = toGithubRawImageUrl(original);
    if (dataSrc) img.removeAttribute('data-src');
    if (img.getAttribute('src') === normalized) return;

    attachGithubImageFallback(img);
    img.decoding = 'async';
    img.src = normalized;

    img.addEventListener('load', function refreshPortfolioLayout() {
      const container = document.querySelector('.portfolio-container.isotope-container');
      if (!container || typeof Isotope === 'undefined') return;
      const iso = Isotope.data(container);
      if (iso) iso.layout();
    }, { once: true });
  }

  function initGithubAssetImages() {
    document.querySelectorAll('img[src*="Naol724/portfolio-assets"]').forEach(function(img) {
      loadGithubImage(img);
    });

    const deferredImages = document.querySelectorAll('img[data-src*="Naol724/portfolio-assets"]');

    // Visible portfolio cards load immediately (hidden "See More" items wait)
    deferredImages.forEach(function(img) {
      if (!img.closest('.portfolio-item-more')) {
        loadGithubImage(img);
      }
    });

    const lazyImages = document.querySelectorAll('img[data-src*="Naol724/portfolio-assets"]');
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          loadGithubImage(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '280px 0px', threshold: 0.01 });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      lazyImages.forEach(loadGithubImage);
    }
  }

  window.loadPortfolioImage = loadGithubImage;
  initGithubAssetImages();

  /**
   * Portfolio — combine category filters with "See More" visibility
   */
  function portfolioItemFilter(categoryFilter) {
    return function() {
      const portfolio = document.querySelector('#portfolio');
      if (portfolio && !portfolio.classList.contains('portfolio-expanded') && this.classList.contains('portfolio-item-more')) {
        return false;
      }
      if (!categoryFilter || categoryFilter === '*') {
        return true;
      }
      if (categoryFilter.charAt(0) === '.') {
        return this.classList.contains(categoryFilter.slice(1));
      }
      return true;
    };
  }

  function applyPortfolioVisibility(categoryFilter) {
    const portfolio = document.querySelector('#portfolio');
    const items = document.querySelectorAll('.portfolio-container .portfolio-item.isotope-item');
    if (!portfolio || !items.length) return;

    const filterClass = categoryFilter && categoryFilter.charAt(0) === '.'
      ? categoryFilter.slice(1)
      : '';
    const expanded = portfolio.classList.contains('portfolio-expanded');

    items.forEach(function(item) {
      const matchesCategory = !filterClass || item.classList.contains(filterClass);
      const hiddenBySeeMore = !expanded && item.classList.contains('portfolio-item-more');
      const shouldShow = matchesCategory && !hiddenBySeeMore;
      item.classList.toggle('is-filter-hidden', !shouldShow);
      item.style.display = shouldShow ? '' : 'none';
    });
  }

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    if (headerToggleBtn) {
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    }
  }
  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', headerToggle);
    headerToggleBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        headerToggle();
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader — don't wait for every remote image (portfolio PNGs are large)
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    let preloaderDone = false;

    function dismissPreloader() {
      if (preloaderDone) return;
      preloaderDone = true;
      preloader.classList.add('preloader-done');
      window.setTimeout(function() {
        preloader.remove();
      }, 350);
    }

    window.setTimeout(dismissPreloader, 900);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', dismissPreloader, { once: true });
    } else {
      dismissPreloader();
    }
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('DOMContentLoaded', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 90,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aosInit, { once: true });
  } else {
    aosInit();
  }

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && typeof Typed !== 'undefined') {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter (only if counter elements exist)
   */
  if (typeof PureCounter !== 'undefined' && document.querySelector('.purecounter')) {
    new PureCounter();
  }

  /**
   * Initiate glightbox (only when used on the page)
   */
  if (typeof GLightbox !== 'undefined' && document.querySelector('.glightbox')) {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Portfolio filters — always work (independent of Isotope)
   */
  function refreshPortfolioLayout() {
    const isotopeContainer = document.querySelector('.portfolio-container.isotope-container');
    if (!isotopeContainer) return;
    const categoryFilter = isotopeContainer.dataset.activeFilter || '*';
    applyPortfolioVisibility(categoryFilter);

    if (typeof Isotope === 'undefined') return;
    const iso = Isotope.data(isotopeContainer);
    if (!iso) return;
    try {
      iso.options.layoutMode = 'fitRows';
      iso.arrange({ filter: portfolioItemFilter(categoryFilter) });
      iso.layout();
    } catch (err) {
      console.warn('Portfolio layout refresh skipped:', err);
    }
    if (typeof AOS !== 'undefined') AOS.refresh();
  }

  function initPortfolioFilters() {
    const portfolioSection = document.querySelector('#portfolio');
    const isotopeLayout = document.querySelector('#portfolio .isotope-layout');
    const isotopeContainer = document.querySelector('.portfolio-container.isotope-container');
    const filterButtons = document.querySelectorAll('#portfolio .portfolio-filters li');
    if (!portfolioSection || !isotopeContainer || !filterButtons.length) return;

    const defaultFilter = (isotopeLayout && isotopeLayout.getAttribute('data-default-filter')) || '*';
    isotopeContainer.dataset.activeFilter = defaultFilter;
    applyPortfolioVisibility(defaultFilter);

    filterButtons.forEach(function(btn) {
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');

      function activateFilter() {
        filterButtons.forEach(function(el) { el.classList.remove('filter-active'); });
        btn.classList.add('filter-active');

        const nextFilter = btn.getAttribute('data-filter') || '*';
        isotopeContainer.dataset.activeFilter = nextFilter;

        const seeMoreBtn = document.querySelector('#portfolio-see-more');
        if (nextFilter !== '*' && !portfolioSection.classList.contains('portfolio-expanded')) {
          portfolioSection.classList.add('portfolio-expanded');
          if (seeMoreBtn) {
            seeMoreBtn.setAttribute('aria-expanded', 'true');
            seeMoreBtn.textContent = 'Show Less';
          }
        }

        refreshPortfolioLayout();
      }

      btn.addEventListener('click', function(event) {
        event.preventDefault();
        activateFilter();
      });

      btn.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activateFilter();
        }
      });
    });
  }

  initPortfolioFilters();

  /**
   * Init isotope layout (optional helper for desktop grid)
   */
  if (typeof Isotope !== 'undefined') {
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
      const isotopeContainer = isotopeItem.querySelector('.isotope-container');
      if (!isotopeContainer) return;

      const isPortfolioGrid = isotopeContainer.classList.contains('portfolio-container');

      function pickLayoutMode() {
        if (isPortfolioGrid) return 'fitRows';
        return window.matchMedia('(max-width: 991.98px)').matches ? 'fitRows' : layout;
      }

      let initIsotope;
      try {
        initIsotope = new Isotope(isotopeContainer, {
          itemSelector: '.isotope-item',
          layoutMode: pickLayoutMode(),
          filter: isPortfolioGrid ? portfolioItemFilter(filter) : filter,
          sortBy: sort,
          transitionDuration: '0.45s'
        });
      } catch (err) {
        console.warn('Isotope init skipped:', err);
        return;
      }

      isotopeContainer.querySelectorAll('img').forEach(function(img) {
        if (img.complete) return;
        img.addEventListener('load', function() {
          if (initIsotope) initIsotope.layout();
        });
      });

      window.addEventListener('resize', function() {
        if (!initIsotope) return;
        initIsotope.options.layoutMode = pickLayoutMode();
        refreshPortfolioLayout();
      });
    });
  }

  /**
   * Portfolio — show 10 projects, reveal the rest on "See More"
   */
  function initPortfolioSeeMore() {
    const portfolioSection = document.querySelector('#portfolio');
    const seeMoreBtn = document.querySelector('#portfolio-see-more');
    const isotopeContainer = document.querySelector('.portfolio-container.isotope-container');
    if (!portfolioSection || !seeMoreBtn || !isotopeContainer) return;

    let seeMoreTouchLock = false;

    function refreshIsotopeLayout() {
      refreshPortfolioLayout();
    }

    function togglePortfolioExpanded() {
      const isExpanded = portfolioSection.classList.toggle('portfolio-expanded');
      seeMoreBtn.setAttribute('aria-expanded', String(isExpanded));
      seeMoreBtn.textContent = isExpanded ? 'Show Less' : 'See More Projects';

      if (isExpanded) {
        portfolioSection.querySelectorAll('.portfolio-item-more img').forEach(function(img) {
          if (img.complete) return;
          img.addEventListener('load', refreshIsotopeLayout, { once: true });
        });
      }

      window.requestAnimationFrame(refreshIsotopeLayout);
      window.setTimeout(refreshIsotopeLayout, 120);
      window.setTimeout(refreshIsotopeLayout, 450);
    }

    function handleSeeMore(event) {
      event.preventDefault();
      if (event.type === 'touchend') {
        if (seeMoreTouchLock) return;
        seeMoreTouchLock = true;
        window.setTimeout(function() { seeMoreTouchLock = false; }, 500);
        togglePortfolioExpanded();
        return;
      }
      if (seeMoreTouchLock) return;
      togglePortfolioExpanded();
    }

    seeMoreBtn.addEventListener('click', handleSeeMore);
    seeMoreBtn.addEventListener('touchend', handleSeeMore, { passive: false });
  }

  initPortfolioSeeMore();

  /**
   * Portfolio — tap to reveal overlay on touch / mobile (hover on desktop)
   */
  function initPortfolioCardActions() {
    const wraps = document.querySelectorAll('.portfolio-wrap');
    if (!wraps.length) return;

    let activeWrap = null;

    function useTapReveal() {
      return window.matchMedia('(max-width: 991.98px), (hover: none), (pointer: coarse)').matches;
    }

    function closeActiveWrap() {
      if (activeWrap) {
        activeWrap.classList.remove('portfolio-wrap--active');
        activeWrap = null;
      }
    }

    wraps.forEach(function(wrap) {
      function handleCardTap(e) {
        if (!useTapReveal()) return;
        if (e.target.closest('.portfolio-actions a, .portfolio-about-btn')) return;

        if (wrap.classList.contains('portfolio-wrap--active')) {
          closeActiveWrap();
          return;
        }

        closeActiveWrap();
        wrap.classList.add('portfolio-wrap--active');
        activeWrap = wrap;
      }

      wrap.addEventListener('click', handleCardTap);
      wrap.addEventListener('touchend', function(e) {
        if (!useTapReveal()) return;
        if (e.target.closest('.portfolio-actions a, .portfolio-about-btn')) return;
        e.preventDefault();
        handleCardTap(e);
      }, { passive: false });
    });

    document.addEventListener('click', function(e) {
      if (!useTapReveal()) return;
      if (!e.target.closest('.portfolio-wrap')) closeActiveWrap();
    });
  }

  initPortfolioCardActions();

  /**
   * Portfolio — convert Tech Stack text into technology icons
   */
  const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
  const PORTFOLIO_TECH_ICONS = {
    'react': 'react/react-original.svg',
    'react 19': 'react/react-original.svg',
    'reactjs': 'react/react-original.svg',
    'vite': 'vite/vite-original.svg',
    'firebase': 'firebase/firebase-plain.svg',
    'stripe': 'stripe/stripe-original.svg',
    'material ui': 'materialui/materialui-original.svg',
    'javascript es6+': 'javascript/javascript-original.svg',
    'javascript': 'javascript/javascript-original.svg',
    'css modules': 'css3/css3-original.svg',
    'css3': 'css3/css3-original.svg',
    'html5': 'html5/html5-original.svg',
    'tailwind css': 'tailwindcss/tailwindcss-original.svg',
    'node.js': 'nodejs/nodejs-original.svg',
    'nodejs': 'nodejs/nodejs-original.svg',
    'express': 'express/express-original.svg',
    'express.js': 'express/express-original.svg',
    'mongodb': 'mongodb/mongodb-original.svg',
    'mongodb atlas': 'mongodb/mongodb-original.svg',
    'mongoose': 'mongodb/mongodb-original.svg',
    'typescript': 'typescript/typescript-original.svg',
    'python': 'python/python-original.svg',
    'flask': 'flask/flask-original.svg',
    'fastapi': 'fastapi/fastapi-original.svg',
    'next.js': 'nextjs/nextjs-original.svg',
    'nextjs': 'nextjs/nextjs-original.svg',
    'postgresql': 'postgresql/postgresql-original.svg',
    'mysql': 'mysql/mysql-original.svg',
    'prisma orm': 'prisma/prisma-original.svg',
    'prisma': 'prisma/prisma-original.svg',
    'redux toolkit': 'redux/redux-original.svg',
    'redux': 'redux/redux-original.svg',
    'socket.io': 'socketio/socketio-original.svg',
    'socket communication': 'socketio/socketio-original.svg',
    'google oauth': 'google/google-original.svg',
    'google': 'google/google-original.svg',
    'youtube api': 'youtube/youtube-original.svg',
    'pandas': 'python/python-original.svg',
    'numpy': 'python/python-original.svg',
    'scikit-learn': 'python/python-original.svg',
    'spacy': 'python/python-original.svg',
    'nltk': 'python/python-original.svg',
    'tf-idf': 'python/python-original.svg'
  };
  const PORTFOLIO_TECH_INVERT = ['express/', 'vercel/'];

  function normalizePortfolioTech(name) {
    return name.toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .replace(/\.js\b/g, 'js')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getPortfolioTechIcon(name) {
    const key = normalizePortfolioTech(name);
    if (PORTFOLIO_TECH_ICONS[key]) return PORTFOLIO_TECH_ICONS[key];
    if (key.includes('react')) return PORTFOLIO_TECH_ICONS.react;
    if (key.includes('node')) return PORTFOLIO_TECH_ICONS['node.js'];
    if (key.includes('express')) return PORTFOLIO_TECH_ICONS.express;
    if (key.includes('mongo')) return PORTFOLIO_TECH_ICONS.mongodb;
    if (key.includes('tailwind')) return PORTFOLIO_TECH_ICONS['tailwind css'];
    if (key.includes('typescript')) return PORTFOLIO_TECH_ICONS.typescript;
    if (key.includes('python') || key.includes('scikit') || key.includes('pandas') || key.includes('numpy')) {
      return PORTFOLIO_TECH_ICONS.python;
    }
    if (key.includes('next')) return PORTFOLIO_TECH_ICONS['next.js'];
    if (key.includes('youtube')) return PORTFOLIO_TECH_ICONS['youtube api'];
    if (key.includes('google') || key.includes('gemini')) return PORTFOLIO_TECH_ICONS.google;
    return null;
  }

  function getPortfolioTechBadge(name) {
    const cleaned = name.replace(/\([^)]*\)/g, '').trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
    if (cleaned.toLowerCase().includes('jwt')) return 'JWT';
    if (cleaned.toLowerCase().includes('api')) return 'API';
    return words.map(function(word) { return word[0]; }).join('').slice(0, 4).toUpperCase();
  }

  function buildPortfolioTechStack(items) {
    const stack = document.createElement('ul');
    stack.className = 'portfolio-tech-stack';
    stack.setAttribute('role', 'list');
    const seenIcons = new Map();
    const seenBadges = new Map();

    items.forEach(function(name) {
      const iconPath = getPortfolioTechIcon(name);

      if (iconPath) {
        if (seenIcons.has(iconPath)) {
          const existing = seenIcons.get(iconPath);
          existing.title = existing.title + ', ' + name;
          return;
        }

        const li = document.createElement('li');
        li.className = 'portfolio-tech-item';
        li.title = name;
        const img = document.createElement('img');
        img.src = DEVICON_BASE + iconPath;
        img.alt = name;
        img.loading = 'lazy';
        img.width = 26;
        img.height = 26;
        if (PORTFOLIO_TECH_INVERT.some(function(part) { return iconPath.includes(part); })) {
          li.classList.add('portfolio-tech-item--invert');
        }
        li.appendChild(img);
        seenIcons.set(iconPath, li);
        stack.appendChild(li);
        return;
      }

      const badge = getPortfolioTechBadge(name);
      if (seenBadges.has(badge)) {
        const existing = seenBadges.get(badge);
        existing.title = existing.title + ', ' + name;
        return;
      }

      const li = document.createElement('li');
      li.className = 'portfolio-tech-item portfolio-tech-item--badge';
      li.title = name;
      const label = document.createElement('span');
      label.textContent = badge;
      li.appendChild(label);
      seenBadges.set(badge, li);
      stack.appendChild(li);
    });

    return stack;
  }

  function renderPortfolioTechStack(section) {
    if (!section || section.dataset.techReady === 'true') return;

    const heading = section.querySelector('h5');
    const textEl = section.querySelector(':scope > p');
    if (!heading || !textEl || heading.textContent.trim() !== 'Tech Stack') return;
    if (section.querySelector('.portfolio-tech-stack')) {
      section.dataset.techReady = 'true';
      return;
    }

    const items = textEl.textContent.split(',').map(function(item) {
      return item.trim();
    }).filter(Boolean);

    if (!items.length) return;
    textEl.replaceWith(buildPortfolioTechStack(items));
    section.dataset.techReady = 'true';
  }

  function initPortfolioTechStacks(root) {
    (root || document).querySelectorAll('.portfolio-about-details .portfolio-about-section').forEach(renderPortfolioTechStack);
  }

  initPortfolioTechStacks();

  /**
   * Portfolio — Detail button opens project details modal
   */
  function initPortfolioAboutModal() {
    const modalEl = document.getElementById('portfolioAboutModal');
    const portfolioSection = document.getElementById('portfolio');
    if (!modalEl || !portfolioSection || typeof bootstrap === 'undefined') return;

    const titleEl = modalEl.querySelector('.portfolio-about-modal-title');
    const imageEl = modalEl.querySelector('.portfolio-about-modal-image');
    const contentEl = modalEl.querySelector('.portfolio-about-modal-content');
    const githubEl = modalEl.querySelector('.portfolio-about-modal-github');
    const demoEl = modalEl.querySelector('.portfolio-about-modal-demo');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    let detailTouchLock = false;

    function findGithubLink(wrap) {
      const icon = wrap.querySelector('.portfolio-actions a .bi-github');
      return icon ? icon.closest('a') : null;
    }

    function findDemoLink(wrap) {
      const icon = wrap.querySelector('.portfolio-actions a .bi-box-arrow-up-right');
      return icon ? icon.closest('a') : null;
    }

    function openPortfolioModal(wrap) {
      if (!wrap) return;

      const img = wrap.querySelector('img');
      const category = wrap.querySelector('.category');
      const desc = wrap.querySelector('.portfolio-info h4');
      const details = wrap.querySelector('.portfolio-about-details');
      const githubLink = findGithubLink(wrap);
      const demoLink = findDemoLink(wrap);

      if (titleEl && category) titleEl.textContent = category.textContent.trim();
      if (imageEl && img) {
        if (typeof window.loadPortfolioImage === 'function' && img.getAttribute('data-src')) {
          window.loadPortfolioImage(img);
        }
        imageEl.src = img.getAttribute('src') || img.getAttribute('data-src') || '';
        imageEl.alt = img.getAttribute('alt') || '';
      }

      if (contentEl) {
        if (details) {
          contentEl.innerHTML = details.innerHTML;
          initPortfolioTechStacks(contentEl);
        } else if (desc) {
          contentEl.innerHTML = '<p class="portfolio-about-overview">' + desc.textContent.trim() + '</p>';
        } else {
          contentEl.innerHTML = '';
        }
      }

      if (githubEl && githubLink) {
        githubEl.href = githubLink.href;
        githubEl.classList.remove('d-none');
      } else if (githubEl) {
        githubEl.classList.add('d-none');
      }

      if (demoEl && demoLink) {
        demoEl.href = demoLink.href;
        demoEl.classList.remove('d-none');
      } else if (demoEl) {
        demoEl.classList.add('d-none');
      }

      modal.show();
    }

    function handleDetailTrigger(event) {
      const btn = event.target.closest('.portfolio-about-btn');
      if (!btn || !portfolioSection.contains(btn)) return;

      event.preventDefault();
      event.stopPropagation();

      if (event.type === 'touchend') {
        event.preventDefault();
        if (detailTouchLock) return;
        detailTouchLock = true;
        window.setTimeout(function() { detailTouchLock = false; }, 450);
        openPortfolioModal(btn.closest('.portfolio-wrap'));
        return;
      }
      if (detailTouchLock) return;

      openPortfolioModal(btn.closest('.portfolio-wrap'));
    }

    portfolioSection.addEventListener('click', handleDetailTrigger);
    portfolioSection.addEventListener('touchend', handleDetailTrigger, { passive: false });
  }

  initPortfolioAboutModal();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  if (document.querySelector('.init-swiper')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSwiper, { once: true });
    } else {
      initSwiper();
    }
  }

  /**
   * In-page anchor links — smooth scroll (fixed header / layout safe)
   */
  function initInPageAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      link.addEventListener('click', function(event) {
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop, 10) || 0;
        window.scrollTo({
          top: Math.max(0, target.offsetTop - scrollMarginTop - 12),
          behavior: 'smooth'
        });

        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', href);
        }
      });
    });
  }

  initInPageAnchorScroll();

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Footer year
   */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /**
   * Professional scroll & entrance animations
   */
  function initProfessionalAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function markPageLoaded() {
      document.body.classList.add('page-loaded');
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', markPageLoaded, { once: true });
    } else {
      markPageLoaded();
    }

    document.querySelectorAll('.portfolio-item').forEach(function(item, i) {
      item.setAttribute('data-aos', 'fade-up');
      item.setAttribute('data-aos-duration', '650');
      item.setAttribute('data-aos-delay', String(Math.min(60 + i * 70, 480)));
    });

    document.querySelectorAll('.skills-stack-panel').forEach(function(panel, i) {
      panel.setAttribute('data-aos', 'zoom-in');
      panel.setAttribute('data-aos-duration', '600');
      panel.setAttribute('data-aos-delay', String(80 + i * 90));
    });

    document.querySelectorAll('#contact .info-box, #contact .contact-form').forEach(function(el, i) {
      el.setAttribute('data-aos', i === 0 ? 'fade-right' : 'fade-left');
      el.setAttribute('data-aos-duration', '700');
      el.setAttribute('data-aos-delay', String(100 + i * 120));
    });

    document.querySelectorAll('.about .profile-card, .about .about-content, .resume .resume-item').forEach(function(el) {
      el.classList.add('reveal-on-scroll');
    });

    document.querySelectorAll('.contact .info-item').forEach(function(el, i) {
      el.classList.add('reveal-on-scroll');
      el.style.setProperty('--reveal-delay', (i * 0.12) + 's');
    });

    document.querySelectorAll('.skill-icon-cell').forEach(function(cell, i) {
      cell.style.setProperty('--icon-delay', (i * 0.04) + 's');
    });

    if (!prefersReducedMotion) {
      const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

      document.querySelectorAll('.reveal-on-scroll').forEach(function(el) {
        revealObserver.observe(el);
      });

      const heroStat = document.querySelector('.hero-stat:first-child .hero-stat-value');
      if (heroStat && heroStat.textContent.trim().startsWith('16')) {
        const counterObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            let start = 0;
            const end = 16;
            const duration = 1200;
            const startTime = performance.now();
            function tick(now) {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const value = Math.round(start + (end - start) * eased);
              heroStat.textContent = value + '+';
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            counterObserver.unobserve(entry.target);
          });
        }, { threshold: 0.5 });
        counterObserver.observe(heroStat.closest('.hero-stat') || heroStat);
      }
    } else {
      document.querySelectorAll('.reveal-on-scroll').forEach(function(el) {
        el.classList.add('is-revealed');
      });
    }

    document.querySelectorAll('.portfolio-filters li').forEach(function(filterBtn) {
      filterBtn.addEventListener('click', function() {
        document.querySelectorAll('.portfolio-item .portfolio-wrap').forEach(function(wrap) {
          wrap.classList.remove('filter-pop');
          void wrap.offsetWidth;
          wrap.classList.add('filter-pop');
        });
      });
    });
  }

  initProfessionalAnimations();

})();
document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // PAGE LOADER
    // HTML'de <body> içinde en üste ekle:
    // <div class="page-loader" id="page-loader">
    //   <svg class="loader-flame" viewBox="0 0 40 60">...</svg>
    //   <div class="loader-logo">RİMALUMİERE</div>
    // </div>
    // ============================================================
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Minimum 1.8s göster, sayfa hazır olunca çık
        const minDisplay = new Promise(res => setTimeout(res, 1800));
        const pageReady  = new Promise(res => {
            if (document.readyState === 'complete') res();
            else window.addEventListener('load', res);
        });

        Promise.all([minDisplay, pageReady]).then(() => {
            loader.classList.add('exiting');
            setTimeout(() => loader.classList.add('hidden'), 700);
        });
    }

    // ============================================================
    // FLAME CURSOR
    // HTML'de .cursor div'ini kaldır, JS enjekte eder.
    // ============================================================
    const flameSVG = `
    <svg viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg">
      <g class="flame-outer">
        <path d="M14 38 C4 38 2 28 6 20 C8 15 10 10 14 2
                 C18 10 20 15 22 20 C26 28 24 38 14 38Z"
              fill="white" opacity="0.9"/>
      </g>
      <g class="flame-inner">
        <path d="M14 34 C9 34 8 27 10 22 C11 18 12 14 14 10
                 C16 14 17 18 18 22 C20 27 19 34 14 34Z"
              fill="black" opacity="0.25"/>
      </g>
    </svg>`;

    const flameEl = document.createElement('div');
    flameEl.className = 'cursor-flame';
    flameEl.innerHTML = flameSVG;
    document.body.appendChild(flameEl);

    const wickEl = document.createElement('div');
    wickEl.className = 'cursor-wick';
    document.body.appendChild(wickEl);

    let mouseX = -200, mouseY = -200;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        flameEl.style.left = mouseX + 'px';
        flameEl.style.top  = mouseY + 'px';
        wickEl.style.left  = mouseX + 'px';
        wickEl.style.top   = mouseY + 'px';
    });

    // Hover büyütme — gallery items ve butonlarda
    document.querySelectorAll('.hover-target, .item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            flameEl.style.transform = 'translate(-50%, -110%) scale(1.4)';
        });
        el.addEventListener('mouseleave', () => {
            flameEl.style.transform = 'translate(-50%, -110%) scale(1)';
        });
    });

    // JS yüklendi, cursor aktif
    document.body.classList.add('custom-cursor-ready');

    // ============================================================
    // PARALLAX HERO
    // HTML'de .hero içine <div class="hero-bg"></div> ekle
    // ============================================================
    const heroBg      = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    const parallaxHandler = () => {
        const scrollY = window.scrollY;
        if (heroBg)      heroBg.style.transform      = `translateY(${scrollY * 0.3}px)`;
        if (heroContent) heroContent.style.transform  = `translateY(${scrollY * 0.15}px)`;
    };

    // ============================================================
    // SCROLL REVEAL — IntersectionObserver (performanslı)
    // ============================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ============================================================
    // SCROLL — requestAnimationFrame throttle
    // ============================================================
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                parallaxHandler();
                ticking = false;
            });
            ticking = true;
        }
    });


    // ============================================================
    // GALLERY ITEMS
    // ============================================================
    const galleryItems = document.querySelectorAll('.item');

    // ============================================================
    // CANDLE MODAL
    // Her .item'a data-desc="..." ekle HTML'de (opsiyonel açıklama)
    // HTML'ye ekle:
    // <div class="modal-overlay" id="candle-modal">
    //   <div class="modal">
    //     <button class="modal-close" aria-label="Kapat">✕</button>
    //     <div class="modal-candle">
    //       <svg viewBox="0 0 60 90">...</svg>
    //     </div>
    //     <h2 class="modal-title" id="modal-title"></h2>
    //     <p class="modal-desc" id="modal-desc"></p>
    //   </div>
    // </div>
    // ============================================================
    const modalOverlay = document.getElementById('candle-modal');
    const modalTitle   = document.getElementById('modal-title');
    const modalDesc    = document.getElementById('modal-desc');
    const modalClose   = document.querySelector('.modal-close');

    const candleSVG = `
    <svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
      <!-- Candle body -->
      <rect x="18" y="40" width="24" height="45" rx="2" fill="white" opacity="0.9"/>
      <!-- Wick -->
      <line x1="30" y1="40" x2="30" y2="28" stroke="white" stroke-width="1.5" opacity="0.6"/>
      <!-- Flame outer -->
      <g class="modal-flame-outer">
        <path d="M30 28 C22 28 18 20 22 13 C24 9 27 5 30 0
                 C33 5 36 9 38 13 C42 20 38 28 30 28Z"
              fill="white" opacity="0.95"/>
      </g>
      <!-- Flame inner -->
      <g class="modal-flame-inner">
        <path d="M30 26 C25 26 23 20 25 15 C26 12 28 9 30 5
                 C32 9 34 12 35 15 C37 20 35 26 30 26Z"
              fill="black" opacity="0.2"/>
      </g>
    </svg>`;

    if (modalOverlay) {
        const modalCandleEl = modalOverlay.querySelector('.modal-candle');
        if (modalCandleEl) modalCandleEl.innerHTML = candleSVG;

        const openModal = (title, desc) => {
            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc)  modalDesc.textContent  = desc || '';
            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const titleEl = item.querySelector('.item-info h3');
                const descEl  = item.querySelector('.item-info p');
                const title   = titleEl ? titleEl.textContent : '';
                const desc    = item.getAttribute('data-desc') || (descEl ? descEl.textContent : '');
                openModal(title, desc);
            });
        });

        modalClose?.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ============================================================
    // TRANSLATIONS
    // ============================================================
    const translations = {
        tr: {
            page_title:    "RİMALUMİERE",
            nav_gallery:   "Mumlarımız",
            nav_about:     "Hakkımızda",
            theme_light:   "Aydınlık Mod",
            theme_dark:    "Karanlık Mod",
            hero_desc:     "R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE mumları, tamamen doğal ve organik soya wax ile yapılmış mumlardır. Aşağıdaki görsellerde olduğu gibi R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE ışığınız olsun.",
            gallery_title: "Mumlarımız",
            item1_title:   "Çikolatalı Mum",
            item2_title:   "Gül Kokulu Mum",
            item3_title:   "Gül Kokulu Mum",
            item4_title:   "Vişneli Mum",
            item5_title:   "Çikolatalı Mum",
            item6_title:   "Yaseminli Mum",
            item7_title:   "Botanik Mum",
            item8_title:   "Botanik Mum",
            item9_title:   "Gül Kokulu Mum",
            item10_title:  "Gül Kokulu Mum",
            about_title:   "Mağazamız<br>Hakkında",
            about_desc:    "R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE, 26 Aralık 2025'te kurulmuş olup, doğaya saygılı ve sağlıklı bir anlayışla el yapımı mumlar üretir. %100 organik soya wax kullanılan bu mumlar, zararlı kimyasallar içermez ve temiz bir yanış sağlar. Kişiye özel tasarım seçenekleriyle hem size özel hem de anlamlı hediyeler sunar. Doğal kokuları ve şık görünümleriyle yaşam alanlarınıza huzur ve estetik katar.",
            contact_title: "İletişim",
            social_title:  "Sosyal",
            footer_text:   "@R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE"
        },
        en: {
            page_title:    "RİMALUMİERE",
            nav_gallery:   "Our Candles",
            nav_about:     "About Us",
            theme_light:   "Light Mode",
            theme_dark:    "Dark Mode",
            hero_desc:     "R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE candles are made with completely natural and organic soy wax. Just like the visuals below. Let R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE be your light.",
            gallery_title: "Our Candles",
            item1_title:   "Chocolate Candle",
            item2_title:   "Rose Scented Candle",
            item3_title:   "Rose Scented Candle",
            item4_title:   "Cherry Candle",
            item5_title:   "Chocolate Candle",
            item6_title:   "Jasmine Candle",
            item7_title:   "Botanical Candle",
            item8_title:   "Botanical Candle",
            item9_title:   "Rose Scented Candle",
            item10_title:  "Rose Scented Candle",
            about_title:   "About<br>Our Store",
            about_desc:    "R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE, founded on December 26, 2025, produces handmade candles with an eco-friendly and healthy approach. Made with 100% organic soy wax, these candles contain no harmful chemicals and provide a clean burn. With custom design options, we offer personalized and meaningful gifts. Their natural scents and elegant appearance bring peace and aesthetics to your living spaces.",
            contact_title: "Contact",
            social_title:  "Social",
            footer_text:   "@R<span class=\"heart-i\">I</span>MALUM<span class=\"heart-i\">I</span>ERE"
        }
    };

    // Dil ve tema — tüm fonksiyonlardan önce tanımlanıyor
    let currentLang  = localStorage.getItem('siteLang')  || 'tr';
    let currentTheme = localStorage.getItem('siteTheme') || 'dark';

    const langToggleBtn  = document.getElementById('lang-toggle');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement    = document.documentElement;

    // ============================================================
    // THEME
    // ============================================================
    function updateThemeButtonText() {
        if (!themeToggleBtn) return;
        const isDark = currentTheme === 'dark';
        
        // Custom designed minimalist SVGs to match design philosophy
        const sunSVG = `
        <svg class="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
        
        const moonSVG = `
        <svg class="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
        
        themeToggleBtn.innerHTML = isDark ? sunSVG : moonSVG;
        
        const key = isDark ? 'theme_light' : 'theme_dark';
        const accessibilityText = translations[currentLang]?.[key] || (isDark ? 'Light Mode' : 'Dark Mode');
        themeToggleBtn.setAttribute('aria-label', accessibilityText);
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
        updateThemeButtonText();
    }

    themeToggleBtn?.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('siteTheme', currentTheme);
        applyTheme(currentTheme);
    });

    // ============================================================
    // LANGUAGE
    // ============================================================
    function updateLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang]?.[key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });
        htmlElement.lang = currentLang;
        if (langToggleBtn) langToggleBtn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
        updateThemeButtonText(); // Tema buton metnini dil değişince de güncelle
    }

    langToggleBtn?.addEventListener('click', () => {
        currentLang = currentLang === 'tr' ? 'en' : 'tr';
        localStorage.setItem('siteLang', currentLang);
        updateLanguage();
    });

    // ============================================================
    // MOBILE NAV DRAWER (HAMBURGER)
    // ============================================================
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const navLinksMenu = document.getElementById('nav-links');
    const navOverlay   = document.getElementById('nav-overlay');

    if (hamburgerBtn && navLinksMenu && navOverlay) {
        const toggleMenu = () => {
            const isOpen = navLinksMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('open');
            navOverlay.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
            
            // Prevent scrolling on body when mobile menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        const closeMenu = () => {
            navLinksMenu.classList.remove('open');
            hamburgerBtn.classList.remove('open');
            navOverlay.classList.remove('open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        hamburgerBtn.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', closeMenu);

        // Close menu when clicking on nav links
        const navLinks = navLinksMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ============================================================
    // INITIALIZE
    // ============================================================
    applyTheme(currentTheme);
    updateLanguage();
    parallaxHandler(); // İlk yüklemede parallax uygula
});

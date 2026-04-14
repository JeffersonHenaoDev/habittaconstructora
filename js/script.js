/* ============================================================
   HABITTA CO. - JavaScript Principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------
       HEADER: scroll effect
    -------------------------------------------------------- */
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top
        const backTop = document.getElementById('back-to-top');
        if (backTop) {
            backTop.classList.toggle('visible', window.scrollY > 400);
        }

        // Active nav link
        updateActiveNav();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* --------------------------------------------------------
       MOBILE MENU
    -------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    // Crear overlay dinámicamente
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    const openMenu = () => {
        navMenu.classList.add('open');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Cerrar al hacer clic en enlace
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* --------------------------------------------------------
       SMOOTH SCROLL
    -------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            const headerHeight = header.offsetHeight;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });

    /* --------------------------------------------------------
       ACTIVE NAV LINK on scroll
    -------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + header.offsetHeight + 60;

        sections.forEach(section => {
            const top    = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* --------------------------------------------------------
       HERO SLIDER
    -------------------------------------------------------- */
    const slides     = document.querySelectorAll('.slide');
    const dots       = document.querySelectorAll('.dot');
    const prevBtn    = document.querySelector('.slide-prev');
    const nextBtn    = document.querySelector('.slide-next');
    let current      = 0;
    let autoInterval = null;

    const goTo = (index) => {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
    };

    const startAuto = () => {
        autoInterval = setInterval(() => goTo(current + 1), 5500);
    };

    const resetAuto = () => {
        clearInterval(autoInterval);
        startAuto();
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
            resetAuto();
        });
    });

    // Swipe en móvil
    let touchStartX = 0;
    const sliderEl = document.querySelector('.hero-slider');

    if (sliderEl) {
        sliderEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderEl.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                goTo(diff > 0 ? current + 1 : current - 1);
                resetAuto();
            }
        }, { passive: true });
    }

    startAuto();

    /* --------------------------------------------------------
       BACK TO TOP
    -------------------------------------------------------- */
    const backTop = document.getElementById('back-to-top');
    if (backTop) {
        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------------------------------------------
       CONTACT FORM
    -------------------------------------------------------- */
    const form    = document.getElementById('contact-form');
    const msgBox  = document.getElementById('form-message');
    const btnText = form ? form.querySelector('.btn-text') : null;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre  = form.querySelector('#nombre').value.trim();
            const email   = form.querySelector('#email').value.trim();

            if (!nombre || !email) {
                showMsg('Por favor completa los campos requeridos.', 'error');
                return;
            }

            // Simular envío
            const submitBtn = form.querySelector('[type="submit"]');
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Enviando...';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Enviar Datos';
                showMsg('¡Gracias! Un asesor de Habitta Co. se pondrá en contacto contigo pronto.', 'success');
            }, 1200);
        });
    }

    function showMsg(text, type) {
        if (!msgBox) return;
        msgBox.textContent = text;
        msgBox.className   = 'form-message ' + type;
        setTimeout(() => {
            msgBox.className = 'form-message';
        }, 6000);
    }

    /* --------------------------------------------------------
       INTERSECTION OBSERVER - fade in on scroll
    -------------------------------------------------------- */
    const fadeEls = document.querySelectorAll(
        '.service-card, .about-inner, .contact-inner, .stat-item, .about-badge'
    );

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease both';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        fadeEls.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

});

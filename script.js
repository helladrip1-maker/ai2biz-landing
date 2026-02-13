/* ============================================
   AI2BIZ Landing Page — JavaScript
   Scroll animations, slider, counters, menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Sticky Header ----
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- Mobile Menu ----
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Scroll Reveal Animations ----
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply stagger delay from CSS variable --i
                const i = getComputedStyle(entry.target).getPropertyValue('--i');
                if (i) {
                    entry.target.style.transitionDelay = `${parseInt(i) * 120}ms`;
                }
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Counter Animation ----
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const isFloat = target % 1 !== 0;
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = target * eased;

            if (isFloat) {
                el.textContent = prefix + current.toFixed(1) + suffix;
            } else {
                el.textContent = prefix + Math.round(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isFloat) {
                    el.textContent = prefix + target.toFixed(1) + suffix;
                } else {
                    el.textContent = prefix + target + suffix;
                }
            }
        }

        requestAnimationFrame(update);
    }

    // ---- Case Slider ----
    const track = document.getElementById('caseTrack');
    const prevBtn = document.getElementById('prevCase');
    const nextBtn = document.getElementById('nextCase');
    const dotsContainer = document.getElementById('caseDots');

    if (track) {
        const cards = track.querySelectorAll('.case-card');
        const total = cards.length;
        let current = 0;

        // Create dots
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }

        function goTo(index) {
            current = Math.max(0, Math.min(index, total - 1));
            track.style.transform = `translateX(-${current * 100}%)`;
            dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goTo(current + 1);
                else goTo(current - 1);
            }
        }, { passive: true });
    }

    // ---- Parallax on Hero floating cards ----
    const parallaxElements = document.querySelectorAll('.parallax-element');

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach((el, i) => {
                const speed = 0.03 + i * 0.02;
                el.style.transform = `translateY(${-scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Active nav link highlight ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72}px 0px -50% 0px`
    });

    sections.forEach(s => sectionObserver.observe(s));

});

/**
 * ==========================================
 * MAIN ENTRY POINT & APPLICATION BOOTSTRAP
 * ==========================================
 * Manages loading screen, custom cursor, audio state,
 * scene observers, and component instantiation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particle, Confetti, Fireworks Engines
    const particles = new ParticleEngine('bg-canvas');
    const confetti = new ConfettiEngine('celebration-canvas');
    const fireworks = new FireworksEngine('celebration-canvas');
    const audio = new AudioManager();

    window.particleEngine = particles;
    window.confettiEngine = confetti;
    window.fireworksEngine = fireworks;
    window.audioManager = audio;

    // 2. Loading Screen Simulation (0% - 100%)
    const loader = document.getElementById('loader');
    const progressFill = document.getElementById('loader-progress-fill');
    const progressText = document.getElementById('loader-progress-text');
    const startExperienceBtn = document.getElementById('loader-start-btn');
    const loaderStatus = document.getElementById('loader-status');

    let currentProgress = 0;
    const loadInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(loadInterval);

            if (progressFill) progressFill.style.width = '100%';
            if (progressText) progressText.textContent = '100%';
            if (loaderStatus) loaderStatus.textContent = 'READY.';

            setTimeout(() => {
                if (startExperienceBtn) {
                    startExperienceBtn.classList.add('visible');
                }
            }, 300);
        } else {
            if (progressFill) progressFill.style.width = currentProgress + '%';
            if (progressText) progressText.textContent = currentProgress.toString().padStart(2, '0') + '%';
        }
    }, 120);

    if (startExperienceBtn) {
        startExperienceBtn.addEventListener('click', () => {
            audio.playClick();
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 800);
            }
            // Initialize main experience controller
            window.experienceController = new ExperienceController();
            audio.playMusic();
        });
    }

    // 3. Audio & Sound Toggle Buttons
    const musicBtn = document.getElementById('music-toggle');
    const soundBtn = document.getElementById('sound-toggle');

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            audio.toggleMusic();
        });
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            audio.soundEnabled = !audio.soundEnabled;
            soundBtn.textContent = audio.soundEnabled ? '🔊' : '🔇';
            soundBtn.setAttribute('aria-label', audio.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX');
            audio.playClick();
        });
    }

    // 4. Custom Cursor for Desktop
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && cursorDot && cursorRing) {
        document.body.classList.add('has-custom-cursor');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        const updateRing = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            requestAnimationFrame(updateRing);
        };
        updateRing();

        // Hover expansions on buttons and links
        const interactiveEls = document.querySelectorAll('button, a, .photo-card, .secret-box, .candle-flame, input');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // 5. Mobile Navigation Hamburger Menu
    const navToggle = document.getElementById('nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (navToggle && mobileDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.classList.toggle('open', isOpen);
            audio.playClick();
        });

        mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                if (navToggle) navToggle.classList.remove('open');
            });
        });
    }

    // 6. Section Scroll & Reveal Observers
    const sections = document.querySelectorAll('.experience-scene');
    const navLinks = document.querySelectorAll('.site-nav .nav-link');
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = scrollPct + '%';
        }
    });

    const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
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

    sections.forEach(sec => sceneObserver.observe(sec));

    // 7. Accessibility - Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
});

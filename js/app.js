/**
 * ==========================================================================
 * MASTER APPLICATION BOOTSTRAP & MODE CONTROLLER
 * ==========================================================================
 * Bootstraps all subsystems (DataService, ThemeManager, Effects, Particles,
 * Audio, AdminAuth, AdminDashboard, BirthdayExperience).
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing Naga Bhushan Birthday Platform...");

    // 1. Data Service Initialization
    const dataService = window.dataService;

    // 2. Visual Theme & Effects Engine
    const themeManager = window.themeManager;
    const effectsController = new EffectsController();
    const particles = new ParticleEngine('bg-canvas');
    const confetti = new ConfettiEngine('celebration-canvas');
    const fireworks = new FireworksEngine('celebration-canvas');
    const audio = window.audioManager || new AudioManager();

    window.effectsController = effectsController;
    window.particleEngine = particles;
    window.confettiEngine = confetti;
    window.fireworksEngine = fireworks;
    window.audioManager = audio;

    // 3. Apply Initial Theme Customizations
    const initialData = dataService.getBirthdayData();
    if (themeManager && initialData.theme) {
        themeManager.applyTheme(initialData.theme);
    }

    // 4. Loading Screen Simulation (0% - 100%)
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
    }, 100);

    if (startExperienceBtn) {
        startExperienceBtn.onclick = () => {
            audio.playClick();
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.style.display = 'none', 800);
            }
            audio.playMusic();
        };
    }

    // 5. Initialize Admin Security & SaaS Control Center
    const adminAuth = new AdminAuth();
    const adminDashboard = new AdminDashboard();

    window.adminAuth = adminAuth;
    window.adminDashboard = adminDashboard;

    // 6. Initialize Guest Birthday Experience Controller
    const birthdayApp = new BirthdayExperience();
    window.birthdayApp = birthdayApp;

    // 7. Sound & Music Button Controls
    const musicBtn = document.getElementById('music-toggle');
    const soundBtn = document.getElementById('sound-toggle');

    if (musicBtn) {
        musicBtn.onclick = () => audio.toggleMusic();
    }

    if (soundBtn) {
        soundBtn.onclick = () => {
            audio.soundEnabled = !audio.soundEnabled;
            soundBtn.textContent = audio.soundEnabled ? '🔊' : '🔇';
            audio.playClick();
        };
    }

    // 8. Mobile Navigation Hamburger Menu
    const navToggle = document.getElementById('nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (navToggle && mobileDrawer) {
        navToggle.onclick = () => {
            const isOpen = mobileDrawer.classList.toggle('active');
            navToggle.classList.toggle('open', isOpen);
            audio.playClick();
        };

        mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = () => {
                mobileDrawer.classList.remove('active');
                if (navToggle) navToggle.classList.remove('open');
            };
        });
    }

    // 9. Scroll Progress Bar Update
    const progressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = scrollPct + '%';
        }
    });

    console.log("🎉 Platform ready! Default Admin PIN: 2026");
});

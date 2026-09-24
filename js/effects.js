/**
 * ==========================================================================
 * MOUSE CURSOR, PARALLAX & 3D TILT ENGINE
 * ==========================================================================
 * Handles custom glowing desktop cursor with dynamic labels (VIEW, OPEN, WISH, ADMIN),
 * click particle bursts, multi-layer mouse parallax, and 3D card tilt.
 */

class EffectsController {
    constructor() {
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorRing = document.querySelector('.cursor-ring');
        this.cursorLabel = document.querySelector('.cursor-label');

        this.mouse = { x: 0, y: 0, ringX: 0, ringY: 0 };
        this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this.parallaxEnabled = true;

        this.init();
    }

    init() {
        if (this.isTouch) {
            document.body.classList.remove('has-custom-cursor');
            return;
        }

        document.body.classList.add('has-custom-cursor');
        this.setupCursorTracking();
        this.setupContextHoverHandlers();
        this.setupClickRipples();
        this.setupMouseParallax();
        this.setup3DTilt();
    }

    setupCursorTracking() {
        if (!this.cursorDot || !this.cursorRing) return;

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.cursorDot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
        });

        const updateRing = () => {
            this.mouse.ringX += (this.mouse.x - this.mouse.ringX) * 0.18;
            this.mouse.ringY += (this.mouse.y - this.mouse.ringY) * 0.18;

            this.cursorRing.style.transform = `translate3d(${this.mouse.ringX}px, ${this.mouse.ringY}px, 0)`;
            requestAnimationFrame(updateRing);
        };
        updateRing();
    }

    setupContextHoverHandlers() {
        if (!this.cursorRing) return;

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('button, a, input, select, textarea, .photo-card, .gift-box-3d, .candle-flame, .hidden-admin-icon');
            if (!target) {
                this.setCursorState('', '');
                return;
            }

            if (target.classList.contains('hidden-admin-icon') || target.closest('#admin-toggle')) {
                this.setCursorState('hover-admin', 'ADMIN 👑');
            } else if (target.closest('#scene-03') || target.classList.contains('gift-box-3d')) {
                this.setCursorState('hover-gift', 'OPEN 🎁');
            } else if (target.classList.contains('photo-card') || target.closest('#gallery-grid')) {
                this.setCursorState('hover-photo', 'VIEW 📸');
            } else if (target.classList.contains('candle-flame') || target.closest('.cake-container')) {
                this.setCursorState('hover-cake', 'MAKE A WISH ✨');
            } else {
                this.setCursorState('hover-btn', '');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const related = e.relatedTarget;
            if (!related || !related.closest('button, a, input, select, textarea, .photo-card, .gift-box-3d, .candle-flame, .hidden-admin-icon')) {
                this.setCursorState('', '');
            }
        });
    }

    setCursorState(className, text) {
        if (!this.cursorRing) return;
        this.cursorRing.className = 'cursor-ring ' + className;
        if (this.cursorLabel) {
            this.cursorLabel.textContent = text;
            this.cursorLabel.style.display = text ? 'block' : 'none';
        }
    }

    setupClickRipples() {
        window.addEventListener('click', (e) => {
            if (this.isTouch) return;
            const ripple = document.createElement('div');
            ripple.className = 'click-particle-burst';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            document.body.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    setupMouseParallax() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        window.addEventListener('mousemove', (e) => {
            const data = window.dataService ? window.dataService.getBirthdayData() : null;
            if (data && data.effects && data.effects.parallax === false) return;

            const cx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const cy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

            // Layer parallax targets
            const bgLayers = document.querySelectorAll('.parallax-bg');
            const particleLayers = document.querySelectorAll('.parallax-particles');
            const shapeLayers = document.querySelectorAll('.parallax-shapes');

            bgLayers.forEach(el => el.style.transform = `translate3d(${cx * 5}px, ${cy * 5}px, 0)`);
            particleLayers.forEach(el => el.style.transform = `translate3d(${cx * 15}px, ${cy * 15}px, 0)`);
            shapeLayers.forEach(el => el.style.transform = `translate3d(${cx * 25}px, ${cy * 25}px, 0)`);
        });
    }

    setup3DTilt() {
        document.addEventListener('mousemove', (e) => {
            const data = window.dataService ? window.dataService.getBirthdayData() : null;
            if (data && data.effects && data.effects.tilt === false) return;

            const tiltCards = document.querySelectorAll('.glass-card:not(.no-tilt), .photo-card, .envelope-3d');
            tiltCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const rotateX = (centerY - e.clientY) * 0.04;
                    const rotateY = (e.clientX - centerX) * 0.04;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });
        });

        document.addEventListener('mouseleave', () => {
            const tiltCards = document.querySelectorAll('.glass-card:not(.no-tilt), .photo-card, .envelope-3d');
            tiltCards.forEach(card => card.style.transform = '');
        });
    }
}

window.EffectsController = EffectsController;

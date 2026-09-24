/**
 * ==========================================
 * REALISTIC CANVAS FIREWORKS ENGINE
 * ==========================================
 * Launches upward rockets that burst into colorful
 * shimmering particle clouds with fading gravity trails.
 * Includes auto-clear after max 10 seconds.
 */

class FireworksEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.rockets = [];
        this.particles = [];
        this.animId = null;
        this.showTimer = null;
        this.stopTimeout = null;
        
        this.colors = [
            '#ff0055', '#ff5500', '#ffcc00', '#00ffcc', 
            '#0099ff', '#ff00ff', '#ffffff', '#7000ff'
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    launch(targetX, targetY) {
        const startX = targetX || Math.random() * (this.width - 200) + 100;
        const startY = this.height;
        const endY = targetY || Math.random() * (this.height * 0.4) + 100;
        const speed = Math.random() * 4 + 10;
        const angle = Math.atan2(endY - startY, (targetX || startX) - startX);

        this.rockets.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed * 0.2,
            vy: -speed,
            targetY: endY,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            trail: []
        });

        if (!this.animId) {
            this.loop();
        }
    }

    launchShow(durationMs = 10000, intervalMs = 250) {
        this.stopAndClear(); // Clear any previous fireworks state

        const maxDuration = Math.min(durationMs, 10000); // Enforce 10 seconds maximum limit

        this.showTimer = setInterval(() => {
            const count = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < count; i++) {
                this.launch();
            }
        }, intervalMs);

        // Stop launching after maxDuration
        setTimeout(() => {
            if (this.showTimer) {
                clearInterval(this.showTimer);
                this.showTimer = null;
            }
        }, maxDuration);

        // Completely stop and clear effect canvas after 10 seconds
        this.stopTimeout = setTimeout(() => {
            this.stopAndClear();
        }, 10000);
    }

    stopAndClear() {
        if (this.showTimer) {
            clearInterval(this.showTimer);
            this.showTimer = null;
        }
        if (this.stopTimeout) {
            clearTimeout(this.stopTimeout);
            this.stopTimeout = null;
        }
        this.rockets = [];
        this.particles = [];
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }

    explode(x, y, color) {
        const particleCount = Math.floor(Math.random() * 40) + 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 1;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color || this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: 1,
                decay: Math.random() * 0.03 + 0.02,
                gravity: 0.14,
                friction: 0.95,
                flicker: Math.random() > 0.5
            });
        }
    }

    update() {
        // Clear frame to prevent infinite trail clutter overlay
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update Rockets
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const r = this.rockets[i];
            r.x += r.vx;
            r.y += r.vy;

            // Rocket trail
            r.trail.push({ x: r.x, y: r.y, alpha: 1 });
            if (r.trail.length > 5) r.trail.shift();

            // Render rocket head and trail
            this.ctx.strokeStyle = r.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            for (let j = 0; j < r.trail.length - 1; j++) {
                this.ctx.moveTo(r.trail[j].x, r.trail[j].y);
                this.ctx.lineTo(r.trail[j + 1].x, r.trail[j + 1].y);
            }
            this.ctx.stroke();

            // Reached target height
            if (r.vy >= 0 || r.y <= r.targetY) {
                this.explode(r.x, r.y, r.color);
                this.rockets.splice(i, 1);
            }
        }

        // Update Burst Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx *= p.friction;
            p.vy = p.vy * p.friction + p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            const currentAlpha = p.flicker && Math.random() < 0.3 ? p.alpha * 0.4 : p.alpha;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, currentAlpha);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, Math.random() * 1.5 + 1.2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    loop() {
        if (this.rockets.length > 0 || this.particles.length > 0) {
            this.update();
            this.animId = requestAnimationFrame(() => this.loop());
        } else {
            this.stopAndClear();
        }
    }
}

window.FireworksEngine = FireworksEngine;

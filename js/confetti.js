/**
 * ==========================================
 * CUSTOM CELEBRATION CONFETTI ENGINE
 * ==========================================
 * Explosive celebration effects with multi-shape
 * confetti particles (rectangles, circles, stars, hearts),
 * rotation dynamics, gravity, and air resistance.
 */

class ConfettiEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animId = null;
        this.colors = [
            '#a855f7', '#ec4899', '#06b6d4', '#3b82f6', 
            '#eab308', '#f43f5e', '#10b981', '#ffffff'
        ];
        this.shapes = ['rect', 'circle', 'star', 'heart'];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    burst(x = this.width / 2, y = this.height / 3, count = 120) {
        const shapeTypes = this.shapes;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 16 + 4;
            const size = Math.random() * 10 + 6;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 4,
                vy: Math.sin(angle) * velocity - Math.random() * 6 - 2,
                size: size,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.2,
                gravity: 0.25 + Math.random() * 0.15,
                drag: 0.96,
                alpha: 1,
                decay: 0.008 + Math.random() * 0.008,
                wobble: Math.random() * 10,
                wobbleSpeed: Math.random() * 0.1 + 0.05
            });
        }

        if (!this.animId) {
            this.loop();
        }
    }

    cannonSideBurst() {
        // Left Cannon
        this.burst(0, this.height * 0.7, 80);
        // Right Cannon
        this.burst(this.width, this.height * 0.7, 80);
    }

    drawStar(ctx, x, y, size, color, alpha, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size,
                       -Math.sin((18 + i * 72) * Math.PI / 180) * size);
            ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (size / 2),
                       -Math.sin((54 + i * 72) * Math.PI / 180) * (size / 2));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawHeart(ctx, x, y, size, color, alpha, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
        ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        ctx.fill();
        ctx.restore();
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.vx *= p.drag;
            p.vy = p.vy * p.drag + p.gravity;
            p.x += p.vx + Math.sin(p.wobble) * 0.8;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.wobble += p.wobbleSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0 || p.y > this.height + 50) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;

            if (p.shape === 'rect') {
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else if (p.shape === 'circle') {
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.shape === 'star') {
                this.drawStar(this.ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
            } else if (p.shape === 'heart') {
                this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
            }

            this.ctx.restore();
        }
    }

    loop() {
        if (this.particles.length > 0) {
            this.update();
            this.animId = requestAnimationFrame(() => this.loop());
        } else {
            this.animId = null;
        }
    }
}

window.ConfettiEngine = ConfettiEngine;

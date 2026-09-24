/**
 * ==========================================
 * HIGH PERFORMANCE CANVAS PARTICLE ENGINE
 * ==========================================
 * Renders ambient stars, glowing neon bokeh,
 * floating sparkles, and subtle mouse parallax.
 */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.stars = [];
        this.floatingShapes = [];
        
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.isLowPerformance = window.innerWidth < 768;
        this.particleCount = this.isLowPerformance ? 45 : 110;
        this.starCount = this.isLowPerformance ? 60 : 160;
        
        this.colors = [
            'rgba(168, 85, 247, ',   // Neon Purple
            'rgba(236, 72, 153, ',   // Hot Pink
            'rgba(6, 182, 212, ',    // Cyan
            'rgba(59, 130, 246, ',   // Blue
            'rgba(234, 179, 8, '     // Yellow/Gold
        ];
        
        this.animId = null;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.createStars();
        this.createFloatingShapes();
        
        window.addEventListener('resize', () => this.debounceResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('visibilitychange', () => this.onVisibilityChange());
        
        this.start();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.isLowPerformance = window.innerWidth < 768;
    }

    debounceResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.resize();
            this.createParticles();
            this.createStars();
        }, 200);
    }

    onMouseMove(e) {
        this.mouse.targetX = (e.clientX - this.width / 2) * 0.05;
        this.mouse.targetY = (e.clientY - this.height / 2) * 0.05;
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else {
            this.start();
        }
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 1.8 + 0.3,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005,
                twinkleFactor: Math.random() * 0.05
            });
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            const colorBase = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 3 + 1,
                blurRadius: Math.random() * 20 + 5,
                colorBase: colorBase,
                alpha: Math.random() * 0.6 + 0.2,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6 - 0.2,
                pulse: Math.random() * Math.PI,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                depth: Math.random() * 0.8 + 0.2
            });
        }
    }

    createFloatingShapes() {
        this.floatingShapes = [];
        const shapeTypes = ['sparkle', 'heart', 'circle'];
        const count = this.isLowPerformance ? 8 : 18;
        
        for (let i = 0; i < count; i++) {
            this.floatingShapes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 12 + 8,
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                alpha: Math.random() * 0.4 + 0.1,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.02,
                vy: -(Math.random() * 0.4 + 0.1),
                vx: (Math.random() - 0.5) * 0.3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)] + '0.7)'
            });
        }
    }

    drawSparkle(ctx, x, y, size, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(0, -size);
            ctx.quadraticCurveTo(0, 0, size / 3, 0);
        }
        ctx.fill();
        ctx.restore();
    }

    drawHeart(ctx, x, y, size, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
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
        // Smooth parallax towards mouse target
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Render Twinkling Stars
        for (let star of this.stars) {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.1) {
                star.speed = -star.speed;
            }
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, star.alpha)})`;
            this.ctx.beginPath();
            const px = star.x + this.mouse.x * 0.2;
            const py = star.y + this.mouse.y * 0.2;
            this.ctx.arc(px, py, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Render Glowing Bokeh Particles
        for (let p of this.particles) {
            p.pulse += p.pulseSpeed;
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -20) p.x = this.width + 20;
            if (p.x > this.width + 20) p.x = -20;
            if (p.y < -20) p.y = this.height + 20;
            if (p.y > this.height + 20) p.y = -20;

            const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.2);
            const px = p.x + this.mouse.x * p.depth;
            const py = p.y + this.mouse.y * p.depth;

            this.ctx.beginPath();
            this.ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.colorBase + currentAlpha + ')';
            this.ctx.shadowBlur = p.blurRadius;
            this.ctx.shadowColor = p.colorBase + '0.8)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // Render Floating Shapes (Sparkles & Hearts)
        for (let shape of this.floatingShapes) {
            shape.y += shape.vy;
            shape.x += shape.vx;
            shape.rotation += shape.vRot;

            if (shape.y < -30) {
                shape.y = this.height + 30;
                shape.x = Math.random() * this.width;
            }

            const px = shape.x + this.mouse.x * 0.4;
            const py = shape.y + this.mouse.y * 0.4;

            if (shape.type === 'sparkle') {
                this.drawSparkle(this.ctx, px, py, shape.size, shape.color, shape.alpha);
            } else if (shape.type === 'heart') {
                this.drawHeart(this.ctx, px, py, shape.size, shape.color, shape.alpha);
            } else {
                this.ctx.save();
                this.ctx.translate(px, py);
                this.ctx.rotate(shape.rotation);
                this.ctx.fillStyle = shape.color;
                this.ctx.globalAlpha = shape.alpha;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }

    loop() {
        this.update();
        this.animId = requestAnimationFrame(() => this.loop());
    }

    start() {
        if (!this.animId) {
            this.loop();
        }
    }

    stop() {
        if (this.animId) {
            cancelAnimationFrame(this.animId);
            this.animId = null;
        }
    }
}

window.ParticleEngine = ParticleEngine;

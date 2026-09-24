/**
 * ==========================================
 * AUDIO MANAGER & SYNTHESIZER
 * ==========================================
 * Handles background music playback and Web Audio API
 * procedural sound effects (click, open gift, candle blow,
 * fireworks pop, game win fanfare).
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.bgMusic = null;
        this.soundEnabled = true;
        this.musicEnabled = false;
        this.isInitialized = false;

        this.initMusic();
    }

    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isInitialized = true;
    }

    initMusic() {
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.4;
        
        if (window.birthdayConfig && window.birthdayConfig.audio && window.birthdayConfig.audio.musicPath) {
            this.bgMusic.src = window.birthdayConfig.audio.musicPath;
        }

        // Handle error gracefully if file missing
        this.bgMusic.onerror = () => {
            console.log("Background music file not found or failed to load. Sound FX synth active.");
        };
    }

    toggleMusic() {
        this.initContext();
        if (this.musicEnabled) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
        return this.musicEnabled;
    }

    playMusic() {
        if (!this.bgMusic || !this.bgMusic.src) return;
        this.initContext();
        this.bgMusic.play().then(() => {
            this.musicEnabled = true;
            this.updateMusicUI(true);
        }).catch(err => {
            console.log("Autoplay blocked or music missing:", err);
            this.musicEnabled = false;
            this.updateMusicUI(false);
        });
    }

    pauseMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.musicEnabled = false;
            this.updateMusicUI(false);
        }
    }

    updateMusicUI(isPlaying) {
        const musicBtn = document.getElementById('music-toggle');
        const playerBadge = document.getElementById('music-player-badge');
        if (musicBtn) {
            musicBtn.classList.toggle('active', isPlaying);
            musicBtn.setAttribute('aria-label', isPlaying ? 'Mute Music' : 'Play Music');
            const icon = musicBtn.querySelector('.icon');
            if (icon) icon.textContent = isPlaying ? '🎵' : '🔇';
        }
        if (playerBadge) {
            playerBadge.textContent = isPlaying ? 'Birthday Mode: ON 🎵' : 'Birthday Mode: OFF 🔇';
            playerBadge.classList.toggle('playing', isPlaying);
        }
    }

    // ==========================================
    // SYNTHESIZED SOUND EFFECTS (Web Audio API)
    // ==========================================

    playClick() {
        if (!this.soundEnabled) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playPop() {
        if (!this.soundEnabled) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playGiftOpen() {
        if (!this.soundEnabled) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + idx * 0.06);
            osc.stop(this.ctx.currentTime + idx * 0.06 + 0.3);
        });
    }

    playBlowCandle() {
        if (!this.soundEnabled) return;
        this.initContext();
        if (!this.ctx) return;

        // White noise puff
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    playWinFanfare() {
        if (!this.soundEnabled) return;
        this.initContext();
        if (!this.ctx) return;

        const melody = [
            { f: 523.25, d: 0.15 }, // C5
            { f: 659.25, d: 0.15 }, // E5
            { f: 783.99, d: 0.15 }, // G5
            { f: 1046.50, d: 0.4 }  // C6
        ];

        let timeOffset = 0;
        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + timeOffset);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime + timeOffset);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + timeOffset + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(this.ctx.currentTime + timeOffset);
            osc.stop(this.ctx.currentTime + timeOffset + note.d);

            timeOffset += note.d * 0.8;
        });
    }

    playFireworkPop() {
        if (!this.soundEnabled) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150 + Math.random() * 100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
}

window.AudioManager = AudioManager;

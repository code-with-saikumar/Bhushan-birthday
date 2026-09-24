/**
 * ==========================================================================
 * AUDIO & SOUND SYNTHESIZER MODULE
 * ==========================================================================
 * Manages background music playback and Web Audio API synthesized UI sound effects
 * (Pop, Click, Gift Open, Candle Blow, Win Fanfare, Firework Explosion).
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.bgMusic = null;
        this.soundEnabled = true;
        this.musicEnabled = false;
        this.volume = 0.8;

        this.initMusic();
    }

    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initMusic() {
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.volume;

        const data = window.dataService ? window.dataService.getBirthdayData() : null;
        if (data && data.audio && data.audio.musicPath) {
            this.bgMusic.src = data.audio.musicPath;
        } else {
            this.bgMusic.src = "assets/audio/birthday-music.mp3";
        }

        this.bgMusic.onerror = () => {
            console.log("Audio: Background music track not found. Sound FX synth active.");
        };
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.bgMusic) this.bgMusic.volume = this.volume;
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
        }).catch(() => {
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
            const icon = musicBtn.querySelector('.icon');
            if (icon) icon.textContent = isPlaying ? '🎵' : '🔇';
        }
        if (playerBadge) {
            playerBadge.textContent = isPlaying ? 'Birthday Mode: ON 🎵' : 'Birthday Mode: OFF 🔇';
            playerBadge.classList.toggle('playing', isPlaying);
        }
    }

    // ==========================================
    // SYNTHESIZED SOUND EFFECTS
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

        gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
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

        gain.gain.setValueAtTime(0.25 * this.volume, this.ctx.currentTime);
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

            gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime + idx * 0.06);
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
        gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
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
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.15 },
            { f: 1046.50, d: 0.4 }
        ];

        let timeOffset = 0;
        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, this.ctx.currentTime + timeOffset);

            gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime + timeOffset);
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

        gain.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
}

window.audioManager = new AudioManager();

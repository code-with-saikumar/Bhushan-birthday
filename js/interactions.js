/**
 * ==========================================
 * INTERACTION CONTROLLER & ADMIN LIVE EDITOR
 * ==========================================
 * Controls interactive widgets, 3D gift box,
 * roast machine engine, photo lightbox, video player,
 * digital envelope, cake candles blowing, mini-games,
 * secret Easter eggs, and ADMIN 4-DIGIT PIN DASHBOARD.
 */

class ExperienceController {
    constructor() {
        this.config = window.birthdayConfig || {};
        this.audio = window.audioManager || new AudioManager();
        this.confetti = window.confettiEngine || null;
        this.fireworks = window.fireworksEngine || null;

        this.currentSceneIndex = 0;
        this.game1Score = 0;
        this.easterEggClicks = 0;

        // Admin Security & State
        this.enteredPin = "";
        this.isAdminUnlocked = false;

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMysteriousIntro();
        this.setupGiftBox();
        this.setupRoastMachine();
        this.setupGallery();
        this.setupVideoPlayer();
        this.setupDigitalLetter();
        this.setupBirthdayCake();
        this.setupTimeline();
        this.setupWishWall();
        this.setupMiniGames();
        this.setupGrandFinale();
        this.setupEasterEggs();
        this.setupShareAndReplay();
        this.setupCountdown();

        // Admin PIN & Live Manager
        this.setupAdminSystem();
    }

    // ==========================================
    // NAVIGATION & SCENE SCROLLING
    // ==========================================
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const skipBtn = document.getElementById('skip-intro-btn');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSec = document.querySelector(targetId);
                if (targetSec) {
                    targetSec.scrollIntoView({ behavior: 'smooth' });
                    this.audio.playClick();
                }
            });
        });

        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                const portalSec = document.getElementById('scene-02');
                if (portalSec) {
                    portalSec.scrollIntoView({ behavior: 'smooth' });
                    this.audio.playClick();
                }
            });
        }
    }

    // ==========================================
    // SCENE 01 — MYSTERIOUS WELCOME
    // ==========================================
    setupMysteriousIntro() {
        const enterBtn = document.getElementById('enter-chaos-btn');
        const loadingBox = document.getElementById('intro-loading-text');
        const chaosPopup = document.getElementById('chaos-popup');
        const chaosCloseBtn = document.getElementById('chaos-popup-close');
        const chaosOkBtn = document.getElementById('chaos-popup-ok');

        const openChaosPopup = () => {
            if (chaosPopup) {
                chaosPopup.classList.add('active');
                chaosPopup.setAttribute('aria-hidden', 'false');
            }
        };

        const closeChaosPopup = () => {
            if (chaosPopup) {
                chaosPopup.classList.remove('active');
                chaosPopup.setAttribute('aria-hidden', 'true');
            }
        };

        if (chaosCloseBtn) {
            chaosCloseBtn.addEventListener('click', closeChaosPopup);
        }

        if (chaosOkBtn) {
            chaosOkBtn.addEventListener('click', closeChaosPopup);
        }

        if (chaosPopup) {
            chaosPopup.addEventListener('click', (event) => {
                if (event.target === chaosPopup) closeChaosPopup();
            });
        }

        if (loadingBox && this.config.intro && this.config.intro.loadingTexts) {
            let lineIdx = 0;
            const texts = this.config.intro.loadingTexts;
            
            const textInterval = setInterval(() => {
                if (lineIdx < texts.length) {
                    const line = document.createElement('div');
                    line.className = 'loading-line';
                    line.textContent = texts[lineIdx];
                    loadingBox.appendChild(line);
                    lineIdx++;
                    this.audio.playClick();
                } else {
                    clearInterval(textInterval);
                    const subjectBox = document.getElementById('intro-subject-reveal');
                    if (subjectBox) {
                        subjectBox.classList.add('revealed');
                    }
                }
            }, 750);
        }

        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.audio.playPop();
                openChaosPopup();

                // Flash screen & burst celebration
                document.body.classList.add('screen-flash');
                setTimeout(() => document.body.classList.remove('screen-flash'), 500);

                if (this.confetti) {
                    this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
                }

                // Smooth scroll to Scene 02
                const portal = document.getElementById('scene-02');
                if (portal) {
                    portal.scrollIntoView({ behavior: 'smooth' });
                }

                // Start background music if enabled
                this.audio.playMusic();
            });
        }

        const portalBtn = document.getElementById('portal-start-btn');
        if (portalBtn) {
            portalBtn.addEventListener('click', () => {
                this.audio.playClick();
                if (this.fireworks) this.fireworks.launchShow(3000, 300);
                if (this.confetti) this.confetti.burst(window.innerWidth / 2, window.innerHeight / 3, 120);

                const giftSec = document.getElementById('scene-03');
                if (giftSec) {
                    giftSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // ==========================================
    // SCENE 03 — INTERACTIVE GIFT BOX
    // ==========================================
    setupGiftBox() {
        const giftContainer = document.getElementById('interactive-gift');
        const openBtn = document.getElementById('open-gift-btn');
        const giftResult = document.getElementById('gift-result');

        if (giftContainer) {
            // Mouse perspective tilt
            window.addEventListener('mousemove', (e) => {
                const rect = giftContainer.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const rotateX = (centerY - e.clientY) * 0.08;
                    const rotateY = (e.clientX - centerX) * 0.08;
                    giftContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });
        }

        if (openBtn) {
            openBtn.addEventListener('click', () => {
                if (giftContainer.classList.contains('opened')) return;

                this.audio.playClick();
                this.audio.playGiftOpen();

                // Shaking animation
                giftContainer.classList.add('shaking');

                setTimeout(() => {
                    giftContainer.classList.remove('shaking');
                    giftContainer.classList.add('opened');

                    if (this.confetti) {
                        this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 140);
                    }

                    if (giftResult) {
                        giftResult.classList.add('show');
                    }
                }, 800);
            });
        }
    }

    // ==========================================
    // SCENE 04 — ROAST MACHINE ENGINE
    // ==========================================
    setupRoastMachine() {
        this.renderRoastEngine();

        const rescanBtn = document.getElementById('rescan-roast-btn');
        const cardsGrid = document.getElementById('roast-cards-grid');

        if (rescanBtn) {
            rescanBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.audio.playPop();

                rescanBtn.disabled = true;
                rescanBtn.textContent = 'SCANNING... 🤖';

                if (cardsGrid) {
                    cardsGrid.classList.add('scanning-blur');
                }

                setTimeout(() => {
                    rescanBtn.disabled = false;
                    rescanBtn.textContent = 'RUN ANOTHER SCAN 😂';
                    if (cardsGrid) {
                        cardsGrid.classList.remove('scanning-blur');
                        this.shuffleRoastCards();
                    }
                    if (this.confetti) {
                        this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
                    }
                }, 800);
            });
        }
    }

    renderRoastEngine() {
        const cardsGrid = document.getElementById('roast-cards-grid');
        if (!cardsGrid || !this.config.roastEngine) return;

        cardsGrid.innerHTML = '';
        const cards = this.config.roastEngine.cards || [];

        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'glass-card roast-card';
            cardEl.innerHTML = `
                <div class="card-admin-actions">
                    <button class="admin-action-btn" onclick="window.experienceController.deleteRoastItem(${card.id})">🗑️ Delete</button>
                </div>
                <div class="roast-icon">${card.icon}</div>
                <h3 class="roast-card-title">${card.title}</h3>
                <p class="roast-card-text">${card.text}</p>
            `;
            cardsGrid.appendChild(cardEl);
        });
    }

    shuffleRoastCards() {
        const cardsGrid = document.getElementById('roast-cards-grid');
        if (!cardsGrid || !this.config.roastEngine || !this.config.roastEngine.cards) return;

        const cardsData = [...this.config.roastEngine.cards];
        cardsData.sort(() => Math.random() - 0.5);

        cardsGrid.innerHTML = '';
        cardsData.slice(0, 6).forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'glass-card roast-card';
            cardEl.innerHTML = `
                <div class="card-admin-actions">
                    <button class="admin-action-btn" onclick="window.experienceController.deleteRoastItem(${card.id})">🗑️ Delete</button>
                </div>
                <div class="roast-icon">${card.icon}</div>
                <h3 class="roast-card-title">${card.title}</h3>
                <p class="roast-card-text">${card.text}</p>
            `;
            cardsGrid.appendChild(cardEl);
        });
    }

    // ==========================================
    // SCENE 05 — MEMORY LANE PHOTO GALLERY
    // ==========================================
    setupGallery() {
        this.renderGallery();
    }

    renderGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        const lightbox = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (!galleryGrid || !this.config.photos) return;

        let currentPhotoIdx = 0;

        galleryGrid.innerHTML = '';
        this.config.photos.forEach((photo, idx) => {
            const item = document.createElement('div');
            item.className = 'photo-card polaroid-tilt';
            item.setAttribute('data-idx', idx);

            item.innerHTML = `
                <div class="card-admin-actions">
                    <button class="admin-action-btn" onclick="event.stopPropagation(); window.experienceController.deletePhotoItem(${photo.id || idx})">🗑️ Delete</button>
                </div>
                <div class="photo-wrapper">
                    <img src="${photo.url}" alt="${photo.alt || 'Memory'}" loading="lazy" 
                         onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'placeholder-photo\\'><span>📸</span><p>YOUR MEMORY GOES HERE</p></div>';">
                </div>
                <div class="photo-caption">${photo.caption}</div>
            `;

            item.addEventListener('click', () => {
                currentPhotoIdx = idx;
                openLightbox(currentPhotoIdx);
                this.audio.playClick();
            });

            galleryGrid.appendChild(item);
        });

        const openLightbox = (idx) => {
            if (!lightbox || !this.config.photos[idx]) return;
            const photo = this.config.photos[idx];
            currentPhotoIdx = idx;

            if (lightboxImg) {
                lightboxImg.src = photo.url;
                lightboxImg.onerror = function() {
                    this.onerror = null;
                    this.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23121633'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='%23ec4899' font-size='60'>📸</text><text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-size='24' font-family='sans-serif'>YOUR MEMORY GOES HERE</text></svg>";
                };
            }
            if (lightboxCaption) lightboxCaption.textContent = photo.caption;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            if (lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        };

        if (closeBtn) closeBtn.onclick = closeLightbox;

        if (prevBtn) {
            prevBtn.onclick = () => {
                if (this.config.photos.length === 0) return;
                currentPhotoIdx = (currentPhotoIdx - 1 + this.config.photos.length) % this.config.photos.length;
                openLightbox(currentPhotoIdx);
                this.audio.playClick();
            };
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                if (this.config.photos.length === 0) return;
                currentPhotoIdx = (currentPhotoIdx + 1) % this.config.photos.length;
                openLightbox(currentPhotoIdx);
                this.audio.playClick();
            };
        }
    }

    // ==========================================
    // SCENE 06 — PERSONAL VIDEO EXPERIENCE
    // ==========================================
    setupVideoPlayer() {
        const video = document.getElementById('birthday-video-element');
        const playBtn = document.getElementById('video-custom-play');
        const muteBtn = document.getElementById('video-custom-mute');
        const fullBtn = document.getElementById('video-custom-fullscreen');
        const progressBar = document.getElementById('video-progress-fill');
        const placeholder = document.getElementById('video-placeholder-card');
        const videoWrapper = document.getElementById('video-wrapper');

        if (!video) return;

        video.onerror = () => {
            if (videoWrapper) videoWrapper.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        };

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.audio.playClick();
                if (video.paused) {
                    video.play().then(() => {
                        playBtn.classList.add('playing');
                        playBtn.innerHTML = '<span>⏸</span>';
                    }).catch(() => {
                        if (videoWrapper) videoWrapper.style.display = 'none';
                        if (placeholder) placeholder.style.display = 'flex';
                    });
                } else {
                    video.pause();
                    playBtn.classList.remove('playing');
                    playBtn.innerHTML = '<span>▶</span>';
                }
            });
        }

        if (video) {
            video.addEventListener('timeupdate', () => {
                if (progressBar && video.duration) {
                    const pct = (video.currentTime / video.duration) * 100;
                    progressBar.style.width = pct + '%';
                }
            });

            video.addEventListener('ended', () => {
                if (playBtn) {
                    playBtn.classList.remove('playing');
                    playBtn.innerHTML = '<span>▶</span>';
                }
                const endMsg = document.getElementById('video-ended-msg');
                if (endMsg) {
                    endMsg.classList.add('show');
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                muteBtn.textContent = video.muted ? '🔇' : '🔊';
                this.audio.playClick();
            });
        }

        if (fullBtn) {
            fullBtn.addEventListener('click', () => {
                if (video.requestFullscreen) video.requestFullscreen();
                else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                this.audio.playClick();
            });
        }
    }

    // ==========================================
    // SCENE 07 — THE DIGITAL LETTER
    // ==========================================
    setupDigitalLetter() {
        this.renderLetter();

        const envelope = document.getElementById('envelope-container');
        const letter = document.getElementById('letter-paper');
        const openBtn = document.getElementById('open-letter-btn');
        const letterPopup = document.getElementById('letter-popup');
        const letterPopupClose = document.getElementById('letter-popup-close');

        const triggerOpen = () => {
            if (envelope && envelope.classList.contains('opened')) return;

            this.audio.playClick();
            this.audio.playGiftOpen();

            if (envelope) envelope.classList.add('opened');

            setTimeout(() => {
                if (letter) letter.classList.add('slide-out');
                if (this.confetti) {
                    this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
                }
                if (letterPopup) {
                    letterPopup.classList.add('active');
                    letterPopup.setAttribute('aria-hidden', 'false');
                }
            }, 600);
        };

        if (letterPopupClose) {
            letterPopupClose.addEventListener('click', () => {
                if (letterPopup) {
                    letterPopup.classList.remove('active');
                    letterPopup.setAttribute('aria-hidden', 'true');
                }
            });
        }

        if (letterPopup) {
            letterPopup.addEventListener('click', (event) => {
                if (event.target === letterPopup) {
                    letterPopup.classList.remove('active');
                    letterPopup.setAttribute('aria-hidden', 'true');
                }
            });
        }

        if (envelope) envelope.addEventListener('click', triggerOpen);
        if (openBtn) openBtn.addEventListener('click', triggerOpen);
    }

    renderLetter() {
        const sal = document.getElementById('letter-salutation-text');
        const body = document.getElementById('letter-body-text');
        const closing = document.getElementById('letter-closing-text');

        if (this.config.letter) {
            if (sal) sal.textContent = this.config.letter.salutation || "Dear Naga Bhushan,";
            if (body && this.config.letter.paragraphs) {
                body.innerHTML = this.config.letter.paragraphs.map(p => `<p>${p}</p>`).join('');
            }
            if (closing) closing.textContent = this.config.letter.closing || "— Your Friend";
        }
    }

    // ==========================================
    // SCENE 08 — INTERACTIVE BIRTHDAY CAKE
    // ==========================================
    setupBirthdayCake() {
        this.renderCake();
    }

    renderCake() {
        const container = document.getElementById('candles-row');
        const blowBtn = document.getElementById('blow-candles-btn');
        const cakeMsg = document.getElementById('cake-wish-msg');
        if (!container) return;

        const count = (this.config.cake && this.config.cake.candleCount) ? this.config.cake.candleCount : 5;
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const candle = document.createElement('div');
            candle.className = 'candle';
            candle.innerHTML = `<div class="candle-flame"></div>`;
            container.appendChild(candle);
        }

        const candles = container.querySelectorAll('.candle-flame');
        let remainingCandles = candles.length;

        const extinguishCandles = () => {
            candles.forEach(flame => flame.classList.add('extinguished'));
            remainingCandles = 0;

            this.audio.playBlowCandle();

            if (this.confetti) {
                this.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 150);
            }
            if (this.fireworks) {
                this.fireworks.launchShow(4000, 250);
            }

            if (cakeMsg) {
                const wishTitle = (this.config.cake && this.config.cake.wishMessage) ? this.config.cake.wishMessage : "MAKE A WISH, NAGA BHUSHAN ✨";
                const subtext = (this.config.cake && this.config.cake.subtext) ? this.config.cake.subtext : "Wish successfully launched into the universe 🚀";
                cakeMsg.innerHTML = `
                    <h3 class="neon-text-gold">${wishTitle}</h3>
                    <p class="wish-launch-subtext">${subtext}</p>
                `;
                cakeMsg.classList.add('show');
            }

            if (blowBtn) blowBtn.style.display = 'none';
        };

        candles.forEach(flame => {
            flame.addEventListener('click', () => {
                if (!flame.classList.contains('extinguished')) {
                    flame.classList.add('extinguished');
                    remainingCandles--;
                    this.audio.playPop();

                    if (remainingCandles <= 0) {
                        extinguishCandles();
                    }
                }
            });
        });

        if (blowBtn) {
            blowBtn.style.display = 'inline-flex';
            blowBtn.onclick = () => {
                this.audio.playClick();
                extinguishCandles();
            };
        }
    }

    // ==========================================
    // SCENE 09 — FRIENDSHIP TIMELINE
    // ==========================================
    setupTimeline() {
        this.renderTimeline();
    }

    renderTimeline() {
        const timelineBox = document.getElementById('timeline-items-container');
        if (!timelineBox || !this.config.timeline) return;

        timelineBox.innerHTML = '';
        this.config.timeline.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = `timeline-card ${idx % 2 === 0 ? 'left' : 'right'}`;
            el.innerHTML = `
                <div class="card-admin-actions">
                    <button class="admin-action-btn" onclick="window.experienceController.deleteTimelineItem(${item.id || idx})">🗑️ Delete</button>
                </div>
                <div class="timeline-badge">${item.icon}</div>
                <div class="glass-card timeline-content">
                    <span class="timeline-year">${item.year}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.description}</p>
                </div>
            `;
            timelineBox.appendChild(el);
        });

        const cards = timelineBox.querySelectorAll('.timeline-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        cards.forEach(card => observer.observe(card));
    }

    // ==========================================
    // SCENE 10 — WISH WALL
    // ==========================================
    setupWishWall() {
        this.renderWishWall();
    }

    renderWishWall() {
        const wallGrid = document.getElementById('wish-wall-grid');
        if (!wallGrid || !this.config.wishes) return;

        wallGrid.innerHTML = '';
        this.config.wishes.forEach((w, idx) => {
            const card = document.createElement('div');
            card.className = `glass-card wish-card ${w.bg || ''}`;
            card.innerHTML = `
                <div class="card-admin-actions">
                    <button class="admin-action-btn" onclick="window.experienceController.deleteWishItem(${w.id || idx})">🗑️ Delete</button>
                </div>
                <span class="wish-tag">${w.tag}</span>
                <p class="wish-message">"${w.message}"</p>
                <div class="wish-from">— ${w.from}</div>
            `;
            wallGrid.appendChild(card);
        });
    }

    // ==========================================
    // SCENE 11 — MINI GAMES
    // ==========================================
    setupMiniGames() {
        const balloonArea = document.getElementById('balloon-game-area');
        const scoreEl = document.getElementById('balloon-score');
        const startBalloonsBtn = document.getElementById('start-balloon-game-btn');
        const game1Win = document.getElementById('game1-win-msg');

        if (startBalloonsBtn && balloonArea) {
            startBalloonsBtn.addEventListener('click', () => {
                this.audio.playClick();
                this.game1Score = 0;
                if (scoreEl) scoreEl.textContent = '0';
                if (game1Win) game1Win.style.display = 'none';
                balloonArea.innerHTML = '';

                startBalloonsBtn.textContent = 'POP 10 BALLOONS! 🎈';

                const spawnInterval = setInterval(() => {
                    if (this.game1Score >= 10) {
                        clearInterval(spawnInterval);
                        return;
                    }
                    const b = document.createElement('div');
                    b.className = 'floating-balloon-game';
                    const colors = ['#a855f7', '#ec4899', '#06b6d4', '#eab308', '#f43f5e'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    b.style.background = `radial-gradient(circle at 30% 30%, ${color}, #000)`;
                    b.style.left = Math.random() * (balloonArea.clientWidth - 60) + 'px';
                    b.innerHTML = '🎈';

                    b.addEventListener('click', () => {
                        this.audio.playPop();
                        b.remove();
                        this.game1Score++;
                        if (scoreEl) scoreEl.textContent = this.game1Score;

                        if (this.game1Score >= 10) {
                            this.audio.playWinFanfare();
                            if (this.confetti) this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
                            if (game1Win) game1Win.style.display = 'block';
                            startBalloonsBtn.textContent = 'PLAY AGAIN 🔄';
                        }
                    });

                    balloonArea.appendChild(b);

                    let topPos = balloonArea.clientHeight;
                    const floatSpeed = Math.random() * 2 + 1.5;
                    const anim = setInterval(() => {
                        topPos -= floatSpeed;
                        b.style.top = topPos + 'px';
                        if (topPos < -60) {
                            clearInterval(anim);
                            b.remove();
                        }
                    }, 20);

                }, 700);
            });
        }

        const giftBoxesGrid = document.getElementById('secret-boxes-grid');
        const game2Result = document.getElementById('game2-result');

        if (giftBoxesGrid) {
            giftBoxesGrid.innerHTML = '';
            const winnerIndex = Math.floor(Math.random() * 4);

            for (let i = 0; i < 4; i++) {
                const box = document.createElement('div');
                box.className = 'glass-card secret-box';
                box.innerHTML = `<span class="box-icon">🎁</span><span>BOX #${i + 1}</span>`;

                box.addEventListener('click', () => {
                    this.audio.playClick();
                    if (i === winnerIndex) {
                        this.audio.playWinFanfare();
                        box.classList.add('correct');
                        box.innerHTML = `<span class="box-icon">🎉</span><span>YOU FOUND IT!</span>`;
                        if (game2Result) {
                            game2Result.innerHTML = '<span class="neon-text-cyan">YOU FOUND THE SECRET GIFT! 🎉 YOU WIN UNLIMITED AURA!</span>';
                        }
                        if (this.confetti) this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 120);
                    } else {
                        this.audio.playPop();
                        box.classList.add('wrong');
                        box.innerHTML = `<span class="box-icon">😂</span><span>NOPE! TRY AGAIN</span>`;
                    }
                });

                giftBoxesGrid.appendChild(box);
            }
        }
    }

    // ==========================================
    // SCENE 12 — GRAND FINALE
    // ==========================================
    setupGrandFinale() {
        const finaleSec = document.getElementById('scene-12');
        if (!finaleSec) return;

        let triggered = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !triggered) {
                    triggered = true;
                    this.triggerFinaleEffects();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(finaleSec);
    }

    triggerFinaleEffects() {
        if (this.fireworks) {
            this.fireworks.launchShow(6000, 200);
        }
        if (this.confetti) {
            this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 200);
            setTimeout(() => this.confetti.cannonSideBurst(), 1000);
            setTimeout(() => this.confetti.cannonSideBurst(), 2500);
        }
        this.audio.playWinFanfare();
    }

    // ==========================================
    // SECRET EASTER EGGS
    // ==========================================
    setupEasterEggs() {
        const heroTitle = document.getElementById('hero-main-title');
        const modal = document.getElementById('easter-egg-modal');
        const closeModal = document.getElementById('easter-egg-close');

        if (heroTitle) {
            heroTitle.addEventListener('click', () => {
                this.easterEggClicks++;
                this.audio.playPop();
                if (this.easterEggClicks >= 5) {
                    this.easterEggClicks = 0;
                    this.audio.playWinFanfare();
                    if (this.confetti) this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 150);
                    if (modal) modal.classList.add('active');
                }
            });
        }

        if (closeModal && modal) {
            closeModal.addEventListener('click', () => modal.classList.remove('active'));
        }
    }

    // ==========================================
    // SHARE & REPLAY LOGIC
    // ==========================================
    setupShareAndReplay() {
        const replayBtn = document.getElementById('replay-exp-btn');
        const shareBtn = document.getElementById('share-exp-btn');
        const toast = document.getElementById('share-toast');

        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                this.audio.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                this.audio.playClick();
                const shareData = {
                    title: `Happy Birthday Naga Bhushan! 🎉`,
                    text: `Check out this incredible birthday surprise experience created for Naga Bhushan!`,
                    url: window.location.href
                };

                if (navigator.share) {
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        console.log("Share canceled", err);
                    }
                } else {
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        if (toast) {
                            toast.classList.add('show');
                            setTimeout(() => toast.classList.remove('show'), 3000);
                        }
                    } catch (err) {
                        alert(`Copy link: ${window.location.href}`);
                    }
                }
            });
        }
    }

    setupCountdown() {
        const countdownBanner = document.getElementById('countdown-banner');
        if (!countdownBanner || !this.config.birthdayDate) return;

        const targetDate = new Date(this.config.birthdayDate).getTime();
        if (isNaN(targetDate)) return;

        countdownBanner.style.display = 'block';

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) {
                countdownBanner.innerHTML = `<div class="countdown-today">IT'S BIRTHDAY TIME! 🎉</div>`;
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            countdownBanner.innerHTML = `
                <div class="countdown-title">THE CELEBRATION STARTS IN</div>
                <div class="countdown-grid">
                    <div class="cd-item"><span>${days}</span><label>Days</label></div>
                    <div class="cd-item"><span>${hours}</span><label>Hours</label></div>
                    <div class="cd-item"><span>${mins}</span><label>Minutes</label></div>
                    <div class="cd-item"><span>${secs}</span><label>Seconds</label></div>
                </div>
            `;
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ==========================================
    // ADMIN PROFILE & LIVE CONTENT MANAGER
    // ==========================================
    setupAdminSystem() {
        const adminBtn = document.getElementById('admin-toggle');
        const pinModal = document.getElementById('admin-pin-modal');
        const dashModal = document.getElementById('admin-dashboard-modal');
        const pinDots = document.querySelectorAll('.pin-dot');
        const pinKeys = document.querySelectorAll('.pin-key-btn');
        const pinCard = document.getElementById('admin-pin-card');
        const pinError = document.getElementById('pin-error-msg');
        const pinCancel = document.getElementById('admin-pin-cancel');
        const dashClose = document.getElementById('admin-dash-close');
        const adminBadge = document.getElementById('admin-status-badge');

        if (!adminBtn) return;

        // Open PIN modal
        adminBtn.addEventListener('click', () => {
            this.audio.playClick();
            if (this.isAdminUnlocked) {
                this.openAdminDashboard();
            } else {
                this.enteredPin = "";
                this.updatePinDots();
                if (pinError) pinError.textContent = "";
                if (pinModal) pinModal.classList.add('active');
            }
        });

        if (adminBadge) {
            adminBadge.addEventListener('click', () => {
                this.openAdminDashboard();
            });
        }

        // Keypad inputs
        pinKeys.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-val');
                this.audio.playClick();

                if (val === 'clear') {
                    this.enteredPin = "";
                } else if (val && val !== 'cancel') {
                    if (this.enteredPin.length < 4) {
                        this.enteredPin += val;
                    }
                }

                this.updatePinDots();

                if (this.enteredPin.length === 4) {
                    this.verifyPin();
                }
            });
        });

        if (pinCancel) {
            pinCancel.addEventListener('click', () => {
                if (pinModal) pinModal.classList.remove('active');
            });
        }

        if (dashClose) {
            dashClose.addEventListener('click', () => {
                if (dashModal) dashModal.classList.remove('active');
            });
        }

        // Admin Dashboard Tab Switching
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        const tabPanes = document.querySelectorAll('.admin-tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab');
                this.audio.playClick();

                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.style.display = 'none');

                btn.classList.add('active');
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.style.display = 'block';

                if (targetId === 'tab-export') {
                    this.populateExportCode();
                }
            });
        });

        this.setupAdminTabFormActions();
    }

    updatePinDots() {
        const dots = document.querySelectorAll('.pin-dot');
        dots.forEach((dot, idx) => {
            if (idx < this.enteredPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    verifyPin() {
        const pinModal = document.getElementById('admin-pin-modal');
        const pinCard = document.getElementById('admin-pin-card');
        const pinError = document.getElementById('pin-error-msg');
        const expectedPin = (this.config.adminPin) ? this.config.adminPin : "1234";

        if (this.enteredPin === expectedPin) {
            this.isAdminUnlocked = true;
            this.audio.playWinFanfare();
            if (pinModal) pinModal.classList.remove('active');

            document.body.classList.add('admin-mode');
            const badge = document.getElementById('admin-status-badge');
            if (badge) badge.classList.add('active');

            if (this.confetti) this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
            this.openAdminDashboard();
        } else {
            this.audio.playPop();
            if (pinCard) {
                pinCard.classList.add('shake');
                setTimeout(() => pinCard.classList.remove('shake'), 400);
            }
            if (pinError) pinError.textContent = "Incorrect PIN! Try default PIN 1234";
            this.enteredPin = "";
            this.updatePinDots();
        }
    }

    openAdminDashboard() {
        const dashModal = document.getElementById('admin-dashboard-modal');
        if (dashModal) {
            this.populateAdminTabItems();
            dashModal.classList.add('active');
        }
    }

    populateAdminTabItems() {
        // Populate Memories List
        const memList = document.getElementById('admin-memories-list');
        if (memList) {
            memList.innerHTML = '';
            (this.config.photos || []).forEach((photo, idx) => {
                const row = document.createElement('div');
                row.className = 'admin-item-row';
                row.innerHTML = `
                    <div class="admin-item-preview">
                        <img src="${photo.url}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23a855f7\\'/></svg>';">
                        <div>
                            <strong>Photo #${idx + 1}</strong>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${photo.caption}</p>
                        </div>
                    </div>
                    <button class="danger-btn" onclick="window.experienceController.deletePhotoItem(${photo.id || idx})">Delete 🗑️</button>
                `;
                memList.appendChild(row);
            });
        }

        // Populate Wishes List
        const wishList = document.getElementById('admin-wishes-list');
        if (wishList) {
            wishList.innerHTML = '';
            (this.config.wishes || []).forEach((w, idx) => {
                const row = document.createElement('div');
                row.className = 'admin-item-row';
                row.innerHTML = `
                    <div class="admin-item-preview">
                        <div>
                            <strong>${w.from} (${w.tag})</strong>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">"${w.message}"</p>
                        </div>
                    </div>
                    <button class="danger-btn" onclick="window.experienceController.deleteWishItem(${w.id || idx})">Delete 🗑️</button>
                `;
                wishList.appendChild(row);
            });
        }

        // Populate Roasts List
        const roastList = document.getElementById('admin-roasts-list');
        if (roastList) {
            roastList.innerHTML = '';
            (this.config.roastEngine.cards || []).forEach((c, idx) => {
                const row = document.createElement('div');
                row.className = 'admin-item-row';
                row.innerHTML = `
                    <div class="admin-item-preview">
                        <span style="font-size: 1.5rem;">${c.icon}</span>
                        <div>
                            <strong>${c.title}</strong>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${c.text}</p>
                        </div>
                    </div>
                    <button class="danger-btn" onclick="window.experienceController.deleteRoastItem(${c.id || idx})">Delete 🗑️</button>
                `;
                roastList.appendChild(row);
            });
        }

        // Populate Timeline List
        const tlList = document.getElementById('admin-timeline-list');
        if (tlList) {
            tlList.innerHTML = '';
            (this.config.timeline || []).forEach((t, idx) => {
                const row = document.createElement('div');
                row.className = 'admin-item-row';
                row.innerHTML = `
                    <div class="admin-item-preview">
                        <span style="font-size: 1.5rem;">${t.icon}</span>
                        <div>
                            <strong>${t.year} — ${t.title}</strong>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${t.description}</p>
                        </div>
                    </div>
                    <button class="danger-btn" onclick="window.experienceController.deleteTimelineItem(${t.id || idx})">Delete 🗑️</button>
                `;
                tlList.appendChild(row);
            });
        }

        // Form Inputs Setup
        const vUrl = document.getElementById('admin-video-url');
        const vTitle = document.getElementById('admin-video-title');
        if (vUrl && this.config.videos && this.config.videos[0]) vUrl.value = this.config.videos[0].url;
        if (vTitle && this.config.videos && this.config.videos[0]) vTitle.value = this.config.videos[0].title;

        const cCandles = document.getElementById('admin-cake-candles');
        const cWish = document.getElementById('admin-cake-wish-text');
        if (cCandles && this.config.cake) cCandles.value = this.config.cake.candleCount || 5;
        if (cWish && this.config.cake) cWish.value = this.config.cake.wishMessage || "";
    }

    setupAdminTabFormActions() {
        // Add Photo Action
        const addPhotoBtn = document.getElementById('admin-add-photo-btn');
        if (addPhotoBtn) {
            addPhotoBtn.onclick = () => {
                const url = document.getElementById('add-photo-url').value.trim();
                const caption = document.getElementById('add-photo-caption').value.trim();
                if (!url || !caption) {
                    alert("Please fill in both Photo URL and Caption!");
                    return;
                }
                const newPhoto = {
                    id: Date.now(),
                    url: url,
                    caption: caption,
                    alt: "Naga Bhushan memory"
                };
                if (!this.config.photos) this.config.photos = [];
                this.config.photos.push(newPhoto);

                this.saveAndApplyChanges("New Photo Added! 📸");
                document.getElementById('add-photo-url').value = "";
                document.getElementById('add-photo-caption').value = "";
            };
        }

        // Add Wish Action
        const addWishBtn = document.getElementById('admin-add-wish-btn');
        if (addWishBtn) {
            addWishBtn.onclick = () => {
                const from = document.getElementById('add-wish-from').value.trim();
                const msg = document.getElementById('add-wish-message').value.trim();
                const tag = document.getElementById('add-wish-tag').value.trim() || "WISH";
                if (!from || !msg) {
                    alert("Please fill in Sender Name and Wish Message!");
                    return;
                }
                const newWish = {
                    id: Date.now(),
                    from: from,
                    message: msg,
                    tag: tag,
                    bg: "gradient-" + (Math.floor(Math.random() * 6) + 1)
                };
                if (!this.config.wishes) this.config.wishes = [];
                this.config.wishes.push(newWish);

                this.saveAndApplyChanges("New Wish Added! 💬");
                document.getElementById('add-wish-from').value = "";
                document.getElementById('add-wish-message').value = "";
                document.getElementById('add-wish-tag').value = "";
            };
        }

        // Save Video Settings
        const saveVideoBtn = document.getElementById('admin-save-video-btn');
        if (saveVideoBtn) {
            saveVideoBtn.onclick = () => {
                const url = document.getElementById('admin-video-url').value.trim();
                const title = document.getElementById('admin-video-title').value.trim();

                if (!this.config.videos) this.config.videos = [{}];
                this.config.videos[0] = { id: 1, url: url, title: title };

                this.saveAndApplyChanges("Video Settings Updated! 🎬");
            };
        }

        // Save Cake Settings
        const saveCakeBtn = document.getElementById('admin-save-cake-btn');
        if (saveCakeBtn) {
            saveCakeBtn.onclick = () => {
                const candles = parseInt(document.getElementById('admin-cake-candles').value) || 5;
                const wish = document.getElementById('admin-cake-wish-text').value.trim();

                if (!this.config.cake) this.config.cake = {};
                this.config.cake.candleCount = candles;
                this.config.cake.wishMessage = wish;

                this.saveAndApplyChanges("Cake Settings Updated! 🎂");
            };
        }

        // Sound Test Buttons
        const tPop = document.getElementById('test-fx-pop');
        const tFan = document.getElementById('test-fx-fanfare');
        const tFire = document.getElementById('test-fx-fireworks');
        const tConf = document.getElementById('test-fx-confetti');

        if (tPop) tPop.onclick = () => this.audio.playPop();
        if (tFan) tFan.onclick = () => this.audio.playWinFanfare();
        if (tFire) tFire.onclick = () => { this.audio.playFireworkPop(); if (this.fireworks) this.fireworks.launchShow(2000, 300); };
        if (tConf) tConf.onclick = () => { if (this.confetti) this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100); };

        // Add Roast Action
        const addRoastBtn = document.getElementById('admin-add-roast-btn');
        if (addRoastBtn) {
            addRoastBtn.onclick = () => {
                const icon = document.getElementById('add-roast-icon').value.trim() || "😎";
                const title = document.getElementById('add-roast-title').value.trim();
                const text = document.getElementById('add-roast-text').value.trim();
                if (!title || !text) {
                    alert("Please fill in Title and Description!");
                    return;
                }
                const newRoast = { id: Date.now(), icon, title, text };
                if (!this.config.roastEngine.cards) this.config.roastEngine.cards = [];
                this.config.roastEngine.cards.push(newRoast);

                this.saveAndApplyChanges("New Roast Added! 🤖");
                document.getElementById('add-roast-title').value = "";
                document.getElementById('add-roast-text').value = "";
            };
        }

        // Add Timeline Action
        const addTlBtn = document.getElementById('admin-add-tl-btn');
        if (addTlBtn) {
            addTlBtn.onclick = () => {
                const year = document.getElementById('add-tl-year').value.trim() || "NEW CHAPTER";
                const title = document.getElementById('add-tl-title').value.trim();
                const desc = document.getElementById('add-tl-desc').value.trim();
                const icon = document.getElementById('add-tl-icon').value.trim() || "✨";
                if (!title || !desc) {
                    alert("Please fill in Title and Description!");
                    return;
                }
                const newTl = { id: Date.now(), year, title, description: desc, icon };
                if (!this.config.timeline) this.config.timeline = [];
                this.config.timeline.push(newTl);

                this.saveAndApplyChanges("New Timeline Chapter Added! 🚀");
                document.getElementById('add-tl-title').value = "";
                document.getElementById('add-tl-desc').value = "";
            };
        }

        // Change PIN
        const savePinBtn = document.getElementById('admin-save-pin-btn');
        if (savePinBtn) {
            savePinBtn.onclick = () => {
                const newPin = document.getElementById('admin-new-pin').value.trim();
                if (newPin && newPin.length === 4) {
                    this.config.adminPin = newPin;
                    this.saveAndApplyChanges("Admin PIN Updated to " + newPin + " 🔑");
                } else {
                    alert("PIN must be exactly 4 digits!");
                }
            };
        }

        // Copy Config Code
        const copyCodeBtn = document.getElementById('admin-copy-config-btn');
        if (copyCodeBtn) {
            copyCodeBtn.onclick = () => {
                const text = document.getElementById('admin-export-textarea').value;
                navigator.clipboard.writeText(text).then(() => {
                    alert("Config JS code copied to clipboard! Paste it into js/config.js");
                });
            };
        }

        // Reset Config
        const resetBtn = document.getElementById('admin-reset-config-btn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                if (confirm("Reset all customizations back to factory defaults?")) {
                    window.resetBirthdayConfig();
                    location.reload();
                }
            };
        }
    }

    deletePhotoItem(id) {
        if (confirm("Delete this photo memory?")) {
            this.config.photos = this.config.photos.filter((p, idx) => (p.id !== undefined ? p.id !== id : idx !== id));
            this.saveAndApplyChanges("Photo Deleted 🗑️");
        }
    }

    deleteWishItem(id) {
        if (confirm("Delete this wish message?")) {
            this.config.wishes = this.config.wishes.filter((w, idx) => (w.id !== undefined ? w.id !== id : idx !== id));
            this.saveAndApplyChanges("Wish Deleted 🗑️");
        }
    }

    deleteRoastItem(id) {
        if (confirm("Delete this roast card?")) {
            this.config.roastEngine.cards = this.config.roastEngine.cards.filter((c, idx) => (c.id !== undefined ? c.id !== id : idx !== id));
            this.saveAndApplyChanges("Roast Card Deleted 🗑️");
        }
    }

    deleteTimelineItem(id) {
        if (confirm("Delete this timeline chapter?")) {
            this.config.timeline = this.config.timeline.filter((t, idx) => (t.id !== undefined ? t.id !== id : idx !== id));
            this.saveAndApplyChanges("Timeline Chapter Deleted 🗑️");
        }
    }

    saveAndApplyChanges(msg = "Changes Saved!") {
        if (window.saveBirthdayConfig) {
            window.saveBirthdayConfig(this.config);
        }
        this.audio.playWinFanfare();

        // Re-render live scenes
        this.renderGallery();
        this.renderWishWall();
        this.renderRoastEngine();
        this.renderTimeline();
        this.renderCake();
        this.populateAdminTabItems();

        const toast = document.getElementById('share-toast');
        if (toast) {
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }
    }

    populateExportCode() {
        const textarea = document.getElementById('admin-export-textarea');
        if (textarea) {
            const cleanObj = { ...this.config };
            textarea.value = `const birthdayConfig = ${JSON.stringify(cleanObj, null, 4)};\n\nwindow.birthdayConfig = birthdayConfig;`;
        }
    }
}

window.ExperienceController = ExperienceController;

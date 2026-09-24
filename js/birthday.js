/**
 * ==========================================================================
 * DYNAMIC GUEST BIRTHDAY EXPERIENCE RENDERER & CONTROLLER
 * ==========================================================================
 * Dynamically renders and updates all 12 scenes based on platform state,
 * handles scene entrance observers, portal warp effects, gift unboxing,
 * candle blowing, letter opening, and games.
 */

class BirthdayExperience {
    constructor() {
        this.data = window.dataService ? window.dataService.getBirthdayData() : {};
        this.currentPhotoIdx = 0;
        this.easterEggCount = 0;

        this.init();
    }

    init() {
        this.renderAllScenes();
        this.setupVideoControls();
        this.setupNavigation();
        this.setupSceneObserver();
        this.setupPortalWarpEffect();

        // Listen for live data updates
        window.addEventListener('birthdayDataChanged', (e) => {
            this.data = e.detail;
            this.renderAllScenes();
        });
    }

    renderAllScenes() {
        if (!this.data) return;

        this.applyProfileData();
        this.applyNavigationVisibility();
        this.renderGiftBoxResult();
        this.renderGallery();
        this.renderVideos();
        this.renderLetter();
        this.renderCake();
        this.renderTimeline();
        this.renderWishWall();
        this.renderRoastEngine();
        this.renderCountdown();

        if (window.miniGamesController) {
            window.miniGamesController.setupBalloonGame(this.data.games ? this.data.games.balloonGame : null);
            window.miniGamesController.setupSecretGiftGame(this.data.games ? this.data.games.giftGame : null);
        }
    }

    applyProfileData() {
        const name = (this.data.profile && this.data.profile.name) ? this.data.profile.name : "NAGA BHUSHAN";
        
        const nameEls = document.querySelectorAll('.dynamic-name');
        nameEls.forEach(el => el.textContent = name);

        const heroTitle = document.getElementById('hero-main-title');
        if (heroTitle) heroTitle.textContent = name;

        const portalName = document.getElementById('portal-name');
        if (portalName) portalName.textContent = name;

        const finaleName = document.getElementById('finale-name');
        if (finaleName) finaleName.innerHTML = `HAPPY BIRTHDAY<br>${name} 🎉`;

        const letterTo = document.getElementById('letter-to-name');
        if (letterTo) letterTo.textContent = `TO: ${name}`;
    }

    applyNavigationVisibility() {
        const nav = this.data.navigation || {};
        const scenes = {
            'scene-01': nav.scene01,
            'scene-02': nav.scene02,
            'scene-03': nav.scene03,
            'scene-04': nav.scene04,
            'scene-05': nav.scene05,
            'scene-06': nav.scene06,
            'scene-07': nav.scene07,
            'scene-08': nav.scene08,
            'scene-09': nav.scene09,
            'scene-10': nav.scene10,
            'scene-11': nav.scene11,
            'scene-12': nav.scene12
        };

        for (let [id, visible] of Object.entries(scenes)) {
            const sec = document.getElementById(id);
            if (sec) {
                if (visible === false) {
                    sec.style.display = 'none';
                } else {
                    sec.style.display = 'flex';
                }
            }
        }
    }

    setupPortalWarpEffect() {
        const portalBtn = document.getElementById('portal-start-btn');
        const portalWrapper = document.getElementById('portal-wrapper');
        const suggestionToast = document.getElementById('portal-suggestion-toast');

        if (portalBtn) {
            portalBtn.onclick = () => {
                if (window.audioManager) {
                    window.audioManager.playClick();
                    window.audioManager.playWinFanfare();
                }

                // Portal ring warp animation
                if (portalWrapper) {
                    portalWrapper.classList.add('warping');
                    setTimeout(() => portalWrapper.classList.remove('warping'), 1200);
                }

                // Fireworks & Confetti burst
                if (window.fireworksEngine) window.fireworksEngine.launchShow(3000, 250);
                if (window.confettiEngine) window.confettiEngine.cannonSideBurst();

                // Show suggestion text
                if (suggestionToast) {
                    suggestionToast.classList.add('show');
                }

                // Smooth scroll to Scene 03
                setTimeout(() => {
                    const giftSec = document.getElementById('scene-03');
                    if (giftSec) giftSec.scrollIntoView({ behavior: 'smooth' });
                }, 600);
            };
        }
    }

    renderGiftBoxResult() {
        const giftPhotoImg = document.getElementById('gift-revealed-photo-img');
        const giftAgeText = document.getElementById('gift-age-text');
        const age = (this.data.profile && this.data.profile.age) ? this.data.profile.age : "21";

        if (giftPhotoImg) {
            const photoUrl = (this.data.gift && this.data.gift.revealedPhoto) ? this.data.gift.revealedPhoto : "assets/photos/gift-photo.jpg";
            giftPhotoImg.src = photoUrl;
        }

        if (giftAgeText) {
            giftAgeText.textContent = `You're officially ${age} years old! 🎉`;
        }
    }

    renderGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        if (!galleryGrid || !this.data.memories) return;

        galleryGrid.innerHTML = '';
        const memories = this.data.memories.filter(m => !m.hidden);

        memories.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'photo-card polaroid-tilt';
            card.setAttribute('data-idx', idx);

            card.innerHTML = `
                <div class="photo-wrapper">
                    <img src="${item.url}" alt="${item.title || 'Memory'}" loading="lazy" 
                         onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'placeholder-photo\\'><span>📸</span><p>YOUR MEMORY GOES HERE</p></div>';">
                </div>
                <div class="photo-caption">${item.caption}</div>
            `;

            card.onclick = () => {
                this.openLightbox(idx, memories);
                if (window.audioManager) window.audioManager.playClick();
            };

            galleryGrid.appendChild(card);
        });
    }

    openLightbox(idx, memoriesList) {
        const lightbox = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (!lightbox || !memoriesList || !memoriesList[idx]) return;
        this.currentPhotoIdx = idx;
        const item = memoriesList[idx];

        if (img) img.src = item.url;
        if (caption) caption.textContent = item.caption;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (closeBtn) closeBtn.onclick = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightbox.onclick = (event) => {
            if (event.target === lightbox && closeBtn) closeBtn.click();
        };

        if (!this.lightboxEscapeHandler) {
            this.lightboxEscapeHandler = (event) => {
                if (event.key === 'Escape' && lightbox.classList.contains('active') && closeBtn) {
                    closeBtn.click();
                }
            };
            document.addEventListener('keydown', this.lightboxEscapeHandler);
        }

        if (prevBtn) prevBtn.onclick = () => {
            this.currentPhotoIdx = (this.currentPhotoIdx - 1 + memoriesList.length) % memoriesList.length;
            this.openLightbox(this.currentPhotoIdx, memoriesList);
        };

        if (nextBtn) nextBtn.onclick = () => {
            this.currentPhotoIdx = (this.currentPhotoIdx + 1) % memoriesList.length;
            this.openLightbox(this.currentPhotoIdx, memoriesList);
        };
    }

    renderVideos() {
        const video = document.getElementById('birthday-video-element');
        const wrapper = document.getElementById('video-wrapper');
        const placeholder = document.getElementById('video-placeholder-card');
        const videoGrid = document.getElementById('video-gallery-grid');
        const videoLightbox = document.getElementById('video-lightbox');
        const lightboxPlayer = document.getElementById('video-lightbox-player');
        const lightboxClose = document.getElementById('video-lightbox-close');
        const lightboxTitle = document.getElementById('video-lightbox-title');
        const videos = (this.data.videos || []).filter(item => !item.hidden && item.url);
        const vData = videos[0] || null;

        if (!video) return;

        if (vData && vData.url) {
            video.src = vData.url;
            if (wrapper) wrapper.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        } else {
            if (wrapper) wrapper.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
        }

        if (!videoGrid) return;
        videoGrid.innerHTML = '';

        const closeVideoLightbox = () => {
            if (lightboxPlayer) {
                lightboxPlayer.pause();
                lightboxPlayer.removeAttribute('src');
                lightboxPlayer.load();
            }
            if (videoLightbox) {
                videoLightbox.classList.remove('active');
                videoLightbox.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
        };

        videos.forEach(item => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'video-memory-card';
            card.innerHTML = `
                <span class="video-memory-thumbnail">
                    <video src="${item.url}" muted preload="metadata" aria-hidden="true"></video>
                    <span class="video-memory-play">▶</span>
                </span>
                <span class="video-memory-copy">
                    <strong>${item.title}</strong>
                    <small>${item.description}</small>
                </span>
            `;
            card.addEventListener('click', () => {
                if (!videoLightbox || !lightboxPlayer) return;
                lightboxPlayer.src = item.url;
                lightboxPlayer.load();
                if (lightboxTitle) lightboxTitle.textContent = item.title;
                videoLightbox.classList.add('active');
                videoLightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
            videoGrid.appendChild(card);
        });

        if (lightboxClose) lightboxClose.onclick = closeVideoLightbox;
        if (videoLightbox) {
            videoLightbox.onclick = event => {
                if (event.target === videoLightbox) closeVideoLightbox();
            };
        }
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && videoLightbox && videoLightbox.classList.contains('active')) {
                closeVideoLightbox();
            }
        });
    }

    setupVideoControls() {
        if (this.videoControlsReady) return;

        const video = document.getElementById('birthday-video-element');
        const wrapper = document.getElementById('video-wrapper');
        const playBtn = document.getElementById('video-custom-play');
        const progressBar = document.querySelector('.video-progress-bar');
        const progressFill = document.getElementById('video-progress-fill');
        const muteBtn = document.getElementById('video-custom-mute');
        const fullscreenBtn = document.getElementById('video-custom-fullscreen');
        const endedMessage = document.getElementById('video-ended-msg');

        if (!video) return;
        this.videoControlsReady = true;

        const updatePlayButton = () => {
            if (playBtn) playBtn.innerHTML = video.paused ? '<span>▶</span>' : '<span>❚❚</span>';
        };

        const updateProgress = () => {
            if (progressFill && video.duration) {
                progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
            }
        };

        if (playBtn) {
            playBtn.onclick = () => {
                if (video.paused) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            };
        }

        video.addEventListener('play', updatePlayButton);
        video.addEventListener('pause', updatePlayButton);
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', updateProgress);
        video.addEventListener('ended', () => {
            updatePlayButton();
            if (endedMessage) endedMessage.classList.add('show');
        });

        if (progressBar) {
            progressBar.addEventListener('click', event => {
                if (!video.duration) return;
                const bounds = progressBar.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
                video.currentTime = ratio * video.duration;
            });
        }

        if (muteBtn) {
            muteBtn.onclick = () => {
                video.muted = !video.muted;
                muteBtn.textContent = video.muted ? '🔇' : '🔊';
            };
        }

        if (fullscreenBtn) {
            fullscreenBtn.onclick = () => {
                if (wrapper && wrapper.requestFullscreen) {
                    wrapper.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                }
            };
        }
    }

    renderLetter() {
        const sal = document.getElementById('letter-salutation-text');
        const body = document.getElementById('letter-body-text');
        const closing = document.getElementById('letter-closing-text');
        const lData = this.data.letter;

        if (lData) {
            if (sal) sal.textContent = lData.salutation || "Dear Naga Bhushan,";
            if (body && lData.paragraphs) {
                body.innerHTML = lData.paragraphs.map(p => `<p>${p}</p>`).join('');
            }
            if (closing) closing.textContent = lData.closing || "— Your Friend";
        }
    }

    renderCake() {
        const container = document.getElementById('candles-row');
        const blowBtn = document.getElementById('blow-candles-btn');
        const cakeMsg = document.getElementById('cake-wish-msg');
        if (!container) return;

        const count = (this.data.cake && this.data.cake.candleCount) ? this.data.cake.candleCount : 5;
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

            if (window.audioManager) window.audioManager.playBlowCandle();

            if (window.confettiEngine) window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.4, 150);
            if (window.fireworksEngine) window.fireworksEngine.launchShow(4000, 250);

            if (cakeMsg) {
                const title = (this.data.cake && this.data.cake.wishSuccessTitle) ? this.data.cake.wishSuccessTitle : "MAKE A WISH, NAGA BHUSHAN ✨";
                const sub = (this.data.cake && this.data.cake.wishSuccessSubtext) ? this.data.cake.wishSuccessSubtext : "Wish successfully launched into the universe 🚀";

                cakeMsg.innerHTML = `
                    <h3 class="neon-text-gold">${title}</h3>
                    <p class="wish-launch-subtext">${sub}</p>
                `;
                cakeMsg.classList.add('show');
            }

            if (blowBtn) blowBtn.style.display = 'none';
        };

        candles.forEach(flame => {
            flame.onclick = () => {
                if (!flame.classList.contains('extinguished')) {
                    flame.classList.add('extinguished');
                    remainingCandles--;
                    if (window.audioManager) window.audioManager.playPop();

                    if (remainingCandles <= 0) {
                        extinguishCandles();
                    }
                }
            };
        });

        if (blowBtn) {
            blowBtn.style.display = 'inline-flex';
            blowBtn.onclick = () => {
                if (window.audioManager) window.audioManager.playClick();
                extinguishCandles();
            };
        }
    }

    renderTimeline() {
        const timelineBox = document.getElementById('timeline-items-container');
        if (!timelineBox || !this.data.timeline) return;

        timelineBox.innerHTML = '';
        this.data.timeline.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = `timeline-card ${idx % 2 === 0 ? 'left' : 'right'}`;
            card.innerHTML = `
                <div class="timeline-badge">${item.icon}</div>
                <div class="glass-card timeline-content">
                    <span class="timeline-year">${item.year}</span>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-desc">${item.description}</p>
                </div>
            `;
            timelineBox.appendChild(card);
        });
    }

    renderWishWall() {
        const wallGrid = document.getElementById('wish-wall-grid');
        if (!wallGrid || !this.data.wishes) return;

        wallGrid.innerHTML = '';
        const wishes = this.data.wishes.filter(w => !w.hidden);

        wishes.forEach(w => {
            const card = document.createElement('div');
            card.className = `glass-card wish-card ${w.style || 'glass'} ${w.bg || ''}`;
            card.innerHTML = `
                <span class="wish-tag">${w.tag}</span>
                <p class="wish-message">"${w.message}"</p>
                <div class="wish-from">— ${w.from} ${w.emoji || ''}</div>
            `;
            wallGrid.appendChild(card);
        });
    }

    renderRoastEngine() {
        const cardsGrid = document.getElementById('roast-cards-grid');
        if (!cardsGrid || !this.data.funnyMode) return;

        cardsGrid.innerHTML = '';
        const cards = this.data.funnyMode.cards || [];

        cards.forEach(c => {
            const card = document.createElement('div');
            card.className = 'glass-card roast-card';
            card.innerHTML = `
                <div class="roast-icon">${c.icon}</div>
                <h3 class="roast-card-title">${c.title}</h3>
                <p class="roast-card-text">${c.text}</p>
            `;
            cardsGrid.appendChild(card);
        });
    }

    renderCountdown() {
        const banner = document.getElementById('countdown-banner');
        if (!banner || !this.data.countdown || !this.data.countdown.enabled) {
            if (banner) banner.style.display = 'none';
            return;
        }

        const dateStr = this.data.countdown.birthdayDate || (this.data.profile ? this.data.profile.birthdayDate : "");
        if (!dateStr) {
            banner.style.display = 'none';
            return;
        }

        banner.style.display = 'block';
    }

    setupNavigation() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    if (window.audioManager) window.audioManager.playClick();
                }
            };
        });
    }

    setupSceneObserver() {
        const scenes = document.querySelectorAll('.experience-scene');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });

        scenes.forEach(s => observer.observe(s));
    }
}

window.BirthdayExperience = BirthdayExperience;

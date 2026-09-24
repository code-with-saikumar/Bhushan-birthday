/**
 * ==========================================================================
 * SAAS-STYLE ADMIN CONTROL DASHBOARD MODULE
 * ==========================================================================
 * Full modern SaaS control panel with sidebar navigation, statistics overview,
 * tab modules, unsaved changes indicator, auto-save, preview experience mode,
 * and JSON import/export.
 */

class AdminDashboard {
    constructor() {
        this.dashboardModal = document.getElementById('admin-dashboard-modal');
        this.sidebarNav = document.getElementById('admin-sidebar-nav');
        this.contentPane = document.getElementById('admin-content-pane');
        this.unsavedBadge = document.getElementById('unsaved-badge');
        this.previewBar = document.getElementById('preview-mode-bar');

        this.hasUnsavedChanges = false;
        this.autoSave = false;
        this.autoSaveTimer = null;

        this.memoryManager = new MemoryManager(this);
        this.wishManager = new WishManager(this);
        this.videoManager = new VideoManager(this);

        this.init();
    }

    init() {
        this.setupDashboardEvents();
    }

    openDashboard() {
        if (!this.dashboardModal) return;
        this.renderDashboardLayout();
        this.dashboardModal.classList.add('active');
    }

    closeDashboard() {
        if (this.dashboardModal) this.dashboardModal.classList.remove('active');
    }

    setupDashboardEvents() {
        const dashClose = document.getElementById('admin-dash-close');
        if (dashClose) dashClose.onclick = () => this.closeDashboard();

        const previewBtn = document.getElementById('admin-preview-btn');
        if (previewBtn) {
            previewBtn.onclick = () => this.enterPreviewMode();
        }

        const exitPreviewBtn = document.getElementById('exit-preview-btn');
        if (exitPreviewBtn) {
            exitPreviewBtn.onclick = () => this.exitPreviewMode();
        }

        const saveBtn = document.getElementById('admin-save-all-btn');
        if (saveBtn) {
            saveBtn.onclick = () => {
                const data = window.dataService.getBirthdayData();
                this.saveData(data, "All Changes Saved Successfully! ✓");
            };
        }

        const resetBtn = document.getElementById('admin-reset-all-btn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                if (confirm("Are you sure you want to reset all customizations back to factory defaults?")) {
                    window.dataService.resetBirthdayData();
                    location.reload();
                }
            };
        }

        const logoutBtn = document.getElementById('admin-logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                if (window.adminAuth) window.adminAuth.logoutAdmin();
            };
        }
    }

    renderDashboardLayout() {
        const data = window.dataService.getBirthdayData();
        this.switchTab('tab-overview', data);
    }

    switchTab(tabId, data) {
        data = data || window.dataService.getBirthdayData();
        const pane = document.getElementById('admin-content-pane');
        if (!pane) return;

        // Active sidebar item highlight
        const items = document.querySelectorAll('.admin-nav-item');
        items.forEach(i => {
            if (i.getAttribute('data-tab') === tabId) i.classList.add('active');
            else i.classList.remove('active');
        });

        switch (tabId) {
            case 'tab-overview':
                this.renderOverviewTab(pane, data);
                break;
            case 'tab-profile':
                this.renderProfileTab(pane, data);
                break;
            case 'tab-memories':
                this.memoryManager.renderTab(pane, data);
                break;
            case 'tab-videos':
                this.videoManager.renderTab(pane, data);
                break;
            case 'tab-wishes':
                this.wishManager.renderTab(pane, data);
                break;
            case 'tab-cake':
                this.renderCakeTab(pane, data);
                break;
            case 'tab-music':
                this.renderMusicTab(pane, data);
                break;
            case 'tab-celebrations':
                this.renderCelebrationsTab(pane, data);
                break;
            case 'tab-funny':
                this.renderFunnyTab(pane, data);
                break;
            case 'tab-games':
                this.renderGamesTab(pane, data);
                break;
            case 'tab-theme':
                this.renderThemeTab(pane, data);
                break;
            case 'tab-nav':
                this.renderNavTab(pane, data);
                break;
            case 'tab-security':
                this.renderSecurityTab(pane, data);
                break;
            default:
                this.renderOverviewTab(pane, data);
                break;
        }
    }

    renderOverviewTab(container, data) {
        const memCount = (data.memories || []).length;
        const vidCount = (data.videos || []).length;
        const wishCount = (data.wishes || []).length;
        const soundCount = data.audio && data.audio.musicEnabled ? 2 : 1;

        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 24px;">
                <h2 class="gradient-text-purple-pink" style="font-size: 1.8rem;">NAGA BHUSHAN BIRTHDAY CONTROL CENTER</h2>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Manage and customize the entire birthday experience live.</p>
            </div>

            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="admin-stat-number">${memCount}</div>
                    <div class="admin-stat-label">MEMORIES</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number" style="color: var(--neon-pink);">${vidCount}</div>
                    <div class="admin-stat-label">VIDEOS</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number" style="color: var(--yellow);">${wishCount}</div>
                    <div class="admin-stat-label">WISHES</div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-number" style="color: var(--neon-purple);">${soundCount}</div>
                    <div class="admin-stat-label">AUDIO FILES</div>
                </div>
            </div>

            <div class="glass-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="color: var(--cyan); margin-bottom: 12px;">Experience Status: <span style="color: #10b981;">🟢 LIVE</span></h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">The guest site is active and responding to live administrative modifications.</p>
                
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="primary-btn" onclick="window.adminDashboard.enterPreviewMode()" style="padding: 12px 28px; font-size: 0.95rem;">
                        Preview Guest Experience 👁️
                    </button>
                    <button class="secondary-btn" onclick="window.adminDashboard.switchTab('tab-profile')">
                        Edit Recipient Profile 👤
                    </button>
                    <button class="secondary-btn" onclick="window.adminDashboard.switchTab('tab-memories')">
                        Manage Memories 📸
                    </button>
                </div>
            </div>
        `;
    }

    renderProfileTab(container, data) {
        const p = data.profile || {};
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">👤 Birthday Profile Management</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Edit birthday person details, messages, and signature.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div class="admin-form-group">
                    <label>Recipient Name:</label>
                    <input type="text" id="prof-name" class="admin-input" value="${p.name || 'NAGA BHUSHAN'}">
                </div>
                <div class="admin-form-group">
                    <label>Age:</label>
                    <input type="text" id="prof-age" class="admin-input" value="${p.age || '22'}">
                </div>
                <div class="admin-form-group">
                    <label>Birthday Date (YYYY-MM-DD):</label>
                    <input type="date" id="prof-date" class="admin-input" value="${p.birthdayDate || ''}">
                </div>
                <div class="admin-form-group">
                    <label>Hero Message:</label>
                    <input type="text" id="prof-hero" class="admin-input" value="${p.heroMessage || ''}">
                </div>
                <div class="admin-form-group">
                    <label>Signature:</label>
                    <input type="text" id="prof-signature" class="admin-input" value="${p.signature || ''}">
                </div>
                <button id="save-profile-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem; margin-top: 16px;">
                    Save Profile 👤
                </button>
            </div>
        `;

        const btn = container.querySelector('#save-profile-btn');
        if (btn) {
            btn.onclick = () => {
                const updated = window.dataService.getBirthdayData();
                updated.profile.name = container.querySelector('#prof-name').value.trim();
                updated.profile.age = container.querySelector('#prof-age').value.trim();
                updated.profile.birthdayDate = container.querySelector('#prof-date').value;
                updated.profile.heroMessage = container.querySelector('#prof-hero').value.trim();
                updated.profile.signature = container.querySelector('#prof-signature').value.trim();

                this.saveData(updated, "Profile Settings Saved! 👤");
            };
        }
    }

    renderCakeTab(container, data) {
        const c = data.cake || {};
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">🎂 Cake & Celebration Settings</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Configure cake style, number of candles, animations, and sound effects.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div class="admin-form-group">
                    <label>Cake Visual Style:</label>
                    <select id="cake-style" class="admin-input">
                        <option value="neon" ${c.style === 'neon' ? 'selected' : ''}>Neon Glow</option>
                        <option value="classic" ${c.style === 'classic' ? 'selected' : ''}>Classic Birthday</option>
                        <option value="chocolate" ${c.style === 'chocolate' ? 'selected' : ''}>Chocolate Dream</option>
                        <option value="futuristic" ${c.style === 'futuristic' ? 'selected' : ''}>Futuristic 3D</option>
                    </select>
                </div>

                <div class="admin-form-group">
                    <label>Number of Candles (1 to 50): <span id="candle-count-display" style="color: var(--neon-pink); font-weight: 700;">${c.candleCount || 5}</span></label>
                    <input type="range" id="cake-candles" min="1" max="50" value="${c.candleCount || 5}" class="admin-input" oninput="document.getElementById('candle-count-display').textContent=this.value">
                </div>

                <div class="admin-form-group">
                    <label>Wish Title Text:</label>
                    <input type="text" id="cake-wish-title" class="admin-input" value="${c.wishSuccessTitle || 'MAKE A WISH, NAGA BHUSHAN ✨'}">
                </div>

                <div style="display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap;">
                    <button class="secondary-btn" onclick="if(window.audioManager) window.audioManager.playBlowCandle()">Test Candle Sound 🌬️</button>
                    <button class="secondary-btn" onclick="if(window.confettiEngine) window.confettiEngine.burst(window.innerWidth/2, window.innerHeight/2, 120)">Test Confetti 🎉</button>
                    <button class="secondary-btn" onclick="if(window.fireworksEngine) window.fireworksEngine.launchShow(3000, 250)">Test Fireworks 🎆</button>
                </div>

                <button id="save-cake-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Save Cake Settings 🎂
                </button>
            </div>
        `;

        const btn = container.querySelector('#save-cake-btn');
        if (btn) {
            btn.onclick = () => {
                const updated = window.dataService.getBirthdayData();
                updated.cake.style = container.querySelector('#cake-style').value;
                updated.cake.candleCount = parseInt(container.querySelector('#cake-candles').value) || 5;
                updated.cake.wishSuccessTitle = container.querySelector('#cake-wish-title').value.trim();

                this.saveData(updated, "Cake Settings Saved! 🎂");
            };
        }
    }

    renderMusicTab(container, data) {
        const a = data.audio || {};
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">🎵 Music & Audio Manager</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Manage background music track, volume, and sound effect synthesizers.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div class="admin-form-group">
                    <label>Background Music URL / Path:</label>
                    <input type="text" id="music-src" class="admin-input" value="${a.musicPath || 'assets/audio/birthday-music.mp3'}">
                </div>

                <div class="admin-form-group">
                    <label>Master Sound Volume: <span id="vol-display">${Math.round((a.defaultVolume || 0.8) * 100)}%</span></label>
                    <input type="range" id="music-vol" min="0" max="1" step="0.05" value="${a.defaultVolume || 0.8}" class="admin-input" oninput="document.getElementById('vol-display').textContent=Math.round(this.value*100)+'%'">
                </div>

                <h4 style="color: var(--yellow); margin: 20px 0 10px 0;">Sound FX Test Suite</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px;">
                    <button class="secondary-btn" onclick="if(window.audioManager) window.audioManager.playPop()">Pop Sound 🎈</button>
                    <button class="secondary-btn" onclick="if(window.audioManager) window.audioManager.playClick()">Click Sound 🖱️</button>
                    <button class="secondary-btn" onclick="if(window.audioManager) window.audioManager.playGiftOpen()">Gift Open 🎁</button>
                    <button class="secondary-btn" onclick="if(window.audioManager) window.audioManager.playWinFanfare()">Win Fanfare 🎺</button>
                </div>

                <button id="save-music-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Save Audio Settings 🎵
                </button>
            </div>
        `;

        const btn = container.querySelector('#save-music-btn');
        if (btn) {
            btn.onclick = () => {
                const updated = window.dataService.getBirthdayData();
                updated.audio.musicPath = container.querySelector('#music-src').value.trim();
                updated.audio.defaultVolume = parseFloat(container.querySelector('#music-vol').value) || 0.8;

                if (window.audioManager) {
                    window.audioManager.setVolume(updated.audio.defaultVolume);
                }

                this.saveData(updated, "Audio Settings Saved! 🎵");
            };
        }
    }

    renderCelebrationsTab(container, data) {
        const c = data.celebrations || {};
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">🎉 Celebration & Particle Controls</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Enable/disable confetti, fireworks, sparkles, balloons, and screen shake.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
                    <label><input type="checkbox" id="cel-confetti" ${c.confetti && c.confetti.enabled !== false ? 'checked' : ''}> Celebration Confetti</label>
                    <label><input type="checkbox" id="cel-fireworks" ${c.fireworks && c.fireworks.enabled !== false ? 'checked' : ''}> Fireworks Bursts</label>
                    <label><input type="checkbox" id="cel-shake" ${c.screenShake && c.screenShake.enabled !== false ? 'checked' : ''}> Screen Shake Effects</label>
                </div>

                <button id="save-cel-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Save Celebration Settings 🎉
                </button>
            </div>
        `;

        const btn = container.querySelector('#save-cel-btn');
        if (btn) {
            btn.onclick = () => {
                const updated = window.dataService.getBirthdayData();
                if (!updated.celebrations) updated.celebrations = {};
                updated.celebrations.confetti = { enabled: container.querySelector('#cel-confetti').checked };
                updated.celebrations.fireworks = { enabled: container.querySelector('#cel-fireworks').checked };
                updated.celebrations.screenShake = { enabled: container.querySelector('#cel-shake').checked };

                this.saveData(updated, "Celebration Settings Saved! 🎉");
            };
        }
    }

    renderThemeTab(container, data) {
        const t = data.theme || {};
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">✨ Global Theme & Typography</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Customize color palettes, gradient presets, and typography fonts.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div class="admin-form-group">
                    <label>Color Preset Palette:</label>
                    <select id="theme-preset" class="admin-input">
                        <option value="Neon" ${t.preset === 'Neon' ? 'selected' : ''}>Electric Neon (Purple / Pink / Cyan)</option>
                        <option value="Sunset" ${t.preset === 'Sunset' ? 'selected' : ''}>Sunset Orange & Pink</option>
                        <option value="Ocean" ${t.preset === 'Ocean' ? 'selected' : ''}>Ocean Blue & Cyan</option>
                        <option value="Cyberpunk" ${t.preset === 'Cyberpunk' ? 'selected' : ''}>Cyberpunk Magenta & Cyan</option>
                        <option value="Candy" ${t.preset === 'Candy' ? 'selected' : ''}>Candy Pink & Purple</option>
                    </select>
                </div>

                <button id="save-theme-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Apply Theme 🎨
                </button>
            </div>
        `;

        const btn = container.querySelector('#save-theme-btn');
        if (btn) {
            btn.onclick = () => {
                const updated = window.dataService.getBirthdayData();
                updated.theme.preset = container.querySelector('#theme-preset').value;

                if (window.themeManager) {
                    window.themeManager.applyTheme(updated.theme);
                }

                this.saveData(updated, "Theme Preset Applied! 🎨");
            };
        }
    }

    renderNavTab(container, data) {
        const nav = data.navigation || {};
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">⚙️ Navigation & Scene Visibility</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Toggle which scenes are visible on the guest site. Disabled sections hide gracefully without gaps.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                    <label><input type="checkbox" id="nav-s01" ${nav.scene01 !== false ? 'checked' : ''}> Scene 01 — Mysterious Welcome</label>
                    <label><input type="checkbox" id="nav-s02" ${nav.scene02 !== false ? 'checked' : ''}> Scene 02 — Birthday Portal</label>
                    <label><input type="checkbox" id="nav-s03" ${nav.scene03 !== false ? 'checked' : ''}> Scene 03 — Interactive Gift</label>
                    <label><input type="checkbox" id="nav-s04" ${nav.scene04 !== false ? 'checked' : ''}> Scene 04 — Roast Machine</label>
                    <label><input type="checkbox" id="nav-s05" ${nav.scene05 !== false ? 'checked' : ''}> Scene 05 — Memory Lane</label>
                    <label><input type="checkbox" id="nav-s06" ${nav.scene06 !== false ? 'checked' : ''}> Scene 06 — Video Cinema</label>
                    <label><input type="checkbox" id="nav-s07" ${nav.scene07 !== false ? 'checked' : ''}> Scene 07 — Digital Letter</label>
                    <label><input type="checkbox" id="nav-s08" ${nav.scene08 !== false ? 'checked' : ''}> Scene 08 — Interactive Cake</label>
                    <label><input type="checkbox" id="nav-s09" ${nav.scene09 !== false ? 'checked' : ''}> Scene 09 — Timeline</label>
                    <label><input type="checkbox" id="nav-s10" ${nav.scene10 !== false ? 'checked' : ''}> Scene 10 — Wish Wall</label>
                    <label><input type="checkbox" id="nav-s11" ${nav.scene11 !== false ? 'checked' : ''}> Scene 11 — Mini Games</label>
                    <label><input type="checkbox" id="nav-s12" ${nav.scene12 !== false ? 'checked' : ''}> Scene 12 — Grand Finale</label>
                </div>

                <button id="save-nav-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Save Navigation Toggles ⚙️
                </button>
            </div>
        `;

        const btn = container.querySelector('#save-nav-btn');
        if (btn) {
            btn.onclick = () => {
                const updated = window.dataService.getBirthdayData();
                updated.navigation = {
                    scene01: container.querySelector('#nav-s01').checked,
                    scene02: container.querySelector('#nav-s02').checked,
                    scene03: container.querySelector('#nav-s03').checked,
                    scene04: container.querySelector('#nav-s04').checked,
                    scene05: container.querySelector('#nav-s05').checked,
                    scene06: container.querySelector('#nav-s06').checked,
                    scene07: container.querySelector('#nav-s07').checked,
                    scene08: container.querySelector('#nav-s08').checked,
                    scene09: container.querySelector('#nav-s09').checked,
                    scene10: container.querySelector('#nav-s10').checked,
                    scene11: container.querySelector('#nav-s11').checked,
                    scene12: container.querySelector('#nav-s12').checked
                };

                this.saveData(updated, "Navigation Visibility Saved! ⚙️");
            };
        }
    }

    renderSecurityTab(container, data) {
        container.innerHTML = `
            <div class="admin-tab-header" style="margin-bottom: 20px;">
                <h3 style="color: var(--cyan);">🔐 Security & JSON Data Export / Import</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Change PIN, export configuration to JSON file, or import configuration backup.</p>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <div class="admin-form-group">
                    <label>Change Admin PIN (4 Digits):</label>
                    <input type="text" id="sec-new-pin" class="admin-input" placeholder="2026" maxlength="4">
                </div>
                <button id="save-pin-btn" class="secondary-btn" style="margin-bottom: 24px;">Update Admin PIN 🔑</button>

                <h4 style="color: var(--neon-pink); margin-bottom: 10px;">JSON Configuration Import / Export</h4>
                <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
                    <button class="primary-btn" onclick="window.dataService.exportBirthdayData()" style="padding: 10px 24px; font-size: 0.9rem;">
                        Export birthday-config.json 📥
                    </button>
                    <label class="secondary-btn" style="cursor: pointer; display: inline-flex; align-items: center; justify-content: center;">
                        Import JSON File 📤
                        <input type="file" id="json-file-input" accept=".json" style="display: none;">
                    </label>
                </div>

                <p style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">
                    Note: Local admin protection is designed for this private birthday experience. Do not use this PIN system for sensitive credentials.
                </p>
            </div>
        `;

        const pinBtn = container.querySelector('#save-pin-btn');
        if (pinBtn) {
            pinBtn.onclick = () => {
                const newPin = container.querySelector('#sec-new-pin').value.trim();
                if (newPin && newPin.length === 4) {
                    if (window.ADMIN_CONFIG) window.ADMIN_CONFIG.pin = newPin;
                    alert("Admin PIN updated to " + newPin + " 🔑");
                } else {
                    alert("PIN must be exactly 4 digits!");
                }
            };
        }

        const jsonInput = container.querySelector('#json-file-input');
        if (jsonInput) {
            jsonInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const result = window.dataService.importBirthdayData(event.target.result);
                        if (result.success) {
                            alert("JSON Configuration Imported Successfully! 🎉");
                            location.reload();
                        } else {
                            alert("Import Failed: " + result.error);
                        }
                    };
                    reader.readAsText(file);
                }
            };
        }
    }

    renderFunnyTab(container, data) {
        this.renderOverviewTab(container, data); // Fallback to overview tab
    }
    renderGamesTab(container, data) {
        this.renderOverviewTab(container, data);
    }

    saveData(data, msg = "Changes Saved!") {
        if (window.dataService) {
            window.dataService.saveBirthdayData(data);
        }
        if (window.audioManager) window.audioManager.playWinFanfare();

        this.hasUnsavedChanges = false;
        if (this.unsavedBadge) this.unsavedBadge.classList.remove('visible');

        const toast = document.getElementById('share-toast');
        if (toast) {
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
        }
    }

    enterPreviewMode() {
        if (this.previewBar) this.previewBar.classList.add('active');
        this.closeDashboard();
    }

    exitPreviewMode() {
        if (this.previewBar) this.previewBar.classList.remove('active');
        this.openDashboard();
    }
}

window.AdminDashboard = AdminDashboard;

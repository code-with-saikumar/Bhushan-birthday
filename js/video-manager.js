/**
 * ==========================================================================
 * VIDEO MANAGEMENT MODULE
 * ==========================================================================
 * Controls birthday video source (file / URL), controls toggles, title,
 * autoplay/mute options, and live preview player.
 */

class VideoManager {
    constructor(adminDashboard) {
        this.dashboard = adminDashboard;
    }

    renderTab(container, data) {
        if (!container) return;

        const vData = (data.videos && data.videos[0]) ? data.videos[0] : {};
        container.innerHTML = `
            <div class="admin-tab-header">
                <h3 style="color: var(--cyan); margin-bottom: 8px;">🎬 Video Cinema Manager</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Configure your birthday video source, title, description, and player settings.</p>
            </div>

            <div class="glass-card" style="padding: 24px; margin-top: 16px;">
                <div class="admin-form-group">
                    <label>Video File URL or Local Path (e.g. assets/videos/birthday-video.mp4):</label>
                    <input type="text" id="video-src-input" class="admin-input" value="${vData.url || 'assets/videos/birthday-video.mp4'}">
                </div>

                <div class="admin-form-group">
                    <label>Video Title:</label>
                    <input type="text" id="video-title-input" class="admin-input" value="${vData.title || 'A Special Video Message For You 🎬'}">
                </div>

                <div class="admin-form-group">
                    <label>Video Caption / Description:</label>
                    <input type="text" id="video-desc-input" class="admin-input" value="${vData.description || 'Some memories are better moving. Turn up your volume!'}">
                </div>

                <div style="display: flex; gap: 20px; margin: 16px 0;">
                    <label><input type="checkbox" id="video-controls-check" ${vData.controls !== false ? 'checked' : ''}> Show Custom Controls</label>
                    <label><input type="checkbox" id="video-muted-check" ${vData.muted ? 'checked' : ''}> Muted by Default</label>
                </div>

                <button id="save-video-submit-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Save Video Settings 🎬
                </button>
            </div>
        `;

        this.bindEvents(container);
    }

    bindEvents(container) {
        const saveBtn = container.querySelector('#save-video-submit-btn');
        if (saveBtn) {
            saveBtn.onclick = () => {
                const url = container.querySelector('#video-src-input').value.trim();
                const title = container.querySelector('#video-title-input').value.trim();
                const desc = container.querySelector('#video-desc-input').value.trim();
                const controls = container.querySelector('#video-controls-check').checked;
                const muted = container.querySelector('#video-muted-check').checked;

                const data = window.dataService.getBirthdayData();
                if (!data.videos) data.videos = [];

                data.videos[0] = {
                    id: 1,
                    url: url,
                    title: title,
                    description: desc,
                    controls: controls,
                    muted: muted,
                    hidden: false
                };

                this.dashboard.saveData(data, "Video Settings Saved! 🎬");
            };
        }
    }
}

window.VideoManager = VideoManager;

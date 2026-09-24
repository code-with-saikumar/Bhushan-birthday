/**
 * ==========================================================================
 * WISH WALL MANAGEMENT MODULE
 * ==========================================================================
 * Manages Wish Wall cards, styles (glass, polaroid, handwritten, neon, chat bubble),
 * live previews, and reordering.
 */

class WishManager {
    constructor(adminDashboard) {
        this.dashboard = adminDashboard;
    }

    renderTab(container, data) {
        if (!container) return;

        const wishes = data.wishes || [];
        container.innerHTML = `
            <div class="admin-tab-header">
                <h3 style="color: var(--cyan); margin-bottom: 8px;">💬 Wish Wall Manager</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Add, edit, style, or remove birthday wishes from friends.</p>
            </div>

            <div id="wish-items-list" class="admin-items-list" style="margin: 20px 0;">
                ${wishes.map((w, idx) => `
                    <div class="admin-item-row" data-id="${w.id || idx}">
                        <div class="admin-item-preview">
                            <span style="font-size: 1.5rem;">${w.emoji || '💬'}</span>
                            <div>
                                <strong>${w.from} (${w.tag || 'WISH'}) — <span style="color: var(--neon-pink);">${w.style || 'glass'}</span></strong>
                                <p style="font-size: 0.8rem; color: var(--text-muted);">"${w.message}"</p>
                            </div>
                        </div>
                        <button class="danger-btn" onclick="window.adminDashboard.wishManager.deleteWish(${w.id || idx})">Delete 🗑️</button>
                    </div>
                `).join('')}
            </div>

            <div class="glass-card" style="padding: 24px;">
                <h4 style="color: var(--neon-pink); margin-bottom: 16px;">+ Add New Wish Card</h4>
                
                <div class="admin-form-group">
                    <label>Sender Name (e.g. Rahul / Squad):</label>
                    <input type="text" id="wish-from-input" class="admin-input" placeholder="Sender Name">
                </div>

                <div class="admin-form-group">
                    <label>Wish Message:</label>
                    <textarea id="wish-msg-input" class="admin-input" rows="3" placeholder="Happy Birthday bro! Stay awesome!"></textarea>
                </div>

                <div class="admin-form-group">
                    <label>Tag / Category Badge:</label>
                    <input type="text" id="wish-tag-input" class="admin-input" placeholder="BEST WISHES">
                </div>

                <div class="admin-form-group">
                    <label>Emoji Icon:</label>
                    <input type="text" id="wish-emoji-input" class="admin-input" placeholder="🎉">
                </div>

                <div class="admin-form-group">
                    <label>Card Visual Style:</label>
                    <select id="wish-style-input" class="admin-input">
                        <option value="glass">Glassmorphism</option>
                        <option value="polaroid">Polaroid Style</option>
                        <option value="handwritten">Handwritten Note</option>
                        <option value="neon">Neon Glow Card</option>
                        <option value="chat">Chat Bubble</option>
                    </select>
                </div>

                <button id="add-wish-submit-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Add Wish To Wall 💬
                </button>
            </div>
        `;

        this.bindEvents(container);
    }

    bindEvents(container) {
        const addBtn = container.querySelector('#add-wish-submit-btn');
        if (addBtn) {
            addBtn.onclick = () => {
                const from = container.querySelector('#wish-from-input').value.trim();
                const msg = container.querySelector('#wish-msg-input').value.trim();
                const tag = container.querySelector('#wish-tag-input').value.trim() || "WISH";
                const emoji = container.querySelector('#wish-emoji-input').value.trim() || "🎉";
                const style = container.querySelector('#wish-style-input').value;

                if (!from || !msg) {
                    alert("Please enter Sender Name and Wish Message!");
                    return;
                }

                const data = window.dataService.getBirthdayData();
                if (!data.wishes) data.wishes = [];

                data.wishes.push({
                    id: Date.now(),
                    from: from,
                    message: msg,
                    tag: tag,
                    emoji: emoji,
                    style: style,
                    bg: "gradient-" + (Math.floor(Math.random() * 6) + 1)
                });

                this.dashboard.saveData(data, "New Wish Added! 💬");
            };
        }
    }

    deleteWish(id) {
        if (confirm("Delete this wish message?")) {
            const data = window.dataService.getBirthdayData();
            data.wishes = data.wishes.filter((w, idx) => (w.id !== undefined ? w.id !== id : idx !== id));
            this.dashboard.saveData(data, "Wish Deleted 🗑️");
        }
    }
}

window.WishManager = WishManager;

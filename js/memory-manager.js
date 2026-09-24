/**
 * ==========================================================================
 * MEMORY & PHOTO MANAGEMENT MODULE
 * ==========================================================================
 * Manages Memories & Photo Gallery items: CRUD operations, drag/reordering,
 * file upload with client-side HTML5 canvas image compression.
 */

class MemoryManager {
    constructor(adminDashboard) {
        this.dashboard = adminDashboard;
    }

    renderTab(container, data) {
        if (!container) return;

        const memories = data.memories || [];
        container.innerHTML = `
            <div class="admin-tab-header">
                <h3 style="color: var(--cyan); margin-bottom: 8px;">📸 Memories & Photos Manager</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Add, edit, reorder, or delete memory photos. Uploaded images are compressed automatically.</p>
            </div>

            <div id="memory-items-list" class="admin-items-list" style="margin: 20px 0;">
                ${memories.map((m, idx) => `
                    <div class="admin-item-row" data-id="${m.id || idx}">
                        <div class="admin-item-preview">
                            <img src="${m.url}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'40\\' height=\\'40\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23a855f7\\'/></svg>';">
                            <div>
                                <strong>${m.title || `Memory #${idx + 1}`}</strong>
                                <p style="font-size: 0.8rem; color: var(--text-muted);">${m.caption}</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <button class="admin-action-btn" onclick="window.adminDashboard.memoryManager.moveMemory(${idx}, -1)">▲</button>
                            <button class="admin-action-btn" onclick="window.adminDashboard.memoryManager.moveMemory(${idx}, 1)">▼</button>
                            <button class="danger-btn" onclick="window.adminDashboard.memoryManager.deleteMemory(${m.id || idx})">Delete 🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="glass-card" style="padding: 24px;">
                <h4 style="color: var(--neon-pink); margin-bottom: 16px;">+ Add New Memory Photo</h4>
                
                <div class="admin-form-group">
                    <label>Upload Image File (Compressed Automatically):</label>
                    <input type="file" id="mem-file-input" accept="image/*" class="admin-input">
                </div>

                <div class="admin-form-group">
                    <label>Or Enter Image URL:</label>
                    <input type="text" id="mem-url-input" class="admin-input" placeholder="assets/photos/photo-01.jpg or https://...">
                </div>

                <div class="admin-form-group">
                    <label>Memory Title:</label>
                    <input type="text" id="mem-title-input" class="admin-input" placeholder="Core Memory">
                </div>

                <div class="admin-form-group">
                    <label>Caption Text:</label>
                    <input type="text" id="mem-caption-input" class="admin-input" placeholder="Another day... another memory.">
                </div>

                <button id="add-memory-submit-btn" class="primary-btn" style="padding: 12px 28px; font-size: 0.95rem;">
                    Add To Memories 📸
                </button>
            </div>
        `;

        this.bindEvents(container);
    }

    bindEvents(container) {
        const fileInput = container.querySelector('#mem-file-input');
        const urlInput = container.querySelector('#mem-url-input');
        const addBtn = container.querySelector('#add-memory-submit-btn');

        if (fileInput) {
            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try {
                        const compressedDataUrl = await window.dataService.compressImage(file);
                        urlInput.value = compressedDataUrl;
                    } catch (err) {
                        alert("Error compressing image: " + err.message);
                    }
                }
            };
        }

        if (addBtn) {
            addBtn.onclick = () => {
                const url = urlInput.value.trim();
                const title = container.querySelector('#mem-title-input').value.trim() || "Core Memory";
                const caption = container.querySelector('#mem-caption-input').value.trim();

                if (!url || !caption) {
                    alert("Please select/enter an image and provide a caption!");
                    return;
                }

                const data = window.dataService.getBirthdayData();
                if (!data.memories) data.memories = [];

                data.memories.push({
                    id: Date.now(),
                    title: title,
                    caption: caption,
                    url: url,
                    date: new Date().getFullYear().toString(),
                    category: "General"
                });

                this.dashboard.saveData(data, "New Memory Added! 📸");
            };
        }
    }

    moveMemory(index, direction) {
        const data = window.dataService.getBirthdayData();
        const target = index + direction;
        if (target < 0 || target >= data.memories.length) return;

        const temp = data.memories[index];
        data.memories[index] = data.memories[target];
        data.memories[target] = temp;

        this.dashboard.saveData(data, "Memory Order Updated 🔄");
    }

    deleteMemory(id) {
        if (confirm("Are you sure you want to delete this memory?")) {
            const data = window.dataService.getBirthdayData();
            data.memories = data.memories.filter((m, idx) => (m.id !== undefined ? m.id !== id : idx !== id));
            this.dashboard.saveData(data, "Memory Deleted 🗑️");
        }
    }
}

window.MemoryManager = MemoryManager;

/**
 * ==========================================================================
 * DATA SERVICE LAYER (FIREBASE-READY ABSTRACTION)
 * ==========================================================================
 * Centralized data management layer handling local storage persistence,
 * image compression, JSON import/export, and future backend integration.
 */

class DataService {
    constructor() {
        this.STORAGE_KEY = 'naga_birthday_platform_data';
    }

    /**
     * Retrieve the current platform state data
     */
    getBirthdayData() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return this.mergeWithDefaults(parsed);
            }
        } catch (e) {
            console.error("DataService: Error loading data from localStorage:", e);
        }
        return JSON.parse(JSON.stringify(window.defaultBirthdayData));
    }

    /**
     * Deep merge saved data with default schema to prevent missing fields
     */
    mergeWithDefaults(saved) {
        const defaults = window.defaultBirthdayData;
        const merged = { ...defaults, ...saved };

        // Ensure key objects are merged correctly
        merged.profile = { ...defaults.profile, ...(saved.profile || {}) };
        merged.intro = { ...defaults.intro, ...(saved.intro || {}) };
        merged.funnyMode = { ...defaults.funnyMode, ...(saved.funnyMode || {}) };
        merged.cake = { ...defaults.cake, ...(saved.cake || {}) };
        merged.audio = { ...defaults.audio, ...(saved.audio || {}) };
        merged.celebrations = { ...defaults.celebrations, ...(saved.celebrations || {}) };
        merged.games = { ...defaults.games, ...(saved.games || {}) };
        merged.countdown = { ...defaults.countdown, ...(saved.countdown || {}) };
        merged.navigation = { ...defaults.navigation, ...(saved.navigation || {}) };
        merged.theme = { ...defaults.theme, ...(saved.theme || {}) };
        merged.effects = { ...defaults.effects, ...(saved.effects || {}) };

        // Replace old placeholder paths with the bundled memory photos.
        if (Array.isArray(saved.memories)) {
            const hasPlaceholderPath = saved.memories.some(memory =>
                typeof memory.url === 'string' && /assets\/photos\/photo-\d+\.jpg$/.test(memory.url)
            );
            merged.memories = hasPlaceholderPath ? defaults.memories : saved.memories;
        }

        if (Array.isArray(saved.videos)) {
            const hasIncompleteVideoSet = defaults.videos.some(defaultVideo =>
                !saved.videos.some(savedVideo => savedVideo.url === defaultVideo.url)
            );
            merged.videos = hasIncompleteVideoSet ? defaults.videos : saved.videos;
        }

        return merged;
    }

    /**
     * Save updated platform state data
     */
    saveBirthdayData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('birthdayDataChanged', { detail: data }));
            return true;
        } catch (e) {
            console.error("DataService: Error saving data to localStorage:", e);
            if (e.name === 'QuotaExceededError') {
                alert("Storage limit reached! Please compress uploaded images or delete old media items.");
            }
            return false;
        }
    }

    /**
     * Reset platform data to factory defaults
     */
    resetBirthdayData() {
        localStorage.removeItem(this.STORAGE_KEY);
        const defaults = JSON.parse(JSON.stringify(window.defaultBirthdayData));
        window.dispatchEvent(new CustomEvent('birthdayDataChanged', { detail: defaults }));
        return defaults;
    }

    /**
     * Export platform configuration to JSON file
     */
    exportBirthdayData() {
        const data = this.getBirthdayData();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `naga-bhushan-birthday-config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import platform configuration from JSON string
     */
    importBirthdayData(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error("Invalid JSON structure");
            }
            const merged = this.mergeWithDefaults(parsed);
            this.saveBirthdayData(merged);
            return { success: true, data: merged };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Client-side Image Compressor (Resizes & converts file to compact Data URL)
     */
    compressImage(file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                return reject(new Error("File is not a valid image"));
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedDataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }
}

window.dataService = new DataService();

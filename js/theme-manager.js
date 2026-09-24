/**
 * ==========================================================================
 * DYNAMIC THEME MANAGER
 * ==========================================================================
 * Updates root CSS custom properties (colors, font presets, glow intensity)
 * dynamically when altered in the Admin Control Dashboard.
 */

class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('birthdayDataChanged', (e) => {
            if (e.detail && e.detail.theme) {
                this.applyTheme(e.detail.theme);
            }
        });
    }

    applyTheme(theme) {
        if (!theme) return;
        const root = document.documentElement;

        if (theme.primaryColor) root.style.setProperty('--neon-purple', theme.primaryColor);
        if (theme.secondaryColor) root.style.setProperty('--neon-pink', theme.secondaryColor);
        if (theme.accentColor) root.style.setProperty('--cyan', theme.accentColor);
        if (theme.bgColor) root.style.setProperty('--bg-dark', theme.bgColor);
        if (theme.borderRadius) root.style.setProperty('--radius-lg', theme.borderRadius);

        // Font Presets
        if (theme.headingFont) {
            root.style.setProperty('--font-heading', `'${theme.headingFont}', sans-serif`);
        }
        if (theme.bodyFont) {
            root.style.setProperty('--font-body', `'${theme.bodyFont}', sans-serif`);
        }

        // Preset Colors
        if (theme.preset) {
            this.applyPreset(theme.preset);
        }
    }

    applyPreset(presetName) {
        const root = document.documentElement;
        switch (presetName.toLowerCase()) {
            case 'sunset':
                root.style.setProperty('--neon-purple', '#f97316');
                root.style.setProperty('--neon-pink', '#f43f5e');
                root.style.setProperty('--cyan', '#eab308');
                break;
            case 'ocean':
                root.style.setProperty('--neon-purple', '#0284c7');
                root.style.setProperty('--neon-pink', '#06b6d4');
                root.style.setProperty('--cyan', '#38bdf8');
                break;
            case 'cyberpunk':
                root.style.setProperty('--neon-purple', '#d946ef');
                root.style.setProperty('--neon-pink', '#f43f5e');
                root.style.setProperty('--cyan', '#22d3ee');
                break;
            case 'candy':
                root.style.setProperty('--neon-purple', '#ec4899');
                root.style.setProperty('--neon-pink', '#a855f7');
                root.style.setProperty('--cyan', '#f472b6');
                break;
            default: // Neon Default
                root.style.setProperty('--neon-purple', '#a855f7');
                root.style.setProperty('--neon-pink', '#ec4899');
                root.style.setProperty('--cyan', '#06b6d4');
                break;
        }
    }
}

window.themeManager = new ThemeManager();

/**
 * ==========================================================================
 * ADMIN AUTHENTICATION & PIN SECURITY MODULE
 * ==========================================================================
 * Controls the subtle hidden admin profile icon, 4-digit PIN entry modal,
 * auto-focus input sequence, lockout cooldown timer, and sessionStorage auth.
 */

class AdminAuth {
    constructor() {
        this.pinInputs = document.querySelectorAll('.pin-digit-input');
        this.pinModal = document.getElementById('admin-pin-modal');
        this.adminIcon = document.getElementById('admin-profile-trigger');
        this.errorMsg = document.getElementById('pin-error-msg');
        this.pinCard = document.getElementById('admin-pin-card');

        this.failedAttempts = 0;
        this.isLockedOut = false;
        this.lockoutTimer = null;
        this.inactivityTimer = null;

        this.init();
    }

    init() {
        this.setupHiddenProfileIcon();
        this.setupPinInputListeners();
        this.setupKeypad();
        this.checkExistingSession();
    }

    setupHiddenProfileIcon() {
        if (!this.adminIcon) return;

        // Subtle initial opacity & fade after 10s of inactivity
        this.resetInactivityFade();
        window.addEventListener('mousemove', () => this.resetInactivityFade());

        this.adminIcon.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.audioManager) window.audioManager.playClick();

            if (this.isAuthenticated()) {
                if (window.adminDashboard) window.adminDashboard.openDashboard();
            } else {
                this.openPinModal();
            }
        });
    }

    resetInactivityFade() {
        if (!this.adminIcon) return;
        this.adminIcon.style.opacity = '0.35';
        clearTimeout(this.inactivityTimer);

        this.inactivityTimer = setTimeout(() => {
            if (!document.body.classList.contains('admin-mode')) {
                this.adminIcon.style.opacity = '0.15';
            }
        }, 10000);
    }

    openPinModal() {
        if (!this.pinModal) return;
        this.clearPinInputs();
        if (this.errorMsg) this.errorMsg.textContent = "";

        this.pinModal.classList.add('active');
        setTimeout(() => {
            if (this.pinInputs[0] && !this.isLockedOut) {
                this.pinInputs[0].focus();
            }
        }, 300);
    }

    closePinModal() {
        if (this.pinModal) this.pinModal.classList.remove('active');
    }

    setupPinInputListeners() {
        if (!this.pinInputs.length) return;

        this.pinInputs.forEach((input, index) => {
            // Numeric filtering & auto-advance
            input.addEventListener('input', (e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = val ? val.slice(-1) : '';

                if (e.target.value && index < 3) {
                    this.pinInputs[index + 1].focus();
                }

                this.checkCompletePin();
            });

            // Backspace navigation
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    this.pinInputs[index - 1].focus();
                }
                if (e.key === 'Escape') {
                    this.closePinModal();
                }
            });

            // Paste 4 digits support
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
                const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 4);

                if (digits.length === 4) {
                    digits.split('').forEach((d, i) => {
                        if (this.pinInputs[i]) this.pinInputs[i].value = d;
                    });
                    this.pinInputs[3].focus();
                    this.checkCompletePin();
                }
            });
        });

        const cancelBtn = document.getElementById('admin-pin-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closePinModal());
        }
    }

    setupKeypad() {
        const keys = document.querySelectorAll('.pin-key-btn');
        keys.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isLockedOut) return;
                const val = btn.getAttribute('data-val');
                if (window.audioManager) window.audioManager.playClick();

                if (val === 'clear') {
                    this.clearPinInputs();
                    if (this.pinInputs[0]) this.pinInputs[0].focus();
                } else if (val && val !== 'cancel') {
                    for (let i = 0; i < 4; i++) {
                        if (!this.pinInputs[i].value) {
                            this.pinInputs[i].value = val;
                            if (i < 3) this.pinInputs[i + 1].focus();
                            break;
                        }
                    }
                    this.checkCompletePin();
                }
            });
        });
    }

    clearPinInputs() {
        this.pinInputs.forEach(input => input.value = '');
    }

    getEnteredPin() {
        let pin = '';
        this.pinInputs.forEach(input => pin += input.value);
        return pin;
    }

    checkCompletePin() {
        const pin = this.getEnteredPin();
        if (pin.length === 4 && !this.isLockedOut) {
            this.verifyPin(pin);
        }
    }

    verifyPin(enteredPin) {
        const expectedPin = (window.ADMIN_CONFIG && window.ADMIN_CONFIG.pin) ? window.ADMIN_CONFIG.pin : "2026";

        if (enteredPin === expectedPin) {
            this.failedAttempts = 0;
            if (window.audioManager) window.audioManager.playWinFanfare();

            // Store session authentication
            sessionStorage.setItem("birthdayAdminAuthenticated", "true");
            document.body.classList.add('admin-mode');

            if (this.errorMsg) {
                this.errorMsg.style.color = '#10b981';
                this.errorMsg.textContent = "ACCESS GRANTED ✓ Unlocking Dashboard...";
            }

            setTimeout(() => {
                this.closePinModal();
                if (window.adminDashboard) window.adminDashboard.openDashboard();
            }, 600);
        } else {
            this.failedAttempts++;
            if (window.audioManager) window.audioManager.playPop();

            if (this.pinCard) {
                this.pinCard.classList.add('shake');
                setTimeout(() => this.pinCard.classList.remove('shake'), 400);
            }

            this.clearPinInputs();
            if (this.pinInputs[0]) this.pinInputs[0].focus();

            if (this.failedAttempts >= (window.ADMIN_CONFIG.maxAttempts || 3)) {
                this.triggerLockoutCooldown();
            } else {
                if (this.errorMsg) {
                    this.errorMsg.style.color = '#f43f5e';
                    this.errorMsg.textContent = `Incorrect PIN! Attempts remaining: ${window.ADMIN_CONFIG.maxAttempts - this.failedAttempts}`;
                }
            }
        }
    }

    triggerLockoutCooldown() {
        this.isLockedOut = true;
        let secondsLeft = window.ADMIN_CONFIG.cooldownSeconds || 15;
        this.pinInputs.forEach(input => input.disabled = true);

        if (this.errorMsg) {
            this.errorMsg.style.color = '#f43f5e';
            this.errorMsg.textContent = `Too many attempts! Please wait ${secondsLeft}s...`;
        }

        this.lockoutTimer = setInterval(() => {
            secondsLeft--;
            if (secondsLeft <= 0) {
                clearInterval(this.lockoutTimer);
                this.isLockedOut = false;
                this.failedAttempts = 0;
                this.pinInputs.forEach(input => input.disabled = false);
                if (this.errorMsg) this.errorMsg.textContent = "";
                if (this.pinInputs[0]) this.pinInputs[0].focus();
            } else {
                if (this.errorMsg) {
                    this.errorMsg.textContent = `Too many attempts! Please wait ${secondsLeft}s...`;
                }
            }
        }, 1000);
    }

    isAuthenticated() {
        return sessionStorage.getItem("birthdayAdminAuthenticated") === "true";
    }

    checkExistingSession() {
        if (this.isAuthenticated()) {
            document.body.classList.add('admin-mode');
        }
    }

    logoutAdmin() {
        sessionStorage.removeItem("birthdayAdminAuthenticated");
        document.body.classList.remove('admin-mode');
        if (window.adminDashboard) window.adminDashboard.closeDashboard();
        if (window.birthdayApp) window.birthdayApp.renderGuestSite();
        alert("Logged out of Birthday Control Center.");
    }
}

window.AdminAuth = AdminAuth;

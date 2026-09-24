/**
 * ==========================================================================
 * ARCADE MINI GAMES MODULE
 * ==========================================================================
 * Manages Balloon Pop/Catch arcade game and Secret Gift Box picker game.
 */

class MiniGamesController {
    constructor() {
        this.balloonScore = 0;
    }

    setupBalloonGame(gameConfig) {
        const balloonArea = document.getElementById('balloon-game-area');
        const scoreEl = document.getElementById('balloon-score');
        const startBtn = document.getElementById('start-balloon-game-btn');
        const gameWin = document.getElementById('game1-win-msg');

        if (!startBtn || !balloonArea) return;

        const targetScore = (gameConfig && gameConfig.targetScore) ? gameConfig.targetScore : 10;
        const winMsg = (gameConfig && gameConfig.winMsg) ? gameConfig.winMsg : "YOU WIN! CELEBRATION UNLOCKED! 🎉";

        startBtn.onclick = () => {
            if (window.audioManager) window.audioManager.playClick();
            this.balloonScore = 0;
            if (scoreEl) scoreEl.textContent = '0';
            if (gameWin) {
                gameWin.style.display = 'none';
                gameWin.textContent = winMsg;
            }
            balloonArea.innerHTML = '';
            startBtn.textContent = `POP ${targetScore} BALLOONS! 🎈`;

            const spawnInterval = setInterval(() => {
                if (this.balloonScore >= targetScore) {
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

                b.onclick = () => {
                    if (window.audioManager) window.audioManager.playPop();
                    b.remove();
                    this.balloonScore++;
                    if (scoreEl) scoreEl.textContent = this.balloonScore;

                    if (this.balloonScore >= targetScore) {
                        if (window.audioManager) window.audioManager.playWinFanfare();
                        if (window.confettiEngine) window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
                        if (gameWin) gameWin.style.display = 'block';
                        startBtn.textContent = 'PLAY AGAIN 🔄';
                    }
                };

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
        };
    }

    setupSecretGiftGame(gameConfig) {
        const giftBoxesGrid = document.getElementById('secret-boxes-grid');
        const gameResult = document.getElementById('game2-result');

        if (!giftBoxesGrid) return;
        const winMsg = (gameConfig && gameConfig.winMsg) ? gameConfig.winMsg : "YOU FOUND THE SECRET GIFT! 🎉 YOU WIN UNLIMITED AURA!";

        giftBoxesGrid.innerHTML = '';
        const winnerIndex = Math.floor(Math.random() * 4);

        for (let i = 0; i < 4; i++) {
            const box = document.createElement('div');
            box.className = 'glass-card secret-box';
            box.innerHTML = `<span class="box-icon">🎁</span><span>BOX #${i + 1}</span>`;

            box.onclick = () => {
                if (window.audioManager) window.audioManager.playClick();
                if (i === winnerIndex) {
                    if (window.audioManager) window.audioManager.playWinFanfare();
                    box.classList.add('correct');
                    box.innerHTML = `<span class="box-icon">🎉</span><span>YOU FOUND IT!</span>`;
                    if (gameResult) {
                        gameResult.innerHTML = `<span class="neon-text-cyan">${winMsg}</span>`;
                    }
                    if (window.confettiEngine) window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);
                } else {
                    if (window.audioManager) window.audioManager.playPop();
                    box.classList.add('wrong');
                    box.innerHTML = `<span class="box-icon">😂</span><span>NOPE! TRY AGAIN</span>`;
                }
            };

            giftBoxesGrid.appendChild(box);
        }
    }
}

window.miniGamesController = new MiniGamesController();

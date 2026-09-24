# 🎂 NAGA BHUSHAN — PREMIUM BIRTHDAY EXPERIENCE

A completely original, highly interactive, cinematic birthday surprise website created for **Naga Bhushan**.

Designed with **Cinematic Dark + Electric Neon + Festive Premium** aesthetics, featuring ambient starfield canvas animations, 3D gift unboxing, AI personality diagnostics engine, photo gallery lightbox, video cinema player, handwritten unsealing envelope, candle blowing, friendship timeline, interactive mini-games, custom confetti & fireworks, Web Audio API sound synthesis, and secret Easter eggs!

---

## 🚀 QUICK START

### Option 1: Live Server (VS Code)
1. Open the project folder in **VS Code**.
2. Right-click `index.html` and click **"Open with Live Server"**.

### Option 2: Local HTTP Server (Python / Node)
Using Python:
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

Using Node `serve` or `http-server`:
```bash
npx serve .
```

---

## 📁 PROJECT STRUCTURE

```
birthday-naga-bhushan/
│
├── index.html                # Main HTML5 semantic architecture
│
├── css/
│   └── style.css             # Glassmorphism, neon typography, 3D transforms, animations
│
├── js/
│   ├── config.js             # ⚙️ CENTRAL CONFIGURATION OBJECT (Customize everything here!)
│   ├── particles.js          # Starfield, glowing neon bokeh, ambient canvas engine
│   ├── confetti.js           # Multi-shape celebration confetti explosion engine
│   ├── fireworks.js          # Upward launch rockets and fireworks burst engine
│   ├── audio.js              # Background music manager + Web Audio API sound synthesizer
│   ├── interactions.js       # 3D gift, roast machine, gallery lightbox, cake, mini games
│   └── main.js               # Entry point bootstrap, loading screen, scroll observers, cursor
│
├── assets/
│   ├── photos/               # Place photo-01.jpg ... photo-08.jpg here!
│   │   ├── photo-01.jpg
│   │   ├── photo-02.jpg
│   │   └── ...
│   ├── videos/               # Place your birthday video here!
│   │   └── birthday-video.mp4
│   └── audio/                # Place background music track here!
│       └── birthday-music.mp3
│
└── README.md
```

---

## ⚙️ PERSONALIZATION & CUSTOMIZATION

Everything can be customized by editing **`js/config.js`**:

- **Recipient Name & Title**: `name: "NAGA BHUSHAN"`
- **Birthday Countdown**: Set `birthdayDate: "YYYY-MM-DD"` (e.g. `"2026-09-24"`).
- **Personality Analysis (Roast Engine)**: Customize stats & funny titles in `roastEngine`.
- **Photo Captions**: Edit captions for each photo card in `photos`.
- **Digital Letter**: Modify the handwritten letter paragraphs in `letter`.
- **Friendship Timeline**: Add or edit chapter entries in `timeline`.
- **Wish Wall**: Update wishes from friends in `wishes`.

---

## 🌟 SPECIAL INTERACTIVE FEATURES

1. **3D Gift Box (Scene 03)**: Reacts to mouse movement; click to unbox.
2. **Roast Machine (Scene 04)**: Interactive scan UI; click "RUN ANOTHER SCAN 😂" to shuffle roasts.
3. **Photo Lightbox (Scene 05)**: Fullscreen viewer with arrow keys, click buttons, and mobile swipe support.
4. **Interactive Cake (Scene 08)**: Click candles or click **ENABLE MIC BLOW 🌬️** to blow out flames using real microphone volume detection!
5. **Arcade Mini-Games (Scene 11)**:
   - **Catch Balloons 🎈**: Pop 10 balloons to trigger victory fanfare.
   - **Secret Gift 🎁**: Find the hidden prize box among 4 gift boxes.
6. **Secret Easter Eggs 🤫**:
   - Click the name **"NAGA BHUSHAN"** 5 times in Scene 01 to unlock **Secret Naga Mode**.
   - Type the **Konami Code** (`↑ ↑ ↓ ↓ ← → ← → B A`) on keyboard for **FULL CHAOS MODE**.

---

## 🎨 ACCESSIBILITY & PERFORMANCE
- Built with standard vanilla HTML5, CSS3, ES6+ JavaScript. Zero required external framework dependencies.
- Hardware-accelerated canvas animations with auto-pause on hidden tab (`document.visibilityState`).
- Mobile-first responsive layout tested across mobile, tablet, and desktop viewports.
- Reduced motion support (`@media (prefers-reduced-motion: reduce)`).

Made with ❤️ for **Naga Bhushan**!

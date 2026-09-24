/**
 * ==========================================================================
 * NAGA BHUSHAN BIRTHDAY PLATFORM — CONFIG & DEFAULTS
 * ==========================================================================
 * Contains the single authoritative ADMIN_CONFIG PIN definition
 * and default platform data architecture.
 */

// 🔐 ADMIN CONFIGURATION (Single authoritative location for PIN)
const ADMIN_CONFIG = {
    pin: "2026",               // Default 4-digit Admin PIN
    maxAttempts: 3,             // Max failed PIN attempts before cooldown
    cooldownSeconds: 15         // Cooldown duration in seconds
};

// 🎂 DEFAULT BIRTHDAY PLATFORM DATA ARCHITECTURE
const defaultBirthdayData = {
    // Birthday Recipient Profile
    profile: {
        name: "NAGA BHUSHAN",
        nickname: "Bhushan",
        age: "21",             // Configured Age: 21 years old!
        birthdayDate: "",      // YYYY-MM-DD
        photo: "assets/photos/photo-01.jpg",
        heroMessage: "Today isn't just another day... It's YOUR DAY.",
        tagline: "The universe is celebrating!",
        signature: "— Your Friend & Partner in Chaos",
        introText: "A special digital journey created exclusively for Naga Bhushan."
    },

    // Mysterious Intro Scene
    intro: {
        enabled: true,
        title: "HEY...",
        subtitle: "Someone's special day has entered the system...",
        buttonText: "ENTER THE CHAOS 🚀",
        warningText: "Warning: excessive happiness and high-energy chaos ahead.",
        loadingTexts: [
            "[ SYSTEM INITIALIZING... ]",
            "[ MEMORIES FOUND... ]",
            "[ FRIENDSHIP DATABASE LOADED... ]",
            "[ SUBJECT IDENTIFIED... ]"
        ]
    },

    // Interactive Gift Box
    gift: {
        enabled: true,
        revealedPhoto: "assets/photos/gift-photo.jpg",
        mainMessage: "Plot twist...",
        ageMessage: "You're officially 21 years old!",
        stats: [
            { label: "Age", value: "+1 🎂" },
            { label: "Wisdom", value: "+0 🤔" },
            { label: "Problems", value: "+10 🤪" },
            { label: "Friendship", value: "+∞ ❤️" }
        ]
    },

    // Personality Roast Engine
    funnyMode: {
        title: "NAGA BHUSHAN ANALYSIS ENGINE 🤖",
        subtitle: "Running official birthday personality diagnostics...",
        stats: [
            { label: "FUN LEVEL", percent: 99, color: "var(--neon-pink)" },
            { label: "CHAOS LEVEL", percent: 94, color: "var(--neon-purple)" },
            { label: "SLEEP SCHEDULE", percent: 31, color: "var(--cyan)" },
            { label: "REPLY SPEED", percent: 18, color: "var(--yellow)" },
            { label: "FOOD MOTIVATION", percent: 100, color: "var(--orange)" },
            { label: "FRIENDSHIP LEVEL", percent: 100, customDisplay: "∞", color: "var(--neon-pink)" }
        ],
        cards: [
            { id: 1, icon: "😴", title: "Professional Procrastinator", text: "Master of doing tomorrow what could be done next month." },
            { id: 2, icon: "⏰", title: "CEO of '5 Minutes Bro'", text: "5 minutes actually means 45 minutes + 2 wrong turns." },
            { id: 3, icon: "🧠", title: "Part-Time Philosopher", text: "Gives 3 AM life advice that makes 0% sense in daylight." },
            { id: 4, icon: "🍔", title: "Full-Time Food Explorer", text: "Will travel 20 km just because someone said 'good biryani'." },
            { id: 5, icon: "😂", title: "Certified Meme Supplier", text: "Sends memes at 2:00 AM without any context whatsoever." },
            { id: 6, icon: "📱", title: "Human Notification Snooze", text: "Reads messages, replies in mind, forgets in real life." }
        ]
    },

    // Memories & Photo Gallery
    memories: [
        { id: 1, title: "Core Memories", caption: "Another day... another core memory unlocked.", url: "assets/photos/memory-01.jpg", date: "2024", category: "Vibes" },
        { id: 2, title: "Good Vibes", caption: "Some moments don't need any filters.", url: "assets/photos/memory-02.jpg", date: "2024", category: "Vibes" },
        { id: 3, title: "Certified Chaos", caption: "Certified chaos level: maximum.", url: "assets/photos/memory-03.jpg", date: "2024", category: "Chaos" },
        { id: 4, title: "Best Moments", caption: "The moments that became unforgettable memories.", url: "assets/photos/memory-04.jpg", date: "2024", category: "Memories" },
        { id: 5, title: "Friendship Mode", caption: "Partners in crime and endless laughs.", url: "assets/photos/memory-05.jpg", date: "2024", category: "Squad" },
        { id: 6, title: "Make A Wish", caption: "Here is to another year of iconic moments.", url: "assets/photos/memory-06.jpg", date: "2024", category: "Celebration" },
        { id: 7, title: "Birthday Album 01", caption: "A special birthday memory saved forever.", url: "assets/photos/memory-07.jpg", date: "2024", category: "Album" },
        { id: 8, title: "Birthday Album 02", caption: "More memories, more laughs, more chaos.", url: "assets/photos/memory-08.jpg", date: "2024", category: "Album" },
        { id: 9, title: "Naga Bhushan Album 01", caption: "A moment worth remembering.", url: "assets/photos/naga-bhushan-birthday-album-01.jpg", date: "2024", category: "Album" },
        { id: 10, title: "Naga Bhushan Album 02", caption: "Here is to a lifetime of good vibes.", url: "assets/photos/naga-bhushan-birthday-album-02.jpg", date: "2024", category: "Album" }
    ],

    // Videos Section
    videos: [
        { id: 1, title: "Birthday Memory 01", description: "A special birthday moment.", url: "assets/videos/birth.mp4", poster: "", hidden: false },
        { id: 2, title: "Birthday Memory 02", description: "Good vibes and unforgettable memories.", url: "assets/videos/birth2.mp4", poster: "", hidden: false },
        { id: 3, title: "Surprise Egg Memory", description: "A little surprise from the birthday archive.", url: "assets/videos/egg.mp4", poster: "", hidden: false },
        { id: 4, title: "Memory Moments", description: "Some memories are better moving.", url: "assets/videos/m2.mp4", poster: "", hidden: false },
        { id: 5, title: "Birthday Movie A", description: "Another moving birthday memory.", url: "assets/videos/A.mp4", poster: "", hidden: false },
        { id: 6, title: "Birthday Movie B", description: "A special moment from the birthday collection.", url: "assets/videos/B.mp4", poster: "", hidden: false },
        { id: 7, title: "Birthday Movie C", description: "More memories captured in motion.", url: "assets/videos/c.mp4", poster: "", hidden: false },
        { id: 8, title: "Birthday Movie D", description: "Good friends and unforgettable moments.", url: "assets/videos/d.mp4", poster: "", hidden: false },
        { id: 9, title: "Birthday Movie E", description: "A memory worth playing again.", url: "assets/videos/e.mp4", poster: "", hidden: false },
        { id: 10, title: "Birthday Movie F", description: "The birthday chaos continues.", url: "assets/videos/f.mp4", poster: "", hidden: false }
    ],

    // Digital Handwritten Letter
    letter: {
        enabled: true,
        salutation: "Dear Naga Bhushan,",
        paragraphs: [
            "Today is not just about another year being added to your life. It's about all the memories, laughs, stupid conversations, random plans, unforgettable moments and everything still waiting to happen.",
            "Some friendships are impossible to explain. You just know they're special. Thank you for being the person you are. Keep laughing. Keep dreaming. Keep doing crazy things. And most importantly... never stop being Naga Bhushan. Happy Birthday! ❤️",
            "Here's to another year of adventures, memories and absolute chaos."
        ],
        closing: "— Your Friend"
    },

    // Interactive Cake & Candles
    cake: {
        enabled: true,
        style: "neon",            // classic | neon | chocolate | colorful | futuristic
        message: "Happy Birthday Naga Bhushan",
        wishSuccessTitle: "MAKE A WISH, NAGA BHUSHAN ✨",
        wishSuccessSubtext: "Wish successfully launched into the universe 🚀",
        candleCount: 5,
        candleAnimation: true,
        candleFlame: true,
        candleInteraction: true,
        blowDetection: true,
        fallbackButton: true,
        confettiOnBlow: true,
        fireworksOnBlow: true,
        cakeCuttingVideo: ""
    },

    // Friendship Timeline
    timeline: [
        { id: 1, year: "CHAPTER 01", title: "First Memories", description: "Where it all started! Awkward hellos turned into endless conversations and instant brotherhood.", icon: "🚀" },
        { id: 2, year: "CHAPTER 02", title: "Peak Stupidity", description: "Executing the dumbest ideas with 100% confidence and 0% regret.", icon: "🤪" },
        { id: 3, year: "CHAPTER 03", title: "Unplanned Adventures", description: "Random 2 AM drives, unexpected food hunts, and spontaneous trips that became unforgettable.", icon: "🗺️" },
        { id: 4, year: "CHAPTER 04", title: "Laughing for No Reason", description: "Inside jokes that nobody else understands. Eye contact alone is enough to burst into laughter.", icon: "😂" },
        { id: 5, year: "CHAPTER 05", title: "More Memories Loading...", description: "The journey is just beginning. The best chapters are yet to be written!", icon: "✨" }
    ],

    // Wish Wall Items
    wishes: [
        { id: 1, from: "Your Squad 🔥", message: "Happy Birthday Naga Bhushan! May your day be as legendary as your excuses! 🎉", tag: "BEST WISHES", emoji: "🎉", style: "glass", bg: "gradient-1" },
        { id: 2, from: "Tech Support 📶", message: "May your Wi-Fi always be strong, ping always be low, and battery never die at 1%.", tag: "TECH BLESSING", emoji: "📶", style: "neon", bg: "gradient-2" },
        { id: 3, from: "Financial Advisor 💰", message: "May your bank balance grow faster than your age and your food bills get paid by someone else!", tag: "WEALTH", emoji: "💰", style: "polaroid", bg: "gradient-3" },
        { id: 4, from: "Trip Planner 𝘛𝘔 🚗", message: "May all your 'Goa plans' actually happen this year instead of dying in WhatsApp groups!", tag: "TRAVEL", emoji: "🚗", style: "chat", bg: "gradient-4" },
        { id: 5, from: "Foodie Club 🍕", message: "May your food always arrive before your patience disappears! Bon appétit brother!", tag: "FOODIE", emoji: "🍕", style: "glass", bg: "gradient-5" },
        { id: 6, from: "Meme Department 🎭", message: "Stay happy. Stay crazy. Stay awesome. Never change, Naga Bhushan!", tag: "LEGEND", emoji: "🎭", style: "handwritten", bg: "gradient-6" }
    ],

    // Audio & Music Manager
    audio: {
        globalSoundEnabled: true,
        musicEnabled: true,
        musicPath: "assets/audio/birthday-music.mp3",
        defaultVolume: 0.8,
        allowUserControl: true,
        showMusicBtn: true
    },

    // Celebration & Effects Manager
    celebrations: {
        confetti: { enabled: true, intensity: "HIGH", duration: 5 },
        fireworks: { enabled: true, intensity: "HIGH", duration: 6 },
        balloons: { enabled: true },
        sparkles: { enabled: true },
        hearts: { enabled: true },
        stars: { enabled: true },
        screenShake: { enabled: true }
    },

    // Mini Games
    games: {
        balloonGame: { enabled: true, title: "Catch the Balloons 🎈", targetScore: 10, winMsg: "YOU WIN! CELEBRATION UNLOCKED! 🎉" },
        giftGame: { enabled: true, title: "Find the Secret Gift 🎁", winMsg: "YOU FOUND THE SECRET GIFT! 🎉" }
    },

    // Loading Screen Settings
    loadingScreen: {
        duration: 1500,
        skipIntro: true
    },

    // Countdown Timer Settings
    countdown: {
        enabled: true,
        birthdayDate: "",
        preMsg: "THE CELEBRATION STARTS IN",
        todayMsg: "IT'S BIRTHDAY TIME! 🎉",
        postMsg: "THE PARTY CONTINUES! 🎉"
    },

    // Navigation Section Visibility Toggles
    navigation: {
        scene01: true, // Intro
        scene02: true, // Portal
        scene03: true, // Gift
        scene04: true, // Roast
        scene05: true, // Memories
        scene06: true, // Video
        scene07: true, // Letter
        scene08: true, // Cake
        scene09: true, // Timeline
        scene10: true, // Wishes
        scene11: true, // Games
        scene12: true  // Finale
    },

    // Easter Egg Config
    easterEggs: {
        clickCount: 5,
        message: "SECRET NAGA MODE UNLOCKED 🤫",
        confetti: true,
        fireworks: true,
        sound: true
    },

    // Global Theme & Visual Customizer
    theme: {
        primaryColor: "#a855f7",
        secondaryColor: "#ec4899",
        accentColor: "#06b6d4",
        bgColor: "#070913",
        preset: "Neon",
        headingFont: "Space Grotesk",
        bodyFont: "Inter",
        fontStyle: "default",
        borderRadius: "24px",
        glowIntensity: "HIGH",
        animationIntensity: "HIGH"
    },

    // Performance & Effects Control
    effects: {
        parallax: true,
        cursorEffects: true,
        tilt: true,
        bgAnimation: true,
        particleDensity: "HIGH"
    }
};

window.ADMIN_CONFIG = ADMIN_CONFIG;
window.defaultBirthdayData = defaultBirthdayData;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ADMIN_CONFIG, defaultBirthdayData };
}

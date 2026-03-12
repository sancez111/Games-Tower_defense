// ============================================
// Letter Defenders — Progression System
// ============================================

// Level definitions
const LEVELS = [
    {
        id: 1,
        name: 'Home Start',
        letters: ['F', 'J'],
        waves: [
            { enemies: ['F', 'J', 'F', 'J'], spawnInterval: 3.5, enemySpeed: 0.025 },
            { enemies: ['F', 'J', 'J', 'F', 'J'], spawnInterval: 3.0, enemySpeed: 0.025 },
            { enemies: ['F', 'J', 'F', 'J', 'F', 'J'], spawnInterval: 2.5, enemySpeed: 0.03 },
        ]
    },
    {
        id: 2,
        name: 'Home Expand',
        letters: ['F', 'J', 'D', 'K'],
        waves: [
            { enemies: ['F', 'J', 'D', 'K'], spawnInterval: 3.2, enemySpeed: 0.025 },
            { enemies: ['D', 'F', 'K', 'J', 'F'], spawnInterval: 2.8, enemySpeed: 0.028 },
            { enemies: ['K', 'D', 'J', 'F', 'D', 'K'], spawnInterval: 2.5, enemySpeed: 0.03 },
        ]
    },
    {
        id: 3,
        name: 'Home Neighbors',
        letters: ['F', 'J', 'D', 'K', 'S', 'L'],
        waves: [
            { enemies: ['S', 'L', 'S', 'L', 'F'], spawnInterval: 3.0, enemySpeed: 0.025 },
            { enemies: ['F', 'S', 'D', 'J', 'K', 'L'], spawnInterval: 2.8, enemySpeed: 0.028 },
            { enemies: ['L', 'K', 'J', 'F', 'D', 'S', 'L'], spawnInterval: 2.5, enemySpeed: 0.03 },
            { enemies: ['S', 'D', 'F', 'J', 'K', 'L', 'F', 'J'], spawnInterval: 2.2, enemySpeed: 0.032 },
        ]
    },
    {
        id: 4,
        name: 'Home Row',
        letters: ['F', 'J', 'D', 'K', 'S', 'L', 'A'],
        waves: [
            { enemies: ['A', 'F', 'J', 'A', 'D'], spawnInterval: 3.0, enemySpeed: 0.025 },
            { enemies: ['A', 'S', 'D', 'F', 'J', 'K', 'L'], spawnInterval: 2.6, enemySpeed: 0.028 },
            { enemies: ['L', 'A', 'K', 'S', 'J', 'D', 'F', 'A'], spawnInterval: 2.3, enemySpeed: 0.03 },
            { enemies: ['F', 'J', 'D', 'K', 'S', 'L', 'A', 'F', 'J'], spawnInterval: 2.0, enemySpeed: 0.033 },
        ]
    },
    {
        id: 5,
        name: 'Home Master',
        letters: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
        waves: [
            { enemies: ['A', 'S', 'D', 'F', 'J', 'K', 'L'], spawnInterval: 2.8, enemySpeed: 0.028 },
            { enemies: ['L', 'K', 'J', 'F', 'D', 'S', 'A', 'F'], spawnInterval: 2.4, enemySpeed: 0.03 },
            { enemies: ['F', 'J', 'A', 'L', 'D', 'K', 'S', 'J', 'F'], spawnInterval: 2.2, enemySpeed: 0.033 },
            { enemies: ['A', 'D', 'F', 'K', 'L', 'S', 'J', 'A', 'F', 'D'], spawnInterval: 2.0, enemySpeed: 0.035 },
            { enemies: ['S', 'L', 'A', 'K', 'D', 'J', 'F', 'S', 'L', 'A', 'K'], spawnInterval: 1.8, enemySpeed: 0.038 },
        ]
    },
];

// Progression state
const Progression = {
    currentLevel: 0,
    currentWave: 0,
    hearts: CONFIG.MAX_HEARTS,
    score: 0,
    combo: 0,
    maxCombo: 0,

    // localStorage key
    SAVE_KEY: 'letterDefenders_progress',

    init() {
        this.currentLevel = 0;
        this.currentWave = 0;
        this.hearts = CONFIG.MAX_HEARTS;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
    },

    startLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.currentWave = 0;
        this.hearts = CONFIG.MAX_HEARTS;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
    },

    getLevelDef() {
        return LEVELS[this.currentLevel];
    },

    getWaveDef() {
        const level = this.getLevelDef();
        if (this.currentWave < level.waves.length) {
            return level.waves[this.currentWave];
        }
        return null;
    },

    getTotalWaves() {
        return this.getLevelDef().waves.length;
    },

    // Returns points earned for a kill at given path progress
    scoreKill(pathProgress) {
        let points = 10;
        if (pathProgress < 0.3) {
            points += 5;
        } else if (pathProgress < 0.5) {
            points += 3;
        }
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        this.score += points;
        return points;
    },

    resetCombo() {
        this.combo = 0;
    },

    loseHeart() {
        this.hearts = Math.max(0, this.hearts - 1);
        return this.hearts;
    },

    isGameOver() {
        return this.hearts <= 0;
    },

    // Calculate star rating: 3 = no hearts lost, 2 = lost <=2, 1 = completed
    getStars() {
        const lost = CONFIG.MAX_HEARTS - this.hearts;
        if (lost === 0) return 3;
        if (lost <= 2) return 2;
        return 1;
    },

    // --- localStorage Save/Load ---
    loadProgress() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) { /* ignore */ }
        return {};
    },

    saveLevel(levelIndex, stars) {
        const progress = this.loadProgress();
        const key = 'level_' + (levelIndex + 1);
        const existing = progress[key] || 0;
        progress[key] = Math.max(existing, stars);
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(progress));
        } catch (e) { /* ignore */ }
    },

    getLevelStars(levelIndex) {
        const progress = this.loadProgress();
        return progress['level_' + (levelIndex + 1)] || 0;
    },

    isLevelUnlocked(levelIndex) {
        if (levelIndex === 0) return true;
        return this.getLevelStars(levelIndex - 1) >= 1;
    },
};

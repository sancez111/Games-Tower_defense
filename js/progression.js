// ============================================
// Letter Defenders — Progression System
// ============================================

// Level definitions — 14 levels with per-level paths, enemy types, and difficulty scaling
const LEVELS = [
    // === LEVELS 1-2: Home Start (F,J,D,K) — Walkers only, long path ===
    {
        id: 1,
        name: 'Home Start',
        letters: ['F', 'J'],
        path: PATH_LAYOUTS.longWinding,
        waves: [
            { enemies: ['F', 'J', 'F', 'J'], spawnInterval: 3.5, enemySpeed: 0.025 },
            { enemies: ['F', 'J', 'J', 'F', 'J'], spawnInterval: 3.0, enemySpeed: 0.025 },
            { enemies: ['F', 'J', 'F', 'J', 'F', 'J'], spawnInterval: 2.8, enemySpeed: 0.028 },
        ]
    },
    {
        id: 2,
        name: 'Home Expand',
        letters: ['F', 'J', 'D', 'K'],
        path: PATH_LAYOUTS.longWinding,
        waves: [
            { enemies: ['D', 'K', 'D', 'K'], spawnInterval: 3.5, enemySpeed: 0.025 },
            { enemies: ['F', 'J', 'D', 'K', 'F'], spawnInterval: 3.0, enemySpeed: 0.027 },
            { enemies: ['K', 'D', 'J', 'F', 'D', 'K'], spawnInterval: 2.5, enemySpeed: 0.03 },
        ]
    },
    // === LEVEL 3: Quick Fingers — Introduce Sprinters ===
    {
        id: 3,
        name: 'Quick Fingers',
        letters: ['F', 'J', 'D', 'K'],
        path: PATH_LAYOUTS.mediumTwoTurn,
        waves: [
            { enemies: ['F', 'J', 'D', 'K'], spawnInterval: 3.2, enemySpeed: 0.028 },
            { enemies: [
                'F', { letter: 'J', type: 'sprinter' }, 'D', { letter: 'K', type: 'sprinter' }, 'F'
            ], spawnInterval: 3.0, enemySpeed: 0.028 },
            { enemies: [
                { letter: 'F', type: 'sprinter' }, 'J', { letter: 'D', type: 'sprinter' },
                'K', { letter: 'F', type: 'sprinter' }, 'J'
            ], spawnInterval: 2.8, enemySpeed: 0.03 },
        ]
    },
    // === LEVELS 4-5: S,L + Sprinters, introduce Tanks ===
    {
        id: 4,
        name: 'Home Neighbors',
        letters: ['F', 'J', 'D', 'K', 'S', 'L'],
        path: PATH_LAYOUTS.longWinding,
        waves: [
            { enemies: ['S', 'L', 'S', 'L', 'F'], spawnInterval: 3.2, enemySpeed: 0.027 },
            { enemies: [
                'S', { letter: 'L', type: 'sprinter' }, 'D', 'K',
                { letter: 'F', type: 'sprinter' }, 'J'
            ], spawnInterval: 2.8, enemySpeed: 0.03 },
            { enemies: [
                { letter: 'S', type: 'sprinter' }, 'L', 'D', { letter: 'K', type: 'sprinter' },
                'F', 'J', 'S', 'L'
            ], spawnInterval: 2.5, enemySpeed: 0.032 },
            { enemies: [
                'F', { letter: 'J', type: 'sprinter' }, 'S', 'L',
                { letter: 'D', type: 'sprinter' }, 'K', 'F', 'J'
            ], spawnInterval: 2.3, enemySpeed: 0.033 },
        ]
    },
    {
        id: 5,
        name: 'Tough Letters',
        letters: ['F', 'J', 'D', 'K', 'S', 'L'],
        path: PATH_LAYOUTS.longWinding,
        waves: [
            { enemies: [
                'F', 'J', { letter: 'D', type: 'tank' }, 'K'
            ], spawnInterval: 3.0, enemySpeed: 0.028 },
            { enemies: [
                { letter: 'F', type: 'tank' }, 'J', 'S', { letter: 'L', type: 'sprinter' }, 'D'
            ], spawnInterval: 2.8, enemySpeed: 0.03 },
            { enemies: [
                'S', { letter: 'K', type: 'tank' }, { letter: 'F', type: 'sprinter' },
                'J', 'D', { letter: 'L', type: 'tank' }
            ], spawnInterval: 2.5, enemySpeed: 0.032 },
        ]
    },
    // === LEVELS 6-7: A + all types, introduce Swarms ===
    {
        id: 6,
        name: 'Home Row',
        letters: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
        path: PATH_LAYOUTS.mediumTwoTurn,
        waves: [
            { enemies: ['A', 'F', 'J', 'A', 'D'], spawnInterval: 3.0, enemySpeed: 0.028 },
            { enemies: [
                'A', { letter: 'S', type: 'sprinter' }, 'D', 'F',
                { letter: 'J', type: 'tank' }, 'K', 'L'
            ], spawnInterval: 2.6, enemySpeed: 0.03 },
            { enemies: [
                { letter: 'L', type: 'sprinter' }, 'A', { letter: 'K', type: 'tank' },
                'S', 'J', { letter: 'D', type: 'sprinter' }, 'F', 'A'
            ], spawnInterval: 2.3, enemySpeed: 0.033 },
            { enemies: [
                { letter: 'F', type: 'tank' }, { letter: 'J', type: 'sprinter' },
                'D', 'K', 'S', { letter: 'L', type: 'tank' }, 'A', 'F', 'J'
            ], spawnInterval: 2.0, enemySpeed: 0.035 },
        ]
    },
    {
        id: 7,
        name: 'Swarm Attack',
        letters: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
        path: PATH_LAYOUTS.longWinding,
        waves: [
            { enemies: [
                'F', 'J', { letter: 'D', type: 'swarm', count: 3 }, 'K'
            ], spawnInterval: 3.0, enemySpeed: 0.028 },
            { enemies: [
                { letter: 'S', type: 'swarm', count: 3 }, 'A', 'L',
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'swarm', count: 4 }
            ], spawnInterval: 2.8, enemySpeed: 0.03 },
            { enemies: [
                { letter: 'A', type: 'swarm', count: 3 }, { letter: 'K', type: 'tank' },
                'D', { letter: 'L', type: 'swarm', count: 4 },
                { letter: 'F', type: 'sprinter' }, 'J'
            ], spawnInterval: 2.5, enemySpeed: 0.032 },
            { enemies: [
                { letter: 'D', type: 'swarm', count: 4 }, { letter: 'S', type: 'tank' },
                { letter: 'J', type: 'sprinter' }, { letter: 'K', type: 'swarm', count: 3 },
                'A', 'F', 'L'
            ], spawnInterval: 2.2, enemySpeed: 0.035 },
        ]
    },
    // === LEVEL 8: Home Master — All types, short path ===
    {
        id: 8,
        name: 'Home Master',
        letters: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
        path: PATH_LAYOUTS.shortDirect,
        waves: [
            { enemies: [
                'A', 'S', 'D', 'F', 'J', 'K', 'L'
            ], spawnInterval: 2.8, enemySpeed: 0.03 },
            { enemies: [
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'tank' },
                'A', { letter: 'D', type: 'swarm', count: 3 }, 'K', 'S'
            ], spawnInterval: 2.5, enemySpeed: 0.032 },
            { enemies: [
                { letter: 'L', type: 'tank' }, { letter: 'A', type: 'sprinter' },
                { letter: 'S', type: 'swarm', count: 4 }, 'D', 'F',
                { letter: 'K', type: 'sprinter' }, 'J'
            ], spawnInterval: 2.2, enemySpeed: 0.035 },
            { enemies: [
                { letter: 'J', type: 'swarm', count: 3 }, { letter: 'F', type: 'tank' },
                { letter: 'D', type: 'sprinter' }, 'A', 'L',
                { letter: 'S', type: 'tank' }, 'K'
            ], spawnInterval: 2.0, enemySpeed: 0.037 },
            { enemies: [
                { letter: 'A', type: 'swarm', count: 4 }, { letter: 'K', type: 'tank' },
                { letter: 'S', type: 'sprinter' }, { letter: 'L', type: 'sprinter' },
                'D', 'F', 'J', { letter: 'A', type: 'tank' }
            ], spawnInterval: 1.8, enemySpeed: 0.038 },
        ]
    },
    // === LEVELS 9-12: Top row letters ===
    {
        id: 9,
        name: 'Reaching Up',
        letters: ['R', 'U', 'F', 'J', 'D', 'K'],
        path: PATH_LAYOUTS.longWinding,
        waves: [
            { enemies: ['R', 'U', 'R', 'U', 'F'], spawnInterval: 3.2, enemySpeed: 0.03 },
            { enemies: [
                'R', { letter: 'U', type: 'sprinter' }, 'F', 'J',
                { letter: 'R', type: 'sprinter' }, 'U'
            ], spawnInterval: 2.8, enemySpeed: 0.032 },
            { enemies: [
                { letter: 'R', type: 'sprinter' }, 'U', 'D', 'K',
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'sprinter' }, 'R', 'U'
            ], spawnInterval: 2.5, enemySpeed: 0.035 },
        ]
    },
    {
        id: 10,
        name: 'Climbing Higher',
        letters: ['E', 'I', 'R', 'U', 'F', 'J', 'D', 'K'],
        path: PATH_LAYOUTS.mediumTwoTurn,
        waves: [
            { enemies: ['E', 'I', 'E', 'I', 'R'], spawnInterval: 3.0, enemySpeed: 0.032 },
            { enemies: [
                'E', { letter: 'I', type: 'sprinter' }, { letter: 'R', type: 'tank' },
                'U', 'F', 'J'
            ], spawnInterval: 2.6, enemySpeed: 0.035 },
            { enemies: [
                { letter: 'E', type: 'tank' }, 'I', { letter: 'R', type: 'sprinter' },
                'U', 'D', { letter: 'K', type: 'sprinter' }, 'F'
            ], spawnInterval: 2.3, enemySpeed: 0.037 },
            { enemies: [
                { letter: 'I', type: 'swarm', count: 3 }, { letter: 'E', type: 'tank' },
                { letter: 'R', type: 'sprinter' }, 'U', 'F', 'J',
                { letter: 'D', type: 'sprinter' }
            ], spawnInterval: 2.0, enemySpeed: 0.038 },
        ]
    },
    {
        id: 11,
        name: 'Almost There',
        letters: ['W', 'O', 'E', 'I', 'R', 'U', 'F', 'J'],
        path: PATH_LAYOUTS.mediumTwoTurn,
        waves: [
            { enemies: ['W', 'O', 'W', 'O', 'E'], spawnInterval: 2.8, enemySpeed: 0.033 },
            { enemies: [
                { letter: 'W', type: 'sprinter' }, 'O', { letter: 'E', type: 'tank' },
                'I', 'R', 'U'
            ], spawnInterval: 2.5, enemySpeed: 0.035 },
            { enemies: [
                { letter: 'O', type: 'swarm', count: 3 }, { letter: 'W', type: 'tank' },
                'E', { letter: 'I', type: 'sprinter' }, 'R', 'U', 'F'
            ], spawnInterval: 2.2, enemySpeed: 0.038 },
            { enemies: [
                { letter: 'W', type: 'swarm', count: 4 }, { letter: 'O', type: 'tank' },
                { letter: 'E', type: 'sprinter' }, { letter: 'I', type: 'sprinter' },
                'R', 'U', { letter: 'F', type: 'tank' }, 'J'
            ], spawnInterval: 2.0, enemySpeed: 0.04 },
        ]
    },
    {
        id: 12,
        name: 'Pinky Stretch',
        letters: ['Q', 'P', 'W', 'O', 'E', 'I', 'R', 'U'],
        path: PATH_LAYOUTS.shortDirect,
        waves: [
            { enemies: ['Q', 'P', 'Q', 'P', 'W'], spawnInterval: 2.8, enemySpeed: 0.035 },
            { enemies: [
                { letter: 'Q', type: 'sprinter' }, 'P', { letter: 'W', type: 'tank' },
                'O', { letter: 'E', type: 'sprinter' }, 'I'
            ], spawnInterval: 2.4, enemySpeed: 0.037 },
            { enemies: [
                { letter: 'P', type: 'swarm', count: 3 }, { letter: 'Q', type: 'tank' },
                'R', { letter: 'U', type: 'sprinter' }, 'W', 'O'
            ], spawnInterval: 2.2, enemySpeed: 0.04 },
            { enemies: [
                { letter: 'Q', type: 'swarm', count: 4 }, { letter: 'P', type: 'tank' },
                { letter: 'W', type: 'sprinter' }, { letter: 'O', type: 'sprinter' },
                'E', 'I', { letter: 'R', type: 'tank' }
            ], spawnInterval: 2.0, enemySpeed: 0.042 },
        ]
    },
    // === LEVEL 13: Top Row Master — Zigzag path, all types ===
    {
        id: 13,
        name: 'Top Row Master',
        letters: ['Q', 'W', 'E', 'R', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'J', 'K', 'L'],
        path: PATH_LAYOUTS.zigzag,
        waves: [
            { enemies: [
                'Q', 'W', 'E', 'R', 'U', 'I', 'O', 'P'
            ], spawnInterval: 2.5, enemySpeed: 0.035 },
            { enemies: [
                { letter: 'Q', type: 'sprinter' }, { letter: 'P', type: 'sprinter' },
                { letter: 'W', type: 'tank' }, 'E', 'R', 'U', 'I', 'O'
            ], spawnInterval: 2.2, enemySpeed: 0.038 },
            { enemies: [
                { letter: 'E', type: 'swarm', count: 4 }, { letter: 'R', type: 'tank' },
                { letter: 'I', type: 'sprinter' }, 'Q', 'W',
                { letter: 'O', type: 'swarm', count: 3 }, 'P'
            ], spawnInterval: 2.0, enemySpeed: 0.04 },
            { enemies: [
                { letter: 'U', type: 'tank' }, { letter: 'Q', type: 'sprinter' },
                { letter: 'W', type: 'swarm', count: 3 }, 'E',
                { letter: 'P', type: 'tank' }, { letter: 'R', type: 'sprinter' },
                'I', 'O', 'A', 'F'
            ], spawnInterval: 1.8, enemySpeed: 0.042 },
            { enemies: [
                { letter: 'E', type: 'swarm', count: 4 }, { letter: 'I', type: 'tank' },
                { letter: 'Q', type: 'sprinter' }, { letter: 'P', type: 'sprinter' },
                { letter: 'W', type: 'tank' }, 'O', 'R', 'U',
                { letter: 'S', type: 'swarm', count: 3 }, 'D', 'J'
            ], spawnInterval: 1.6, enemySpeed: 0.043 },
        ]
    },
    // === LEVEL 14: Full Keyboard — All letters, short path, hardest ===
    {
        id: 14,
        name: 'Full Keyboard',
        letters: ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'Q', 'W', 'E', 'R', 'U', 'I', 'O', 'P'],
        path: PATH_LAYOUTS.shortDirect,
        waves: [
            { enemies: [
                'A', 'S', 'D', 'F', 'J', 'K', 'L', 'Q', 'W'
            ], spawnInterval: 2.2, enemySpeed: 0.038 },
            { enemies: [
                { letter: 'E', type: 'sprinter' }, { letter: 'R', type: 'tank' },
                'U', 'I', { letter: 'O', type: 'sprinter' }, 'P',
                'A', { letter: 'F', type: 'tank' }, 'J'
            ], spawnInterval: 2.0, enemySpeed: 0.04 },
            { enemies: [
                { letter: 'Q', type: 'swarm', count: 4 }, { letter: 'W', type: 'tank' },
                { letter: 'E', type: 'sprinter' }, 'R',
                { letter: 'U', type: 'swarm', count: 3 }, 'I',
                { letter: 'O', type: 'tank' }, 'P'
            ], spawnInterval: 1.8, enemySpeed: 0.042 },
            { enemies: [
                { letter: 'A', type: 'tank' }, { letter: 'S', type: 'sprinter' },
                { letter: 'D', type: 'swarm', count: 4 }, 'F',
                { letter: 'J', type: 'tank' }, { letter: 'K', type: 'sprinter' },
                { letter: 'L', type: 'swarm', count: 3 }, 'Q', 'W'
            ], spawnInterval: 1.6, enemySpeed: 0.043 },
            { enemies: [
                { letter: 'E', type: 'swarm', count: 4 }, { letter: 'I', type: 'swarm', count: 4 },
                { letter: 'R', type: 'tank' }, { letter: 'U', type: 'tank' },
                { letter: 'Q', type: 'sprinter' }, { letter: 'P', type: 'sprinter' },
                'W', 'O', 'A', 'L'
            ], spawnInterval: 1.5, enemySpeed: 0.044 },
            { enemies: [
                { letter: 'F', type: 'swarm', count: 4 }, { letter: 'J', type: 'swarm', count: 4 },
                { letter: 'D', type: 'tank' }, { letter: 'K', type: 'tank' },
                { letter: 'S', type: 'sprinter' }, { letter: 'L', type: 'sprinter' },
                { letter: 'A', type: 'tank' }, { letter: 'Q', type: 'sprinter' },
                'W', 'E', 'R', 'P'
            ], spawnInterval: 1.5, enemySpeed: 0.045 },
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

    // Timer state
    levelTime: 0,
    timerRunning: false,

    // localStorage key
    SAVE_KEY: 'letterDefenders_progress',

    init() {
        this.currentLevel = 0;
        this.currentWave = 0;
        this.hearts = CONFIG.MAX_HEARTS;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.levelTime = 0;
        this.timerRunning = false;
    },

    startLevel(levelIndex) {
        this.currentLevel = levelIndex;
        this.currentWave = 0;
        this.hearts = CONFIG.MAX_HEARTS;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.levelTime = 0;
        this.timerRunning = false;
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

    // Normalize a saved entry: old format (number) -> new format ({ stars, bestTime })
    _normalizeSaveEntry(entry) {
        if (typeof entry === 'number') {
            return { stars: entry, bestTime: null };
        }
        if (entry && typeof entry === 'object') {
            return entry;
        }
        return { stars: 0, bestTime: null };
    },

    saveLevel(levelIndex, stars, completionTime) {
        const progress = this.loadProgress();
        const key = 'level_' + (levelIndex + 1);
        const existing = this._normalizeSaveEntry(progress[key]);

        const newEntry = {
            stars: Math.max(existing.stars, stars),
            bestTime: existing.bestTime,
        };

        // Save best time only on win (completionTime provided)
        if (completionTime != null) {
            if (existing.bestTime == null || completionTime < existing.bestTime) {
                newEntry.bestTime = completionTime;
            }
        }

        progress[key] = newEntry;
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(progress));
        } catch (e) { /* ignore */ }

        return newEntry;
    },

    getLevelStars(levelIndex) {
        const progress = this.loadProgress();
        const entry = progress['level_' + (levelIndex + 1)];
        if (!entry) return 0;
        if (typeof entry === 'number') return entry;
        return entry.stars || 0;
    },

    getLevelBestTime(levelIndex) {
        const progress = this.loadProgress();
        const entry = progress['level_' + (levelIndex + 1)];
        if (!entry || typeof entry === 'number') return null;
        return entry.bestTime || null;
    },

    isLevelUnlocked(levelIndex) {
        if (levelIndex === 0) return true;
        return this.getLevelStars(levelIndex - 1) >= 1;
    },
};

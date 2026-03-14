// ============================================
// Letter Defenders — Keyboard Defense Mode
// ============================================

// KD World Themes
const KD_WORLD_THEMES = {
    village: {
        name: 'Keystone Village',
        skyTop: '#4A90D9',
        skyBottom: '#87CEEB',
        grass: '#5B8C2A',
        grassLight: '#7EC850',
        dirt: '#8B6914',
        dirtLight: '#B8860B',
    },
    highlands: {
        name: 'Upper Highlands',
        skyTop: '#7090B8',
        skyBottom: '#B0C8E0',
        grass: '#8090A0',
        grassLight: '#A0B0C0',
        dirt: '#606878',
        dirtLight: '#788090',
    },
    depths: {
        name: 'Lower Depths',
        skyTop: '#1A0A0A',
        skyBottom: '#4A1A0A',
        grass: '#3A3A3A',
        grassLight: '#4A4A4A',
        dirt: '#2A2A2A',
        dirtLight: '#3A3030',
    },
};

// Finger guide color mapping
const FINGER_COLORS = {
    pinky:  { color: 'rgba(220,60,60,0.25)',  border: '#CC3333', label: 'Pinky' },
    ring:   { color: 'rgba(240,160,40,0.25)', border: '#DD8800', label: 'Ring' },
    middle: { color: 'rgba(60,180,60,0.25)',   border: '#33AA33', label: 'Middle' },
    index:  { color: 'rgba(60,100,220,0.25)',  border: '#3366DD', label: 'Index' },
    thumb:  { color: 'rgba(160,60,220,0.25)',  border: '#9933DD', label: 'Thumb' },
};

// Which finger each key uses
const KEY_FINGERS = {
    'Q': 'pinky', 'A': 'pinky', 'Z': 'pinky',
    'W': 'ring',  'S': 'ring',  'X': 'ring',
    'E': 'middle','D': 'middle','C': 'middle',
    'R': 'index', 'F': 'index', 'V': 'index',
    'T': 'index', 'G': 'index', 'B': 'index',
    'Y': 'index', 'H': 'index', 'N': 'index',
    'U': 'index', 'J': 'index', 'M': 'index',
    'I': 'middle','K': 'middle',',': 'middle',
    'O': 'ring',  'L': 'ring',  '.': 'ring',
    'P': 'pinky', ';': 'pinky', '/': 'pinky',
    ' ': 'thumb',
};

// KD Level definitions - 12 levels across 3 worlds
const KD_LEVELS = [
    // ============ WORLD 1: Keystone Village (Home Row) — Levels 1-4 ============
    {
        id: 1, name: 'First Keys', world: 'village', kdWorld: 0,
        letters: ['F', 'J'],
        waves: [
            { enemies: [
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'walker' },
                { letter: 'F', type: 'walker' },
            ], spawnInterval: 3.5, fallSpeed: 0.4 },
            { enemies: [
                { letter: 'J', type: 'walker' }, { letter: 'F', type: 'walker' },
                { letter: 'J', type: 'walker' }, { letter: 'F', type: 'walker' },
            ], spawnInterval: 3.0, fallSpeed: 0.45 },
            { enemies: [
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'walker' },
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'walker' },
                { letter: 'F', type: 'walker' },
            ], spawnInterval: 2.8, fallSpeed: 0.5 },
        ]
    },
    {
        id: 2, name: 'Neighbors', world: 'village', kdWorld: 0,
        letters: ['F', 'J', 'D', 'K'],
        waves: [
            { enemies: [
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
            ], spawnInterval: 3.2, fallSpeed: 0.45 },
            { enemies: [
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'walker' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'F', type: 'walker' },
            ], spawnInterval: 2.8, fallSpeed: 0.5 },
            { enemies: [
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'walker' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
            ], spawnInterval: 2.5, fallSpeed: 0.55 },
        ]
    },
    {
        id: 3, name: 'Quick Dash', world: 'village', kdWorld: 0,
        letters: ['F', 'J', 'D', 'K', 'S', 'L'],
        waves: [
            { enemies: [
                { letter: 'S', type: 'walker' }, { letter: 'L', type: 'walker' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
            ], spawnInterval: 3.0, fallSpeed: 0.5 },
            { enemies: [
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'sprinter' },
                { letter: 'S', type: 'walker' }, { letter: 'L', type: 'sprinter' },
                { letter: 'D', type: 'walker' },
            ], spawnInterval: 2.6, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'D', type: 'sprinter' }, { letter: 'K', type: 'walker' },
                { letter: 'S', type: 'sprinter' }, { letter: 'L', type: 'walker' },
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'walker' },
            ], spawnInterval: 2.3, fallSpeed: 0.6 },
        ]
    },
    {
        id: 4, name: 'Home Guard', world: 'village', kdWorld: 0,
        letters: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
        waves: [
            { enemies: [
                { letter: 'A', type: 'walker' }, { letter: 'F', type: 'walker' },
                { letter: 'J', type: 'walker' }, { letter: ';', type: 'walker' },
                { letter: 'S', type: 'walker' }, { letter: 'L', type: 'walker' },
            ], spawnInterval: 2.8, fallSpeed: 0.5 },
            { enemies: [
                { letter: 'A', type: 'walker' }, { letter: 'D', type: 'sprinter' },
                { letter: 'K', type: 'sprinter' }, { letter: ';', type: 'walker' },
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'walker' },
                { letter: 'S', type: 'sprinter' },
            ], spawnInterval: 2.4, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'D', type: 'sprinter' }, { letter: 'K', type: 'sprinter' },
                { letter: 'A', type: 'walker' }, { letter: ';', type: 'walker' },
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'sprinter' },
                { letter: 'L', type: 'walker' }, { letter: 'S', type: 'walker' },
            ], spawnInterval: 2.2, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'A', type: 'sprinter' }, { letter: 'S', type: 'walker' },
                { letter: 'D', type: 'walker' }, { letter: 'F', type: 'sprinter' },
                { letter: 'J', type: 'sprinter' }, { letter: 'K', type: 'walker' },
                { letter: 'L', type: 'walker' }, { letter: ';', type: 'sprinter' },
            ], spawnInterval: 2.0, fallSpeed: 0.65 },
        ]
    },

    // ============ WORLD 2: Upper Highlands (Top Row) — Levels 5-8 ============
    {
        id: 5, name: 'Reach Up', world: 'highlands', kdWorld: 1,
        letters: ['R', 'U', 'F', 'J', 'D', 'K'],
        waves: [
            { enemies: [
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'walker' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'walker' },
            ], spawnInterval: 3.0, fallSpeed: 0.5 },
            { enemies: [
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'walker' },
                { letter: 'F', type: 'tank' }, { letter: 'J', type: 'walker' },
                { letter: 'R', type: 'walker' },
            ], spawnInterval: 2.6, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'R', type: 'sprinter' }, { letter: 'U', type: 'tank' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'sprinter' },
            ], spawnInterval: 2.3, fallSpeed: 0.6 },
        ]
    },
    {
        id: 6, name: 'Eyes Wide', world: 'highlands', kdWorld: 1,
        letters: ['E', 'I', 'R', 'U', 'F', 'J', 'D', 'K'],
        waves: [
            { enemies: [
                { letter: 'E', type: 'walker' }, { letter: 'I', type: 'walker' },
                { letter: 'E', type: 'walker' }, { letter: 'I', type: 'walker' },
                { letter: 'R', type: 'walker' },
            ], spawnInterval: 2.8, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'E', type: 'walker' }, { letter: 'I', type: 'tank' },
                { letter: 'R', type: 'sprinter' }, { letter: 'U', type: 'walker' },
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'tank' },
            ], spawnInterval: 2.5, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'E', type: 'tank' }, { letter: 'I', type: 'sprinter' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'tank' },
                { letter: 'F', type: 'sprinter' },
            ], spawnInterval: 2.2, fallSpeed: 0.65 },
            { enemies: [
                { letter: 'E', type: 'sprinter' }, { letter: 'I', type: 'tank' },
                { letter: 'R', type: 'tank' }, { letter: 'U', type: 'sprinter' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.7 },
        ]
    },
    {
        id: 7, name: 'Wide Reach', world: 'highlands', kdWorld: 1,
        letters: ['W', 'O', 'E', 'I', 'R', 'U', 'F', 'J'],
        waves: [
            { enemies: [
                { letter: 'W', type: 'walker' }, { letter: 'O', type: 'walker' },
                { letter: 'W', type: 'walker' }, { letter: 'O', type: 'walker' },
                { letter: 'E', type: 'walker' },
            ], spawnInterval: 2.8, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'W', type: 'sprinter' }, { letter: 'O', type: 'walker' },
                { letter: 'E', type: 'tank' }, { letter: 'I', type: 'walker' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'sprinter' },
            ], spawnInterval: 2.4, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'W', type: 'swarm', count: 3 },
                { letter: 'O', type: 'tank' }, { letter: 'E', type: 'sprinter' },
                { letter: 'I', type: 'walker' }, { letter: 'F', type: 'walker' },
                { letter: 'J', type: 'sprinter' },
            ], spawnInterval: 2.2, fallSpeed: 0.65 },
            { enemies: [
                { letter: 'W', type: 'tank' }, { letter: 'O', type: 'swarm', count: 3 },
                { letter: 'E', type: 'sprinter' }, { letter: 'I', type: 'sprinter' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'tank' },
                { letter: 'F', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.7 },
        ]
    },
    {
        id: 8, name: 'Peak Battle', world: 'highlands', kdWorld: 1,
        letters: ['Q', 'W', 'E', 'R', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'J', 'K', 'L'],
        waves: [
            { enemies: [
                { letter: 'Q', type: 'walker' }, { letter: 'P', type: 'walker' },
                { letter: 'W', type: 'walker' }, { letter: 'O', type: 'walker' },
                { letter: 'E', type: 'walker' }, { letter: 'I', type: 'walker' },
            ], spawnInterval: 2.6, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'Q', type: 'tank' }, { letter: 'P', type: 'sprinter' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'walker' },
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'tank' },
                { letter: 'D', type: 'walker' },
            ], spawnInterval: 2.3, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'W', type: 'swarm', count: 3 },
                { letter: 'E', type: 'tank' }, { letter: 'I', type: 'sprinter' },
                { letter: 'O', type: 'walker' }, { letter: 'A', type: 'walker' },
                { letter: 'S', type: 'sprinter' }, { letter: 'L', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.65 },
            { enemies: [
                { letter: 'Q', type: 'swarm', count: 4 },
                { letter: 'P', type: 'tank' }, { letter: 'W', type: 'sprinter' },
                { letter: 'O', type: 'sprinter' }, { letter: 'E', type: 'tank' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'walker' },
                { letter: 'K', type: 'sprinter' },
            ], spawnInterval: 1.8, fallSpeed: 0.7 },
        ]
    },

    // ============ WORLD 3: Lower Depths (Bottom Row) — Levels 9-12 ============
    {
        id: 9, name: 'Going Deep', world: 'depths', kdWorld: 2,
        letters: ['V', 'M', 'F', 'J', 'D', 'K', 'R', 'U'],
        punishment: true,
        waves: [
            { enemies: [
                { letter: 'V', type: 'walker' }, { letter: 'M', type: 'walker' },
                { letter: 'V', type: 'walker' }, { letter: 'M', type: 'walker' },
                { letter: 'F', type: 'walker' },
            ], spawnInterval: 2.8, fallSpeed: 0.5 },
            { enemies: [
                { letter: 'V', type: 'sprinter' }, { letter: 'M', type: 'tank' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'walker' },
                { letter: 'R', type: 'sprinter' }, { letter: 'U', type: 'walker' },
            ], spawnInterval: 2.4, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'V', type: 'tank' }, { letter: 'M', type: 'swarm', count: 3 },
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'walker' },
                { letter: 'D', type: 'walker' }, { letter: 'K', type: 'sprinter' },
            ], spawnInterval: 2.2, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'V', type: 'swarm', count: 3 },
                { letter: 'M', type: 'tank' }, { letter: 'F', type: 'tank' },
                { letter: 'J', type: 'sprinter' }, { letter: 'R', type: 'walker' },
                { letter: 'U', type: 'sprinter' }, { letter: 'D', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.65 },
        ]
    },
    {
        id: 10, name: 'Dark Tunnel', world: 'depths', kdWorld: 2,
        letters: ['C', 'N', 'V', 'M', 'F', 'J', 'D', 'K'],
        punishment: true,
        waves: [
            { enemies: [
                { letter: 'C', type: 'walker' }, { letter: 'N', type: 'walker' },
                { letter: 'C', type: 'walker' }, { letter: 'N', type: 'walker' },
                { letter: 'V', type: 'walker' },
            ], spawnInterval: 2.6, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'C', type: 'sprinter' }, { letter: 'N', type: 'tank' },
                { letter: 'V', type: 'walker' }, { letter: 'M', type: 'sprinter' },
                { letter: 'F', type: 'walker' }, { letter: 'J', type: 'tank' },
            ], spawnInterval: 2.2, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'C', type: 'swarm', count: 3 },
                { letter: 'N', type: 'tank' }, { letter: 'V', type: 'sprinter' },
                { letter: 'M', type: 'walker' }, { letter: 'D', type: 'sprinter' },
                { letter: 'K', type: 'tank' }, { letter: 'F', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.65 },
            { enemies: [
                { letter: 'C', type: 'tank' }, { letter: 'N', type: 'swarm', count: 4 },
                { letter: 'V', type: 'sprinter' }, { letter: 'M', type: 'sprinter' },
                { letter: 'D', type: 'tank' }, { letter: 'K', type: 'walker' },
                { letter: 'F', type: 'sprinter' }, { letter: 'J', type: 'walker' },
            ], spawnInterval: 1.8, fallSpeed: 0.7 },
        ]
    },
    {
        id: 11, name: 'Lava Gauntlet', world: 'depths', kdWorld: 2,
        letters: ['X', 'B', 'C', 'N', 'V', 'M', 'F', 'J', 'D', 'K'],
        punishment: true,
        waves: [
            { enemies: [
                { letter: 'X', type: 'walker' }, { letter: 'B', type: 'walker' },
                { letter: 'X', type: 'walker' }, { letter: 'B', type: 'walker' },
                { letter: 'C', type: 'walker' },
            ], spawnInterval: 2.6, fallSpeed: 0.55 },
            { enemies: [
                { letter: 'X', type: 'sprinter' }, { letter: 'B', type: 'tank' },
                { letter: 'C', type: 'walker' }, { letter: 'N', type: 'sprinter' },
                { letter: 'V', type: 'walker' }, { letter: 'M', type: 'tank' },
            ], spawnInterval: 2.2, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'X', type: 'swarm', count: 3 },
                { letter: 'B', type: 'tank' }, { letter: 'C', type: 'sprinter' },
                { letter: 'N', type: 'walker' }, { letter: 'F', type: 'sprinter' },
                { letter: 'J', type: 'tank' }, { letter: 'D', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.65 },
            { enemies: [
                { letter: 'X', type: 'tank' }, { letter: 'B', type: 'swarm', count: 3 },
                { letter: 'C', type: 'sprinter' }, { letter: 'N', type: 'sprinter' },
                { letter: 'V', type: 'tank' }, { letter: 'M', type: 'walker' },
                { letter: 'K', type: 'sprinter' }, { letter: 'F', type: 'walker' },
            ], spawnInterval: 1.8, fallSpeed: 0.7 },
            { enemies: [
                { letter: 'X', type: 'swarm', count: 4 },
                { letter: 'B', type: 'tank' }, { letter: 'C', type: 'tank' },
                { letter: 'N', type: 'sprinter' }, { letter: 'V', type: 'sprinter' },
                { letter: 'M', type: 'tank' }, { letter: 'D', type: 'walker' },
                { letter: 'K', type: 'walker' }, { letter: 'J', type: 'sprinter' },
            ], spawnInterval: 1.6, fallSpeed: 0.75 },
        ]
    },
    {
        id: 12, name: 'Final Depths', world: 'depths', kdWorld: 2,
        letters: ['Z', '/', 'Q', 'W', 'E', 'R', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        punishment: true,
        waves: [
            { enemies: [
                { letter: 'Z', type: 'walker' }, { letter: '/', type: 'walker' },
                { letter: 'Z', type: 'walker' }, { letter: '/', type: 'walker' },
                { letter: 'X', type: 'walker' }, { letter: 'M', type: 'walker' },
                { letter: 'C', type: 'walker' }, { letter: 'N', type: 'walker' },
            ], spawnInterval: 2.4, fallSpeed: 0.6 },
            { enemies: [
                { letter: 'Z', type: 'tank' }, { letter: '/', type: 'sprinter' },
                { letter: 'A', type: 'walker' }, { letter: 'F', type: 'sprinter' },
                { letter: 'J', type: 'tank' }, { letter: 'L', type: 'walker' },
                { letter: 'V', type: 'sprinter' }, { letter: 'B', type: 'walker' },
            ], spawnInterval: 2.0, fallSpeed: 0.65 },
            { enemies: [
                { letter: 'Z', type: 'swarm', count: 3 },
                { letter: 'Q', type: 'tank' }, { letter: 'P', type: 'sprinter' },
                { letter: 'W', type: 'walker' }, { letter: 'O', type: 'walker' },
                { letter: 'E', type: 'sprinter' }, { letter: 'I', type: 'tank' },
                { letter: 'R', type: 'walker' }, { letter: 'U', type: 'walker' },
            ], spawnInterval: 1.8, fallSpeed: 0.7 },
            { enemies: [
                { letter: '/', type: 'swarm', count: 4 },
                { letter: 'S', type: 'tank' }, { letter: 'D', type: 'sprinter' },
                { letter: 'K', type: 'sprinter' }, { letter: 'X', type: 'tank' },
                { letter: 'C', type: 'walker' }, { letter: 'N', type: 'walker' },
                { letter: 'V', type: 'sprinter' }, { letter: 'M', type: 'tank' },
                { letter: 'B', type: 'sprinter' },
            ], spawnInterval: 1.6, fallSpeed: 0.75 },
            { enemies: [
                { letter: 'Z', type: 'swarm', count: 4 },
                { letter: '/', type: 'tank' },
                { letter: 'Q', type: 'sprinter' }, { letter: 'P', type: 'sprinter' },
                { letter: 'A', type: 'tank' }, { letter: 'L', type: 'tank' },
                { letter: 'F', type: 'swarm', count: 3 },
                { letter: 'J', type: 'sprinter' }, { letter: 'D', type: 'walker' },
                { letter: 'K', type: 'walker' }, { letter: 'X', type: 'sprinter' },
                { letter: 'M', type: 'walker' },
            ], spawnInterval: 1.5, fallSpeed: 0.8 },
        ]
    },
];

// KD power unlock thresholds (based on KD level completed)
const KD_POWER_UNLOCKS = {
    fireball:  2,
    shield:    3,
    slowClock: 5,
    blizzard:  7,
    dragon:    9,
    lavaMoat:  11,
};

// ============================================
// KD Progression (separate save from Letter March)
// ============================================
const KDProgression = {
    SAVE_KEY: 'letterDefenders_kd_progress',

    loadProgress() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) { /* ignore */ }
        return {};
    },

    saveLevel(levelIndex, stars, completionTime) {
        const progress = this.loadProgress();
        const key = 'kd_level_' + (levelIndex + 1);
        const existing = progress[key] || { stars: 0, bestTime: null };

        const newEntry = {
            stars: Math.max(existing.stars || 0, stars),
            bestTime: existing.bestTime,
        };

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
        const entry = progress['kd_level_' + (levelIndex + 1)];
        if (!entry) return 0;
        return entry.stars || 0;
    },

    getLevelBestTime(levelIndex) {
        const progress = this.loadProgress();
        const entry = progress['kd_level_' + (levelIndex + 1)];
        if (!entry) return null;
        return entry.bestTime || null;
    },

    isLevelUnlocked(levelIndex) {
        if (levelIndex === 0) return true;
        return this.getLevelStars(levelIndex - 1) >= 1;
    },

    getHighestUnlockedLevel() {
        let highest = 1;
        for (let i = 0; i < KD_LEVELS.length; i++) {
            if (this.getLevelStars(i) >= 1) {
                highest = Math.max(highest, i + 2);
            }
        }
        return highest;
    },
};

// ============================================
// Keyboard Defense Mode — Main Object
// ============================================
const KeyboardDefense = {
    // Keyboard layout
    keyRows: [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
    ],

    // Keyboard geometry (calculated on resize)
    keyRects: {},    // { 'A': { x, y, w, h }, ... }
    kbStartY: 0,
    kbHeight: 0,
    keyWidth: 0,
    keyHeight: 0,
    kbPadding: 0,

    // Falling enemies
    fallingEnemies: [],
    spawnTimer: 0,
    spawnQueue: [],
    currentFallSpeed: 0.5,
    currentInterval: 3.0,

    // Game state
    currentLevel: 0,
    currentWave: 0,
    hearts: 5,
    score: 0,
    combo: 0,
    maxCombo: 0,
    levelTime: 0,
    timerRunning: false,
    waveIntroTimer: 0,
    waveIntroActive: false,
    waveComplete: false,
    levelComplete: false,
    _isNewBest: false,
    _completionTime: 0,

    // Key flash state
    keyFlashes: {},  // { 'A': { type: 'CORRECT'|'WRONG', timer: 0.3 }, ... }

    // Target key glow
    targetKeys: {},  // { 'A': true, ... }

    // Finger guide
    fingerGuideOn: true,
    fingerGuideBtn: null,

    // Punishment flash
    punishmentFlash: 0,

    // World 3 warning shown
    _depthsWarningShown: false,
    _depthsWarningTimer: 0,

    // Power system
    powerInventory: [],
    powerSelectedIndex: 0,
    powerPickup: null,
    powerPickupCooldown: 0,

    // Reuse slow/freeze/shield state from power effects
    shieldActive: false,
    shieldTimer: 0,
    slowActive: false,
    slowTimer: 0,
    freezeActive: false,
    freezeTimer: 0,

    // World map state
    worldMap: {
        scrollX: 0,
        targetScrollX: 0,
        totalWidth: 0,
        dragging: false,
        dragStartX: 0,
        dragStartScroll: 0,
        nodePositions: [],
        _clickX: null,
        _clickY: null,
    },

    // ============ INIT ============

    init(levelIndex) {
        this.currentLevel = levelIndex;
        this.currentWave = 0;
        this.hearts = CONFIG.MAX_HEARTS;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.levelTime = 0;
        this.timerRunning = false;
        this.waveIntroTimer = 0;
        this.waveIntroActive = true;
        this.waveComplete = false;
        this.levelComplete = false;
        this._isNewBest = false;
        this._completionTime = 0;

        this.fallingEnemies = [];
        this.spawnTimer = 0;
        this.spawnQueue = [];
        this.keyFlashes = {};
        this.targetKeys = {};

        this.powerInventory = [];
        this.powerSelectedIndex = 0;
        this.powerPickup = null;
        this.powerPickupCooldown = 0;
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.slowActive = false;
        this.slowTimer = 0;
        this.freezeActive = false;
        this.freezeTimer = 0;

        this.punishmentFlash = 0;

        Particles.clear();
        FloatingTexts.clear();

        this.resizeKeyboard();
        this.startWaveIntro();

        // Show world 3 warning
        const level = KD_LEVELS[levelIndex];
        if (level.punishment && !this._depthsWarningShown) {
            this._depthsWarningShown = true;
            this._depthsWarningTimer = 4.0;
        } else {
            this._depthsWarningTimer = 0;
        }
    },

    resizeKeyboard() {
        const w = Game.width;
        const h = Game.height;
        this.kbHeight = h * 0.55;
        this.kbStartY = h - this.kbHeight;
        this.kbPadding = w * 0.02;

        const availW = w - this.kbPadding * 2;
        const maxCols = 10;
        const gap = Math.max(2, availW * 0.008);
        this.keyWidth = (availW - gap * (maxCols - 1)) / maxCols;
        this.keyHeight = (this.kbHeight - this.kbPadding * 2 - gap * 3) / 3.5;

        this.keyRects = {};

        for (let r = 0; r < this.keyRows.length; r++) {
            const row = this.keyRows[r];
            const rowOffset = r * this.keyWidth * 0.15;
            const rowY = this.kbStartY + this.kbPadding + r * (this.keyHeight + gap);

            for (let c = 0; c < row.length; c++) {
                const key = row[c];
                const kx = this.kbPadding + rowOffset + c * (this.keyWidth + gap);
                this.keyRects[key] = {
                    x: kx,
                    y: rowY,
                    w: this.keyWidth,
                    h: this.keyHeight,
                    row: r,
                    col: c,
                };
            }
        }

        // Space bar at bottom
        const spaceY = this.kbStartY + this.kbPadding + 3 * (this.keyHeight + gap);
        const spaceW = this.keyWidth * 5 + gap * 4;
        const spaceX = w / 2 - spaceW / 2;
        this.keyRects[' '] = {
            x: spaceX,
            y: spaceY,
            w: spaceW,
            h: this.keyHeight * 0.7,
            row: 3,
            col: 0,
        };
    },

    // ============ WAVE MANAGEMENT ============

    startWaveIntro() {
        this.waveIntroActive = true;
        this.waveIntroTimer = 3.0;
        this.waveComplete = false;
    },

    startCurrentWave() {
        const level = KD_LEVELS[this.currentLevel];
        const waveDef = level.waves[this.currentWave];
        if (waveDef) {
            this.currentFallSpeed = waveDef.fallSpeed || 0.5;
            this.currentInterval = waveDef.spawnInterval || 3.0;
            this.spawnTimer = 0;
            this.spawnQueue = [];

            for (let i = 0; i < waveDef.enemies.length; i++) {
                const entry = waveDef.enemies[i];
                if (typeof entry === 'string') {
                    this.spawnQueue.push({ letter: entry, type: 'walker', count: 1 });
                } else {
                    this.spawnQueue.push({
                        letter: entry.letter,
                        type: entry.type || 'walker',
                        count: entry.count || 1,
                    });
                }
            }
        }
        this.waveIntroActive = false;
        this.waveComplete = false;
        this.timerRunning = true;
    },

    getLevelDef() {
        return KD_LEVELS[this.currentLevel];
    },

    getTotalWaves() {
        return KD_LEVELS[this.currentLevel].waves.length;
    },

    getStars() {
        const lost = CONFIG.MAX_HEARTS - this.hearts;
        if (lost === 0) return 3;
        if (lost <= 2) return 2;
        return 1;
    },

    // ============ SPAWNING ============

    spawnFallingEnemy(letter, type, targetKey) {
        type = type || 'walker';
        const typeDef = ENEMY_TYPES[type] || ENEMY_TYPES.walker;
        const keyRect = this.keyRects[targetKey || letter.toUpperCase()];
        if (!keyRect) return;

        const targetX = keyRect.x + keyRect.w / 2;
        const targetY = keyRect.y;

        // Start above the play area
        const startY = -40;
        const startX = targetX + (Math.random() - 0.5) * 20;

        const fallDist = targetY - startY;

        this.fallingEnemies.push({
            letter: letter.toUpperCase(),
            type: type,
            x: startX,
            y: startY,
            targetX: targetX,
            targetY: targetY,
            targetKey: targetKey || letter.toUpperCase(),
            startY: startY,
            fallDistance: fallDist,
            fallProgress: 0,
            fallSpeed: this.currentFallSpeed * typeDef.speedMultiplier,
            alive: true,
            bodyColor: typeDef.color,
            darkColor: typeDef.darkColor,
            sizeMultiplier: typeDef.sizeMultiplier,
            bobOffset: Math.random() * Math.PI * 2,
            damaged: false,
            needsShift: false,
            flash: null,
            damageFlash: null,
            trailPositions: [],
            swarmGroup: 0,
        });
    },

    // ============ UPDATE ============

    update(dt) {
        // Depths warning timer
        if (this._depthsWarningTimer > 0) {
            this._depthsWarningTimer -= dt;
        }

        // Wave intro countdown
        if (this.waveIntroActive) {
            this.timerRunning = false;
            this.waveIntroTimer -= dt;
            if (this.waveIntroTimer <= 0) {
                this.startCurrentWave();
            }
            return;
        }

        // Timer
        if (this.timerRunning) {
            this.levelTime += dt;
        }

        // Spawn enemies
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.currentInterval && this.spawnQueue.length > 0) {
            this.spawnTimer = 0;
            const entry = this.spawnQueue.shift();

            if (entry.type === 'swarm') {
                const count = entry.count || 3;
                const levelLetters = this.getLevelDef().letters.slice();
                const pool = levelLetters.slice();
                const picked = [];
                while (picked.length < count && pool.length > 0) {
                    const idx = Math.floor(Math.random() * pool.length);
                    picked.push(pool[idx]);
                    pool.splice(idx, 1);
                }
                while (picked.length < count) {
                    picked.push(levelLetters[Math.floor(Math.random() * levelLetters.length)]);
                }
                picked[0] = entry.letter;
                for (let s = 0; s < count; s++) {
                    this.spawnFallingEnemy(picked[s], 'swarm', picked[s]);
                }
            } else {
                this.spawnFallingEnemy(entry.letter, entry.type);
            }
        }

        // Update falling enemies
        const speedMult = this.getSpeedMultiplier();
        this.targetKeys = {};

        for (let i = this.fallingEnemies.length - 1; i >= 0; i--) {
            const enemy = this.fallingEnemies[i];

            enemy.fallProgress += enemy.fallSpeed * dt * speedMult;
            enemy.y = enemy.startY + enemy.fallDistance * enemy.fallProgress;
            // Lerp x toward target
            enemy.x = lerp(enemy.x, enemy.targetX, 0.05);

            // Track target keys
            if (enemy.alive) {
                this.targetKeys[enemy.targetKey] = true;
            }

            // Sprinter trail
            if (enemy.type === 'sprinter' && enemy.alive) {
                enemy.trailPositions.push({ x: enemy.x, y: enemy.y, age: 0 });
                if (enemy.trailPositions.length > 6) enemy.trailPositions.shift();
                for (let t = 0; t < enemy.trailPositions.length; t++) {
                    enemy.trailPositions[t].age += dt;
                }
            }

            // Damage flash
            if (enemy.damageFlash) {
                enemy.damageFlash.update(dt);
                if (!enemy.damageFlash.active) enemy.damageFlash = null;
            }

            // Destroy flash
            if (enemy.flash) {
                enemy.flash.update(dt);
                if (!enemy.flash.active) {
                    enemy.flash = null;
                    if (!enemy.alive) {
                        this.fallingEnemies.splice(i, 1);
                        continue;
                    }
                }
            }

            // Reached target key
            if (enemy.fallProgress >= 1 && enemy.alive) {
                // Check shield
                if (this.shieldActive) {
                    this.shieldActive = false;
                    this.shieldTimer = 0;
                    enemy.alive = false;
                    Particles.spawn(enemy.x, enemy.y, '#00CCCC', 10);
                    FloatingTexts.spawn(enemy.x, enemy.y - 30, 'BLOCKED!', '#00FFFF', 16);
                    this.fallingEnemies.splice(i, 1);
                    continue;
                }

                enemy.alive = false;
                this.fallingEnemies.splice(i, 1);

                // Lost a heart
                this.hearts = Math.max(0, this.hearts - 1);
                this.combo = 0;
                this.flashKey(enemy.targetKey, 'WRONG');
                ScreenShake.trigger(10, 0.4);
                Particles.spawn(enemy.x, enemy.y, '#FF4444', 8);

                if (this.hearts <= 0) {
                    this.timerRunning = false;
                    Game.state = STATES.GAME_OVER;
                }
            }
        }

        // Key flashes
        for (const key in this.keyFlashes) {
            this.keyFlashes[key].timer -= dt;
            if (this.keyFlashes[key].timer <= 0) {
                delete this.keyFlashes[key];
            }
        }

        // Punishment flash
        if (this.punishmentFlash > 0) {
            this.punishmentFlash -= dt;
        }

        // Power effects
        this.updatePowerEffects(dt);

        // Power pickup
        if (this.powerPickup) {
            this.powerPickup.timer -= dt;
            if (this.powerPickup.timer <= 0) {
                this.powerPickup = null;
            }
        }
        if (this.powerPickupCooldown > 0) {
            this.powerPickupCooldown -= dt;
        }

        Particles.update(dt);
        FloatingTexts.update(dt);

        // Wave completion
        if (!this.waveComplete && this.spawnQueue.length === 0 && this.fallingEnemies.length === 0) {
            this.waveComplete = true;
            this.currentWave++;

            if (this.currentWave >= this.getTotalWaves()) {
                this.levelComplete = true;
                this.timerRunning = false;
                const stars = this.getStars();
                const time = Math.round(this.levelTime * 100) / 100;
                const saveResult = KDProgression.saveLevel(this.currentLevel, stars, time);
                this._isNewBest = (saveResult.bestTime === time);
                this._completionTime = time;
                Game.state = STATES.WIN;
            } else {
                Game.state = STATES.WAVE_INTRO;
                this.startWaveIntro();
            }
        }
    },

    getSpeedMultiplier() {
        if (this.freezeActive) return 0;
        if (this.slowActive) return 0.5;
        return 1.0;
    },

    updatePowerEffects(dt) {
        if (this.shieldActive) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) this.shieldActive = false;
        }
        if (this.slowActive) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) this.slowActive = false;
        }
        if (this.freezeActive) {
            this.freezeTimer -= dt;
            if (this.freezeTimer <= 0) this.freezeActive = false;
        }
    },

    flashKey(key, type) {
        this.keyFlashes[key] = { type: type, timer: 0.3 };
    },

    // ============ INPUT ============

    processInput(letter, shifted) {
        if (this.waveIntroActive) return;

        // Check power pickup first
        if (this.powerPickup && this.powerPickup.letter === letter.toUpperCase()) {
            this.collectPowerPickup();
            this.flashKey(letter, 'CORRECT');
            return;
        }

        const hit = this.tryHitEnemy(letter, shifted);
        if (hit) {
            this.flashKey(letter, 'CORRECT');

            if (hit._tankDamaged) {
                ScreenShake.trigger(3, 0.1);
                FloatingTexts.spawn(hit.x, hit.y - 20, 'Now SHIFT+' + hit.letter + '!', '#FFDD44', 10);
                return;
            }

            ScreenShake.trigger(4, 0.15);
            const points = this.scoreKill(hit.fallProgress);
            FloatingTexts.spawn(hit.x, hit.y - 20, '+' + points, COLORS.SCORE_COLOR, 14);

            if (this.combo >= 2) {
                FloatingTexts.spawn(hit.x + 20, hit.y - 40, 'x' + this.combo + '!', COLORS.COMBO_COLOR, 12);
            }

            if (this.combo === 3) FloatingTexts.spawn(hit.x, hit.y - 60, 'NICE!', '#44FF44', 16);
            else if (this.combo === 5) FloatingTexts.spawn(hit.x, hit.y - 60, 'GREAT!', '#44DDFF', 18);
            else if (this.combo === 7) FloatingTexts.spawn(hit.x, hit.y - 60, 'PERFECT!', '#FF44FF', 20);
            else if (this.combo > 7 && this.combo % 3 === 0) FloatingTexts.spawn(hit.x, hit.y - 60, 'AMAZING!', '#FFD700', 20);

            // Try spawn power pickup
            this.trySpawnPowerPickup(hit.x, hit.y);
        } else {
            this.flashKey(letter, 'WRONG');
            this.combo = 0;

            // Punishment mechanic (World 3)
            const level = KD_LEVELS[this.currentLevel];
            if (level.punishment) {
                this.triggerPunishment();
            }
        }
    },

    scoreKill(fallProgress) {
        let points = 10;
        if (fallProgress < 0.3) points += 5;
        else if (fallProgress < 0.5) points += 3;
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        this.score += points;
        return points;
    },

    triggerPunishment() {
        // All falling enemies jump closer
        for (let i = 0; i < this.fallingEnemies.length; i++) {
            const e = this.fallingEnemies[i];
            if (e.alive) {
                e.fallProgress = Math.min(e.fallProgress + 0.12, 0.95);
                e.y = e.startY + e.fallDistance * e.fallProgress;
            }
        }
        this.punishmentFlash = 0.4;
        ScreenShake.trigger(6, 0.2);
        FloatingTexts.spawn(Game.width / 2, this.kbStartY * 0.3, 'WRONG KEY!', '#FF4444', 18);
    },

    tryHitEnemy(letter, shifted) {
        letter = letter.toUpperCase();

        // Swarm: kill one unit matching the letter
        for (let i = 0; i < this.fallingEnemies.length; i++) {
            const enemy = this.fallingEnemies[i];
            if (enemy.letter === letter && enemy.alive && enemy.type === 'swarm') {
                enemy.alive = false;
                Particles.spawn(enemy.x, enemy.y, enemy.bodyColor, 6);
                const hitEnemy = { letter: enemy.letter, x: enemy.x, y: enemy.y, fallProgress: enemy.fallProgress };
                this.fallingEnemies.splice(i, 1);
                return hitEnemy;
            }
        }

        // Tank: two-phase
        for (let i = 0; i < this.fallingEnemies.length; i++) {
            const enemy = this.fallingEnemies[i];
            if (enemy.letter === letter && enemy.alive && enemy.type === 'tank') {
                if (!enemy.damaged && !shifted) {
                    enemy.damaged = true;
                    enemy.needsShift = true;
                    enemy.damageFlash = createFlash(0.3);
                    // Brief pause
                    enemy.fallProgress = Math.max(0, enemy.fallProgress - 0.05);
                    return { _tankDamaged: true, letter: enemy.letter, x: enemy.x, y: enemy.y, fallProgress: enemy.fallProgress };
                } else if (enemy.damaged && shifted) {
                    enemy.alive = false;
                    Particles.spawn(enemy.x, enemy.y, enemy.bodyColor, 8);
                    const hitEnemy = { letter: enemy.letter, x: enemy.x, y: enemy.y, fallProgress: enemy.fallProgress };
                    this.fallingEnemies.splice(i, 1);
                    return hitEnemy;
                }
                continue;
            }
        }

        // Regular enemies (walker, sprinter)
        for (let i = 0; i < this.fallingEnemies.length; i++) {
            const enemy = this.fallingEnemies[i];
            if (enemy.letter === letter && enemy.alive && enemy.type !== 'tank' && enemy.type !== 'swarm') {
                enemy.alive = false;
                Particles.spawn(enemy.x, enemy.y, enemy.bodyColor, 8);
                const hitEnemy = { letter: enemy.letter, x: enemy.x, y: enemy.y, fallProgress: enemy.fallProgress };
                this.fallingEnemies.splice(i, 1);
                return hitEnemy;
            }
        }

        return null;
    },

    processSpecialKey(key) {
        if (this.waveIntroActive) return;
        if (key === 'SPACE') {
            this.activatePower();
        } else if (key === 'ALT') {
            this.rotatePower();
        }
    },

    // ============ POWER SYSTEM (KD-specific) ============

    getKDHighestLevel() {
        return KDProgression.getHighestUnlockedLevel();
    },

    isKDPowerUnlocked(powerType) {
        const threshold = KD_POWER_UNLOCKS[powerType];
        if (!threshold) return false;
        return this.getKDHighestLevel() >= threshold;
    },

    getUnlockedKDPowers() {
        const result = [];
        const keys = ['fireball', 'shield', 'slowClock', 'blizzard', 'dragon', 'lavaMoat'];
        for (let i = 0; i < keys.length; i++) {
            if (this.isKDPowerUnlocked(keys[i])) {
                result.push(keys[i]);
            }
        }
        return result;
    },

    trySpawnPowerPickup(x, y) {
        if (this.currentLevel + 1 < 2) return false;
        if (this.powerPickup) return false;
        if (this.powerPickupCooldown > 0) return false;

        const unlocked = this.getUnlockedKDPowers();
        if (unlocked.length === 0) return false;

        if (Math.random() > 0.18) return false;

        const powerType = unlocked[Math.floor(Math.random() * unlocked.length)];
        const levelDef = this.getLevelDef();
        const letters = levelDef.letters;
        const letter = letters[Math.floor(Math.random() * letters.length)];

        this.powerPickup = {
            x: x,
            y: Math.min(y, this.kbStartY - 60),
            letter: letter,
            powerType: powerType,
            timer: 8.0,
            maxTimer: 8.0,
            bobOffset: Math.random() * Math.PI * 2,
        };

        const def = POWER_TYPES[powerType];
        FloatingTexts.spawn(x, y - 40, 'POWER UP!', def.color, 16);
        return true;
    },

    collectPowerPickup() {
        if (!this.powerPickup) return;
        const powerType = this.powerPickup.powerType;

        if (this.powerInventory.length >= 3) {
            this.powerInventory.shift();
            if (this.powerSelectedIndex >= this.powerInventory.length) {
                this.powerSelectedIndex = Math.max(0, this.powerInventory.length - 1);
            }
        }
        this.powerInventory.push(powerType);

        const def = POWER_TYPES[powerType];
        Particles.spawn(this.powerPickup.x, this.powerPickup.y, def.color, 10);
        FloatingTexts.spawn(this.powerPickup.x, this.powerPickup.y - 30, def.name + '!', def.color, 14);

        this.powerPickup = null;
        this.powerPickupCooldown = 0.3;
    },

    rotatePower() {
        if (this.powerInventory.length <= 1) return;
        this.powerSelectedIndex = (this.powerSelectedIndex + 1) % this.powerInventory.length;
    },

    activatePower() {
        if (this.powerInventory.length === 0) return false;
        if (this.powerSelectedIndex >= this.powerInventory.length) return false;

        const powerType = this.powerInventory[this.powerSelectedIndex];
        this.powerInventory.splice(this.powerSelectedIndex, 1);
        if (this.powerSelectedIndex >= this.powerInventory.length) {
            this.powerSelectedIndex = Math.max(0, this.powerInventory.length - 1);
        }

        this._activateKDPower(powerType);
        return true;
    },

    _activateKDPower(powerType) {
        switch (powerType) {
            case 'fireball':
                // Destroy enemy closest to landing
                let target = null;
                let maxProg = -1;
                for (let i = 0; i < this.fallingEnemies.length; i++) {
                    const e = this.fallingEnemies[i];
                    if (e.alive && e.fallProgress > maxProg) {
                        maxProg = e.fallProgress;
                        target = e;
                    }
                }
                if (target) {
                    target.alive = false;
                    Particles.spawn(target.x, target.y, '#FF6600', 14);
                    Particles.spawn(target.x, target.y, '#FFCC00', 8);
                    FloatingTexts.spawn(target.x, target.y - 20, 'BOOM!', '#FF6600', 18);
                    const idx = this.fallingEnemies.indexOf(target);
                    if (idx !== -1) this.fallingEnemies.splice(idx, 1);
                }
                break;
            case 'shield':
                this.shieldActive = true;
                this.shieldTimer = 12.0;
                FloatingTexts.spawn(Game.width / 2, this.kbStartY - 40, 'SHIELD!', '#00CCCC', 16);
                break;
            case 'slowClock':
                this.slowActive = true;
                this.slowTimer = 5.0;
                FloatingTexts.spawn(Game.width / 2, this.kbStartY * 0.4, 'SLOW!', '#6699FF', 20);
                break;
            case 'blizzard':
                this.freezeActive = true;
                this.freezeTimer = 4.0;
                FloatingTexts.spawn(Game.width / 2, this.kbStartY * 0.4, 'FREEZE!', '#CCDDFF', 20);
                break;
            case 'dragon':
                // Sweep across all falling enemies and destroy them
                for (let i = this.fallingEnemies.length - 1; i >= 0; i--) {
                    const e = this.fallingEnemies[i];
                    if (e.alive) {
                        e.alive = false;
                        Particles.spawn(e.x, e.y, '#FF6600', 8);
                        Particles.spawn(e.x, e.y, '#FFD700', 6);
                        this.fallingEnemies.splice(i, 1);
                    }
                }
                FloatingTexts.spawn(Game.width / 2, this.kbStartY * 0.3, 'DRAGON!', '#FFD700', 22);
                break;
            case 'lavaMoat':
                // Create barrier zone — enemies that enter bottom 20% are destroyed for 4s
                this._lavaMoatActive = true;
                this._lavaMoatTimer = 4.0;
                FloatingTexts.spawn(Game.width / 2, this.kbStartY - 40, 'LAVA BARRIER!', '#FF3300', 18);
                break;
        }
    },

    // ============ TOUCH INPUT ============

    handleTouch(x, y) {
        // Finger guide toggle button
        if (this.fingerGuideBtn && pointInRect(x, y, this.fingerGuideBtn.x, this.fingerGuideBtn.y, this.fingerGuideBtn.w, this.fingerGuideBtn.h)) {
            this.fingerGuideOn = !this.fingerGuideOn;
            return true;
        }

        // Power USE/ROTATE buttons
        if (this._useBtn && pointInRect(x, y, this._useBtn.x, this._useBtn.y, this._useBtn.w, this._useBtn.h)) {
            this.activatePower();
            return true;
        }
        if (this._rotBtn && pointInRect(x, y, this._rotBtn.x, this._rotBtn.y, this._rotBtn.w, this._rotBtn.h)) {
            this.rotatePower();
            return true;
        }

        // Key taps
        for (const key in this.keyRects) {
            const rect = this.keyRects[key];
            if (pointInRect(x, y, rect.x, rect.y, rect.w, rect.h)) {
                if (key === ' ') {
                    this.activatePower();
                } else {
                    return key;
                }
                return true;
            }
        }

        return false;
    },

    // ============ RENDERING ============

    render(ctx) {
        const w = Game.width;
        const h = Game.height;
        const level = KD_LEVELS[this.currentLevel];
        const worldTheme = KD_WORLD_THEMES[level.world] || KD_WORLD_THEMES.village;

        // Sky background
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.kbStartY);
        skyGrad.addColorStop(0, worldTheme.skyTop);
        skyGrad.addColorStop(1, worldTheme.skyBottom);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, this.kbStartY);

        // World-specific background decorations
        this.renderWorldBG(ctx, level.world);

        // Punishment flash overlay
        if (this.punishmentFlash > 0) {
            ctx.fillStyle = 'rgba(255,0,0,' + (this.punishmentFlash * 0.4) + ')';
            ctx.fillRect(0, 0, w, this.kbStartY);
        }

        // Slow/freeze overlay on play area
        if (this.freezeActive) {
            ctx.fillStyle = 'rgba(150,180,255,0.15)';
            ctx.fillRect(0, 0, w, this.kbStartY);
        } else if (this.slowActive) {
            ctx.fillStyle = 'rgba(100,150,255,0.1)';
            ctx.fillRect(0, 0, w, this.kbStartY);
        }

        // Render falling enemies
        this.renderFallingEnemies(ctx);

        // Power pickup
        if (this.powerPickup) {
            this.renderPowerPickup(ctx);
        }

        // Keyboard
        this.renderKeyboard(ctx);

        // Finger guide overlay
        if (this.fingerGuideOn) {
            this.renderFingerGuide(ctx);
        }

        // Particles and floating texts
        Particles.render(ctx);
        FloatingTexts.render(ctx);

        // HUD
        this.renderHUD(ctx);

        // Power inventory
        this.renderPowerInventory(ctx);

        // Finger guide toggle button
        this.renderFingerGuideToggle(ctx);

        // Wave intro overlay
        if (this.waveIntroActive) {
            this.renderWaveIntro(ctx);
        }

        // Depths warning overlay
        if (this._depthsWarningTimer > 0) {
            this.renderDepthsWarning(ctx);
        }
    },

    renderWorldBG(ctx, world) {
        const w = Game.width;
        const h = this.kbStartY;
        const t = Game.time;

        if (world === 'village') {
            // Peaceful village: clouds, sun, houses
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            for (let i = 0; i < 4; i++) {
                const cx = ((i * w * 0.28 + t * 10) % (w * 1.2)) - w * 0.1;
                const cy = h * 0.1 + (i % 3) * h * 0.06;
                const cw = h * 0.1;
                const ch = h * 0.03;
                ctx.fillRect(cx, cy, cw, ch);
                ctx.fillRect(cx + cw * 0.2, cy - ch * 0.6, cw * 0.6, ch * 0.6);
            }
            // Houses at bottom of sky
            for (let i = 0; i < 5; i++) {
                const hx = w * 0.05 + i * w * 0.2;
                const hy = h - h * 0.15;
                const hw = w * 0.06;
                const hh = h * 0.1;
                ctx.fillStyle = '#8B6914';
                ctx.fillRect(hx, hy, hw, hh);
                ctx.fillStyle = '#CC4444';
                ctx.fillRect(hx - hw * 0.1, hy - hh * 0.4, hw * 1.2, hh * 0.4);
                ctx.fillStyle = '#87CEEB';
                ctx.fillRect(hx + hw * 0.3, hy + hh * 0.3, hw * 0.25, hw * 0.25);
            }
        } else if (world === 'highlands') {
            // Mountains
            ctx.fillStyle = '#7888A0';
            for (let i = 0; i < 5; i++) {
                const mx = w * 0.1 + i * w * 0.2;
                const mh = h * 0.3 + (i % 3) * h * 0.1;
                const mw = w * 0.18;
                const steps = 6;
                for (let s = 0; s < steps; s++) {
                    const ratio = 1 - s / steps;
                    const sw = mw * ratio;
                    const sh = mh / steps;
                    ctx.fillRect(mx + (mw - sw) / 2, h - h * 0.08 - (s + 1) * sh, sw, sh);
                }
                // Snow cap
                ctx.fillStyle = '#D8E8F4';
                for (let s = Math.floor(steps * 0.7); s < steps; s++) {
                    const ratio = 1 - s / steps;
                    const sw = mw * ratio;
                    const sh = mh / steps;
                    ctx.fillRect(mx + (mw - sw) / 2, h - h * 0.08 - (s + 1) * sh, sw, sh);
                }
                ctx.fillStyle = '#7888A0';
            }
            // Snowflakes
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            for (let i = 0; i < 15; i++) {
                const sx = ((i * w * 0.07 + Math.sin(t * 0.5 + i) * 10) % w);
                const sy = ((i * h * 0.07 + t * 20 + i * 5) % h);
                ctx.fillRect(sx, sy, 3, 3);
            }
        } else if (world === 'depths') {
            // Cave stalactites from top
            ctx.fillStyle = '#3A2A1A';
            for (let i = 0; i < 10; i++) {
                const sx = w * 0.05 + i * w * 0.1;
                const sl = h * 0.05 + (i % 3) * h * 0.03;
                const sw = h * 0.015;
                ctx.fillRect(sx - sw / 2, 0, sw, sl);
                ctx.fillRect(sx - sw * 0.3, sl, sw * 0.6, sl * 0.3);
            }
            // Lava glow at bottom
            ctx.globalAlpha = 0.3 + Math.sin(t * 2) * 0.1;
            ctx.fillStyle = '#FF4400';
            ctx.fillRect(0, h - h * 0.05, w, h * 0.05);
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(0, h - h * 0.03, w, h * 0.03);
            ctx.globalAlpha = 1;
            // Embers
            for (let i = 0; i < 8; i++) {
                const ex = ((i * w * 0.13 + Math.sin(t + i * 2) * 8) % w);
                const ey = h - ((t * 30 + i * h * 0.08) % (h * 0.6));
                const alpha = Math.max(0, 0.5 - ey / h);
                ctx.fillStyle = 'rgba(255,80,0,' + alpha + ')';
                ctx.fillRect(ex, ey, 4, 4);
            }
        }
    },

    renderFallingEnemies(ctx) {
        const time = Game.time;

        for (let i = 0; i < this.fallingEnemies.length; i++) {
            const enemy = this.fallingEnemies[i];
            const baseSize = Math.max(24, this.keyWidth * 0.7) * enemy.sizeMultiplier;
            const halfSize = baseSize / 2;
            const bob = Math.sin(time * 6 + enemy.bobOffset) * 3;
            const ex = enemy.x - halfSize;
            const ey = enemy.y - halfSize + bob;

            // Don't draw if above screen
            if (ey + baseSize < -10) continue;

            // Destroy flash
            if (enemy.flash && enemy.flash.active) {
                const flashAlpha = 1 - enemy.flash.progress;
                const scale = 1 + enemy.flash.progress * 0.5;
                const sx = enemy.x - halfSize * scale;
                const sy = enemy.y - halfSize * scale + bob;
                ctx.globalAlpha = flashAlpha;
                ctx.fillStyle = COLORS.WHITE;
                ctx.fillRect(sx, sy, baseSize * scale, baseSize * scale);
                ctx.globalAlpha = 1;
                continue;
            }

            // Sprinter trail
            if (enemy.type === 'sprinter' && enemy.trailPositions.length > 1) {
                for (let t = 0; t < enemy.trailPositions.length - 1; t++) {
                    const tp = enemy.trailPositions[t];
                    const alpha = 0.15 * (1 - t / enemy.trailPositions.length);
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = enemy.bodyColor;
                    const trailSize = baseSize * 0.6;
                    ctx.fillRect(tp.x - trailSize / 2, tp.y - trailSize / 2, trailSize, trailSize);
                }
                ctx.globalAlpha = 1;
            }

            // Damage flash overlay for tanks
            if (enemy.damageFlash && enemy.damageFlash.active) {
                const flashProgress = enemy.damageFlash.progress;
                if (flashProgress < 0.5) {
                    ctx.fillStyle = '#FFDD44';
                    ctx.globalAlpha = 0.6 * (1 - flashProgress * 2);
                    ctx.fillRect(ex - 2, ey - 2, baseSize + 4, baseSize + 4);
                    ctx.globalAlpha = 1;
                }
            }

            // Freeze overlay
            if (this.freezeActive) {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#CCDDFF';
                ctx.fillRect(ex - 2, ey - 2, baseSize + 4, baseSize + 4);
                ctx.globalAlpha = 1;
            }

            // Body
            ctx.fillStyle = enemy.bodyColor;
            ctx.fillRect(ex, ey, baseSize, baseSize);

            // Outline
            const outlineW = enemy.type === 'tank' ? 4 : 3;
            ctx.fillStyle = enemy.darkColor;
            ctx.fillRect(ex, ey, baseSize, outlineW);
            ctx.fillRect(ex, ey, outlineW, baseSize);
            ctx.fillRect(ex + baseSize - outlineW, ey, outlineW, baseSize);
            ctx.fillRect(ex, ey + baseSize - outlineW, baseSize, outlineW);

            // Tank horns
            if (enemy.type === 'tank') {
                ctx.fillStyle = enemy.darkColor;
                const hornW = baseSize * 0.15;
                const hornH = baseSize * 0.25;
                ctx.fillRect(ex + baseSize * 0.15, ey - hornH, hornW, hornH);
                ctx.fillRect(ex + baseSize * 0.7, ey - hornH, hornW, hornH);
            }

            // Tank damage crack + shift indicator
            if (enemy.damaged && enemy.type === 'tank') {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(ex + baseSize * 0.3, ey + baseSize * 0.2);
                ctx.lineTo(ex + baseSize * 0.5, ey + baseSize * 0.45);
                ctx.lineTo(ex + baseSize * 0.4, ey + baseSize * 0.7);
                ctx.stroke();

                const arrowPulse = 0.8 + Math.sin(time * 8) * 0.2;
                const arrowSize = Math.max(8, baseSize * 0.3) * arrowPulse;
                ctx.fillStyle = '#FFD700';
                const shiftLabelSize = Math.max(5, baseSize * 0.15);
                drawText(ctx, 'SHIFT', enemy.x, ey - arrowSize * 0.8, shiftLabelSize, '#FFD700', 'center', 1);
            }

            // Eyes
            if (enemy.type !== 'swarm') {
                const eyeSize = Math.max(3, baseSize * 0.12);
                const eyeY2 = ey + baseSize * 0.22;
                ctx.fillStyle = COLORS.ENEMY_EYES;
                ctx.fillRect(ex + baseSize * 0.25, eyeY2, eyeSize, eyeSize);
                ctx.fillRect(ex + baseSize * 0.63, eyeY2, eyeSize, eyeSize);
            }

            // Letter
            const letterSize = Math.max(10, baseSize * 0.45);
            drawText(ctx, enemy.letter, enemy.x, ey + baseSize * 0.65, letterSize, COLORS.ENEMY_LETTER, 'center', 1);
        }
    },

    renderKeyboard(ctx) {
        const time = Game.time;

        // Keyboard background
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, this.kbStartY, Game.width, this.kbHeight);
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, this.kbStartY, Game.width, 3);

        for (const key in this.keyRects) {
            const rect = this.keyRects[key];
            const isTarget = this.targetKeys[key];
            const flash = this.keyFlashes[key];

            let bgColor = '#555555';
            let borderColor = '#444444';
            let textColor = '#FFFFFF';
            let pressed = false;

            // Target key glow
            if (isTarget && (!flash || flash.type !== 'WRONG')) {
                const pulse = 0.6 + Math.sin(time * 6) * 0.3;
                ctx.globalAlpha = pulse * 0.4;
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(rect.x - 4, rect.y - 4, rect.w + 8, rect.h + 8);
                ctx.globalAlpha = 1;
                borderColor = '#FFD700';
            }

            // Flash states
            if (flash) {
                if (flash.type === 'CORRECT') {
                    bgColor = '#4CAF50';
                    borderColor = '#66CC66';
                    pressed = true;
                } else if (flash.type === 'WRONG') {
                    bgColor = '#F44336';
                    borderColor = '#FF6666';
                    // Shake effect
                    const shakeX = Math.sin(flash.timer * 40) * 3;
                    ctx.save();
                    ctx.translate(shakeX, 0);
                }
            }

            // Key shadow
            if (!pressed) {
                ctx.fillStyle = '#222222';
                ctx.fillRect(rect.x + 2, rect.y + 4, rect.w, rect.h);
            }

            // Key body
            const pressOffset = pressed ? 3 : 0;
            ctx.fillStyle = bgColor;
            ctx.fillRect(rect.x, rect.y + pressOffset, rect.w, rect.h);

            // Border
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(rect.x, rect.y + pressOffset, rect.w, rect.h);

            // Top highlight
            ctx.fillStyle = 'rgba(255,255,255,0.12)';
            ctx.fillRect(rect.x + 2, rect.y + pressOffset + 2, rect.w - 4, rect.h * 0.25);

            // Key label
            const fontSize = Math.max(10, rect.h * 0.35);
            const label = key === ' ' ? 'SPACE' : key;
            drawText(ctx, label, rect.x + rect.w / 2, rect.y + rect.h / 2 + pressOffset, fontSize, textColor, 'center', 1);

            if (flash && flash.type === 'WRONG') {
                ctx.restore();
            }
        }
    },

    renderFingerGuide(ctx) {
        for (const key in this.keyRects) {
            if (key === ' ') continue;
            const rect = this.keyRects[key];
            const finger = KEY_FINGERS[key];
            if (!finger) continue;
            const fc = FINGER_COLORS[finger];
            if (!fc) continue;

            ctx.fillStyle = fc.color;
            ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

            // Small colored dot at bottom of key
            ctx.fillStyle = fc.border;
            const dotSize = Math.max(3, rect.w * 0.12);
            ctx.fillRect(rect.x + rect.w / 2 - dotSize / 2, rect.y + rect.h - dotSize - 2, dotSize, dotSize);
        }

        // Thumb zone on space bar
        const spaceRect = this.keyRects[' '];
        if (spaceRect) {
            ctx.fillStyle = FINGER_COLORS.thumb.color;
            ctx.fillRect(spaceRect.x, spaceRect.y, spaceRect.w, spaceRect.h);
        }
    },

    renderFingerGuideToggle(ctx) {
        const btnSize = Math.max(30, Game.width * 0.04);
        const bx = Game.width - btnSize - 10;
        const by = 10;
        this.fingerGuideBtn = { x: bx, y: by, w: btnSize, h: btnSize };

        const isHover = pointInRect(Game.input.mouseX, Game.input.mouseY, bx, by, btnSize, btnSize);

        ctx.fillStyle = isHover ? '#666666' : '#444444';
        ctx.fillRect(bx, by, btnSize, btnSize);
        ctx.strokeStyle = this.fingerGuideOn ? '#FFD700' : '#555555';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, btnSize, btnSize);

        // Hand icon (simple blocky hand)
        const hs = btnSize * 0.15;
        ctx.fillStyle = this.fingerGuideOn ? '#FFD700' : '#888888';
        // Palm
        ctx.fillRect(bx + btnSize * 0.25, by + btnSize * 0.45, btnSize * 0.5, btnSize * 0.35);
        // Fingers
        for (let f = 0; f < 4; f++) {
            ctx.fillRect(bx + btnSize * 0.2 + f * btnSize * 0.15, by + btnSize * 0.2, hs, btnSize * 0.3);
        }
        // Thumb
        ctx.fillRect(bx + btnSize * 0.15, by + btnSize * 0.5, hs, btnSize * 0.2);
    },

    renderPowerPickup(ctx) {
        const p = this.powerPickup;
        const def = POWER_TYPES[p.powerType];
        const size = Math.max(24, this.keyWidth * 0.6);
        const time = Game.time;

        if (p.timer < 2.0) {
            const blink = Math.sin(time * 12) > 0;
            if (!blink) return;
        }

        const bob = Math.sin(time * 4 + p.bobOffset) * 6;
        const px = p.x - size / 2;
        const py = p.y - size / 2 + bob;

        // Glow
        const glowSize = size * (1.5 + Math.sin(time * 5) * 0.3);
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = def.color;
        ctx.fillRect(p.x - glowSize / 2, p.y - glowSize / 2 + bob, glowSize, glowSize);
        ctx.globalAlpha = 1;

        // Block
        ctx.fillStyle = def.color;
        ctx.fillRect(px, py, size, size);
        ctx.fillStyle = def.darkColor;
        ctx.fillRect(px, py, size, 3);
        ctx.fillRect(px, py, 3, size);
        ctx.fillRect(px + size - 3, py, 3, size);
        ctx.fillRect(px, py + size - 3, size, 3);

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(px + 3, py + 3, size - 6, size * 0.3);

        const letterSize = Math.max(10, size * 0.55);
        drawText(ctx, p.letter, p.x, py + size * 0.5, letterSize, '#FFFFFF', 'center', 2);

        const iconSize = Math.max(7, size * 0.28);
        drawText(ctx, 'Type ' + p.letter + '!', p.x, py - iconSize * 1.2, iconSize, def.color, 'center', 1);
        drawText(ctx, def.name, p.x, py - iconSize * 2.8, iconSize, '#FFFFFF', 'center', 1);
    },

    renderHUD(ctx) {
        const padding = 10;
        const hudY = 8;

        // Score
        const scoreSize = Math.max(12, Game.width * 0.018);
        drawText(ctx, 'Score: ' + this.score, padding + 5, hudY + scoreSize / 2 + 5,
            scoreSize, COLORS.SCORE_COLOR, 'left', 2);

        // Wave indicator
        const waveSize = Math.max(10, Game.width * 0.014);
        const waveText = 'Wave ' + (this.currentWave + 1) + '/' + this.getTotalWaves();
        drawText(ctx, waveText, Game.width / 2, hudY + waveSize / 2 + 5,
            waveSize, COLORS.WAVE_COLOR, 'center', 2);

        // Timer
        const timerSize = Math.max(9, Game.width * 0.012);
        const timerText = formatTime(this.levelTime);
        drawText(ctx, timerText, Game.width / 2, hudY + waveSize / 2 + 5 + waveSize + timerSize * 0.6,
            timerSize, COLORS.WAVE_COLOR, 'center', 1);

        // Hearts
        const heartSize = Math.max(16, Game.width * 0.025);
        const heartGap = heartSize * 1.3;
        const heartsStartX = Game.width - padding - 50 - CONFIG.MAX_HEARTS * heartGap;
        for (let i = 0; i < CONFIG.MAX_HEARTS; i++) {
            drawHeart(ctx, heartsStartX + i * heartGap, hudY + 2, heartSize, i < this.hearts);
        }

        // Combo
        if (this.combo >= 2) {
            const comboSize = Math.max(10, Game.width * 0.014);
            drawText(ctx, 'Combo: x' + this.combo, padding + 5, hudY + scoreSize + comboSize + 5,
                comboSize, COLORS.COMBO_COLOR, 'left', 1);
        }

        // Slow/Freeze timer bar
        if (this.slowActive) {
            this._renderTimerBar(ctx, 'SLOW', this.slowTimer, 5.0, '#6699FF');
        }
        if (this.freezeActive) {
            this._renderTimerBar(ctx, 'FREEZE', this.freezeTimer, 4.0, '#CCDDFF');
        }
        if (this.shieldActive) {
            this._renderTimerBar(ctx, 'SHIELD', this.shieldTimer, 12.0, '#00CCCC');
        }
    },

    _renderTimerBar(ctx, label, timer, maxTimer, color) {
        const barW = Game.width * 0.2;
        const barH = 10;
        const barX = Game.width / 2 - barW / 2;
        const barY = this.kbStartY - barH - 5;
        const progress = clamp(timer / maxTimer, 0, 1);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = color;
        ctx.fillRect(barX, barY, barW * progress, barH);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        const fontSize = Math.max(6, barH * 0.7);
        drawText(ctx, label, barX + barW / 2, barY + barH / 2, fontSize, '#FFFFFF', 'center', 1);
    },

    renderPowerInventory(ctx) {
        const slotSize = Math.max(24, Game.width * 0.035);
        const gap = slotSize * 0.3;
        const startX = 10;
        const startY = this.kbStartY - slotSize - 22;

        for (let i = 0; i < 3; i++) {
            const sx = startX + i * (slotSize + gap);
            const sy = startY;
            const hasPower = i < this.powerInventory.length;
            const isSelected = i === this.powerSelectedIndex && hasPower;

            if (hasPower) {
                const def = POWER_TYPES[this.powerInventory[i]];
                ctx.fillStyle = def.color;
                ctx.fillRect(sx, sy, slotSize, slotSize);
                if (isSelected) {
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(sx - 2, sy - 2, slotSize + 4, slotSize + 4);
                }
                const labelSize = Math.max(6, slotSize * 0.25);
                drawText(ctx, def.name, sx + slotSize / 2, sy + slotSize / 2, labelSize, '#FFFFFF', 'center', 1);
            } else {
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 2;
                ctx.strokeRect(sx, sy, slotSize, slotSize);
            }
        }

        // USE button
        const btnW = slotSize * 1.2;
        const btnH = slotSize * 0.8;
        const useX = startX + 3 * (slotSize + gap) + gap;
        const useY = startY + (slotSize - btnH) / 2;
        this._useBtn = { x: useX, y: useY, w: btnW, h: btnH };

        const canUse = this.powerInventory.length > 0;
        ctx.fillStyle = canUse ? '#5B8C2A' : '#444444';
        ctx.fillRect(useX, useY, btnW, btnH);
        ctx.strokeStyle = canUse ? '#7EC850' : '#333333';
        ctx.lineWidth = 2;
        ctx.strokeRect(useX, useY, btnW, btnH);
        const useFontSize = Math.max(7, btnH * 0.35);
        drawText(ctx, 'USE', useX + btnW / 2, useY + btnH / 2, useFontSize, canUse ? '#FFFFFF' : '#888888', 'center', 1);

        // ROTATE button
        const rotW = slotSize * 0.7;
        const rotX = useX + btnW + gap;
        this._rotBtn = { x: rotX, y: useY, w: rotW, h: btnH };

        ctx.fillStyle = this.powerInventory.length > 1 ? '#555555' : '#333333';
        ctx.fillRect(rotX, useY, rotW, btnH);
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        ctx.strokeRect(rotX, useY, rotW, btnH);
        const rotFontSize = Math.max(6, btnH * 0.35);
        drawText(ctx, '<>', rotX + rotW / 2, useY + btnH / 2, rotFontSize, this.powerInventory.length > 1 ? '#FFFFFF' : '#666666', 'center', 1);
    },

    renderWaveIntro(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, Game.width, this.kbStartY);

        const countdown = Math.ceil(this.waveIntroTimer);
        const waveNum = this.currentWave + 1;
        const totalWaves = this.getTotalWaves();

        const titleSize = Math.max(18, Game.width * 0.03);
        drawText(ctx, 'Wave ' + waveNum + ' of ' + totalWaves, Game.width / 2, this.kbStartY * 0.35,
            titleSize, COLORS.WAVE_COLOR, 'center', 3);

        const subText = waveNum === 1 ? 'Get Ready!' : 'Wave ' + waveNum + ' incoming!';
        const subSize = Math.max(12, Game.width * 0.018);
        drawText(ctx, subText, Game.width / 2, this.kbStartY * 0.5,
            subSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        const countSize = Math.max(24, Game.width * 0.05);
        drawText(ctx, '' + countdown, Game.width / 2, this.kbStartY * 0.65,
            countSize, COLORS.TITLE_COLOR, 'center', 3);
    },

    renderDepthsWarning(ctx) {
        const alpha = Math.min(1, this._depthsWarningTimer / 0.5);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, Game.width, this.kbStartY);

        const titleSize = Math.max(14, Game.width * 0.025);
        drawText(ctx, 'WARNING!', Game.width / 2, this.kbStartY * 0.35,
            titleSize, '#FF4444', 'center', 3);

        const msgSize = Math.max(10, Game.width * 0.016);
        drawText(ctx, 'CAREFUL! Wrong keys', Game.width / 2, this.kbStartY * 0.5,
            msgSize, '#FFDD44', 'center', 2);
        drawText(ctx, 'help enemies!', Game.width / 2, this.kbStartY * 0.6,
            msgSize, '#FFDD44', 'center', 2);

        ctx.globalAlpha = 1;
    },

    // ============ KD WORLD MAP ============

    initWorldMap() {
        const wm = this.worldMap;
        const worldNames = ['village', 'highlands', 'depths'];
        const zoneWidth = Math.max(Game.width * 0.6, 400);
        wm.totalWidth = zoneWidth * 3;
        wm.nodePositions = [];

        for (let w = 0; w < 3; w++) {
            const zoneStartX = w * zoneWidth;
            for (let l = 0; l < 4; l++) {
                const levelIndex = w * 4 + l;
                if (levelIndex >= KD_LEVELS.length) break;
                const nx = zoneStartX + zoneWidth * 0.15 + (l / 3) * zoneWidth * 0.7;
                const ny = Game.height * 0.4 + Math.sin((l + w * 1.5) * 1.2) * Game.height * 0.15;
                wm.nodePositions.push({
                    levelIndex: levelIndex,
                    x: nx,
                    y: ny,
                    world: worldNames[w],
                });
            }
        }

        // Auto-center on highest unlocked level
        let highestUnlocked = 0;
        for (let i = 0; i < KD_LEVELS.length; i++) {
            if (KDProgression.isLevelUnlocked(i)) highestUnlocked = i;
        }
        const targetNode = wm.nodePositions[highestUnlocked];
        if (targetNode) {
            wm.scrollX = clamp(targetNode.x - Game.width / 2, 0, Math.max(0, wm.totalWidth - Game.width));
        } else {
            wm.scrollX = 0;
        }
        wm.targetScrollX = wm.scrollX;
        wm.dragging = false;
    },

    updateWorldMap(dt) {
        const wm = this.worldMap;
        const scrollSpeed = Game.width * 0.8;

        if (Game.input._arrowRight) wm.targetScrollX += scrollSpeed * 0.5;
        if (Game.input._arrowLeft) wm.targetScrollX -= scrollSpeed * 0.5;
        wm.targetScrollX = clamp(wm.targetScrollX, 0, Math.max(0, wm.totalWidth - Game.width));
        wm.scrollX += (wm.targetScrollX - wm.scrollX) * 0.15;

        if (Game.input.mouseClicked) {
            wm._clickX = Game.input.mouseX;
            wm._clickY = Game.input.mouseY;
            wm.dragStartX = Game.input.mouseX;
            wm.dragStartScroll = wm.scrollX;
            wm.dragging = false;
        }

        if (Game.input.mouseDown && wm.dragStartX != null) {
            const dx = wm.dragStartX - Game.input.mouseX;
            if (Math.abs(dx) > 8) {
                wm.dragging = true;
                wm.targetScrollX = clamp(wm.dragStartScroll + dx, 0, Math.max(0, wm.totalWidth - Game.width));
                wm.scrollX = wm.targetScrollX;
            }
        }

        if (!Game.input.mouseDown && wm._clickX != null) {
            if (!wm.dragging) {
                const mx = wm._clickX;
                const my = wm._clickY;

                // Back button
                if (this._kdBackBtn && pointInRect(mx, my, this._kdBackBtn.x, this._kdBackBtn.y, this._kdBackBtn.w, this._kdBackBtn.h)) {
                    Game.state = STATES.MENU;
                    wm._clickX = null;
                    return;
                }

                // Level node clicks
                const nodeSize = Math.max(40, Game.width * 0.055);
                for (let i = 0; i < wm.nodePositions.length; i++) {
                    const node = wm.nodePositions[i];
                    const screenX = node.x - wm.scrollX;
                    const screenY = node.y;
                    if (KDProgression.isLevelUnlocked(node.levelIndex) &&
                        pointInRect(mx, my, screenX - nodeSize / 2, screenY - nodeSize / 2, nodeSize, nodeSize)) {
                        wm._clickX = null;
                        Game.state = STATES.WAVE_INTRO;
                        this.init(node.levelIndex);
                        Game.currentMode = 'kd';
                        return;
                    }
                }
            }
            wm._clickX = null;
            wm.dragging = false;
        }
    },

    renderWorldMap(ctx) {
        const wm = this.worldMap;
        const worldNames = ['village', 'highlands', 'depths'];
        const zoneWidth = wm.totalWidth / 3;
        const nodeSize = Math.max(40, Game.width * 0.055);

        // Zone backgrounds
        for (let w = 0; w < 3; w++) {
            const theme = KD_WORLD_THEMES[worldNames[w]];
            const zoneStartX = w * zoneWidth - wm.scrollX;
            const zoneEndX = zoneStartX + zoneWidth;

            if (zoneEndX < -50 || zoneStartX > Game.width + 50) continue;

            const grad = ctx.createLinearGradient(0, 0, 0, Game.height);
            grad.addColorStop(0, theme.skyTop);
            grad.addColorStop(0.6, theme.skyBottom);
            grad.addColorStop(1, theme.dirt);
            ctx.fillStyle = grad;
            const clipX = Math.max(0, zoneStartX);
            const clipW = Math.min(zoneWidth, Game.width - clipX);
            if (clipW <= 0) continue;
            ctx.fillRect(clipX, 0, clipW, Game.height);

            // Ground
            const groundY = Game.height * 0.78;
            const blockSize = Math.max(20, Game.height * 0.04);
            for (let x = Math.max(0, zoneStartX); x < Math.min(zoneEndX, Game.width); x += blockSize) {
                ctx.fillStyle = theme.grass;
                ctx.fillRect(x, groundY, blockSize, blockSize);
                ctx.fillStyle = theme.grassLight;
                ctx.fillRect(x, groundY, blockSize, blockSize * 0.3);
                ctx.fillStyle = theme.dirt;
                ctx.fillRect(x, groundY + blockSize, blockSize, Game.height - groundY - blockSize);
            }

            // World label
            const labelSize = Math.max(14, Game.width * 0.022);
            const labelX = w * zoneWidth + zoneWidth / 2 - wm.scrollX;
            if (labelX > -100 && labelX < Game.width + 100) {
                drawText(ctx, theme.name.toUpperCase(), labelX, Game.height * 0.1,
                    labelSize, COLORS.TITLE_COLOR, 'center', 3);
                const subSize = Math.max(8, labelSize * 0.5);
                drawText(ctx, 'World ' + (w + 1), labelX, Game.height * 0.1 + labelSize * 1.5,
                    subSize, COLORS.SUBTITLE_COLOR, 'center', 2);
            }
        }

        // Dotted path
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < wm.nodePositions.length - 1; i++) {
            const from = wm.nodePositions[i];
            const to = wm.nodePositions[i + 1];
            const fromX = from.x - wm.scrollX;
            const toX = to.x - wm.scrollX;
            if (Math.max(fromX, toX) < -50 || Math.min(fromX, toX) > Game.width + 50) continue;

            const dist = Math.sqrt((toX - fromX) * (toX - fromX) + (to.y - from.y) * (to.y - from.y));
            const steps = Math.max(4, Math.floor(dist / 12));
            const dotSize = Math.max(3, nodeSize * 0.08);
            const crossWorld = from.world !== to.world;
            const dSize = crossWorld ? dotSize * 1.5 : dotSize;

            for (let s = 0; s < steps; s++) {
                const t = s / steps;
                const dx = lerp(fromX, toX, t);
                const dy = lerp(from.y, to.y, t);
                ctx.fillRect(dx - dSize / 2, dy - dSize / 2, dSize, dSize);
            }
        }

        // Level nodes
        for (let i = 0; i < wm.nodePositions.length; i++) {
            const node = wm.nodePositions[i];
            const screenX = node.x - wm.scrollX;
            if (screenX < -nodeSize || screenX > Game.width + nodeSize) continue;

            const levelIndex = node.levelIndex;
            const theme = KD_WORLD_THEMES[node.world];
            const unlocked = KDProgression.isLevelUnlocked(levelIndex);
            const stars = KDProgression.getLevelStars(levelIndex);
            const isHover = unlocked && pointInRect(Game.input.mouseX, Game.input.mouseY,
                screenX - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);

            // Current level pulse
            let isCurrentLevel = false;
            if (unlocked && stars === 0) {
                const prevStars = levelIndex > 0 ? KDProgression.getLevelStars(levelIndex - 1) : 1;
                if (prevStars >= 1 || levelIndex === 0) isCurrentLevel = true;
            }

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(screenX - nodeSize / 2 + 3, node.y - nodeSize / 2 + 3, nodeSize, nodeSize);

            // Background
            if (!unlocked) ctx.fillStyle = '#444444';
            else if (isHover) ctx.fillStyle = theme.grassLight;
            else ctx.fillStyle = theme.grass;
            ctx.fillRect(screenX - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);

            // Border
            ctx.strokeStyle = unlocked ? '#FFFFFF' : '#333333';
            ctx.lineWidth = 3;
            ctx.strokeRect(screenX - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize);

            // Current level glow
            if (isCurrentLevel) {
                const pulse = 0.3 + Math.sin(Game.time * 4) * 0.2;
                ctx.globalAlpha = pulse;
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(screenX - nodeSize / 2 - 4, node.y - nodeSize / 2 - 4, nodeSize + 8, nodeSize + 8);
                ctx.globalAlpha = 1;
            }

            // Highlight
            if (unlocked) {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(screenX - nodeSize / 2, node.y - nodeSize / 2, nodeSize, nodeSize * 0.3);
            }

            const numSize = Math.max(12, nodeSize * 0.35);
            const nameSize = Math.max(6, nodeSize * 0.14);

            if (unlocked) {
                drawText(ctx, '' + KD_LEVELS[levelIndex].id, screenX, node.y - nodeSize * 0.1,
                    numSize, COLORS.WHITE, 'center', 2);
                drawText(ctx, KD_LEVELS[levelIndex].name, screenX, node.y + nodeSize / 2 + nameSize * 1.2,
                    nameSize, COLORS.SUBTITLE_COLOR, 'center', 1);

                // Stars
                const starSz = Math.max(6, nodeSize * 0.12);
                const starGap = starSz * 1.5;
                const starsStartX = screenX - starGap;
                for (let s = 0; s < 3; s++) {
                    drawStar(ctx, starsStartX + s * starGap, node.y + nodeSize / 2 + nameSize * 2.5, starSz, s < stars);
                }

                // Best time
                const bestTime = KDProgression.getLevelBestTime(levelIndex);
                if (bestTime != null) {
                    const timeSize = Math.max(5, nodeSize * 0.1);
                    drawText(ctx, formatTimeShort(bestTime), screenX, node.y + nodeSize / 2 + nameSize * 4,
                        timeSize, '#AAAAAA', 'center', 1);
                }
            } else {
                // Lock icon
                const lockSize = numSize * 0.7;
                ctx.fillStyle = '#888888';
                ctx.fillRect(screenX - lockSize * 0.35, node.y, lockSize * 0.7, lockSize * 0.5);
                ctx.fillRect(screenX - lockSize * 0.2, node.y - lockSize * 0.35, lockSize * 0.4, lockSize * 0.35);
                ctx.fillStyle = '#444444';
                ctx.fillRect(screenX - lockSize * 0.12, node.y - lockSize * 0.25, lockSize * 0.24, lockSize * 0.25);
            }
        }

        // Scroll indicators
        if (wm.scrollX > 5) {
            ctx.globalAlpha = 0.5 + Math.sin(Game.time * 3) * 0.2;
            ctx.fillStyle = '#FFFFFF';
            const arrowSize = Math.max(12, Game.height * 0.03);
            ctx.fillRect(10, Game.height / 2 - arrowSize, arrowSize * 0.4, arrowSize * 2);
            ctx.globalAlpha = 1;
        }
        if (wm.scrollX < wm.totalWidth - Game.width - 5) {
            ctx.globalAlpha = 0.5 + Math.sin(Game.time * 3) * 0.2;
            ctx.fillStyle = '#FFFFFF';
            const arrowSize = Math.max(12, Game.height * 0.03);
            ctx.fillRect(Game.width - 10 - arrowSize * 0.4, Game.height / 2 - arrowSize, arrowSize * 0.4, arrowSize * 2);
            ctx.globalAlpha = 1;
        }

        // Title
        const titleSize = Math.max(14, Game.width * 0.022);
        drawText(ctx, 'KEYBOARD DEFENSE', Game.width / 2, Game.height * 0.04 + titleSize / 2,
            titleSize, COLORS.TITLE_COLOR, 'center', 3);

        // Back button
        const backW = Math.min(140, Game.width * 0.17);
        const backH = Math.min(35, Game.height * 0.05);
        this._kdBackBtn = drawButton(ctx, 'Back', 10, Game.height - backH - 10, backW, backH,
            Game.input.mouseX, Game.input.mouseY);
    },
};

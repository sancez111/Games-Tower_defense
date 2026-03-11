// ============================================
// Letter Defenders — Utility Functions
// ============================================

// Minecraft-inspired color palette
const COLORS = {
    // Grass
    GRASS_DARK: '#5B8C2A',
    GRASS_LIGHT: '#7EC850',
    // Dirt
    DIRT_DARK: '#8B6914',
    DIRT_LIGHT: '#B8860B',
    // Stone
    STONE_DARK: '#7F7F7F',
    STONE_LIGHT: '#A9A9A9',
    // Path
    PATH_DARK: '#C4A35A',
    PATH_LIGHT: '#DCC07E',
    // Sky
    SKY_TOP: '#4A90D9',
    SKY_BOTTOM: '#87CEEB',
    // Water
    WATER_DARK: '#2E5FD1',
    WATER_LIGHT: '#5B9BD5',
    // UI
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    SHADOW: '#222222',
    KEY_NORMAL: '#555555',
    KEY_HIGHLIGHT: '#FFD700',
    KEY_CORRECT: '#4CAF50',
    KEY_WRONG: '#F44336',
    KEY_TEXT: '#FFFFFF',
    KEY_BORDER: '#333333',
    // Enemy
    ENEMY_BODY: '#44AA44',
    ENEMY_DARK: '#338833',
    ENEMY_EYES: '#111111',
    ENEMY_LETTER: '#FFFFFF',
    // Menu
    MENU_BUTTON: '#5B8C2A',
    MENU_BUTTON_HOVER: '#7EC850',
    MENU_BUTTON_LOCKED: '#666666',
    TITLE_COLOR: '#FFD700',
    SUBTITLE_COLOR: '#FFFFFF',
    // Castle
    CASTLE_WALL: '#A9A9A9',
    CASTLE_DARK: '#7F7F7F',
    CASTLE_ROOF: '#8B4513',
    CASTLE_DOOR: '#5C3317',
    // Cave
    CAVE_DARK: '#1A1A1A',
    CAVE_FRAME: '#555555',
};

// Game configuration
const CONFIG = {
    GRID_COLS: 20,
    GRID_ROWS: 12,
    TARGET_FPS: 60,
    ASPECT_RATIO: 16 / 9,
    KEYBOARD_HEIGHT_RATIO: 0.22,  // keyboard takes 22% of canvas height
    GAME_AREA_RATIO: 0.78,       // game area takes 78%
    ENEMY_SPEED: 0.03,           // path progress per second
    SPAWN_INTERVAL: 3,           // seconds between spawns
    FONT_FAMILY: '"Press Start 2P", monospace',
};

// Game states
const STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER',
    WIN: 'WIN',
};

// Tile types
const TILES = {
    GRASS: 'GRASS',
    DIRT: 'DIRT',
    STONE: 'STONE',
    PATH: 'PATH',
    WATER: 'WATER',
    TOWER_SLOT: 'TOWER_SLOT',
};

// --- Helper Functions ---

// Random integer between min (inclusive) and max (inclusive)
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random float between min and max
function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Point-in-rectangle collision
function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// Draw text with drop shadow (Minecraft style)
function drawText(ctx, text, x, y, size, color, align, shadowOffset) {
    shadowOffset = shadowOffset || 2;
    ctx.font = size + 'px ' + CONFIG.FONT_FAMILY;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    // Shadow
    ctx.fillStyle = COLORS.SHADOW;
    ctx.fillText(text, x + shadowOffset, y + shadowOffset);
    // Main text
    ctx.fillStyle = color || COLORS.WHITE;
    ctx.fillText(text, x, y);
}

// Linear interpolation
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Clamp value between min and max
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Ease out quad
function easeOutQuad(t) {
    return t * (2 - t);
}

// Ease in out quad
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Screen shake state
const ScreenShake = {
    intensity: 0,
    duration: 0,
    timer: 0,
    offsetX: 0,
    offsetY: 0,

    trigger(intensity, duration) {
        this.intensity = intensity;
        this.duration = duration;
        this.timer = duration;
    },

    update(dt) {
        if (this.timer > 0) {
            this.timer -= dt;
            const progress = this.timer / this.duration;
            const currentIntensity = this.intensity * progress;
            this.offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
            this.offsetY = (Math.random() - 0.5) * 2 * currentIntensity;
        } else {
            this.offsetX = 0;
            this.offsetY = 0;
        }
    }
};

// Simple flash animation helper
function createFlash(duration) {
    return {
        timer: duration,
        duration: duration,
        active: true,
        get progress() {
            return 1 - (this.timer / this.duration);
        },
        update(dt) {
            if (!this.active) return;
            this.timer -= dt;
            if (this.timer <= 0) {
                this.active = false;
                this.timer = 0;
            }
        }
    };
}

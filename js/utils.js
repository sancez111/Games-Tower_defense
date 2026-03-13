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
    // HUD
    HEART_RED: '#CC2222',
    HEART_DARK: '#881111',
    STAR_YELLOW: '#FFD700',
    STAR_DARK: '#CC9900',
    SCORE_COLOR: '#FFD700',
    COMBO_COLOR: '#FF6600',
    WAVE_COLOR: '#FFFFFF',
};

// World theme definitions — color palettes for each world
const WORLD_THEMES = {
    forest: {
        name: 'Greenwood',
        skyTop: '#4A90D9',
        skyBottom: '#87CEEB',
        grass: '#5B8C2A',
        grassLight: '#7EC850',
        dirt: '#8B6914',
        dirtLight: '#B8860B',
        pathDark: '#C4A35A',
        pathLight: '#DCC07E',
        castleWall: '#A9A9A9',
        castleDark: '#7F7F7F',
        castleRoof: '#8B4513',
        castleDoor: '#5C3317',
        caveFrame: '#555555',
        caveDark: '#1A1A1A',
        windowColor: '#87CEEB',
    },
    desert: {
        name: 'Sandstone',
        skyTop: '#D4943A',
        skyBottom: '#F0C878',
        grass: '#D4A65A',
        grassLight: '#E0BE7A',
        dirt: '#B8893A',
        dirtLight: '#CCA050',
        pathDark: '#C46A3A',
        pathLight: '#D4845A',
        castleWall: '#C4A060',
        castleDark: '#9A7840',
        castleRoof: '#AA6633',
        castleDoor: '#6B4420',
        caveFrame: '#8B6B3A',
        caveDark: '#2A1A0A',
        windowColor: '#F0C878',
    },
    snow: {
        name: 'Frostpeak',
        skyTop: '#B0C8E0',
        skyBottom: '#D8E8F4',
        grass: '#C8D8E8',
        grassLight: '#E0E8F0',
        dirt: '#A0B0C0',
        dirtLight: '#B8C8D8',
        pathDark: '#8BB0D0',
        pathLight: '#A8C8E0',
        castleWall: '#C0D0E0',
        castleDark: '#90A0B0',
        castleRoof: '#7090A8',
        castleDoor: '#5A7088',
        caveFrame: '#7090A8',
        caveDark: '#1A2A3A',
        windowColor: '#D8E8F4',
    },
    lava: {
        name: 'Netherforge',
        skyTop: '#1A0A0A',
        skyBottom: '#4A1A0A',
        grass: '#3A3A3A',
        grassLight: '#4A4A4A',
        dirt: '#2A2A2A',
        dirtLight: '#3A3030',
        pathDark: '#CC4400',
        pathLight: '#DD6620',
        castleWall: '#555555',
        castleDark: '#333333',
        castleRoof: '#442200',
        castleDoor: '#220000',
        caveFrame: '#331100',
        caveDark: '#0A0000',
        windowColor: '#FF4400',
    },
};

// Helper to get world theme for a level index
function getWorldTheme(levelIndex) {
    if (levelIndex < LEVELS.length) {
        const world = LEVELS[levelIndex].world || 'forest';
        return WORLD_THEMES[world];
    }
    return WORLD_THEMES.forest;
}

// Current world theme (set when a level starts)
let currentWorldTheme = WORLD_THEMES.forest;

// Enemy type definitions
const ENEMY_TYPES = {
    walker: {
        color: '#44AA44',
        darkColor: '#338833',
        sizeMultiplier: 0.8,
        speedMultiplier: 1.0,
        maxHits: 1,
    },
    sprinter: {
        color: '#4488DD',
        darkColor: '#3366AA',
        sizeMultiplier: 0.6,
        speedMultiplier: 3.0,
        maxHits: 1,
    },
    tank: {
        color: '#CC4444',
        darkColor: '#993333',
        sizeMultiplier: 1.0,
        speedMultiplier: 0.6,
        maxHits: 2,
    },
    swarm: {
        color: '#9944CC',
        darkColor: '#773399',
        sizeMultiplier: 0.5,
        speedMultiplier: 1.8,
        maxHits: 1,
    },
};

// Path layout definitions (waypoints as [col, row] arrays)
const PATH_LAYOUTS = {
    longWinding: [
        [0, 2], [5, 2], [5, 6], [14, 6], [14, 2], [19, 2],
    ],
    mediumTwoTurn: [
        [0, 3], [7, 3], [7, 7], [19, 7],
    ],
    shortDirect: [
        [0, 5], [10, 5], [19, 5],
    ],
    zigzag: [
        [0, 1], [6, 1], [6, 5], [13, 5], [13, 1], [17, 1], [17, 8], [19, 8],
    ],
    straightRush: [
        [0, 5], [19, 5],
    ],
};

// Game configuration
const CONFIG = {
    GRID_COLS: 20,
    GRID_ROWS: 12,
    TARGET_FPS: 60,
    ASPECT_RATIO: 16 / 9,
    KEYBOARD_HEIGHT_RATIO: 0.22,
    GAME_AREA_RATIO: 0.78,
    ENEMY_SPEED: 0.03,
    SPAWN_INTERVAL: 3,
    FONT_FAMILY: '"Press Start 2P", monospace',
    MAX_HEARTS: 5,
};

// Game states
const STATES = {
    MENU: 'MENU',
    LEVEL_SELECT: 'LEVEL_SELECT',
    WORLD_MAP: 'WORLD_MAP',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    WAVE_INTRO: 'WAVE_INTRO',
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

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

function drawText(ctx, text, x, y, size, color, align, shadowOffset) {
    shadowOffset = shadowOffset || 2;
    ctx.font = size + 'px ' + CONFIG.FONT_FAMILY;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = COLORS.SHADOW;
    ctx.fillText(text, x + shadowOffset, y + shadowOffset);
    ctx.fillStyle = color || COLORS.WHITE;
    ctx.fillText(text, x, y);
}

// Format seconds as MM:SS.ms (e.g., "01:23.45")
function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const hundredths = Math.floor((totalSeconds * 100) % 100);
    return (mins < 10 ? '0' : '') + mins + ':' +
           (secs < 10 ? '0' : '') + secs + '.' +
           (hundredths < 10 ? '0' : '') + hundredths;
}

// Format seconds as M:SS.ms for compact display (e.g., "1:23.45")
function formatTimeShort(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const hundredths = Math.floor((totalSeconds * 100) % 100);
    return mins + ':' + (secs < 10 ? '0' : '') + secs + '.' +
           (hundredths < 10 ? '0' : '') + hundredths;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function easeOutQuad(t) {
    return t * (2 - t);
}

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

// ============================================
// Particle System
// ============================================
const Particles = {
    list: [],

    spawn(x, y, color, count) {
        count = count || 8;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + randFloat(-0.3, 0.3);
            const speed = randFloat(80, 200);
            this.list.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - randFloat(50, 120),
                size: randFloat(3, 7),
                color: color,
                life: 0.5,
                maxLife: 0.5,
                gravity: 400,
            });
        }
    },

    update(dt) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const p = this.list[i];
            p.vy += p.gravity * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            if (p.life <= 0) {
                this.list.splice(i, 1);
            }
        }
    },

    render(ctx) {
        for (let i = 0; i < this.list.length; i++) {
            const p = this.list[i];
            const alpha = clamp(p.life / p.maxLife, 0, 1);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    },

    clear() {
        this.list = [];
    }
};

// ============================================
// Floating Text System
// ============================================
const FloatingTexts = {
    list: [],

    spawn(x, y, text, color, size) {
        this.list.push({
            x: x,
            y: y,
            text: text,
            color: color || COLORS.SCORE_COLOR,
            size: size || 14,
            life: 1.0,
            maxLife: 1.0,
            vy: -60,
        });
    },

    update(dt) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            const t = this.list[i];
            t.y += t.vy * dt;
            t.life -= dt;
            if (t.life <= 0) {
                this.list.splice(i, 1);
            }
        }
    },

    render(ctx) {
        for (let i = 0; i < this.list.length; i++) {
            const t = this.list[i];
            const alpha = clamp(t.life / t.maxLife, 0, 1);
            ctx.globalAlpha = alpha;
            const scale = 1 + (1 - alpha) * 0.3;
            drawText(ctx, t.text, t.x, t.y, t.size * scale, t.color, 'center', 2);
        }
        ctx.globalAlpha = 1;
    },

    clear() {
        this.list = [];
    }
};

// ============================================
// Draw blocky Minecraft-style heart
// ============================================
function drawHeart(ctx, x, y, size, filled) {
    const s = size / 8;
    ctx.fillStyle = filled ? COLORS.HEART_RED : '#333333';
    // Row 0 (top) - two bumps
    ctx.fillRect(x + s, y, s * 2, s);
    ctx.fillRect(x + s * 5, y, s * 2, s);
    // Row 1
    ctx.fillRect(x, y + s, s * 8, s);
    // Row 2
    ctx.fillRect(x, y + s * 2, s * 8, s);
    // Row 3
    ctx.fillRect(x + s, y + s * 3, s * 6, s);
    // Row 4
    ctx.fillRect(x + s * 2, y + s * 4, s * 4, s);
    // Row 5 (bottom point)
    ctx.fillRect(x + s * 3, y + s * 5, s * 2, s);

    // Highlight
    if (filled) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(x + s, y, s, s);
        ctx.fillRect(x, y + s, s, s);
    }
    // Dark edge
    ctx.fillStyle = filled ? COLORS.HEART_DARK : '#222222';
    ctx.fillRect(x + s * 3, y + s * 5, s * 2, s);
    if (filled) {
        ctx.fillRect(x + s * 6, y + s, s * 2, s);
    }
}

// ============================================
// Draw blocky Minecraft-style star
// ============================================
function drawStar(ctx, cx, cy, size, filled) {
    const s = size / 10;
    ctx.fillStyle = filled ? COLORS.STAR_YELLOW : '#444444';
    // Build star pixel by pixel (blocky 5-point star)
    // Center column top
    ctx.fillRect(cx - s, cy - s * 5, s * 2, s * 2);
    // Top spread
    ctx.fillRect(cx - s * 2, cy - s * 3, s * 4, s);
    ctx.fillRect(cx - s * 3, cy - s * 2, s * 6, s);
    // Wide middle bar
    ctx.fillRect(cx - s * 5, cy - s, s * 10, s * 2);
    // Lower middle
    ctx.fillRect(cx - s * 4, cy + s, s * 8, s);
    ctx.fillRect(cx - s * 3, cy + s * 2, s * 6, s);
    // Two legs
    ctx.fillRect(cx - s * 3, cy + s * 3, s * 2, s);
    ctx.fillRect(cx + s, cy + s * 3, s * 2, s);
    ctx.fillRect(cx - s * 4, cy + s * 4, s * 2, s);
    ctx.fillRect(cx + s * 2, cy + s * 4, s * 2, s);

    if (filled) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(cx - s, cy - s * 5, s, s);
        ctx.fillRect(cx - s * 5, cy - s, s * 2, s);
    }
}

// ============================================
// Draw a button (returns the button rect for hit testing)
// ============================================
function drawButton(ctx, text, x, y, w, h, mouseX, mouseY, fontSize) {
    const isHover = pointInRect(mouseX, mouseY, x, y, w, h);
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + 3, y + 3, w, h);
    // Background
    ctx.fillStyle = isHover ? COLORS.MENU_BUTTON_HOVER : COLORS.MENU_BUTTON;
    ctx.fillRect(x, y, w, h);
    // Border
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x, y, w, h * 0.3);
    // Text
    fontSize = fontSize || Math.max(10, h * 0.35);
    drawText(ctx, text, x + w / 2, y + h / 2, fontSize, COLORS.WHITE, 'center', 1);
    return { x, y, w, h };
}

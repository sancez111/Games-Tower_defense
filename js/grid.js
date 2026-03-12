// ============================================
// Letter Defenders — Grid & Tile System
// ============================================

const Grid = {
    cols: CONFIG.GRID_COLS,
    rows: CONFIG.GRID_ROWS,
    tileSize: 0,
    offsetX: 0,
    offsetY: 0,
    tiles: [],
    textureNoise: [],

    // Off-screen cache
    cacheCanvas: null,
    cacheCtx: null,
    cacheDirty: true,

    init() {
        this.tiles = [];
        this.textureNoise = [];
        for (let r = 0; r < this.rows; r++) {
            this.tiles[r] = [];
            this.textureNoise[r] = [];
            for (let c = 0; c < this.cols; c++) {
                if (r >= this.rows - 2) {
                    this.tiles[r][c] = TILES.DIRT;
                } else {
                    this.tiles[r][c] = TILES.GRASS;
                }
                this.textureNoise[r][c] = [];
                for (let i = 0; i < 6; i++) {
                    this.textureNoise[r][c].push({
                        x: Math.random(),
                        y: Math.random(),
                        size: randFloat(0.1, 0.25),
                        shade: randFloat(-0.15, 0.15),
                    });
                }
            }
        }
        this.cacheDirty = true;
    },

    setTile(col, row, type) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.tiles[row][col] = type;
            this.cacheDirty = true;
        }
    },

    resize(canvasWidth, gameAreaHeight) {
        const tileW = canvasWidth / this.cols;
        const tileH = gameAreaHeight / this.rows;
        this.tileSize = Math.floor(Math.min(tileW, tileH));
        this.offsetX = Math.floor((canvasWidth - this.tileSize * this.cols) / 2);
        this.offsetY = 0;
        this.cacheDirty = true;
    },

    gridToPixel(col, row) {
        return {
            x: this.offsetX + col * this.tileSize,
            y: this.offsetY + row * this.tileSize,
        };
    },

    pixelToGrid(px, py) {
        return {
            col: Math.floor((px - this.offsetX) / this.tileSize),
            row: Math.floor((py - this.offsetY) / this.tileSize),
        };
    },

    getTileColor(type) {
        switch (type) {
            case TILES.GRASS: return COLORS.GRASS_DARK;
            case TILES.DIRT: return COLORS.DIRT_DARK;
            case TILES.STONE: return COLORS.STONE_DARK;
            case TILES.PATH: return COLORS.PATH_DARK;
            case TILES.WATER: return COLORS.WATER_DARK;
            case TILES.TOWER_SLOT: return COLORS.STONE_LIGHT;
            default: return COLORS.GRASS_DARK;
        }
    },

    getTileAccent(type) {
        switch (type) {
            case TILES.GRASS: return COLORS.GRASS_LIGHT;
            case TILES.DIRT: return COLORS.DIRT_LIGHT;
            case TILES.STONE: return COLORS.STONE_LIGHT;
            case TILES.PATH: return COLORS.PATH_LIGHT;
            case TILES.WATER: return COLORS.WATER_LIGHT;
            case TILES.TOWER_SLOT: return COLORS.STONE_DARK;
            default: return COLORS.GRASS_LIGHT;
        }
    },

    // Rebuild the off-screen cache
    rebuildCache(gameAreaWidth, gameAreaHeight) {
        if (!this.cacheCanvas) {
            this.cacheCanvas = document.createElement('canvas');
            this.cacheCtx = this.cacheCanvas.getContext('2d');
        }
        this.cacheCanvas.width = gameAreaWidth;
        this.cacheCanvas.height = gameAreaHeight;
        const ctx = this.cacheCtx;

        const ts = this.tileSize;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const type = this.tiles[r][c];
                const px = this.offsetX + c * ts;
                const py = this.offsetY + r * ts;
                const baseColor = this.getTileColor(type);
                const accentColor = this.getTileAccent(type);

                ctx.fillStyle = baseColor;
                ctx.fillRect(px, py, ts, ts);

                const noise = this.textureNoise[r][c];
                ctx.fillStyle = accentColor;
                for (let i = 0; i < noise.length; i++) {
                    const n = noise[i];
                    const npx = px + n.x * ts;
                    const npy = py + n.y * ts;
                    const ns = Math.max(2, n.size * ts);
                    ctx.fillRect(Math.floor(npx), Math.floor(npy), Math.floor(ns), Math.floor(ns));
                }

                if (type === TILES.PATH) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    ctx.fillRect(px, py, ts, 2);
                    ctx.fillRect(px, py, 2, ts);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                    ctx.fillRect(px, py + ts - 2, ts, 2);
                }

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.lineWidth = 1;
                ctx.strokeRect(px + 0.5, py + 0.5, ts - 1, ts - 1);
            }
        }
        this.cacheDirty = false;
    },

    render(ctx, time) {
        const gameW = ctx.canvas.width;
        const gameH = ctx.canvas.height * CONFIG.GAME_AREA_RATIO;

        if (this.cacheDirty) {
            this.rebuildCache(gameW, gameH);
        }

        ctx.drawImage(this.cacheCanvas, 0, 0);
    }
};

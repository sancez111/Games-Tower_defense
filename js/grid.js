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
    // Pre-generated noise for tile textures
    textureNoise: [],

    // Initialize grid with default grass tiles
    init() {
        this.tiles = [];
        this.textureNoise = [];
        for (let r = 0; r < this.rows; r++) {
            this.tiles[r] = [];
            this.textureNoise[r] = [];
            for (let c = 0; c < this.cols; c++) {
                // Default: bottom 2 rows are dirt, rest is grass
                if (r >= this.rows - 2) {
                    this.tiles[r][c] = TILES.DIRT;
                } else {
                    this.tiles[r][c] = TILES.GRASS;
                }
                // Generate random texture pixels for each tile
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
    },

    // Set a tile type at given grid coordinates
    setTile(col, row, type) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.tiles[row][col] = type;
        }
    },

    // Calculate tile size and offsets based on canvas size
    resize(canvasWidth, gameAreaHeight) {
        const tileW = canvasWidth / this.cols;
        const tileH = gameAreaHeight / this.rows;
        this.tileSize = Math.floor(Math.min(tileW, tileH));
        // Center the grid horizontally
        this.offsetX = Math.floor((canvasWidth - this.tileSize * this.cols) / 2);
        this.offsetY = 0;
    },

    // Convert grid coordinates to pixel coordinates (top-left of tile)
    gridToPixel(col, row) {
        return {
            x: this.offsetX + col * this.tileSize,
            y: this.offsetY + row * this.tileSize,
        };
    },

    // Convert pixel coordinates to grid coordinates
    pixelToGrid(px, py) {
        return {
            col: Math.floor((px - this.offsetX) / this.tileSize),
            row: Math.floor((py - this.offsetY) / this.tileSize),
        };
    },

    // Get the base color for a tile type
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

    // Get the lighter accent color for a tile type
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

    // Render the entire grid
    render(ctx, time) {
        const ts = this.tileSize;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const type = this.tiles[r][c];
                const px = this.offsetX + c * ts;
                const py = this.offsetY + r * ts;
                const baseColor = this.getTileColor(type);
                const accentColor = this.getTileAccent(type);

                // Draw base tile
                ctx.fillStyle = baseColor;
                ctx.fillRect(px, py, ts, ts);

                // Draw texture noise (pixel-art detail)
                const noise = this.textureNoise[r][c];
                ctx.fillStyle = accentColor;
                for (let i = 0; i < noise.length; i++) {
                    const n = noise[i];
                    const npx = px + n.x * ts;
                    const npy = py + n.y * ts;
                    const ns = Math.max(2, n.size * ts);
                    ctx.fillRect(Math.floor(npx), Math.floor(npy), Math.floor(ns), Math.floor(ns));
                }

                // Water animation: shimmer effect
                if (type === TILES.WATER) {
                    const shimmer = Math.sin(time * 3 + c * 0.5 + r * 0.3) * 0.5 + 0.5;
                    ctx.fillStyle = 'rgba(255, 255, 255, ' + (shimmer * 0.15) + ')';
                    ctx.fillRect(px, py, ts, ts);
                }

                // Path edge darkening for depth
                if (type === TILES.PATH) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    // Top edge
                    ctx.fillRect(px, py, ts, 2);
                    // Left edge
                    ctx.fillRect(px, py, 2, ts);
                    // Bottom highlight
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                    ctx.fillRect(px, py + ts - 2, ts, 2);
                }

                // Subtle grid lines
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
                ctx.lineWidth = 1;
                ctx.strokeRect(px + 0.5, py + 0.5, ts - 1, ts - 1);
            }
        }
    }
};

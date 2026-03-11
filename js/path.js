// ============================================
// Letter Defenders — Path System
// ============================================

const Path = {
    // Path defined as array of grid coordinates [col, row]
    // Winding path with 3 turns from left entry to right base
    waypoints: [
        [0, 2],   // Entry point (left side)
        [5, 2],   // Go right
        [5, 6],   // Turn down
        [14, 6],  // Go right
        [14, 2],  // Turn up
        [19, 2],  // Exit to castle (right side)
    ],

    // Segment lengths (calculated on init)
    segments: [],
    totalLength: 0,

    // Initialize path — set path tiles on grid and calculate segment lengths
    init() {
        this.calculateSegments();
        this.applyToGrid();
    },

    // Calculate the length of each segment and total path length
    calculateSegments() {
        this.segments = [];
        this.totalLength = 0;
        for (let i = 0; i < this.waypoints.length - 1; i++) {
            const from = this.waypoints[i];
            const to = this.waypoints[i + 1];
            // Manhattan distance in grid units
            const length = Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
            this.segments.push({
                from: from,
                to: to,
                length: length,
                startDist: this.totalLength,
            });
            this.totalLength += length;
        }
    },

    // Mark path tiles on the grid
    applyToGrid() {
        for (let i = 0; i < this.waypoints.length - 1; i++) {
            const from = this.waypoints[i];
            const to = this.waypoints[i + 1];
            // Walk from -> to, setting tiles
            const dc = Math.sign(to[0] - from[0]);
            const dr = Math.sign(to[1] - from[1]);
            let c = from[0];
            let r = from[1];
            while (c !== to[0] || r !== to[1]) {
                Grid.setTile(c, r, TILES.PATH);
                // Also set one tile above/below for wider path feel (optional second row)
                if (dc !== 0) {
                    // Horizontal segment: path is 2 tiles tall
                    Grid.setTile(c, r + 1, TILES.PATH);
                } else {
                    // Vertical segment: path is 2 tiles wide
                    Grid.setTile(c + 1, r, TILES.PATH);
                }
                c += dc;
                r += dr;
            }
            // Set the final point
            Grid.setTile(to[0], to[1], TILES.PATH);
            if (dc !== 0) {
                Grid.setTile(to[0], to[1] + 1, TILES.PATH);
            } else {
                Grid.setTile(to[0] + 1, to[1], TILES.PATH);
            }
        }
    },

    // Get pixel position along path by percentage (0.0 = start, 1.0 = end)
    getPositionAt(progress) {
        progress = clamp(progress, 0, 1);
        const dist = progress * this.totalLength;

        // Find which segment we're on
        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            if (dist <= seg.startDist + seg.length) {
                const segProgress = (dist - seg.startDist) / seg.length;
                const col = lerp(seg.from[0], seg.to[0], segProgress);
                const row = lerp(seg.from[1], seg.to[1], segProgress);
                // Convert to pixel coordinates (center of tile)
                const pos = Grid.gridToPixel(col, row);
                return {
                    x: pos.x + Grid.tileSize * 0.5,
                    y: pos.y + Grid.tileSize * 0.75, // slightly below center for visual
                };
            }
        }
        // At end of path
        const last = this.waypoints[this.waypoints.length - 1];
        const pos = Grid.gridToPixel(last[0], last[1]);
        return {
            x: pos.x + Grid.tileSize * 0.5,
            y: pos.y + Grid.tileSize * 0.75,
        };
    },

    // Draw entry cave on the left side
    renderCave(ctx) {
        const entry = this.waypoints[0];
        const pos = Grid.gridToPixel(entry[0], entry[1]);
        const ts = Grid.tileSize;

        // Cave frame (dark stone blocks)
        ctx.fillStyle = COLORS.CAVE_FRAME;
        ctx.fillRect(pos.x - ts * 0.3, pos.y - ts * 0.3, ts * 0.8, ts * 2.6);

        // Cave opening (dark interior)
        ctx.fillStyle = COLORS.CAVE_DARK;
        ctx.fillRect(pos.x - ts * 0.1, pos.y, ts * 0.5, ts * 2);

        // Stone texture on frame
        ctx.fillStyle = COLORS.STONE_DARK;
        ctx.fillRect(pos.x - ts * 0.3, pos.y - ts * 0.3, ts * 0.8, ts * 0.2);
        ctx.fillRect(pos.x - ts * 0.3, pos.y + ts * 2.1, ts * 0.8, ts * 0.2);
    },

    // Draw castle at the endpoint
    renderCastle(ctx) {
        const end = this.waypoints[this.waypoints.length - 1];
        const pos = Grid.gridToPixel(end[0], end[1]);
        const ts = Grid.tileSize;
        const cx = pos.x;
        const cy = pos.y - ts * 0.5;

        // Castle main wall
        ctx.fillStyle = COLORS.CASTLE_WALL;
        ctx.fillRect(cx, cy, ts * 1.5, ts * 3);

        // Castle battlements (top)
        ctx.fillStyle = COLORS.CASTLE_DARK;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(cx + i * ts * 0.5, cy - ts * 0.4, ts * 0.35, ts * 0.4);
        }

        // Castle door
        ctx.fillStyle = COLORS.CASTLE_DOOR;
        ctx.fillRect(cx + ts * 0.4, cy + ts * 1.5, ts * 0.7, ts * 1.5);

        // Door frame
        ctx.fillStyle = COLORS.CASTLE_DARK;
        ctx.fillRect(cx + ts * 0.35, cy + ts * 1.45, ts * 0.8, ts * 0.1);
        ctx.fillRect(cx + ts * 0.35, cy + ts * 1.45, ts * 0.1, ts * 1.55);
        ctx.fillRect(cx + ts * 1.05, cy + ts * 1.45, ts * 0.1, ts * 1.55);

        // Window
        ctx.fillStyle = COLORS.SKY_BOTTOM;
        ctx.fillRect(cx + ts * 0.55, cy + ts * 0.5, ts * 0.4, ts * 0.4);
        // Window cross
        ctx.fillStyle = COLORS.CASTLE_DARK;
        ctx.fillRect(cx + ts * 0.73, cy + ts * 0.5, ts * 0.05, ts * 0.4);
        ctx.fillRect(cx + ts * 0.55, cy + ts * 0.68, ts * 0.4, ts * 0.05);
    },

    // Render path decorations (cave + castle)
    render(ctx) {
        this.renderCave(ctx);
        this.renderCastle(ctx);
    }
};

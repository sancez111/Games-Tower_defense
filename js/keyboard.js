// ============================================
// Letter Defenders — On-Screen Keyboard
// ============================================

const Keyboard = {
    rows: [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ],

    keys: {},
    keyWidth: 0,
    keyHeight: 0,
    startY: 0,
    gap: 0,

    // Shift key for touch (tank mechanic)
    shiftActive: false,
    shiftKey: { x: 0, y: 0, w: 0, h: 0 },

    // Dirty flag for highlight optimization
    _lastHighlightKey: '',

    init() {
        this.keys = {};
        this.shiftActive = false;
        for (let r = 0; r < this.rows.length; r++) {
            for (let c = 0; c < this.rows[r].length; c++) {
                const letter = this.rows[r][c];
                this.keys[letter] = {
                    letter: letter,
                    row: r,
                    col: c,
                    state: 'NORMAL',
                    flash: null,
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                };
            }
        }
        this._lastHighlightKey = '';
    },

    resize(canvasWidth, canvasHeight) {
        const kbHeight = canvasHeight * CONFIG.KEYBOARD_HEIGHT_RATIO;
        this.startY = canvasHeight - kbHeight;
        this.gap = Math.max(2, canvasWidth * 0.005);
        const padding = canvasWidth * 0.02;

        const maxKeys = 10;
        this.keyWidth = Math.floor((canvasWidth - padding * 2 - this.gap * (maxKeys - 1)) / maxKeys);
        this.keyHeight = Math.floor((kbHeight - this.gap * 4) / 3.5);

        for (let r = 0; r < this.rows.length; r++) {
            const rowKeys = this.rows[r].length;
            const rowWidth = rowKeys * this.keyWidth + (rowKeys - 1) * this.gap;
            const rowStartX = (canvasWidth - rowWidth) / 2;
            const rowY = this.startY + this.gap + r * (this.keyHeight + this.gap);

            for (let c = 0; c < rowKeys; c++) {
                const letter = this.rows[r][c];
                const key = this.keys[letter];
                key.x = rowStartX + c * (this.keyWidth + this.gap);
                key.y = rowY;
                key.w = this.keyWidth;
                key.h = this.keyHeight;
            }
        }

        // Position Shift key to the left of bottom row (Z)
        const zKey = this.keys['Z'];
        const shiftW = this.keyWidth * 1.5;
        this.shiftKey = {
            x: zKey.x - shiftW - this.gap,
            y: zKey.y,
            w: shiftW,
            h: this.keyHeight,
        };
    },

    flashKey(letter, state) {
        letter = letter.toUpperCase();
        const key = this.keys[letter];
        if (!key) return;
        key.state = state;
        key.flash = createFlash(0.4);
    },

    // Optimized: only update highlights when active letters change
    highlightKeys(letters) {
        const sorted = letters.slice().sort().join(',');
        if (sorted === this._lastHighlightKey) return;
        this._lastHighlightKey = sorted;

        for (const l in this.keys) {
            if (this.keys[l].state === 'HIGHLIGHTED') {
                this.keys[l].state = 'NORMAL';
            }
        }
        for (let i = 0; i < letters.length; i++) {
            const key = this.keys[letters[i].toUpperCase()];
            if (key && key.state === 'NORMAL') {
                key.state = 'HIGHLIGHTED';
            }
        }
    },

    update(dt) {
        for (const l in this.keys) {
            const key = this.keys[l];
            if (key.flash) {
                key.flash.update(dt);
                if (!key.flash.active) {
                    key.flash = null;
                    key.state = 'NORMAL';
                }
            }
        }
    },

    getKeyColor(state) {
        switch (state) {
            case 'HIGHLIGHTED': return COLORS.KEY_HIGHLIGHT;
            case 'CORRECT': return COLORS.KEY_CORRECT;
            case 'WRONG': return COLORS.KEY_WRONG;
            default: return COLORS.KEY_NORMAL;
        }
    },

    render(ctx) {
        ctx.fillStyle = 'rgba(30, 30, 30, 0.85)';
        ctx.fillRect(0, this.startY, ctx.canvas.width, ctx.canvas.height - this.startY);

        for (const l in this.keys) {
            const key = this.keys[l];
            const color = this.getKeyColor(key.state);
            const radius = Math.max(2, this.keyWidth * 0.1);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            this.drawRoundedRect(ctx, key.x + 2, key.y + 2, key.w, key.h, radius);

            ctx.fillStyle = color;
            this.drawRoundedRect(ctx, key.x, key.y, key.w, key.h, radius);

            ctx.strokeStyle = COLORS.KEY_BORDER;
            ctx.lineWidth = 1;
            this.strokeRoundedRect(ctx, key.x, key.y, key.w, key.h, radius);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.drawRoundedRect(ctx, key.x + 2, key.y + 2, key.w - 4, key.h * 0.4, radius);

            const fontSize = Math.max(10, this.keyHeight * 0.4);
            drawText(ctx, key.letter,
                key.x + key.w / 2, key.y + key.h / 2,
                fontSize, COLORS.KEY_TEXT, 'center', 1);
        }

        // Render Shift key
        const sk = this.shiftKey;
        const radius = Math.max(2, this.keyWidth * 0.1);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.drawRoundedRect(ctx, sk.x + 2, sk.y + 2, sk.w, sk.h, radius);

        // Background — orange when active, dark gray when not
        ctx.fillStyle = this.shiftActive ? '#DD6600' : COLORS.KEY_NORMAL;
        this.drawRoundedRect(ctx, sk.x, sk.y, sk.w, sk.h, radius);

        // Border
        ctx.strokeStyle = this.shiftActive ? '#FF8800' : COLORS.KEY_BORDER;
        ctx.lineWidth = this.shiftActive ? 2 : 1;
        this.strokeRoundedRect(ctx, sk.x, sk.y, sk.w, sk.h, radius);

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.drawRoundedRect(ctx, sk.x + 2, sk.y + 2, sk.w - 4, sk.h * 0.4, radius);

        // Up arrow icon + label
        const shiftFontSize = Math.max(7, this.keyHeight * 0.3);
        const arrowColor = this.shiftActive ? '#FFFFFF' : COLORS.KEY_TEXT;
        drawText(ctx, 'SHIFT', sk.x + sk.w / 2, sk.y + sk.h / 2,
            shiftFontSize, arrowColor, 'center', 1);
    },

    drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    },

    strokeRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.stroke();
    },

    getKeyAt(px, py) {
        // Check Shift key first
        if (pointInRect(px, py, this.shiftKey.x, this.shiftKey.y, this.shiftKey.w, this.shiftKey.h)) {
            return 'SHIFT';
        }
        for (const l in this.keys) {
            const key = this.keys[l];
            if (pointInRect(px, py, key.x, key.y, key.w, key.h)) {
                return key.letter;
            }
        }
        return null;
    }
};

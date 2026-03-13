// ============================================
// Letter Defenders — Game Engine
// ============================================

const Game = {
    canvas: null,
    ctx: null,
    state: STATES.MENU,
    lastTime: 0,
    time: 0,
    width: 0,
    height: 0,

    // Cached sky gradient
    _skyGradient: null,
    _skyGradientH: 0,

    // Input state
    input: {
        keysPressed: {},
        keysDown: {},
        shiftedKeys: {},
        shiftDown: false,      // physical Shift key held
        mouseX: 0,
        mouseY: 0,
        mouseClicked: false,
        mouseDown: false,
    },

    // Menu button definitions
    menuButtons: [],

    // Level select buttons
    levelButtons: [],

    // Overlay buttons (win/lose/pause screens)
    overlayButtons: [],

    // World map state
    worldMap: {
        scrollX: 0,
        targetScrollX: 0,
        totalWidth: 0,
        dragging: false,
        dragStartX: 0,
        dragStartScroll: 0,
        nodePositions: [],
    },

    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.setupInput();

        Grid.init();
        Path.init();
        Keyboard.init();
        Enemies.init();
        Powers.init();

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    setupInput() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            // Track Shift as its own held state (more reliable than e.shiftKey)
            if (e.key === 'Shift') {
                this.input.shiftDown = true;
            }

            const key = e.key.toUpperCase();
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                this.input.keysPressed[key] = true;
                this.input.keysDown[key] = true;
                // Track if Shift was held for this keypress (used by tank mechanic)
                if (this.input.shiftDown || e.shiftKey) {
                    this.input.shiftedKeys[key] = true;
                }
            }
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                this.input._spacePressed = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.input._rotatePressed = true;
                this.input._arrowRight = true;
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.input._arrowLeft = true;
            }
            if (e.key === 'Escape') {
                if (this.state === STATES.PLAYING || this.state === STATES.WAVE_INTRO) {
                    this.state = STATES.PAUSED;
                } else if (this.state === STATES.PAUSED) {
                    this.state = STATES.PLAYING;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                this.input.shiftDown = false;
            }
            const key = e.key.toUpperCase();
            delete this.input.keysDown[key];
        });

        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            this.input.mouseDown = true;
            this.input.mouseClicked = true;
            this.updateMousePos(e);
            this.handleTouchKeyboard(this.input.mouseX, this.input.mouseY);
        });

        this.canvas.addEventListener('mouseup', () => {
            this.input.mouseDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.updateMousePos(e);
        });

        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.input.mouseDown = true;
            this.input.mouseClicked = true;
            this.updateMousePos(touch);
            this.handleTouchKeyboard(this.input.mouseX, this.input.mouseY);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                this.updateMousePos(e.touches[0]);
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.mouseDown = false;
        });

        // Reset Shift if window loses focus (prevents stuck Shift state)
        window.addEventListener('blur', () => {
            this.input.shiftDown = false;
            this.input.keysDown = {};
        });
    },

    // Touch-to-keyboard: check if tap lands on a keyboard key or power button
    handleTouchKeyboard(x, y) {
        if (this.state === STATES.PLAYING || this.state === STATES.WAVE_INTRO) {
            // Check power buttons first
            const powerAction = Powers.handleTouch(x, y);
            if (powerAction === 'USE') {
                this.input._spacePressed = true;
                return;
            }
            if (powerAction === 'ROTATE') {
                this.input._rotatePressed = true;
                return;
            }

            const result = Keyboard.getKeyAt(x, y);
            if (result === 'SHIFT') {
                // Toggle Shift — stays active until a letter is tapped
                Keyboard.shiftActive = !Keyboard.shiftActive;
            } else if (result) {
                this.input.keysPressed[result] = true;
                if (Keyboard.shiftActive) {
                    this.input.shiftedKeys[result] = true;
                    Keyboard.shiftActive = false; // auto-release after one use
                }
            }
        }
    },

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.input.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.input.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    },

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        let cw = w;
        let ch = w / CONFIG.ASPECT_RATIO;
        if (ch > h) {
            ch = h;
            cw = h * CONFIG.ASPECT_RATIO;
        }
        this.canvas.width = Math.floor(cw);
        this.canvas.height = Math.floor(ch);
        this.canvas.style.width = Math.floor(cw) + 'px';
        this.canvas.style.height = Math.floor(ch) + 'px';
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        const gameAreaHeight = this.height * CONFIG.GAME_AREA_RATIO;
        Grid.resize(this.width, gameAreaHeight);
        Keyboard.resize(this.width, this.height);
        this.buildMenuButtons();
        this.buildLevelButtons();
        this.cacheSkyGradient();
    },

    // Cache sky gradient — recreate only on resize or world change
    cacheSkyGradient() {
        const gameH = this.height * CONFIG.GAME_AREA_RATIO;
        const theme = currentWorldTheme;
        this._skyGradient = this.ctx.createLinearGradient(0, 0, 0, gameH);
        this._skyGradient.addColorStop(0, theme.skyTop);
        this._skyGradient.addColorStop(1, theme.skyBottom);
        this._skyGradientH = gameH;
        this._skyTheme = theme;
    },

    buildMenuButtons() {
        const cx = this.width / 2;
        const btnW = Math.min(300, this.width * 0.4);
        const btnH = Math.min(50, this.height * 0.07);
        const startY = this.height * 0.5;
        const gap = btnH * 1.4;

        this.menuButtons = [
            { label: 'Letter March', x: cx - btnW / 2, y: startY, w: btnW, h: btnH, active: true, icon: '\u2694' },
            { label: 'Keyboard Defense', x: cx - btnW / 2, y: startY + gap, w: btnW, h: btnH, active: false, icon: '\u2328' },
            { label: 'Tower Strike', x: cx - btnW / 2, y: startY + gap * 2, w: btnW, h: btnH, active: false, icon: '\uD83C\uDFF0' },
        ];
    },

    buildLevelButtons() {
        const cx = this.width / 2;
        const cols = 7;
        const rows = Math.ceil(LEVELS.length / cols);
        const btnSize = Math.min(80, this.width * 0.1);
        const gapX = btnSize * 0.25;
        const gapY = btnSize * 0.3;
        const totalW = cols * btnSize + (cols - 1) * gapX;
        const startX = cx - totalW / 2;
        const startY = this.height * 0.3;

        this.levelButtons = [];
        for (let i = 0; i < LEVELS.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            this.levelButtons.push({
                index: i,
                x: startX + col * (btnSize + gapX),
                y: startY + row * (btnSize * 1.3 + gapY),
                w: btnSize,
                h: btnSize * 1.3,
            });
        }
    },

    // Main game loop
    loop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;
        this.time += dt;

        this.update(dt);
        this.render();

        this.input.keysPressed = {};
        this.input.shiftedKeys = {};
        this.input._spacePressed = false;
        this.input._rotatePressed = false;
        this.input._arrowLeft = false;
        this.input._arrowRight = false;
        this.input.mouseClicked = false;

        requestAnimationFrame((t) => this.loop(t));
    },

    update(dt) {
        ScreenShake.update(dt);

        switch (this.state) {
            case STATES.MENU:
                this.updateMenu();
                break;
            case STATES.LEVEL_SELECT:
            case STATES.WORLD_MAP:
                this.updateWorldMap(dt);
                break;
            case STATES.PLAYING:
            case STATES.WAVE_INTRO:
                this.updatePlaying(dt);
                break;
            case STATES.PAUSED:
                this.updatePaused();
                break;
            case STATES.GAME_OVER:
                this.updateGameOver();
                break;
            case STATES.WIN:
                this.updateWin();
                break;
        }
    },

    updateMenu() {
        if (this.input.mouseClicked) {
            for (let i = 0; i < this.menuButtons.length; i++) {
                const btn = this.menuButtons[i];
                if (btn.active && pointInRect(this.input.mouseX, this.input.mouseY, btn.x, btn.y, btn.w, btn.h)) {
                    this.state = STATES.WORLD_MAP;
                    this.initWorldMap();
                    break;
                }
            }
        }
    },

    startLevel(levelIndex) {
        this.state = STATES.WAVE_INTRO;
        LetterMarch.init(levelIndex);
    },

    updatePlaying(dt) {
        // Process special keys for powers
        if (this.input._spacePressed) {
            LetterMarch.processSpecialKey('SPACE');
        }
        if (this.input._rotatePressed) {
            LetterMarch.processSpecialKey('ALT');
        }

        // Process keyboard input
        for (const key in this.input.keysPressed) {
            const shifted = !!this.input.shiftedKeys[key];
            LetterMarch.processInput(key, shifted);
        }

        LetterMarch.update(dt);
    },

    updatePaused() {
        if (this.input.mouseClicked) {
            // Resume button
            if (this._resumeBtn && pointInRect(this.input.mouseX, this.input.mouseY,
                this._resumeBtn.x, this._resumeBtn.y, this._resumeBtn.w, this._resumeBtn.h)) {
                this.state = STATES.PLAYING;
                return;
            }
            // Menu button
            if (this._pauseMenuBtn && pointInRect(this.input.mouseX, this.input.mouseY,
                this._pauseMenuBtn.x, this._pauseMenuBtn.y, this._pauseMenuBtn.w, this._pauseMenuBtn.h)) {
                this.state = STATES.MENU;
                return;
            }
        }
    },

    updateGameOver() {
        if (this.input.mouseClicked) {
            if (this._tryAgainBtn && pointInRect(this.input.mouseX, this.input.mouseY,
                this._tryAgainBtn.x, this._tryAgainBtn.y, this._tryAgainBtn.w, this._tryAgainBtn.h)) {
                this.startLevel(Progression.currentLevel);
                return;
            }
            if (this._goMenuBtn && pointInRect(this.input.mouseX, this.input.mouseY,
                this._goMenuBtn.x, this._goMenuBtn.y, this._goMenuBtn.w, this._goMenuBtn.h)) {
                this.state = STATES.MENU;
                return;
            }
        }
    },

    updateWin() {
        if (this.input.mouseClicked) {
            if (this._nextLevelBtn && pointInRect(this.input.mouseX, this.input.mouseY,
                this._nextLevelBtn.x, this._nextLevelBtn.y, this._nextLevelBtn.w, this._nextLevelBtn.h)) {
                const next = Progression.currentLevel + 1;
                if (next < LEVELS.length) {
                    this.startLevel(next);
                } else {
                    this.state = STATES.WORLD_MAP;
                    this.initWorldMap();
                }
                return;
            }
            if (this._winMenuBtn && pointInRect(this.input.mouseX, this.input.mouseY,
                this._winMenuBtn.x, this._winMenuBtn.y, this._winMenuBtn.w, this._winMenuBtn.h)) {
                this.state = STATES.MENU;
                return;
            }
        }
    },

    // ====== RENDERING ======

    render() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(ScreenShake.offsetX, ScreenShake.offsetY);

        switch (this.state) {
            case STATES.MENU:
                this.renderMenu(ctx);
                break;
            case STATES.LEVEL_SELECT:
            case STATES.WORLD_MAP:
                this.renderWorldMap(ctx);
                break;
            case STATES.PLAYING:
            case STATES.WAVE_INTRO:
                LetterMarch.render(ctx);
                break;
            case STATES.PAUSED:
                LetterMarch.render(ctx);
                this.renderPauseOverlay(ctx);
                break;
            case STATES.GAME_OVER:
                LetterMarch.render(ctx);
                this.renderGameOverOverlay(ctx);
                break;
            case STATES.WIN:
                LetterMarch.render(ctx);
                this.renderWinOverlay(ctx);
                break;
        }

        ctx.restore();
    },

    renderMenu(ctx) {
        // Sky gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, COLORS.SKY_TOP);
        grad.addColorStop(1, COLORS.SKY_BOTTOM);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        this.renderClouds(ctx);

        // Ground blocks
        const blockSize = Math.max(30, this.width / 20);
        for (let x = 0; x < this.width; x += blockSize) {
            ctx.fillStyle = COLORS.GRASS_DARK;
            ctx.fillRect(x, this.height - blockSize * 2, blockSize, blockSize);
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            ctx.fillRect(x, this.height - blockSize * 2, blockSize, blockSize * 0.3);
            ctx.fillStyle = COLORS.DIRT_DARK;
            ctx.fillRect(x, this.height - blockSize, blockSize, blockSize);
            ctx.fillStyle = COLORS.DIRT_LIGHT;
            ctx.fillRect(x + blockSize * 0.2, this.height - blockSize * 0.6, blockSize * 0.2, blockSize * 0.2);
            ctx.fillRect(x + blockSize * 0.6, this.height - blockSize * 0.3, blockSize * 0.15, blockSize * 0.15);
        }

        // Title
        const titleSize = Math.max(20, Math.min(48, this.width * 0.04));
        drawText(ctx, 'LETTER', this.width / 2, this.height * 0.2, titleSize, COLORS.TITLE_COLOR, 'center', 3);
        drawText(ctx, 'DEFENDERS', this.width / 2, this.height * 0.2 + titleSize * 1.5, titleSize, COLORS.TITLE_COLOR, 'center', 3);

        const subSize = Math.max(10, titleSize * 0.45);
        drawText(ctx, 'Learn Your Letters!', this.width / 2, this.height * 0.2 + titleSize * 3, subSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        // Menu buttons
        for (let i = 0; i < this.menuButtons.length; i++) {
            const btn = this.menuButtons[i];
            const isHover = btn.active && pointInRect(this.input.mouseX, this.input.mouseY, btn.x, btn.y, btn.w, btn.h);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(btn.x + 3, btn.y + 3, btn.w, btn.h);

            if (!btn.active) {
                ctx.fillStyle = COLORS.MENU_BUTTON_LOCKED;
            } else if (isHover) {
                ctx.fillStyle = COLORS.MENU_BUTTON_HOVER;
            } else {
                ctx.fillStyle = COLORS.MENU_BUTTON;
            }
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h * 0.3);

            const btnFontSize = Math.max(10, btn.h * 0.35);
            const label = btn.active ? btn.label : btn.label + ' (Locked)';
            drawText(ctx, label, btn.x + btn.w / 2, btn.y + btn.h / 2, btnFontSize, COLORS.WHITE, 'center', 1);
        }
    },

    renderClouds(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const cloudW = this.width * 0.08;
        const cloudH = cloudW * 0.4;
        const clouds = [
            { x: 0.1, y: 0.08 },
            { x: 0.35, y: 0.12 },
            { x: 0.6, y: 0.06 },
            { x: 0.85, y: 0.14 },
        ];
        for (let i = 0; i < clouds.length; i++) {
            const c = clouds[i];
            const drift = ((this.time * 8 + i * 200) % (this.width + cloudW * 3)) - cloudW;
            const cx = drift;
            const cy = this.height * c.y;
            ctx.fillRect(cx, cy, cloudW, cloudH);
            ctx.fillRect(cx + cloudW * 0.2, cy - cloudH * 0.5, cloudW * 0.6, cloudH * 0.5);
            ctx.fillRect(cx - cloudW * 0.15, cy + cloudH * 0.1, cloudW * 0.4, cloudH * 0.6);
        }
    },

    // ====== WORLD MAP ======

    initWorldMap() {
        const wm = this.worldMap;
        const worldNames = ['forest', 'desert', 'snow', 'lava'];
        const zoneWidth = Math.max(this.width * 0.6, 400);
        wm.totalWidth = zoneWidth * 4;
        wm.nodePositions = [];

        // Calculate node positions across the 4 worlds
        for (let w = 0; w < 4; w++) {
            const zoneStartX = w * zoneWidth;
            const zoneCenterX = zoneStartX + zoneWidth / 2;
            for (let l = 0; l < 4; l++) {
                const levelIndex = w * 4 + l;
                // Arrange nodes in a winding path within each zone
                const nx = zoneStartX + zoneWidth * 0.15 + (l / 3) * zoneWidth * 0.7;
                const ny = this.height * 0.4 + Math.sin((l + w * 1.5) * 1.2) * this.height * 0.15;
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
        for (let i = 0; i < LEVELS.length; i++) {
            if (Progression.isLevelUnlocked(i)) {
                highestUnlocked = i;
            }
        }
        const targetNode = wm.nodePositions[highestUnlocked];
        if (targetNode) {
            wm.scrollX = clamp(targetNode.x - this.width / 2, 0, wm.totalWidth - this.width);
        } else {
            wm.scrollX = 0;
        }
        wm.targetScrollX = wm.scrollX;
        wm.dragging = false;
    },

    updateWorldMap(dt) {
        const wm = this.worldMap;
        const scrollSpeed = this.width * 0.8;

        // Arrow key scrolling
        if (this.input._arrowRight) {
            wm.targetScrollX += scrollSpeed * 0.5;
        }
        if (this.input._arrowLeft) {
            wm.targetScrollX -= scrollSpeed * 0.5;
        }

        // Clamp target
        wm.targetScrollX = clamp(wm.targetScrollX, 0, Math.max(0, wm.totalWidth - this.width));

        // Smooth scroll
        wm.scrollX += (wm.targetScrollX - wm.scrollX) * 0.15;

        // Start drag tracking on mousedown
        if (this.input.mouseClicked) {
            wm._clickX = this.input.mouseX;
            wm._clickY = this.input.mouseY;
            wm.dragStartX = this.input.mouseX;
            wm.dragStartScroll = wm.scrollX;
            wm.dragging = false;
        }

        // Track drag while mouse is held
        if (this.input.mouseDown && wm.dragStartX != null) {
            const dx = wm.dragStartX - this.input.mouseX;
            if (Math.abs(dx) > 8) {
                wm.dragging = true;
                wm.targetScrollX = clamp(wm.dragStartScroll + dx, 0, Math.max(0, wm.totalWidth - this.width));
                wm.scrollX = wm.targetScrollX;
            }
        }

        // Release — if it was a click (not a drag), check for node/button taps
        if (!this.input.mouseDown && wm._clickX != null) {
            if (!wm.dragging) {
                const mx = wm._clickX;
                const my = wm._clickY;

                // Back button
                if (this._backBtn && pointInRect(mx, my,
                    this._backBtn.x, this._backBtn.y, this._backBtn.w, this._backBtn.h)) {
                    this.state = STATES.MENU;
                    wm._clickX = null;
                    return;
                }

                // Level node clicks
                const nodeSize = Math.max(40, this.width * 0.055);
                for (let i = 0; i < wm.nodePositions.length; i++) {
                    const node = wm.nodePositions[i];
                    const screenX = node.x - wm.scrollX;
                    const screenY = node.y;
                    if (Progression.isLevelUnlocked(node.levelIndex) &&
                        pointInRect(mx, my,
                            screenX - nodeSize / 2, screenY - nodeSize / 2, nodeSize, nodeSize)) {
                        wm._clickX = null;
                        this.startLevel(node.levelIndex);
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
        const worldNames = ['forest', 'desert', 'snow', 'lava'];
        const zoneWidth = wm.totalWidth / 4;
        const nodeSize = Math.max(40, this.width * 0.055);

        // Draw world zone backgrounds
        for (let w = 0; w < 4; w++) {
            const theme = WORLD_THEMES[worldNames[w]];
            const zoneStartX = w * zoneWidth - wm.scrollX;
            const zoneEndX = zoneStartX + zoneWidth;

            // Skip off-screen zones
            if (zoneEndX < -50 || zoneStartX > this.width + 50) continue;

            // Sky gradient for this zone
            const grad = ctx.createLinearGradient(0, 0, 0, this.height);
            grad.addColorStop(0, theme.skyTop);
            grad.addColorStop(0.6, theme.skyBottom);
            grad.addColorStop(1, theme.dirt);
            ctx.fillStyle = grad;
            ctx.fillRect(Math.max(0, zoneStartX), 0,
                Math.min(zoneWidth, this.width - Math.max(0, zoneStartX)), this.height);

            // Ground blocks at bottom
            const blockSize = Math.max(20, this.height * 0.04);
            const groundY = this.height * 0.78;
            for (let x = Math.max(0, zoneStartX); x < Math.min(zoneEndX, this.width); x += blockSize) {
                ctx.fillStyle = theme.grass;
                ctx.fillRect(x, groundY, blockSize, blockSize);
                ctx.fillStyle = theme.grassLight;
                ctx.fillRect(x, groundY, blockSize, blockSize * 0.3);
                ctx.fillStyle = theme.dirt;
                ctx.fillRect(x, groundY + blockSize, blockSize, this.height - groundY - blockSize);
            }

            // World label
            const labelSize = Math.max(14, this.width * 0.022);
            const labelX = w * zoneWidth + zoneWidth / 2 - wm.scrollX;
            if (labelX > -100 && labelX < this.width + 100) {
                drawText(ctx, theme.name.toUpperCase(), labelX, this.height * 0.1,
                    labelSize, COLORS.TITLE_COLOR, 'center', 3);

                // World number subtitle
                const subSize = Math.max(8, labelSize * 0.5);
                drawText(ctx, 'World ' + (w + 1), labelX, this.height * 0.1 + labelSize * 1.5,
                    subSize, COLORS.SUBTITLE_COLOR, 'center', 2);
            }
        }

        // Draw dotted path connecting nodes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < wm.nodePositions.length - 1; i++) {
            const from = wm.nodePositions[i];
            const to = wm.nodePositions[i + 1];
            const fromX = from.x - wm.scrollX;
            const fromY = from.y;
            const toX = to.x - wm.scrollX;
            const toY = to.y;

            // Skip off-screen paths
            if (Math.max(fromX, toX) < -50 || Math.min(fromX, toX) > this.width + 50) continue;

            const dist = Math.sqrt((toX - fromX) * (toX - fromX) + (toY - fromY) * (toY - fromY));
            const steps = Math.max(4, Math.floor(dist / 12));
            const dotSize = Math.max(3, nodeSize * 0.08);

            // Thicker path between worlds
            const crossWorld = from.world !== to.world;
            const dSize = crossWorld ? dotSize * 1.5 : dotSize;

            for (let s = 0; s < steps; s++) {
                const t = s / steps;
                const dx = lerp(fromX, toX, t);
                const dy = lerp(fromY, toY, t);
                ctx.fillRect(dx - dSize / 2, dy - dSize / 2, dSize, dSize);
            }
        }

        // Draw level nodes
        for (let i = 0; i < wm.nodePositions.length; i++) {
            const node = wm.nodePositions[i];
            const screenX = node.x - wm.scrollX;
            const screenY = node.y;
            const levelIndex = node.levelIndex;
            const theme = WORLD_THEMES[node.world];

            // Skip off-screen nodes
            if (screenX < -nodeSize || screenX > this.width + nodeSize) continue;

            const unlocked = Progression.isLevelUnlocked(levelIndex);
            const stars = Progression.getLevelStars(levelIndex);
            const isHover = unlocked && pointInRect(this.input.mouseX, this.input.mouseY,
                screenX - nodeSize / 2, screenY - nodeSize / 2, nodeSize, nodeSize);

            // Find highest unlocked level for pulsing current indicator
            let isCurrentLevel = false;
            if (unlocked && (levelIndex === 0 || Progression.getLevelStars(levelIndex - 1) >= 1)) {
                const nextIdx = levelIndex + 1;
                if (nextIdx >= LEVELS.length || !Progression.isLevelUnlocked(nextIdx) || Progression.getLevelStars(levelIndex) === 0) {
                    if (Progression.getLevelStars(levelIndex) === 0) {
                        isCurrentLevel = true;
                    }
                }
            }

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(screenX - nodeSize / 2 + 3, screenY - nodeSize / 2 + 3, nodeSize, nodeSize);

            // Node background
            if (!unlocked) {
                ctx.fillStyle = '#444444';
            } else if (isHover) {
                ctx.fillStyle = theme.grassLight;
            } else {
                ctx.fillStyle = theme.grass;
            }
            ctx.fillRect(screenX - nodeSize / 2, screenY - nodeSize / 2, nodeSize, nodeSize);

            // Border
            ctx.strokeStyle = unlocked ? theme.pathDark : '#333333';
            ctx.lineWidth = 3;
            ctx.strokeRect(screenX - nodeSize / 2, screenY - nodeSize / 2, nodeSize, nodeSize);

            // Pulsing glow for current/next level
            if (isCurrentLevel) {
                const pulse = 0.3 + Math.sin(this.time * 4) * 0.2;
                ctx.globalAlpha = pulse;
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(screenX - nodeSize / 2 - 4, screenY - nodeSize / 2 - 4, nodeSize + 8, nodeSize + 8);
                ctx.globalAlpha = 1;
            }

            // Highlight top
            if (unlocked) {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fillRect(screenX - nodeSize / 2, screenY - nodeSize / 2, nodeSize, nodeSize * 0.3);
            }

            const numSize = Math.max(12, nodeSize * 0.35);
            const nameSize = Math.max(6, nodeSize * 0.14);

            if (unlocked) {
                // Level number
                drawText(ctx, '' + LEVELS[levelIndex].id, screenX, screenY - nodeSize * 0.1,
                    numSize, COLORS.WHITE, 'center', 2);

                // Level name below node
                drawText(ctx, LEVELS[levelIndex].name, screenX, screenY + nodeSize / 2 + nameSize * 1.2,
                    nameSize, COLORS.SUBTITLE_COLOR, 'center', 1);

                // Stars below name
                const starSz = Math.max(6, nodeSize * 0.12);
                const starGap = starSz * 1.5;
                const starsStartX = screenX - starGap;
                for (let s = 0; s < 3; s++) {
                    drawStar(ctx, starsStartX + s * starGap, screenY + nodeSize / 2 + nameSize * 2.5,
                        starSz, s < stars);
                }
            } else {
                // Lock icon
                const lockSize = numSize * 0.7;
                const lx = screenX;
                const ly = screenY - lockSize * 0.2;
                ctx.fillStyle = '#888888';
                ctx.fillRect(lx - lockSize * 0.35, ly, lockSize * 0.7, lockSize * 0.5);
                ctx.fillRect(lx - lockSize * 0.2, ly - lockSize * 0.35, lockSize * 0.4, lockSize * 0.35);
                ctx.fillStyle = '#444444';
                ctx.fillRect(lx - lockSize * 0.12, ly - lockSize * 0.25, lockSize * 0.24, lockSize * 0.25);
            }
        }

        // Scroll indicators (arrows at edges)
        if (wm.scrollX > 5) {
            ctx.globalAlpha = 0.5 + Math.sin(this.time * 3) * 0.2;
            ctx.fillStyle = '#FFFFFF';
            const arrowSize = Math.max(12, this.height * 0.03);
            ctx.fillRect(10, this.height / 2 - arrowSize, arrowSize * 0.4, arrowSize * 2);
            ctx.fillRect(10, this.height / 2 - arrowSize * 0.7, arrowSize * 0.8, arrowSize * 0.4);
            ctx.globalAlpha = 1;
        }
        if (wm.scrollX < wm.totalWidth - this.width - 5) {
            ctx.globalAlpha = 0.5 + Math.sin(this.time * 3) * 0.2;
            ctx.fillStyle = '#FFFFFF';
            const arrowSize = Math.max(12, this.height * 0.03);
            const rx = this.width - 10 - arrowSize * 0.4;
            ctx.fillRect(rx, this.height / 2 - arrowSize, arrowSize * 0.4, arrowSize * 2);
            ctx.fillRect(rx - arrowSize * 0.4, this.height / 2 - arrowSize * 0.7, arrowSize * 0.8, arrowSize * 0.4);
            ctx.globalAlpha = 1;
        }

        // Title
        const titleSize = Math.max(14, this.width * 0.022);
        drawText(ctx, 'LETTER MARCH', this.width / 2, this.height * 0.04 + titleSize / 2,
            titleSize, COLORS.TITLE_COLOR, 'center', 3);

        // Back button (fixed position)
        const backW = Math.min(140, this.width * 0.17);
        const backH = Math.min(35, this.height * 0.05);
        this._backBtn = drawButton(ctx, 'Back', 10, this.height - backH - 10, backW, backH,
            this.input.mouseX, this.input.mouseY);
    },

    // ====== PAUSE OVERLAY ======

    renderPauseOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);

        const pauseSize = Math.max(20, this.width * 0.04);
        drawText(ctx, 'PAUSED', this.width / 2, this.height * 0.3, pauseSize, COLORS.WHITE, 'center', 3);

        const subSize = Math.max(10, pauseSize * 0.5);
        drawText(ctx, 'Press ESC to Resume', this.width / 2, this.height * 0.3 + pauseSize * 2, subSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        const btnW = Math.min(200, this.width * 0.25);
        const btnH = Math.min(45, this.height * 0.06);
        const gap = btnH * 1.5;

        this._resumeBtn = drawButton(ctx, 'Resume', this.width / 2 - btnW / 2, this.height * 0.5, btnW, btnH,
            this.input.mouseX, this.input.mouseY);
        this._pauseMenuBtn = drawButton(ctx, 'Back to Menu', this.width / 2 - btnW / 2, this.height * 0.5 + gap, btnW, btnH,
            this.input.mouseX, this.input.mouseY);
    },

    // ====== GAME OVER OVERLAY ======

    renderGameOverOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, this.width, this.height);

        const titleSize = Math.max(22, this.width * 0.04);
        drawText(ctx, 'GAME OVER', this.width / 2, this.height * 0.25, titleSize, '#FF4444', 'center', 3);

        const scoreSize = Math.max(14, this.width * 0.02);
        drawText(ctx, 'Score: ' + Progression.score, this.width / 2, this.height * 0.35, scoreSize, COLORS.SCORE_COLOR, 'center', 2);

        // Survived time
        const timeSize = Math.max(9, this.width * 0.013);
        drawText(ctx, 'Survived: ' + formatTimeShort(Progression.levelTime),
            this.width / 2, this.height * 0.42, timeSize, COLORS.SUBTITLE_COLOR, 'center', 1);

        // Encouraging message
        const messages = [
            'Great try! Keep practicing!',
            'You\'re getting better!',
            'Almost had it! Try again!',
            'Good effort! You can do it!',
        ];
        const msgSize = Math.max(10, this.width * 0.015);
        const stableMsg = messages[Progression.score % messages.length];
        drawText(ctx, stableMsg, this.width / 2, this.height * 0.48, msgSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        const btnW = Math.min(200, this.width * 0.25);
        const btnH = Math.min(45, this.height * 0.06);
        const gap = btnH * 1.5;

        this._tryAgainBtn = drawButton(ctx, 'Try Again', this.width / 2 - btnW / 2, this.height * 0.57, btnW, btnH,
            this.input.mouseX, this.input.mouseY);
        this._goMenuBtn = drawButton(ctx, 'Menu', this.width / 2 - btnW / 2, this.height * 0.57 + gap, btnW, btnH,
            this.input.mouseX, this.input.mouseY);
    },

    // ====== WIN OVERLAY ======

    renderWinOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, this.width, this.height);

        const titleSize = Math.max(22, this.width * 0.04);
        drawText(ctx, 'LEVEL COMPLETE!', this.width / 2, this.height * 0.15, titleSize, COLORS.TITLE_COLOR, 'center', 3);

        const scoreSize = Math.max(14, this.width * 0.02);
        drawText(ctx, 'Score: ' + Progression.score, this.width / 2, this.height * 0.24, scoreSize, COLORS.SCORE_COLOR, 'center', 2);

        // Stars
        const stars = Progression.getStars();
        const starSize = Math.max(20, this.width * 0.035);
        const starGap = starSize * 2.5;
        const starsStartX = this.width / 2 - starGap;
        for (let i = 0; i < 3; i++) {
            drawStar(ctx, starsStartX + i * starGap, this.height * 0.32, starSize, i < stars);
        }

        // Time display
        const timeSize = Math.max(11, this.width * 0.016);
        const timeStr = 'Time: ' + formatTimeShort(LetterMarch._completionTime);
        drawText(ctx, timeStr, this.width / 2, this.height * 0.41, timeSize, COLORS.WHITE, 'center', 2);

        if (LetterMarch._isNewBest) {
            const bestSize = Math.max(12, this.width * 0.018);
            // Pulse animation for NEW BEST
            const pulse = 1 + Math.sin(this.time * 6) * 0.08;
            drawText(ctx, 'NEW BEST!', this.width / 2, this.height * 0.41 + timeSize * 1.6,
                bestSize * pulse, '#FFD700', 'center', 2);
        } else {
            const prevBest = Progression.getLevelBestTime(Progression.currentLevel);
            if (prevBest != null) {
                const refSize = Math.max(9, this.width * 0.013);
                drawText(ctx, 'Best: ' + formatTimeShort(prevBest), this.width / 2, this.height * 0.41 + timeSize * 1.6,
                    refSize, COLORS.SUBTITLE_COLOR, 'center', 1);
            }
        }

        // Encouraging message based on stars
        let msg;
        if (stars === 3) msg = 'PERFECT! You\'re a typing hero!';
        else if (stars === 2) msg = 'Super job! Almost perfect!';
        else msg = 'Great work! Keep going!';

        const msgSize = Math.max(10, this.width * 0.015);
        drawText(ctx, msg, this.width / 2, this.height * 0.51, msgSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        const btnW = Math.min(200, this.width * 0.25);
        const btnH = Math.min(45, this.height * 0.06);
        const gap = btnH * 1.5;

        const nextLabel = (Progression.currentLevel + 1 < LEVELS.length) ? 'Next Level' : 'World Map';
        this._nextLevelBtn = drawButton(ctx, nextLabel, this.width / 2 - btnW / 2, this.height * 0.59, btnW, btnH,
            this.input.mouseX, this.input.mouseY);
        this._winMenuBtn = drawButton(ctx, 'Menu', this.width / 2 - btnW / 2, this.height * 0.59 + gap, btnW, btnH,
            this.input.mouseX, this.input.mouseY);
    },
};

// ====== Font Loading + Game Start ======
window.addEventListener('load', () => {
    // Show loading message
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', canvas.width / 2, canvas.height / 2);

    // Wait for font to load
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            Game.init();
        });
    } else {
        // Fallback: just start after a short delay
        setTimeout(() => Game.init(), 500);
    }
});

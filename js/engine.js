// ============================================
// Letter Defenders — Game Engine
// ============================================

const Game = {
    canvas: null,
    ctx: null,
    state: STATES.MENU,
    lastTime: 0,
    time: 0,        // total elapsed time in seconds
    width: 0,
    height: 0,

    // Input state
    input: {
        keysPressed: {},    // keys pressed this frame
        keysDown: {},       // keys currently held
        mouseX: 0,
        mouseY: 0,
        mouseClicked: false,
        mouseDown: false,
    },

    // Menu button definitions (calculated on resize)
    menuButtons: [],

    // Initialize the game
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Setup input handlers
        this.setupInput();

        // Initialize systems (must happen before first resize)
        Grid.init();
        Path.init();
        Keyboard.init();
        Enemies.init();

        // Initial resize
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    },

    // Setup keyboard and mouse input
    setupInput() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                this.input.keysPressed[key] = true;
                this.input.keysDown[key] = true;
            }
            // Pause toggle
            if (e.key === 'Escape') {
                if (this.state === STATES.PLAYING) {
                    this.state = STATES.PAUSED;
                } else if (this.state === STATES.PAUSED) {
                    this.state = STATES.PLAYING;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            const key = e.key.toUpperCase();
            delete this.input.keysDown[key];
        });

        // Mouse / Touch
        this.canvas.addEventListener('mousedown', (e) => {
            this.input.mouseDown = true;
            this.input.mouseClicked = true;
            this.updateMousePos(e);
        });

        this.canvas.addEventListener('mouseup', () => {
            this.input.mouseDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.updateMousePos(e);
        });

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.input.mouseDown = true;
            this.input.mouseClicked = true;
            this.updateMousePos(touch);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.mouseDown = false;
        });
    },

    // Convert page coordinates to canvas coordinates
    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.input.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.input.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    },

    // Handle canvas resize
    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Maintain aspect ratio
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

        // Resize subsystems
        const gameAreaHeight = this.height * CONFIG.GAME_AREA_RATIO;
        Grid.resize(this.width, gameAreaHeight);
        Keyboard.resize(this.width, this.height);
        this.buildMenuButtons();
    },

    // Build menu button hit areas
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

    // Main game loop
    loop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05); // cap at 50ms
        this.lastTime = timestamp;
        this.time += dt;

        this.update(dt);
        this.render();

        // Clear single-frame input
        this.input.keysPressed = {};
        this.input.mouseClicked = false;

        requestAnimationFrame((t) => this.loop(t));
    },

    // Update game state
    update(dt) {
        ScreenShake.update(dt);

        switch (this.state) {
            case STATES.MENU:
                this.updateMenu();
                break;
            case STATES.PLAYING:
                this.updatePlaying(dt);
                break;
            case STATES.PAUSED:
                // Nothing to update while paused
                break;
        }
    },

    // Menu update — check button clicks
    updateMenu() {
        if (this.input.mouseClicked) {
            for (let i = 0; i < this.menuButtons.length; i++) {
                const btn = this.menuButtons[i];
                if (btn.active && pointInRect(this.input.mouseX, this.input.mouseY, btn.x, btn.y, btn.w, btn.h)) {
                    this.startGame();
                    break;
                }
            }
        }
    },

    // Start the game
    startGame() {
        this.state = STATES.PLAYING;
        Grid.init();
        Path.init();
        Enemies.init();
    },

    // Playing state update
    updatePlaying(dt) {
        // Process keyboard input
        for (const key in this.input.keysPressed) {
            // Flash the key on the on-screen keyboard
            const hit = Enemies.tryHitLetter(key);
            if (hit) {
                Keyboard.flashKey(key, 'CORRECT');
                ScreenShake.trigger(4, 0.15);
            } else {
                Keyboard.flashKey(key, 'WRONG');
            }
        }

        // Highlight letters of active enemies on keyboard
        const activeLetters = Enemies.list
            .filter(e => e.alive)
            .map(e => e.letter);
        Keyboard.highlightKeys(activeLetters);

        Enemies.update(dt, this.time);
        Keyboard.update(dt);
    },

    // ====== RENDERING ======

    render() {
        const ctx = this.ctx;
        ctx.save();

        // Apply screen shake
        ctx.translate(ScreenShake.offsetX, ScreenShake.offsetY);

        switch (this.state) {
            case STATES.MENU:
                this.renderMenu(ctx);
                break;
            case STATES.PLAYING:
                this.renderPlaying(ctx);
                break;
            case STATES.PAUSED:
                this.renderPlaying(ctx);
                this.renderPauseOverlay(ctx);
                break;
        }

        ctx.restore();
    },

    // Render start menu
    renderMenu(ctx) {
        // Sky gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, COLORS.SKY_TOP);
        grad.addColorStop(1, COLORS.SKY_BOTTOM);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, this.height);

        // Animated blocky clouds
        this.renderClouds(ctx);

        // Ground blocks along bottom
        const blockSize = Math.max(30, this.width / 20);
        for (let x = 0; x < this.width; x += blockSize) {
            // Grass layer
            ctx.fillStyle = COLORS.GRASS_DARK;
            ctx.fillRect(x, this.height - blockSize * 2, blockSize, blockSize);
            ctx.fillStyle = COLORS.GRASS_LIGHT;
            // Grass top texture
            ctx.fillRect(x, this.height - blockSize * 2, blockSize, blockSize * 0.3);
            // Dirt layer
            ctx.fillStyle = COLORS.DIRT_DARK;
            ctx.fillRect(x, this.height - blockSize, blockSize, blockSize);
            // Dirt texture spots
            ctx.fillStyle = COLORS.DIRT_LIGHT;
            ctx.fillRect(x + blockSize * 0.2, this.height - blockSize * 0.6, blockSize * 0.2, blockSize * 0.2);
            ctx.fillRect(x + blockSize * 0.6, this.height - blockSize * 0.3, blockSize * 0.15, blockSize * 0.15);
        }

        // Title
        const titleSize = Math.max(20, Math.min(48, this.width * 0.04));
        drawText(ctx, 'LETTER', this.width / 2, this.height * 0.2, titleSize, COLORS.TITLE_COLOR, 'center', 3);
        drawText(ctx, 'DEFENDERS', this.width / 2, this.height * 0.2 + titleSize * 1.5, titleSize, COLORS.TITLE_COLOR, 'center', 3);

        // Subtitle
        const subSize = Math.max(10, titleSize * 0.45);
        drawText(ctx, 'Learn Your Letters!', this.width / 2, this.height * 0.2 + titleSize * 3, subSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        // Menu buttons
        for (let i = 0; i < this.menuButtons.length; i++) {
            const btn = this.menuButtons[i];
            const isHover = btn.active && pointInRect(this.input.mouseX, this.input.mouseY, btn.x, btn.y, btn.w, btn.h);

            // Button shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(btn.x + 3, btn.y + 3, btn.w, btn.h);

            // Button background
            if (!btn.active) {
                ctx.fillStyle = COLORS.MENU_BUTTON_LOCKED;
            } else if (isHover) {
                ctx.fillStyle = COLORS.MENU_BUTTON_HOVER;
            } else {
                ctx.fillStyle = COLORS.MENU_BUTTON;
            }
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

            // Button border
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

            // Button highlight (top edge)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(btn.x, btn.y, btn.w, btn.h * 0.3);

            // Button text
            const btnFontSize = Math.max(10, btn.h * 0.35);
            const label = btn.active ? btn.label : btn.label + ' (Locked)';
            drawText(ctx, label, btn.x + btn.w / 2, btn.y + btn.h / 2, btnFontSize, COLORS.WHITE, 'center', 1);
        }
    },

    // Render simple blocky clouds
    renderClouds(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const cloudW = this.width * 0.08;
        const cloudH = cloudW * 0.4;

        // A few static clouds (could animate later)
        const clouds = [
            { x: 0.1, y: 0.08 },
            { x: 0.35, y: 0.12 },
            { x: 0.6, y: 0.06 },
            { x: 0.85, y: 0.14 },
        ];

        for (let i = 0; i < clouds.length; i++) {
            const c = clouds[i];
            // Slowly drift clouds
            const drift = ((this.time * 8 + i * 200) % (this.width + cloudW * 3)) - cloudW;
            const cx = drift;
            const cy = this.height * c.y;
            // Blocky cloud shape (3 overlapping rectangles)
            ctx.fillRect(cx, cy, cloudW, cloudH);
            ctx.fillRect(cx + cloudW * 0.2, cy - cloudH * 0.5, cloudW * 0.6, cloudH * 0.5);
            ctx.fillRect(cx - cloudW * 0.15, cy + cloudH * 0.1, cloudW * 0.4, cloudH * 0.6);
        }
    },

    // Render the playing state
    renderPlaying(ctx) {
        // Sky background for game area
        const gameH = this.height * CONFIG.GAME_AREA_RATIO;
        const grad = ctx.createLinearGradient(0, 0, 0, gameH);
        grad.addColorStop(0, COLORS.SKY_TOP);
        grad.addColorStop(1, COLORS.SKY_BOTTOM);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.width, gameH);

        // Grid
        Grid.render(ctx, this.time);

        // Path decorations (cave + castle)
        Path.render(ctx);

        // Enemies
        Enemies.render(ctx, this.time);

        // Keyboard
        Keyboard.render(ctx);
    },

    // Render pause overlay
    renderPauseOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.width, this.height);
        const pauseSize = Math.max(20, this.width * 0.04);
        drawText(ctx, 'PAUSED', this.width / 2, this.height * 0.4, pauseSize, COLORS.WHITE, 'center', 3);
        const subSize = Math.max(10, pauseSize * 0.5);
        drawText(ctx, 'Press ESC to Resume', this.width / 2, this.height * 0.4 + pauseSize * 2, subSize, COLORS.SUBTITLE_COLOR, 'center', 2);
    },
};

// Start the game when the page loads
window.addEventListener('load', () => {
    Game.init();
});

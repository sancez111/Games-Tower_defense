// ============================================
// Letter Defenders — Letter March Mode
// ============================================

const LetterMarch = {
    waveIntroTimer: 0,
    waveIntroActive: false,
    waveComplete: false,
    levelComplete: false,

    // Decoration cache for current level
    decorations: [],
    // Animated effects (snowflakes, fire particles)
    worldEffects: [],

    init(levelIndex) {
        Progression.startLevel(levelIndex);

        // Set world theme BEFORE grid init so colors are correct
        const levelDef = Progression.getLevelDef();
        currentWorldTheme = WORLD_THEMES[levelDef.world || 'forest'];
        Game.cacheSkyGradient();

        Grid.init();
        Path.init(levelDef.path || null);
        Enemies.init();
        Powers.init();
        Particles.clear();
        FloatingTexts.clear();

        this.waveIntroTimer = 0;
        this.waveIntroActive = true;
        this.waveComplete = false;
        this.levelComplete = false;
        this._isNewBest = false;
        this._completionTime = 0;

        // Generate world decorations
        this.generateDecorations();
        this.worldEffects = [];

        // Load the first wave
        this.startWaveIntro();
    },

    startWaveIntro() {
        this.waveIntroActive = true;
        this.waveIntroTimer = 3.0;
        this.waveComplete = false;
    },

    startCurrentWave() {
        const waveDef = Progression.getWaveDef();
        if (waveDef) {
            Enemies.loadWave(waveDef.enemies, waveDef.spawnInterval, waveDef.enemySpeed);
        }
        this.waveIntroActive = false;
        this.waveComplete = false;
        Game.state = STATES.PLAYING;
        // Start/resume timer when active gameplay begins
        Progression.timerRunning = true;
        // Reset per-wave power usage
        Powers.onWaveStart();
    },

    // Generate random decorations for the current world
    generateDecorations() {
        this.decorations = [];
        const world = Progression.getLevelDef().world || 'forest';
        const pathTiles = {};

        // Build a set of path tiles to avoid placing decorations on them
        for (let r = 0; r < Grid.rows; r++) {
            for (let c = 0; c < Grid.cols; c++) {
                if (Grid.tiles[r] && Grid.tiles[r][c] === TILES.PATH) {
                    pathTiles[r + ',' + c] = true;
                    // Also mark neighbors to keep decorations away from path edges
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            pathTiles[(r + dr) + ',' + (c + dc)] = true;
                        }
                    }
                }
            }
        }

        // Collect valid positions (non-path grass tiles, not edges)
        const validPositions = [];
        for (let r = 1; r < Grid.rows - 2; r++) {
            for (let c = 1; c < Grid.cols - 1; c++) {
                if (!pathTiles[r + ',' + c]) {
                    validPositions.push({ r: r, c: c });
                }
            }
        }

        // Shuffle and pick some positions for decorations
        const count = Math.min(Math.floor(validPositions.length * 0.25), 20);
        for (let i = validPositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = validPositions[i];
            validPositions[i] = validPositions[j];
            validPositions[j] = tmp;
        }

        for (let i = 0; i < count; i++) {
            const pos = validPositions[i];
            let type;
            if (world === 'forest') {
                type = Math.random() > 0.4 ? 'tree' : (Math.random() > 0.5 ? 'bush' : 'flower');
            } else if (world === 'desert') {
                type = Math.random() > 0.4 ? 'cactus' : (Math.random() > 0.5 ? 'rock' : 'dune');
            } else if (world === 'snow') {
                type = Math.random() > 0.4 ? 'snowTree' : (Math.random() > 0.5 ? 'iceCrystal' : 'snowPile');
            } else if (world === 'lava') {
                type = Math.random() > 0.4 ? 'lavaPool' : (Math.random() > 0.5 ? 'crack' : 'crystal');
            }
            this.decorations.push({
                r: pos.r,
                c: pos.c,
                type: type,
                variant: Math.random(),
            });
        }
    },

    // Render world decorations on top of the grid
    renderDecorations(ctx) {
        const ts = Grid.tileSize;
        const world = Progression.getLevelDef().world || 'forest';

        for (let i = 0; i < this.decorations.length; i++) {
            const d = this.decorations[i];
            const px = Grid.offsetX + d.c * ts;
            const py = Grid.offsetY + d.r * ts;

            if (world === 'forest') {
                this._renderForestDecor(ctx, d, px, py, ts);
            } else if (world === 'desert') {
                this._renderDesertDecor(ctx, d, px, py, ts);
            } else if (world === 'snow') {
                this._renderSnowDecor(ctx, d, px, py, ts);
            } else if (world === 'lava') {
                this._renderLavaDecor(ctx, d, px, py, ts);
            }
        }
    },

    _renderForestDecor(ctx, d, px, py, ts) {
        if (d.type === 'tree') {
            // Trunk
            ctx.fillStyle = '#6B4226';
            ctx.fillRect(px + ts * 0.35, py + ts * 0.4, ts * 0.3, ts * 0.6);
            // Canopy
            ctx.fillStyle = '#3A7D20';
            ctx.fillRect(px + ts * 0.1, py - ts * 0.1, ts * 0.8, ts * 0.55);
            ctx.fillStyle = '#4D9930';
            ctx.fillRect(px + ts * 0.2, py - ts * 0.2, ts * 0.6, ts * 0.35);
        } else if (d.type === 'bush') {
            ctx.fillStyle = '#3A7D20';
            ctx.fillRect(px + ts * 0.15, py + ts * 0.5, ts * 0.7, ts * 0.4);
            ctx.fillStyle = '#4D9930';
            ctx.fillRect(px + ts * 0.25, py + ts * 0.4, ts * 0.5, ts * 0.3);
        } else if (d.type === 'flower') {
            // Stem
            ctx.fillStyle = '#3A7D20';
            ctx.fillRect(px + ts * 0.45, py + ts * 0.5, ts * 0.1, ts * 0.4);
            // Petal colors based on variant
            const colors = ['#FF6688', '#FFDD44', '#FF8844', '#BB66FF'];
            ctx.fillStyle = colors[Math.floor(d.variant * colors.length)];
            ctx.fillRect(px + ts * 0.35, py + ts * 0.35, ts * 0.3, ts * 0.2);
        }
    },

    _renderDesertDecor(ctx, d, px, py, ts) {
        if (d.type === 'cactus') {
            // Main body
            ctx.fillStyle = '#4A8B3A';
            ctx.fillRect(px + ts * 0.35, py + ts * 0.1, ts * 0.3, ts * 0.85);
            // Arms
            if (d.variant > 0.5) {
                ctx.fillRect(px + ts * 0.1, py + ts * 0.3, ts * 0.25, ts * 0.15);
                ctx.fillRect(px + ts * 0.1, py + ts * 0.15, ts * 0.15, ts * 0.3);
            }
            if (d.variant < 0.7) {
                ctx.fillRect(px + ts * 0.65, py + ts * 0.4, ts * 0.25, ts * 0.15);
                ctx.fillRect(px + ts * 0.75, py + ts * 0.25, ts * 0.15, ts * 0.3);
            }
        } else if (d.type === 'rock') {
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(px + ts * 0.2, py + ts * 0.6, ts * 0.6, ts * 0.35);
            ctx.fillStyle = '#9B8365';
            ctx.fillRect(px + ts * 0.3, py + ts * 0.5, ts * 0.4, ts * 0.2);
        } else if (d.type === 'dune') {
            ctx.fillStyle = '#E0BE7A';
            ctx.fillRect(px + ts * 0.05, py + ts * 0.65, ts * 0.9, ts * 0.3);
            ctx.fillStyle = '#D4A65A';
            ctx.fillRect(px + ts * 0.15, py + ts * 0.55, ts * 0.7, ts * 0.15);
        }
    },

    _renderSnowDecor(ctx, d, px, py, ts) {
        if (d.type === 'snowTree') {
            // Trunk
            ctx.fillStyle = '#6B5B4B';
            ctx.fillRect(px + ts * 0.35, py + ts * 0.4, ts * 0.3, ts * 0.6);
            // Dark green canopy
            ctx.fillStyle = '#2A5A1A';
            ctx.fillRect(px + ts * 0.1, py - ts * 0.1, ts * 0.8, ts * 0.55);
            // Snow on top
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(px + ts * 0.1, py - ts * 0.15, ts * 0.8, ts * 0.15);
            ctx.fillRect(px + ts * 0.2, py - ts * 0.25, ts * 0.6, ts * 0.12);
        } else if (d.type === 'iceCrystal') {
            ctx.fillStyle = '#A0D8F0';
            ctx.fillRect(px + ts * 0.4, py + ts * 0.2, ts * 0.2, ts * 0.6);
            ctx.fillRect(px + ts * 0.25, py + ts * 0.35, ts * 0.5, ts * 0.2);
            ctx.fillStyle = '#C0E8FF';
            ctx.fillRect(px + ts * 0.42, py + ts * 0.25, ts * 0.16, ts * 0.1);
        } else if (d.type === 'snowPile') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(px + ts * 0.1, py + ts * 0.65, ts * 0.8, ts * 0.25);
            ctx.fillStyle = '#E0E8F0';
            ctx.fillRect(px + ts * 0.2, py + ts * 0.55, ts * 0.6, ts * 0.15);
        }
    },

    _renderLavaDecor(ctx, d, px, py, ts) {
        const time = Game.time;
        if (d.type === 'lavaPool') {
            // Animated glow
            const pulse = 0.6 + Math.sin(time * 3 + d.variant * 10) * 0.2;
            ctx.globalAlpha = pulse;
            ctx.fillStyle = '#CC4400';
            ctx.fillRect(px + ts * 0.1, py + ts * 0.3, ts * 0.8, ts * 0.5);
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(px + ts * 0.2, py + ts * 0.4, ts * 0.6, ts * 0.3);
            // Bright center
            ctx.fillStyle = '#FFAA00';
            const cx = px + ts * 0.35 + Math.sin(time * 2 + d.variant * 5) * ts * 0.1;
            ctx.fillRect(cx, py + ts * 0.45, ts * 0.3, ts * 0.15);
            ctx.globalAlpha = 1;
        } else if (d.type === 'crack') {
            ctx.strokeStyle = '#FF4400';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px + ts * 0.2, py + ts * 0.3);
            ctx.lineTo(px + ts * 0.5, py + ts * 0.5);
            ctx.lineTo(px + ts * 0.4, py + ts * 0.7);
            ctx.lineTo(px + ts * 0.7, py + ts * 0.85);
            ctx.stroke();
            // Glow in cracks
            ctx.globalAlpha = 0.3 + Math.sin(time * 4 + d.variant * 8) * 0.15;
            ctx.strokeStyle = '#FFAA00';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
        } else if (d.type === 'crystal') {
            // Glowing crystal
            const glow = 0.5 + Math.sin(time * 2.5 + d.variant * 6) * 0.3;
            ctx.globalAlpha = glow;
            ctx.fillStyle = '#FF8800';
            ctx.fillRect(px + ts * 0.35, py + ts * 0.2, ts * 0.3, ts * 0.7);
            ctx.fillStyle = '#FFAA44';
            ctx.fillRect(px + ts * 0.38, py + ts * 0.25, ts * 0.24, ts * 0.15);
            ctx.globalAlpha = 1;
        }
    },

    // Update animated world effects (snowflakes, fire particles)
    updateWorldEffects(dt) {
        const world = Progression.getLevelDef().world || 'forest';
        const gameH = Game.height * CONFIG.GAME_AREA_RATIO;

        // Spawn new effects
        if (world === 'snow') {
            // Spawn snowflakes
            if (Math.random() > 0.6) {
                this.worldEffects.push({
                    type: 'snowflake',
                    x: Math.random() * Game.width,
                    y: -5,
                    vx: randFloat(-15, 15),
                    vy: randFloat(30, 80),
                    size: randFloat(2, 5),
                    life: 15,
                });
            }
        } else if (world === 'lava') {
            // Spawn fire particles from lava pool decorations
            if (Math.random() > 0.85 && this.decorations.length > 0) {
                const lavaPools = this.decorations.filter(function(d) { return d.type === 'lavaPool'; });
                if (lavaPools.length > 0) {
                    const pool = lavaPools[Math.floor(Math.random() * lavaPools.length)];
                    const ts = Grid.tileSize;
                    const px = Grid.offsetX + pool.c * ts + ts * 0.5;
                    const py = Grid.offsetY + pool.r * ts + ts * 0.4;
                    this.worldEffects.push({
                        type: 'fireParticle',
                        x: px + randFloat(-ts * 0.3, ts * 0.3),
                        y: py,
                        vx: randFloat(-8, 8),
                        vy: randFloat(-40, -80),
                        size: randFloat(2, 5),
                        life: randFloat(0.5, 1.2),
                        maxLife: 1.2,
                    });
                }
            }
        }

        // Update existing effects
        for (let i = this.worldEffects.length - 1; i >= 0; i--) {
            const e = this.worldEffects[i];
            e.x += e.vx * dt;
            e.y += e.vy * dt;
            e.life -= dt;
            // Snowflakes: gentle sway
            if (e.type === 'snowflake') {
                e.vx += Math.sin(Game.time * 2 + i) * 0.5;
            }
            if (e.life <= 0 || e.y > gameH + 10) {
                this.worldEffects.splice(i, 1);
            }
        }

        // Cap max particles
        if (this.worldEffects.length > 100) {
            this.worldEffects.splice(0, this.worldEffects.length - 100);
        }
    },

    // Render animated world effects
    renderWorldEffects(ctx) {
        for (let i = 0; i < this.worldEffects.length; i++) {
            const e = this.worldEffects[i];
            if (e.type === 'snowflake') {
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
            } else if (e.type === 'fireParticle') {
                const alpha = e.maxLife ? clamp(e.life / e.maxLife, 0, 1) : 0.8;
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = Math.random() > 0.5 ? '#FF6600' : '#FFAA00';
                ctx.fillRect(e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
            }
        }
        ctx.globalAlpha = 1;
    },

    update(dt) {
        // Update world animated effects always (even during wave intro for ambiance)
        this.updateWorldEffects(dt);

        // Wave intro countdown
        if (this.waveIntroActive) {
            // Timer does NOT tick during wave intros
            Progression.timerRunning = false;
            this.waveIntroTimer -= dt;
            if (this.waveIntroTimer <= 0) {
                this.startCurrentWave();
            }
            return;
        }

        // Accumulate level timer during active gameplay
        if (Progression.timerRunning) {
            Progression.levelTime += dt;
        }

        Enemies.update(dt, Game.time);
        Powers.update(dt);
        Particles.update(dt);
        FloatingTexts.update(dt);
        Keyboard.update(dt);

        // Update keyboard highlights only when enemy list changes
        if (Enemies.listChanged || Powers.pickup) {
            const activeLetters = Enemies.list
                .filter(e => e.alive)
                .map(e => e.letter);
            // Also highlight the pickup letter
            if (Powers.pickup) {
                activeLetters.push(Powers.pickup.letter);
            }
            Keyboard.highlightKeys(activeLetters);
            Enemies.listChanged = false;
        }

        // Check wave completion
        if (!this.waveComplete && Enemies.isWaveComplete()) {
            this.waveComplete = true;
            Progression.currentWave++;

            if (Progression.currentWave >= Progression.getTotalWaves()) {
                // Level complete!
                this.levelComplete = true;
                Progression.timerRunning = false;
                const stars = Progression.getStars();
                const time = Math.round(Progression.levelTime * 100) / 100;
                const saveResult = Progression.saveLevel(Progression.currentLevel, stars, time);
                this._isNewBest = (saveResult.bestTime === time);
                this._completionTime = time;
                Game.state = STATES.WIN;
            } else {
                // Next wave intro
                Game.state = STATES.WAVE_INTRO;
                this.startWaveIntro();
            }
        }
    },

    // Called by Enemies when an enemy reaches the base
    onEnemyReachedBase(enemy) {
        Progression.loseHeart();
        Progression.resetCombo();
        ScreenShake.trigger(8, 0.3);

        if (Progression.isGameOver()) {
            Progression.timerRunning = false;
            Game.state = STATES.GAME_OVER;
        }
    },

    // Handle special keys (Spacebar = USE power, Alt = ROTATE power)
    processSpecialKey(key) {
        if (this.waveIntroActive) return;
        if (key === 'SPACE') {
            Powers.activatePower();
        } else if (key === 'ALT') {
            Powers.rotateSelection();
        }
    },

    // Process a letter input (keyboard or touch)
    processInput(letter, shifted) {
        if (this.waveIntroActive) return;

        // Check pickups FIRST before enemies
        if (Powers.tryCollectPickup(letter)) {
            Keyboard.flashKey(letter, 'CORRECT');
            return;
        }

        const hitResult = Enemies.tryHitLetter(letter, shifted);
        if (hitResult) {
            Keyboard.flashKey(letter, 'CORRECT');

            // Tank damaged but not destroyed — feedback hints at Shift
            if (hitResult._tankDamaged) {
                ScreenShake.trigger(3, 0.1);
                FloatingTexts.spawn(hitResult.x, hitResult.y - 20, 'Now SHIFT+' + hitResult.letter + '!', '#FFDD44', 10);
                return;
            }

            // Full kill (walker, sprinter, tank final hit, or individual swarm unit)
            ScreenShake.trigger(4, 0.15);

            // Score
            const points = Progression.scoreKill(hitResult.pathProgress);

            // Floating score text
            FloatingTexts.spawn(hitResult.x, hitResult.y - 20, '+' + points, COLORS.SCORE_COLOR, 14);

            // Combo text
            if (Progression.combo >= 2) {
                FloatingTexts.spawn(hitResult.x + 20, hitResult.y - 40,
                    'x' + Progression.combo + '!', COLORS.COMBO_COLOR, 12);
            }

            // Streak messages
            if (Progression.combo === 3) {
                FloatingTexts.spawn(hitResult.x, hitResult.y - 60, 'NICE!', '#44FF44', 16);
            } else if (Progression.combo === 5) {
                FloatingTexts.spawn(hitResult.x, hitResult.y - 60, 'GREAT!', '#44DDFF', 18);
            } else if (Progression.combo === 7) {
                FloatingTexts.spawn(hitResult.x, hitResult.y - 60, 'PERFECT!', '#FF44FF', 20);
            } else if (Progression.combo > 7 && Progression.combo % 3 === 0) {
                FloatingTexts.spawn(hitResult.x, hitResult.y - 60, 'AMAZING!', '#FFD700', 20);
            }

            // Try to spawn a power pickup from the kill
            Powers.trySpawnPickup(hitResult.x, hitResult.y);
        } else {
            Keyboard.flashKey(letter, 'WRONG');
            Progression.resetCombo();
        }
    },

    render(ctx) {
        // Game area sky (cached gradient)
        const gameH = Game.height * CONFIG.GAME_AREA_RATIO;
        if (Game._skyGradient) {
            ctx.fillStyle = Game._skyGradient;
            ctx.fillRect(0, 0, Game.width, gameH);
        }

        Grid.render(ctx, Game.time);
        this.renderDecorations(ctx);
        Path.render(ctx);
        this.renderWorldEffects(ctx);
        Enemies.render(ctx, Game.time);
        Powers.render(ctx);
        Particles.render(ctx);
        FloatingTexts.render(ctx);
        Keyboard.render(ctx);
        Powers.renderInventory(ctx);

        // HUD
        this.renderHUD(ctx);

        // Wave intro overlay
        if (this.waveIntroActive) {
            this.renderWaveIntro(ctx);
        }
    },

    renderHUD(ctx) {
        const padding = 10;
        const hudY = 8;

        // Score (top-left)
        const scoreSize = Math.max(12, Game.width * 0.018);
        drawText(ctx, 'Score: ' + Progression.score, padding + 5, hudY + scoreSize / 2 + 5,
            scoreSize, COLORS.SCORE_COLOR, 'left', 2);

        // Wave indicator (top-center)
        const waveSize = Math.max(10, Game.width * 0.014);
        const waveText = 'Wave ' + (Progression.currentWave + 1) + '/' + Progression.getTotalWaves();
        drawText(ctx, waveText, Game.width / 2, hudY + waveSize / 2 + 5,
            waveSize, COLORS.WAVE_COLOR, 'center', 2);

        // Timer (below wave indicator)
        const timerSize = Math.max(9, Game.width * 0.012);
        const timerText = formatTime(Progression.levelTime);
        drawText(ctx, timerText, Game.width / 2, hudY + waveSize / 2 + 5 + waveSize + timerSize * 0.6,
            timerSize, COLORS.WAVE_COLOR, 'center', 1);

        // Hearts (top-right)
        const heartSize = Math.max(16, Game.width * 0.025);
        const heartGap = heartSize * 1.3;
        const heartsStartX = Game.width - padding - CONFIG.MAX_HEARTS * heartGap;
        for (let i = 0; i < CONFIG.MAX_HEARTS; i++) {
            drawHeart(ctx, heartsStartX + i * heartGap, hudY + 2, heartSize, i < Progression.hearts);
        }
    },

    renderWaveIntro(ctx) {
        const gameH = Game.height * CONFIG.GAME_AREA_RATIO;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, Game.width, gameH);

        const countdown = Math.ceil(this.waveIntroTimer);
        const waveNum = Progression.currentWave + 1;
        const totalWaves = Progression.getTotalWaves();

        const titleSize = Math.max(18, Game.width * 0.03);
        drawText(ctx, 'Wave ' + waveNum + ' of ' + totalWaves, Game.width / 2, gameH * 0.35,
            titleSize, COLORS.WAVE_COLOR, 'center', 3);

        const subText = waveNum === 1 ? 'Get Ready!' : 'Wave ' + waveNum + ' incoming!';
        const subSize = Math.max(12, Game.width * 0.018);
        drawText(ctx, subText, Game.width / 2, gameH * 0.45,
            subSize, COLORS.SUBTITLE_COLOR, 'center', 2);

        const countSize = Math.max(24, Game.width * 0.05);
        drawText(ctx, '' + countdown, Game.width / 2, gameH * 0.6,
            countSize, COLORS.TITLE_COLOR, 'center', 3);
    },
};

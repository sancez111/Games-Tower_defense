// ============================================
// Letter Defenders — Letter March Mode
// ============================================

const LetterMarch = {
    waveIntroTimer: 0,
    waveIntroActive: false,
    waveComplete: false,
    levelComplete: false,

    init(levelIndex) {
        Progression.startLevel(levelIndex);
        Grid.init();
        const levelDef = Progression.getLevelDef();
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

    update(dt) {
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
        Path.render(ctx);
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

// ============================================
// Letter Defenders — Enemy System
// ============================================

const Enemies = {
    list: [],
    spawnTimer: 0,
    spawnQueue: [],
    currentSpeed: 0.03,
    currentInterval: 3,

    // Track when enemy list changes for keyboard highlight optimization
    listChanged: false,

    init() {
        this.list = [];
        this.spawnTimer = 0;
        this.spawnQueue = [];
        this.currentSpeed = 0.03;
        this.currentInterval = 3;
        this.listChanged = true;
    },

    // Set the wave's spawn queue and parameters
    loadWave(enemies, spawnInterval, enemySpeed) {
        this.spawnQueue = enemies.slice();
        this.currentInterval = spawnInterval;
        this.currentSpeed = enemySpeed;
        this.spawnTimer = 0;
    },

    spawn(letter) {
        this.list.push({
            letter: letter.toUpperCase(),
            pathProgress: 0,
            speed: this.currentSpeed,
            x: 0,
            y: 0,
            alive: true,
            flash: null,
            bodyColor: COLORS.ENEMY_BODY,
            size: 1,
            bobOffset: Math.random() * Math.PI * 2,
        });
        this.listChanged = true;
    },

    update(dt, time) {
        // Spawn timer
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.currentInterval && this.spawnQueue.length > 0) {
            this.spawnTimer = 0;
            this.spawn(this.spawnQueue.shift());
        }

        // Update each enemy
        for (let i = this.list.length - 1; i >= 0; i--) {
            const enemy = this.list[i];

            enemy.pathProgress += enemy.speed * dt;

            const pos = Path.getPositionAt(enemy.pathProgress);
            enemy.x = pos.x;
            enemy.y = pos.y;

            // Update flash animation
            if (enemy.flash) {
                enemy.flash.update(dt);
                if (!enemy.flash.active) {
                    enemy.flash = null;
                    if (!enemy.alive) {
                        this.list.splice(i, 1);
                        this.listChanged = true;
                        continue;
                    }
                }
            }

            // Reached end of path
            if (enemy.pathProgress >= 1 && enemy.alive) {
                enemy.alive = false;
                this.list.splice(i, 1);
                this.listChanged = true;

                // Signal to game that enemy reached base
                if (typeof LetterMarch !== 'undefined' && LetterMarch.onEnemyReachedBase) {
                    LetterMarch.onEnemyReachedBase(enemy);
                }
            }
        }
    },

    // Returns the enemy if hit, or null
    tryHitLetter(letter) {
        letter = letter.toUpperCase();
        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            if (enemy.letter === letter && enemy.alive) {
                enemy.alive = false;
                // Spawn particles instead of white flash
                Particles.spawn(enemy.x, enemy.y, enemy.bodyColor, 8);
                // Remove immediately (no flash delay for particles)
                const hitEnemy = { ...enemy };
                this.list.splice(i, 1);
                this.listChanged = true;
                return hitEnemy;
            }
        }
        return null;
    },

    // Check if wave is complete (no enemies left and no more to spawn)
    isWaveComplete() {
        return this.spawnQueue.length === 0 && this.list.length === 0;
    },

    render(ctx, time) {
        const ts = Grid.tileSize;
        const enemySize = ts * 0.8;

        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            const halfSize = enemySize / 2;
            const bob = Math.sin(time * 6 + enemy.bobOffset) * 3;
            const ex = enemy.x - halfSize;
            const ey = enemy.y - enemySize + bob;

            if (enemy.flash && enemy.flash.active) {
                const flashAlpha = 1 - enemy.flash.progress;
                const scale = 1 + enemy.flash.progress * 0.5;
                const sx = enemy.x - halfSize * scale;
                const sy = enemy.y - enemySize * scale + bob;
                const sw = enemySize * scale;
                const sh = enemySize * scale;
                ctx.globalAlpha = flashAlpha;
                ctx.fillStyle = COLORS.WHITE;
                ctx.fillRect(sx, sy, sw, sh);
                ctx.globalAlpha = 1;
                continue;
            }

            // Body
            ctx.fillStyle = enemy.bodyColor;
            ctx.fillRect(ex, ey, enemySize, enemySize);

            // Outline
            ctx.fillStyle = COLORS.ENEMY_DARK;
            ctx.fillRect(ex, ey, enemySize, 3);
            ctx.fillRect(ex, ey, 3, enemySize);
            ctx.fillRect(ex + enemySize - 3, ey, 3, enemySize);
            ctx.fillRect(ex, ey + enemySize - 3, enemySize, 3);

            // Eyes
            const eyeSize = Math.max(3, enemySize * 0.12);
            const eyeY = ey + enemySize * 0.22;
            ctx.fillStyle = COLORS.ENEMY_EYES;
            ctx.fillRect(ex + enemySize * 0.25, eyeY, eyeSize, eyeSize);
            ctx.fillRect(ex + enemySize * 0.63, eyeY, eyeSize, eyeSize);

            // Letter
            const letterSize = Math.max(12, enemySize * 0.45);
            drawText(ctx, enemy.letter,
                enemy.x, ey + enemySize * 0.65,
                letterSize, COLORS.ENEMY_LETTER, 'center', 1);

            // Feet
            const footW = enemySize * 0.25;
            const footH = enemySize * 0.15;
            ctx.fillStyle = COLORS.ENEMY_DARK;
            ctx.fillRect(ex + enemySize * 0.15, ey + enemySize, footW, footH);
            ctx.fillRect(ex + enemySize * 0.6, ey + enemySize, footW, footH);
        }
    }
};

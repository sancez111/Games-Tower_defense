// ============================================
// Letter Defenders — Enemy System
// ============================================

const Enemies = {
    list: [],
    spawnTimer: 0,
    spawnQueue: [],
    lettersToSpawn: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    spawnIndex: 0,

    init() {
        this.list = [];
        this.spawnTimer = 0;
        this.spawnIndex = 0;
        // Start with a batch of test letters
        this.spawnQueue = ['F', 'J', 'D', 'K', 'S', 'L', 'A'];
    },

    // Create a new enemy with a given letter
    spawn(letter) {
        this.list.push({
            letter: letter.toUpperCase(),
            pathProgress: 0,
            speed: CONFIG.ENEMY_SPEED,
            x: 0,
            y: 0,
            alive: true,
            flash: null,         // flash animation when hit
            bodyColor: COLORS.ENEMY_BODY,
            size: 1,             // scale multiplier
            bobOffset: Math.random() * Math.PI * 2, // for walking bob animation
        });
    },

    // Update all enemies
    update(dt, time) {
        // Spawn timer
        this.spawnTimer += dt;
        if (this.spawnTimer >= CONFIG.SPAWN_INTERVAL && this.spawnQueue.length > 0) {
            this.spawnTimer = 0;
            this.spawn(this.spawnQueue.shift());
        }

        // Re-queue enemies if all spawned and list is empty
        if (this.spawnQueue.length === 0 && this.list.length === 0) {
            this.spawnQueue = ['F', 'J', 'D', 'K', 'S', 'L', 'A'];
        }

        // Update each enemy
        for (let i = this.list.length - 1; i >= 0; i--) {
            const enemy = this.list[i];

            // Move along path
            enemy.pathProgress += enemy.speed * dt;

            // Get pixel position from path
            const pos = Path.getPositionAt(enemy.pathProgress);
            enemy.x = pos.x;
            enemy.y = pos.y;

            // Update flash animation if active
            if (enemy.flash) {
                enemy.flash.update(dt);
                if (!enemy.flash.active) {
                    enemy.flash = null;
                    if (!enemy.alive) {
                        this.list.splice(i, 1);
                        continue;
                    }
                }
            }

            // Remove if reached end of path
            if (enemy.pathProgress >= 1) {
                this.list.splice(i, 1);
            }
        }
    },

    // Check if a letter matches any enemy, and handle the hit
    tryHitLetter(letter) {
        letter = letter.toUpperCase();
        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            if (enemy.letter === letter && enemy.alive) {
                // Hit! Start flash animation then remove
                enemy.alive = false;
                enemy.flash = createFlash(0.4);
                return true;
            }
        }
        return false;
    },

    // Render all enemies
    render(ctx, time) {
        const ts = Grid.tileSize;
        const enemySize = ts * 0.8;

        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            const halfSize = enemySize / 2;

            // Walking bob animation
            const bob = Math.sin(time * 6 + enemy.bobOffset) * 3;

            const ex = enemy.x - halfSize;
            const ey = enemy.y - enemySize + bob;

            // Flash effect (white blink when hit)
            if (enemy.flash && enemy.flash.active) {
                const flashAlpha = 1 - enemy.flash.progress;
                // Expand and fade
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

            // Body (square block)
            ctx.fillStyle = enemy.bodyColor;
            ctx.fillRect(ex, ey, enemySize, enemySize);

            // Darker outline
            ctx.fillStyle = COLORS.ENEMY_DARK;
            ctx.fillRect(ex, ey, enemySize, 3);
            ctx.fillRect(ex, ey, 3, enemySize);
            ctx.fillRect(ex + enemySize - 3, ey, 3, enemySize);
            ctx.fillRect(ex, ey + enemySize - 3, enemySize, 3);

            // Eyes (two small dark squares)
            const eyeSize = Math.max(3, enemySize * 0.12);
            const eyeY = ey + enemySize * 0.22;
            ctx.fillStyle = COLORS.ENEMY_EYES;
            ctx.fillRect(ex + enemySize * 0.25, eyeY, eyeSize, eyeSize);
            ctx.fillRect(ex + enemySize * 0.63, eyeY, eyeSize, eyeSize);

            // Letter on body (large, centered)
            const letterSize = Math.max(12, enemySize * 0.45);
            drawText(ctx, enemy.letter,
                enemy.x, ey + enemySize * 0.65,
                letterSize, COLORS.ENEMY_LETTER, 'center', 1);

            // Small feet (two blocks below body)
            const footW = enemySize * 0.25;
            const footH = enemySize * 0.15;
            ctx.fillStyle = COLORS.ENEMY_DARK;
            ctx.fillRect(ex + enemySize * 0.15, ey + enemySize, footW, footH);
            ctx.fillRect(ex + enemySize * 0.6, ey + enemySize, footW, footH);
        }
    }
};

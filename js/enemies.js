// ============================================
// Letter Defenders — Enemy System
// ============================================

// Global swarm group counter
let _nextSwarmGroup = 1;

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
    // Supports both old format (array of letter strings) and new format (mixed strings/objects)
    loadWave(enemies, spawnInterval, enemySpeed) {
        this.spawnQueue = [];
        this.currentInterval = spawnInterval;
        this.currentSpeed = enemySpeed;
        this.spawnTimer = 0;

        for (let i = 0; i < enemies.length; i++) {
            const entry = enemies[i];
            if (typeof entry === 'string') {
                // Old format: plain letter string defaults to walker
                this.spawnQueue.push({ letter: entry, type: 'walker', count: 1 });
            } else {
                // New format: { letter, type, count? }
                this.spawnQueue.push({
                    letter: entry.letter,
                    type: entry.type || 'walker',
                    count: entry.count || 1,
                });
            }
        }
    },

    spawn(letter, type, swarmGroup, swarmOffset) {
        type = type || 'walker';
        const typeDef = ENEMY_TYPES[type] || ENEMY_TYPES.walker;

        this.list.push({
            letter: letter.toUpperCase(),
            type: type,
            pathProgress: 0,
            speed: this.currentSpeed * typeDef.speedMultiplier,
            x: 0,
            y: 0,
            alive: true,
            flash: null,
            bodyColor: typeDef.color,
            darkColor: typeDef.darkColor,
            sizeMultiplier: typeDef.sizeMultiplier,
            maxHits: typeDef.maxHits,
            currentHits: 0,
            bobOffset: Math.random() * Math.PI * 2,
            swarmGroup: swarmGroup || 0,
            swarmOffsetX: swarmOffset ? swarmOffset.x : 0,
            swarmOffsetY: swarmOffset ? swarmOffset.y : 0,
            // Tank damage state
            damaged: false,
            damageFlash: null,
            // Sprinter trail
            trailPositions: [],
        });
        this.listChanged = true;
    },

    update(dt, time) {
        // Spawn timer
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.currentInterval && this.spawnQueue.length > 0) {
            this.spawnTimer = 0;
            const entry = this.spawnQueue.shift();

            if (entry.type === 'swarm') {
                // Spawn a cluster with shared swarm group
                const group = _nextSwarmGroup++;
                const count = entry.count || 3;
                for (let s = 0; s < count; s++) {
                    const offset = {
                        x: (Math.random() - 0.5) * 10,
                        y: (Math.random() - 0.5) * 10,
                    };
                    this.spawn(entry.letter, 'swarm', group, offset);
                }
            } else {
                this.spawn(entry.letter, entry.type);
            }
        }

        // Update each enemy
        for (let i = this.list.length - 1; i >= 0; i--) {
            const enemy = this.list[i];

            enemy.pathProgress += enemy.speed * dt;

            const pos = Path.getPositionAt(enemy.pathProgress);
            enemy.x = pos.x + enemy.swarmOffsetX;
            enemy.y = pos.y + enemy.swarmOffsetY;

            // Track trail for sprinters
            if (enemy.type === 'sprinter' && enemy.alive) {
                enemy.trailPositions.push({ x: enemy.x, y: enemy.y, age: 0 });
                if (enemy.trailPositions.length > 6) {
                    enemy.trailPositions.shift();
                }
                for (let t = 0; t < enemy.trailPositions.length; t++) {
                    enemy.trailPositions[t].age += dt;
                }
            }

            // Update damage flash (tank first-hit flash)
            if (enemy.damageFlash) {
                enemy.damageFlash.update(dt);
                if (!enemy.damageFlash.active) {
                    enemy.damageFlash = null;
                }
            }

            // Update destroy flash animation
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

    // Returns the enemy if hit (destroyed), or null
    tryHitLetter(letter) {
        letter = letter.toUpperCase();

        // First check for swarm groups — one keypress kills all in the group
        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            if (enemy.letter === letter && enemy.alive && enemy.type === 'swarm' && enemy.swarmGroup > 0) {
                // Find all enemies in this swarm group
                const group = enemy.swarmGroup;
                const killed = [];
                for (let j = this.list.length - 1; j >= 0; j--) {
                    const e = this.list[j];
                    if (e.swarmGroup === group && e.alive) {
                        e.alive = false;
                        Particles.spawn(e.x, e.y, e.bodyColor, 6);
                        killed.push({ ...e });
                        this.list.splice(j, 1);
                    }
                }
                this.listChanged = true;
                // Return the first one as the "hit" enemy; caller gets points once
                // but the visual effect is a big multi-explosion
                if (killed.length > 0) {
                    killed[0]._swarmCount = killed.length;
                    return killed[0];
                }
            }
        }

        // Regular enemies (walker, sprinter, tank)
        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            if (enemy.letter === letter && enemy.alive) {
                enemy.currentHits++;

                if (enemy.currentHits >= enemy.maxHits) {
                    // Destroyed
                    enemy.alive = false;
                    Particles.spawn(enemy.x, enemy.y, enemy.bodyColor, 8);
                    const hitEnemy = { ...enemy };
                    this.list.splice(i, 1);
                    this.listChanged = true;
                    return hitEnemy;
                } else {
                    // Tank: damaged but not destroyed
                    enemy.damaged = true;
                    enemy.damageFlash = createFlash(0.3);
                    // Return a special marker so the game knows a hit landed
                    return { _tankDamaged: true, letter: enemy.letter, x: enemy.x, y: enemy.y, pathProgress: enemy.pathProgress };
                }
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

        for (let i = 0; i < this.list.length; i++) {
            const enemy = this.list[i];
            const baseSize = ts * enemy.sizeMultiplier;
            const halfSize = baseSize / 2;
            const bob = Math.sin(time * 6 + enemy.bobOffset) * 3;
            const ex = enemy.x - halfSize;
            const ey = enemy.y - baseSize + bob;

            // Destroy flash
            if (enemy.flash && enemy.flash.active) {
                const flashAlpha = 1 - enemy.flash.progress;
                const scale = 1 + enemy.flash.progress * 0.5;
                const sx = enemy.x - halfSize * scale;
                const sy = enemy.y - baseSize * scale + bob;
                const sw = baseSize * scale;
                const sh = baseSize * scale;
                ctx.globalAlpha = flashAlpha;
                ctx.fillStyle = COLORS.WHITE;
                ctx.fillRect(sx, sy, sw, sh);
                ctx.globalAlpha = 1;
                continue;
            }

            // Sprinter speed trail
            if (enemy.type === 'sprinter' && enemy.trailPositions.length > 1) {
                for (let t = 0; t < enemy.trailPositions.length - 1; t++) {
                    const tp = enemy.trailPositions[t];
                    const alpha = 0.15 * (1 - t / enemy.trailPositions.length);
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = enemy.bodyColor;
                    const trailSize = baseSize * 0.6;
                    ctx.fillRect(tp.x - trailSize / 2, tp.y - trailSize + bob, trailSize, trailSize);
                }
                ctx.globalAlpha = 1;
            }

            // Damage flash overlay for tanks
            if (enemy.damageFlash && enemy.damageFlash.active) {
                const flashProgress = enemy.damageFlash.progress;
                // Brief yellow flash
                if (flashProgress < 0.5) {
                    ctx.fillStyle = '#FFDD44';
                    ctx.globalAlpha = 0.6 * (1 - flashProgress * 2);
                    ctx.fillRect(ex - 2, ey - 2, baseSize + 4, baseSize + 4);
                    ctx.globalAlpha = 1;
                }
            }

            // Body
            ctx.fillStyle = enemy.bodyColor;
            ctx.fillRect(ex, ey, baseSize, baseSize);

            // Outline (thicker for tanks)
            const outlineW = enemy.type === 'tank' ? 4 : 3;
            ctx.fillStyle = enemy.darkColor;
            ctx.fillRect(ex, ey, baseSize, outlineW);
            ctx.fillRect(ex, ey, outlineW, baseSize);
            ctx.fillRect(ex + baseSize - outlineW, ey, outlineW, baseSize);
            ctx.fillRect(ex, ey + baseSize - outlineW, baseSize, outlineW);

            // Tank horns
            if (enemy.type === 'tank') {
                ctx.fillStyle = enemy.darkColor;
                const hornW = baseSize * 0.15;
                const hornH = baseSize * 0.25;
                ctx.fillRect(ex + baseSize * 0.15, ey - hornH, hornW, hornH);
                ctx.fillRect(ex + baseSize * 0.7, ey - hornH, hornW, hornH);
            }

            // Tank damage crack indicator
            if (enemy.damaged && enemy.type === 'tank') {
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(ex + baseSize * 0.3, ey + baseSize * 0.2);
                ctx.lineTo(ex + baseSize * 0.5, ey + baseSize * 0.45);
                ctx.lineTo(ex + baseSize * 0.4, ey + baseSize * 0.7);
                ctx.stroke();
            }

            // Eyes (not for swarm — too small)
            if (enemy.type !== 'swarm') {
                const eyeSize = Math.max(3, baseSize * 0.12);
                const eyeY = ey + baseSize * 0.22;
                ctx.fillStyle = COLORS.ENEMY_EYES;
                ctx.fillRect(ex + baseSize * 0.25, eyeY, eyeSize, eyeSize);
                ctx.fillRect(ex + baseSize * 0.63, eyeY, eyeSize, eyeSize);
            }

            // Letter
            const letterSize = Math.max(10, baseSize * 0.45);
            const letterWeight = enemy.type === 'tank' ? 'bold ' : '';
            if (letterWeight) {
                ctx.font = 'bold ' + letterSize + 'px ' + CONFIG.FONT_FAMILY;
            }
            drawText(ctx, enemy.letter,
                enemy.x, ey + baseSize * 0.65,
                letterSize, COLORS.ENEMY_LETTER, 'center', 1);

            // Feet (walker and tank only)
            if (enemy.type === 'walker' || enemy.type === 'tank') {
                const footW = baseSize * 0.25;
                const footH = baseSize * 0.15;
                ctx.fillStyle = enemy.darkColor;
                ctx.fillRect(ex + baseSize * 0.15, ey + baseSize, footW, footH);
                ctx.fillRect(ex + baseSize * 0.6, ey + baseSize, footW, footH);
            }
        }
    }
};

// ============================================
// Letter Defenders — Super Powers System
// ============================================

const POWER_TYPES = {
    fireball:  { name: 'Fireball',   color: '#FF6600', darkColor: '#CC4400', unlockLevel: 3,  icon: 'F' },
    shield:    { name: 'Shield',     color: '#00CCCC', darkColor: '#009999', unlockLevel: 5,  icon: 'S' },
    slowClock: { name: 'Slow',       color: '#6699FF', darkColor: '#4477CC', unlockLevel: 7,  icon: 'C' },
    blizzard:  { name: 'Blizzard',   color: '#CCDDFF', darkColor: '#99AACC', unlockLevel: 9,  icon: 'B' },
    lavaMoat:  { name: 'Lava',       color: '#FF3300', darkColor: '#CC2200', unlockLevel: 12, icon: 'L' },
    dragon:    { name: 'Dragon',     color: '#FFD700', darkColor: '#CCA800', unlockLevel: 15, icon: 'D' },
};

const POWER_KEYS = ['fireball', 'shield', 'slowClock', 'blizzard', 'lavaMoat', 'dragon'];

const Powers = {
    // Pickup state
    pickup: null,         // { x, y, letter, powerType, timer, maxTimer }
    pickupCooldown: 0,    // brief cooldown after pickup collected/expired

    // Inventory: array of power type strings, max 3
    inventory: [],
    selectedIndex: 0,
    maxSlots: 3,

    // Per-wave usage flag
    usedThisWave: false,

    // Active effects
    shieldActive: false,
    shieldTimer: 0,

    slowActive: false,
    slowTimer: 0,

    freezeActive: false,
    freezeTimer: 0,

    lavaMoatActive: false,
    lavaMoatTimer: 0,

    dragonActive: false,
    dragonTimer: 0,
    dragonPhase: 0,    // 0-1 progress across screen
    dragonZone: [0, 0.33],

    // Animation particles for effects
    effectParticles: [],

    // Fireball animation
    fireballActive: false,
    fireballTimer: 0,
    fireballFrom: { x: 0, y: 0 },
    fireballTo: { x: 0, y: 0 },
    fireballTarget: null,

    // Shield visual position (calculated from path end)
    shieldX: 0,
    shieldY: 0,

    // Inventory UI layout (set during render)
    slotRects: [],
    useButtonRect: null,
    rotateButtonRect: null,

    init() {
        this.pickup = null;
        this.pickupCooldown = 0;
        this.inventory = [];
        this.selectedIndex = 0;
        this.usedThisWave = false;
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.slowActive = false;
        this.slowTimer = 0;
        this.freezeActive = false;
        this.freezeTimer = 0;
        this.lavaMoatActive = false;
        this.lavaMoatTimer = 0;
        this.dragonActive = false;
        this.dragonTimer = 0;
        this.dragonPhase = 0;
        this.dragonZone = [0, 0.33];
        this.effectParticles = [];
        this.fireballActive = false;
        this.fireballTimer = 0;
        this.slotRects = [];
        this.useButtonRect = null;
        this.rotateButtonRect = null;
    },

    // Called when a new wave starts — reset per-wave usage
    onWaveStart() {
        this.usedThisWave = false;
    },

    // Get highest unlocked level from save data
    getHighestUnlockedLevel() {
        let highest = 1;
        for (let i = 0; i < LEVELS.length; i++) {
            if (Progression.getLevelStars(i) >= 1) {
                highest = Math.max(highest, i + 1);
            }
        }
        // Also count current level being played
        highest = Math.max(highest, Progression.currentLevel + 1);
        return highest;
    },

    isUnlocked(powerType) {
        const def = POWER_TYPES[powerType];
        if (!def) return false;
        return this.getHighestUnlockedLevel() >= def.unlockLevel;
    },

    getUnlockedPowers() {
        const result = [];
        for (let i = 0; i < POWER_KEYS.length; i++) {
            if (this.isUnlocked(POWER_KEYS[i])) {
                result.push(POWER_KEYS[i]);
            }
        }
        return result;
    },

    // Try to spawn a pickup where an enemy died
    // Returns true if pickup spawned
    trySpawnPickup(x, y) {
        // Only on level 3+
        if (Progression.currentLevel + 1 < 3) return false;
        // Max 1 pickup at a time
        if (this.pickup) return false;
        // Brief cooldown after last pickup
        if (this.pickupCooldown > 0) return false;

        const unlocked = this.getUnlockedPowers();
        if (unlocked.length === 0) return false;

        // 15-20% chance
        if (Math.random() > 0.18) return false;

        // Pick random power type from unlocked
        const powerType = unlocked[Math.floor(Math.random() * unlocked.length)];

        // Pick random letter from current level's pool
        const levelDef = Progression.getLevelDef();
        const letters = levelDef.letters;
        const letter = letters[Math.floor(Math.random() * letters.length)];

        this.pickup = {
            x: x,
            y: y,
            letter: letter,
            powerType: powerType,
            timer: 5.0,
            maxTimer: 5.0,
            bobOffset: Math.random() * Math.PI * 2,
        };
        return true;
    },

    // Try to collect pickup by typing a letter. Returns true if collected.
    tryCollectPickup(letter) {
        if (!this.pickup) return false;
        if (this.pickup.letter !== letter.toUpperCase()) return false;

        // Collect it!
        const powerType = this.pickup.powerType;

        // Add to inventory (replace oldest if full)
        if (this.inventory.length >= this.maxSlots) {
            this.inventory.shift();
            if (this.selectedIndex >= this.inventory.length) {
                this.selectedIndex = Math.max(0, this.inventory.length - 1);
            }
        }
        this.inventory.push(powerType);

        // Spawn collect particles
        const def = POWER_TYPES[powerType];
        Particles.spawn(this.pickup.x, this.pickup.y, def.color, 10);
        FloatingTexts.spawn(this.pickup.x, this.pickup.y - 30, def.name + '!', def.color, 14);

        this.pickup = null;
        this.pickupCooldown = 1.0;
        return true;
    },

    // Cycle selected power
    rotateSelection() {
        if (this.inventory.length <= 1) return;
        this.selectedIndex = (this.selectedIndex + 1) % this.inventory.length;
    },

    // Activate the selected power
    activatePower() {
        if (this.usedThisWave) return false;
        if (this.inventory.length === 0) return false;
        if (this.selectedIndex >= this.inventory.length) return false;

        const powerType = this.inventory[this.selectedIndex];
        this.inventory.splice(this.selectedIndex, 1);
        if (this.selectedIndex >= this.inventory.length) {
            this.selectedIndex = Math.max(0, this.inventory.length - 1);
        }
        this.usedThisWave = true;

        this._activate(powerType);
        return true;
    },

    _activate(powerType) {
        switch (powerType) {
            case 'fireball':
                this._activateFireball();
                break;
            case 'shield':
                this._activateShield();
                break;
            case 'slowClock':
                this._activateSlowClock();
                break;
            case 'blizzard':
                this._activateBlizzard();
                break;
            case 'lavaMoat':
                this._activateLavaMoat();
                break;
            case 'dragon':
                this._activateDragon();
                break;
        }
    },

    _activateFireball() {
        // Find enemy closest to castle (highest pathProgress)
        let target = null;
        let maxProg = -1;
        for (let i = 0; i < Enemies.list.length; i++) {
            const e = Enemies.list[i];
            if (e.alive && e.pathProgress > maxProg) {
                maxProg = e.pathProgress;
                target = e;
            }
        }
        if (!target) {
            // No enemies — refund (don't waste)
            this.usedThisWave = false;
            return;
        }

        // Start fireball animation
        const gameH = Game.height * CONFIG.GAME_AREA_RATIO;
        this.fireballActive = true;
        this.fireballTimer = 0;
        this.fireballFrom = { x: Game.width / 2, y: gameH };
        this.fireballTo = { x: target.x, y: target.y };
        this.fireballTarget = target;
    },

    _activateShield() {
        this.shieldActive = true;
        this.shieldTimer = 10.0;
        // Position at end of path
        const pos = Path.getPositionAt(0.98);
        this.shieldX = pos.x;
        this.shieldY = pos.y;
        FloatingTexts.spawn(pos.x, pos.y - 40, 'SHIELD!', '#00CCCC', 16);
    },

    _activateSlowClock() {
        this.slowActive = true;
        this.slowTimer = 5.0;
        FloatingTexts.spawn(Game.width / 2, Game.height * CONFIG.GAME_AREA_RATIO * 0.4,
            'SLOW!', '#6699FF', 20);
    },

    _activateBlizzard() {
        this.freezeActive = true;
        this.freezeTimer = 4.0;
        FloatingTexts.spawn(Game.width / 2, Game.height * CONFIG.GAME_AREA_RATIO * 0.4,
            'FREEZE!', '#CCDDFF', 20);
        // Spawn initial ice particles
        for (let i = 0; i < 20; i++) {
            this.effectParticles.push({
                x: Math.random() * Game.width,
                y: -Math.random() * 50,
                vy: randFloat(60, 150),
                vx: randFloat(-20, 20),
                size: randFloat(3, 8),
                life: randFloat(1.5, 4.0),
                maxLife: 4.0,
                color: Math.random() > 0.5 ? '#CCDDFF' : '#FFFFFF',
                type: 'ice',
            });
        }
    },

    _activateLavaMoat() {
        this.lavaMoatActive = true;
        this.lavaMoatTimer = 3.0;
        FloatingTexts.spawn(Game.width / 2, Game.height * CONFIG.GAME_AREA_RATIO * 0.5,
            'LAVA!', '#FF3300', 20);
    },

    _activateDragon() {
        this.dragonActive = true;
        this.dragonTimer = 2.0;
        this.dragonPhase = 0;
        // Pick random 1/3 section
        const sections = [[0, 0.33], [0.33, 0.66], [0.66, 1.0]];
        this.dragonZone = sections[Math.floor(Math.random() * sections.length)];
        FloatingTexts.spawn(Game.width / 2, Game.height * CONFIG.GAME_AREA_RATIO * 0.3,
            'DRAGON!', '#FFD700', 22);
    },

    // Check if shield blocks an enemy reaching base. Returns true if blocked.
    checkShield() {
        if (!this.shieldActive) return false;
        this.shieldActive = false;
        this.shieldTimer = 0;
        // Cyan explosion
        Particles.spawn(this.shieldX, this.shieldY, '#00CCCC', 12);
        FloatingTexts.spawn(this.shieldX, this.shieldY - 30, 'BLOCKED!', '#00FFFF', 16);
        return true;
    },

    // Get speed multiplier for enemies (1.0 = normal)
    getSpeedMultiplier() {
        if (this.freezeActive) return 0;
        if (this.slowActive) return 0.5;
        return 1.0;
    },

    // Check if lava moat kills an enemy at given pathProgress
    checkLavaMoat(pathProgress) {
        if (!this.lavaMoatActive) return false;
        return pathProgress >= 0.85 && pathProgress <= 0.95;
    },

    update(dt) {
        // Update pickup
        if (this.pickup) {
            this.pickup.timer -= dt;
            if (this.pickup.timer <= 0) {
                this.pickup = null;
            }
        }

        // Pickup cooldown
        if (this.pickupCooldown > 0) {
            this.pickupCooldown -= dt;
        }

        // Fireball animation
        if (this.fireballActive) {
            this.fireballTimer += dt;
            const duration = 0.5;
            if (this.fireballTimer >= duration) {
                this.fireballActive = false;
                // Destroy target
                if (this.fireballTarget && this.fireballTarget.alive) {
                    this.fireballTarget.alive = false;
                    Particles.spawn(this.fireballTarget.x, this.fireballTarget.y, '#FF6600', 14);
                    Particles.spawn(this.fireballTarget.x, this.fireballTarget.y, '#FFCC00', 8);
                    FloatingTexts.spawn(this.fireballTarget.x, this.fireballTarget.y - 20,
                        'BOOM!', '#FF6600', 18);
                    // Remove from enemy list
                    const idx = Enemies.list.indexOf(this.fireballTarget);
                    if (idx !== -1) {
                        Enemies.list.splice(idx, 1);
                        Enemies.listChanged = true;
                    }
                }
                this.fireballTarget = null;
            } else {
                // Spawn trail particles
                const t = this.fireballTimer / duration;
                const arcHeight = -120 * Math.sin(t * Math.PI);
                const fx = lerp(this.fireballFrom.x, this.fireballTo.x, t);
                const fy = lerp(this.fireballFrom.y, this.fireballTo.y, t) + arcHeight;
                this.effectParticles.push({
                    x: fx + randFloat(-5, 5),
                    y: fy + randFloat(-5, 5),
                    vx: randFloat(-30, 30),
                    vy: randFloat(10, 40),
                    size: randFloat(3, 7),
                    life: 0.3,
                    maxLife: 0.3,
                    color: Math.random() > 0.5 ? '#FF6600' : '#FFCC00',
                    type: 'fire',
                });
            }
        }

        // Shield timer
        if (this.shieldActive) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) {
                this.shieldActive = false;
            }
        }

        // Slow clock timer
        if (this.slowActive) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) {
                this.slowActive = false;
            }
        }

        // Freeze timer
        if (this.freezeActive) {
            this.freezeTimer -= dt;
            if (this.freezeTimer <= 0) {
                this.freezeActive = false;
                // Crack-free particles on all enemies
                for (let i = 0; i < Enemies.list.length; i++) {
                    const e = Enemies.list[i];
                    if (e.alive) {
                        Particles.spawn(e.x, e.y, '#CCDDFF', 4);
                    }
                }
            }
            // Spawn falling ice particles while active
            if (this.freezeActive && Math.random() > 0.7) {
                this.effectParticles.push({
                    x: Math.random() * Game.width,
                    y: -5,
                    vy: randFloat(60, 120),
                    vx: randFloat(-15, 15),
                    size: randFloat(2, 6),
                    life: randFloat(1.0, 3.0),
                    maxLife: 3.0,
                    color: Math.random() > 0.5 ? '#CCDDFF' : '#FFFFFF',
                    type: 'ice',
                });
            }
        }

        // Lava moat timer + kill enemies in zone
        if (this.lavaMoatActive) {
            this.lavaMoatTimer -= dt;
            if (this.lavaMoatTimer <= 0) {
                this.lavaMoatActive = false;
            } else {
                // Check enemies in lava zone
                for (let i = Enemies.list.length - 1; i >= 0; i--) {
                    const e = Enemies.list[i];
                    if (e.alive && e.pathProgress >= 0.85 && e.pathProgress <= 0.95) {
                        e.alive = false;
                        Particles.spawn(e.x, e.y, '#FF3300', 8);
                        Particles.spawn(e.x, e.y, '#FF6600', 6);
                        FloatingTexts.spawn(e.x, e.y - 20, 'MELTED!', '#FF3300', 12);
                        Enemies.list.splice(i, 1);
                        Enemies.listChanged = true;
                    }
                }
                // Lava bubble particles
                if (Math.random() > 0.5) {
                    const lavaProgress = randFloat(0.85, 0.95);
                    const pos = Path.getPositionAt(lavaProgress);
                    this.effectParticles.push({
                        x: pos.x + randFloat(-15, 15),
                        y: pos.y + randFloat(-5, 5),
                        vx: randFloat(-10, 10),
                        vy: randFloat(-40, -80),
                        size: randFloat(3, 6),
                        life: 0.5,
                        maxLife: 0.5,
                        color: Math.random() > 0.5 ? '#FF3300' : '#FF6600',
                        type: 'lava',
                    });
                }
            }
        }

        // Dragon sweep
        if (this.dragonActive) {
            this.dragonTimer -= dt;
            this.dragonPhase = 1.0 - (this.dragonTimer / 2.0);
            if (this.dragonTimer <= 0) {
                this.dragonActive = false;
            }
            // Destroy enemies in the zone during sweep
            if (this.dragonPhase >= 0.2 && this.dragonPhase <= 0.9) {
                for (let i = Enemies.list.length - 1; i >= 0; i--) {
                    const e = Enemies.list[i];
                    if (e.alive && e.pathProgress >= this.dragonZone[0] && e.pathProgress <= this.dragonZone[1]) {
                        e.alive = false;
                        Particles.spawn(e.x, e.y, '#FF6600', 8);
                        Particles.spawn(e.x, e.y, '#FFD700', 6);
                        Enemies.list.splice(i, 1);
                        Enemies.listChanged = true;
                    }
                }
            }
            // Fire breath particles
            if (Math.random() > 0.3) {
                const breathProgress = lerp(this.dragonZone[0], this.dragonZone[1], Math.random());
                const pos = Path.getPositionAt(breathProgress);
                this.effectParticles.push({
                    x: pos.x + randFloat(-20, 20),
                    y: pos.y + randFloat(-30, 10),
                    vx: randFloat(-20, 20),
                    vy: randFloat(-60, -20),
                    size: randFloat(4, 9),
                    life: 0.4,
                    maxLife: 0.4,
                    color: Math.random() > 0.4 ? '#FF6600' : '#FFD700',
                    type: 'dragonFire',
                });
            }
        }

        // Update effect particles
        for (let i = this.effectParticles.length - 1; i >= 0; i--) {
            const p = this.effectParticles[i];
            p.x += (p.vx || 0) * dt;
            p.y += (p.vy || 0) * dt;
            p.life -= dt;
            if (p.life <= 0) {
                this.effectParticles.splice(i, 1);
            }
        }
    },

    render(ctx) {
        const time = Game.time;

        // Render lava moat zone
        if (this.lavaMoatActive) {
            this._renderLavaMoat(ctx, time);
        }

        // Render shield barrier
        if (this.shieldActive) {
            this._renderShield(ctx, time);
        }

        // Render slow/freeze overlays on enemies
        if (this.slowActive || this.freezeActive) {
            this._renderEnemyOverlays(ctx, time);
        }

        // Render pickup
        if (this.pickup) {
            this._renderPickup(ctx, time);
        }

        // Render fireball
        if (this.fireballActive) {
            this._renderFireball(ctx, time);
        }

        // Render dragon
        if (this.dragonActive) {
            this._renderDragon(ctx, time);
        }

        // Render effect particles
        for (let i = 0; i < this.effectParticles.length; i++) {
            const p = this.effectParticles[i];
            const alpha = clamp(p.life / p.maxLife, 0, 1);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    },

    _renderPickup(ctx, time) {
        const p = this.pickup;
        const def = POWER_TYPES[p.powerType];
        const ts = Grid.tileSize;
        const size = ts * 0.5;

        // Blink during last 1.5s
        if (p.timer < 1.5) {
            const blink = Math.sin(time * 12) > 0;
            if (!blink) return;
        }

        // Bob animation
        const bob = Math.sin(time * 4 + p.bobOffset) * 5;
        const px = p.x - size / 2;
        const py = p.y - size + bob;

        // Glow ring (expanding/contracting)
        const glowSize = size * (1.2 + Math.sin(time * 5) * 0.2);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = def.color;
        ctx.fillRect(p.x - glowSize / 2, p.y - glowSize / 2 + bob - size / 2, glowSize, glowSize);
        ctx.globalAlpha = 1;

        // Colored block
        ctx.fillStyle = def.color;
        ctx.fillRect(px, py, size, size);

        // Dark border
        ctx.fillStyle = def.darkColor;
        ctx.fillRect(px, py, size, 2);
        ctx.fillRect(px, py, 2, size);
        ctx.fillRect(px + size - 2, py, 2, size);
        ctx.fillRect(px, py + size - 2, size, 2);

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(px + 2, py + 2, size - 4, size * 0.3);

        // Letter on pickup
        const letterSize = Math.max(8, size * 0.6);
        drawText(ctx, p.letter, p.x, py + size * 0.5, letterSize, '#FFFFFF', 'center', 1);

        // Power icon label above
        const iconSize = Math.max(6, size * 0.3);
        drawText(ctx, def.name, p.x, py - iconSize * 0.5, iconSize, def.color, 'center', 1);
    },

    _renderFireball(ctx, time) {
        const duration = 0.5;
        const t = this.fireballTimer / duration;
        const arcHeight = -120 * Math.sin(t * Math.PI);
        const fx = lerp(this.fireballFrom.x, this.fireballTo.x, t);
        const fy = lerp(this.fireballFrom.y, this.fireballTo.y, t) + arcHeight;

        // Fireball body (blocky)
        const size = 14;
        ctx.fillStyle = '#FFCC00';
        ctx.fillRect(fx - size / 2, fy - size / 2, size, size);
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(fx - size / 2 - 2, fy - size / 2 - 2, size + 4, size + 4);
        ctx.fillStyle = '#FFCC00';
        ctx.fillRect(fx - size / 2, fy - size / 2, size, size);
    },

    _renderShield(ctx, time) {
        const ts = Grid.tileSize;
        const w = ts * 2;
        const h = ts * 2.5;
        const x = this.shieldX - w / 2;
        const y = this.shieldY - h;

        // Shimmer effect
        const shimmer = Math.sin(time * 6) * 0.15 + 0.35;
        ctx.globalAlpha = shimmer;
        ctx.fillStyle = '#00CCCC';
        ctx.fillRect(x, y, w, h);

        // Border
        ctx.globalAlpha = shimmer + 0.2;
        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(x, y, w, 3);
        ctx.fillRect(x, y, 3, h);
        ctx.fillRect(x + w - 3, y, 3, h);
        ctx.fillRect(x, y + h - 3, w, 3);

        // Inner glow blocks
        ctx.fillStyle = '#AAFFFF';
        for (let i = 0; i < 4; i++) {
            const bx = x + (i + 0.5) * (w / 4) - 3;
            const by = y + h * 0.3 + Math.sin(time * 4 + i) * 5;
            ctx.fillRect(bx, by, 6, 6);
        }
        ctx.globalAlpha = 1;
    },

    _renderLavaMoat(ctx, time) {
        // Render lava tiles at path zone 85-95%
        const steps = 12;
        for (let i = 0; i <= steps; i++) {
            const prog = 0.85 + (0.1 * i / steps);
            const pos = Path.getPositionAt(prog);
            const ts = Grid.tileSize;
            const lx = pos.x - ts * 0.6;
            const ly = pos.y - ts * 0.3;

            // Lava base
            const flicker = Math.sin(time * 8 + i * 2) * 0.1;
            ctx.globalAlpha = 0.7 + flicker;
            ctx.fillStyle = '#FF3300';
            ctx.fillRect(lx, ly, ts * 1.2, ts * 0.8);

            // Orange highlights
            ctx.fillStyle = '#FF6600';
            ctx.fillRect(lx + Math.sin(time * 5 + i) * 5, ly + 2, ts * 0.4, ts * 0.3);

            // Yellow hot spots
            ctx.fillStyle = '#FFCC00';
            const hx = lx + ts * 0.3 + Math.sin(time * 7 + i * 3) * 8;
            const hy = ly + ts * 0.2 + Math.cos(time * 6 + i) * 3;
            ctx.fillRect(hx, hy, 6, 6);
        }
        ctx.globalAlpha = 1;
    },

    _renderDragon(ctx, time) {
        const gameW = Game.width;
        const gameH = Game.height * CONFIG.GAME_AREA_RATIO;

        // Dragon position — flies across screen
        const dx = lerp(-80, gameW + 80, this.dragonPhase);
        const dy = gameH * 0.15 + Math.sin(time * 4) * 15;

        // Blocky dragon body
        const bodyW = 60;
        const bodyH = 25;

        // Body (dark green)
        ctx.fillStyle = '#336633';
        ctx.fillRect(dx - bodyW / 2, dy - bodyH / 2, bodyW, bodyH);

        // Head (triangle-ish: just a rectangle extending forward)
        ctx.fillStyle = '#447744';
        ctx.fillRect(dx + bodyW / 2, dy - bodyH * 0.3, 20, bodyH * 0.6);
        // Eye
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(dx + bodyW / 2 + 12, dy - 4, 5, 5);

        // Wings (rectangles)
        const wingFlap = Math.sin(time * 12) * 10;
        ctx.fillStyle = '#225522';
        ctx.fillRect(dx - bodyW * 0.3, dy - bodyH / 2 - 15 + wingFlap, bodyW * 0.5, 12);
        ctx.fillRect(dx - bodyW * 0.3, dy + bodyH / 2 + 3 - wingFlap, bodyW * 0.5, 12);

        // Tail
        ctx.fillStyle = '#336633';
        ctx.fillRect(dx - bodyW / 2 - 25, dy - 5, 25, 10);
        ctx.fillRect(dx - bodyW / 2 - 40, dy - 3, 15, 6);

        // Fire breath (when in sweep phase)
        if (this.dragonPhase >= 0.15 && this.dragonPhase <= 0.85) {
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 5; i++) {
                const fx = dx + bodyW / 2 + 20 + i * 4;
                const fy = dy + bodyH * 0.3 + i * 8;
                const fs = 8 + i * 3;
                ctx.fillStyle = i < 2 ? '#FFCC00' : '#FF6600';
                ctx.fillRect(fx + randFloat(-3, 3), fy + randFloat(-3, 3), fs, fs);
            }
            ctx.globalAlpha = 1;
        }
    },

    _renderEnemyOverlays(ctx, time) {
        const ts = Grid.tileSize;
        for (let i = 0; i < Enemies.list.length; i++) {
            const e = Enemies.list[i];
            if (!e.alive) continue;
            const baseSize = ts * e.sizeMultiplier;
            const bob = Math.sin(time * 6 + e.bobOffset) * 3;
            const ex = e.x - baseSize / 2;
            const ey = e.y - baseSize + bob;

            if (this.freezeActive) {
                // Ice overlay
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#CCDDFF';
                ctx.fillRect(ex - 2, ey - 2, baseSize + 4, baseSize + 4);
                // Small ice blocks
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(ex + baseSize * 0.1, ey + baseSize * 0.1, 4, 4);
                ctx.fillRect(ex + baseSize * 0.7, ey + baseSize * 0.3, 3, 3);
                ctx.fillRect(ex + baseSize * 0.4, ey + baseSize * 0.8, 5, 5);
            } else if (this.slowActive) {
                // Blue tint
                ctx.globalAlpha = 0.25;
                ctx.fillStyle = '#6699FF';
                ctx.fillRect(ex - 1, ey - 1, baseSize + 2, baseSize + 2);
            }
        }
        ctx.globalAlpha = 1;
    },

    // Render power inventory UI
    renderInventory(ctx) {
        const kbStartY = Keyboard.startY;
        const slotSize = Math.max(24, Game.width * 0.035);
        const gap = slotSize * 0.3;
        const startX = 10;
        const startY = kbStartY - slotSize - 8;

        this.slotRects = [];

        // Render 3 slots
        for (let i = 0; i < this.maxSlots; i++) {
            const sx = startX + i * (slotSize + gap);
            const sy = startY;
            this.slotRects.push({ x: sx, y: sy, w: slotSize, h: slotSize });

            const hasPower = i < this.inventory.length;
            const isSelected = i === this.selectedIndex && hasPower;
            const grayed = this.usedThisWave;

            // Slot background
            if (hasPower) {
                const def = POWER_TYPES[this.inventory[i]];
                ctx.fillStyle = grayed ? '#555555' : def.color;
                ctx.globalAlpha = grayed ? 0.5 : 1;
                ctx.fillRect(sx, sy, slotSize, slotSize);

                // Highlight/border
                if (isSelected && !grayed) {
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(sx - 2, sy - 2, slotSize + 4, slotSize + 4);
                }

                // Power label
                const labelSize = Math.max(6, slotSize * 0.25);
                ctx.globalAlpha = grayed ? 0.5 : 1;
                drawText(ctx, def.name, sx + slotSize / 2, sy + slotSize / 2,
                    labelSize, '#FFFFFF', 'center', 1);
                ctx.globalAlpha = 1;
            } else {
                // Empty slot
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 2;
                ctx.strokeRect(sx, sy, slotSize, slotSize);
            }
        }

        // USE button
        const btnW = slotSize * 1.2;
        const btnH = slotSize * 0.8;
        const useX = startX + this.maxSlots * (slotSize + gap) + gap;
        const useY = startY + (slotSize - btnH) / 2;
        this.useButtonRect = { x: useX, y: useY, w: btnW, h: btnH };

        const canUse = this.inventory.length > 0 && !this.usedThisWave;
        const radius = Math.max(2, btnW * 0.08);

        // USE button background
        ctx.fillStyle = canUse ? '#5B8C2A' : '#444444';
        Keyboard.drawRoundedRect(ctx, useX, useY, btnW, btnH, radius);
        ctx.strokeStyle = canUse ? '#7EC850' : '#333333';
        ctx.lineWidth = 2;
        Keyboard.strokeRoundedRect(ctx, useX, useY, btnW, btnH, radius);

        const useFontSize = Math.max(7, btnH * 0.35);
        drawText(ctx, 'USE', useX + btnW / 2, useY + btnH / 2,
            useFontSize, canUse ? '#FFFFFF' : '#888888', 'center', 1);

        // ROTATE button (small, next to USE)
        const rotW = slotSize * 0.7;
        const rotH = btnH;
        const rotX = useX + btnW + gap;
        const rotY = useY;
        this.rotateButtonRect = { x: rotX, y: rotY, w: rotW, h: rotH };

        ctx.fillStyle = this.inventory.length > 1 ? '#555555' : '#333333';
        Keyboard.drawRoundedRect(ctx, rotX, rotY, rotW, rotH, radius);
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        Keyboard.strokeRoundedRect(ctx, rotX, rotY, rotW, rotH, radius);

        const rotFontSize = Math.max(6, rotH * 0.35);
        drawText(ctx, '<>', rotX + rotW / 2, rotY + rotH / 2,
            rotFontSize, this.inventory.length > 1 ? '#FFFFFF' : '#666666', 'center', 1);

        // Slow clock timer bar
        if (this.slowActive) {
            this._renderTimerBar(ctx, 'SLOW', this.slowTimer, 5.0, '#6699FF');
        }
        // Freeze timer bar
        if (this.freezeActive) {
            this._renderTimerBar(ctx, 'FREEZE', this.freezeTimer, 4.0, '#CCDDFF');
        }
    },

    _renderTimerBar(ctx, label, timer, maxTimer, color) {
        const barW = Game.width * 0.25;
        const barH = 12;
        const barX = Game.width / 2 - barW / 2;
        const barY = Game.height * CONFIG.GAME_AREA_RATIO - barH - 5;
        const progress = clamp(timer / maxTimer, 0, 1);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = color;
        ctx.fillRect(barX, barY, barW * progress, barH);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        const fontSize = Math.max(6, barH * 0.7);
        drawText(ctx, label, barX + barW / 2, barY + barH / 2, fontSize, '#FFFFFF', 'center', 1);
    },

    // Check if touch hit a power button
    handleTouch(x, y) {
        if (this.useButtonRect && pointInRect(x, y,
            this.useButtonRect.x, this.useButtonRect.y,
            this.useButtonRect.w, this.useButtonRect.h)) {
            return 'USE';
        }
        if (this.rotateButtonRect && pointInRect(x, y,
            this.rotateButtonRect.x, this.rotateButtonRect.y,
            this.rotateButtonRect.w, this.rotateButtonRect.h)) {
            return 'ROTATE';
        }
        return null;
    },
};

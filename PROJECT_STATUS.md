# Letter Defenders — Project Status (March 2026)

## What Is This
A Minecraft-style tower defense web game teaching a 5-year-old to recognize letters and keyboard positions. Pure HTML/JS/CSS, no frameworks, no build tools. Open index.html to play.

## Repo & Hosting
- **Repo**: https://github.com/sancez111/Games-Tower_defense (public)
- **Live game**: https://sancez111.github.io/Games-Tower_defense/
- **GitHub Pages**: deployed via GitHub Actions (static.yml), auto-deploys on push to main
- **GitHub token name**: Tower_defense_token (key stored separately, not in memory)

## Workflow
- **This Claude Project**: planning, decisions, reviewing code, writing CC prompts
- **Claude Code (CC)**: builds and pushes code, always in a fresh chat per task
- **User**: makes big decisions only, limited technical knowledge — keep language simple
- **Always sync** on build status, progress, roadmap, and planned features at start of each chat

## Codebase (4,941 lines across 11 JS files)

```
/
├── index.html              — Entry point, loads all JS + Google Font
├── css/style.css           — Fullscreen canvas, pixel rendering
├── js/
│   ├── utils.js (533)      — Colors, config, WORLD_THEMES, ENEMY_TYPES, PATH_LAYOUTS, helpers, ScreenShake, Particles, FloatingTexts, drawHeart, drawStar, drawButton
│   ├── grid.js (159)       — 20x12 tile grid with off-screen cache, uses currentWorldTheme for colors
│   ├── path.js (201)       — Accepts per-level waypoints, renders themed cave + castle
│   ├── enemies.js (380)    — 4 enemy types (walker/sprinter/tank/swarm), spawn, hit detection, rendering
│   ├── keyboard.js (232)   — On-screen QWERTY keyboard + SHIFT key, touch support, highlight states
│   ├── powers.js (908)     — 6 super powers, pickup drops, inventory, activation effects, animations
│   ├── progression.js (508) — 16 level definitions, 4 worlds, scoring, hearts, combos, timer, localStorage
│   ├── engine.js (1430)    — Game loop, state machine, input handling, menu, world map, win/lose/pause screens
│   └── modes/
│       ├── letterMarch.js (570) — Full Letter March mode: waves, HUD, decorations, world effects
│       ├── keyboardDefense.js (10) — Placeholder
│       └── towerStrike.js (10)    — Placeholder
├── assets/ (sprites/, sounds/, fonts/) — All empty, using code-drawn graphics
├── ROADMAP.md, PHASE1.md, PHASE2.md, PHASE2B.md, PHASE2C.md, PHASE2D.md
└── .github/workflows/static.yml — GitHub Pages deployment
```

## Completed Phases

### Phase 1: Foundation ✅
Game engine, 60fps canvas loop, state machine, grid/tile system, path system, basic enemies, on-screen keyboard, start menu.

### Phase 2: Letter March Mode ✅
Full game mode with waves, health (5 hearts), scoring, combos, win/lose screens, star ratings (3=no damage, 2=≤2 lost, 1=completed), level select, localStorage save.

### Phase 2a: Stopwatch + Best Times ✅
Level timer (pauses between waves/when paused), best time tracking per level, "NEW BEST!" celebration, times on level select and win/game over screens.

### Phase 2b: Enemy Variety + Level Layouts ✅
4 enemy types, 5 path layouts, expanded to 14 levels (later 16). Enemy details:
- **Walker**: Green, normal speed (1.0x), 1 hit
- **Sprinter**: Blue, 3.0x speed, smaller, speed trail effect, 1 hit
- **Tank**: Red, 0.6x speed, bigger, horns — TWO-PHASE: first type lowercase letter → cracks + shows "SHIFT" indicator, then type Shift+letter → destroyed
- **Swarm**: Purple, 1.8x speed, tiny, cluster of 3-4 with DIFFERENT letters from level pool, each unit pops individually

### Phase 2c: Super Powers ✅
6 collectible power-ups dropping from destroyed enemies (~18% chance, Level 3+):
- **Fireball** (Lvl 3): Destroys enemy closest to castle
- **Shield** (Lvl 5): Blocks next enemy reaching base
- **Slow Clock** (Lvl 7): Half speed 5 seconds
- **Blizzard** (Lvl 9): Freeze all 4 seconds
- **Dragon** (Lvl 12): Sweeps 1/3 of path with fire
- **Lava Moat** (Lvl 15): Lava pool at 85-95% path for 3 seconds

Pickups: glowing colored blocks with a letter — type letter to collect. Max 3 in inventory. Spacebar = activate, Right/Down Arrow = rotate. No per-wave usage limit. On-screen USE + ROTATE buttons for touch. On-screen SHIFT key for tank mechanic on tablets.

### Phase 2d: World System ✅
4 themed worlds, 16 levels (4 per world), Mario-style scrollable world map:
- **Greenwood** (Forest, Lvl 1-4): Green, trees, river, birds, clouds. Letters: F,J,D,K
- **Sandstone** (Desert, Lvl 5-8): Sandy, pyramids, cacti, sun, oasis. Letters: S,L,A + home row
- **Frostpeak** (Snow, Lvl 9-12): White/blue, mountains, snowflakes, aurora, frozen lake. Letters: R,U,E,I
- **Netherforge** (Lava, Lvl 13-16): Dark red, volcano, lava pools, fire, stalactites. Letters: W,O,Q,P + full mix

World map has rich biome backgrounds, animated effects, smooth zone transitions, scroll with arrows/drag.

## Current Controls
- **Letter keys**: Type to destroy matching enemies
- **Shift + letter**: Destroy damaged tanks (second hit)
- **Spacebar**: Activate selected power
- **Right/Down Arrow**: Rotate power selection (also scrolls world map when on that screen)
- **Left/Up Arrow**: Scroll world map left
- **ESC**: Pause
- **Touch**: On-screen keyboard + SHIFT key + USE/ROTATE buttons

## Key Technical Decisions Made
- Grid uses off-screen canvas cache (rebuilds only on resize or level change)
- Sky gradient cached per resize
- Keyboard highlights only update when enemy list changes (dirty flag)
- Font loading: waits for "Press Start 2P" before init
- `currentWorldTheme` global set when level starts, read by Grid, Path, etc.
- Enemy speed = wave base speed × type's speedMultiplier
- Swarm units get unique letters via shuffled level pool
- Tank uses explicit `shiftDown` state tracking (not e.shiftKey) + blur reset to prevent stuck Shift
- Window blur resets all held keys
- Powers check pickups BEFORE enemies in processInput
- localStorage saves: `{ level_1: { stars: 3, bestTime: 83.45 } }` — backwards compatible with old `{ level_1: 3 }` format

## Known Issues / Notes
- Level 14 3-star is very hard (short path, full mix) — by design
- Arrow keys are dual-purpose: scroll world map on level select, rotate powers during gameplay
- Dragon power won't appear until player reaches Level 12+
- Lava Moat won't appear until Level 15+
- `keyboardDefense.js` and `towerStrike.js` are still empty placeholders

## Roadmap — What's Next

### Phase 3: Keyboard Defense Mode ← NEXT
Second game mode. Keyboard IS the battlefield. Letters attack by glowing on keys, player clicks/taps the correct key. Finger guide overlay, same wave/progression system, keyboard zones unlock progressively.

### Phase 3.5: Gemini Graphics
Replace all colored-block placeholder graphics with proper Minecraft-style pixel art sprites generated via Gemini AI. Will need a Gemini prompt crafted in this project.

### Phase 4: Tower Strike Mode
Third game mode with strategic tower placement on the grid.

### Phase 5: Progression & Polish
World map biome themes, letter mastery tracking, adaptive difficulty, unlockable content.

### Phase 6: Sound & Final Touches
Sound effects, letter pronunciation audio, background music, settings menu, mobile polish.

## CC Prompt Template
When creating prompts for Claude Code:
1. Always say "sole builder, push to main, don't ask technical questions"
2. Reference the repo URL and which planning docs to read
3. List what's already built (completed phases)
4. Give clear task breakdown with implementation details
5. Specify visual style (Minecraft blocky, no curves, "Press Start 2P" font)
6. Require clear commit messages, update docs when done
7. Remind: game runs by opening index.html, no server/build needed

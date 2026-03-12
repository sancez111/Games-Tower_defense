# Phase 2b: Enemy Variety + Level Layouts — Detailed Build Plan

## Overview
Add 4 enemy types with distinct behaviors and visuals, make path layouts configurable per level, and expand from 5 to 14 levels covering home row through full keyboard.

## Task Breakdown

### Task 2b.1: Refactor Path System for Per-Level Layouts
Currently the path is hardcoded in path.js. Change it so each level definition can specify its own waypoints.

- Add a `path` property to each level in LEVELS array (an array of [col, row] waypoints)
- Modify `Path.init()` to accept waypoints as a parameter: `Path.init(waypoints)`
- `LetterMarch.init()` passes the level's path to `Path.init()`
- If a level doesn't specify a path, fall back to the current default path
- Re-cache the grid when the path changes (Grid.cacheDirty = true)
- The cave always renders at the first waypoint, castle at the last

### Task 2b.2: Enemy Type System
Currently all enemies are identical green blocks. Add an enemy type system.

**Enemy types:**

| Type | Color | Size | Speed Multiplier | Hits to Kill | Special |
|---|---|---|---|---|---|
| walker | Green (#44AA44) | Normal (0.8 tile) | 1.0x | 1 | Current default |
| sprinter | Blue (#4488DD) | Smaller (0.6 tile) | 1.8x | 1 | Faster movement |
| tank | Red (#CC4444) | Bigger (1.0 tile) | 0.6x | 2 | Takes 2 correct letter hits |
| swarm | Purple (#9944CC) | Tiny (0.5 tile) | 1.0x | 1 | Spawns as a cluster of 3-4, all same letter, 1 keypress kills all |

**Implementation:**
- Add `ENEMY_TYPES` constant in utils.js with properties for each type (color, darkColor, sizeMultiplier, speedMultiplier, maxHits)
- Modify `Enemies.spawn()` to accept a type parameter
- Each enemy object gets: `type`, `maxHits`, `currentHits`
- `Enemies.tryHitLetter()` for tanks: first hit shows a damage flash (yellow), second hit destroys. The letter stays the same for both hits.
- For swarms: when one letter is typed, ALL enemies on screen with that letter AND type 'swarm' from the same swarm group are destroyed at once. Spawn swarms with a `swarmGroup` ID.
- Rendering: each type has its own size and color. Sprinters are sleeker, tanks are bulkier with a darker outline, swarm enemies are tiny and grouped close together.

**Visual details per type:**
- **Walker**: Current look (green block, eyes, letter, feet)
- **Sprinter**: Blue, narrower body, no feet (looks like it's floating/dashing), speed lines behind it
- **Tank**: Red, bigger, thicker outline (4px instead of 3px), small horns on top, letter is bold
- **Swarm**: Purple, tiny, round-ish (still blocky), no feet, 3-4 cluster together with slight offset

### Task 2b.3: Update Wave Definitions Format
Change wave enemy definitions from simple letter strings to objects that can specify type.

Old format:
```javascript
{ enemies: ['F', 'J', 'F', 'J'], spawnInterval: 3.5, enemySpeed: 0.025 }
```

New format (backwards compatible — plain strings default to 'walker'):
```javascript
{ enemies: [
    'F',                           // defaults to walker
    'J',
    { letter: 'F', type: 'sprinter' },
    { letter: 'J', type: 'tank' },
    { letter: 'D', type: 'swarm', count: 3 },  // spawns 3 at once
], spawnInterval: 3.0, enemySpeed: 0.03 }
```

- Update `Enemies.loadWave()` to parse both formats
- Swarm entries spawn `count` enemies simultaneously with a small position offset and shared `swarmGroup` ID
- Enemy speed = wave's base enemySpeed × type's speedMultiplier

### Task 2b.4: Expand to 14 Levels
Design 14 levels that progressively introduce letters AND enemy types.

**Level design principles:**
- New letters introduced 2 at a time (matching finger pairs)
- New enemy types introduced one at a time with the letters the player already knows
- Early levels of a new enemy type use simple/known letters so the kid can focus on the new mechanic
- Path layouts vary: longer paths for harder levels (more enemies), shorter/straighter paths for easier ones

**Level definitions:**

| # | Name | New Letters | Available Enemy Types | Path Style | Waves |
|---|---|---|---|---|---|
| 1 | Home Start | F, J | Walker | Long winding (current) | 3 |
| 2 | Home Expand | D, K | Walker | Long winding | 3 |
| 3 | Quick Fingers | — (F,J,D,K review) | Walker + Sprinter intro | Medium, 2 turns | 3 |
| 4 | Home Neighbors | S, L | Walker, Sprinter | Long winding | 4 |
| 5 | Tough Letters | — (review all so far) | Walker + Tank intro | Long, 3 turns | 3 |
| 6 | Home Row | A | Walker, Sprinter, Tank | Medium, 2 turns | 4 |
| 7 | Swarm Attack | — (home row review) | Walker + Swarm intro | Long winding | 4 |
| 8 | Home Master | all home row mixed | All 4 types | Short, 1 turn (harder!) | 5 |
| 9 | Reaching Up | R, U | Walker, Sprinter | Long winding | 3 |
| 10 | Climbing Higher | E, I | Walker, Sprinter, Tank | Medium, 2 turns | 4 |
| 11 | Almost There | W, O | All 4 types | Medium, 2 turns | 4 |
| 12 | Pinky Stretch | Q, P | All 4 types | Short, 1 turn | 4 |
| 13 | Top Row Master | all top row + home review | All 4 types | Zigzag, 4 turns | 5 |
| 14 | Full Keyboard | All letters mixed | All 4 types, heavy swarms | Short, 1 turn (hardest!) | 6 |

### Task 2b.5: Path Layout Definitions
Create 5-6 distinct path layouts:

1. **Long Winding** (current): Entry left, 3 turns, exit right. ~38 tiles long. Used for early/learning levels.
2. **Medium Two-Turn**: Entry left, 2 turns (S-shape), exit right. ~28 tiles. Moderate difficulty.
3. **Short Direct**: Entry left, 1 turn, exit right. ~18 tiles. Used for harder levels.
4. **Zigzag**: Entry top-left, 4 tight turns, exit bottom-right. ~35 tiles. Used for mastery levels.
5. **Straight Rush**: Entry left, straight across, exit right. ~20 tiles. Very hard — enemies arrive fast.

Each path defined as a waypoints array. Store them as constants or in a PATHS object.

### Task 2b.6: Difficulty Scaling
Within each level, waves should escalate:
- Wave 1: Mostly walkers, known letters, generous spawn interval
- Middle waves: Mix in the new enemy types, tighter intervals
- Final wave: Full mix of available types, fast spawn, fast enemies

Enemy speed should scale with level number:
- Levels 1-5: base speed 0.025-0.035
- Levels 6-10: base speed 0.028-0.040
- Levels 11-14: base speed 0.030-0.045

Spawn intervals should tighten:
- Early levels: 3.0-3.5s
- Mid levels: 2.2-2.8s
- Late levels: 1.5-2.2s

### Task 2b.7: Tank Hit Indicator
When a tank takes its first hit:
- Flash yellow briefly (not the destroy flash)
- Show a small crack/damage indicator on the body
- The letter remains — player must type it again
- Second hit → normal destroy with particles

### Task 2b.8: Swarm Visual Grouping
When swarm enemies spawn:
- They start at the same path position but with slight random offsets (±5px)
- They move together as a cluster
- All have the same letter
- When the letter is typed, ALL of them explode simultaneously (satisfying!)
- Each one spawns its own particles (big explosion for the group)

### Task 2b.9: Update Level Select
- Level select needs to handle 14 levels instead of 5
- Arrange in a 2-row grid (7 per row) or scrollable single row
- Keep the existing star + best time display per level

## Acceptance Criteria
1. All 4 enemy types render with distinct visuals and behave correctly
2. Tanks require 2 hits with damage indicator after first hit
3. Swarms spawn as clusters and all die together on one keypress
4. Sprinters visibly move faster than walkers
5. 14 levels are playable with progressive difficulty
6. Each level can have its own unique path layout
7. Level select screen handles 14 levels cleanly
8. Old save data (5 levels) is handled gracefully — unlocked levels stay unlocked
9. Game runs smoothly at 60fps even with swarm clusters on screen
10. All existing features (timer, scoring, combos, etc.) work with the new enemy types

## Status: COMPLETE

### Implementation Summary
- **ENEMY_TYPES** config in utils.js: walker, sprinter, tank, swarm with color, size, speed, hits
- **PATH_LAYOUTS** in utils.js: 5 layouts (longWinding, mediumTwoTurn, shortDirect, zigzag, straightRush)
- **Path.init(waypoints)** accepts per-level waypoints; levels specify their own path layout
- **Enemy system** rewritten: type-aware spawn/render/hit with tank 2-hit, swarm group kill, sprinter trail
- **Wave format** backwards-compatible: strings = walker, objects specify type
- **14 levels** with progressive difficulty across letters AND enemy types
- **Level select** updated to 2-row grid (7 per row)

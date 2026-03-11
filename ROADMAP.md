# Letter Defenders — Development Roadmap

## Phase 1: Foundation ← CURRENT
**Goal**: Core game engine, playable grid world, Minecraft look & feel

**Deliverables**:
- index.html with full-screen canvas + menu screen
- Game loop (update/render cycle at 60fps)
- Grid/tile map rendered in Minecraft block style (grass, dirt, stone, path blocks)
- A winding path drawn on the grid where enemies will walk
- Placeholder block-style letter enemies that walk the path
- Basic keyboard input detection (pressing a letter key registers)
- On-screen keyboard component (visual only, highlights pressed key)
- Placeholder pixel art using colored squares/rectangles (no real sprites yet)
- Simple start screen with game title and "Play" button
- All code pushed to GitHub repo

**Status**: Not started

---

## Phase 2: Letter March Mode
**Goal**: First fully playable game mode

**Deliverables**:
- Letter enemies spawn at path start, walk toward base
- Each enemy displays a letter on its body (big, clear, Minecraft font)
- Player types the matching letter to destroy the enemy (with zap animation)
- Wrong key = visual feedback (shake/flash, no punishment)
- Wave system: groups of letters arrive in waves with breaks between
- Starting letter set: F, J, D, K (home row fingers)
- Health system: base has hearts, loses one per enemy that arrives
- Win/lose screen with encouraging messages
- Basic scoring: points per correct letter, bonus for speed

**Status**: Not started

---

## Phase 3: Keyboard Defense Mode
**Goal**: Second game mode focused on keyboard location learning

**Deliverables**:
- Full on-screen keyboard as the main play area
- Letters "attack" by glowing/pulsing on the keyboard
- Player must click/tap the correct glowing key to defend
- Visual feedback: correct = green flash + block explosion, wrong = red shake
- Finger guide overlay: shows which finger should press which key
- Same wave and progression system as Letter March
- Keyboard zones unlock progressively (home row → top row → bottom row)

**Status**: Not started

---

## Phase 4: Tower Strike Mode
**Goal**: Third game mode with strategic tower placement

**Deliverables**:
- Grid-based battlefield where player places towers
- Enemies walk the path carrying letter shields
- Towers fire automatically BUT only when player types the matching letter
- Multiple tower types (visual variety, same core mechanic)
- Tower placement phase between waves
- Resource system: earn blocks/coins to build towers
- Combines typing skill with basic strategy

**Status**: Not started

---

## Phase 5: Progression & Polish
**Goal**: Full progression system and visual upgrade

**Deliverables**:
- Level map (world select screen, Minecraft biome themed)
- Star rating per level (1-3 stars based on performance)
- Letter mastery tracking (which letters the child knows well)
- Adaptive difficulty: focuses on letters the child struggles with
- Unlockable content: new tower skins, enemy skins, backgrounds
- **Gemini-generated Minecraft-style sprite assets** replace all placeholders
- Smooth animations for all game actions
- Particle effects (block explosions, sparkles, etc.)

**Status**: Not started

---

## Phase 6: Sound & Final Touches
**Goal**: Audio, accessibility, and final polish

**Deliverables**:
- Sound effects for: typing, correct hit, wrong key, enemy destroyed, wave complete
- Letter pronunciation audio (speaks the letter name when destroyed)
- Background music (calm, Minecraft-style ambient)
- Settings menu: volume control, difficulty override
- Mobile/touch support refinement
- Performance optimization
- Final testing and bug fixes

**Status**: Not started

---

## Letter Progression Plan
The game introduces letters in this order across all modes:

| Level Group | Letters | Concept |
|---|---|---|
| 1 - Home Start | F, J | Index fingers home position |
| 2 - Home Expand | D, K | Middle fingers |
| 3 - Home Full | S, L | Ring fingers |
| 4 - Home Complete | A, ; | Pinky fingers |
| 5 - Home Row Mix | A-L mixed | Full home row mastery |
| 6 - Top Start | R, U | Index fingers reach up |
| 7 - Top Expand | E, I | Middle fingers reach up |
| 8 - Top More | W, O | Ring fingers reach up |
| 9 - Top Complete | Q, P | Pinky fingers reach up |
| 10 - Bottom Start | V, M | Index fingers reach down |
| 11 - Bottom Expand | C, N | Continue bottom row |
| 12 - Bottom More | X, B | Continue bottom row |
| 13 - Bottom Complete | Z, / | Pinky bottom row |
| 14 - Full Mix | All letters | Full keyboard mastery |

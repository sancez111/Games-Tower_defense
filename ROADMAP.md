# Letter Defenders — Development Roadmap

## Phase 1: Foundation ← COMPLETE
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

**Status**: Complete

---

## Phase 2: Letter March Mode ← COMPLETE
**Goal**: First fully playable game mode + Phase 1 performance fixes

**Deliverables**:
- Phase 1 fixes: grid caching, gradient caching, touch keyboard input, font loading, navigation
- Letter enemies spawn at path start, walk toward base
- Each enemy displays a letter on its body (big, clear, Minecraft font)
- Player types the matching letter to destroy the enemy (block explosion particles)
- Wrong key = visual feedback (shake/flash, no punishment)
- Wave system: groups of letters arrive in waves with breaks between
- 5 levels starting with F, J and progressing through home row
- Level select screen with star ratings and unlock progression
- Health system: base has hearts, loses one per enemy that arrives
- Win/lose screens with encouraging messages and star ratings
- Scoring with combo system and floating text feedback
- Progress saved in browser (localStorage)

**Status**: Complete

---

## Phase 2a: Stopwatch + Best Times ← COMPLETE
**Goal**: Add competitive timer to drive replayability

**Deliverables**:
- Level stopwatch timer (runs during active gameplay, pauses when paused, stops between waves)
- Best time tracking per level saved to localStorage
- Best times displayed on level select, win screen, and game over screen
- "NEW BEST!" celebration on beating a record

**Status**: Complete

---

## Phase 2b: Enemy Variety + Level Layouts ← CURRENT
**Goal**: Add enemy types and unique path layouts to increase difficulty and variety

**Deliverables**:
- **Enemy types**:
  - Walker (existing): Normal speed, 1 hit — green block
  - Sprinter: Fast, 1 hit — blue block, smaller (introduced ~Level 3)
  - Tank: Slow, 2 hits to destroy — red block, bigger (introduced ~Level 5)
  - Swarm: Group of 3-4 small enemies, all same letter, 1 keypress destroys all — purple blocks (introduced ~Level 4)
- Enemy type difficulty scales gradually across levels (early = all Walkers, later = mixed)
- **Level-specific path layouts**: Each level can define its own path (long winding = easier, short direct = harder)
- Expand from 5 to 10+ levels to cover top row letters (R, U, E, I, W, O, Q, P)
- Wave definitions use enemy types: e.g., `{ letter: 'F', type: 'tank' }` or `{ letter: 'J', type: 'swarm' }`

**Status**: Not started

---

## Phase 2c: Super Powers
**Goal**: Add collectible power-ups that drop from destroyed enemies, providing exciting abilities

**Deliverables**:
- **Power-up drop system**: Destroyed enemies have a random chance to drop a glowing pickup on the path. Player collects it by typing a bonus letter that appears on the pickup (reinforces typing!). Pickups disappear after a few seconds if not collected.
- **Power inventory**: Collected powers stored in slots shown at bottom-left of screen (max 3 held at once). Spacebar activates selected power, Alt rotates selection.
- **6 Powers** (unlocked at level milestones):
  - **Fireball** (Level 3): Destroys one enemy anywhere on screen — a fireball animation flies to the nearest enemy
  - **Shield** (Level 5): Blocks the next enemy that reaches the castle — a glowing barrier appears at the base for one hit
  - **Slow Clock** (Level 7): All enemies move at half speed for 5 seconds — clock visual + blue tint on enemies
  - **Blizzard** (Level 9): Freezes all on-screen enemies in place for 4 seconds — ice crystals on enemies
  - **Lava Moat** (Level 12): A lava pool appears in front of the castle for 3 seconds, destroying enemies that walk into it
  - **Dragon** (Level 15): A dragon sweeps across 1/3 of the path, fire breath destroys everything in that zone
- **Balancing**:
  - Drop rate is low enough that powers feel special (~15-20% chance per kill)
  - Only one power can be used per wave
  - Higher star ratings require fewer power uses (encourages pure typing)
  - Later levels are designed harder to account for powers being available
- **Visual**: Pickups are glowing colored blocks bouncing on the path. Each power type has a distinct color and simple icon.

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
- Enemy types carry over from Letter March

**Status**: Not started

---

## Phase 3.5: Gemini Graphics
**Goal**: Replace placeholder colored blocks with proper Minecraft-style sprite art

**Deliverables**:
- Generate Minecraft-style pixel art sprites using Gemini AI for:
  - Enemy types (Walker, Sprinter, Tank, Swarm) — front-facing block characters
  - Castle/base building
  - Cave entrance
  - Tile textures (grass, dirt, stone, path)
  - Heart and star icons
  - Menu background elements
- Integrate sprites into the game (replace fillRect drawing with sprite rendering)
- Maintain blocky aesthetic — sprites should be low-res pixel art (16x16 or 32x32)

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
**Goal**: Full progression system and polish

**Deliverables**:
- Level map (world select screen, Minecraft biome themed)
- Letter mastery tracking (which letters the child knows well)
- Adaptive difficulty: focuses on letters the child struggles with
- Unlockable content: new tower skins, enemy skins, backgrounds
- Smooth animations for all game actions
- Additional particle effects (sparkles, etc.)

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

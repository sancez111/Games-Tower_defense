# Phase 2: Letter March Mode — Detailed Build Plan

## Overview
Turn the Phase 1 demo into a fully playable Letter March game mode with waves, health, scoring, win/lose conditions, and encouraging feedback. Also fix performance and usability issues from Phase 1.

## Priority Fixes from Phase 1 (Do These First)

### Fix 2.0a: Off-Screen Grid Cache
The grid (240 tiles) is redrawn every frame even though it never changes.
- Create an off-screen canvas the same size as the game area
- Draw the grid + path tiles to it ONCE (on init and on resize)
- Each frame, just drawImage() the cached canvas instead of looping 240 tiles
- Re-cache only when the window resizes

### Fix 2.0b: Cache Sky Gradient
The sky gradient is recreated as a new object every frame.
- Create the gradient once on init/resize, store it
- Reuse the stored gradient in render calls

### Fix 2.0c: Touch Input for On-Screen Keyboard
Critical for kids on tablets — tapping keyboard keys does nothing currently.
- In the touchstart and mousedown handlers, check if the click/tap lands on an on-screen keyboard key using Keyboard.getKeyAt(x, y)
- If it hits a key, treat it exactly like a physical keypress (feed it into the same input system)
- This makes the game fully playable on touch devices

### Fix 2.0d: Optimize Keyboard Highlight Updates
Currently filters entire enemy list and resets all keys every frame.
- Only update highlights when the active enemy list actually changes (enemy spawned, destroyed, or reached end)
- Track a dirty flag on the enemy list

### Fix 2.0e: Font Loading State
- Use document.fonts.ready or FontFaceSet API to wait for "Press Start 2P" to load
- Show a simple "Loading..." text in a fallback font while waiting
- Only call Game.init() after font is ready

### Fix 2.0f: Navigation
- Add a "Back to Menu" button in the pause screen
- Add a "Play Again" and "Menu" button on win/lose screens
- ESC during gameplay = pause (already works)

---

## New Features

### Task 2.1: Health System
- Castle has 5 hearts (displayed top-right of game area)
- When an enemy reaches the end of the path, castle loses 1 heart
- Hearts rendered as red pixel-art heart icons
- When hit, heart flashes and screen shakes
- At 0 hearts → GAME_OVER state
- Visual: hearts drawn as blocky Minecraft-style hearts (like Minecraft's health bar)

### Task 2.2: Scoring System
- +10 points per correct letter destroyed
- Speed bonus: +5 extra if destroyed in first 30% of path, +3 in first 50%
- Score displayed top-left of game area
- Score pops/scales up briefly when points are added (juice animation)
- Running combo counter: consecutive correct hits show "x2!", "x3!" etc.
- Combo resets when an enemy reaches the base or wrong key is pressed

### Task 2.3: Wave System
- Each level has a defined set of waves
- A wave = a group of letters that spawn with a set interval between each
- Between waves: 3-second countdown "Wave 2 incoming!" message
- Wave progress indicator: "Wave 2/5" displayed at top-center
- Each wave can define:
  - Which letters appear
  - How many enemies
  - Spawn speed (interval between enemies)
  - Enemy walk speed

### Task 2.4: Level Definitions
Create Level 1 as the first playable level:
- **Level 1: "Home Start"**
  - Letters: F and J only (index fingers home position)
  - Wave 1: 4 enemies (F, J, F, J), slow speed, 3.5s spawn interval
  - Wave 2: 5 enemies (F, J, J, F, J), same speed, 3s spawn interval
  - Wave 3: 6 enemies (mixed F and J), slightly faster walk speed, 2.5s spawn interval
- Create a level definition format that's easy to extend later:
```javascript
const LEVELS = [
  {
    name: "Home Start",
    letters: ['F', 'J'],
    waves: [
      { enemies: ['F','J','F','J'], spawnInterval: 3.5, enemySpeed: 0.025 },
      { enemies: ['F','J','J','F','J'], spawnInterval: 3.0, enemySpeed: 0.025 },
      { enemies: ['F','J','F','J','F','J'], spawnInterval: 2.5, enemySpeed: 0.03 },
    ]
  },
  // more levels...
];
```
- Also define Levels 2-5 so there's enough content to play:
  - Level 2: "Home Expand" — adds D and K
  - Level 3: "Home Neighbors" — adds S and L
  - Level 4: "Home Row" — adds A and ; (or just A)
  - Level 5: "Home Master" — all home row mixed, faster

### Task 2.5: Win/Lose Screens

**Game Over screen** (0 hearts):
- Dark overlay with "GAME OVER" in big red blocky text
- Show final score
- Encouraging message: "Great try! Keep practicing!" or similar
- Two buttons: "Try Again" (restart same level) and "Menu"

**Win screen** (survived all waves):
- Celebratory overlay with "LEVEL COMPLETE!" in gold text
- Show final score
- Star rating: 1 star = completed, 2 stars = lost ≤2 hearts, 3 stars = lost 0 hearts
- Stars rendered as blocky yellow Minecraft stars
- Encouraging messages: "Amazing!", "Super!", "You're a typing hero!"
- Buttons: "Next Level" and "Menu"

### Task 2.6: Level Select Screen
- New game state: LEVEL_SELECT
- After clicking "Letter March" on main menu, show level select
- Display levels as a row of blocks/buttons (like Minecraft inventory slots)
- Each block shows: level number, level name, star rating (if completed)
- Locked levels shown as darker/grayed out blocks with a lock icon
- Level 1 is always unlocked; others unlock when previous level gets at least 1 star
- Store progress in localStorage (simple JSON: which levels completed, stars earned)

### Task 2.7: In-Game HUD
All overlaid on the game area, not blocking gameplay:
- **Top-left**: Score (gold text)
- **Top-center**: Wave indicator "Wave 2/5"
- **Top-right**: Hearts (red blocky hearts)
- **Combo display**: When combo ≥ 2, show "x2!" near the last destroyed enemy position, floating upward and fading

### Task 2.8: Particle Effects
When an enemy is destroyed:
- Spawn 6-8 small colored squares that fly outward and fade (block explosion)
- Colors match the enemy body color
- Particles affected by gravity (fall down slightly)
- Particles fade out over 0.5 seconds
- This replaces the current simple white flash

### Task 2.9: Floating Text
- When an enemy is destroyed, show "+10" floating upward from where it died
- If speed bonus: show "+15" instead
- Combo text: "x2!", "x3!" shown briefly
- "NICE!", "GREAT!", "PERFECT!" randomly on streaks of 3+, 5+, 7+ hits
- All text floats up and fades out over ~1 second

---

## File Changes Summary
- **js/engine.js** — Add new states (LEVEL_SELECT, GAME_OVER, WIN), grid caching, gradient caching, touch-to-keyboard input, font loading, navigation buttons
- **js/enemies.js** — Remove infinite respawn loop, integrate with wave system
- **js/keyboard.js** — Optimize highlight updates with dirty flag
- **js/progression.js** — Full implementation: levels, waves, scoring, health, stars, localStorage
- **js/modes/letterMarch.js** — Full Letter March game logic: wave controller, level flow
- **js/grid.js** — Add renderToCache() method, expose cached canvas
- **js/utils.js** — Add particle system, floating text system

## Acceptance Criteria
When Phase 2 is done:
1. Main menu → "Letter March" → Level Select screen with 5 levels
2. Level 1 starts with only F and J letters
3. Enemies march, player types to destroy them with block explosion particles
4. Hearts decrease when enemies reach castle, screen shakes
5. Score accumulates with combo bonuses and floating "+10" text
6. Wave indicator shows progress through waves
7. All waves survived = win screen with star rating
8. 0 hearts = game over screen with encouraging message
9. Progress (stars) saved and persists between browser sessions
10. On-screen keyboard works with touch (playable on tablet)
11. Game runs smoothly at 60fps with grid caching
12. Can navigate between menu, level select, gameplay, and back

# Phase 1: Foundation — Detailed Build Plan

## Overview
Build the core game engine and visual framework. After this phase, we should have a Minecraft-style grid world with a winding path, placeholder enemies walking along it, keyboard input detection, and a basic menu screen. No gameplay logic yet — just the engine.

## Task Breakdown

### Task 1.1: Project Scaffolding
Create the folder structure and base files:
```
/
├── index.html
├── css/style.css
├── js/engine.js
├── js/grid.js
├── js/path.js
├── js/enemies.js
├── js/keyboard.js
├── js/progression.js
├── js/utils.js
├── js/modes/letterMarch.js
├── js/modes/keyboardDefense.js
├── js/modes/towerStrike.js
├── assets/sprites/.gitkeep
├── assets/sounds/.gitkeep
├── assets/fonts/.gitkeep
```

### Task 1.2: HTML & Canvas Setup (index.html)
- Full-screen HTML5 canvas element
- Load all JS files via script tags (no bundler)
- Responsive: canvas fills the browser window, scales on resize
- Include a Google Fonts link for a pixel/blocky font (e.g., "Press Start 2P" or "Silkscreen")
- Basic HTML structure: canvas + UI overlay div for menus

### Task 1.3: Game Engine (js/engine.js)
- Game state machine: MENU → PLAYING → PAUSED → GAME_OVER → WIN
- requestAnimationFrame loop running at 60fps
- Delta time calculation for smooth movement
- Central update() and render() functions
- Input handler: listens for keydown events, stores pressed keys
- Mouse/touch click handler for UI buttons
- Canvas resize handler (maintain aspect ratio, e.g., 16:9)
- Game config object with tunable values (grid size, speed, etc.)

### Task 1.4: Grid & Tile System (js/grid.js)
- Grid of square tiles (e.g., 20 columns × 12 rows)
- Each tile has a type: GRASS, DIRT, STONE, PATH, WATER, TOWER_SLOT
- Tile rendering: draw each tile as a colored block with subtle pixel-art texture
  - GRASS: green with darker green pixels scattered
  - DIRT: brown with tan speckles
  - STONE: gray with darker gray lines
  - PATH: lighter tan/sand color with darker edges
  - WATER: blue with animated lighter blue pixels
  - TOWER_SLOT: slightly raised stone block
- Grid-to-pixel and pixel-to-grid coordinate conversion functions
- Draw grid lines subtly (Minecraft block edge look)

### Task 1.5: Path System (js/path.js)
- Define a winding path as an array of grid coordinates
- Path goes from left/top entry point to right/bottom base
- Path should have at least 2-3 turns (like a classic TD path)
- Function to get position along path by percentage (0.0 = start, 1.0 = end)
- Visual: path tiles rendered differently from background tiles
- Entry point: draw a dark cave/tunnel opening (block style)
- Base/endpoint: draw a simple castle/house made of blocks

### Task 1.6: Placeholder Enemies (js/enemies.js)
- Enemy class/object: position, speed, health, letter, pathProgress
- Render enemy as a colored block (Minecraft creeper-ish square shape)
- Display the letter on the enemy's body (large, centered, white text)
- Move enemy along the path using pathProgress (0 → 1)
- Spawn function: create enemy with a given letter at path start
- For Phase 1: just spawn a few test enemies that walk the path
- Enemy reaches end → remove from game (no health system yet)

### Task 1.7: On-Screen Keyboard (js/keyboard.js)
- Draw a QWERTY keyboard layout at the bottom of the screen
- Each key is a rounded rectangle with the letter centered
- Standard 3-row layout: QWERTYUIOP / ASDFGHJKL / ZXCVBNM
- Key states: NORMAL (gray), HIGHLIGHTED (yellow glow), CORRECT (green flash), WRONG (red flash)
- When player presses a physical key, the on-screen key briefly flashes
- Function to highlight specific keys (for teaching which keys to press)
- Keyboard should be sized proportionally to screen, always visible below game area

### Task 1.8: Start Menu Screen
- Title "LETTER DEFENDERS" in big blocky Minecraft-style font
- Subtitle: "Learn Your Letters!"
- Three mode buttons (only Letter March active for now, others grayed out):
  - ⚔️ Letter March
  - ⌨️ Keyboard Defense (locked)
  - 🏰 Tower Strike (locked)
- Minecraft-style background (grass blocks along bottom, sky gradient, clouds)
- Start button has hover effect and click animation

### Task 1.9: Utility Functions (js/utils.js)
- Color palette constants (Minecraft-inspired greens, browns, grays, blues)
- Random number helpers
- Collision detection (point-in-rect)
- Text rendering helper (centered text with shadow, Minecraft style)
- Animation easing functions
- Screen shake function

### Task 1.10: Integration & Testing
- Wire everything together: menu → click play → game starts → enemies walk path
- Pressing a letter key highlights the on-screen keyboard
- If pressed letter matches an enemy's letter, enemy blinks (placeholder for destroy)
- Verify responsive sizing works
- Commit and push to GitHub

## Visual Style Guide
- **Color palette**: Minecraft-inspired earth tones
  - Grass: #5B8C2A (dark), #7EC850 (light)
  - Dirt: #8B6914 (dark), #B8860B (light)
  - Stone: #7F7F7F (dark), #A9A9A9 (light)
  - Path: #C4A35A (dark), #DCC07E (light)
  - Sky: #87CEEB gradient to #4A90D9
  - Water: #2E5FD1 (dark), #5B9BD5 (light)
- **Block style**: Every visual element is made of squares/rectangles
- **Text**: Blocky pixel font, white with dark shadow (2px offset)
- **No curves**: Everything is angular and blocky (Minecraft aesthetic)
- **Enemies**: Square body, square eyes, letter displayed large on chest area

## Acceptance Criteria
When Phase 1 is done, opening index.html in a browser should show:
1. A Minecraft-themed start menu with the game title
2. Clicking "Letter March" starts the game
3. A grid-based map appears with grass, dirt, and a winding path
4. Square block enemies with letters on them walk along the path
5. An on-screen keyboard is visible at the bottom
6. Pressing a letter key highlights that key on the on-screen keyboard
7. If the pressed letter matches an enemy, the enemy visually reacts
8. The game runs smoothly at 60fps and fills the browser window

## Status: Complete

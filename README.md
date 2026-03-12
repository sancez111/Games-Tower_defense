# Letter Defenders 🏰⌨️

A Minecraft-style tower defense learning game for young children (age 5+) to recognize letters and learn their keyboard locations.

## Game Overview

**Letter Defenders** is a web-based (HTML/JS/CSS) tower defense game with three game modes:

### Game Modes
1. **Letter March** — Letters walk down a blocky path toward your base. Type the correct letter to zap them before they arrive.
2. **Keyboard Defense** — Letters light up on a virtual on-screen keyboard. Click/tap the correct key to defend your castle.
3. **Tower Strike** — Enemies carry letters on their shields. Type the letter to fire your tower and destroy them.

### Key Features
- **Minecraft-style pixel/block art** visuals (blocky characters, grid-based world)
- **On-screen keyboard** that highlights where each letter lives (teaches finger placement)
- **Progression system** — starts with a few easy letters (home row), gradually adds more
- **Difficulty scaling** — enemies get faster, more letters appear, shorter reaction times
- **Kid-friendly** — bright colors, fun animations, encouraging feedback

## Tech Stack
- Pure HTML5 / CSS3 / JavaScript (no frameworks)
- HTML5 Canvas for game rendering
- No build step required — just open index.html in a browser

## Project Structure
```
/
├── index.html          — Main entry point & menu
├── css/
│   └── style.css       — Global styles & Minecraft-style fonts
├── js/
│   ├── engine.js       — Core game loop, rendering, input handling
│   ├── grid.js         — Grid/tile map system (Minecraft block world)
│   ├── path.js         — Enemy path definition & movement
│   ├── enemies.js      — Letter enemy spawning & behavior
│   ├── keyboard.js     — On-screen keyboard component & highlighting
│   ├── progression.js  — Level system, difficulty scaling, scoring
│   ├── modes/
│   │   ├── letterMarch.js    — Mode 1: Letter March
│   │   ├── keyboardDefense.js — Mode 2: Keyboard Defense
│   │   └── towerStrike.js    — Mode 3: Tower Strike
│   └── utils.js        — Helpers, constants, shared functions
├── assets/
│   ├── sprites/        — Minecraft-style pixel art (placeholder → Gemini-generated)
│   ├── sounds/         — Sound effects & letter audio (Phase 6)
│   └── fonts/          — Pixel/block fonts
├── ROADMAP.md          — Full development roadmap
└── PHASE1.md           — Current phase detailed plan
```

## Development Workflow
- **Planning**: Claude Project (this repo's planning hub)
- **Building**: Claude Code (CC) handles all coding & git pushes
- **Graphics** (later): Gemini AI generates Minecraft-style sprite assets

## Current Status
**Phase 2 — Letter March Mode** (Complete)
- Level stopwatch timer with best time tracking
  - Running timer in HUD (MM:SS.ms format) during active gameplay
  - Best times saved per level in localStorage (backwards-compatible save format)
  - Best times displayed on level select screen
  - "NEW BEST!" celebration on win screen, survived time on game over screen

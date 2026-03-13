# World System — Detailed Build Plan

## Overview
Replace the flat level select with 4 themed worlds (4 levels each = 16 total). Add a Super Mario-style world map with paths connecting worlds. Each world has its own tile colors, sky, decorations, and enemy color tints.

## The 4 Worlds

### World 1: Forest (Levels 1-4)
- **Theme**: Current look — green grass, brown dirt, blue sky
- **Tile colors**: Grass greens (#5B8C2A, #7EC850), dirt browns (#8B6914, #B8860B), stone grays
- **Sky**: Blue gradient (#4A90D9 → #87CEEB)
- **Decorations**: Small blocky trees alongside the path, bushes, flowers
- **Castle**: Current stone castle
- **Cave**: Current dark cave
- **Letters taught**: F, J, D, K (home row start)

### World 2: Desert (Levels 5-8)
- **Theme**: Sandy, warm, dry
- **Tile colors**: Sand (#E8D28C, #D4B96A), sandstone (#C9A44A, #B89030), red rock (#B85C3A, #9E4A2E)
- **Sky**: Warm gradient (#E8A030 → #F0D080) — sunset feel
- **Decorations**: Blocky cacti, sand dunes, small rocks, pyramid shapes in background
- **Castle**: Sandstone fortress with flat roof
- **Cave**: Dark sandstone archway
- **Path tiles**: Sandy tan color
- **Letters taught**: S, L, A + home row mastery

### World 3: Snow/Ice (Levels 9-12)
- **Theme**: Cold, white, icy
- **Tile colors**: Snow white (#E8E8F0, #D0D0E0), ice blue (#B0C8E8, #8AB0D8), frozen ground (#9AAAB8, #7A8A98)
- **Sky**: Cold gradient (#8AAAC8 → #C8D8E8) — overcast winter
- **Decorations**: Blocky snow-covered pine trees, ice crystals, snowflakes falling gently, icicles
- **Castle**: Ice castle (light blue/white bricks, icicle battlements)
- **Cave**: Icy cave mouth with icicle frame
- **Path tiles**: Cleared snowy path (lighter gray)
- **Letters taught**: R, U, E, I (top row start)

### World 4: Lava/Nether (Levels 13-16)
- **Theme**: Dark, fiery, dangerous
- **Tile colors**: Dark stone (#3A3A3A, #555555), obsidian (#1A1A2A, #2A2A3A), lava cracks (#FF4400 glow lines in dark tiles)
- **Sky**: Dark red gradient (#2A1010 → #601818) — ominous
- **Decorations**: Lava pools (animated glow), fire particles rising, cracked ground, glowing embers
- **Castle**: Obsidian fortress with lava moat detail
- **Cave**: Nether portal style (purple/dark frame with inner glow)
- **Path tiles**: Dark cracked stone with subtle lava glow between cracks
- **Letters taught**: W, O, Q, P + full keyboard mastery

## World Map Screen (Super Mario Style)

### New Game State: WORLD_MAP
Replace the current LEVEL_SELECT state with WORLD_MAP.

### Visual Layout
- Top-down view of a winding path connecting 4 world nodes
- Path starts bottom-left, winds across the screen through 4 world "islands"
- Each world is represented by a large themed block/icon:
  - Forest: green tree block
  - Desert: sandy pyramid block
  - Snow: white mountain block
  - Lava: dark red volcano block
- Between worlds, a dotted/dashed path connects them
- Small level dots (1-4) along the path within each world section
- Completed levels = bright dots with stars, current = pulsing, locked = dark/gray
- A small player character (blocky Minecraft Steve-like) sits on the current unlocked level
- Background: parchment/map colored (#F0E6D2) with decorative border

### Interaction
- Click/tap a level dot to start that level
- Locked worlds are grayed out with a lock icon
- A world unlocks when all 4 levels of the previous world have ≥1 star
- "Back" button returns to main menu
- World name displayed when hovering/near a world node

### Player Character on Map
- Simple blocky character (8x12 pixels scaled up)
- Sits on the highest unlocked level
- Gently bobs up and down
- When clicking a level, character "walks" to it (quick animation)

## Level Restructuring (14 → 16 levels)

Redistribute the current 14 levels into 16, adding 2 new levels. Assign worlds:

### World 1: Forest (Levels 1-4)
| Level | Name | Letters | New Enemy Types |
|---|---|---|---|
| 1 | Home Start | F, J | Walker |
| 2 | Home Expand | D, K | Walker |
| 3 | Quick Fingers | F,J,D,K review | Walker + Sprinter |
| 4 | Home Neighbors | S, L | Walker, Sprinter |

### World 2: Desert (Levels 5-8)
| Level | Name | Letters | New Enemy Types |
|---|---|---|---|
| 5 | Tough Letters | F,J,D,K,S,L review | Walker + Tank |
| 6 | Home Row | A | Walker, Sprinter, Tank |
| 7 | Swarm Attack | Home row review | Walker + Swarm |
| 8 | Home Master | All home row | All 4 types |

### World 3: Snow/Ice (Levels 9-12)
| Level | Name | Letters | New Enemy Types |
|---|---|---|---|
| 9 | Reaching Up | R, U | Walker, Sprinter |
| 10 | Climbing Higher | E, I | Walker, Sprinter, Tank |
| 11 | Almost There | W, O | All 4 types |
| 12 | Top Explorer | Q, P | All 4 types |

### World 4: Lava/Nether (Levels 13-16)
| Level | Name | Letters | New Enemy Types |
|---|---|---|---|
| 13 | Top Row Master | All top + home review | All 4 types |
| 14 | Into the Nether | Mix of all learned | All 4, heavy |
| 15 | Fire and Ice | All letters, fast | All 4, speed ramp |
| 16 | Full Keyboard | Everything, hardest | All 4, maximum |

## Implementation Details

### World Theme Data Structure
```javascript
const WORLDS = [
    {
        id: 1,
        name: 'Forest',
        levels: [0, 1, 2, 3],  // indices into LEVELS array
        colors: {
            skyTop: '#4A90D9', skyBottom: '#87CEEB',
            grass: '#5B8C2A', grassLight: '#7EC850',
            dirt: '#8B6914', dirtLight: '#B8860B',
            path: '#C4A35A', pathLight: '#DCC07E',
            stone: '#7F7F7F', stoneLight: '#A9A9A9',
        },
        mapIcon: 'tree',
        mapColor: '#5B8C2A',
    },
    // ... desert, snow, lava
];
```

### Per-Level World Theme Application
- Each level definition gets a `world` property (1-4)
- When a level starts, the world's color palette overrides the default COLORS for tiles
- Grid.init() applies the world's colors
- Sky gradient uses the world's sky colors
- Cave and castle rendering adapts to world theme
- Decorations rendered based on world type

### Grid Changes
- Add optional decoration rendering: trees (forest), cacti (desert), pine trees (snow), lava pools (lava)
- Decorations placed randomly alongside the path (not blocking it)
- Decorations are cached with the grid (off-screen canvas)

### What Changes Per World
- Tile colors (grass, dirt, stone, path)
- Sky gradient colors
- Castle appearance
- Cave appearance
- Background decorations
- Enemy tint (optional: enemies slightly tinted to match world — e.g., reddish in lava)

### What Stays the Same
- Game mechanics, enemy types, powers, keyboard, HUD
- Path layouts per level (already defined per level)
- Scoring, stars, timer

## Files Changed
- **js/utils.js**: Add WORLDS data structure with color palettes. Add world map colors.
- **js/grid.js**: Accept world theme, use world colors for tiles, render decorations
- **js/engine.js**: Replace LEVEL_SELECT state with WORLD_MAP. Render world map. Handle world map interaction.
- **js/path.js**: Use world theme for cave/castle colors
- **js/progression.js**: Add 2 new levels (15, 16). Add `world` property to each level. World unlock logic.
- **js/modes/letterMarch.js**: Pass world theme to grid/path on level start

## Acceptance Criteria
1. World map screen shows 4 world nodes connected by paths with level dots
2. Small player character on highest unlocked level
3. Click level dot to start that level
4. Each world has distinct tile colors, sky, cave, castle, and decorations
5. Forest = green/current, Desert = sandy/warm, Snow = white/blue, Lava = dark/red
6. 16 levels playable with correct letter progression
7. Worlds unlock sequentially (complete previous world to unlock next)
8. All existing features work (powers, enemy types, timer, scoring)
9. Smooth 60fps including world map
10. Old save data handled gracefully (14 levels → 16 levels)

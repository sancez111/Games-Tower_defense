# Phase 2d: World System — 4 Worlds, 16 Levels, Mario-Style Map

## Overview
Replace the flat level select with 4 themed worlds (4 levels each, 16 total). Add a Mario-style world map with paths connecting worlds, and give each world a distinct visual theme that changes the tile colors, background, and decorations.

## The 4 Worlds

### World 1: Forest (Levels 1-4) — "Greenwood"
- **Theme**: Current look — grass, dirt, trees, blue sky
- **Tile colors**: Green grass, brown dirt, tan path
- **Sky**: Blue gradient
- **Decorations**: Blocky trees, flowers, bushes along path edges
- **Difficulty**: Easy, learning the basics
- **Letters**: F, J, D, K (home row start)
- **Enemy types**: Walkers only (Lvl 1-2), introduce Sprinters (Lvl 3-4)

### World 2: Desert (Levels 5-8) — "Sandstone"
- **Theme**: Sandy dunes, warm tones, cacti
- **Tile colors**: Sand yellow (#D4A65A), dark sand (#B8893A), red sandstone path (#C46A3A)
- **Sky**: Warm orange-blue gradient (hotter sky)
- **Decorations**: Blocky cacti, sand dunes, small rocks, sun
- **Difficulty**: Medium
- **Letters**: S, L, A + review (complete home row)
- **Enemy types**: Walkers, Sprinters, introduce Tanks (Lvl 6-7), introduce Swarms (Lvl 8)

### World 3: Snow/Ice (Levels 9-12) — "Frostpeak"
- **Theme**: Frozen tundra, white and blue, icy
- **Tile colors**: White snow (#E8E8F0), ice blue (#A0C4E8), frozen path (#8BB0D0)
- **Sky**: Cold pale blue-white gradient
- **Decorations**: Snow-topped trees, ice crystals, snowflakes falling (animated), frozen pond tiles
- **Difficulty**: Hard
- **Letters**: R, U, E, I (top row start)
- **Enemy types**: All 4 types

### World 4: Lava/Nether (Levels 13-16) — "Netherforge"
- **Theme**: Dark volcanic, fire and lava, dangerous
- **Tile colors**: Dark stone (#3A3A3A), obsidian (#1A1A2A), magma path (#CC4400), lava pools
- **Sky**: Dark red-orange gradient with smoke
- **Decorations**: Lava pools (animated glow), fire particles, cracked obsidian, glowing crystals
- **Difficulty**: Brutal
- **Letters**: W, O, Q, P + full keyboard mix (Lvl 16)
- **Enemy types**: All 4 types, heavy usage, fast spawns

## World Theme Data Structure
```javascript
const WORLD_THEMES = {
    forest: {
        name: 'Greenwood',
        skyTop: '#4A90D9',
        skyBottom: '#87CEEB',
        grass: '#5B8C2A',
        grassLight: '#7EC850',
        dirt: '#8B6914',
        dirtLight: '#B8860B',
        pathDark: '#C4A35A',
        pathLight: '#DCC07E',
        castleWall: '#A9A9A9',
        caveFrame: '#555555',
    },
    desert: {
        name: 'Sandstone',
        skyTop: '#D4943A',
        skyBottom: '#F0C878',
        grass: '#D4A65A',
        grassLight: '#E0BE7A',
        dirt: '#B8893A',
        dirtLight: '#CCA050',
        pathDark: '#C46A3A',
        pathLight: '#D4845A',
        castleWall: '#C4A060',
        caveFrame: '#8B6B3A',
    },
    snow: {
        name: 'Frostpeak',
        skyTop: '#B0C8E0',
        skyBottom: '#D8E8F4',
        grass: '#C8D8E8',
        grassLight: '#E0E8F0',
        dirt: '#A0B0C0',
        dirtLight: '#B8C8D8',
        pathDark: '#8BB0D0',
        pathLight: '#A8C8E0',
        castleWall: '#C0D0E0',
        caveFrame: '#7090A8',
    },
    lava: {
        name: 'Netherforge',
        skyTop: '#1A0A0A',
        skyBottom: '#4A1A0A',
        grass: '#3A3A3A',
        grassLight: '#4A4A4A',
        dirt: '#2A2A2A',
        dirtLight: '#3A3030',
        pathDark: '#CC4400',
        pathLight: '#DD6620',
        castleWall: '#555555',
        caveFrame: '#331100',
    },
};
```

## Level Restructure (14 → 16 levels)

Remap existing 14 levels into 4 worlds and add 2 new levels:

| World | Level | Name | Letters | Path | Notes |
|---|---|---|---|---|---|
| Forest 1 | 1 | Home Start | F, J | Long winding | Walkers only |
| Forest 2 | 2 | Home Expand | F, J, D, K | Long winding | Walkers only |
| Forest 3 | 3 | Quick Fingers | F, J, D, K | Medium two-turn | Introduce Sprinters |
| Forest 4 | 4 | Forest Master | F, J, D, K | Short direct | Sprinters + Walkers mixed |
| Desert 1 | 5 | Home Neighbors | S, L + review | Long winding | Walkers, Sprinters |
| Desert 2 | 6 | Tough Letters | All home - A | Long winding | Introduce Tanks |
| Desert 3 | 7 | Home Row | A + all home | Medium two-turn | All 3 types |
| Desert 4 | 8 | Desert Storm | All home row | Short direct | Introduce Swarms, all types |
| Snow 1 | 9 | Reaching Up | R, U | Long winding | Walkers, Sprinters |
| Snow 2 | 10 | Climbing Higher | E, I | Medium two-turn | All types |
| Snow 3 | 11 | Almost There | W, O | Medium two-turn | All types |
| Snow 4 | 12 | Frostpeak Master | Top row + home mix | Zigzag | All types, heavy |
| Lava 1 | 13 | Pinky Stretch | Q, P | Short direct | All types |
| Lava 2 | 14 | Top Row Master | All top + home | Zigzag | All types heavy |
| Lava 3 | 15 | Fire Gauntlet | Full keyboard mix | Straight rush | All types, fast | NEW
| Lava 4 | 16 | Final Stand | Full keyboard | Short direct | Everything, hardest | NEW (replaces old 14)

## World Map Screen (Mario-Style)

### Layout
- Replace the current level select grid with a world map
- Map shows a path winding through 4 world zones arranged left-to-right
- Each world zone has its own background color/theme
- 4 level nodes per world, connected by a dotted path line
- Player's current position marked with a bouncing character icon

### Visual Design
- **Background**: Horizontally scrolling map showing all 4 worlds side by side
  - Left: green forest area
  - Center-left: sandy desert area
  - Center-right: white snowy area
  - Right: dark red lava area
- **Level nodes**: Circular Minecraft-style blocks
  - Completed: filled with world color + star count shown
  - Current/unlocked: bright, pulsing glow
  - Locked: dark gray with lock icon
- **Path between nodes**: Dotted line in world's accent color
- **World labels**: "GREENWOOD", "SANDSTONE", "FROSTPEAK", "NETHERFORGE" above each section
- **World borders**: Subtle gradient transitions between world zones

### Navigation
- Click/tap a level node to start that level
- Arrow keys or swipe to scroll the map left/right if it doesn't all fit
- Back button returns to main menu

### Unlock Rules
- World 1, Level 1 always unlocked
- Each level unlocks when previous level has ≥1 star
- World 2 unlocks when Forest Level 4 completed
- World 3 unlocks when Desert Level 8 completed
- World 4 unlocks when Snow Level 12 completed

## Grid Rendering Changes

### Per-World Tile Colors
- `Grid.render()` must use the current level's world theme colors instead of hardcoded COLORS
- Pass the theme to Grid or have Grid read it from a global
- The off-screen grid cache still works — just cache with different colors per level

### Per-World Decorations
Each world adds decorations rendered on top of the grid:
- **Forest**: Blocky trees (brown trunk + green top) placed randomly on non-path tiles
- **Desert**: Blocky cacti (green pillars), sand dune bumps, small brown rocks
- **Snow**: Snow-covered trees (white tops), ice crystals, falling snowflakes (animated)
- **Lava**: Lava pools on some tiles (animated orange glow), fire particle emitters, cracked ground texture

### Per-World Sky Gradient
Each world uses its own sky gradient colors instead of the default blue.

### Per-World Cave + Castle
- Cave and castle keep same shape but use the world's color palette
- Lava world: cave has lava drip, castle is dark obsidian with glowing windows
- Snow world: castle has snow on roof, cave has icicles
- Desert world: castle is sandstone colored, cave is darker sand

## File Changes
- **js/utils.js**: Add WORLD_THEMES constant, add world index to each level definition
- **js/progression.js**: Restructure LEVELS array to 16 levels with world property, adjust level definitions
- **js/grid.js**: Accept theme parameter, use theme colors for tile rendering and decoration
- **js/engine.js**: Replace level select rendering with world map rendering, handle scrolling/navigation
- **js/path.js**: Use theme colors for cave and castle rendering
- **js/modes/letterMarch.js**: Pass world theme when initializing grid

## Power Unlock Adjustments (16 levels)
| Power | Level |
|---|---|
| Fireball | 3 |
| Shield | 5 |
| Slow Clock | 7 |
| Blizzard | 9 |
| Dragon | 12 |
| Lava Moat | 15 |

## Acceptance Criteria
1. World map shows 4 themed zones with dotted paths connecting 16 level nodes
2. Each world has distinct tile colors, sky gradient, and decorations
3. Forest = green/trees, Desert = sandy/cacti, Snow = white/ice, Lava = dark red/fire
4. 16 levels playable with proper progression and unlock flow
5. World transitions on map are smooth gradient blends
6. Level nodes show stars and completion state
7. Scrollable map navigation works with click/tap and arrow keys
8. Old save data (14 levels) is handled gracefully
9. Grid caching works with per-world colors
10. Snow world has falling snowflakes, Lava world has fire particles
11. Performance stays at 60fps with world decorations

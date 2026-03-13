# Phase 2c: Super Powers — Detailed Build Plan

## Overview
Add 6 collectible power-ups that drop from destroyed enemies. Powers are collected by typing a letter on the pickup. Spacebar activates, Alt rotates selection. Powers unlock at level milestones.

## Power-Up Drop System

### Task 2c.1: Pickup Spawning
- When any enemy is destroyed, there's a ~15-20% random chance to drop a power-up pickup
- Pickups only drop if the player has unlocked at least one power (Level 3+)
- The dropped pickup lands where the enemy died and sits on the map
- Pickup shows a glowing colored block bouncing gently (bob animation) with a letter on it
- The letter is randomly chosen from the current level's letter pool
- Player must type that letter to collect the pickup (reinforces typing!)
- If not collected within 5 seconds, the pickup fades out and disappears
- Max 1 pickup on screen at a time (don't clutter the field)

### Task 2c.2: Pickup Rendering
- Each power type has a distinct color:
  - Fireball: Orange (#FF6600)
  - Shield: Cyan (#00CCCC)
  - Slow Clock: Light Blue (#6699FF)
  - Blizzard: Ice White (#CCDDFF)
  - Lava Moat: Red-Orange (#FF3300)
  - Dragon: Gold (#FFD700)
- Pickup visual: colored block (same size as a swarm unit ~0.5 tile) with a subtle glow effect (expanding/contracting semi-transparent ring around it)
- Letter displayed on the pickup in white, same style as enemy letters
- Small icon or symbol above the pickup indicating which power it is
- When fading (last 1.5 seconds of its life), the pickup blinks

### Task 2c.3: Pickup Collection
- When the player types the letter shown on the pickup, it's collected
- Collection animation: pickup flies toward the power inventory area (bottom-left) and shrinks
- The power is added to the player's inventory
- If inventory is full (max 3), the oldest power is replaced (or pickup can't be collected — player's choice; recommend replacing oldest)
- Which power type drops is random from the player's unlocked powers

### Task 2c.4: Power Inventory UI
- Display at the bottom-left of the game area (above the keyboard, left side)
- Show up to 3 slots as small colored blocks
- The currently selected power has a bright border/highlight
- Each slot shows the power's icon and a small label
- Empty slots shown as dark outlines
- Alt key (keyboard) or a small rotate button on screen (touch) cycles selection
- Spacebar (keyboard) or a big "USE" button on screen (touch) activates

### Task 2c.5: Power Activation System
- When Spacebar is pressed (or USE tapped), the selected power activates
- The power is consumed (removed from inventory, slot empties)
- Each power has its own activation animation and effect
- Only one power can be used per wave (after use, remaining powers are grayed out until next wave)
- Power use tracked for star rating consideration (future, not blocking)

## The 6 Powers

### Power 1: Fireball (Unlocks Level 3)
**Effect**: Destroys the enemy closest to the castle (furthest along the path)
**Animation**: 
- A fireball (orange/yellow block with trailing particles) launches from the bottom of the screen
- Flies toward the target enemy in an arc
- On impact: large orange particle explosion, enemy destroyed
- Duration: instant (0.5s animation)
**Implementation**: Find alive enemy with highest pathProgress, destroy it, spawn fire particles

### Power 2: Shield (Unlocks Level 5)
**Effect**: Blocks the next enemy that reaches the castle
**Animation**:
- A glowing cyan barrier appears at the castle entrance
- Barrier is a translucent blocky wall that shimmers
- When an enemy hits it: barrier flashes, enemy destroyed with cyan particles, barrier disappears
- If no enemy hits it within 10 seconds, barrier fades
**Implementation**: Set a flag `shieldActive`. In enemy reach-base logic, if shield is active, destroy enemy instead of losing heart. Clear flag after one block.

### Power 3: Slow Clock (Unlocks Level 7)
**Effect**: All enemies move at half speed for 5 seconds
**Animation**:
- A clock icon appears center-screen briefly
- All enemies get a blue tint overlay while slowed
- A progress bar or timer shows the remaining duration
- When it ends, enemies flash briefly and return to normal speed
**Implementation**: Set `slowActive = true` with a timer. In enemy update, multiply speed by 0.5 while active. Render blue tint on slowed enemies.

### Power 4: Blizzard (Unlocks Level 9)
**Effect**: Freezes all on-screen enemies in place for 4 seconds
**Animation**:
- Ice crystal particles fall from top of screen
- All enemies stop moving and get a white/ice overlay
- Small ice block particles appear on frozen enemies
- When it ends, enemies crack free (small particle burst) and resume
**Implementation**: Set `freezeActive = true` with timer. In enemy update, skip movement while frozen. Render ice overlay on frozen enemies.

### Power 5: Lava Moat (Unlocks Level 12)
**Effect**: A lava pool appears in front of the castle for 3 seconds, destroying enemies that walk into it
**Animation**:
- Lava bubbles up from the ground at ~85-95% of the path
- Glowing red-orange pool with animated bubbles
- Enemies that enter the zone sink and are destroyed with fire particles
- After 3 seconds, lava recedes
**Implementation**: Define a path zone (0.85 to 0.95). While active, any enemy entering that zone is destroyed. Render lava tiles in that zone.

### Power 6: Dragon (Unlocks Level 15)
**Effect**: A dragon sweeps across 1/3 of the path, destroying everything in that zone
**Animation**:
- A blocky Minecraft-style dragon (green/black) flies across the screen from left to right
- Fire breath (orange/red particle stream) covers a section of the path
- All enemies in that 1/3 section are destroyed with fire particles
- Dragon exits screen after sweep
**Duration**: ~2 seconds for the sweep animation
**Implementation**: Pick a random 1/3 section of the path (0.0-0.33, 0.33-0.66, or 0.66-1.0). Destroy all enemies in that range. Animate dragon sprite flying across.

## Power Unlock Levels
```javascript
const POWER_UNLOCKS = {
    fireball:   3,   // Level 3
    shield:     5,   // Level 5
    slowClock:  7,   // Level 7
    blizzard:   9,   // Level 9
    lavaMoat:   12,  // Level 12
    dragon:     15,  // Level 15 (future — beyond current 14 levels)
};
```
Note: Dragon unlocks at Level 15 which doesn't exist yet. It won't be available in current gameplay but the code should be ready for when levels expand.

## File Changes
- **js/utils.js**: Add POWER_UNLOCKS config, power type definitions with colors/names
- **js/powers.js**: NEW FILE — Power system: pickup spawning, inventory, activation, individual power effects, animations
- **js/modes/letterMarch.js**: Integrate power system into update/render loop, handle pickup collection via typing, Spacebar/Alt input
- **js/engine.js**: Add Spacebar and Alt key detection, add power inventory rendering, add touch buttons for USE/ROTATE
- **js/enemies.js**: Check for shield/lava/freeze/slow effects during update
- **index.html**: Add script tag for powers.js

## Touch Controls for Powers
- Small "USE" button at bottom-left (next to power inventory) — activates selected power
- Small rotate arrow button next to USE — cycles to next power
- Both buttons styled like the Shift key (rounded rectangles, clear labels)

## Acceptance Criteria
1. Pickups drop randomly (~15-20%) from destroyed enemies on Level 3+
2. Pickups show a letter that must be typed to collect
3. Pickups fade and disappear after 5 seconds if not collected
4. Power inventory shows up to 3 stored powers
5. Alt cycles selection, Spacebar activates
6. Touch USE/ROTATE buttons work on tablets
7. Each of the 6 powers has correct effect and animation
8. Only one power use per wave
9. Powers only drop for types the player has unlocked
10. All existing features (scoring, combos, timer, etc.) continue working
11. Smooth 60fps even during power animations

## Status: COMPLETE

### Implementation Notes
- Created `js/powers.js` (905 lines) — complete power system module
- All 6 powers implemented with distinct activation animations and effects
- Pickup system: ~18% drop chance, letter collection from level pool, 5s lifetime with blink
- Inventory: 3 slots, Alt/rotate cycles, Spacebar/USE activates, one use per wave
- Touch: USE and ROTATE buttons rendered next to inventory slots
- Enemy integration: speed multiplier (slow/freeze), shield check at castle, lava zone kills
- Dragon code ready for Level 15 (unlock check uses highest level reached from save data)
- All effects use blocky square particles — no curves

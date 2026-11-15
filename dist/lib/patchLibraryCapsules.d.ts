/**
 * Library capsule patching - adds a small tag badge to every game tile.
 *
 * ProtonDB Badges (v1.3.x, src/patches/LibraryGridPatch.ts) does this by
 * polling the Big Picture DOM every 1-3s for the grid's hashed
 * `Draggable` class, reading the appid from the capsule <img> src and
 * appending a plain DOM node. That only covers the library grid and costs
 * a full DOM scan per second.
 *
 * We hook the same tiles one level up, at the React component Steam uses
 * for *every* game capsule item (library tabs/grids, collections, Home
 * shelves incl. the large "current game" tile). It's found through
 * webpack by a stable prototype method of the portrait capsule image
 * class it renders (`OnVerticalCapsuleLoad`), and patched with
 * `afterPatch` + `findInReactTree` like our game page patch. The tile's
 * `app` overview prop gives us the appid directly (Steam + non-Steam).
 * Badges are React children of the tile, so they mount/unmount with
 * Steam's virtualized lists - no polling, no DOM scans.
 */
/**
 * Returns a cleanup function, or null if the capsule component couldn't be
 * found (e.g. after a Steam UI update) - in which case nothing is patched.
 */
export declare function patchLibraryCapsules(): (() => void) | null;

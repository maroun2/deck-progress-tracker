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

import { afterPatch, findInReactTree, findModuleDetailsByExport } from '@decky/ui';
import React from 'react';
import { LibraryTileBadge, removeLibraryBadgeStylesheets } from '../components/LibraryTileBadge';

const BADGE_KEY = 'dpt-library-badge';
const REACT_MEMO = Symbol.for('react.memo');

/** Steam's capsule image classes (portrait `OnVerticalCapsuleLoad`, landscape `OnLandscapeImageLoaded`) both expose `GetAssetImage`. */
function isCapsuleImageElement(el: any): boolean {
  const proto = el?.type?.prototype;
  return !!proto && typeof proto.GetAssetImage === 'function' && typeof proto.render === 'function';
}

function findCapsuleItemComponent(): any | null {
  try {
    const [module] = findModuleDetailsByExport(
      (e: any) => typeof e === 'function' && !!e?.prototype?.OnVerticalCapsuleLoad
    );
    if (!module) return null;
    // The capsule item itself is the (only) React.memo export of that
    // module; it renders either the portrait or the landscape image class.
    const memos = Object.values(module).filter(
      (e: any) => e && e.$$typeof === REACT_MEMO && typeof e.type === 'function'
    );
    return memos.length === 1 ? memos[0] : null;
  } catch (e) {
    return null;
  }
}

/**
 * Returns a cleanup function, or null if the capsule component couldn't be
 * found (e.g. after a Steam UI update) - in which case nothing is patched.
 */
export function patchLibraryCapsules(): (() => void) | null {
  const capsuleItem = findCapsuleItemComponent();
  if (!capsuleItem) {
    return null;
  }

  const patch = afterPatch(capsuleItem, 'type', (args: any[], ret: any) => {
    try {
      // Injected even when the position is 'none': the badge then renders
      // nothing, but switching the setting back on applies live to tiles
      // that are already on screen instead of only after a remount.
      const appid = args?.[0]?.app?.appid;
      if (appid === undefined || appid === null) return ret;

      // The array holding the capsule image element; its DOM parent is the
      // tile box (position: relative), so our absolutely positioned badge
      // lands on the artwork and follows Steam's focus scale animation.
      const container = findInReactTree(
        ret,
        (x: any) => Array.isArray(x?.props?.children) && x.props.children.some(isCapsuleImageElement)
      );
      if (!container || container.props.children.some((c: any) => c?.key === BADGE_KEY)) {
        return ret;
      }

      container.props.children.push(<LibraryTileBadge key={BADGE_KEY} appid={String(appid)} />);
    } catch (e) {
      // Never break Steam's library rendering
    }
    return ret;
  });

  return () => {
    try {
      patch.unpatch();
    } catch (e) {
      // ignore
    }
    removeLibraryBadgeStylesheets();
  };
}

/**
 * LibraryTileBadge
 * Small icon-only tag badge drawn on top of a game capsule wherever Steam
 * lists games (library grid/tabs, collections, Home shelves).
 *
 * Injected by src/lib/patchLibraryCapsules.tsx. Reads everything from the
 * shared cache in libraryBadgeStore - never calls the backend per tile.
 */

import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TagIcon } from './TagIcon';
import { TAG_STYLES } from './GameTag';
import { getLibraryBadgeState, refreshTagsIfStale, subscribeLibraryBadges } from '../lib/libraryBadgeStore';
import { CustomizableTagType, TAG_COLOR_SETTING_KEY } from '../lib/tagCustomization';
import { LibraryBadgePosition } from '../types';

export const LIBRARY_BADGE_CLASS = 'dpt-library-badge';
const STYLE_ELEMENT_ID = 'dpt-library-badge-style';

// Mirrors ProtonDB Badges' library dot (24px incl. padding, 4px inset) so
// the two plugins look consistent next to each other.
const BADGE_SIZE = 24;
const BADGE_INSET = 6;
const ICON_SIZE = 14;
// ProtonDB Badges' grid dot occupies 4px..28px from its corner. When it sits
// in the same corner as ours, step ours inward horizontally past it.
const PROTONDB_DOT = '.protondb-grid-dot';
const NUDGED_INSET = 32;

const CORNERS: Record<Exclude<LibraryBadgePosition, 'none'>, { v: 'top' | 'bottom'; h: 'left' | 'right' }> = {
  'top-left': { v: 'top', h: 'left' },
  'top-right': { v: 'top', h: 'right' },
  'bottom-left': { v: 'bottom', h: 'left' },
  'bottom-right': { v: 'bottom', h: 'right' },
};

function buildStylesheet(): string {
  const rules = [
    `.${LIBRARY_BADGE_CLASS}{position:absolute;z-index:5;width:${BADGE_SIZE}px;height:${BADGE_SIZE}px;` +
      'box-sizing:border-box;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
      'pointer-events:none;box-shadow:0 1px 4px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.35);}',
  ];
  (Object.keys(CORNERS) as Array<keyof typeof CORNERS>).forEach((pos) => {
    const { v, h } = CORNERS[pos];
    const sel = `.${LIBRARY_BADGE_CLASS}[data-pos="${pos}"]`;
    rules.push(`${sel}{${v}:${BADGE_INSET}px;${h}:${BADGE_INSET}px;}`);
    // ProtonDB sets its dot position via inline style, e.g. "top: 4px; right: 4px;".
    // Its dot can end up before or after ours in the DOM, so match both orders.
    const dot = `${PROTONDB_DOT}[style*="${v}: 4px"][style*="${h}: 4px"]`;
    rules.push(`${sel}:has(~ ${dot}), ${dot} ~ ${sel}{${h}:${NUDGED_INSET}px;}`);
  });
  return rules.join('\n');
}

const styledDocuments = new Set<Document>();

/**
 * The capsules live in Steam's Big Picture window document, not in the
 * plugin's own JS context, so the stylesheet is injected into whichever
 * document a badge actually renders in (once per document).
 */
function ensureStylesheet(doc: Document | null | undefined) {
  if (!doc || styledDocuments.has(doc)) return;
  try {
    if (!doc.getElementById(STYLE_ELEMENT_ID)) {
      const style = doc.createElement('style');
      style.id = STYLE_ELEMENT_ID;
      style.textContent = buildStylesheet();
      (doc.head || doc.documentElement).appendChild(style);
    }
    styledDocuments.add(doc);
  } catch (e) {
    // Never break Steam's UI over a stylesheet
  }
}

export function removeLibraryBadgeStylesheets() {
  styledDocuments.forEach((doc) => {
    try {
      doc.getElementById(STYLE_ELEMENT_ID)?.remove();
    } catch (e) {
      // Window may already be gone
    }
  });
  styledDocuments.clear();
}

interface Derived {
  position: LibraryBadgePosition;
  tag: CustomizableTagType | null;
  background: string;
}

function derive(appid: string): Derived {
  const { position, tags, colors } = getLibraryBadgeState();
  const tag = tags[appid] || null;
  let background = '';
  if (tag) {
    const custom = colors[TAG_COLOR_SETTING_KEY[tag]];
    // Same colour logic as the game page badge: custom colour if the user
    // picked one, otherwise the default tag gradient.
    background = custom && custom.trim() ? custom.trim() : (TAG_STYLES[tag]?.background || '#555');
  }
  return { position, tag, background };
}

function sameDerived(a: Derived, b: Derived) {
  return a.position === b.position && a.tag === b.tag && a.background === b.background;
}

export const LibraryTileBadge: FC<{ appid: string }> = ({ appid }) => {
  const [badge, setBadge] = useState<Derived>(() => derive(appid));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => setBadge((prev) => {
      const next = derive(appid);
      return sameDerived(prev, next) ? prev : next;
    });
    update();
    const unsubscribe = subscribeLibraryBadges(update);
    refreshTagsIfStale();
    return unsubscribe;
  }, [appid]);

  const visible = badge.position !== 'none' && !!badge.tag;

  useLayoutEffect(() => {
    if (visible) ensureStylesheet(ref.current?.ownerDocument);
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={LIBRARY_BADGE_CLASS}
      data-pos={badge.position}
      data-tag={badge.tag!}
      style={{ background: badge.background }}
    >
      <TagIcon type={badge.tag} size={ICON_SIZE} color="white" />
    </div>
  );
};

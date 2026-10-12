/**
 * GameTagBadge Component
 * Wrapper component for displaying game tag on library app page
 * Designed to be injected via safe route patching
 * Uses same positioning pattern as ProtonDB Badges
 */

import React, { useState, useEffect, useLayoutEffect, useRef, FC } from 'react';
import { call } from '@decky/api';
import { appDetailsClasses, appDetailsHeaderClasses, Button } from '@decky/ui';
import { TAG_STYLES } from './GameTag';
import { TagIcon } from './TagIcon';
import { CustomizableTagType, TAG_COLOR_SETTING_KEY, resolveTagLabel, resolveTagColor } from '../lib/tagCustomization';
import { TagManager } from './TagManager';
import { useGameTag } from '../hooks/useGameTag';
import { syncSingleGameWithFrontendData } from '../lib/syncUtils';
import { PluginSettings, BADGE_SETTINGS_UPDATED_EVENT } from '../types';
import { useTranslation } from '../i18n';

const DEFAULT_BADGE_POSITION: Pick<PluginSettings, 'badge_position_h' | 'badge_position_v' | 'badge_overlap_offset'> = {
  badge_position_h: 'right',
  badge_position_v: 'top',
  badge_overlap_offset: 0,
};

// Approx rendered height of the badge/"Add Tag" button, used to keep
// bottom/center vertical placements fully inside the visible banner area.
const APPROX_BADGE_HEIGHT = 44;

function buildContainerStyle(
  h: PluginSettings['badge_position_h'],
  v: PluginSettings['badge_position_v'],
  bannerHeight: number | null,
  overlapOffset: number
): React.CSSProperties {
  const style: React.CSSProperties = { position: 'absolute', zIndex: 10 };

  if (h === 'center') {
    style.left = '50%';
    style.transform = 'translateX(-50%)';
  } else {
    style[h] = '20px';
  }

  // The badge's positioning context is the whole (tall, scrollable) page
  // container, not just the banner — so 'bottom'/'center' can't use CSS
  // bottom/top:50% directly (that would anchor to the full page height).
  // Instead, anchor everything from 'top' using the banner's measured
  // pixel height so the badge stays inside the visible banner area.
  if (v === 'top' || bannerHeight == null) {
    // bannerHeight not measured yet: fall back to the plain top offset
    // (no overlap nudge) only when v isn't actually 'top'.
    style.top = v === 'top' ? `${50 + overlapOffset}px` : '50px';
  } else if (v === 'center') {
    style.top = `${Math.max(bannerHeight / 2 - APPROX_BADGE_HEIGHT / 2 + overlapOffset, 0)}px`;
  } else {
    style.top = `${Math.max(bannerHeight - APPROX_BADGE_HEIGHT - 20 - overlapOffset, 0)}px`;
  }

  return style;
}

/**
 * Find the Header (banner) element by walking up the DOM tree from our
 * wrapper's sibling position inside InnerContainer.
 */
function findHeaderElement(ref: HTMLDivElement | null): Element | null {
  const siblings = ref?.parentElement?.children;
  if (!siblings) {
    return null;
  }

  for (const child of siblings) {
    if (child.className.includes(appDetailsClasses.Header)) {
      return child;
    }
  }

  return null;
}

/**
 * Find the TopCapsule element within the Header.
 * Same pattern used by ProtonDB Badges.
 */
function findTopCapsuleParent(ref: HTMLDivElement | null): Element | null {
  const headerContainer = findHeaderElement(ref);
  if (!headerContainer) {
    return null;
  }

  for (const child of headerContainer.children) {
    if (child.className.includes(appDetailsHeaderClasses.TopCapsule)) {
      return child;
    }
  }

  return null;
}

// Visual style shared by the Button itself (not an inner div) so the
// gamepad focus ring matches the badge's actual rounded shape.
const BADGE_BORDER_RADIUS = '20px';

const NO_TAG_STYLE = {
  background: 'rgba(50, 50, 50, 0.9)',
  color: '#aaa',
  border: '1px dashed #666',
};

const EMPTY_TAG_CUSTOMIZATION: Pick<
  PluginSettings,
  'tag_label_mastered' | 'tag_label_completed' | 'tag_label_in_progress' | 'tag_label_dropped' |
  'tag_color_mastered' | 'tag_color_completed' | 'tag_color_in_progress' | 'tag_color_dropped'
> = {
  tag_label_mastered: '', tag_label_completed: '', tag_label_in_progress: '', tag_label_dropped: '',
  tag_color_mastered: '', tag_color_completed: '', tag_color_in_progress: '', tag_color_dropped: '',
};

interface GameTagBadgeProps {
  appid: string;
}

/**
 * GameTagBadge - Main component injected into library app page
 * Shows tag badge or "Add Tag" button, with TagManager modal
 * Position is configurable via plugin settings (defaults to top-right,
 * opposite side from ProtonDB's default top-left)
 */
export const GameTagBadge: FC<GameTagBadgeProps> = ({ appid }) => {
  const { t } = useTranslation();
  const { tag, loading, error, refetch } = useGameTag(appid);
  const [showManager, setShowManager] = useState(false);
  const [show, setShow] = useState(true);
  const [position, setPosition] = useState(DEFAULT_BADGE_POSITION);
  const [tagCustomization, setTagCustomization] = useState(EMPTY_TAG_CUSTOMIZATION);
  const [bannerHeight, setBannerHeight] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const headerElement = findHeaderElement(ref.current);
    if (headerElement) {
      setBannerHeight((headerElement as HTMLElement).getBoundingClientRect().height);
    }
  }, [loading]);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const result = await call<[], { settings: PluginSettings }>('get_settings');
        if (result.settings) {
          setPosition({
            badge_position_h: result.settings.badge_position_h || DEFAULT_BADGE_POSITION.badge_position_h,
            badge_position_v: result.settings.badge_position_v || DEFAULT_BADGE_POSITION.badge_position_v,
            badge_overlap_offset: result.settings.badge_overlap_offset ?? DEFAULT_BADGE_POSITION.badge_overlap_offset,
          });
          setTagCustomization({
            tag_label_mastered: result.settings.tag_label_mastered || '',
            tag_label_completed: result.settings.tag_label_completed || '',
            tag_label_in_progress: result.settings.tag_label_in_progress || '',
            tag_label_dropped: result.settings.tag_label_dropped || '',
            tag_color_mastered: result.settings.tag_color_mastered || '',
            tag_color_completed: result.settings.tag_color_completed || '',
            tag_color_in_progress: result.settings.tag_color_in_progress || '',
            tag_color_dropped: result.settings.tag_color_dropped || '',
          });
        }
      } catch (e) {
        // Keep default position on failure
      }
    };

    fetchPosition();

    window.addEventListener(BADGE_SETTINGS_UPDATED_EVENT, fetchPosition);
    return () => window.removeEventListener(BADGE_SETTINGS_UPDATED_EVENT, fetchPosition);
  }, []);

  useEffect(() => {
    // Sync this game's data when detail page is viewed
    // This ensures we have the latest playtime and achievement data
    (async () => {
      try {
        const result = await syncSingleGameWithFrontendData(appid);
        if (result.success) {
          refetch();
        }
      } catch (e) {
        // Error syncing game
      }
    })();
  }, [appid]);

  // Watch for fullscreen mode changes (same pattern as ProtonDB)
  useEffect(() => {
    const topCapsule = findTopCapsuleParent(ref?.current);
    if (!topCapsule) {
      return;
    }

    const mutationObserver = new MutationObserver((entries) => {
      for (const entry of entries) {
        if (entry.type !== 'attributes' || entry.attributeName !== 'class') {
          continue;
        }

        const className = (entry.target as Element).className;
        const fullscreenMode =
          className.includes(appDetailsHeaderClasses.FullscreenEnterStart) ||
          className.includes(appDetailsHeaderClasses.FullscreenEnterActive) ||
          className.includes(appDetailsHeaderClasses.FullscreenEnterDone) ||
          className.includes(appDetailsHeaderClasses.FullscreenExitStart) ||
          className.includes(appDetailsHeaderClasses.FullscreenExitActive);
        const fullscreenAborted =
          className.includes(appDetailsHeaderClasses.FullscreenExitDone);

        setShow(!fullscreenMode || fullscreenAborted);
      }
    });

    mutationObserver.observe(topCapsule, { attributes: true, attributeFilter: ['class'] });
    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  if (loading) {
    return <div ref={ref} style={{ display: 'none' }} />;
  }

  const handleClick = () => {
    setShowManager(true);
  };

  const handleClose = () => {
    setShowManager(false);
    refetch();
  };

  const containerStyle = buildContainerStyle(position.badge_position_h, position.badge_position_v, bannerHeight, position.badge_overlap_offset);
  const tagType = tag && tag.tag ? (tag.tag as CustomizableTagType) : null;
  const tagStyle = tagType ? TAG_STYLES[tagType] : null;
  const customColor = tagType ? resolveTagColor(tagType, tagCustomization) : null;
  const hasCustomColor = tagType ? !!(tagCustomization as Record<string, string>)[TAG_COLOR_SETTING_KEY[tagType]] : false;
  const tooltip = tagStyle
    ? tag?.is_manual ? t('badge.manualTagEdit') : t('badge.autoTagEdit')
    : t('badge.clickToAddTag');

  return (
    <>
      <div ref={ref} style={containerStyle}>
        {show && (
          <Button
            onClick={handleClick}
            {...({ title: tooltip } as object)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: BADGE_BORDER_RADIUS,
              fontSize: '14px',
              fontWeight: 'bold',
              color: tagStyle ? 'white' : NO_TAG_STYLE.color,
              background: tagStyle ? (hasCustomColor ? customColor! : tagStyle.background) : NO_TAG_STYLE.background,
              border: tagStyle ? 'none' : NO_TAG_STYLE.border,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              minWidth: 'auto',
            }}
          >
            {tagStyle && tagType ? (
              <>
                <TagIcon type={tagType} size={18} color="white" />
                <span>{resolveTagLabel(tagType, tagCustomization, t)}</span>
                {tag?.is_manual && <span style={{ fontSize: '12px', opacity: 0.8 }}>✎</span>}
              </>
            ) : (
              <>
                <span style={{ fontSize: '16px' }}>+</span>
                <span>{t('badge.addTag')}</span>
              </>
            )}
          </Button>
        )}
      </div>
      {/* Rendered outside the (possibly transform: translate(...)) positioned
          wrapper above: a `transform` on an ancestor makes it the containing
          block for `position: fixed` descendants, which would shrink this
          modal's overlay down to the badge's own box instead of the viewport. */}
      {show && showManager && (
        <TagManager appid={appid} onClose={handleClose} />
      )}
    </>
  );
};

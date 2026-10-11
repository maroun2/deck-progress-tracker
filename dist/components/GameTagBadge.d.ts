/**
 * GameTagBadge Component
 * Wrapper component for displaying game tag on library app page
 * Designed to be injected via safe route patching
 * Uses same positioning pattern as ProtonDB Badges
 */
import { FC } from 'react';
interface GameTagBadgeProps {
    appid: string;
}
/**
 * GameTagBadge - Main component injected into library app page
 * Shows tag badge or "Add Tag" button, with TagManager modal
 * Position is configurable via plugin settings (defaults to top-right,
 * opposite side from ProtonDB's default top-left)
 */
export declare const GameTagBadge: FC<GameTagBadgeProps>;
export {};

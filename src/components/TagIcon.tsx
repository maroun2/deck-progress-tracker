import React, { FC } from 'react';

export type TagType = 'mastered' | 'completed' | 'in_progress' | 'backlog' | 'dropped' | null;

interface TagIconProps {
  type: TagType;
  size?: number;
  className?: string;
}

// Tag colors matching the existing theme
export const TAG_ICON_COLORS = {
  mastered: '#f5576c',
  completed: '#38ef7d',
  in_progress: '#764ba2',
  backlog: '#888',
  dropped: '#c9a171',  // Beige/tan color for dropped games
};

/**
 * Trophy icon for Mastered (100% achievements)
 */
const TrophyIcon: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 17c-1.1 0-2-.9-2-2v-1h4v1c0 1.1-.9 2-2 2z"
      fill={color}
    />
    <path
      d="M17 4h-1V3c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H7c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V17H9c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1h-1.5v-2.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 11.63 21 9.55 21 7V6c0-1.1-.9-2-2-2h-2zm-10 3V6h2v3c0 1.48.81 2.77 2 3.46-.43-.09-.87-.16-1.31-.27C7.36 11.36 5 9.42 5 7zm14 0c0 2.42-2.36 4.36-4.69 5.19-.44.11-.88.18-1.31.27 1.19-.69 2-1.98 2-3.46V6h2v1z"
      fill={color}
    />
  </svg>
);

/**
 * Checkmark in circle for Completed (beat main story)
 */
const CheckCircleIcon: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M8 12l3 3 5-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/**
 * Clock/hourglass icon for In Progress
 */
const ClockIcon: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M12 6v6l4 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/**
 * Empty circle for Backlog (not started)
 */
const EmptyCircleIcon: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

/**
 * X in circle for Dropped (abandoned)
 */
const XCircleIcon: FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M15 9l-6 6M9 9l6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

/**
 * TagIcon component - displays appropriate icon based on tag type
 */
export const TagIcon: FC<TagIconProps> = ({ type, size = 24, className }) => {
  if (!type) return null;

  const color = TAG_ICON_COLORS[type] || TAG_ICON_COLORS.backlog;

  const iconStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <span style={iconStyle} className={className}>
      {type === 'mastered' && <TrophyIcon size={size} color={color} />}
      {type === 'completed' && <CheckCircleIcon size={size} color={color} />}
      {type === 'in_progress' && <ClockIcon size={size} color={color} />}
      {type === 'backlog' && <EmptyCircleIcon size={size} color={color} />}
      {type === 'dropped' && <XCircleIcon size={size} color={color} />}
    </span>
  );
};

export default TagIcon;

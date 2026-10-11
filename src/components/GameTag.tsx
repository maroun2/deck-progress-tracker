/**
 * Shared per-tag styling (background color) used by GameTagBadge.
 */

interface TagStyle {
  background: string;
}

export const TAG_STYLES: Record<string, TagStyle> = {
  completed: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  in_progress: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  mastered: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  dropped: {
    background: 'linear-gradient(135deg, #b8956a 0%, #c9a171 100%)',
  },
};

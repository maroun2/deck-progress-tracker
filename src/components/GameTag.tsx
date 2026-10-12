/**
 * Shared per-tag styling (background color) used by GameTagBadge.
 */

interface TagStyle {
  background: string;
}

// Darkened from the original lighter gradients to meet WCAG 2.1 non-text
// contrast (>=3:1 against the white icon/text drawn on top) - the original
// stops (#38ef7d, #c9a171, #f093fb) were too close to white to read well.
export const TAG_STYLES: Record<string, TagStyle> = {
  completed: {
    background: 'linear-gradient(135deg, #0d7a6f 0%, #1fa85c 100%)',
  },
  in_progress: {
    background: 'linear-gradient(135deg, #5568d3 0%, #5f3d85 100%)',
  },
  mastered: {
    background: 'linear-gradient(135deg, #d6579f 0%, #c23a52 100%)',
  },
  dropped: {
    background: 'linear-gradient(135deg, #8a6a47 0%, #a67f55 100%)',
  },
};

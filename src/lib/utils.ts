import { createCn } from 'cn/config'

/**
 * Class merging aware of the custom tokens in src/styles/globals.css. Without this,
 * `cn('text-h1', 'text-brand-strong')` drops `text-h1` (both look like `text-*`).
 * Register every new custom --text-*, --spacing-*, --container-* or --shadow-* token here.
 * Always import `cn` from '@/lib/utils', never from the 'cn' package directly.
 */
export const cn = createCn({
  extend: {
    theme: {
      text: ['display', 'h1', 'h2', 'h3', 'h4', 'lead', 'eyebrow'],
      spacing: ['section', 'gutter'],
      container: ['site', 'narrow', 'prose-tight'],
      shadow: ['card', 'raised'],
    },
  },
})

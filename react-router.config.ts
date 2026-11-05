import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src',
  // Static deployment: every static route is pre-rendered to HTML at build time.
  // Unknown URLs are served `build/client/__spa-fallback.html` by the host.
  ssr: false,
  prerender: true,
} satisfies Config

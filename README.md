# Kapi Forge

Website for Kapi Forge, a printing and prototyping company in Delhi serving all of India. _Ideas take shape. We make them real._

Release 1 is a frontend-only, pre-rendered React site. Read [`CURSOR.md`](CURSOR.md) before contributing.

```bash
npm install
cp .env.example .env.local   # set VITE_SITE_URL for production builds
npm run dev                  # http://localhost:3000
npm run check                # typecheck, lint, format, tests, build
```

The production build is static: deploy `build/client/` and configure the host to serve `__spa-fallback.html` for unknown paths.

Documentation: [architecture](docs/architecture.md) · [design system](docs/design-system.md) · [future backend integration](docs/future-backend-integration.md)

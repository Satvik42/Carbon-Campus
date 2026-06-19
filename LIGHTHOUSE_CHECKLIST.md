# Carbon Compass - Production Lighthouse Checklist

This checklist focuses on production audit metrics—specifically **Performance**, **Accessibility**, **Best Practices**, and **SEO**—without altering any application UI or business logic.

---

## ⚡ Performance Optimization

### Current Configuration Assessment
* **Next.js Server Tracing**: Next.js automatically bundles and compiles routes statically where possible.
* **Component Motion**: Uses `framer-motion`. The UI queries media configurations and honors `prefers-reduced-motion` to bypass intensive CSS translations.

### Checklist for Production Environment
- [ ] **Image Optimization**: If any static image assets are added in the future, serve them using Next.js `<Image />` or save them as modern formats (e.g. WebP/AVIF).
- [ ] **Next.js Standalone Mode**: Enabled `output: 'standalone'` in `next.config.ts`. This reduces the serving image size, lowering Cloud Run instantiation times (reducing container Cold Starts).
- [ ] **Cache Control Headers**: Ensure static assets inside `/public` and `/_next/static` are served with long-lived caching headers (`Cache-Control: public, max-age=31536000, immutable`). Next.js sets these headers automatically when serving.
- [ ] **Minification**: Next.js compiles code with SWC minification enabled by default. Do not disable this config.

---

## ♿ Accessibility (A11y)

### Existing Implementations
* **Live Regions**: Screen reader announcements (`aria-live="polite"`) notify users of onboarding changes and wizard steps.
* **Keyboard Support**: Onboarding options are focusable and navigatable.
* **Semantic HTML**: Uses semantic structuring tags (`<main>`, `<header>`, `<section>`, `<footer*>`).

### Checklist for Production Environment
- [ ] **Aria labels on Dynamic Buttons**: Ensure that interactive icon-only components (e.g., the Trash button in `assistant.tsx`) maintain descriptive `aria-label` tags. (Currently implemented: `aria-label="Clear chat history"`).
- [ ] **Skip Navigation Link**: Include a hidden skip link at the top of the body (`<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`) to allow keyboard users to bypass header navs.
- [ ] **Contrast Verification**: Maintain WCAG 2.2 AA contrast ratios on background/foreground text elements. Ensure HSL colors map to readable combinations in both light and dark themes.

---

## 🛡️ Best Practices

### Existing Implementations
* **Input Sanitization**: The assistant route validates request bodies using `zod` and strips HTML tags from input text.
* **Privacy-First Data**: All state modifications are stored in IndexedDB via Zustand. No credentials, tokens, or profile fields are sent to server networks.

### Checklist for Production Environment
- [ ] **Telemetry Deactivation**: Set `NEXT_TELEMETRY_DISABLED=1` at build-time and run-time in the `Dockerfile` to prevent extraneous external network requests.
- [ ] **Console Log Stripping**: Ensure diagnostic or debug console logs (`console.log`) are stripped during production compiles. This can be configured in compiler configurations or bundlers (e.g., SWC `dropConsole: true`).
- [ ] **Non-root Container User**: Verify that Docker is running under user `nextjs` rather than `root` to mitigate privilege escalation vulnerability risks.

---

## 🔍 Search Engine Optimization (SEO)

### Existing Implementations
* **Metadata Structure**: Page configurations in `layout.tsx` define page titles, descriptions, viewport scales, and keyword lists.

### Checklist for Production Environment
- [ ] **Canonical URL**: Provide a canonical link header in `layout.tsx` targeting your primary domain (e.g., `<link rel="canonical" href="https://yourdomain.com" />`) to prevent duplicate content indexing.
- [ ] **Descriptive Headings**: Maintain a clean heading hierarchy (`h1` -> `h2` -> `h3`). Ensure there is only exactly one `h1` per page (the site title).
- [ ] **Robots.txt & Sitemap**: Add a production `robots.txt` and `sitemap.xml` inside the `/public` directory to index pages accurately for search engines:
  ```txt
  # public/robots.txt
  User-agent: *
  Allow: /
  
  Sitemap: https://yourdomain.com/sitemap.xml
  ```

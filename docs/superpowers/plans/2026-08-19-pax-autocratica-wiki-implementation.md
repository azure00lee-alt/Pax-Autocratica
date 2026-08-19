# Pax Autocratica Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual, three-page Pax Autocratica fan wiki in Next.js whose page shell, spacing, dark visual system, cards, article typography, and responsive behavior closely follow `vvultimatum.net`.

**Architecture:** Next.js App Router serves locale-prefixed static pages under `/en` and `/zh`; `next-intl` supplies interface translations and locale-aware navigation. Local MDX files provide the authoritative guide metadata and article content, while reusable shell, card, media, and MDX components reproduce the reference layout without copying its source or game content.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 7.0.2, next-intl 4.13.7, next-mdx-remote 6.0.0, gray-matter 4.0.3, Lucide React 1.33.0, Vitest 4.1.11, Testing Library 16.3.2, Playwright 1.62.1, CSS Modules/global CSS.

**Spec:** `docs/superpowers/specs/2026-08-19-pax-autocratica-wiki-design.md`

## Global Constraints

- Implement exactly three completed page types: home, guide index, and Soldiers & Breeding article.
- Support English under `/en` and Simplified Chinese under `/zh`; `/` defaults to `/en` when no supported preference exists.
- Use Pax Autocratica content and official media only; do not copy VV: ULTIMATUM copy, source code, or imagery.
- Preserve the reference site's 64-pixel header, central reading column, right wiki rail, near-black surfaces, subtle borders, pill metadata, rounded cards, and long-form typography.
- Keep the first release static: no database, accounts, live player counts, comments, ratings, or runtime external API.
- Use the favicon files already present in `output/imagegen/favicon_io`.
- Link only to routes that exist; planned guide cards remain non-interactive.
- Build against Node.js 20.9.0 or newer, as required by Next.js 16.3.1.

---

## File Map

### Project foundation

- `package.json`: pinned dependencies and development, build, test, and E2E scripts.
- `tsconfig.json`: strict TypeScript and `@/*` path alias.
- `next.config.ts`: `next-intl` request plugin configuration.
- `eslint.config.mjs`: Next.js core-web-vitals and TypeScript lint rules.
- `vitest.config.ts`: jsdom test environment and alias mapping.
- `vitest.setup.ts`: Testing Library DOM matchers and cleanup.
- `playwright.config.ts`: desktop and mobile route validation against the local production server.

### Routing and localization

- `proxy.ts`: locale detection and `/en` or `/zh` routing.
- `i18n/routing.ts`: supported locales, default locale, and locale prefix policy.
- `i18n/request.ts`: per-request message loading.
- `i18n/navigation.ts`: locale-aware `Link`, `redirect`, `usePathname`, and `useRouter` exports.
- `lib/locale.ts`: pure locale validation and path-switching helpers.
- `messages/en.json`, `messages/zh.json`: shell and page-interface translations.
- `app/layout.tsx`: document-level metadata, fonts, favicon metadata, and global CSS.
- `app/[locale]/layout.tsx`: locale validation, static locale parameters, translation provider, and shared shell.

### Content

- `lib/content.ts`: `GuideFrontmatter`, `GuideDocument`, `getGuide`, and `listGuides`.
- `content/en/guides/soldiers-and-breeding.mdx`: English guide.
- `content/zh/guides/soldiers-and-breeding.mdx`: Chinese guide.
- `components/mdx-components.tsx`: semantic MDX element mapping.
- `components/callout.tsx`: information, warning, and source-note boxes.
- `components/media-card.tsx`: attributed official image card.

### Shared UI

- `components/site-header.tsx`: brand, desktop navigation, locale switcher, and mobile disclosure trigger.
- `components/language-switcher.tsx`: route-preserving locale controls.
- `components/wiki-sidebar.tsx`: current-section navigation and official-game card.
- `components/site-shell.tsx`: reading column plus right rail.
- `components/site-footer.tsx`: disclosure and official links.
- `components/guide-card.tsx`: active and planned guide cards.
- `components/breadcrumb.tsx`: accessible localized page trail.
- `lib/navigation.ts`: localized navigation data with real-route status.
- `app/globals.css`: all theme tokens, layout, typography, interaction, and responsive rules.

### Pages and assets

- `app/[locale]/page.tsx`: localized home page.
- `app/[locale]/guides/page.tsx`: localized guide index.
- `app/[locale]/guides/[slug]/page.tsx`: localized MDX article and metadata.
- `public/media/pax-header.jpg`: official Steam header image.
- `public/media/pax-colony.jpg`: official Steam screenshot used by the guide index.
- `public/media/pax-soldiers.jpg`: official Steam screenshot used by the article.
- `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/android-chrome-192x192.png`, `public/android-chrome-512x512.png`, `public/site.webmanifest`: generated Pax Autocratica favicon package.

### Tests

- `tests/project-assets.test.ts`: dependency scripts and required favicon/media files.
- `tests/locale.test.ts`: locale validation and route-preserving switching.
- `tests/content.test.ts`: bilingual MDX discovery and frontmatter contracts.
- `tests/site-shell.test.tsx`: shared navigation, locale controls, and accessible planned cards.
- `tests/e2e/site.spec.ts`: six localized routes, redirects, language switching, desktop rail, and mobile overflow.

---

### Task 1: Bootstrap the Next.js project and verified assets

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `tests/project-assets.test.ts`
- Copy: `output/imagegen/favicon_io/*` to `public/`
- Download: official Steam assets to `public/media/`

**Interfaces:**
- Consumes: approved design spec and existing `output/imagegen/favicon_io` assets.
- Produces: runnable Next.js project; `pnpm test`, `pnpm build`, and `pnpm dev` scripts; stable public asset paths used by every page.

- [ ] **Step 1: Write the failing project-asset test**

```ts
// tests/project-assets.test.ts
import {existsSync, readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

describe('project foundation', () => {
  it('defines the required scripts', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.scripts).toMatchObject({
      dev: 'next dev',
      build: 'next build',
      test: 'vitest',
      'test:run': 'vitest run',
      'test:e2e': 'playwright test'
    });
  });

  it.each([
    'public/favicon.ico',
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/apple-touch-icon.png',
    'public/media/pax-header.jpg',
    'public/media/pax-colony.jpg',
    'public/media/pax-soldiers.jpg'
  ])('contains %s', (path) => expect(existsSync(path)).toBe(true));
});
```

- [ ] **Step 2: Run the test and verify the foundation is missing**

Run: `pnpm vitest run tests/project-assets.test.ts`

Expected: FAIL because `package.json` and public assets do not exist.

- [ ] **Step 3: Create the pinned project configuration**

```json
{
  "name": "pax-autocratica-wiki",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "gray-matter": "4.0.3",
    "lucide-react": "1.33.0",
    "next": "16.3.1",
    "next-intl": "4.13.7",
    "next-mdx-remote": "6.0.0",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@playwright/test": "1.62.1",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.2",
    "@types/mdx": "2.0.14",
    "@types/node": "26.2.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "@vitejs/plugin-react": "6.0.5",
    "eslint": "10.8.1",
    "eslint-config-next": "16.3.1",
    "jsdom": "30.0.1",
    "typescript": "7.0.2",
    "vite": "8.2.1",
    "vitest": "4.1.11"
  }
}
```

Use these exact test and TypeScript settings:

```ts
// vitest.config.ts
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {environment: 'jsdom', setupFiles: ['./vitest.setup.ts']},
  resolve: {alias: {'@': fileURLToPath(new URL('.', import.meta.url))}}
});
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';
import {afterEach} from 'vitest';
afterEach(() => cleanup());
```

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Use `eslint.config.mjs` to spread `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Create a minimal `next.config.ts` that exports an empty `NextConfig`; Task 2 wraps it with the locale plugin.

- [ ] **Step 4: Create the minimal root layout and theme tokens**

```tsx
// app/layout.tsx
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {default: 'Pax Autocratica Wiki', template: '%s | Pax Autocratica Wiki'},
  description: 'Independent Pax Autocratica guides for colony management, soldiers, breeding and survival.',
  icons: {
    icon: [{url: '/favicon.ico'}, {url: '/favicon-32x32.png', sizes: '32x32'}],
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html suppressHydrationWarning><body>{children}</body></html>;
}
```

```css
/* app/globals.css */
:root {
  --background: #08090a;
  --surface: #0d0f10;
  --surface-soft: #121416;
  --border: #202326;
  --text: #f5f5f4;
  --muted: #9a9b9e;
  --accent: #c5162e;
  --accent-soft: #2a1116;
  --cyan: #16d9dc;
  --radius: 16px;
  --header-height: 64px;
  color-scheme: dark;
}
* {box-sizing: border-box;}
html {background: var(--background); scroll-behavior: smooth;}
body {margin: 0; background: var(--background); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, sans-serif;}
a {color: inherit; text-decoration: none;}
button, a {font: inherit;}
```

- [ ] **Step 5: Copy and download the exact assets**

Copy the seven files from `output/imagegen/favicon_io` into `public`. Download these official Steam CDN images and save them with the file names defined in the file map:

```text
pax-header.jpg  <- https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/d492e901f3aec578ea3b3fc45c25f09784313d8c/header.jpg
pax-colony.jpg  <- https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/794019d7a98da85f60757e6be9409dcb829881aa/ss_794019d7a98da85f60757e6be9409dcb829881aa.1920x1080.jpg
pax-soldiers.jpg <- https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/6cd6758be1fe8edaf3775b2261fc6d6eb29782b3/ss_6cd6758be1fe8edaf3775b2261fc6d6eb29782b3.1920x1080.jpg
```

- [ ] **Step 6: Install dependencies and rerun the test**

Run: `pnpm install && pnpm vitest run tests/project-assets.test.ts`

Expected: PASS with two project-foundation tests.

- [ ] **Step 7: Commit the foundation**

```bash
git add package.json pnpm-lock.yaml tsconfig.json next-env.d.ts next.config.ts eslint.config.mjs vitest.config.ts vitest.setup.ts app public tests/project-assets.test.ts
git commit -m "build: bootstrap Pax Autocratica wiki"
```

---

### Task 2: Add locale-prefixed routing and route-preserving language switching

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `i18n/navigation.ts`
- Create: `lib/locale.ts`
- Create: `proxy.ts`
- Create: `messages/en.json`
- Create: `messages/zh.json`
- Create: `app/[locale]/layout.tsx`
- Create: `components/language-switcher.tsx`
- Create: `tests/locale.test.ts`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: root Next.js layout and package configuration from Task 1.
- Produces: `Locale = 'en' | 'zh'`, `isLocale(value): value is Locale`, `switchLocalePath(pathname, locale): string`, locale-aware `Link`, and translated layout context.

- [ ] **Step 1: Write failing locale helper tests**

```ts
// tests/locale.test.ts
import {describe, expect, it} from 'vitest';
import {isLocale, switchLocalePath} from '@/lib/locale';

describe('locale helpers', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it.each([
    ['/en', 'zh', '/zh'],
    ['/en/guides', 'zh', '/zh/guides'],
    ['/zh/guides/soldiers-and-breeding', 'en', '/en/guides/soldiers-and-breeding']
  ])('switches %s to %s', (path, locale, expected) => {
    expect(switchLocalePath(path, locale as 'en' | 'zh')).toBe(expected);
  });
});
```

- [ ] **Step 2: Run the helper tests and verify failure**

Run: `pnpm vitest run tests/locale.test.ts`

Expected: FAIL because `@/lib/locale` does not exist.

- [ ] **Step 3: Implement the locale contract**

```ts
// lib/locale.ts
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length && isLocale(segments[0])) segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join('/')}`;
}
```

Implement `i18n/routing.ts` with `localePrefix: 'always'`, default locale `en`, and `locales`. Implement `proxy.ts` with `createMiddleware(routing)` and a matcher that ignores `api`, `_next`, and files containing a dot. Configure `next.config.ts` with `createNextIntlPlugin('./i18n/request.ts')`.

```ts
// i18n/routing.ts
import {defineRouting} from 'next-intl/routing';
export const routing = defineRouting({locales: ['en', 'zh'], defaultLocale: 'en', localePrefix: 'always'});
```

```ts
// proxy.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
export default createMiddleware(routing);
export const config = {matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'};
```

```ts
// next.config.ts
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const nextConfig: NextConfig = {};
export default withNextIntl(nextConfig);
```

```ts
// i18n/request.ts
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {locale, messages: (await import(`../messages/${locale}.json`)).default};
});
```

```ts
// i18n/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
```

- [ ] **Step 4: Create the locale layout and translations**

```tsx
// app/[locale]/layout.tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <NextIntlClientProvider messages={await getMessages()}>{children}</NextIntlClientProvider>;
}
```

Create matching `en.json` and `zh.json` keys for `brand`, `nav.home`, `nav.guides`, `nav.states`, `nav.economy`, `nav.troubleshooting`, `language.english`, `language.chinese`, `labels.officialMedia`, `labels.planned`, and footer disclosure.

- [ ] **Step 5: Implement the accessible language switcher**

```tsx
// components/language-switcher.tsx
'use client';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import {switchLocalePath, type Locale} from '@/lib/locale';

export function LanguageSwitcher({locale}: {locale: Locale}) {
  const pathname = usePathname();
  return (
    <div className="language-switcher" aria-label="Language">
      {(['en', 'zh'] as const).map((item) => (
        <Link key={item} href={switchLocalePath(pathname, item)} aria-current={item === locale ? 'page' : undefined}>
          {item === 'en' ? 'EN' : '中文'}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Run locale tests and the type checker**

Run: `pnpm vitest run tests/locale.test.ts && pnpm exec tsc --noEmit`

Expected: all locale tests PASS and TypeScript exits successfully.

- [ ] **Step 7: Commit localization**

```bash
git add app/[locale] components/language-switcher.tsx i18n lib/locale.ts messages next.config.ts proxy.ts tests/locale.test.ts
git commit -m "feat: add bilingual locale routing"
```

---

### Task 3: Add the bilingual MDX content system and official guide content

**Files:**
- Create: `lib/content.ts`
- Create: `components/callout.tsx`
- Create: `components/media-card.tsx`
- Create: `components/mdx-components.tsx`
- Create: `content/en/guides/soldiers-and-breeding.mdx`
- Create: `content/zh/guides/soldiers-and-breeding.mdx`
- Create: `tests/content.test.ts`

**Interfaces:**
- Consumes: `Locale` from `lib/locale.ts` and stable `/public/media` paths.
- Produces: `GuideFrontmatter`, `GuideDocument`, `getGuide(locale, slug)`, `listGuides(locale)`, and `mdxComponents` for the article route.

- [ ] **Step 1: Write failing content-contract tests**

```ts
// tests/content.test.ts
import {describe, expect, it} from 'vitest';
import {getGuide, listGuides} from '@/lib/content';

describe('guide content', () => {
  it.each(['en', 'zh'] as const)('loads the %s Soldiers & Breeding guide', (locale) => {
    const guide = getGuide(locale, 'soldiers-and-breeding');
    expect(guide?.frontmatter.slug).toBe('soldiers-and-breeding');
    expect(guide?.frontmatter.updated).toMatch(/^2026-08-/);
    expect(guide?.frontmatter.image).toBe('/media/pax-soldiers.jpg');
    expect(guide?.source).toContain('##');
  });

  it.each(['en', 'zh'] as const)('lists exactly one completed %s guide', (locale) => {
    expect(listGuides(locale)).toHaveLength(1);
  });

  it('returns null for an unknown guide', () => {
    expect(getGuide('en', 'unknown')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and verify the content loader is missing**

Run: `pnpm vitest run tests/content.test.ts`

Expected: FAIL because `lib/content.ts` does not exist.

- [ ] **Step 3: Implement the content loader and types**

```ts
// lib/content.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {Locale} from '@/lib/locale';

export type GuideFrontmatter = {
  slug: string;
  title: string;
  cardTitle: string;
  description: string;
  cardDescription: string;
  updated: string;
  image: string;
  imageAlt: string;
  sourceLabel: string;
};

export type GuideDocument = {
  frontmatter: GuideFrontmatter;
  source: string;
};

const contentRoot = path.join(process.cwd(), 'content');

export function getGuide(locale: Locale, slug: string): GuideDocument | null {
  const file = path.join(contentRoot, locale, 'guides', `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  return {frontmatter: parsed.data as GuideFrontmatter, source: parsed.content};
}

export function listGuides(locale: Locale): GuideFrontmatter[] {
  const dir = path.join(contentRoot, locale, 'guides');
  return fs.readdirSync(dir).filter((name) => name.endsWith('.mdx'))
    .map((name) => getGuide(locale, name.slice(0, -4))!.frontmatter)
    .sort((a, b) => b.updated.localeCompare(a.updated));
}
```

- [ ] **Step 4: Write the English and Chinese MDX files with matching contracts**

Both documents must use the following frontmatter values, translated only where the field contains reader-facing prose:

```yaml
slug: soldiers-and-breeding
updated: 2026-08-19
image: /media/pax-soldiers.jpg
sourceLabel: Official Steam media
```

The English title is `Pax Autocratica Soldiers & Breeding Guide`; the Chinese title is `Pax Autocratica 士兵与繁育攻略`. Both documents contain these sections in the same order:

```mdx
## The workforce loop / 劳动力循环
## Soldier roles and life stages / 士兵职责与生命周期
## The four core states / 四项核心状态
## Relationships, pregnancy and adulthood / 关系、怀孕与成年
## Assignment and enlistment / 工作分配与入伍
## Common problems / 常见问题
## Sources / 资料来源
```

The facts in those sections are limited to the official site and official Steam records:

- Citizens track Fear, Happiness, Hunger, and Loyalty.
- Policies, food, healthcare, comfort, surveillance, punishment, propaganda, and feasts influence those states.
- Soldiers have social interactions and relationship outcomes.
- The interface shows an expected delivery date for pregnant soldiers.
- Adulthood begins at age 18; adults go to Victory Square for formal enlistment.
- The Aged state reduces movement speed and work attributes.
- Auto-assignment prioritizes soldiers with stronger relevant work attributes.
- `Time Off` is the recovery state to check when stamina does not recover correctly.

End both documents with these visible source links:

```text
https://www.paxautocratica.com/
https://store.steampowered.com/app/1067360/Pax_Autocratica/
https://steamcommunity.com/app/1067360/allnews/
```

- [ ] **Step 5: Implement MDX presentation components**

```tsx
// components/media-card.tsx
import Image from 'next/image';

export function MediaCard({image, alt, label, title, description}: {
  image: string;
  alt: string;
  label: string;
  title?: string;
  description?: string;
}) {
  return <figure className="media-card">
    <Image src={image} alt={alt} width={1920} height={1080} sizes="(max-width: 1040px) 100vw, 936px" />
    <figcaption><span>{label}</span>{title && <strong>{title}</strong>}{description && <p>{description}</p>}</figcaption>
  </figure>;
}
```

```tsx
// components/callout.tsx
export function Callout({type = 'info', title, children}: {
  type?: 'info' | 'warning' | 'source';
  title: string;
  children: React.ReactNode;
}) {
  return <aside className={`callout callout--${type}`}><strong>{title}</strong><div>{children}</div></aside>;
}
```

```tsx
// components/mdx-components.tsx
import type {MDXComponents} from 'mdx/types';
import {Callout} from './callout';

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="article-heading" {...props} />,
  h3: (props) => <h3 className="article-subheading" {...props} />,
  table: (props) => <div className="table-scroll"><table {...props} /></div>,
  a: (props) => <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" />,
  Callout
};
```

- [ ] **Step 6: Run content tests**

Run: `pnpm vitest run tests/content.test.ts`

Expected: all five content tests PASS.

- [ ] **Step 7: Commit the content system**

```bash
git add components/callout.tsx components/media-card.tsx components/mdx-components.tsx content lib/content.ts tests/content.test.ts
git commit -m "feat: add bilingual soldiers and breeding MDX"
```

---

### Task 4: Build the shared reference-style shell

**Files:**
- Create: `lib/navigation.ts`
- Create: `components/site-header.tsx`
- Create: `components/wiki-sidebar.tsx`
- Create: `components/site-shell.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/guide-card.tsx`
- Create: `components/breadcrumb.tsx`
- Create: `tests/site-shell.test.tsx`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Locale`, localized messages, `LanguageSwitcher`, and route-aware links.
- Produces: `SiteShell({locale, children})`, shared desktop/mobile navigation, `GuideCard`, and the exact layout contract used by all three pages.

- [ ] **Step 1: Write failing shell accessibility tests**

```tsx
// tests/site-shell.test.tsx
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {GuideCard} from '@/components/guide-card';
import {WikiSidebar} from '@/components/wiki-sidebar';

describe('shared wiki shell', () => {
  it('renders a route-aware wiki navigation landmark', () => {
    render(<WikiSidebar locale="en" pathname="/en/guides" />);
    expect(screen.getByRole('navigation', {name: /wiki navigation/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /guides/i})).toHaveAttribute('aria-current', 'page');
  });

  it('keeps planned guide cards non-interactive', () => {
    render(<GuideCard title="Economy" description="Resource planning" status="planned" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the shell tests and verify failure**

Run: `pnpm vitest run tests/site-shell.test.tsx`

Expected: FAIL because `GuideCard` and `WikiSidebar` do not exist.

- [ ] **Step 3: Implement navigation data and shell components**

```ts
// lib/navigation.ts
export const wikiSections = {
  en: [
    {label: 'Home', href: '/en'},
    {label: 'Guides', href: '/en/guides'},
    {label: 'Soldiers & Breeding', href: '/en/guides/soldiers-and-breeding'},
    {label: 'States & Policies', count: 4},
    {label: 'Economy & Production', count: 3},
    {label: 'Troubleshooting', count: 1}
  ],
  zh: [
    {label: '首页', href: '/zh'},
    {label: '攻略导航', href: '/zh/guides'},
    {label: '士兵与繁育', href: '/zh/guides/soldiers-and-breeding'},
    {label: '状态与政策', count: 4},
    {label: '经济与生产', count: 3},
    {label: '故障解决', count: 1}
  ]
} as const;
```

`SiteHeader` is exactly 64 pixels high, uses the generated PA logo, exposes desktop links for Home, Guides, Soldiers, and Official Steam, and includes `LanguageSwitcher`. `WikiSidebar` uses a sticky top offset of 88 pixels and includes an official-game card with the Steam link. `SiteShell` renders a 936-pixel content column plus a 264-pixel rail separated by a 32-pixel gap at large widths.

Use this exact card interface so planned entries cannot accidentally become links:

```tsx
// components/guide-card.tsx
import Link from 'next/link';

type GuideCardProps = {
  title: string;
  description: string;
  status: 'ready' | 'planned';
  href?: string;
};

export function GuideCard({title, description, status, href}: GuideCardProps) {
  const body = <><h3>{title}</h3><p>{description}</p><span>{status === 'planned' ? 'Planned' : 'Read guide'}</span></>;
  return status === 'ready' && href
    ? <Link className="guide-card" href={href}>{body}</Link>
    : <article className="guide-card guide-card--planned" aria-disabled="true">{body}</article>;
}
```

Use this breadcrumb contract on guide pages:

```tsx
// components/breadcrumb.tsx
import Link from 'next/link';

export function Breadcrumb({items}: {items: Array<{label: string; href?: string}>}) {
  return <nav className="breadcrumb" aria-label="Breadcrumb"><ol>{items.map((item, index) =>
    <li key={`${item.label}-${index}`}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>
  )}</ol></nav>;
}
```

- [ ] **Step 4: Implement the responsive CSS contract**

```css
.site-header {position: sticky; top: 0; z-index: 50; height: var(--header-height); border-bottom: 1px solid color-mix(in srgb, var(--border) 75%, transparent); background: color-mix(in srgb, var(--background) 82%, transparent); backdrop-filter: blur(18px);}
.header-inner {max-width: 1240px; height: 100%; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;}
.site-grid {width: min(1232px, calc(100% - 40px)); margin: 0 auto; display: grid; grid-template-columns: minmax(0, 936px) 264px; gap: 32px; align-items: start;}
.wiki-sidebar {position: sticky; top: 88px; display: grid; gap: 16px;}
.panel, .guide-card, .media-card, .sidebar-card {border: 1px solid var(--border); border-radius: var(--radius); background: color-mix(in srgb, var(--surface) 78%, transparent);}
@media (max-width: 1040px) {.site-grid {grid-template-columns: minmax(0, 1fr);} .wiki-sidebar {position: static;} .wiki-sidebar__desktop {display: none;} .wiki-sidebar__mobile {display: block;}}
@media (max-width: 640px) {.site-grid {width: min(100% - 28px, 936px);} .header-nav {display: none;} h1 {font-size: clamp(2.1rem, 10vw, 3rem);}}
```

- [ ] **Step 5: Run shell tests and lint**

Run: `pnpm vitest run tests/site-shell.test.tsx && pnpm lint`

Expected: both shell tests PASS and ESLint reports no errors.

- [ ] **Step 6: Commit the shared shell**

```bash
git add app/[locale]/layout.tsx app/globals.css components lib/navigation.ts tests/site-shell.test.tsx
git commit -m "feat: build reference-style wiki shell"
```

---

### Task 5: Implement the guide index and MDX article routes

**Files:**
- Create: `app/[locale]/guides/page.tsx`
- Create: `app/[locale]/guides/[slug]/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `getGuide`, `listGuides`, `mdxComponents`, `GuideCard`, `MediaCard`, `Callout`, `SiteShell`, and `Locale`.
- Produces: four localized guide URLs with page-specific metadata and the requested article content.

- [ ] **Step 1: Add route assertions to the E2E specification**

```ts
// tests/e2e/site.spec.ts (initial guide-route slice)
import {expect, test} from '@playwright/test';

for (const locale of ['en', 'zh']) {
  test(`${locale} guide index and article render`, async ({page}) => {
    await page.goto(`/${locale}/guides`);
    await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('link', {name: locale === 'en' ? /soldiers & breeding/i : /士兵与繁育/}).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/soldiers-and-breeding$`));
    await expect(page.locator('article h2')).toHaveCount(7);
  });
}
```

- [ ] **Step 2: Implement the guide index**

The route validates `params.locale`, calls `setRequestLocale`, loads `listGuides(locale)`, and renders this order:

```tsx
<Breadcrumb items={[homeLabel, guidesLabel]} />
<MediaCard image="/media/pax-colony.jpg" alt={copy.mediaAlt} label={copy.officialMedia} />
<header className="page-intro"><h1>{title}</h1><p>{description}</p></header>
<Callout type="warning" title={earlyAccessTitle}>{earlyAccessCopy}</Callout>
<section aria-labelledby="guide-list-title" className="guide-grid">
  <h2 id="guide-list-title" className="section-title">{copy.guideListTitle}</h2>
  {guides.map((guide) => (
    <GuideCard key={guide.slug} title={guide.cardTitle} description={guide.cardDescription}
      href={`/${locale}/guides/${guide.slug}`} status="ready" />
  ))}
</section>
```

The first card links to the real localized article. Four subsequent cards—States & Policies, Economy & Production, Decrees, and Troubleshooting—use `status="planned"` without an `href`.

- [ ] **Step 3: Implement the article route and localized metadata**

```tsx
// app/[locale]/guides/[slug]/page.tsx (core rendering)
const guide = getGuide(locale, slug);
if (!guide) notFound();

return (
  <article className="article">
    <Breadcrumb items={[home, guides, guide.frontmatter.cardTitle]} />
    <header className="article-hero">
      <h1>{guide.frontmatter.title}</h1>
      <p>{guide.frontmatter.description}</p>
      <time dateTime={guide.frontmatter.updated}>{updatedLabel}: {guide.frontmatter.updated}</time>
    </header>
    <MediaCard image={guide.frontmatter.image} alt={guide.frontmatter.imageAlt} label={guide.frontmatter.sourceLabel} />
    <div className="mdx-body"><MDXRemote source={guide.source} components={mdxComponents} /></div>
  </article>
);
```

`generateMetadata` returns localized title, description, canonical URL, English and Chinese alternates, and an absolute official Steam screenshot URL for Open Graph and X metadata. `generateStaticParams` returns the two locale/article combinations.

- [ ] **Step 4: Add the reference-style index and article CSS**

Implement a 16:9 banner, 48-pixel page title, 1.75 line-height body copy, 32-pixel section gaps, bordered table cells, purple-red warning callouts, two-column related cards, and a maximum 72-character reading measure. Do not add decorative gradients or animations absent from the reference.

- [ ] **Step 5: Run unit tests and a production build**

Run: `pnpm test:run && pnpm build`

Expected: all unit tests PASS and all four localized guide routes are generated without MDX or metadata errors.

- [ ] **Step 6: Commit guide routes**

```bash
git add app/[locale]/guides app/globals.css tests/e2e/site.spec.ts
git commit -m "feat: add guide index and MDX article pages"
```

---

### Task 6: Implement the bilingual home page

**Files:**
- Create: `app/[locale]/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`
- Modify: `app/globals.css`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: shared shell, guide links, official Steam URL, localized messages, and official header image.
- Produces: `/en` and `/zh` home pages with the reference site's hero, two-panel start section, popular guide cards, FAQ, and final CTA.

- [ ] **Step 1: Add failing home-route E2E assertions**

```ts
for (const locale of ['en', 'zh']) {
  test(`${locale} home exposes the three required actions`, async ({page}) => {
    await page.goto(`/${locale}`);
    await expect(page.getByRole('heading', {level: 1, name: 'Pax Autocratica'})).toBeVisible();
    await expect(page.getByRole('link', {name: locale === 'en' ? /soldiers & breeding/i : /士兵与繁育/})).toBeVisible();
    await expect(page.getByRole('link', {name: locale === 'en' ? /all guides/i : /全部攻略/})).toBeVisible();
    await expect(page.getByRole('link', {name: /steam/i})).toHaveAttribute('href', /store\.steampowered\.com/);
  });
}
```

- [ ] **Step 2: Implement the localized home data**

Add matching message structures under `Home.hero`, `Home.start`, `Home.popular`, `Home.about`, `Home.faq`, and `Home.finalCta`. Use these verified facts:

```text
Developer: Multiverse
Platform: Steam / Windows
Genre: Colony Sim + FPS Roguelite
Mode: Single-player
Core states: Fear, Happiness, Hunger, Loyalty
Official site: https://www.paxautocratica.com/
Steam: https://store.steampowered.com/app/1067360/Pax_Autocratica/
```

- [ ] **Step 3: Build the home page in the reference order**

```tsx
const stats = t.raw('hero.stats') as string[];

<section className="home-hero">
  <span className="eyebrow">{t('hero.eyebrow')}</span>
  <h1>Pax Autocratica</h1>
  <p className="hero-copy">{t('hero.description')}</p>
  <div className="stat-pills">{stats.map((stat) => <span key={stat}>{stat}</span>)}</div>
  <div className="hero-actions">
    <Link href={`/${locale}/guides/soldiers-and-breeding`}>{t('hero.primaryCta')}</Link>
    <Link href={`/${locale}/guides`}>{t('hero.secondaryCta')}</Link>
    <a href="https://store.steampowered.com/app/1067360/Pax_Autocratica/">{t('hero.tertiaryCta')}</a>
  </div>
</section>
<section className="home-split">
  <div className="panel"><h2>{t('start.title')}</h2><p>{t('start.description')}</p></div>
  <div className="panel"><h2>{t('updates.title')}</h2><p>{t('updates.description')}</p></div>
</section>
<section className="popular-guides">
  <h2>{t('popular.title')}</h2>
  <GuideCard title={t('popular.soldiers.title')} description={t('popular.soldiers.description')}
    href={`/${locale}/guides/soldiers-and-breeding`} status="ready" />
</section>
<section className="about-game">
  <h2>{t('about.title')}</h2><p>{t('about.description')}</p>
</section>
<section className="faq">
  <h2>{t('faq.title')}</h2><details><summary>{t('faq.question')}</summary><p>{t('faq.answer')}</p></details>
</section>
<section className="final-cta">
  <h2>{t('finalCta.title')}</h2><Link href={`/${locale}/guides`}>{t('finalCta.action')}</Link>
</section>
```

Use the generated PA favicon mark in the header and `/media/pax-header.jpg` only where the reference layout uses a media card; preserve the reference home's restrained, mostly typographic first viewport.

- [ ] **Step 4: Add the home CSS**

Match the inspected reference proportions: hero content centered within 936 pixels; 48-pixel desktop title; actions in one row; two equal panels below; 2-column popular-card grid; 48–80 pixel section spacing; right rail aligned with the top of the hero panel. At 640 pixels, stack actions and cards in one column.

- [ ] **Step 5: Run the production build**

Run: `pnpm test:run && pnpm build`

Expected: unit tests PASS and all six localized routes build successfully.

- [ ] **Step 6: Commit the home page**

```bash
git add app/[locale]/page.tsx app/globals.css messages tests/e2e/site.spec.ts
git commit -m "feat: add bilingual Pax Autocratica home page"
```

---

### Task 7: Add production E2E verification and visual parity checks

**Files:**
- Create: `playwright.config.ts`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `app/globals.css` only for failures demonstrated by E2E or browser inspection.

**Interfaces:**
- Consumes: completed six-route site.
- Produces: automated redirect, language, navigation, responsive overflow, and console-error evidence plus final browser-verified visual parity.

- [ ] **Step 1: Complete the E2E test suite**

```ts
test('root redirects to a supported locale', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(en|zh)$/);
});

test('language switch preserves the article path', async ({page}) => {
  await page.goto('/en/guides/soldiers-and-breeding');
  await page.getByRole('link', {name: '中文'}).click();
  await expect(page).toHaveURL(/\/zh\/guides\/soldiers-and-breeding$/);
});

test('mobile pages have no horizontal overflow', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const path of ['/en', '/en/guides', '/en/guides/soldiers-and-breeding']) {
    await page.goto(path);
    const widths = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client);
  }
});
```

Configure Playwright to run `pnpm start` after `pnpm build`, use `http://127.0.0.1:3000`, and test desktop Chromium plus a 390×844 mobile Chromium project.

- [ ] **Step 2: Install the Chromium test browser and run E2E**

Run: `pnpm exec playwright install chromium && pnpm build && pnpm test:e2e`

Expected: redirect, four guide-route checks, two home checks, path-preserving language switch, and mobile-overflow test all PASS.

- [ ] **Step 3: Perform browser visual comparison on the three English routes**

Open `/en`, `/en/guides`, and `/en/guides/soldiers-and-breeding` at a desktop width near 1440 pixels and compare them against the already inspected reference pages:

- Header height is 64 pixels.
- Reading column and rail align on the same 1232-pixel shell.
- Rail remains visible and sticky on desktop.
- Guide banner uses a wide rounded crop.
- Article title, deck, date, media card, and body sections follow the same vertical rhythm.
- Card borders remain subtle and do not become bright red outlines.
- No VV: ULTIMATUM words or images appear anywhere.

Open the same routes at 390 pixels and verify that the rail becomes an accessible disclosure, cards stack, CTAs wrap, and no text or media crosses the viewport edge.

- [ ] **Step 4: Fix only demonstrated parity or accessibility defects**

For each visible mismatch, identify the responsible existing CSS selector, change the smallest relevant token or rule, and rerun the specific E2E case before changing anything else. Do not add new content or routes during this step.

- [ ] **Step 5: Run final verification**

Run: `pnpm lint && pnpm test:run && pnpm build && pnpm test:e2e`

Expected: lint exits with zero errors, all unit tests PASS, production build succeeds, and all E2E tests PASS.

- [ ] **Step 6: Commit final verification changes**

```bash
git add playwright.config.ts tests/e2e/site.spec.ts app/globals.css
git commit -m "test: verify multilingual wiki routes and responsive layout"
```

---

## Completion Checklist

- [ ] `/en`, `/en/guides`, and `/en/guides/soldiers-and-breeding` render complete English content.
- [ ] `/zh`, `/zh/guides`, and `/zh/guides/soldiers-and-breeding` render complete Chinese content.
- [ ] `/` redirects to a supported locale and defaults to English.
- [ ] The language control preserves the current route.
- [ ] The guide article is sourced from localized MDX and exposes localized SEO metadata.
- [ ] Desktop and mobile layouts match the reference site's structure without copying its game content or assets.
- [ ] Generated Pax Autocratica favicon files are active.
- [ ] Only official Pax Autocratica and Steam links appear as external content sources.
- [ ] Unit tests, lint, production build, and Playwright E2E tests all pass.

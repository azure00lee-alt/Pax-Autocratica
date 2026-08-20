# Pax Autocratica Five-Language Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build five complete Pax Autocratica guides in English, Simplified Chinese, French, Russian, and German, then run the complete site locally for user review without pushing to GitHub.

**Architecture:** Keep the existing static Next.js App Router and local MDX pipeline. Extend the locale union to five languages, make guide frontmatter the source for guide cards and SEO, share only route/order definitions, and keep each translated article in its own MDX file. Archive research as one Markdown note per external source and label every non-official claim in the article text.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9.3, next-intl 4.13.7, next-mdx-remote 6.0.0, MDX, Vitest 4.1.11, Playwright 1.62.1.

**Spec:** `docs/superpowers/specs/2026-08-21-pax-autocratica-guide-expansion-design.md`

## Global Constraints

- Supported locales are exactly `en`, `zh`, `fr`, `ru`, and `de`; Spanish and Japanese are excluded.
- Guide slugs are exactly `soldiers-and-breeding`, `base-and-resources`, `captives-and-conversion`, `weapons-and-combat`, and `exploration-and-bosses`.
- Official website, Steam store/news, and official media are preferred; reputable third-party or player-test sources must be labeled and no competitor guide site may appear.
- No unsupported mechanics, values, weapon names, enemy names, boss names, class names, or UI labels may be invented.
- Every displayed external URL must be opened and confirmed live before completion.
- Do not add live Steam statistics, accounts, comments, reviews, databases, or runtime APIs.
- Do not push to GitHub until the user reviews the local site and explicitly approves the upload.
- Preserve the existing untracked image files and the unrelated generated `next-env.d.ts` working-tree change.

## File Structure

- `research/soldiers-and-breeding/*.md`, `research/base-and-resources/*.md`, `research/captives-and-conversion/*.md`, `research/weapons-and-combat/*.md`, and `research/exploration-and-bosses/*.md`: one numbered evidence note per source, with source type, URL, access date, supported claims, and summary.
- `content/<locale>/guides/<guide-slug>.mdx`: one localized guide; frontmatter supplies card data, route metadata, image, source label, and ordering.
- `lib/locale.ts`: the five-locale type and path-switching helper.
- `lib/guides.ts`: ordered guide slug constants and alternate-language URL generation.
- `lib/content.ts`: MDX frontmatter validation, loading, and stable order.
- `messages/<locale>.json`: localized site-shell and homepage copy.
- `components/language-switcher.tsx`: route-preserving, accessible five-language dropdown.
- `lib/navigation.ts`, `components/wiki-sidebar.tsx`, `components/site-header.tsx`, `components/site-footer.tsx`, `components/site-shell.tsx`: localized real-page navigation.
- `app/[locale]/page.tsx`, `app/[locale]/guides/page.tsx`, `app/[locale]/guides/[slug]/page.tsx`: 35 static localized routes and metadata.
- `tests/*.test.*`, `tests/e2e/site.spec.ts`: research, locale, content, navigation, metadata, accessibility, responsive, and route tests.

---

### Task 1: Build and Validate the Research Archive

**Files:**
- Create: `research/soldiers-and-breeding/*.md`
- Create: `research/base-and-resources/*.md`
- Create: `research/captives-and-conversion/*.md`
- Create: `research/weapons-and-combat/*.md`
- Create: `research/exploration-and-bosses/*.md`

**Interfaces:**
- Consumes: the source boundary in the approved design spec.
- Produces: source notes with headings `Source`, `Source type`, `URL`, `Accessed`, `Supported claims`, and `Writing notes`; guide authors use only claims recorded here.

- [ ] **Step 1: Search primary sources and verify every candidate URL**

Search the official Pax Autocratica website, Steam store, official Steam announcements, and official video/social destinations first. For any factual gap, inspect the supplied Wand review and reputable high-view videos or media articles; exclude guide competitors. Open each chosen URL directly, verify a non-error response and that its content supports the note.

- [ ] **Step 2: Create one evidence note per source**

Use sequential filenames such as `01-official-website.md`, `02-steam-store.md`, and `03-steam-announcement-2026-08-21.md`. Each file must use the same complete structure as this concrete official-site note:

```markdown
# Pax Autocratica official website

## Source type

Official website

## URL

https://www.paxautocratica.com/

## Accessed

2026-08-21

## Supported claims

- Pax Autocratica combines colony management with first-person expeditions.

## Writing notes

The official overview establishes the game's two-part colony and expedition loop. It does not by itself establish exact resource values, conversion formulas, a complete weapon list, or a complete boss roster; those claims require separate sources.
```

- [ ] **Step 3: Inspect the archive and evidence boundary**

Manually confirm that every planned guide chapter has at least one supporting note, every URL returns a successful response, every third-party observation is labeled, and no competitor guide domain appears. Remove any unsupported planned subsection rather than filling it with inference. Research notes are human-readable evidence records, so they are reviewed directly rather than tested by brittle source-text assertions.

- [ ] **Step 4: Commit only the research archive and plan correction**

```powershell
git add -- research docs/superpowers/plans/2026-08-21-pax-autocratica-five-language-guides.md
git commit -m "docs: archive guide research sources"
```

### Task 2: Extend Locale and Guide Route Foundations

**Files:**
- Create: `lib/guides.ts`
- Modify: `lib/locale.ts`
- Modify: `i18n/routing.ts`
- Modify: `tests/locale.test.ts`
- Create: `tests/guides.test.ts`

**Interfaces:**
- Produces: `locales: readonly ['en','zh','fr','ru','de']`, `Locale`, `guideSlugs`, `GuideSlug`, `guidePath(locale, slug)`, and `localizedAlternates(pathWithoutLocale)`.
- Consumes: all navigation and routes use these constants instead of local locale/slug arrays.

- [ ] **Step 1: Write failing locale and guide-route tests**

```ts
expect(locales).toEqual(['en', 'zh', 'fr', 'ru', 'de']);
for (const locale of locales) expect(isLocale(locale)).toBe(true);
expect(switchLocalePath('/zh/guides/base-and-resources', 'de')).toBe('/de/guides/base-and-resources');
expect(guideSlugs).toEqual([
  'soldiers-and-breeding',
  'base-and-resources',
  'captives-and-conversion',
  'weapons-and-combat',
  'exploration-and-bosses'
]);
expect(localizedAlternates('/guides')).toEqual({
  en: '/en/guides', zh: '/zh/guides', fr: '/fr/guides', ru: '/ru/guides', de: '/de/guides'
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node node_modules/vitest/vitest.mjs run tests/locale.test.ts tests/guides.test.ts`

Expected: FAIL because three locales and `lib/guides.ts` are missing.

- [ ] **Step 3: Implement the shared locale and guide definitions**

```ts
export const guideSlugs = [
  'soldiers-and-breeding',
  'base-and-resources',
  'captives-and-conversion',
  'weapons-and-combat',
  'exploration-and-bosses'
] as const;
export type GuideSlug = (typeof guideSlugs)[number];
export const guidePath = (locale: Locale, slug: GuideSlug) => `/${locale}/guides/${slug}`;
export const localizedAlternates = (path = '') => Object.fromEntries(
  locales.map((locale) => [locale, `/${locale}${path}`])
);
```

Update both locale definitions to the exact order `en`, `zh`, `fr`, `ru`, `de`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `node node_modules/vitest/vitest.mjs run tests/locale.test.ts tests/guides.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit locale foundations**

```powershell
git add -- lib/locale.ts lib/guides.ts i18n/routing.ts tests/locale.test.ts tests/guides.test.ts
git commit -m "feat: add five-locale guide routing"
```

### Task 3: Add the Five-Language Interface and Accessible Language Menu

**Files:**
- Create: `messages/fr.json`
- Create: `messages/ru.json`
- Create: `messages/de.json`
- Modify: `messages/en.json`
- Modify: `messages/zh.json`
- Modify: `components/language-switcher.tsx`
- Modify: `components/site-shell.tsx`
- Modify: `app/globals.css`
- Modify: `tests/site-shell.test.tsx`

**Interfaces:**
- Consumes: `locales`, `Locale`, and `switchLocalePath` from `lib/locale.ts`.
- Produces: a native `<select aria-label="…">` whose value is the active locale and whose change navigates to the same path in the selected locale.

- [ ] **Step 1: Add failing tests for five localized options and route retention**

Mock `usePathname` as `/zh/guides/base-and-resources` and the Next router `replace` method. Assert that the combobox contains exactly `English`, `中文`, `Français`, `Русский`, and `Deutsch`, selects `中文`, and calls `replace('/de/guides/base-and-resources')` after choosing `Deutsch`.

- [ ] **Step 2: Run the shell tests and verify RED**

Run: `node node_modules/vitest/vitest.mjs run tests/site-shell.test.tsx`

Expected: FAIL because the current component renders two links and the three message files are missing.

- [ ] **Step 3: Implement the native language dropdown**

Use `useRouter`, `usePathname`, a localized `aria-label`, and a real `<select>` so keyboard behavior is provided by the browser. Keep visible labels in their native forms. Add a `focus-visible` outline and a minimum 44-pixel control height without changing the existing header layout.

- [ ] **Step 4: Translate all existing interface-message keys**

Create complete French, Russian, and German JSON files with the same key paths as English. Replace the old planned-guide keys with `soldiers`, `base`, `captives`, `weapons`, and `exploration` in all five files. Translate the skip link, navigation labels, official-game card, footer navigation, guide-page shared labels, homepage hero, five popular cards, FAQ, and final CTA without changing the product name.

- [ ] **Step 5: Run shell and locale tests**

Run: `node node_modules/vitest/vitest.mjs run tests/site-shell.test.tsx tests/locale.test.ts`

Expected: PASS with all five options and no missing-message errors.

- [ ] **Step 6: Commit interface localization**

```powershell
git add -- messages components/language-switcher.tsx components/site-shell.tsx app/globals.css tests/site-shell.test.tsx
git commit -m "feat: add five-language site controls"
```

### Task 4: Strengthen the MDX Content Contract

**Files:**
- Modify: `lib/content.ts`
- Modify: `content/en/guides/soldiers-and-breeding.mdx`
- Modify: `content/zh/guides/soldiers-and-breeding.mdx`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Produces: `GuideFrontmatter.order: number`; `listGuides(locale)` returns all five documents ordered by `order`, never by update date.
- Consumes: all 25 MDX documents must supply `order` values 1 through 5 matching `guideSlugs`.

- [ ] **Step 1: Write failing content-order and completeness tests**

```ts
it.each(locales)('%s has all five guides in the approved order', (locale) => {
  expect(listGuides(locale).map((guide) => guide.slug)).toEqual(guideSlugs);
});

it.each(locales.flatMap((locale) => guideSlugs.map((slug) => [locale, slug] as const)))(
  '%s/%s has guide-quality structure', (locale, slug) => {
    const guide = getGuide(locale, slug)!;
    expect(guide.frontmatter.order).toBe(guideSlugs.indexOf(slug) + 1);
    expect(guide.source.match(/^##\s+.+$/gm)?.length).toBeGreaterThanOrEqual(7);
    expect(guide.source).toContain('|');
    expect(guide.source).toContain('<Callout');
    expect(guide.source).toContain(`/${locale}/guides`);
    expect(guide.source).toMatch(/https:\/\//);
  }
);
```

- [ ] **Step 2: Run the content test and verify RED**

Run: `node node_modules/vitest/vitest.mjs run tests/content.test.ts`

Expected: FAIL because `order` and 23 localized documents do not exist.

- [ ] **Step 3: Add and validate the order field**

Add `order: number` to `GuideFrontmatter`, sort numerically, and add `order: 1` to both existing Soldiers & Breeding documents. Reject or fail tests for duplicated slugs/orders and frontmatter slugs that do not match filenames.

- [ ] **Step 4: Keep the content suite RED for the missing guides**

Run: `node node_modules/vitest/vitest.mjs run tests/content.test.ts`

Expected: existing English/Chinese Soldiers checks pass; the five-language completeness matrix still fails, proving the next two tasks have measurable work.

- [ ] **Step 5: Commit the content contract**

```powershell
git add -- lib/content.ts content/en/guides/soldiers-and-breeding.mdx content/zh/guides/soldiers-and-breeding.mdx tests/content.test.ts
git commit -m "test: define complete guide content contract"
```

### Task 5: Write the Canonical English and Chinese Guides

**Files:**
- Create: `content/en/guides/base-and-resources.mdx`
- Create: `content/en/guides/captives-and-conversion.mdx`
- Create: `content/en/guides/weapons-and-combat.mdx`
- Create: `content/en/guides/exploration-and-bosses.mdx`
- Create: `content/zh/guides/base-and-resources.mdx`
- Create: `content/zh/guides/captives-and-conversion.mdx`
- Create: `content/zh/guides/weapons-and-combat.mdx`
- Create: `content/zh/guides/exploration-and-bosses.mdx`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: only claims in `research/<slug>/*.md`, with official facts and third-party/player findings explicitly distinguished.
- Produces: eight complete MDX documents with matching section/table/callout/link structure and orders 2, 3, 4, and 5.

- [ ] **Step 1: Add exact English/Chinese structure-parity expectations**

For each new slug, compare counts of H2, H3, table rows, callouts, images, internal links, and external links between English and Chinese. Require seven or more H2 sections, two or more callouts, one or more tables, two or more internal links, and three or more external-source links.

- [ ] **Step 2: Write Base & Resources in English and Chinese**

Use the approved seven chapters: base loop; food/healthcare/comfort; buildings/production; workforce assignment; shortage priorities; expansion checklist; troubleshooting/sources. Clearly mark any priority order as practical guidance unless an official source directly specifies it.

- [ ] **Step 3: Write Captives & Conversion in English and Chinese**

Use the approved seven chapters: overview; verified capture conditions/process; detention resources; policy/loyalty/conversion; post-conversion assignment; failure causes; troubleshooting/sources. If sources do not support a named conversion formula, say so explicitly and omit invented thresholds.

- [ ] **Step 4: Write Weapons & Combat in English and Chinese**

Use the approved seven chapters: overview; officially confirmed weapon types; scenario choice; ammunition/stamina/survival; confirmed enemy types/counters; preparation checklist; troubleshooting/sources. Include only weapon/enemy names visible in the archived evidence.

- [ ] **Step 5: Write Exploration & Bosses in English and Chinese**

Use the approved seven chapters: exploration loop; preparation; objectives/resources; officially confirmed bosses; boss preparation/counters; extraction/return; troubleshooting/sources. If no reliable boss roster is published, describe only confirmed encounters and explicitly state the evidence limit.

- [ ] **Step 6: Run content tests for the two canonical languages**

Run: `node node_modules/vitest/vitest.mjs run tests/content.test.ts`

Expected: all English/Chinese guide and parity checks pass; French/Russian/German missing-file cases remain RED.

- [ ] **Step 7: Commit the canonical guides**

```powershell
git add -- content/en/guides content/zh/guides tests/content.test.ts
git commit -m "content: add four complete bilingual guides"
```

### Task 6: Translate All Five Guides into French, Russian, and German

**Files:**
- Create: `content/fr/guides/soldiers-and-breeding.mdx`
- Create: `content/fr/guides/base-and-resources.mdx`
- Create: `content/fr/guides/captives-and-conversion.mdx`
- Create: `content/fr/guides/weapons-and-combat.mdx`
- Create: `content/fr/guides/exploration-and-bosses.mdx`
- Create: `content/ru/guides/soldiers-and-breeding.mdx`
- Create: `content/ru/guides/base-and-resources.mdx`
- Create: `content/ru/guides/captives-and-conversion.mdx`
- Create: `content/ru/guides/weapons-and-combat.mdx`
- Create: `content/ru/guides/exploration-and-bosses.mdx`
- Create: `content/de/guides/soldiers-and-breeding.mdx`
- Create: `content/de/guides/base-and-resources.mdx`
- Create: `content/de/guides/captives-and-conversion.mdx`
- Create: `content/de/guides/weapons-and-combat.mdx`
- Create: `content/de/guides/exploration-and-bosses.mdx`
- Modify: `tests/content.test.ts`

**Interfaces:**
- Consumes: English documents as the factual canonical version and Chinese documents as a second parity check.
- Produces: 15 faithful translations with localized headings, summaries, callouts, table labels, alt text, and internal paths; external source URLs remain unchanged.

- [ ] **Step 1: Extend parity tests across all five languages**

For each slug, compare the H2/H3/table/callout/image/internal-link/external-link counts for `fr`, `ru`, and `de` with English. Assert each localized source contains `/<locale>/guides` and does not contain another locale's internal guide path.

- [ ] **Step 2: Translate Soldiers & Breeding into three languages**

Preserve the official condition set Fear/Happiness/Hunger/Loyalty and the separation of stamina from those readouts. Do not introduce Exhaustion or Wellbeing as official readout labels.

- [ ] **Step 3: Translate Base & Resources into three languages**

Preserve every evidence label, table row, step, warning, internal link, and external URL while using natural French, Russian, and German game-guide language.

- [ ] **Step 4: Translate Captives & Conversion into three languages**

Keep official facts, media observations, and practical inferences separated exactly as in English.

- [ ] **Step 5: Translate Weapons & Combat into three languages**

Keep official proper nouns unchanged unless the official product material supplies a localized term; do not independently localize names that function as product labels.

- [ ] **Step 6: Translate Exploration & Bosses into three languages**

Preserve uncertainty language and do not make the translated copy more certain than the canonical English copy.

- [ ] **Step 7: Run the complete content matrix and verify GREEN**

Run: `node node_modules/vitest/vitest.mjs run tests/content.test.ts`

Expected: PASS for 25 documents, five ordered guide lists, all parity checks, and all source-boundary checks.

- [ ] **Step 8: Commit the three-language article set**

```powershell
git add -- content/fr content/ru content/de tests/content.test.ts
git commit -m "content: translate all guides into fr ru and de"
```

### Task 7: Connect Every Page, Navigation Surface, and SEO Alternate

**Files:**
- Modify: `lib/navigation.ts`
- Modify: `components/wiki-sidebar.tsx`
- Modify: `components/site-header.tsx`
- Modify: `components/site-footer.tsx`
- Modify: `components/site-shell.tsx`
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/guides/page.tsx`
- Modify: `app/[locale]/guides/[slug]/page.tsx`
- Modify: `tests/site-shell.test.tsx`
- Modify: `tests/content.test.ts`
- Modify: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: `guideSlugs`, `guidePath`, `localizedAlternates`, five-locale messages, and 25 MDX documents.
- Produces: 35 static localized pages; every guide is linked from the index and wiki navigation; every route has five-language alternates.

- [ ] **Step 1: Write failing navigation and metadata tests**

Assert that every locale's guide index exposes five ready links in approved order, no `.guide-card--planned` exists, the sidebar contains all five guide links, the homepage cards link to real routes, and metadata alternates contain exactly five languages.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node node_modules/vitest/vitest.mjs run tests/site-shell.test.tsx tests/content.test.ts`

Expected: FAIL because navigation and page-local copy still support only English/Chinese and planned cards.

- [ ] **Step 3: Replace placeholder navigation with five real guide links**

Build navigation from the ordered guide slug data and localized message labels. Remove count badges and planned states. Keep header width manageable by showing Home, Guides, and the official Steam link in the header while the sidebar contains all five article links.

- [ ] **Step 4: Make the homepage and guide index fully data-backed**

Render five clickable guide cards in approved order. Update progress copy so it states the guide collection is available rather than planned. Keep existing visual components and spacing.

- [ ] **Step 5: Generate all guide params and five-language metadata alternates**

```ts
export function generateStaticParams() {
  return locales.flatMap((locale) => guideSlugs.map((slug) => ({locale, slug})));
}
```

Use `localizedAlternates('')`, `localizedAlternates('/guides')`, and `localizedAlternates(`/guides/${slug}`)` for home, index, and detail metadata.

- [ ] **Step 6: Run unit tests and production build**

Run: `node node_modules/vitest/vitest.mjs run`

Run: `node node_modules/next/dist/bin/next build`

Expected: all unit tests pass and build output contains the five locales and five static guide slugs without MDX, TypeScript, or missing-message errors.

- [ ] **Step 7: Commit route integration**

```powershell
git add -- lib/navigation.ts components app messages tests
git commit -m "feat: connect five-language guide collection"
```

### Task 8: Browser QA, Source-Link Audit, and Local Preview

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify only if a failing test identifies a scoped defect: `app/globals.css`, affected component, message file, or MDX file.

**Interfaces:**
- Consumes: the completed static site.
- Produces: automated evidence that 35 routes work, language switching preserves route, all guide links resolve, mobile layout does not overflow, and no runtime errors occur.

- [ ] **Step 1: Add a 35-route E2E matrix**

```ts
const locales = ['en', 'zh', 'fr', 'ru', 'de'];
const guideSlugs = ['soldiers-and-breeding', 'base-and-resources', 'captives-and-conversion', 'weapons-and-combat', 'exploration-and-bosses'];
const routes = locales.flatMap((locale) => [
  `/${locale}`,
  `/${locale}/guides`,
  ...guideSlugs.map((slug) => `/${locale}/guides/${slug}`)
]);

for (const route of routes) {
  test(`${route} renders without errors`, async ({page}) => {
    const expectNoRuntimeErrors = monitorRuntimeErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    expectNoRuntimeErrors();
  });
}
```

- [ ] **Step 2: Add dropdown, link, and responsive assertions**

At desktop width, switch `/zh/guides/weapons-and-combat` to German and assert `/de/guides/weapons-and-combat`. At 390×844, check each page type in all five locales for `scrollWidth <= clientWidth`, a collapsed mobile Wiki menu, visible H1, usable 44-pixel controls, and no console/page errors.

- [ ] **Step 3: Run lint, unit tests, build, and E2E**

```powershell
node node_modules/eslint/bin/eslint.js .
node node_modules/vitest/vitest.mjs run
node node_modules/next/dist/bin/next build
node node_modules/playwright/cli.js test
```

Expected: ESLint has zero errors/warnings, unit tests all pass, production build succeeds, and Playwright is fully green.

- [ ] **Step 4: Audit external URLs from rendered content**

Extract external source links from the 25 MDX files, deduplicate them, open each URL, and confirm it is live and not a competitor guide site. Remove or replace any failing link and rerun the content/build checks.

- [ ] **Step 5: Perform visual QA in the local browser**

Inspect English, Chinese, French, Russian, and German on home, guide index, and at least one long article. Check heading hierarchy, table readability, Cyrillic/German wrapping, image cropping, card heights, language menu, mobile navigation, source labels, and related links. Fix only defects directly tied to this scope and rerun the affected tests.

- [ ] **Step 6: Commit verification changes locally**

```powershell
git add -- tests/e2e/site.spec.ts app/globals.css components messages content research
git commit -m "test: verify five-language guide site"
```

- [ ] **Step 7: Start the local preview and stop before any upload**

Run: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000`

Open `/zh/guides` locally and report the local URL to the user. Do not run `git push`, create a release, or deploy. Wait for the user's visual approval before uploading anything to GitHub.

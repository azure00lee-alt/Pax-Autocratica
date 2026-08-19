# Pax Autocratica Wiki — Three-Page Multilingual Site Design

## Goal

Build a new Pax Autocratica fan wiki in Next.js that closely reproduces the information architecture, spacing, dark visual system, navigation pattern, cards, article typography, and responsive behavior of `vvultimatum.net`, while using only Pax Autocratica branding, copy, imagery, and research.

The first release contains three page types in English and Simplified Chinese:

- Home: `/en` and `/zh`
- Guide index: `/en/guides` and `/zh/guides`
- Guide article: `/en/guides/soldiers-and-breeding` and `/zh/guides/soldiers-and-breeding`

The root route `/` redirects to the preferred supported locale, defaulting to English.

## Visual Reference Boundary

The site reproduces the reference site's layout language rather than its game content or source code. The implementation will match these visible patterns:

- 64-pixel translucent dark top navigation
- Wide three-column desktop shell with a central reading column and a right wiki-navigation rail
- Near-black background, subtle borders, low-contrast secondary text, and white primary text
- Large restrained headings, pill-shaped metadata, rounded bordered cards, and compact label typography
- Home page hero followed by split feature panels and guide cards
- Guide index with breadcrumb, wide media banner, description, callout, and three-column card grid
- Article page with breadcrumb, title/deck/update date, media card, long-form MDX content, related links, and section navigation
- Sticky desktop rail and a compact mobile menu in place of the rail

No VV: ULTIMATUM text, copyrighted page copy, or site-specific imagery will be included.

## Technical Architecture

Use Next.js with the App Router and TypeScript. Locale routing is implemented with `next-intl` and a `[locale]` route segment. English and Chinese use the same React layouts and components but separate navigation strings, metadata, and MDX documents.

MDX is compiled locally at build time. Guide metadata is stored in frontmatter and supplies the listing card, breadcrumb, page metadata, update date, and related links. The rendered article body is the same authoritative content used for search metadata.

The project is fully static for this first release. It does not need a database, account system, live player statistics, or external runtime API.

## Project Structure

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    guides/
      page.tsx
      [slug]/page.tsx
  layout.tsx
  page.tsx
  globals.css
components/
  site-header.tsx
  language-switcher.tsx
  wiki-sidebar.tsx
  mobile-wiki-menu.tsx
  site-footer.tsx
  guide-card.tsx
  media-card.tsx
  callout.tsx
  mdx-components.tsx
content/
  en/guides/soldiers-and-breeding.mdx
  zh/guides/soldiers-and-breeding.mdx
lib/
  content.ts
  navigation.ts
  i18n.ts
messages/
  en.json
  zh.json
public/
  favicon assets
  pax-autocratica media
```

## Page Design

### Home

The first viewport follows the reference site's hierarchy: compact header, centered Pax Autocratica title and fan-wiki badge, two-sentence game summary, concise fact pills, and three calls to action. The primary CTA opens the Soldiers & Breeding guide, the secondary CTA opens the guide index, and the tertiary CTA points to the Steam store.

Below the hero, two bordered panels introduce “Start Here” and a compact guide/update summary. A “Popular Guides” area uses the same quiet card styling and provides genuine Pax Autocratica topics without adding unfinished routes. Cards whose pages are not part of the first release are visually present as informational summaries but are not fake links.

The right rail lists the planned Pax Autocratica wiki sections and highlights the current route. It also includes a compact official-game card rather than the reference site's code widget, because Pax Autocratica has no codes system.

### Guide Index

The guide index uses `/guides`, matching the role of the reference site's `/races` page. It includes:

- Home / Guides breadcrumb
- Wide Pax Autocratica media banner
- “Pax Autocratica Guides” heading and localized introduction
- A highlighted callout explaining that systems may change through updates
- A guide-card grid led by Soldiers & Breeding
- Planned-topic cards for state management, economy, decrees, and troubleshooting, marked as planned and left non-clickable until real pages exist

### Soldiers & Breeding Article

The article uses MDX and keeps the reference page's title/deck/date/media/section flow. The first version organizes the previously researched material into:

- Workforce overview
- Soldier roles or documented types
- The four soldier states, paired with available game icons or clearly labeled interface crops
- Breeding prerequisites and sequence
- Workforce allocation and practical management
- Common failure states and fixes
- Source notes and related guide links

Each language has its own MDX file, so translation can be edited without changing layout code.

## Components and Responsibilities

- `SiteHeader`: brand, desktop navigation, language switcher, and mobile menu trigger.
- `LanguageSwitcher`: preserves the current route while switching between `/en` and `/zh`.
- `WikiSidebar`: route-aware section navigation and official-game card.
- `GuideCard`: consistent clickable and planned/non-clickable states.
- `MediaCard`: image, caption, source label, and optional external source action.
- `Callout`: warning, information, and research-confidence variants.
- `MDXComponents`: maps MDX headings, lists, tables, callouts, and media to the shared visual system.
- `SiteFooter`: fan-site disclosure, official links, and links only to guide or legal pages that actually exist.

## Content and Data Flow

1. Locale middleware resolves `en` or `zh`.
2. A route loads the locale-specific messages and navigation definition.
3. The guide loader reads the matching MDX frontmatter and body.
4. The index renders cards from frontmatter; the article renders the MDX body.
5. Page metadata is generated from the same localized frontmatter.
6. The language switcher replaces only the locale segment and preserves the page path.

Missing locale or guide content returns Next.js `notFound()` rather than silently displaying the wrong language.

## Assets

Use the favicon set already stored in `output/imagegen/favicon_io` and copy the required files into `public` during implementation. Pax Autocratica screenshots or official promotional imagery may be used only with source attribution. No assets will be downloaded from the reference site.

If a suitable in-game screenshot for a requested visual is unavailable, the layout shows a styled, clearly captioned media panel; it will not invent a game mechanic or misleading screenshot.

## Responsive and Accessibility Behavior

- Desktop: centered main column with sticky right rail.
- Tablet: narrower reading column and compact rail.
- Mobile: single-column content, horizontally safe cards, wrapped CTAs, and rail content moved into an accessible disclosure menu.
- All interactive controls have visible focus states and minimum 44-pixel hit areas.
- Icons are from one consistent icon library, not emoji.
- Text and borders maintain usable contrast on the near-black background.
- Reduced-motion preferences disable nonessential transitions.

## Testing and Acceptance Criteria

- All six localized URLs render without runtime errors.
- `/` selects a supported locale and defaults to `/en`.
- Switching language preserves `/guides` and `/guides/soldiers-and-breeding`.
- Both MDX documents compile and render headings, lists, callouts, tables, media, and links.
- The guide index card opens the correct localized article.
- Navigation highlights the active section and is keyboard accessible.
- Desktop layout visually follows the reference site's header/content/right-rail proportions.
- Mobile layout has no horizontal overflow and exposes the wiki navigation through a menu.
- Each route has localized title, description, canonical URL, and alternate-language metadata.
- Favicon files resolve correctly.
- `next build` succeeds with no TypeScript or MDX compilation errors.

## Out of Scope

- Real-time Steam player statistics
- User accounts, comments, ratings, or persistent data
- Additional completed guide articles beyond Soldiers & Breeding
- Copying the reference site's proprietary content, source code, or imagery
- Deployment, unless separately requested

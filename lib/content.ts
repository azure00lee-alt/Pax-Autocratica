import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type {Locale} from '@/lib/locale';

export type GuideFrontmatter = {
  slug: string;
  order: number;
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
    .sort((a, b) => a.order - b.order);
}

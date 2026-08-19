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

  it('declares a Node range compatible with the installed test toolchain', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.engines?.node).toBe('^22.22.2 || ^24.15.0 || >=26.0.0');
  });

  it('brands the installable web app with the dark site theme', () => {
    const manifest = JSON.parse(readFileSync('public/site.webmanifest', 'utf8'));
    expect(manifest).toMatchObject({
      name: 'Pax Autocratica Wiki',
      short_name: 'Pax Wiki',
      theme_color: '#08090a',
      background_color: '#08090a'
    });
  });
});

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

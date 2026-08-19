import {defineConfig} from '@playwright/test';

if (process.platform === 'win32') {
  const system32 = `${process.env.SystemRoot ?? 'C:\\Windows'}\\System32`;
  process.env.PATH = `${system32};${process.env.PATH ?? ''}`;
}

export default defineConfig({
  testDir: './tests/e2e',
  use: {baseURL: 'http://127.0.0.1:3000'},
  webServer: {
    command: 'pnpm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {browserName: 'chromium', viewport: {width: 1440, height: 1000}}
    },
    {
      name: 'mobile-chromium',
      use: {browserName: 'chromium', viewport: {width: 390, height: 844}}
    }
  ]
});

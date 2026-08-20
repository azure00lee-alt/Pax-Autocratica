import {fileURLToPath} from 'node:url';
import {configDefaults, defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: [...configDefaults.exclude, 'tests/e2e/**', '.worktrees/**']
  },
  resolve: {alias: {'@': fileURLToPath(new URL('.', import.meta.url))}}
});

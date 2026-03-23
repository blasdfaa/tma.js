import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const tsconfigPath = mode === 'test'
    ? './tsconfig.test.json'
    : './tsconfig.build.json';

  return {
    plugins: [
      dts({ outDir: 'dist/dts', tsconfigPath }),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        external: ['@angular/core', '@tma.js/sdk'],
      },
      lib: {
        entry: 'src/index.ts',
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
    },
    test: {
      environment: 'happy-dom',
      setupFiles: ['./src/test-setup.ts'],
      include: ['src/**/*.test.ts'],
      coverage: {
        enabled: true,
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/index.ts', 'src/test-setup.ts'],
        branches: 80,
        functions: 80,
        statements: 80,
        lines: 80,
      },
    },
  };
});

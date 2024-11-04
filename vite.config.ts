import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactSVG from 'vite-plugin-svgr';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      reactSVG({
        include: '**/assets/icons/*.svg',
        // Logos (images/providers/logo) rendered as img, no need to resolve it.
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
        polyfills: ['es/object/has-own'],
        modernPolyfills: ['es/object/has-own'],
      }),
    ],
    envPrefix: 'PORTAL_',
    server: {
      proxy: {
        '/api': env.PORTAL_EXTERNAL_API,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('external-shared')) return undefined;
              if (id.includes('libphonenumber')) return 'vendor-libphonenumber';
              if (id.includes('country-list-with-dial-code-and-flag')) return 'vendor-country-list';

              if (id.includes('react')) return 'vendor-react';
              if (id.includes('country-state-city')) return 'vendor-country-state-city';
              return 'vendor';
            }
          },
        },
      },
    },
    define: {
      'process.env': {},
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
      dedupe: [
        '@emotion/cache',
        '@emotion/react',
        '@emotion/serialize',
        '@emotion/utils',
        '@mantine/carousel',
        '@mantine/core',
        '@mantine/emotion',
        '@mantine/hooks',
        '@mantine/notifications',
        'clsx',
        'country-list-with-dial-code-and-flag',
        'google-libphonenumber',
        'libphonenumber-js',
        'random',
        'react-imask',
      ],
    },
  };
});

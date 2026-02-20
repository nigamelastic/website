// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://nigamelastic.github.io',
    base: process.env.BASE_PATH || '/website',
    integrations: [
        starlight({
            title: 'Nigamelastic',
            logo: {
                src: './src/assets/logo.jpg',
            },
            head: [
                // Prevent caching of the main HTML document to ensure users see the latest updates immediately
                // This is "Fast & Reliable" because HTML is small, but ensures it points to correct hashed assets
                { tag: 'meta', attrs: { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' } },
                { tag: 'meta', attrs: { 'http-equiv': 'Pragma', content: 'no-cache' } },
                { tag: 'meta', attrs: { 'http-equiv': 'Expires', content: '0' } },
            ],
            social: [
                { label: 'GitHub', icon: 'github', href: 'https://github.com/nigamelastic' },
            ],
            sidebar: [
                {
                    label: 'Guides',
                    autogenerate: { directory: 'guides' },
                },
                {
                    label: 'YouTube',
                    autogenerate: { directory: 'youtube' },
                    collapsed: true,
                },
                {
                    label: 'Knowledge Base',
                    autogenerate: { directory: 'knowledge-base' },
                    collapsed: true,
                },
                {
                    label: 'About',
                    slug: 'about',
                },
                {
                    label: 'News',
                    slug: 'news',
                },
            ],
            customCss: [
                // Path to your custom CSS file
                './src/styles/custom.css',
            ],
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
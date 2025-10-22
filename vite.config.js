import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            fastRefresh: false,
            jsxRuntime: 'classic',
            include: /\.(jsx|js)$/
        }),
        laravel({
            input: [
                'resources/css/app.css',
                'resources/src/index.jsx'
            ],
            refresh: false,
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/src',
            '/assets': '/public/assets',
        },
    },
    server: {
        hmr: false
    }
});

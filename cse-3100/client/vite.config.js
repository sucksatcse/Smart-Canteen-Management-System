import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
            '/sanctum': 'http://localhost:8080',
            '/login': 'http://localhost:8080',
            '/logout': 'http://localhost:8080',
            '/register': 'http://localhost:8080',
        }
    }
});

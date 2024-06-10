import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import fs from 'fs';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 44330,
        //https: {
        //    key: fs.readFileSync('server.pfx'),
        //    cert: fs.readFileSync('server.pfx'),
        //},
    },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change `your-repo-name` to your actual repository name
export default defineConfig({
  plugins: [react()],
  base: '/goldytjoseph.github.io/',  // <- Add this line
});

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
 plugins: [
   vue(),
   vueDevTools(),
 ],
 resolve: {
   alias: {
     '@': fileURLToPath(new URL('./src', import.meta.url))
   },
 },
 server: {
   proxy: {
     '/api': {
       target: 'http://localhost:50987', // your backend API server
       rewrite: path => path.replace(/^\/api/, ''),
       changeOrigin: true, //Ensures the Host header is updated to match the target server.
       secure: false, // Ignore self-signed certificates
     }
   }
 },
 build: {
   outDir: '../dotnet-mvc-ai-wave/wwwroot',
   // emptyOutDir: true,
   copyPublicDir: true,
   rollupOptions: {
     input: {

       //展商報名
       "account-login": resolve(__dirname, 'pages/account-login.html'),
       

     },
     // output: {
     //   entryFileNames: chunk => {
     //     if (chunk.name === 'login') {
     //       return 'login.html';
     //     }
     //     return '[name].html';
     //   },
     // },
     output: {
       //assetFileNames: 'assets/[name][extname]?v=[hash]',
       assetFileNames: 'assets/[name][extname]',
       //chunkFileNames: '[name]--[hash].js'
       chunkFileNames: 'assets/[name].js',
       entryFileNames: 'assets/[name].js' 
     },
   },
 },
})


// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vueDevTools(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })

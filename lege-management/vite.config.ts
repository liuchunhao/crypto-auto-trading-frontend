declare const __dirname: string;

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'                // install 'TypeScript type' declaration for Node.js
                                            // npm install --save-dev @types/node

// after 2.0, use createStyleImportPlugin instead of styleImport
import {
  createStyleImportPlugin,  
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  // AntdResolve 
} from 'vite-plugin-style-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [
        AndDesignVueResolve(),
        VantResolve(),
        ElementPlusResolve(),
        NutuiResolve(),
        // AntdResolve() 
      ],
    })
  ],
  resolve: {
    alias:{
      '@': path.resolve(__dirname, './src'),   // 設定@指向src
    }
  },
})

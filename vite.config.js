import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'
import { resolve } from 'path'

// Plugin to handle optional private milestones file
function optionalPrivateFiles() {
  return {
    name: 'optional-private-files',
    resolveId(source, importer) {
      if (source.endsWith('milestones.private.js')) {
        const fullPath = resolve(importer ? importer.replace(/[^/]+$/, '') : '', source)
        if (!existsSync(fullPath)) {
          return { id: 'virtual:empty-milestones', moduleSideEffects: false }
        }
      }
      return null
    },
    load(id) {
      if (id === 'virtual:empty-milestones') {
        return 'export default null;'
      }
      return null
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [optionalPrivateFiles(), react()],
})

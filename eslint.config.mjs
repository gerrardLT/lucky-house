import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['.next/**', 'out/**', 'build/**'],
  },
  {
    rules: {
      // These rules are overly strict for legitimate patterns like:
      // - Reading localStorage to initialize client-side state
      // - Setting document.cookie in event handlers
      // - Synchronizing state with external props in effects
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]

export default eslintConfig

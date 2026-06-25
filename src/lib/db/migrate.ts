// src/lib/db/migrate.ts
// Programmatic 迁移 — 带重试机制，适配 Docker 容器启动时序

import { pool } from './index'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import path from 'path'

const MIGRATIONS_DIR = path.join(process.cwd(), 'drizzle')
const MAX_RETRIES = 5
const RETRY_DELAYS = [2000, 3000, 5000, 8000, 13000] // 指数退避

export async function runMigrations(): Promise<void> {
  const db = drizzle(pool)

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[DB] Running migrations (attempt ${attempt}/${MAX_RETRIES})...`
      )
      await migrate(db, { migrationsFolder: MIGRATIONS_DIR })
      console.log('[DB] Migrations complete')
      return
    } catch (error) {
      console.error(`[DB] Migration attempt ${attempt} failed:`, error)
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAYS[attempt - 1] ?? 10000
        console.log(`[DB] Retrying in ${delay}ms...`)
        await new Promise((r) => setTimeout(r, delay))
      } else {
        console.error(
          '[DB] All migration attempts failed. Server will continue without migrations.'
        )
        throw error
      }
    }
  }
}

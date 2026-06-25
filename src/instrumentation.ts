// src/instrumentation.ts
// Next.js 启动钩子 — Node.js runtime 初始化时自动执行数据库迁移

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runMigrations } = await import('./lib/db/migrate')
    try {
      await runMigrations()
    } catch {
      console.error('[Instrumentation] Migration failed — server continues anyway')
    }
  }
}

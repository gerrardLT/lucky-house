// src/instrumentation.ts
// Next.js 启动钩子 — Node.js runtime 初始化时自动执行数据库迁移

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 启动速率限制内存清理
    const { startRateLimitCleanup } = await import('./lib/rate-limit')
    startRateLimitCleanup()

    // 启动数据库迁移
    const { runMigrations } = await import('./lib/db/migrate')
    try {
      await runMigrations()
    } catch {
      console.error('[Instrumentation] Migration failed — server continues anyway')
    }
  }
}

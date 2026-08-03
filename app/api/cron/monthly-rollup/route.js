import { NextResponse } from 'next/server'
import { runMonthlyRollup } from '@/lib/jobs/monthly-rollup'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await runMonthlyRollup()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/cron/monthly-rollup]', err)
    return NextResponse.json({ error: 'Job failed' }, { status: 500 })
  }
}

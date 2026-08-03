import { NextResponse } from 'next/server'
import { runYearlyVoteTally } from '@/lib/jobs/yearly-vote-tally'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await runYearlyVoteTally()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/cron/yearly-tally]', err)
    return NextResponse.json({ error: 'Job failed' }, { status: 500 })
  }
}

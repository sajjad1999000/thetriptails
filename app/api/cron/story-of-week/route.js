import { NextResponse } from 'next/server'
import { runStoryOfWeekRotation } from '@/lib/jobs/story-of-week-rotation'

// Vercel Cron sends the CRON_SECRET as a Bearer token automatically
// when set as an env var — this rejects any other caller so the
// job can't be triggered by hitting the URL directly.
export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await runStoryOfWeekRotation()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/cron/story-of-week]', err)
    return NextResponse.json({ error: 'Job failed' }, { status: 500 })
  }
}

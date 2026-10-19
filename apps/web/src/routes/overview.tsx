import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'

type Health = { status: string; time: string }

export function OverviewPage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async (): Promise<Health> => {
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error(`API returned ${res.status}`)
      return res.json()
    },
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-5">
      <h1 className="text-lg font-semibold">Operations Overview</h1>
      <p className="mt-1 text-muted-foreground">Monitor active scraping runs, data coverage and operational issues.</p>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>API connection</CardTitle>
        </CardHeader>
        <CardContent>
          {health.isPending && <span className="text-muted-foreground">Checking…</span>}
          {health.isError && <span className="text-critical">Cannot reach the API: {health.error.message}. Start it with pnpm dev.</span>}
          {health.data && (
            <span>
              API is {health.data.status}, checked {new Date(health.data.time).toLocaleTimeString()}.
            </span>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Run statuses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(['running', 'at_risk', 'delayed', 'low_count', 'blocked', 'failed', 'completed', 'scheduled'] as const).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

import type { RunStatus } from '@ncc/shared'
import { cn } from '@/lib/utils'

const STYLES: Record<RunStatus, { label: string; className: string }> = {
  scheduled: { label: 'Scheduled', className: 'border-dashed border-border text-muted-foreground' },
  running: { label: 'Running', className: 'bg-ok/10 text-ok' },
  at_risk: { label: 'At risk', className: 'bg-warn/15 text-warn' },
  delayed: { label: 'Delayed', className: 'bg-warn/15 text-warn' },
  low_count: { label: 'Low count', className: 'bg-serious/15 text-serious' },
  blocked: { label: 'Blocked', className: 'bg-blocked/12 text-blocked border-blocked/30' },
  failed: { label: 'Failed', className: 'bg-critical/12 text-critical' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
}

export function StatusBadge({ status }: { status: RunStatus }) {
  const s = STYLES[status]
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded border border-transparent px-1.5 text-[11px] font-semibold uppercase tracking-wide',
        s.className,
      )}
    >
      {s.label}
    </span>
  )
}

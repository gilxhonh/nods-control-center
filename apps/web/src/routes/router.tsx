import { createRootRoute, createRoute, createRouter, Link, Outlet } from '@tanstack/react-router'
import { Activity, Building2, CalendarClock, Gauge, Globe, Layers, Ticket, Users } from 'lucide-react'
import { OverviewPage } from './overview'
import { PlaceholderPage } from './placeholder'

const NAV = [
  { to: '/', label: 'Overview', icon: Gauge },
  { to: '/deliveries', label: 'Deliveries', icon: CalendarClock },
  { to: '/requests', label: 'Weekly Requests', icon: Layers },
  { to: '/runs', label: 'Active Runs', icon: Activity },
  { to: '/clients', label: 'Clients', icon: Building2 },
  { to: '/domains', label: 'Domains', icon: Globe },
  { to: '/team', label: 'Delivery Engineers', icon: Users },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
] as const

function Shell() {
  return (
    <div className="grid h-dvh grid-cols-[232px_1fr]">
      <aside className="flex flex-col border-r border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <div className="font-semibold">Nods Control Center</div>
          <div className="text-[11px] text-muted-foreground">Scraping operations</div>
        </div>
        <nav className="flex flex-col gap-0.5 p-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: 'bg-muted text-foreground font-medium' }}
              activeOptions={{ exact: to === '/' }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

const rootRoute = createRootRoute({ component: Shell })
const overview = createRoute({ getParentRoute: () => rootRoute, path: '/', component: OverviewPage })
const others = NAV.filter((n) => n.to !== '/').map((n) =>
  createRoute({ getParentRoute: () => rootRoute, path: n.to, component: () => <PlaceholderPage title={n.label} /> }),
)

export const router = createRouter({ routeTree: rootRoute.addChildren([overview, ...others]) })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-5">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-1 text-muted-foreground">Not built yet. See prototype/index.html for the agreed design.</p>
    </div>
  )
}

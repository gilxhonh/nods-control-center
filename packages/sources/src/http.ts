export async function getJson<T>(url: string, headers: Record<string, string>): Promise<T> {
  const res = await fetch(url, { headers: { accept: 'application/json', ...headers } })
  if (!res.ok) throw new Error(`GET ${url} failed with ${res.status}`)
  return (await res.json()) as T
}

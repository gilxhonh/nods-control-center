import { getJson } from './http'

/** Mozenda sequence progress. Read-only: we never start, stop or edit agents from here. */
export function createMozendaSource(apiKey = process.env.MOZENDA_API_KEY, baseUrl = 'https://api.mozenda.com/rest') {
  if (!apiKey) throw new Error('MOZENDA_API_KEY is not set')
  return {
    // TODO: confirm the exact operation names and response shape for our Mozenda accounts.
    sequenceStatus(sequenceId: string) {
      const q = new URLSearchParams({
        WebServiceKey: apiKey,
        Service: 'Mozenda10',
        Operation: 'Sequence.GetStatus',
        SequenceID: sequenceId,
      })
      return getJson<unknown>(`${baseUrl}?${q}`, {})
    },
  }
}

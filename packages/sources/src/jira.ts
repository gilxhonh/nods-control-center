import { getJson } from './http'

export function createJiraSource(baseUrl = process.env.JIRA_BASE_URL, email = process.env.JIRA_EMAIL, token = process.env.JIRA_API_TOKEN) {
  if (!baseUrl || !email || !token) throw new Error('JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN must be set')
  const auth = { authorization: `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}` }
  return {
    search(jql: string, maxResults = 50) {
      const q = new URLSearchParams({ jql, maxResults: String(maxResults) })
      return getJson<unknown>(`${baseUrl}/rest/api/3/search/jql?${q}`, auth)
    },
  }
}

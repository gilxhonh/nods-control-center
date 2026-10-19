import { getJson } from './http'

export function createSlackSource(token = process.env.SLACK_BOT_TOKEN) {
  if (!token) throw new Error('SLACK_BOT_TOKEN is not set')
  const auth = { authorization: `Bearer ${token}` }
  return {
    channelHistory(channel: string, oldest?: string) {
      const q = new URLSearchParams({ channel, ...(oldest ? { oldest } : {}) })
      return getJson<unknown>(`https://slack.com/api/conversations.history?${q}`, auth)
    },
  }
}

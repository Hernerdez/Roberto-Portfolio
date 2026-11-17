import { NextResponse } from "next/server"
import { cacheHeaders, hasEnv, jsonError, memo } from "@/lib/api-cache"
import { fetchJson } from "@/lib/http"

export const dynamic = "force-dynamic"

const USER = "hernerdez"

export interface ContributionDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}
export interface GithubActivity {
  total: number
  weeks: ContributionDay[][]
  lastCommit: { repo: string; message: string; url: string; at: string } | null
}

const LEVEL: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

interface CalendarResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number
          weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[]
        }
      }
    }
  }
}

async function lastCommit(headers: HeadersInit): Promise<GithubActivity["lastCommit"]> {
  try {
    const search = await fetchJson<{
      items: { html_url: string; commit: { message: string; author: { date: string } }; repository: { full_name: string } }[]
    }>(`https://api.github.com/search/commits?q=author:${USER}&sort=author-date&order=desc&per_page=1`, { headers })
    const c = search.items[0]
    if (c) {
      return { repo: c.repository.full_name, message: c.commit.message.split("\n")[0], url: c.html_url, at: c.commit.author.date }
    }
  } catch (e) {
    console.warn("[api/github] commit search failed, falling back to events", e)
  }
  const events = await fetchJson<
    { type: string; created_at: string; repo: { name: string }; payload: { commits?: { message: string; sha: string }[] } }[]
  >(`https://api.github.com/users/${USER}/events/public?per_page=30`, { headers })
  const push = events.find((e) => e.type === "PushEvent" && e.payload.commits?.length)
  if (!push) return null
  const c = push.payload.commits![push.payload.commits!.length - 1]
  return {
    repo: push.repo.name,
    message: c.message.split("\n")[0],
    url: `https://github.com/${push.repo.name}/commit/${c.sha}`,
    at: push.created_at,
  }
}

async function load(): Promise<GithubActivity> {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "hernerdez.com",
  }
  const [cal, commit] = await Promise.all([
    fetchJson<CalendarResponse>("https://api.github.com/graphql", {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { login: USER } }),
    }),
    lastCommit(headers),
  ])
  const calendar = cal.data?.user?.contributionsCollection.contributionCalendar
  return {
    total: calendar?.totalContributions ?? 0,
    weeks:
      calendar?.weeks.map((w) =>
        w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVEL[d.contributionLevel] ?? 0 })),
      ) ?? [],
    lastCommit: commit,
  }
}

export async function GET() {
  if (!hasEnv("GITHUB_TOKEN")) return jsonError(503, "GitHub not configured")
  try {
    const data = await memo("github", 30 * 60_000, load)
    return NextResponse.json(data, { headers: cacheHeaders(3600) })
  } catch (e) {
    console.error("[api/github]", e)
    return jsonError(502, "GitHub unavailable")
  }
}

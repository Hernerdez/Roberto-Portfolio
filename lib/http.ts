export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

/** fetch + JSON with a hard timeout. Throws HttpError on non-2xx. */
export async function fetchJson<T>(url: string, init: RequestInit = {}, timeoutMs = 5000): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new HttpError(res.status, `${res.status} ${res.statusText} from ${new URL(url).host}`)
  return (await res.json()) as T
}

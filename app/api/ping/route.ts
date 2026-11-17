import { noStoreHeaders } from "@/lib/api-cache"

export const dynamic = "force-dynamic"

/** Empty 204 so the "ping me" button can time a real round trip. */
export async function GET() {
  return new Response(null, { status: 204, headers: noStoreHeaders() })
}
export const HEAD = GET

import { NextResponse, type NextRequest } from "next/server"
import { noStoreHeaders } from "@/lib/api-cache"

export const dynamic = "force-dynamic"

export interface Visitor {
  city: string | null
  region: string | null
  country: string | null
}

/** Vercel injects geo headers on every request (absent in `next dev`).
 *  No third-party lookup here: the ISP line is fetched client-side. */
export async function GET(req: NextRequest) {
  const h = req.headers
  const city = h.get("x-vercel-ip-city")
  const body: Visitor = {
    city: city ? decodeURIComponent(city) : null,
    region: h.get("x-vercel-ip-country-region"),
    country: h.get("x-vercel-ip-country"),
  }
  return NextResponse.json(body, { headers: noStoreHeaders() })
}

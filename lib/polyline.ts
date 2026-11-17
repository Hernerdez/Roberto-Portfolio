/* Google encoded-polyline decoder (what Strava's map.summary_polyline uses)
 * and a helper that turns the points into an SVG path in a square viewBox. */

export type LatLng = [number, number]

export function decodePolyline(str: string): LatLng[] {
  const out: LatLng[] = []
  let index = 0
  let lat = 0
  let lng = 0
  while (index < str.length) {
    for (const which of [0, 1] as const) {
      let shift = 0
      let result = 0
      let byte: number
      do {
        byte = str.charCodeAt(index++) - 63
        result |= (byte & 0x1f) << shift
        shift += 5
      } while (byte >= 0x20)
      const delta = result & 1 ? ~(result >> 1) : result >> 1
      if (which === 0) lat += delta
      else lng += delta
    }
    out.push([lat / 1e5, lng / 1e5])
  }
  return out
}

export interface RouteSketch {
  d: string
  start: { x: number; y: number }
  end: { x: number; y: number }
}

/** Fit points into a size×size box with padding, preserving aspect ratio.
 *  Longitude is scaled by cos(lat) so routes aren't squashed east-west. */
export function routeToSvgPath(points: LatLng[], size = 100, pad = 8): RouteSketch | null {
  if (points.length < 2) return null
  const midLat = points.reduce((s, p) => s + p[0], 0) / points.length
  const kx = Math.cos((midLat * Math.PI) / 180)
  const xs = points.map((p) => p[1] * kx)
  const ys = points.map((p) => p[0])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const span = Math.max(maxX - minX, maxY - minY) || 1
  const scale = (size - pad * 2) / span
  const offX = (size - (maxX - minX) * scale) / 2
  const offY = (size - (maxY - minY) * scale) / 2
  const map = (i: number) => ({
    x: +(offX + (xs[i] - minX) * scale).toFixed(2),
    y: +(size - offY - (ys[i] - minY) * scale).toFixed(2),
  })
  const pts = points.map((_, i) => map(i))
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ")
  return { d, start: pts[0], end: pts[pts.length - 1] }
}

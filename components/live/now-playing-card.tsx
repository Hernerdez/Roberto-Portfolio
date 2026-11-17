"use client"

import Image from "next/image"
import { Music2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { useLiveData } from "@/hooks/use-live-data"
import type { NowPlaying } from "@/app/api/spotify/route"

function Equalizer() {
  return (
    <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="eq-bar w-[3px] rounded-sm bg-primary" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </span>
  )
}

export function NowPlayingCard() {
  const { data, error } = useLiveData<NowPlaying>("/api/spotify", 30_000)
  if (!data) return null // loading, 503 (not configured) or any error: hide
  void error

  return (
    <Card className="h-full">
      <CardContent className="flex items-center gap-4 p-4">
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
          {data.albumArt ? (
            <Image src={data.albumArt} alt={`${data.album} cover`} fill sizes="56px" className="object-cover" />
          ) : (
            <Music2 className="m-auto h-6 w-6 text-muted-foreground" />
          )}
        </a>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            {data.isPlaying ? (
              <>
                <Equalizer /> Now playing
              </>
            ) : (
              <>
                <Music2 className="h-3 w-3" aria-hidden /> Last played
                {data.playedAt && <span className="normal-case tracking-normal">· {formatDistanceToNow(new Date(data.playedAt), { addSuffix: true })}</span>}
              </>
            )}
          </div>
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate font-medium hover:underline">
            {data.title}
          </a>
          <div className="truncate text-sm text-muted-foreground">{data.artist}</div>
        </div>
      </CardContent>
    </Card>
  )
}

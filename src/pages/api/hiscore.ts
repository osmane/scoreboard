import type { NextRequest } from "next/server"
import JSONCrush from "jsoncrush"
import { kv } from "@vercel/kv"
import { ScoreTable } from "@/services/scoretable"

export const config = {
  runtime: "edge",
}

const scoretable = new ScoreTable(kv)

export default async function handler(request: NextRequest) {
  const url = request.nextUrl
  const raw = url.searchParams.get("state")
  const json = JSON.parse(JSONCrush.uncrush(decodeURIComponent(raw)))
  const ruletype = url.searchParams.get("ruletype")
  const score = json?.score
  const player = url.searchParams.get("id")
  console.log(`adding ${ruletype} hiscore of ${score} for player ${player}`)

  await scoretable.add(ruletype, score, player, url.search)

  return Response.redirect("/leaderboard.html")
}

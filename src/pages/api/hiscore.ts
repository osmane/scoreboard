import type { NextRequest } from "next/server"
import JSONCrush from "jsoncrush"
import { kv } from "@vercel/kv"
import { ScoreData, ScoreTable } from "@/services/scoretable"

export const config = {
  runtime: "edge",
}

const scoretable = new ScoreTable(kv)

export default async function handler(request: NextRequest) {
  const url = request.nextUrl
  const raw = url.searchParams.get("state")
  const json = JSON.parse(JSONCrush.uncrush(decodeURIComponent(raw)))
  const ruletype = url.searchParams.get("ruletype")
  const base = new Date("2024").valueOf()
  const score = json?.score + (new Date().valueOf() - base) / base
  const player = url.searchParams.get("id") || "***"
  console.log(`adding ${ruletype} hiscore of ${score} for player ${player}`)

  const data = await scoretable.topTen(url.searchParams.get("ruletype"))

  if (
    !data.some((row) => {
      const rowData = row as ScoreData
      return urlState(rowData) === raw
    })
  ) {
    await scoretable.add(ruletype, score, player, url.search)
  }

  return Response.redirect(url.origin + "/leaderboard.html")
}

function urlState(row: ScoreData) {
  return new URLSearchParams(row.data).get("state")
}

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
  const state = JSONCrush.uncrush(
    decodeURIComponent(url.searchParams.get("state"))
  )
  const json = JSON.parse(state)
  console.log(state)
  console.log(url.searchParams.get("ruletype"))
  console.log(url.searchParams.get("id"))

  await scoretable.add(
    url.searchParams.get("ruletype"),
    json?.score,
    url.searchParams.get("id"),
    state
  )
  return new Response("OK")
}

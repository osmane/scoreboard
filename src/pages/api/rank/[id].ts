import type { NextRequest } from "next/server"
import { kv } from "@vercel/kv"
import { ScoreTable } from "@/services/scoretable"

export const config = {
  runtime: "edge",
}

const scoretable = new ScoreTable(kv)

export default async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ruletype = searchParams.get("ruletype")
  const id = Number(searchParams.get("id"))
  const url = await scoretable.get(ruletype, id)
  console.log(`redirecting ${ruletype} rank ${id} to ${url}`)
  return new Response(null, {
    status: 302,
    headers: {
      Location: url,
    },
  })
}

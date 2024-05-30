import type { NextRequest } from "next/server"
//import { DbFactory } from "@/db/dbfactory"
import JSONCrush from "jsoncrush"

export const config = {
  runtime: "edge",
}

export default async function handler(request: NextRequest) {
  const json = await request.json()
  console.log(json)
  const url = request.nextUrl
  const state = JSONCrush.uncrush(
    decodeURIComponent(url.searchParams.get("state"))
  )
  console.log(state)
  console.log(url.searchParams.get("ruletype"))
  console.log(url.searchParams.get("id"))
  return new Response("OK")
}

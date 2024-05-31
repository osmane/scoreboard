import type { NextRequest } from "next/server"
import { kv } from "@vercel/kv"
import { Shortener } from "@/services/shortener"

export const config = {
  runtime: "edge",
}

const shortener = new Shortener(kv)

export default async function handler(request: NextRequest) {
  const json = await request.json()
  console.log(json)
  const body = await shortener.shorten(json)
  return new Response(JSON.stringify(body))
}

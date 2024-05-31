import type { NextRequest } from "next/server"
import { kv } from "@vercel/kv"
import { Shortener } from "@/services/shortener"

export const config = {
  runtime: "edge",
}

const shortener = new Shortener(kv)

export default async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = await shortener.replay(searchParams.get("id"))
  console.log(`redirecting to ${url}`)
  return Response.redirect(url)
}

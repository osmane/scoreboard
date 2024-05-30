import type { NextRequest } from "next/server"
import { Shortener } from "@/services/shortener/shortener"
import { DbFactory } from "@/db/dbfactory"

export const config = {
  runtime: "edge",
}

const shortener = new Shortener(DbFactory.getDb())

export default async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = await shortener.replay(searchParams.get("id"))
  console.log(`redirecting to ${url}`)
  return Response.redirect(url)
}

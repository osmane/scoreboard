import type { NextRequest } from "next/server"
import { NchanPub } from "@/nchan/nchanpub"

export const config = {
  runtime: "edge",
}

export default async function handler(req: NextRequest) {
  if (req.method === "GET") {
    console.log(`connected`)
    await new NchanPub("lobby").post({action:"connected"})      
    return Response.json({ success: true })
  }
}


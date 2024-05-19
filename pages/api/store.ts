import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const json = await request.json();
  console.log(json)
  kv.set("mykey",json)
  return new Response(JSON.stringify({ success: true }))  
}


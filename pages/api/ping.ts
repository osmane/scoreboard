import type { NextRequest } from 'next/server'
//import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'X-RateLimit-Limit': '1',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': '0',
    },
  })
}

import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  const body = await kv.get(`url${id}`);
  console.log(body)
  return new Response(JSON.stringify(body), {
    status: 200    
  })
}


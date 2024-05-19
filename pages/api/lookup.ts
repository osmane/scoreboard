import type { NextRequest } from 'next/server'
import { kv } from '@vercel/kv'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {

  const body = await kv.get('mykey');
  console.log(body)
  return new Response(JSON.stringify(body), {
    status: 200    
  })
}


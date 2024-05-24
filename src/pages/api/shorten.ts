import type { NextRequest } from 'next/server'
import { Shortener } from '@/services/shortener/shortener';
import { DbFactory } from '@/db/dbfactory';
import cors from '../../lib/cors'

export const config = {
  runtime: 'edge',
}

const shortener = new Shortener(DbFactory.getDb())

export default async function handler(request: NextRequest) {
  const json = await request.json();
  console.log(json)
  const body = await shortener.shorten(json)
  return cors(request,new Response(JSON.stringify(body)))  
}

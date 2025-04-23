// pages/api/fit/index.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { fetchGoogleFitData } from '@/lib/googleFit'
import { ollama } from '@/lib/ollama'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch Google Fit data
    const formattedData = await fetchGoogleFitData(userId)

    // Get Ollama response
    const ollamaResponse = await ollama(formattedData)

    return NextResponse.json({ ...formattedData, ollamaResponse })
  } catch (error) {
    console.error('Google Fit read error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

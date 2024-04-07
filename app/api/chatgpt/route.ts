import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  const { question } = await request.json();



  try {
    const respone = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: question }] })
    })
  } catch (error: any) {
    NextResponse.json({ error: error.message })
  }
}
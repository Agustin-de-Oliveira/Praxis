import { createTogetherAI } from '@ai-sdk/togetherai'
import { streamText, convertToModelMessages } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, persona, scenarioContext } = await req.json()

  const togetherai = createTogetherAI({
    apiKey: process.env.TOGETHER_AI_API_KEY,
  })

  const systemPrompt = `
    You are ${persona.name}, a ${persona.role} in a professional software engineering team.
    Communication Style: ${persona.communicationStyle}
    
    Current Workspace Context:
    Scenario: ${scenarioContext.title}
    Task: ${scenarioContext.ticketKey}
    Checkpoints Passed: ${scenarioContext.checkpointsPassed.join(', ')}

    Core Rules:
    1. Stay in character at all times.
    2. Never reveal you are an AI.
    3. Be helpful but don't give away the answer directly. Ask guiding questions.
    4. Keep responses concise (under 150 words).
    5. Treat the user as a colleague.
  `

  const result = await streamText({
    model: togetherai('meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toTextStreamResponse()
}

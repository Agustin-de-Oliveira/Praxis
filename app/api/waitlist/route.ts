import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body?.email
    const source = body?.source || 'landing'

    // 1. Check if email exists
    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es requerido.' }, { status: 400 })
    }

    // 2. Validate email length to prevent DoS/overflow attacks (RFC 5321 standard max length is 254)
    if (typeof email !== 'string' || email.length > 320) {
      return NextResponse.json({ error: 'El correo electrónico es demasiado largo.' }, { status: 400 })
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Por favor, ingresá una dirección de correo válida.' }, { status: 400 })
    }

    // 4. Insert into database using the server client
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, source }])

    if (error) {
      console.error('Database waitlist insertion error:', error)
      return NextResponse.json({ error: 'Hubo un problema al registrar tu correo. Por favor, intentalo de nuevo.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: any) {
    console.error('API Waitlist catch error:', err)
    return NextResponse.json({ error: 'Ocurrió un error inesperado al procesar tu solicitud.' }, { status: 500 })
  }
}

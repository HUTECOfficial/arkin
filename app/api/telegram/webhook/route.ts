import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// In-memory conversation history per chat (resets on server restart)
const conversationHistory = new Map<number, Array<{ role: 'user' | 'assistant'; content: string }>>()

function getTelegramAPI() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN not set')
  return `https://api.telegram.org/bot${token}`
}

async function sendTelegramMessage(chatId: number, text: string, parseMode = 'HTML') {
  const api = getTelegramAPI()
  const res = await fetch(`${api}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('Telegram sendMessage error:', err)
  }
}

async function sendTelegramTyping(chatId: number) {
  const api = getTelegramAPI()
  await fetch(`${api}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  })
}

async function getProperties() {
  try {
    const { data, error } = await getSupabase()
      .from('propiedades')
      .select('id, titulo, ubicacion, precio, precio_texto, tipo, habitaciones, banos, area, categoria, status')
      .eq('status', 'Disponible')
      .limit(50)
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

function buildSystemPrompt(properties: any[]) {
  const propSummary = properties.map(p =>
    `[ID:${p.id}] ${p.titulo} | ${p.ubicacion} | ${p.precio_texto || p.precio} | ${p.tipo} | ${p.habitaciones}hab ${p.banos}baños ${p.area}m² | ${p.categoria || 'venta'}`
  ).join('\n')

  return `Eres ARKIN AI, el asistente virtual de ARKIN SELECT — plataforma inmobiliaria premium en León, Guanajuato, México.
Estás respondiendo a través de Telegram.

PROPIEDADES DISPONIBLES:
${propSummary || 'No hay propiedades disponibles en este momento.'}

INSTRUCCIONES:
- Responde SIEMPRE en español, de forma amable y profesional
- Sé conciso — máximo 3-4 oraciones
- Cuando encuentres propiedades relevantes, menciona sus IDs así: [ID:X]
- Formatea con HTML de Telegram: <b>negrita</b>, <i>cursiva</i>, <a href="...">link</a>
- Para contacto: +52 477 475 6951 | arkinselect@gmail.com
- Para ver propiedades completas: https://www.arkinselect.com/propiedades
- Si el usuario quiere hablar con un asesor humano, dales el WhatsApp: wa.me/5214774756951

COMANDOS ESPECIALES:
- /start → Presentate y explica qué puedes hacer
- /propiedades → Lista las primeras 5 propiedades disponibles
- /contacto → Da información de contacto completa
- /asesor → Ofrece conectar con un asesor humano`
}

function formatPropertyForTelegram(p: any) {
  const url = `https://www.arkinselect.com/propiedades/${p.id}`
  return `🏠 <b>${p.titulo?.toUpperCase()}</b>\n📍 ${p.ubicacion}\n💰 ${p.precio_texto || p.precio}\n🛏 ${p.habitaciones} hab · 🚿 ${p.banos} baños · 📐 ${p.area}m²\n<a href="${url}">Ver propiedad →</a>`
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()

    // Handle message updates
    const message = update.message || update.edited_message
    if (!message) {
      return NextResponse.json({ ok: true })
    }

    const chatId: number = message.chat.id
    const text: string = message.text || ''
    const firstName = message.from?.first_name || 'Usuario'

    // Show typing indicator
    await sendTelegramTyping(chatId)

    // Handle /miid command - returns the user's Telegram ID
    if (text === '/miid') {
      await sendTelegramMessage(chatId, `🆔 Tu Telegram ID es: <b>${message.from?.id}</b>\n\nComparte este número con el administrador para obtener acceso completo.`)
      return NextResponse.json({ ok: true })
    }

    // Handle /start command
    if (text === '/start') {
      conversationHistory.delete(chatId)
      await sendTelegramMessage(chatId,
        `🏠 <b>¡Bienvenido a ARKIN SELECT!</b>\n\n` +
        `Hola <b>${firstName}</b>, soy <b>ARKIN AI</b> 🤖, tu asistente inmobiliario inteligente.\n\n` +
        `Puedo ayudarte a:\n` +
        `🔍 Buscar propiedades por zona, precio y características\n` +
        `� Asesorarte sobre precios y zonas de León, Gto.\n` +
        `📋 Explicar el proceso de compra o renta\n` +
        `📞 Conectarte con un asesor ARKIN\n\n` +
        `<b>Comandos disponibles:</b>\n` +
        `/propiedades — Ver propiedades disponibles\n` +
        `/contacto — Información de contacto\n` +
        `/asesor — Hablar con un asesor humano\n\n` +
        `¿Qué tipo de propiedad estás buscando? 🏡`
      )
      return NextResponse.json({ ok: true })
    }

    // Handle /propiedades command
    if (text === '/propiedades') {
      const properties = await getProperties()
      if (properties.length === 0) {
        await sendTelegramMessage(chatId, 'No hay propiedades disponibles en este momento. Contacta a nuestro equipo: +52 477 475 6951')
        return NextResponse.json({ ok: true })
      }
      const first5 = properties.slice(0, 5)
      const msgs = first5.map(formatPropertyForTelegram).join('\n\n──────────\n\n')
      await sendTelegramMessage(chatId, `📋 <b>PROPIEDADES DISPONIBLES</b>\n\n${msgs}\n\n🔍 <a href="https://www.arkinselect.com/propiedades">Ver todas →</a>`)
      return NextResponse.json({ ok: true })
    }

    // Handle /contacto command
    if (text === '/contacto') {
      await sendTelegramMessage(chatId, `📞 <b>CONTACTO ARKIN SELECT</b>\n\n📱 WhatsApp: <a href="https://wa.me/5214774756951">+52 477 475 6951</a>\n📧 Email: arkinselect@gmail.com\n📍 León, Guanajuato, México\n🌐 <a href="https://www.arkinselect.com">www.arkinselect.com</a>\n\n⏰ Atención: Lunes a Sábado 9am - 7pm`)
      return NextResponse.json({ ok: true })
    }

    // Handle /asesor command
    if (text === '/asesor') {
      await sendTelegramMessage(chatId, `👤 <b>HABLAR CON UN ASESOR</b>\n\nUn asesor ARKIN SELECT te atenderá personalmente.\n\n📱 <a href="https://wa.me/5214774756951?text=Hola,%20me%20interesa%20información%20sobre%20propiedades">Contactar por WhatsApp →</a>\n\nNuestros asesores están disponibles de <b>Lunes a Sábado</b>, 9am - 7pm.`)
      return NextResponse.json({ ok: true })
    }

    // General AI conversation
    const properties = await getProperties()
    const systemPrompt = buildSystemPrompt(properties)

    // Get or create conversation history
    const history = conversationHistory.get(chatId) || []

    // Add user message
    history.push({ role: 'user', content: text })

    // Keep last 20 messages for context
    const recentHistory = history.slice(-20)

    const response = await getAnthropic().messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: recentHistory,
    })

    const aiText = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract mentioned property IDs
    const idMatches = [...aiText.matchAll(/\[ID:(\d+)\]/g)]
    const mentionedIds = idMatches.map(m => parseInt(m[1]))
    const mentionedProperties = properties.filter(p => mentionedIds.includes(p.id))

    // Clean text for display
    const cleanText = aiText.replace(/\[ID:\d+\]/g, '').trim()

    // Save to history
    history.push({ role: 'assistant', content: aiText })
    conversationHistory.set(chatId, history.slice(-20))

    // Send main response
    await sendTelegramMessage(chatId, cleanText)

    // Send property cards if any
    for (const prop of mentionedProperties.slice(0, 3)) {
      await sendTelegramMessage(chatId, formatPropertyForTelegram(prop))
    }

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ ok: true }) // Always return 200 to Telegram
  }
}

// GET endpoint to verify webhook
export async function GET() {
  return NextResponse.json({
    status: 'ARKIN Telegram Bot activo',
    model: 'claude-haiku-4-5',
    webhook: process.env.TELEGRAM_WEBHOOK_URL
  })
}

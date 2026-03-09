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

// In-memory conversation history per chat
const conversationHistory = new Map<number, Array<{ role: 'user' | 'assistant'; content: string }>>()

// Admin whitelist - solo estos Telegram IDs tienen acceso total
const ADMIN_IDS = [1322017996]

function isAdmin(userId: number): boolean {
  return ADMIN_IDS.includes(userId)
}

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

function buildSystemPrompt(properties: any[], admin: boolean) {
  const propSummary = properties.map(p =>
    `[ID:${p.id}] ${p.titulo} | ${p.ubicacion} | ${p.precio_texto || p.precio} | ${p.tipo} | ${p.habitaciones}hab ${p.banos}baños ${p.area}m² | ${p.categoria || 'venta'} | status:${p.status}`
  ).join('\n')

  const adminContext = admin ? `

ACCESO ADMIN TOTAL — eres el asistente del dueño de la plataforma.
Puedes ejecutar cualquier operación administrativa:
- Crear asesores: responde con JSON {"accion":"crear_asesor","nombre":"...","email":"...","telefono":"...","password":"..."}
- Cambiar status de propiedad: {"accion":"cambiar_status","id":123,"status":"Disponible|Vendido|Rentado|Pausado"}
- Ver estadísticas: {"accion":"stats"}
- Enviar notificación a todos los asesores: {"accion":"notificar","mensaje":"..."}
- Listar asesores: {"accion":"listar_asesores"}
- El dueño puede pedirte CUALQUIER COSA sobre el sistema y tienes que ayudarle
- Cuando ejecutes una acción administrativa, incluye el JSON en tu respuesta entre triple backtick json
` : ''

  return `Eres ARKIN AI, el asistente${admin ? ' ADMINISTRADOR' : ' virtual'} de ARKIN SELECT — plataforma inmobiliaria premium en León, Guanajuato, México.
Estás respondiendo a través de Telegram.${adminContext}

PROPIEDADES DISPONIBLES (${properties.length} total):
${propSummary || 'No hay propiedades.'}

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé conciso pero completo
- Cuando encuentres propiedades relevantes, menciona sus IDs así: [ID:X]
- Formatea con HTML de Telegram: <b>negrita</b>, <i>cursiva</i>, <a href="...">link</a>
- Para contacto: +52 477 475 6951 | arkinselect@gmail.com
- Para propiedades: https://www.arkinselect.com/propiedades`
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

    const userId: number = message.from?.id || 0
    const admin = isAdmin(userId)

    // Handle /miid command
    if (text === '/miid') {
      await sendTelegramMessage(chatId, `🆔 Tu Telegram ID es: <b>${userId}</b>\n${admin ? '\n✅ <b>Tienes acceso ADMIN completo</b>' : '\nComparte este número con el administrador para obtener acceso.'}`)
      return NextResponse.json({ ok: true })
    }

    // === NATURAL LANGUAGE ADMIN ACTIONS (execute directly, no Claude needed) ===
    if (admin) {
      const tl = text.toLowerCase()

      // "crea un asesor llamado X, email Y@z.com, tel 123"
      const crearAsesorMatch = tl.match(/crea(?:r)?\s+(?:un\s+)?asesor\s+(?:llamado\s+)?(.+?)\s*,?\s*email\s+([\w.+-]+@[\w.-]+\.\w+)/i)
      if (crearAsesorMatch) {
        const nombre = crearAsesorMatch[1].trim()
        const email = crearAsesorMatch[2].trim()
        const telMatch = text.match(/tel(?:[eé]fono)?[:\s]*([\d\s+()-]{7,})/i)
        const telefono = telMatch ? telMatch[1].trim() : ''
        const password = `${nombre.split(' ')[0].toLowerCase()}_arkin${new Date().getFullYear()}`
        await executeAdminAction(chatId, { accion: 'crear_asesor', nombre, email, telefono, password })
        return NextResponse.json({ ok: true })
      }

      // "cambia (la propiedad) 15 a vendida/disponible/rentada/pausada"
      const cambiarStatusMatch = tl.match(/cambia(?:r)?\s+(?:la\s+)?(?:propiedad\s+)?#?(\d+)\s+a\s+(disponible|vendid[ao]|rentad[ao]|pausad[ao])/i)
      if (cambiarStatusMatch) {
        const id = parseInt(cambiarStatusMatch[1])
        const rawStatus = cambiarStatusMatch[2].toLowerCase()
        const statusMap: Record<string, string> = {
          disponible: 'Disponible', vendida: 'Vendido', vendido: 'Vendido',
          rentada: 'Rentado', rentado: 'Rentado', pausada: 'Pausado', pausado: 'Pausado'
        }
        const status = statusMap[rawStatus] || 'Disponible'
        await executeAdminAction(chatId, { accion: 'cambiar_status', id, status })
        return NextResponse.json({ ok: true })
      }

      // "elimina/borra el anuncio X" or "borra propiedad X"
      const eliminarPropMatch = tl.match(/(?:elim[ií]na?|borra?)\s+(?:la\s+)?(?:propiedad\s+)?#?(\d+)/i)
      if (eliminarPropMatch) {
        const id = parseInt(eliminarPropMatch[1])
        const supabase = getSupabase()
        const { error } = await supabase.from('propiedades').update({ status: 'Pausado' }).eq('id', id)
        if (error) {
          await sendTelegramMessage(chatId, `❌ Error: ${error.message}`)
        } else {
          await sendTelegramMessage(chatId, `✅ Propiedad <b>#${id}</b> marcada como <b>Pausada</b> (ocultada del sitio)`)
        }
        return NextResponse.json({ ok: true })
      }
    }

    // === ADMIN COMMANDS ===
    if (admin) {
      // /admin - panel de control
      if (text === '/admin') {
        await sendTelegramMessage(chatId,
          `⚙️ <b>PANEL ADMIN ARKIN SELECT</b>\n\n` +
          `Comandos administrativos:\n\n` +
          `👤 /nuevo_asesor — Crear nuevo asesor\n` +
          `📋 /asesores — Ver todos los asesores\n` +
          `🏠 /todas_propiedades — Ver todas (inc. pausadas)\n` +
          `📊 /stats — Estadísticas del sistema\n` +
          `� /panel — Link al panel de administración\n\n` +
          `💬 O simplemente escríbeme en lenguaje natural:\n` +
          `<i>"crea un asesor llamado Juan con email juan@arkin.mx"</i>\n` +
          `<i>"cambia la propiedad 15 a vendida"</i>\n` +
          `<i>"cuántas propiedades disponibles hay"</i>`
        )
        return NextResponse.json({ ok: true })
      }

      // /panel - links al panel admin
      if (text === '/panel') {
        await sendTelegramMessage(chatId,
          `🌐 <b>PANELES DE ADMINISTRACIÓN</b>\n\n` +
          `🔧 <a href="https://www.arkinselect.com/panel-admin">Panel Admin →</a>\n` +
          `👤 <a href="https://www.arkinselect.com/panel-asesor">Panel Asesor →</a>\n` +
          `📸 <a href="https://www.arkinselect.com/panel-fotografo">Panel Fotógrafo →</a>\n` +
          `🏢 <a href="https://www.arkinselect.com/panel-broker">Panel Broker →</a>\n` +
          `🗺️ <a href="https://www.arkinselect.com/desarrollos">Desarrollos →</a>`
        )
        return NextResponse.json({ ok: true })
      }

      // /stats - estadísticas
      if (text === '/stats') {
        const supabase = getSupabase()
        const [propRes, userRes] = await Promise.all([
          supabase.from('propiedades').select('status, categoria', { count: 'exact' }),
          supabase.from('usuarios').select('role', { count: 'exact' }),
        ])
        const props = propRes.data || []
        const users = userRes.data || []
        const disponibles = props.filter((p: any) => p.status === 'Disponible').length
        const vendidas = props.filter((p: any) => p.status === 'Vendido').length
        const rentadas = props.filter((p: any) => p.status === 'Rentado').length
        const asesores = users.filter((u: any) => u.role === 'asesor').length
        const admins = users.filter((u: any) => u.role === 'admin').length
        await sendTelegramMessage(chatId,
          `📊 <b>ESTADÍSTICAS ARKIN SELECT</b>\n\n` +
          `🏠 <b>Propiedades:</b>\n` +
          `  • Disponibles: ${disponibles}\n` +
          `  • Vendidas: ${vendidas}\n` +
          `  • Rentadas: ${rentadas}\n` +
          `  • Total: ${props.length}\n\n` +
          `👥 <b>Usuarios:</b>\n` +
          `  • Asesores: ${asesores}\n` +
          `  • Admins: ${admins}\n` +
          `  • Total: ${users.length}`
        )
        return NextResponse.json({ ok: true })
      }

      // /asesores - listar asesores
      if (text === '/asesores') {
        const supabase = getSupabase()
        const { data } = await supabase
          .from('usuarios')
          .select('nombre, email, telefono, role, plan')
          .in('role', ['asesor', 'admin', 'broker'])
          .order('nombre')
        if (!data || data.length === 0) {
          await sendTelegramMessage(chatId, 'No hay asesores registrados.')
          return NextResponse.json({ ok: true })
        }
        const list = data.map((u: any) => `• <b>${u.nombre}</b> (${u.role}) — ${u.email} ${u.telefono || ''}`).join('\n')
        await sendTelegramMessage(chatId, `👥 <b>EQUIPO ARKIN SELECT</b>\n\n${list}`)
        return NextResponse.json({ ok: true })
      }

      // /todas_propiedades - todas incluyendo no disponibles
      if (text === '/todas_propiedades') {
        const supabase = getSupabase()
        const { data } = await supabase
          .from('propiedades')
          .select('id, titulo, ubicacion, precio_texto, status, categoria')
          .order('created_at', { ascending: false })
          .limit(10)
        if (!data || data.length === 0) {
          await sendTelegramMessage(chatId, 'No hay propiedades.')
          return NextResponse.json({ ok: true })
        }
        const list = data.map((p: any) => `[${p.id}] <b>${p.titulo}</b> — ${p.precio_texto} — <i>${p.status}</i>`).join('\n')
        await sendTelegramMessage(chatId, `🏠 <b>ÚLTIMAS 10 PROPIEDADES</b>\n\n${list}\n\n<a href="https://www.arkinselect.com/panel-admin">Ver todas en panel →</a>`)
        return NextResponse.json({ ok: true })
      }
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
    const systemPrompt = buildSystemPrompt(properties, admin)

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

    // If admin and Claude returned an action JSON, execute it
    if (admin) {
      const jsonMatch = aiText.match(/```json\s*({[\s\S]*?})\s*```/)
      if (jsonMatch) {
        try {
          const action = JSON.parse(jsonMatch[1])
          await executeAdminAction(chatId, action)
        } catch {
          // Invalid JSON, ignore
        }
      }
    }

    // Send main response
    const displayText = cleanText.replace(/```json[\s\S]*?```/g, '').trim()
    if (displayText) await sendTelegramMessage(chatId, displayText)

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

// Execute admin action parsed from Claude response
async function executeAdminAction(chatId: number, action: any) {
  const supabase = getSupabase()

  if (action.accion === 'crear_asesor') {
    const password = action.password || `${action.nombre?.split(' ')[0]?.toLowerCase()}_arkin2025`
    // Create in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: action.email,
      password,
      email_confirm: true,
    })
    if (authError) {
      await sendTelegramMessage(chatId, `❌ Error al crear asesor: ${authError.message}`)
      return
    }
    // Create profile in usuarios table
    await supabase.from('usuarios').insert({
      id: authData.user.id,
      email: action.email,
      nombre: action.nombre,
      telefono: action.telefono || '',
      role: action.role || 'asesor',
    })
    await sendTelegramMessage(chatId,
      `✅ <b>Asesor creado exitosamente</b>\n\n` +
      `👤 <b>${action.nombre}</b>\n` +
      `📧 ${action.email}\n` +
      `🔑 Contraseña: <code>${password}</code>\n` +
      `🔗 <a href="https://www.arkinselect.com/login">Acceder al panel →</a>`
    )
  }

  else if (action.accion === 'cambiar_status') {
    const { error } = await supabase
      .from('propiedades')
      .update({ status: action.status })
      .eq('id', action.id)
    if (error) {
      await sendTelegramMessage(chatId, `❌ Error: ${error.message}`)
    } else {
      await sendTelegramMessage(chatId, `✅ Propiedad <b>#${action.id}</b> actualizada a <b>${action.status}</b>`)
    }
  }

  else if (action.accion === 'stats') {
    const [propRes, userRes] = await Promise.all([
      supabase.from('propiedades').select('status'),
      supabase.from('usuarios').select('role'),
    ])
    const props = propRes.data || []
    const users = userRes.data || []
    const stats = [
      `📊 Propiedades: ${props.length} total`,
      `  ✅ Disponibles: ${props.filter((p: any) => p.status === 'Disponible').length}`,
      `  🏷 Vendidas: ${props.filter((p: any) => p.status === 'Vendido').length}`,
      `👥 Usuarios: ${users.length} total`,
      `  👤 Asesores: ${users.filter((u: any) => u.role === 'asesor').length}`,
    ].join('\n')
    await sendTelegramMessage(chatId, stats)
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

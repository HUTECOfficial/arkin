import { NextRequest, NextResponse } from 'next/server'
import { stripe, getSuccessUrl, getCancelUrl } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, userEmail } = await req.json()

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Solo crear checkout para Plan Elite
    if (planId !== 'elite') {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Crear Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: 'Plan Elite - ARKIN SELECT',
              description: 'Propiedades ilimitadas + Asistente con IA',
            },
            unit_amount: 99900, // $999.00 MXN en centavos
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: {
        userId,
        planId,
      },
      success_url: getSuccessUrl('{CHECKOUT_SESSION_ID}'),
      cancel_url: getCancelUrl(),
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'es',
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    )
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import StripeService, { stripe, webhookSecret } from '#services/stripe_service'
import UserService from '#services/user_service'
import Stripe from 'stripe'
import { cache } from '#config/cache'

@inject()
export default class StripeController {
  constructor(
    protected stripeService: StripeService,
    protected userService: UserService
  ) {}
  async postPayment({ request, response }: HttpContext) {
    const signature = request.header('stripe-signature')

    if (!signature) return response.status(400).send('Signature not provided')

    const body = request.raw()

    if (!body) return response.status(400).send('Body not provided')

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`)
    }
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
          expand: ['line_items'],
        })

        const customer = (await stripe.customers.retrieve(
          session.customer as string
        )) as Stripe.Response<Stripe.Customer>
        const priceId = session?.line_items?.data[0]?.price?.id

        if (!priceId) break

        const plans = await this.stripeService.getPlans()

        const plan = plans.find((_plan) => _plan.priceId === priceId)

        if (!plan) break
        if (!customer.email) throw new Error('No email provided')

        const user = await this.userService.findUser('email', customer.email)

        if (!user) {
          await this.userService.sendUserAuthMailWithProduct({
            email: customer.email,
            name: customer.name || '',
            customerId: customer.id,
            priceId,
            plan: 1,
            provider: 'credentials',
          })

          break
        }

        user.priceId = priceId || null
        user.customerId = customer.id
        user.plan = 1

        await user.save()

        break
      }
      case 'customer.subscription.deleted': {
        const subscription = await stripe.subscriptions.retrieve(event.data.object.id)

        const user = await this.userService.findUser('customerId', String(subscription.customer))

        if (!user) break

        user.plan = 0

        await user.save()

        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    response.status(200).send('ok')
  }

  async getProducts({ response }: HttpContext) {
    const products = await cache.getOrSet(
      'products',
      async () => await this.stripeService.getPlans()
    )

    return response.status(200).send(products)
  }

  async getInvoices({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    if (!user.customerId) return response.status(200).send({ data: [] })

    const invoices = await cache.getOrSet(`invoices:${user.customerId}`, async () => {
      if (!user.customerId) return []
      return await this.stripeService.getInvoices(user.customerId)
    })

    return response.status(200).send(invoices)
  }
}

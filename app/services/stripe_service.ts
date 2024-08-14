import Stripe from 'stripe'
import env from '#start/env'
import { productsValidator } from '#validators/products_validator'

export const stripe = new Stripe(env.get('STRIPE_API_KEY'))
export const webhookSecret = env.get('STRIPE_WEBHOOK_SECRET')

export default class StripeService {
  async getPlans() {
    const paymentLinks = await stripe.paymentLinks.list({
      active: true,
    })
    const products = []

    for (const paymentLink of paymentLinks.data) {
      const item = await stripe.paymentLinks.listLineItems(paymentLink.id)
      products.push({
        link: paymentLink.url,
        priceId: item.data[0].price?.id,
        price: item.data[0].price?.unit_amount,
        duration: item.data[0].price?.recurring?.interval,
      })
    }

    const parsedProducts = await productsValidator.validate(products)

    return parsedProducts
  }

  async getInvoices(customerId: string) {
    const invoices = await stripe.invoices.list({
      customer: customerId,
    })
    return invoices
  }
}

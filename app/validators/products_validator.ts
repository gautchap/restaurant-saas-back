import vine from '@vinejs/vine'

export const productsValidator = vine.compile(
  vine.array(
    vine.object({
      link: vine.string().trim().minLength(1).url(),
      priceId: vine.string().trim().minLength(1),
      price: vine.number(),
      duration: vine.enum(['month', 'year']),
    })
  )
)

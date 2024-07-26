import vine from '@vinejs/vine'

export const createBookingValidator = vine.compile(
  vine.object({
    booking: vine.object({
      userId: vine.string().uuid(),
      date: vine.date({ formats: { utc: true } }),
      tel: vine.string().optional(),
      persons: vine.number(),
      firstName: vine.string().optional(),
      lastName: vine.string(),
      email: vine.string().email(),
      message: vine.string().optional(),
    }),
  })
)

import vine from '@vinejs/vine'

export const getBookingsValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid().trim().minLength(1),
  })
)

export const createBookingValidator = vine.compile(
  vine.object({
    booking: vine.object({
      userId: vine.string().uuid(),
      id: vine.string().uuid(),
      date: vine.date({ formats: { utc: true, locale: 'fr' } }),
      tel: vine.string().optional(),
      persons: vine.number(),
      firstName: vine.string().optional(),
      lastName: vine.string(),
      email: vine.string().email(),
      message: vine.string().optional(),
      assigned: vine.string().optional(),
      status: vine.enum(['confirmed', 'cancelled', 'completed']),
    }),
  })
)

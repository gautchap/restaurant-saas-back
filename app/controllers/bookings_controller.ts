import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createBookingValidator } from '#validators/booking_validator'
import BookingService from '#services/booking_service'

@inject()
export default class BookingsController {
  constructor(protected bookingService: BookingService) {}
  async postBooking({ request }: HttpContext) {
    const data = request.all()

    const payload = await createBookingValidator.validate(data)

    const booking = await this.bookingService.postBooking(payload)
    return booking
  }
}

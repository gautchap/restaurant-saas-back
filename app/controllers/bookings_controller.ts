import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createBookingValidator, getBookingsValidator } from '#validators/booking_validator'
import BookingService from '#services/booking_service'
import transmit from '@adonisjs/transmit/services/main'
import mail from '@adonisjs/mail/services/main'
import sendBookingConfirmation from '#resources/views/emails/booking_email'

@inject()
export default class BookingsController {
  constructor(protected bookingService: BookingService) {}
  async createBookingWithoutAuth({ request, response }: HttpContext) {
    const data = request.all()

    const payload = await createBookingValidator.validate(data)

    const booking = await this.bookingService.createBooking(payload.booking)

    response.status(200).send(booking)

    transmit.broadcast(`user/${booking.userId}/bookings`, { booking: JSON.stringify(booking) })

    await mail.send((message) => {
      message
        .to(booking.email)
        .subject('Confirmation de réservation')
        .html(sendBookingConfirmation(booking))
    })

    return booking
  }
  async getBookings({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')

    const data = request.all()
    const payload = await getBookingsValidator.validate(data)

    const bookings = await this.bookingService.getBookings(payload.userId)

    return bookings
  }

  async createBookingWithAuth({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    if (!user) return response.status(401).send('Unauthorized')
    const data = request.all()

    const payload = await createBookingValidator.validate(data)

    const booking = await this.bookingService.createBooking(payload.booking)

    return booking
  }
}

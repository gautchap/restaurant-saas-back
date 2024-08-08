import { DateTime } from 'luxon'
import Booking from '#models/booking'
import User from '#models/user'

type CreateBookingProps = {
  userId: string
  id: string
  date: Date
  persons: number
  lastName: string
  email: string
  message?: string
}

export default class BookingService {
  async createBooking(_booking: CreateBookingProps) {
    const timestamp = Date.parse(String(_booking.date))
    const date = DateTime.fromMillis(timestamp)

    const newBooking = {
      ..._booking,
      date: date,
    }

    const booking = await Booking.updateOrCreate(
      { userId: newBooking.userId, id: newBooking.id },
      newBooking
    )

    return booking
  }

  async getBookings(userId: User['id']) {
    const user = await User.findOrFail(userId)
    const bookings = await user.related('bookings').query()

    return bookings
  }
}

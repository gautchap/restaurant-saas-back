import Booking from '#models/booking'
import User from '#models/user'

type CreateBookingProps = {
  userId: string
  date: Date
  persons: number
  lastName: string
  email: string
  message?: string
}

export default class BookingService {
  async createBooking(_booking: CreateBookingProps) {
    const booking = await Booking.create(_booking)

    return booking
  }

  async getBookings(userId: User['id']) {
    const user = await User.findOrFail(userId)
    const bookings = await user.related('bookings').query()

    return bookings
  }
}

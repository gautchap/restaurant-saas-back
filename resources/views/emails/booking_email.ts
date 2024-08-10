import type Booking from '#models/booking'

export default function sendBookingConfirmation(booking: Booking) {
  const date = new Date(String(booking.date))
  return `
    <div>
      <h1>Réservation confirmée</h1>
      <p>Votre réservation est confirmée pour le ${date.toLocaleDateString('fr-FR')} à ${date.getHours() + 2}h</p>
    </div>
  `
}

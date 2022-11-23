import { Booking } from './Booking'
import { MQTTResponse } from './MQTTResponse'

export interface BookingsResponse extends MQTTResponse {
  bookings: Booking[]
}

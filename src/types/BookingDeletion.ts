import { MQTTResponse } from './MQTTResponse'

export interface BookingDeletion extends MQTTResponse {
  bookingId: string
}

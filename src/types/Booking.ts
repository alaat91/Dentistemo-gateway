import { MQTTResponse } from './MQTTResponse'

export interface Booking extends MQTTResponse {
  time: string
  requestid: number
}

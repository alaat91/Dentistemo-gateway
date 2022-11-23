import { MQTTResponse } from './MQTTResponse'

export interface VerificationResponse extends MQTTResponse {
  verified: boolean
}

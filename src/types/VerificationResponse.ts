import { MQTTResponse } from './MQTTResponse'

export interface VerificationResponse extends MQTTResponse {
  user_id: string
}

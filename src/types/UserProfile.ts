import { MQTTResponse } from './MQTTResponse'

export interface UserProfile extends MQTTResponse {
  firstName: string
  lastName: string
  email: string
}

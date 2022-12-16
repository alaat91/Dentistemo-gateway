import { MQTTResponse } from './MQTTResponse'

export interface Clinic extends MQTTResponse {
  _id: string
  name: string
  owner: string
  dentists: number
  adress: string
  coordinates: string
  openinghours: {
    [key: string]: string
  }
}

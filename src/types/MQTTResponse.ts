export interface MQTTResponse {
  userid: string
  error?: {
    code: number
    message: string
  }
}

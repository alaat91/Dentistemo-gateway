import { QoS } from 'mqtt'
import { client } from '../app'
import { MQTTResponse } from '../types/MQTTResponse'
import { PublishMessage } from '../types/PublishMessage'

export const getMQTTResponse = async (
  pubTopic: string,
  subTopic: string,
  pubMessage: PublishMessage,
  QOS?: number
): Promise<MQTTResponse> => {
  const mqttPromise = new Promise<MQTTResponse>((resolve, reject) => {
    client.subscribe(subTopic, { qos: (QOS as QoS) ?? 1 })
    client.publish(pubTopic, JSON.stringify(pubMessage), {
      qos: (QOS as QoS) ?? 1,
    })
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 15000)
    client.on('message', (topic: string, message: string) => {
      if (topic === subTopic) {
        resolve(JSON.parse(message))
      }
    })
  })
  return mqttPromise
}

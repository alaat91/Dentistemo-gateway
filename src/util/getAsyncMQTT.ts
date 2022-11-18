import { QoS } from 'mqtt'
import { client } from '../app'

export const getAsyncMQTT = async (
  pubTopic: string,
  subTopic: string,
  message: JSON,
  QOS?: number
): Promise<JSON> => {
  const mqttPromise = new Promise((resolve, reject) => {
    client.publish(pubTopic, message.toString(), { qos: (QOS as QoS) ?? 1 })
    client.subscribe(subTopic)
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 15000)
    client.on('message', (topic, message2) => {
      if (topic === subTopic) {
        resolve(JSON.parse(message2.toString()))
      }
    })
  })
  return (await mqttPromise) as JSON
}

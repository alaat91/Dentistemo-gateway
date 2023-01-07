import { QoS } from 'mqtt'
import { client } from '../app'
import { MQTTResponse } from '../types/MQTTResponse'
import { PublishMessage } from '../types/PublishMessage'
import { v4 as uuidv4 } from 'uuid'

/**
 * A function to get a response from the MQTT broker and return it as a promise
 * This aims to use transform MQTT request into a promise based request
 * @param pubTopic the topic to publish to
 * @param subTopic the topic the response is expected on
 * @param pubMessage the message to publish
 * @param QOS the QOS of the message
 * @returns Promise<MQTTResponse>
 */
export const getMQTTResponse = async (
  pubTopic: string,
  subTopic: string,
  pubMessage: PublishMessage,
  QOS?: number
): Promise<MQTTResponse> => {
  const mqttPromise = new Promise<MQTTResponse>((resolve, reject) => {
    const responseTopic = `${subTopic}/${uuidv4()}`
    client.subscribe(responseTopic, { qos: (QOS as QoS) ?? 1 })
    client.publish(pubTopic, JSON.stringify({ ...pubMessage, responseTopic }), {
      qos: (QOS as QoS) ?? 1,
    })
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 1000)
    client.on('message', (topic: string, message: string) => {
      if (message.length == 0) {
        return mqttPromise
      }
      else if (topic === responseTopic) {
        const parsed = JSON.parse(message) as MQTTResponse
        resolve(parsed)
        return mqttPromise
      }
    })
  })
  return mqttPromise
}

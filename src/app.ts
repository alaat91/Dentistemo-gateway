import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
dotenv.config()

const client = mqtt.connect(process.env.MQTT_URI as string)
const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
  client.publish('test', 'Hello from gateway!')
})

app.listen(process.env.PORT ?? 3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000')
})

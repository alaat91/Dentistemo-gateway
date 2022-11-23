import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import express from 'express'
import { router as bookingController } from './controllers/booking'
import { router as userController } from './controllers/user'

dotenv.config()

export const client = mqtt.connect(process.env.MQTT_URI as string)
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/bookings', bookingController)
app.use('/api/v1/user', userController)

app.listen(process.env.PORT ?? 3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000')
})

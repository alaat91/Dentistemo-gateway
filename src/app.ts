import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import express from 'express'
import { router as bookingController } from './controllers/booking'
import { router as userController } from './controllers/user'
import { router as authController } from './controllers/authentication'
import { router as clinicController } from './controllers/clinics'
import cors from 'cors'

dotenv.config()

export const client = mqtt.connect(process.env.MQTT_URI as string)
const app = express()

app.options('*', cors())
app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/bookings', bookingController)
app.use('/api/v1/users', userController)
app.use('/api/v1/auth', authController)
app.use('/api/v1/clinics', clinicController)

app.listen(process.env.PORT ?? 3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000')
})

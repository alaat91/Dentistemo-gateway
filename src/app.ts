import mqtt from 'mqtt'
import * as dotenv from 'dotenv'
import express from 'express'
import { router as bookingController } from './controllers/booking'
import { router as userController } from './controllers/user'
import { router as authController } from './controllers/authentication'
import { router as clinicController } from './controllers/clinics'
import { requestID } from './util/requestID'
import cors from 'cors'
import CircuitBreaker from 'opossum'
import { getMQTTResponse } from './util/getMQTTResponse'

dotenv.config()

export const client = mqtt.connect(process.env.MQTT_URI as string)
export const circuitBreaker = new CircuitBreaker(getMQTTResponse, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
})
circuitBreaker.fallback(() => ({error: {code: 503, message: 'Service Unavailable'}}))

const app = express()

app.options('*', cors())
app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestID)
app.use('/api/v1/bookings', bookingController)
app.use('/api/v1/users', userController)
app.use('/api/v1/auth', authController)
app.use('/api/v1/clinics', clinicController)

app.listen(process.env.PORT ?? 3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000')
})

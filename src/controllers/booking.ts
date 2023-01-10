import { Request, Response, Router } from 'express'
import { verifyUser } from '../middleware/verifyUser'
import { Booking } from '../types/Booking'
import { BookingDeletion } from '../types/BookingDeletion'
import { BookingRequest } from '../types/BookingRequest'
import { BookingsResponse } from '../types/BookingsResponse'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'
import { getMQTTResponse } from '../util/getMQTTResponse'
import CircuitBreaker from 'opossum'
import { client } from '../app'

export const router = Router()

const circuitBreaker = new CircuitBreaker(getMQTTResponse, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
})
circuitBreaker.fallback(() => ({
  error: { code: 503, message: 'Service Unavailable' },
}))

router.get('/updated', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  client.subscribe('gateway/bookings/new')
  client.on('message', (topic) => {
    if (topic === 'gateway/bookings/new') {
      res.write('data: bookings updated\n\n')
    }
  })
  res.on('close', () => {
    client.unsubscribe('gateway/bookings/new')
    res.end()
    return
  })
})

router.get('/', verifyUser, async (req: Request, res: Response) => {
  try {
    const response = (await circuitBreaker.fire(
      'bookings/get/all',
      'gateway/bookings/get/all',
      { user_id: req.user_id }
    )) as BookingsResponse
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.json(response)
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).send(err.message)
    } else {
      res.status(500).send((err as Error).message)
    }
  }
})

router.delete('/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.params.id
  try {
    const response = (await circuitBreaker.fire(
      'bookings/delete',
      'gateway/bookings/delete',
      { user_id: req.user_id, bookingId }
    )) as BookingDeletion
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.send(response)
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).send(err.message)
    } else {
      res.status(500).send((err as Error).message)
    }
  }
})

router.get('/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.params.id
  try {
    const response = (await circuitBreaker.fire(
      'user/booking',
      'gateway/user/booking',
      { user_id: req.user_id, bookingId }
    )) as Booking
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.send(response)
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).send(err.message)
    } else {
      res.status(500).send((err as Error).message)
    }
  }
})

router.post('/', verifyUser, async (req: Request, res: Response) => {
  const request = req.body as BookingRequest
  try {
    const response = (await circuitBreaker.fire(
      'bookings/new',
      'gateway/bookings/new',
      { request_id: req.request_id, user_id: req.user_id, ...request }
    )) as Booking
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.send(response)
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).send(err.message)
    } else {
      res.status(500).send((err as Error).message)
    }
  }
})

router.put('/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.params.id
  const { time } = req.body
  try {
    const response = (await circuitBreaker.fire(
      'user/booking/update',
      'gateway/user/booking/update',
      { user_id: req.user_id, bookingId, time }
    )) as Booking
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.send(response)
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).send(err.message)
    } else {
      res.status(500).send((err as Error).message)
    }
  }
})

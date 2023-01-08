import { Request, Response, Router } from 'express'
import { verifyUser } from '../middleware/verifyUser'
import { Booking } from '../types/Booking'
import { BookingDeletion } from '../types/BookingDeletion'
import { BookingRequest } from '../types/BookingRequest'
import { BookingsResponse } from '../types/BookingsResponse'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'
import { getMQTTResponse } from '../util/getMQTTResponse'
import CircuitBreaker from 'opossum'

export const router = Router()

const circuitBreaker = new CircuitBreaker(getMQTTResponse, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
})
circuitBreaker.fallback(() => ({
  error: { code: 503, message: 'Service Unavailable' },
}))

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

router.delete('/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.body.id
  try {
    const response = (await circuitBreaker.fire(
      'user/booking/delete',
      'gateway/user/booking/delete',
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

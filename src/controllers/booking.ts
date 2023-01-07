import { Request, Response, Router } from 'express'

export const router = Router()

import { verifyUser } from '../middleware/verifyUser'
import { Booking } from '../types/Booking'
import { BookingDeletion } from '../types/BookingDeletion'
import { BookingRequest } from '../types/BookingRequest'
import { BookingsResponse } from '../types/BookingsResponse'
import { getMQTTResponse } from '../util/getMQTTResponse'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'

router.get('/', verifyUser, async (req: Request, res: Response) => {
  try {
    const response = (await getMQTTResponse(
      'bookings/user/bookings',
      'gateway/user/bookings',
      { user_id: req.user_id }
    )) as BookingsResponse
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.send(response.bookings)
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
    const response = (await getMQTTResponse(
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
    const response = (await getMQTTResponse(
      'user/booking/create',
      'gateway/user/booking/create',
      { user_id: req.user_id, ...request }
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
    const response = (await getMQTTResponse(
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
    const response = (await getMQTTResponse(
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

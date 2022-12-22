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
  const info = { userid: '3', requestid: 10, time: '10:30' }
  try {
    const response = (await getMQTTResponse(
      'bookings/user/bookings',
      'gateway/user/bookings',
      { userid: info.userid }
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
  const userid = '1'
  try {
    const response = (await getMQTTResponse(
      'user/booking',
      'gateway/user/booking',
      { bookingId, userid }
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
  const userid = '1'
  const request = req.body as BookingRequest
  const { issuance } = request
  try {
    const response = (await getMQTTResponse(
      'user/booking/create',
      'gateway/user/booking/create',
      { userid, issuance }
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
  const userid = '1'
  const bookingId = req.params.id
  const { time } = req.body

  try {
    const response = (await getMQTTResponse(
      'user/booking/update',
      'gateway/user/booking/update',
      { userid, bookingId, time }
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
  const userid = req.body.id
  const bookingId = req.body.id
  try {
    const response = (await getMQTTResponse(
      'user/booking/delete',
      'gateway/user/booking/delete',
      { userid, bookingId }
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

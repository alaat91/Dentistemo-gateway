import { Request, Response, Router } from 'express'

const router = Router()

import { verifyUser } from '../middleware/verifyUser'
import { Booking } from '../types/Booking'
import { BookingDeletion } from '../types/BookingDeletion'
import { BookingRequest } from '../types/BookingRequest'
import { BookingsResponse } from '../types/BookingsResponse'
import { getMQTTResponse } from '../util/getMQTTResponse'

router.get('/bookings', verifyUser, async (req: Request, res: Response) => {
  const info = { userid: '3', requestid: 10, time: '10:30' }
  try {
    const response = (await getMQTTResponse(
      'bookings/user/bookings',
      'gateway/user/bookings',
      { userid: info.userid }
    )) as BookingsResponse
    res.send(response.bookings)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.get('/bookings/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.params.id
  try {
    const response = (await getMQTTResponse(
      'user/booking',
      'gateway/user/booking',
      { bookingId }
    )) as Booking
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.post('bookings', verifyUser, async (req: Request, res: Response) => {
  const userid = '1'
  const request = req.body as BookingRequest
  const { issuance } = request
  try {
    const response = (await getMQTTResponse(
      'user/booking/create',
      'gateway/user/booking/create',
      { userid, issuance }
    )) as Booking
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('bookings/:id', verifyUser, async (req: Request, res: Response) => {
  const userid = '1'
  const bookingId = req.params.id
  const { time } = req.body

  try {
    const response = (await getMQTTResponse(
      'user/booking/update',
      'gateway/user/booking/update',
      { userid, bookingId, time }
    )) as Booking
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.delete(
  'bookings/:id',
  verifyUser,
  async (req: Request, res: Response) => {
    const userid = req.body.id
    const bookingId = req.body.id
    try {
      const response = (await getMQTTResponse(
        'user/booking/delete',
        'gateway/user/booking/delete',
        { userid, bookingId }
      )) as BookingDeletion
      res.send(response)
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
)

export default router

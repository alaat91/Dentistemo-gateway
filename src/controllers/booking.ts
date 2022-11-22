import { Request, Response, Router } from 'express'

const router = Router()

import { verifyUser } from '../middleware/verifyUser'
import { getAsyncMQTT } from '../util/getAsyncMQTT'

interface UserBooking extends JSON {
  userid: number
  requestid: number
  time: string
}

interface UpdateBookingType extends JSON {
  userID: string
  bookingID: string
  newTimeUpdate?: string
}

interface UserBooking2 extends JSON {
  userId: string
  bookingId: string
  newTime: string
}

router.get('/bookings', verifyUser, async (req: Request, res: Response) => {
  const info = { userid: '3', requestid: 10, time: '10:30' }
  try {
    const response = (await getAsyncMQTT(
      'user/booking',
      'gateway/user/booking',
      JSON.stringify(info.userid)
    )) as UserBooking

    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.get('/bookings/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.params.id
  try {
    const response = (await getAsyncMQTT(
      'user/booking/id',
      'gateway/user/booking/id',
      JSON.stringify(bookingId)
    )) as UserBooking
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.post('bookings', verifyUser, async (req: Request, res: Response) => {
  const userId = req.body.userid
  const bookingTime = req.body.time
  try {
    const response = (await getAsyncMQTT(
      'user/booking/create',
      'gateway/user/booking/create',
      JSON.stringify({ userId, bookingTime })
    )) as UserBooking
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('bookings', verifyUser, async (req: Request, res: Response) => {
  const userId: string = req.body.id
  const bookingId: string = req.body.id
  const newTime: string = req.body.id

  try {
    const response = (await getAsyncMQTT(
      'user/booking/update',
      'gateway/user/booking/update',
      JSON.stringify({ userId, bookingId, newTime })
    )) as UserBooking

    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.delete(
  'bookings/:id',
  verifyUser,
  async (req: Request, res: Response) => {
    const userID = req.body.id
    const bookingId = req.body.id

    try {
      const response = (await getAsyncMQTT(
        'user/booking/delete',
        'gateway/user/booking/delete',
        JSON.stringify({ userID, bookingId })
      )) as UserBooking
      res.send(response)
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
)

export default router

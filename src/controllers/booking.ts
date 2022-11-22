import { Request, Response, Router } from 'express'

const router = Router()

import { verifyUser } from '../middleware/verifyUser'
import { getMQTTResponse } from '../util/getMQTTResponse'

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
    const response = await getMQTTResponse(
      'user/booking',
      'gateway/user/booking',
      { userId: info.userid }
    )

    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.get('/bookings/:id', verifyUser, async (req: Request, res: Response) => {
  const bookingId = req.params.id
  try {
    const response = await getMQTTResponse(
      'user/booking/id',
      'gateway/user/booking/id',
      { bookingId }
    )
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.post('bookings', verifyUser, async (req: Request, res: Response) => {
  const userId = req.body.userid
  const { startTime, endTime } = req.body
  try {
    const response = await getMQTTResponse(
      'user/booking/create',
      'gateway/user/booking/create',
      { userId, startTime, endTime }
    )
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('bookings/:id', verifyUser, async (req: Request, res: Response) => {
  const userId = '1'
  const bookingId = req.params.id
  const { startTime, endTime } = req.body

  try {
    const response = await getMQTTResponse(
      'user/booking/update',
      'gateway/user/booking/update',
      { userId, bookingId, startTime, endTime }
    )

    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.delete(
  'bookings/:id',
  verifyUser,
  async (req: Request, res: Response) => {
    const userId = req.body.id
    const bookingId = req.body.id

    try {
      const response = await getMQTTResponse(
        'user/booking/delete',
        'gateway/user/booking/delete',
        { userId, bookingId }
      )
      res.send(response)
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
)

export default router

import { Request, Response, Router } from 'express'

const router = Router()
import { verifyUser } from '../middleware/verifyUser'
import { getAsyncMQTT } from '../util/getAsyncMQTT'

interface UserProfile extends JSON {
  userid: number
  requestid?: number
}

router.get('profile', verifyUser, async (req: Request, res: Response) => {
  const userID = req.body.id
  try {
    const response = (await getAsyncMQTT(
      'user/profile',
      'gateway/user/profile',
      JSON.parse(userID)
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('profile', verifyUser, async (req: Request, res: Response) => {
  const userID = req.body.id

  try {
    const response = (await getAsyncMQTT(
      'user/profile/update',
      'gateway/user/profile/update',
      JSON.parse(userID)
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put(
  'profile/password',
  verifyUser,
  async (req: Request, res: Response) => {
    const userID = req.body.id
    const oldPassword = req.body.id // maybe not needed ?
    const newPassword = req.body.id

    try {
      const response = (await getAsyncMQTT(
        'user/profile/password',
        'gateway/user/profile/password',
        JSON.parse(userID)
      )) as UserProfile

      res.send(response)
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
)

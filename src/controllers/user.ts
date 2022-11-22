import { Request, Response, Router } from 'express'

const router = Router()
import { verifyUser } from '../middleware/verifyUser'
import { getMQTTResponse } from '../util/getMQTTResponse'

interface UserProfile extends JSON {
  userid: number
  requestid?: number
}

router.get('profile', verifyUser, async (req: Request, res: Response) => {
  const userID = req.body.id
  try {
    const response = await getMQTTResponse(
      'user/profile',
      'gateway/user/profile',
      JSON.parse(userID)
    )
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('profile', verifyUser, async (req: Request, res: Response) => {
  const userID = req.body.id

  try {
    const response = await getMQTTResponse(
      'user/profile/update',
      'gateway/user/profile/update',
      JSON.parse(userID)
    )
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
      const response = await getMQTTResponse(
        'user/profile/password',
        'gateway/user/profile/password',
        JSON.parse(userID)
      )

      res.send(response)
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
)

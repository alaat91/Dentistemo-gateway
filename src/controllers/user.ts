import { Request, Response, Router } from 'express'

export const router = Router()
import { verifyUser } from '../middleware/verifyUser'
import { PasswordRequest } from '../types/PasswordRequest'
import { UserProfile } from '../types/UserProfile'
import { getMQTTResponse } from '../util/getMQTTResponse'

router.get('/profile/:id', async (req: Request, res: Response) => { //TODO fix bug verifyUser
  try {
    const userid = req.params.id
    const response = (await getMQTTResponse(
      'auth/user/return',
      'gateway/user/return',
      { userid }
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('/profile', verifyUser, async (req: Request, res: Response) => {
  const userID = req.body.id

  try {
    const response = (await getMQTTResponse(
      'auth/user/profile/update',
      'gateway/user/profile/update',
      JSON.parse(userID)
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put(
  '/profile/password',
  verifyUser,
  async (req: Request, res: Response) => {
    const userid = req.body.id
    const currentPassword = req.body.id // maybe not needed ?
    const newPassword = req.body.id

    try {
      const response = (await getMQTTResponse(
        'auth/user/profile/password',
        'gateway/user/profile/password',
        { userid, currentPassword, newPassword } as PasswordRequest
      )) as UserProfile
      res.send(response)
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
)

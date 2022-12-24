import { Request, Response, Router } from 'express'
//import { verifyUser } from '../middleware/verifyUser'
//import { PasswordRequest } from '../types/PasswordRequest'
import { UserProfile } from '../types/UserProfile'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

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

router.put('/profile/:id', async (req: Request, res: Response) => { //TODO fix bug verifyUser
  try {
    const userid = req.body
    const response = (await getMQTTResponse(
      'auth/user/update',
      'gateway/user/update',
      { userid }
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})
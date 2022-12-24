import { Request, Response, Router } from 'express'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

router.post('/signup', async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    SSN,
    password,
    confirmPassword,
    phoneNumber,
  } = req.body
  const request = {
    firstName,
    lastName,
    email,
    SSN,
    password,
    confirmPassword,
    phoneNumber
  }
  try {
    const newUser = await getMQTTResponse(
      'auth/user/create',
      'gateway/user/create',
      request
    )
    res.send(newUser)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const request = { email, password }
  try {
    const loginRequest = await getMQTTResponse(
      'auth/user/login',
      'gateway/user/login',
      request
    )
    res.send(loginRequest)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

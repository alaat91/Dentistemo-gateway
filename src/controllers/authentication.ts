import { Request, Response, Router } from 'express'
import { circuitBreaker } from '../app'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'

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
    phoneNumber,
  }
  try {
    const newUser = await circuitBreaker.fire(
      'auth/user/create',
      'gateway/user/create',
      request
    )
    if (newUser.error) {
      throw new MQTTErrorException(newUser.error)
    }
    res.send(newUser)
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      res.status(error.code).json(error.message)
    } else {
      res.status(500).json((error as Error).message)
    }
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const request = { email, password }
  try {
    const loginRequest = await circuitBreaker.fire(
      'auth/user/login',
      'gateway/user/login',
      request
    )
    if (loginRequest.error) {
      throw new MQTTErrorException(loginRequest.error)
    }
    res.send(loginRequest)
  } catch (error) {
    if (error instanceof MQTTErrorException) {
      res.status(error.code).json(error.message)
    } else {
      res.status(500).json((error as Error).message)
    }
  }
})

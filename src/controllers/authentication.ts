import { Request, Response, Router } from 'express'
import CircuitBreaker from 'opossum'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

const circuitBreaker = new CircuitBreaker(getMQTTResponse, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
})
circuitBreaker.fallback(() => ({error: {code: 503, message: 'Service Unavailable'}}))

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

import { Request, Response, Router } from 'express'
import CircuitBreaker from 'opossum'
import { verifyUser } from '../middleware/verifyUser'
import { UserProfile } from '../types/UserProfile'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

const circuitBreaker = new CircuitBreaker(getMQTTResponse, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
})
circuitBreaker.fallback(() => ({error: {code: 503, message: 'Service Unavailable'}}))

router.get('/profile/', verifyUser, async (req: Request, res: Response) => {
  try {
    const response = (await circuitBreaker.fire(
      'auth/user/return',
      'gateway/user/return',
      { user_id: req.user_id }
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.put('/profile/', verifyUser, async (req: Request, res: Response) => {
  try {
    const response = (await circuitBreaker.fire(
      'auth/user/update',
      'gateway/user/update',
      { user_id: req.user_id }
    )) as UserProfile
    res.send(response)
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
})

router.delete('/profile/', verifyUser, async (req: Request, res: Response) => {
  try {
    const response = (await circuitBreaker.fire(
      'auth/user/delete',
      'gateway/user/delete',
      { user_id: req.user_id }
    )) as UserProfile
    res.send(response)
  } catch (error) {
    res.status(500).send((error as Error).message)
  }
})

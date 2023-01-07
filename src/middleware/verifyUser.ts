import { NextFunction, Request, Response } from 'express'
import { VerificationResponse } from '../types/VerificationResponse'
import { getMQTTResponse } from '../util/getMQTTResponse'
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).send('Unauthorized')
    return
  }
  try {
    const response = (await getMQTTResponse('auth/user/verify', 'gateway/user/verify', {
      token,
    })) as VerificationResponse
    if (response.user_id) {
      req.user_id = response.user_id
      next()
    } else {
      res.status(401).send('Unauthorized')
    }
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
}

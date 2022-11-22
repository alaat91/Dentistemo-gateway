import { NextFunction, Request, Response } from 'express'
import { VerificationResponse } from '../types/VerificationResponse'
import { getMQTTResponse } from '../util/getMQTTResponse'
import { VERIFY_USER, VERIFY_USER_RESPONSE } from '../util/topics'

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = 'token'
  try {
    const response = (await getMQTTResponse(VERIFY_USER, VERIFY_USER_RESPONSE, {
      token,
    })) as VerificationResponse
    if (response.verified) {
      next()
    } else {
      res.status(401).send('Unauthorized')
    }
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
}

import { NextFunction, Request, Response } from 'express'
import { getAsyncMQTT } from '../util/getAsyncMQTT'

interface verifyUserResponse extends JSON {
  id: string
  verified: boolean
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = 'token'
  try {
    const response = (await getAsyncMQTT(
      'auth/verify',
      'gateway/auth/verify',
      JSON.parse(token)
    )) as verifyUserResponse
    if (response.verified) {
      next()
    } else {
      res.status(401).send('Unauthorized')
    }
  } catch (err) {
    res.status(500).send((err as Error).message)
  }
}

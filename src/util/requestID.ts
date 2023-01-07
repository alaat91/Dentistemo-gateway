import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

export const requestID = (req: Request, res: Response, next: NextFunction) => {
  req.request_id = uuidv4()
  next()
}

import { Router } from 'express'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

router.get('/:id/available', async (req, res) => {
  try {
    const clinic = req.params.id
    if (!clinic) {
      return res.status(400).json('Clinic ID is required')
    }
    if (!req.query.start || !req.query.end) {
      return res.status(400).json('Start and end dates are required')
    }
    const start = parseInt(req.query.start as string)
    const end = parseInt(req.query.end as string)
    const response = await getMQTTResponse(
      'clinics/slots/available',
      'gateway/clinics/available',
      { clinic, start, end }
    )
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
    res.json(response)
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).json(err.message)
    } else {
      res.status(500).json(err)
    }
  }
})

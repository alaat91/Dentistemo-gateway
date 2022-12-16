import { Router } from 'express'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

router.get('/:id/available', async (req, res) => {
  try {
    const clinic = req.params.id
    const { start: rangeStart, end: rangeEnd } = req.body
    const response = await getMQTTResponse(
      'clinics/slots/available',
      'gateway/clinics/available',
      { clinic, rangeStart, rangeEnd }
    )
    if (response.error) {
      throw new MQTTErrorException(response.error)
    }
  } catch (err) {
    if (err instanceof MQTTErrorException) {
      res.status(err.code).json(err.message)
    } else {
      res.status(500).json(err)
    }
  }
})

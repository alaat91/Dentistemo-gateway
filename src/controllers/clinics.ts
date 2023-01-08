import { Router } from 'express'
import { circuitBreaker } from '../app'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'

export const router = Router()

// get clinic by id to show available time slots
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

    const response = await circuitBreaker.fire(
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

// get all clinics
router.get('/', async (req, res) => {
  try {
    const response = await circuitBreaker.fire(
      'clinics/get/all',
      'gateway/clinics/get/all',
      {}
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
// get a clinic based on its id
router.get('/:id', async (req, res) => {
  try {
    const clinic = req.params.id
    const response = await circuitBreaker.fire(
      'clinics/get',
      'gateway/clinics/get',
      { clinic }
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

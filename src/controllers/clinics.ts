import { Router } from 'express'
import { MQTTErrorException } from '../exceptions/MQTTErrorException'
import { getMQTTResponse } from '../util/getMQTTResponse'

export const router = Router()

// get clinic by id to show available time slots
router.get('/:id/available', async (req, res) => {
  try {
    const clinic = req.params.id
    const { start, end } = req.body
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

// get all clinics
router.get('/', async (req, res) => {
  try {
    const response = await getMQTTResponse(
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
    const response = await getMQTTResponse(
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

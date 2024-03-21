import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { sendErrorResponse } from '../utils/responseUtils'

/**
 * Middleware function to validate request body against a Joi schema.
 *
 */
export const validateRequest = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body, { abortEarly: false })

    // If validation fails, send error response
    if (error) {
      // Extract error messages from validation result
      const errorsArray = error.details.map((err) => err.message)
      return sendErrorResponse(res, error.message, errorsArray, 400)
    }

    // Replace request body with validated value
    req.body = value

    // Call the next middleware function
    next()
  }
}

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { sendUnauthorizedResponse } from '../utils/responseUtils'

dotenv.config()

const secretKey = process.env.JWT_KEY || ''

/**
 * Middleware function to authenticate JWT token.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {any} - Returns next() if authentication succeeds, otherwise sends a 403 Forbidden response.
 */
export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction,
): any => {
  // Retrieve the authorization header from the request
  const authHeader = req.headers['authorization']

  // Extract the token from the authorization header
  const token = authHeader && authHeader.split(' ')[1]

  // If token is missing, send unauthorized response
  if (!token) {
    return sendUnauthorizedResponse(res)
  }

  // Verify the JWT token
  jwt.verify(token, secretKey, (err: any, user: any) => {
    // If verification fails, send forbidden response
    if (err) {
      return res.sendStatus(403).json({
        status: false,
        message: 'Forbiden',
      })
    }
    // Attach the user object to the request for further processing
    req.user = user
    // Call the next middleware function
    next()
  })
}

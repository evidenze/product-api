import { Request, Response } from 'express'
import { createUser, findUserByUsername } from '../user/userService'
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendUnauthorizedResponse,
} from '../../utils/responseUtils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sanitizeUser } from '../../utils/sanitizeUser'
import dotenv from 'dotenv'

dotenv.config()

const secretKey = process.env.JWT_KEY || ''

/**
 * Process user login.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - A Promise that resolves to the result of processing the login request.
 */
export const processLogin = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body

    // Find user by username in the database
    const user = await findUserByUsername(username)

    // If user not found, send unauthorized response
    if (!user) {
      return sendUnauthorizedResponse(res, 'Invalid username or password')
    }

    // Compare password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password)

    // If passwords do not match, send unauthorized response
    if (!passwordMatch) {
      return sendUnauthorizedResponse(res, 'Invalid username or password')
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      secretKey,
    )

    // Sanitize user object to remove sensitive information
    const sanitizedUser = sanitizeUser(user)

    // Prepare response data containing sanitized user details and JWT token
    const data = { user: sanitizedUser, token }

    // Send success response with authenticated user details and token
    return sendSuccessResponse(res, 'Login successful', data)
  } catch (error) {
    // Send error response if any error occurs during authentication process
    return sendErrorResponse(res, 'An error occurred. Please try again')
  }
}

/**
 * Process user registration.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - A Promise that resolves to the result of processing the register request.
 */
export const processRegister = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body

    // Check if user with provided username already exists
    const user = await findUserByUsername(username)

    // If user already exists, send conflict response
    if (user) {
      return sendErrorResponse(res, 'Username already exists', [], 409)
    }

    // Generate salt and hash password
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)

    // Create new user with hashed password
    const newUser = await createUser(username, hash)

    // Generate access token for the registered user
    const accessToken = jwt.sign({ username }, secretKey)

    // Sanitize user object to remove sensitive information
    const sanitizedUser = sanitizeUser(newUser)

    // Prepare response data containing sanitized user details and access token
    const responseData = { user: sanitizedUser, accessToken }

    // Send success response with registered user details and access token
    return sendSuccessResponse(
      res,
      'User registered successfully',
      responseData,
      201,
    )
  } catch (error: any) {
    // Send error response if any error occurs during registration process
    return sendErrorResponse(res, 'An error occurred. Please try again')
  }
}

import { Request, Response } from 'express'
import { processLogin, processRegister } from '../../services/auth/authService'

/**
 * Handle user login request.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - A Promise that resolves to the result of the login operation.
 */
export const login = async (req: Request, res: Response): Promise<any> => {
  return await processLogin(req, res)
}

/**
 * Handle user registration request.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<any>} - A Promise that resolves to the result of the registration operation.
 */
export const register = async (req: Request, res: Response): Promise<any> => {
  return await processRegister(req, res)
}

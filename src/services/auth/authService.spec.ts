import { processLogin, processRegister } from './authService'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendUnauthorizedResponse,
} from '../../utils/responseUtils'
import { sanitizeUser } from '../../utils/sanitizeUser'
import * as UserService from '../user/userService'

jest.mock('../../utils/responseUtils')
jest.mock('../../utils/sanitizeUser')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('processLogin', () => {
    it('should successfully authenticate and return JWT token', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock user object
      const user: any = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashed_password',
      }

      // Mock findUserByUsername to return user
      jest.spyOn(UserService, 'findUserByUsername').mockResolvedValueOnce(user)

      // Mock bcrypt.compare to return true
      ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

      // Mock jwt.sign to return token
      ;(jwt.sign as jest.Mock).mockReturnValueOnce('token')

      // Mock sanitizeUser to return sanitized user
      ;(sanitizeUser as jest.Mock).mockReturnValueOnce({
        _id: 'user_id',
        username: 'testuser',
      })

      // Call processLogin function
      await processLogin(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        'hashed_password',
      )
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user_id', username: 'testuser' },
        expect.any(String),
      )
      expect(sanitizeUser).toHaveBeenCalledWith(user)
      expect(sendSuccessResponse).toHaveBeenCalledWith(
        res,
        'Login successful',
        { user: { _id: 'user_id', username: 'testuser' }, token: 'token' },
      )
      expect(sendUnauthorizedResponse).not.toHaveBeenCalled()
      expect(sendErrorResponse).not.toHaveBeenCalled()
    })

    it('should send unauthorized response if user not found', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock findUserByUsername to return null
      jest.spyOn(UserService, 'findUserByUsername').mockResolvedValueOnce(null)

      // Call processLogin function
      await processLogin(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(sendUnauthorizedResponse).toHaveBeenCalledWith(
        res,
        'Invalid username or password',
      )
      expect(sendSuccessResponse).not.toHaveBeenCalled()
      expect(sendErrorResponse).not.toHaveBeenCalled()
    })

    it('should send unauthorized response if password does not match', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock user object
      const user: any = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashed_password',
      }

      // Mock findUserByUsername to return user
      jest.spyOn(UserService, 'findUserByUsername').mockResolvedValueOnce(user)

      // Mock bcrypt.compare to return false
      ;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

      // Call processLogin function
      await processLogin(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        'hashed_password',
      )
      expect(sendUnauthorizedResponse).toHaveBeenCalledWith(
        res,
        'Invalid username or password',
      )
      expect(sendSuccessResponse).not.toHaveBeenCalled()
      expect(sendErrorResponse).not.toHaveBeenCalled()
    })

    it('should send error response if an error occurs', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock findUserByUsername to throw an error
      jest
        .spyOn(UserService, 'findUserByUsername')
        .mockRejectedValueOnce(new Error('Database error'))

      // Call processLogin function
      await processLogin(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'An error occurred. Please try again',
      )
      expect(sendUnauthorizedResponse).not.toHaveBeenCalled()
      expect(sendSuccessResponse).not.toHaveBeenCalled()
    })
  })

  describe('processRegister', () => {
    it('should successfully register user and return access token', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock findUserByUsername to return null (user does not exist)
      jest.spyOn(UserService, 'findUserByUsername').mockResolvedValueOnce(null)

      // Mock bcrypt.genSaltSync to return salt
      ;(bcrypt.genSaltSync as jest.Mock).mockReturnValueOnce('salt')

      // Mock bcrypt.hashSync to return hashed password
      ;(bcrypt.hashSync as jest.Mock).mockReturnValueOnce('hashed_password')

      // Mock createUser to return newly created user
      const newUser: any = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashed_password',
      }
      jest.spyOn(UserService, 'createUser').mockResolvedValueOnce(newUser)

      // Mock jwt.sign to return access token
      ;(jwt.sign as jest.Mock).mockReturnValueOnce('access_token')

      // Mock sanitizeUser to return sanitized user
      ;(sanitizeUser as jest.Mock).mockReturnValueOnce({
        _id: 'user_id',
        username: 'testuser',
      })

      // Call processRegister function
      await processRegister(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10)
      expect(bcrypt.hashSync).toHaveBeenCalledWith('testpassword', 'salt')
      expect(UserService.createUser).toHaveBeenCalledWith(
        'testuser',
        'hashed_password',
      )
      expect(jwt.sign).toHaveBeenCalledWith(
        { username: 'testuser' },
        expect.any(String),
      )
      expect(sanitizeUser).toHaveBeenCalledWith(newUser)
      expect(sendSuccessResponse).toHaveBeenCalledWith(
        res,
        'User registered successfully',
        {
          user: { _id: 'user_id', username: 'testuser' },
          accessToken: 'access_token',
        },
        201,
      )
      expect(sendUnauthorizedResponse).not.toHaveBeenCalled()
      expect(sendErrorResponse).not.toHaveBeenCalled()
    })

    it('should send conflict response if user already exists', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock findUserByUsername to return existing user
      const existingUser: any = {
        _id: 'user_id',
        username: 'testuser',
        password: 'hashed_password',
      }
      jest
        .spyOn(UserService, 'findUserByUsername')
        .mockResolvedValueOnce(existingUser)

      // Call processRegister function
      await processRegister(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'Username already exists',
        [],
        409,
      )
      expect(sendSuccessResponse).not.toHaveBeenCalled()
      expect(sendUnauthorizedResponse).not.toHaveBeenCalled()
    })

    it('should send error response if an error occurs', async () => {
      // Mock request and response objects
      const req: Partial<Request> = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        },
      }
      const res: any = {
        sendUnauthorizedResponse: jest.fn(),
        sendSuccessResponse: jest.fn(),
        sendErrorResponse: jest.fn(),
      }

      // Mock findUserByUsername to throw an error
      jest
        .spyOn(UserService, 'findUserByUsername')
        .mockRejectedValueOnce(new Error('Database error'))

      // Call processRegister function
      await processRegister(req as Request, res as Response)

      // Expectations
      expect(UserService.findUserByUsername).toHaveBeenCalledWith('testuser')
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'An error occurred. Please try again',
      )
      expect(sendSuccessResponse).not.toHaveBeenCalled()
      expect(sendUnauthorizedResponse).not.toHaveBeenCalled()
    })
  })
})

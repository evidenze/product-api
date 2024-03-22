import { login, register } from '../auth/authController'
import { processLogin, processRegister } from '../../services/auth/authService' // Import individual functions for mocking
import { Request, Response } from 'express'

jest.mock('../../services/auth/authService')

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear mocks before each test
  })

  describe('login', () => {
    it('should call processLogin with request and response objects', async () => {
      const req: Partial<Request> = {
        body: { username: 'testuser', password: 'testpassword' },
      }
      const res: Partial<Response> = {}
      await login(req as Request, res as Response)
      expect(processLogin).toHaveBeenCalledWith(req, res)
    })
  })

  describe('register', () => {
    it('should call processRegister with request and response objects', async () => {
      const req: Partial<Request> = {
        body: { username: 'testuser', password: 'testpassword' },
      }
      const res: Partial<Response> = {}
      await register(req as Request, res as Response)
      expect(processRegister).toHaveBeenCalledWith(req, res)
    })
  })
})

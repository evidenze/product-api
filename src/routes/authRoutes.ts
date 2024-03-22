import { Router } from 'express'
import { login, register } from '../controllers/auth/authController'
import { validateRequest } from '../middleware/requestValidationMiddleware'
import { authSchema } from '../services/auth/validation/authValidation'

const router: Router = Router()

router.post('/login', validateRequest(authSchema), login)
router.post('/register', validateRequest(authSchema), register)

export default router

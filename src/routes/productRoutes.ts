import { Router } from 'express'
import {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product/productController'
import { authenticateToken } from '../middleware/authMiddleware'
import { validateRequest } from '../middleware/requestValidationMiddleware'
import {
  productSchema,
  updateProductSchema,
} from '../controllers/product/validation/productValidation'

const router: Router = Router()

router.use((req, res, next) => {
  if (req.path.startsWith('/products')) {
    authenticateToken(req, res, next)
  } else {
    next()
  }
})

router.post('/products', validateRequest(productSchema), addProduct)
router.get('/products/:id', getProduct)
router.put('/products/:id', validateRequest(updateProductSchema), updateProduct)
router.delete('/products/:id', deleteProduct)

export default router

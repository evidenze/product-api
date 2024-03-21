import { Request, Response } from 'express'
import {
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
} from '../../services/product/productService'

/**
 * Adds a new product by delegating the request to the createProduct service function.
 *
 * @param {Request} req - Express request object containing product details in the request body.
 * @param {Response} res - Express response object to send back the result of adding the product.
 * @returns {Promise<any>} - Promise resolving to the result of adding the product.
 */
export const addProduct = async (req: Request, res: Response): Promise<any> => {
  // Delegate the request to the createProduct service function and return the result
  return await createProduct(req, res)
}

/**
 * Retrieves a product by delegating the request to the getProductById service function.
 *
 * @param {Request} req - Express request object containing the product ID.
 * @param {Response} res - Express response object to send back the retrieved product.
 * @returns {Promise<any>} - Promise resolving to the retrieved product.
 */
export const getProduct = async (req: Request, res: Response): Promise<any> => {
  // Delegate the request to the getProductById service function and return the result
  return await getProductById(req, res)
}

/**
 * Updates a product by delegating the request to the updateProductById service function.
 *
 * @param {Request} req - Express request object containing the product ID and updated product data.
 * @param {Response} res - Express response object to send back the updated product.
 * @returns {Promise<any>} - Promise resolving to the updated product.
 */
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<any> => {
  // Delegate the request to the updateProductById service function and return the result
  return await updateProductById(req, res)
}

/**
 * Deletes a product by delegating the request to the deleteProductById service function.
 *
 * @param {Request} req - Express request object containing the ID of the product to delete.
 * @param {Response} res - Express response object to send back the result of the deletion.
 * @returns {Promise<any>} - Promise resolving to the result of the deletion operation.
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<any> => {
  // Delegate the request to the deleteProductById service function and return the result
  return await deleteProductById(req, res)
}

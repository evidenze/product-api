import { Request, Response } from 'express'
import Product, { IProduct } from '../../models/productModel'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../utils/responseUtils'

/**
 * Creates a new product based on the request body.
 *
 * @param {Request} req - Express request object containing product details in the request body.
 * @param {Response} res - Express response object to send back the result of the creation.
 * @returns {Promise<any>} - Promise resolving to the result of the creation operation.
 */
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Destructure product details from request body
    const { name, price, description, category, imageUrl, quantity } = req.body

    // Create a new product instance
    const product: IProduct = new Product({
      name,
      price,
      description,
      category,
      imageUrl,
      quantity,
    })

    // Save the new product to the database
    const newProduct = await product.save()

    // Send success response with the new product data
    return sendSuccessResponse(
      res,
      'Product created successfully',
      newProduct,
      201,
    )
  } catch (error: any) {
    // Handle any errors and send an error response
    return sendErrorResponse(res, 'An error occurred. Please try again.')
  }
}

/**
 * Retrieves a product by its ID.
 *
 * @param {Request} req - Express request object containing the product ID in the request parameters.
 * @param {Response} res - Express response object to send back the result of the retrieval.
 * @returns {Promise<any>} - Promise resolving to the result of the retrieval operation.
 */
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Extract the product ID from the request parameters
    const productId = req.params.id

    // Find the product by its ID
    const product = await Product.findById(productId)

    // If product not found, send error response
    if (!product) {
      return sendErrorResponse(res, 'Product not found', [], 404)
    } else {
      // Otherwise, send success response with the product data
      return sendSuccessResponse(res, 'Product fetched successfully', product)
    }
  } catch (error: any) {
    // Handle any errors and send an error response
    return sendErrorResponse(res, 'An error occurred. Please try again')
  }
}

/**
 * Updates a product by its ID.
 *
 * @param {Request} req - Express request object containing the product ID in the request parameters and updated product data in the request body.
 * @param {Response} res - Express response object to send back the result of the update operation.
 * @returns {Promise<any>} - Promise resolving to the result of the update operation.
 */
export const updateProductById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Extract the product ID from the request parameters
    const productId = req.params.id

    // Extract updated product data from the request body
    const { name, price, description, category, imageUrl, quantity } = req.body

    // Update the product by its ID
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, description, category, imageUrl, quantity },
      { new: true }, // Return the updated document after update
    )

    // If product not found, send error response
    if (!updatedProduct) {
      return sendErrorResponse(res, 'Product not found', [], 404)
    }

    // Otherwise, send success response with the updated product data
    return sendSuccessResponse(
      res,
      'Product updated successfully',
      updatedProduct,
    )
  } catch (error: any) {
    // Handle any errors and send an error response
    return sendErrorResponse(res, 'An error occurred. Please try again')
  }
}

/**
 * Deletes a product by its ID.
 *
 * @param {Request} req - Express request object containing the product ID in the request parameters.
 * @param {Response} res - Express response object to send back the result of the delete operation.
 * @returns {Promise<any>} - Promise resolving to the result of the delete operation.
 */
export const deleteProductById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    // Extract the product ID from the request parameters
    const productId = req.params.id

    // Attempt to find and delete the product by its ID
    const deletedProduct = await Product.findByIdAndDelete(productId)

    // If product not found, send error response
    if (!deletedProduct) {
      return sendErrorResponse(res, 'Product not found', [], 404)
    } else {
      // Otherwise, send success response
      return sendSuccessResponse(res, 'Product deleted successfully')
    }
  } catch (error: any) {
    // Handle any errors and send an error response
    return sendErrorResponse(res, 'An error occurred. Please try again')
  }
}

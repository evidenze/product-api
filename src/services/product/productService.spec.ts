import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from './productService'
import Product, { IProduct } from '../../models/productModel'
import { Response } from 'express'

describe('Product Service', () => {
  let mongoServer: MongoMemoryServer
  let productId: string

  const mockResponse = () => {
    const res: Partial<Response> = {} // Partial<Response> allows us to only mock necessary methods
    res.status = jest.fn().mockReturnValue(res) // Mock the status method to return the response object
    res.json = jest.fn().mockReturnValue(res) // Mock the json method to return the response object
    return res as Response // Cast the partial object back to Response type
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it('should create a new product', async () => {
    const productName = 'Test Product'
    const productPrice = 10.99
    const productDescription = 'Test description'
    const productCategory = 'Test category'
    const productImageUrl = 'test_image_url'
    const productQuantity = 10

    // Create a mock request and response object
    const req = {
      body: {
        name: productName,
        price: productPrice,
        description: productDescription,
        category: productCategory,
        imageUrl: productImageUrl,
        quantity: productQuantity,
      },
    } as any // Mock request object
    const res = mockResponse()

    // Call the createProduct function with mock request and response
    await createProduct(req, res)
    expect(res.status).toHaveBeenCalledWith(201) // Ensure status is set to 201
  })

  it('should return product if found', async () => {
    // Mock request parameters
    const productId = '1234567890'

    // Mock the product found by ID
    const mockProduct = {
      _id: productId,
      name: 'Test Product',
      price: 10.99,
      description: 'Test description',
      category: 'Test category',
      imageUrl: 'test_image_url',
      quantity: 10,
    }

    // Mock the Product.findById function
    jest.spyOn(Product, 'findById').mockResolvedValueOnce(mockProduct)

    // Mock the request object with the parameter
    const req: any = { params: { id: productId } }

    // Mock the response object
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    // Call the getProductById function
    await getProductById(req, res)

    // Expect a success response with the product
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product fetched successfully',
      data: mockProduct,
      status: true,
    })
  })

  it('should update product if found', async () => {
    const productId = '1234567890'

    // Mock request body with updated product details
    const updatedProductData = {
      name: 'Updated Product',
      price: 20.99,
      description: 'Updated description',
      category: 'Updated category',
      imageUrl: 'updated_image_url',
      quantity: 20,
    }

    // Mock the Product.findById function
    jest
      .spyOn(Product, 'findByIdAndUpdate')
      .mockResolvedValueOnce(updatedProductData)

    // Mock the request object with the parameter and body
    const req: any = { params: { id: productId }, body: updatedProductData }

    // Mock the response object
    const res = mockResponse()

    // Call the updateProductById function
    await updateProductById(req, res)

    // Expect a success response with the updated product
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product updated successfully',
      data: updatedProductData,
      status: true,
    })
  })

  it('should delete product if found', async () => {
    // Mock request parameters
    const productId = 'validProductId' // Replace with a valid product ID

    // Mock request object
    const req: any = {
      params: { id: productId },
    }

    // Mock response object
    const res = mockResponse()

    // Mock the Product.findByIdAndDelete method to return deleted product
    jest
      .spyOn(Product, 'findByIdAndDelete')
      .mockResolvedValueOnce({ _id: productId } as any)

    // Call the deleteProductById function
    await deleteProductById(req, res)

    // Verify that Product.findByIdAndDelete was called with the correct product ID
    expect(Product.findByIdAndDelete).toHaveBeenCalledWith(productId)

    // Verify that the response status was set to 200
    expect(res.status).toHaveBeenCalledWith(200)

    // Verify that the response JSON contains the success message
    expect(res.json).toHaveBeenCalledWith({
      message: 'Product deleted successfully',
      status: true,
    })
  })
})

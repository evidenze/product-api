// tests/productController.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import app from '../../app'

describe('Product Controller', () => {
  let mongoServer: MongoMemoryServer
  let productId: string
  let token: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)

    // Generate a JWT token for authentication
    token = jwt.sign({ userId: 'testUserId' }, 'your_api_key')
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it('should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      price: 10.99,
      description: 'Test Description',
      category: 'Test Category',
      imageUrl: 'test_image_url',
      quantity: 10,
    }

    const res = await request(app)
      .post('/api/products')
      .send(productData)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Product created successfully')
    expect(res.body).toHaveProperty('status', true)
    expect(res.body.data.name).toBe(productData.name)
    expect(res.body.data.price).toBe(productData.price)
    expect(res.body.data.description).toBe(productData.description)
    expect(res.body.data.category).toBe(productData.category)
    expect(res.body.data.imageUrl).toBe(productData.imageUrl)
    expect(res.body.data.quantity).toBe(productData.quantity)

    productId = res.body.data._id
  })

  it('should retrieve a product by ID', async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      data: res.body.data,
      message: 'Product fetched successfully',
      status: true,
    })
    expect(res.body).toHaveProperty('status', true)
  })

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ name: 'Updated Product', price: 20.99 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'Product updated successfully')
    expect(res.body).toHaveProperty('status', true)
  })

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message', 'Product deleted successfully')
    expect(res.body).toHaveProperty('status', true)
  })
})

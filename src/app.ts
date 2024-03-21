import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { handleInvalidEndpoint } from './utils/responseUtils'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(helmet())

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to the Product Management API!')
})

// MongoDB Connection
const connectToMongoDB = async () => {
  const MONGODB_URI = process.env.DB_URL || ''
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

// Routes
app.use('/api', productRoutes)
app.use('/api', authRoutes)

app.use(handleInvalidEndpoint);

export const startServer = async (port: number) => {
  await connectToMongoDB()
  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

export default app

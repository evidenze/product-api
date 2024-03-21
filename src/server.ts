import { startServer } from './app'
import dotenv from 'dotenv'
import Joi from 'joi';

dotenv.config()

// Define a Joi schema for required environment variables
const envSchema = Joi.object({
    PORT: Joi.number().required(),
    DB_URL: Joi.string().required(),
    JWT_KEY: Joi.string().required(),
  }).unknown(true);
  
  // Validate environment variables against the schema
  const { error } = envSchema.validate(process.env, { abortEarly: false });
  
  // If validation fails, throw an error indicating the missing variables
  if (error) {
    throw new Error(`Missing environment variables: ${error.details.map(detail => detail.message).join(', ')}`);
  }

const PORT = parseInt(process.env.PORT || '3000');

startServer(PORT)

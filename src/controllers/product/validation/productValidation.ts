import Joi from 'joi'

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required().min(1),
  description: Joi.string().required(),
  category: Joi.string().required(),
  imageUrl: Joi.string().required(),
  quantity: Joi.number().required().min(0),
})

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional().min(1),
  description: Joi.string().optional(),
  category: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
  quantity: Joi.number().optional().min(0),
})

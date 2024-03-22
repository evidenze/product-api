import Joi from 'joi'

export const authSchema = Joi.object({
  username: Joi.string().required().trim(),
  password: Joi.string().required().min(6).trim(),
})

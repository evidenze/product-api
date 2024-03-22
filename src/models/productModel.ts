import { Document, Schema, model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
  quantity: number
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: Number, required: true },
}, { timestamps: true })

export default model<IProduct>('Product', ProductSchema)

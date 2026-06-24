import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    required: true,
    default: true,
  },
});

productSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;

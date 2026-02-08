import { cloudinary } from "../config/cloudinary.js";
import Product from "../models/product.model.js";

import streamifier from "streamifier";

export function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    
    const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
      if (error) reject(error); else resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

// add product :/api/product/add
export const addProduct = async (req, res) => {
  try {
    console.log(req.body);
    
    const { name, price, offerPrice, description, category, unit, stock } = req.body;

    if (
      !name ||
      price == null ||
      offerPrice == null ||
      !description ||
      !category || !unit || !stock
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const uploadResults = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );

    const images = uploadResults.map(result => result.secure_url);
    const product = new Product({
      name,
      price,
      offerPrice,
      description,
      category,
      unit,
      stock,
      image: images,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      product: savedProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};


// get products :/api/product/get
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products:products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// get single product :/api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// change stock  :/api/product/stock

export const editProduct = async (req, res) => {
  try {    
    const { _id, name, price, offerPrice, description, stock } = req.body;

    if (
      !_id ||
      !name ||
      price == null ||
      offerPrice == null ||
      !description ||
      stock == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await Product.findByIdAndUpdate(
      _id,
      { name, price, offerPrice, description, stock },
      { new: true, runValidators: true }
    );

    if (!product) return res.sendStatus(404);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error in editProduct:", error);
    res.status(500).json({
      success: false,
      message: "Server error while editing product details",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;    

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product details",
    });
  }
};


export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, product, message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

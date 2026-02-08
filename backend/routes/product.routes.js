import express from "express";

import { authSeller } from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  getProductById,
  getProducts,
  editProduct,
  deleteProduct
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/add-product", authSeller, upload.array("images", 4), addProduct);
router.put("/update", authSeller, editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/list", getProducts);
router.get("/:id", getProductById);
router.post("/stock", authSeller, changeStock);

export default router;

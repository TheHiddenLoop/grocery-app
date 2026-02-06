import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "../hooks/use-toast";
import { useDispatch } from "react-redux";
import { addProduct } from "../features/Product/productSlice";

const categories = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat",
  "Seafood",
  "Bakery",
  "Beverages",
  "Snacks",
  "Frozen",
  "Pantry",
];

const units = ["kg", "lb", "g", "oz", "pcs", "bunch", "bag", "bottle", "can", "box", "loaf", "gallon", "liter", "dozen"];

const initialFormData = {
  name: "",
  category: "",
  price: "",
  offerPrice: "",
  stock: "",
  unit: "",
  description: "",
  images: [],
  imagePreviews: [],
};

export default function AddProduct() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (formData.images.length === 0) newErrors.images = "At least one image is required";
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) 
      newErrors.price = "Valid price is required";
    
    // Validate offer price if provided
    if (formData.offerPrice) {
      const offerPrice = parseFloat(formData.offerPrice);
      const regularPrice = parseFloat(formData.price);
      
      if (offerPrice <= 0) {
        newErrors.offerPrice = "Offer price must be greater than 0";
      } else if (offerPrice >= regularPrice) {
        newErrors.offerPrice = "Offer price must be less than regular price";
      }
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) 
      newErrors.stock = "Valid stock quantity is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("category", formData.category);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("offerPrice", formData.offerPrice);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("unit", formData.unit);
    formDataToSend.append("description", formData.description.trim());

    formData.images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      await dispatch(
        addProduct({
          formData: formDataToSend,
          toast,
        })
      ).unwrap();
      formData.imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setFormData(initialFormData);
      setErrors({});
    } catch {
      // toast already handled inside thunk
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (files) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = 4 - formData.images.length;

    if (fileArray.length > remainingSlots) {
      toast({
        title: "Too many images",
        description: `You can only upload ${remainingSlots} more image(s). Maximum is 4 images.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files.",
          variant: "destructive",
        });
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews],
      }));
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: undefined }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(formData.imagePreviews[index]);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Product</h1>
        <p className="text-muted-foreground">Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
        {/* Product Images */}
        <div className="space-y-2">
          <Label>
            Product Images <span className="text-error">*</span> (Max 4)
          </Label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            } ${formData.images.length >= 4 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => {
              if (formData.images.length < 4) {
                document.getElementById("image-upload")?.click();
              }
            }}
          >
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
              disabled={formData.images.length >= 4}
            />
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-1">
              {formData.images.length >= 4 ? "Maximum images reached" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 10MB ({formData.images.length}/4 uploaded)
            </p>
          </div>
          {errors.images && <p className="text-xs text-error">{errors.images}</p>}

          {formData.imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-error text-error-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name <span className="text-error">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-error" : ""}
          />
          {errors.name && <p className="text-xs text-error">{errors.name}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>
            Category <span className="text-error">*</span>
          </Label>
          <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger className={errors.category ? "border-error" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-error">{errors.category}</p>}
        </div>

        {/* Price and Offer Price - Side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">
              Price ($) <span className="text-error">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className={errors.price ? "border-error" : ""}
            />
            {errors.price && <p className="text-xs text-error">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerPrice">Offer Price ($)</Label>
            <Input
              id="offerPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.offerPrice}
              onChange={(e) => handleChange("offerPrice", e.target.value)}
              className={errors.offerPrice ? "border-error" : ""}
            />
            {errors.offerPrice && <p className="text-xs text-error">{errors.offerPrice}</p>}
          </div>
        </div>

        {/* Stock Quantity and Unit - Side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock">
              Stock Quantity <span className="text-error">*</span>
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className={errors.stock ? "border-error" : ""}
            />
            {errors.stock && <p className="text-xs text-error">{errors.stock}</p>}
          </div>

          <div className="space-y-2">
            <Label>
              Unit <span className="text-error">*</span>
            </Label>
            <Select value={formData.unit} onValueChange={(v) => handleChange("unit", v)}>
              <SelectTrigger className={errors.unit ? "border-error" : ""}>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit && <p className="text-xs text-error">{errors.unit}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-error">*</span>
          </Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={errors.description ? "border-error" : ""}
          />
          {errors.description && <p className="text-xs text-error">{errors.description}</p>}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="submit" className="flex-1 gradient-primary text-primary-foreground hover:opacity-90">
            <Upload className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
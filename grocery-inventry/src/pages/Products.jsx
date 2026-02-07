import { useEffect, useState } from "react";
import { Search, Filter, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusBadge } from "../components/ui/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProduct, updateProduct } from "../features/Product/productSlice";

const categories = [
  "All",
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

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.product);
  const loading = useSelector((state) => state.product.loading);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);  

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", variant: "error" };
    if (stock <= 10) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await dispatch(deleteProduct(deleteConfirm._id)).unwrap();
        setDeleteConfirm(null);
      } catch (error) {
        // Error already handled in thunk
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      try {
        const updateData = {
          _id: editingProduct._id,
          name: editingProduct.name,
          price: editingProduct.price,
          offerPrice: editingProduct.offerPrice,
          stock: editingProduct.stock,
          description: editingProduct.description,
        };
        
        await dispatch(
          updateProduct(updateData)
        ).unwrap();
        setEditingProduct(null);
      } catch (error) {
        // Error already handled in thunk
      }
    }
  };  

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Products</h1>
          <p className="text-muted-foreground mt-1">
            {products?.length || 0} products in inventory
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/add-product")}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            const displayPrice = product.offerPrice || product.price;
            const hasOffer = product.offerPrice && product.offerPrice < product.price;

            return (
              <div
                key={product._id}
                className="glass rounded-xl overflow-hidden hover:border-primary/30 transition-colors group"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={product.image?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge variant={stockStatus.variant}>
                      {stockStatus.label}
                    </StatusBadge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {hasOffer ? (
                        <>
                          <p className="text-lg font-bold text-primary">
                            ${displayPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-primary">
                          ${displayPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Stock:{" "}
                      <span className="text-foreground font-medium">
                        {product.stock} {product.unit}
                      </span>
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-popover-foreground"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-error"
                        onClick={() => setDeleteConfirm(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Make changes to the product details.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-offer-price">Offer Price ($)</Label>
                  <Input
                    id="edit-offer-price"
                    type="number"
                    value={editingProduct.offerPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        offerPrice: e.target.value ? parseFloat(e.target.value) : "",
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
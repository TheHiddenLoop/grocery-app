import React, { useEffect, useState } from "react";
import { ArrowRight, MapPin, Plus, CheckCircle2, Trash2 } from "lucide-react";
import { CartCard } from "../components/CartCard";
import Header from "../components/Header2";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../features/cart/cartSlice";
import { codPayment, stripePayment } from "../features/payment/paymentSlice";
import { fetchAddresses, selectAddress, deleteAddress } from "../features/address/addressSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function ShoppingCartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, loading } = useSelector((state) => state.cart);
  const addresses = useSelector((state) => state.address?.addresses ?? []);
  const selectedAddressId = useSelector((state) => state.address?.selectedAddressId ?? null);
  const addressLoading = useSelector((state) => state.address?.loading ?? false);

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);

  const safeItems = (Array.isArray(cartItems) ? cartItems : []).filter(
    (item) => item?.productId && typeof item.productId === "object"
  );

  const flattenItem = (item) => ({
    _id: item.productId._id,
    name: item.productId.name ?? "Unknown",
    images: Array.isArray(item.productId.image) ? item.productId.image : [],
    description: Array.isArray(item.productId.description) ? item.productId.description : [""],
    offerPrice: item.productId.offerPrice ?? 0,
    price: item.productId.price ?? 0,
    unit: item.productId.unit ?? "",
    inStock: item.productId.inStock ?? false,
    quantity: item.quantity ?? 1,
  });

  const subtotal = safeItems.reduce(
    (sum, item) => sum + (item?.productId?.offerPrice ?? 0) * (item?.quantity ?? 0),
    0
  );
  const originalPrice = safeItems.reduce(
    (sum, item) => sum + (item?.productId?.price ?? 0) * (item?.quantity ?? 0),
    0
  );
  const savings = originalPrice - subtotal;
  const shipping = 4.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = (productId, delta) => {
    const cartItem = safeItems.find((item) => item.productId._id === productId);
    if (!cartItem) return;
    const newQuantity = Math.max(1, cartItem.quantity + delta);
    dispatch(updateCartItem({ productId, quantity: newQuantity })).then(() => {
      dispatch(fetchCart());
    });
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId)).then(() => {
      dispatch(fetchCart());
    });
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    const orderPayload = {
      items: safeItems.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
      })),
      address: selectedAddressId,
    };
    try {
      if (paymentMethod === "COD") {
        await dispatch(codPayment(orderPayload)).unwrap();
        toast.success("Order placed successfully!");
      }
      if (paymentMethod === "ONLINE") {
        await dispatch(stripePayment(orderPayload)).unwrap();
      }
    } catch (error) {
      toast.error(error || "Checkout failed");
    }
  };

  const handleDeleteAddress = (e, id) => {
    e.stopPropagation();
    dispatch(deleteAddress(id));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 px-4 md:py-16 bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-text-primary">
            Shopping Cart
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 xl:gap-8">
            {/* Cart Items */}
            <div className="w-full lg:max-w-2xl xl:max-w-4xl mx-auto lg:mx-0">
              <div className="space-y-6">
                {loading ? (
                  <p className="text-text-secondary text-sm">Loading...</p>
                ) : safeItems.length === 0 ? (
                  <p className="text-text-secondary text-sm">Your cart is empty.</p>
                ) : (
                  safeItems.map((item) => (
                    <CartCard
                      key={item.productId._id}
                      item={flattenItem(item)}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="mx-auto mt-6 w-full flex-1 space-y-6 lg:mt-0 lg:max-w-md">

              {/* Delivery Address */}
              <div className="rounded-lg border border-border bg-bg-secondary p-4 shadow-sm sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-base font-semibold text-text-primary flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Delivery Address
                  </p>
                  <button
                    onClick={() => navigate("/add-address")}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New
                  </button>
                </div>

                {addressLoading ? (
                  <p className="text-sm text-text-secondary">Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <button
                    onClick={() => navigate("/add-address")}
                    className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-border rounded-lg text-text-secondary hover:border-primary hover:text-primary transition-colors"
                  >
                    <MapPin className="w-6 h-6" />
                    <span className="text-sm font-medium">Add a delivery address</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    {addresses.map((addr) => {
                      const isSelected = addr._id === selectedAddressId;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => dispatch(selectAddress(addr._id))}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-border" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                              {addr.street}
                              <br />
                              {addr.city}, {addr.state} – {addr.zipCode}
                              <br />
                              {addr.country} &bull; {addr.phone}
                            </p>
                          </div>

                          <button
                            onClick={(e) => handleDeleteAddress(e, addr._id)}
                            className="shrink-0 p-1 rounded hover:bg-error-bg hover:text-error text-text-secondary transition-colors"
                            aria-label="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-4 shadow-sm sm:p-6">
                <p className="text-xl font-semibold text-text-primary">Order summary</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-text-secondary">Original price</dt>
                      <dd className="text-base font-medium text-text-primary">${originalPrice.toFixed(2)}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-text-secondary">Savings</dt>
                      <dd className="text-base font-medium text-success">-${savings.toFixed(2)}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-text-secondary">Store Pickup</dt>
                      <dd className="text-base font-medium text-text-primary">${shipping.toFixed(2)}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4">
                      <dt className="text-base font-normal text-text-secondary">Tax</dt>
                      <dd className="text-base font-medium text-text-primary">${tax.toFixed(2)}</dd>
                    </dl>
                  </div>

                  <dl className="flex items-center justify-between gap-4 border-t border-border pt-2">
                    <dt className="text-base font-bold text-text-primary">Total</dt>
                    <dd className="text-base font-bold text-primary">${total.toFixed(2)}</dd>
                  </dl>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="ONLINE">💳 Online Payment</option>
                    <option value="COD">💵 Cash on Delivery</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={safeItems.length === 0 || !selectedAddressId}
                  className="flex w-full items-center cursor-pointer justify-center rounded-lg bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-medium text-text-primary transition-all hover:scale-[1.02]"
                >
                  Proceed to Checkout
                </button>

                {!selectedAddressId && addresses.length === 0 && (
                  <p className="text-xs text-center text-error">Add a delivery address to continue</p>
                )}
                {!selectedAddressId && addresses.length > 0 && (
                  <p className="text-xs text-center text-warning">Select a delivery address to continue</p>
                )}

                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-normal text-text-secondary">or</span>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center cursor-pointer gap-2 text-sm font-medium text-primary underline hover:no-underline"
                  >
                    Continue Shopping
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
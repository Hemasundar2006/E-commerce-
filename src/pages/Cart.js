import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCart, 
  removeFromCart, 
  updateCartItem, 
  clearCart,
  clearError
} from '../features/cart/cartSlice';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  CreditCard
} from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, totalItems, totalAmount, isLoading, error } = useSelector(state => state.cart);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await dispatch(updateCartItem({ productId, quantity: newQuantity })).unwrap();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow">
                <div className="w-20 h-20 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ShoppingCart className="w-8 h-8 mr-3" />
          Shopping Cart
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        /* Empty Cart */
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h3>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Cart Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({totalItems})
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const product = item.productId;
                  const imageUrl = product.images && product.images.length > 0 
                    ? (product.images[0].startsWith('http') 
                        ? product.images[0] 
                        : `https://lakshmiservices.netlify.app${product.images[0]}`)
                    : null;
                  const isUpdating = updatingItems.has(product._id);

                  return (
                    <div key={item._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <Link to={`/products/${product._id}`} className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/products/${product._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-blue-600 block truncate"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500">Category:</span>
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-center min-w-[60px] font-medium">
                              {isUpdating ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                              disabled={item.quantity >= product.stock || isUpdating}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(product.price)} each
                          </div>
                          <button
                            onClick={() => handleRemoveItem(product._id)}
                            className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {product.stock <= 5 && (
                        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-800">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          Only {product.stock} left in stock!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">
                    {totalAmount >= 500 ? 'Free' : formatPrice(50)}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(totalAmount * 0.18)}</span>
                </div>

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount + (totalAmount >= 500 ? 0 : 50) + (totalAmount * 0.18))}</span>
                </div>

                {/* Free Shipping Notice */}
                {totalAmount < 500 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    Add {formatPrice(500 - totalAmount)} more for free shipping!
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-5 h-5 mr-2 text-gray-400" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

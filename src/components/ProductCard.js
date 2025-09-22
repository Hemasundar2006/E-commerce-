import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { Star, ShoppingCart, Heart, Eye, Package } from 'lucide-react';

const ProductCard = ({ product, showAddToCart = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: 1,
        product: product 
      })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist functionality
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <div className="overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const imageUrl = product.images && product.images.length > 0 
    ? (product.images[0].startsWith('http') 
        ? product.images[0] 
        : `https://lakshmiservices.netlify.app${product.images[0]}`)
    : null;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <Link
                to={`/products/${product._id}`}
                className="p-2 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors duration-200"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stock Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 right-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(product.ratings || 0)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.ratings?.toFixed(1) || '0.0'})
            </span>
            {product.reviews && product.reviews.length > 0 && (
              <span className="ml-1 text-sm text-gray-500">
                • {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock <= 0}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                product.stock <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isLoading
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isLoading 
                  ? 'Adding...' 
                  : product.stock <= 0 
                  ? 'Out of Stock' 
                  : 'Add to Cart'
                }
              </span>
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

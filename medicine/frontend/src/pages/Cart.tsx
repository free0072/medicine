import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => api.getCart(),
  });

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, newQuantity);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Use cart from context if available, otherwise use fetched data
  const currentCart = cart || cartData;

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCart || currentCart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cart Items ({currentCart.items.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {currentCart.items.map((item) => {
                  const product = typeof item.product === 'object' ? item.product : null;
                  if (!product) return null;

                  return (
                    <div key={product._id} className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-20 w-20">
                          <img
                            className="h-20 w-20 rounded-lg object-cover"
                            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
                            alt={product.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                              <p className="text-sm text-gray-500">{product.brand}</p>
                              {product.prescriptionRequired && (
                                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                  Prescription Required
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-gray-900">
                                {formatPrice(item.price)}
                              </p>
                              {product.comparePrice && product.comparePrice > item.price && (
                                <p className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.comparePrice)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || loading}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="text-gray-900 font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                                disabled={loading}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-4">
                              <p className="text-lg font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <button
                                onClick={() => handleRemoveItem(product._id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(currentCart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(currentCart.total - currentCart.subtotal)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(currentCart.total)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 font-medium"
              >
                Continue Shopping
              </button>
            </div>

            {/* Prescription Notice */}
            {currentCart.items.some(item => 
              typeof item.product === 'object' && item.product.prescriptionRequired
            ) && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Prescription Required
                </h3>
                <p className="text-sm text-yellow-700">
                  Some items in your cart require a prescription. You'll need to upload a valid prescription during checkout.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 
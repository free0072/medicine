import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import type { Product, Category } from '../types';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // Get current filters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  // Fetch products
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', page, search, category, minPrice, maxPrice, sortBy, sortOrder],
    queryFn: () => api.getProducts({
      page,
      search,
      category,
      priceMin: minPrice ? parseFloat(minPrice) : undefined,
      priceMax: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy: sortBy as 'name' | 'price' | 'rating' | 'createdAt',
      sortOrder: sortOrder as 'asc' | 'desc'
    }),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    if (key !== 'page') {
      newSearchParams.set('page', '1'); // Reset to first page for non-page filters
    }
    setSearchParams(newSearchParams);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    handleFilterChange('search', searchValue);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.slug}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.jpg';
          }}
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <HeartIcon className="h-5 w-5 text-gray-600" />
        </button>
        {product.isOnSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            {product.discountPercentage}% OFF
          </div>
        )}
        {product.prescriptionRequired && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Rx Required
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-t-lg flex items-center justify-center">
          <button
            onClick={() => handleViewProduct(product)}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100 flex items-center space-x-2"
          >
            <EyeIcon className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={() => handleViewProduct(product)}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.shortDescription || product.description.substring(0, 100) + '...'}
        </p>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        {product.averageRating && renderStars(product.averageRating)}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <button 
            onClick={() => handleAddToCart(product)}
            disabled={product.stockQuantity === 0}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
          <p className="text-xs text-orange-600 mt-2">Only {product.stockQuantity} left in stock!</p>
        )}
      </div>
    </div>
  );

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => handleViewProduct(product)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
          {product.prescriptionRequired && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Rx Required
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer" onClick={() => handleViewProduct(product)}>
            {product.name}
          </h3>
          <p className="text-gray-600 mb-2">{product.brand}</p>
          <p className="text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription || product.description.substring(0, 150) + '...'}
          </p>
          {product.averageRating && renderStars(product.averageRating)}
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {product.isOnSale && (
                <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleViewProduct(product)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <EyeIcon className="h-4 w-4" />
                <span>View</span>
              </button>
              <button 
                onClick={() => handleAddToCart(product)}
                disabled={product.stockQuantity === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
          {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
            <p className="text-sm text-orange-600 mt-2">Only {product.stockQuantity} left in stock!</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Products</h1>
          <p className="text-gray-600">
            Discover our comprehensive range of medicines, supplements, and healthcare essentials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search medicines, supplements, brands..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            {/* View Mode and Filter Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', newSortBy);
                      handleFilterChange('sortOrder', newSortOrder);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="createdAt-desc">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${productsData?.pagination?.total || 0} products found`}
          </p>
          {productsData?.data && productsData.data.length > 0 && (
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * (productsData.pagination?.limit || 12)) + 1} - {Math.min(page * (productsData.pagination?.limit || 12), productsData.pagination?.total || 0)} of {productsData.pagination?.total || 0}
            </p>
          )}
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <ShoppingCartIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
            <p className="text-gray-600 mb-4">Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : productsData?.data && productsData.data.length > 0 ? (
          <>
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {productsData.data.map((product) => (
                viewMode === 'grid' 
                  ? <ProductCard key={product._id} product={product} />
                  : <ProductListItem key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {productsData.pagination && productsData.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFilterChange('page', (page - 1).toString())}
                    disabled={page <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {/* Generate page numbers with ellipsis for large page counts */}
                  {(() => {
                    const totalPages = productsData.pagination.totalPages;
                    const currentPage = page;
                    const pages: (number | string)[] = [];
                    
                    if (totalPages <= 7) {
                      // Show all pages if 7 or fewer
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Show first page
                      pages.push(1);
                      
                      if (currentPage > 4) {
                        pages.push('...');
                      }
                      
                      // Show pages around current page
                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);
                      
                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }
                      
                      if (currentPage < totalPages - 3) {
                        pages.push('...');
                      }
                      
                      // Show last page
                      if (totalPages > 1) {
                        pages.push(totalPages);
                      }
                    }
                    
                    return pages.map((pageNum, index) => (
                      <button
                        key={index}
                        onClick={() => typeof pageNum === 'number' ? handleFilterChange('page', pageNum.toString()) : undefined}
                        disabled={typeof pageNum === 'string'}
                        className={`px-3 py-2 border rounded-lg ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : typeof pageNum === 'string'
                            ? 'border-transparent cursor-default'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ));
                  })()}
                  
                  <button
                    onClick={() => handleFilterChange('page', (page + 1).toString())}
                    disabled={page >= productsData.pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCartIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 
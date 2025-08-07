import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { EyeIcon, CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import type { Review } from '../../types';

const AdminReviews: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch reviews
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['admin-reviews', page, status, rating, search],
    queryFn: () => api.getAdminReviews(page, 10, { status, rating, search }),
  });

  // Verify review mutation
  const verifyReviewMutation = useMutation({
    mutationFn: (reviewId: string) => api.verifyReview(reviewId),
    onSuccess: () => {
      toast.success('Review verified successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify review');
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => api.deleteReview(reviewId),
    onSuccess: () => {
      toast.success('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });

  const handleVerify = (reviewId: string) => {
    verifyReviewMutation.mutate(reviewId);
  };

  const handleDelete = (reviewId: string) => {
    deleteReviewMutation.mutate(reviewId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Verified
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
        Pending
      </span>
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, customer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setRating('');
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product & Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviewsData?.data?.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {typeof review.product === 'object' && review.product.images[0] ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={review.product.images[0]}
                                alt={review.product.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-600">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {typeof review.product === 'object' ? review.product.name : 'Product'}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {typeof review.user === 'object' 
                                ? `${review.user.firstName} ${review.user.lastName}`
                                : 'User'
                              }
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {review.title && (
                            <div className="font-medium mb-1">{review.title}</div>
                          )}
                          <div className="text-gray-600 line-clamp-2">
                            {review.comment}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getVerificationBadge(review.isVerified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedReview(review);
                              setShowReviewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {!review.isVerified && (
                            <button
                              onClick={() => handleVerify(review._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Verify Review"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Review"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {reviewsData?.pagination && reviewsData.pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === reviewsData.pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(page - 1) * 10 + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(page * 10, reviewsData.pagination.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{reviewsData.pagination.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: reviewsData.pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Review Detail Modal */}
        {showReviewModal && selectedReview && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Review Details</h3>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedReview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Product Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Product Information</h4>
                  <div className="flex items-center space-x-4">
                    {typeof selectedReview.product === 'object' && selectedReview.product.images[0] ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={selectedReview.product.images[0]}
                        alt={selectedReview.product.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-300 flex items-center justify-center">
                        <span className="text-sm text-gray-600">No Image</span>
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {typeof selectedReview.product === 'object' ? selectedReview.product.name : 'Product'}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {typeof selectedReview.product === 'object' ? selectedReview.product.brand : 'Brand'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Name:</span>{' '}
                      {typeof selectedReview.user === 'object' 
                        ? `${selectedReview.user.firstName} ${selectedReview.user.lastName}`
                        : 'User'
                      }
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {typeof selectedReview.user === 'object' ? selectedReview.user.email : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Review Content</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {renderStars(selectedReview.rating)}
                          {getVerificationBadge(selectedReview.isVerified)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(selectedReview.createdAt)}
                        </span>
                      </div>
                      {selectedReview.title && (
                        <h5 className="font-medium text-gray-900 mb-2">{selectedReview.title}</h5>
                      )}
                      <p className="text-gray-600">{selectedReview.comment}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  {!selectedReview.isVerified && (
                    <button
                      onClick={() => {
                        handleVerify(selectedReview._id);
                        setShowReviewModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Verify Review
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDelete(selectedReview._id);
                      setShowReviewModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews; 
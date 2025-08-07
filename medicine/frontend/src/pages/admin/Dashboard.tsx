import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  CurrencyDollarIcon,
  ArrowUpCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [period, setPeriod] = useState(30);

  // Fetch dashboard stats
  const { data: dashboardData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });

  // Fetch sales analytics
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-analytics', period],
    queryFn: () => api.getSalesAnalytics(period),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    );
  };

  const stats = [
    {
      name: 'Total Products',
      value: dashboardData?.stats?.totalProducts || 0,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Orders',
      value: dashboardData?.stats?.totalOrders || 0,
      icon: ShoppingCartIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Total Users',
      value: dashboardData?.stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Revenue',
      value: formatPrice(dashboardData?.stats?.totalRevenue || 0),
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              {statsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingCartIcon className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order._id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {typeof order.user === 'object' 
                              ? `${order.user.firstName} ${order.user.lastName}`
                              : 'Customer'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Low Stock Products</h2>
            </div>
            <div className="p-6">
              {statsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">{product.stockQuantity} left</p>
                        <p className="text-xs text-gray-500">Threshold: {product.lowStockThreshold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">All products are well stocked</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sales Analytics */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sales Analytics</h2>
          </div>
          <div className="p-6">
            {salesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : salesData ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Sales Trend</h3>
                  <div className="space-y-3">
                    {salesData.salesData.map((day) => (
                      <div key={day._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <ArrowUpCircleIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatPrice(day.totalSales)}</p>
                          <p className="text-xs text-gray-500">{day.orderCount} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Top Selling Products</h3>
                  <div className="space-y-3">
                    {salesData.topProducts.slice(0, 5).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 flex-shrink-0">
                            {typeof item.product === 'object' && item.product.images[0] ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={item.product.images[0]}
                                alt={typeof item.product === 'object' ? item.product.name : 'Product'}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-600">No Image</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {typeof item.product === 'object' ? item.product.name : 'Product'}
                            </p>
                            <p className="text-xs text-gray-500">{item.totalSold} sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{formatPrice(item.totalRevenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowUpCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Prescriptions */}
        {dashboardData?.pendingPrescriptions && dashboardData.pendingPrescriptions.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Pending Prescription Reviews</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.pendingPrescriptions.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <ClockIcon className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {typeof order.user === 'object' 
                            ? `${order.user.firstName} ${order.user.lastName}`
                            : 'Customer'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-xs text-yellow-600">Prescription pending</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  TrashIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StarIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';

const DemoData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [quantities, setQuantities] = useState({
    users: 10,
    categories: 5,
    products: 20,
    orders: 15,
    reviews: 30,
  });

  // Fetch current demo data stats
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['demo-stats'],
    queryFn: () => api.getDemoDataStats(),
    refetchOnWindowFocus: false
  });

  // Demo data generation mutation
  const generateDemoDataMutation = useMutation({
    mutationFn: async (data: { type: string; quantity: number }) => {
      setIsLoading(true);
      try {
        const response = await api.generateDemoData(data.type, data.quantity);
        return response;
      } catch (error: any) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data, variables) => {
      toast.success(`Generated ${variables.quantity} ${variables.type} successfully`);
      refetchStats(); // Refresh stats after generation
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to generate demo data`);
    },
  });

  // Generate all demo data mutation
  const generateAllMutation = useMutation({
    mutationFn: async (quantities: any) => {
      setIsLoading(true);
      try {
        const response = await api.generateAllDemoData(quantities);
        return response;
      } catch (error: any) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast.success('All demo data generated successfully');
      refetchStats(); // Refresh stats after generation
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to generate demo data');
    },
  });

  // Clear all demo data mutation
  const clearDataMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const response = await api.clearAllDemoData();
        return response;
      } catch (error: any) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      toast.success('All demo data cleared successfully');
      refetchStats(); // Refresh stats after clearing
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear demo data');
    },
  });

  const handleGenerateData = async (type: string) => {
    const quantity = quantities[type as keyof typeof quantities];
    generateDemoDataMutation.mutate({ type, quantity });
  };

  const handleGenerateAll = async () => {
    const selectedQuantities: any = {};
    selectedData.forEach(type => {
      selectedQuantities[type] = quantities[type as keyof typeof quantities];
    });
    generateAllMutation.mutate(selectedQuantities);
  };

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      clearDataMutation.mutate();
    }
  };

  const toggleDataSelection = (type: string) => {
    setSelectedData(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const updateQuantity = (type: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [type]: Math.max(1, value)
    }));
  };

  const dataTypes = [
    {
      id: 'users',
      name: 'Users',
      description: 'Sample customer accounts with profiles and medical information',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      fields: ['Name', 'Email', 'Phone', 'Address', 'Medical Info'],
      currentCount: stats?.users || 0
    },
    {
      id: 'categories',
      name: 'Categories',
      description: 'Product categories and subcategories for organization',
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      fields: ['Name', 'Description', 'Image', 'Parent Category'],
      currentCount: stats?.categories || 0
    },
    {
      id: 'products',
      name: 'Products',
      description: 'Medication products with detailed information and images',
      icon: ShoppingBagIcon,
      color: 'bg-purple-500',
      fields: ['Name', 'Brand', 'Price', 'Stock', 'Prescription Required'],
      currentCount: stats?.products || 0
    },
    {
      id: 'orders',
      name: 'Orders',
      description: 'Sample orders with different statuses and prescription requirements',
      icon: ShoppingCartIcon,
      color: 'bg-yellow-500',
      fields: ['Customer', 'Items', 'Total', 'Status', 'Prescription'],
      currentCount: stats?.orders || 0
    },
    {
      id: 'reviews',
      name: 'Reviews',
      description: 'Product reviews and ratings from customers',
      icon: StarIcon,
      color: 'bg-pink-500',
      fields: ['Product', 'Customer', 'Rating', 'Comment', 'Verified'],
      currentCount: stats?.reviews || 0
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Demo Data Generator</h1>
          <p className="mt-2 text-gray-600">
            Generate sample data for testing and demonstration purposes. This will populate your database with realistic data.
          </p>
        </div>

        {/* Current Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Current Data Statistics</h2>
              <button
                onClick={() => refetchStats()}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{dataType.currentCount}</div>
                  <div className="text-sm text-gray-500">{dataType.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This will add sample data to your database. Make sure you're in a development environment. 
                Generated data will be realistic but fictional.
              </p>
            </div>
          </div>
        </div>

        {/* Data Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dataTypes.map((dataType) => (
            <div
              key={dataType.id}
              className={`bg-white rounded-lg shadow border-2 transition-all ${
                selectedData.includes(dataType.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${dataType.color}`}>
                      <dataType.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{dataType.name}</h3>
                      <p className="text-sm text-gray-500">{dataType.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Current: {dataType.currentCount}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedData.includes(dataType.id)}
                    onChange={() => toggleDataSelection(dataType.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantities[dataType.id as keyof typeof quantities]}
                    onChange={(e) => updateQuantity(dataType.id, parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Fields:</h4>
                  <div className="flex flex-wrap gap-1">
                    {dataType.fields.map((field) => (
                      <span
                        key={field}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateData(dataType.id)}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Generate {dataType.name}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bulk Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGenerateAll}
              disabled={isLoading || selectedData.length === 0}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <CheckIcon className="h-5 w-5" />
              Generate All Selected ({selectedData.length})
            </button>
            
            <button
              onClick={() => setSelectedData(dataTypes.map(dt => dt.id))}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Select All
            </button>
            
            <button
              onClick={() => setSelectedData([])}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <TrashIcon className="h-5 w-5" />
              Clear Selection
            </button>

            <button
              onClick={handleClearAllData}
              disabled={isLoading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <TrashIcon className="h-5 w-5" />
              Clear All Demo Data
            </button>
          </div>
        </div>

        {/* Sample Data Preview */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sample Data Preview</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample User */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Sample User</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> John Smith</p>
                  <p><strong>Email:</strong> john.smith@example.com</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Main St, City, State 12345</p>
                  <p><strong>Medical:</strong> Diabetes, Hypertension</p>
                  <p><strong>Allergies:</strong> Penicillin, Sulfa drugs</p>
                </div>
              </div>

              {/* Sample Product */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Sample Product</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> Metformin 500mg</p>
                  <p><strong>Brand:</strong> Glucophage</p>
                  <p><strong>Price:</strong> $15.99</p>
                  <p><strong>Stock:</strong> 150 units</p>
                  <p><strong>Category:</strong> Diabetes Medication</p>
                  <p><strong>Prescription:</strong> Required</p>
                </div>
              </div>

              {/* Sample Order */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Sample Order</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Order ID:</strong> #ORD123456</p>
                  <p><strong>Customer:</strong> John Smith</p>
                  <p><strong>Items:</strong> Metformin 500mg (2), Insulin (1)</p>
                  <p><strong>Total:</strong> $45.97</p>
                  <p><strong>Status:</strong> Processing</p>
                  <p><strong>Date:</strong> 2024-01-15</p>
                </div>
              </div>

              {/* Sample Review */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Sample Review</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Product:</strong> Metformin 500mg</p>
                  <p><strong>Customer:</strong> John Smith</p>
                  <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (5/5)</p>
                  <p><strong>Title:</strong> "Great medication for diabetes"</p>
                  <p><strong>Comment:</strong> "This medication has helped me manage my blood sugar levels effectively."</p>
                  <p><strong>Verified:</strong> Yes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">How to Use</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>1. <strong>Select Data Types:</strong> Choose which types of data you want to generate</p>
            <p>2. <strong>Set Quantities:</strong> Adjust the number of records to generate for each type</p>
            <p>3. <strong>Generate:</strong> Click "Generate" for individual types or "Generate All Selected" for bulk creation</p>
            <p>4. <strong>Review:</strong> Check your admin panels to see the generated data</p>
            <p>5. <strong>Clear:</strong> Use "Clear All Demo Data" to remove all generated data</p>
            <p className="mt-4 font-medium">Note: Generated data is fictional and for demonstration purposes only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoData; 
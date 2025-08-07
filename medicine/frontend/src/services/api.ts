import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Product, 
  Category, 
  Cart, 
  Order, 
  Review,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ProductFilters,
  ProductFormData,
  CategoryFormData
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', credentials);
    return response.data.data!;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/register', data);
    return response.data.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/me');
    return response.data.data!;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put('/auth/profile', data);
    return response.data.data!;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.put('/auth/change-password', { currentPassword, newPassword });
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response: AxiosResponse<PaginatedResponse<Product>> = await this.api.get('/products', { params: filters });
    return response.data;
  }

  async getProduct(slug: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/products/${slug}`);
    return response.data.data!;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/products/slug/${slug}`);
    return response.data.data!;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.api.get('/products/featured/featured');
    return response.data.data!;
  }

  async getSaleProducts(): Promise<Product[]> {
    const response: AxiosResponse<ApiResponse<Product[]>> = await this.api.get('/products/sale/on-sale');
    return response.data.data!;
  }

  async searchProducts(query: string, page = 1, limit = 12): Promise<PaginatedResponse<Product>> {
    const response: AxiosResponse<PaginatedResponse<Product>> = await this.api.get('/products/search/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<ApiResponse<Category[]>> = await this.api.get('/categories');
    return response.data.data!;
  }

  async getCategory(slug: string): Promise<Category> {
    const response: AxiosResponse<ApiResponse<Category>> = await this.api.get(`/categories/${slug}`);
    return response.data.data!;
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response: AxiosResponse<ApiResponse<Cart>> = await this.api.get('/cart');
    return response.data.data!;
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    const response: AxiosResponse<ApiResponse<Cart>> = await this.api.post('/cart/add', { productId, quantity });
    return response.data.data!;
  }

  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    const response: AxiosResponse<ApiResponse<Cart>> = await this.api.put(`/cart/update/${productId}`, { quantity });
    return response.data.data!;
  }

  async removeFromCart(productId: string): Promise<Cart> {
    const response: AxiosResponse<ApiResponse<Cart>> = await this.api.delete(`/cart/remove/${productId}`);
    return response.data.data!;
  }

  async clearCart(): Promise<void> {
    await this.api.delete('/cart/clear');
  }

  // Order endpoints
  async createOrder(orderData: {
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    prescriptionImage?: string;
  }): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.post('/orders', orderData);
    return response.data.data!;
  }

  async getOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    const response: AxiosResponse<PaginatedResponse<Order>> = await this.api.get('/orders', {
      params: { page, limit }
    });
    return response.data;
  }

  async getOrder(orderId: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.get(`/orders/${orderId}`);
    return response.data.data!;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.put(`/orders/${orderId}/cancel`);
    return response.data.data!;
  }

  // Review endpoints
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    const response: AxiosResponse<PaginatedResponse<Review>> = await this.api.get(`/reviews/product/${productId}`, {
      params: { page, limit }
    });
    return response.data;
  }

  async getProductReviewsBySlug(slug: string, page = 1, limit = 10): Promise<Review[]> {
    const response: AxiosResponse<ApiResponse<Review[]>> = await this.api.get(`/products/${slug}/reviews`, {
      params: { page, limit }
    });
    return response.data.data!;
  }

  async createReview(data: { productId: string; rating: number; title?: string; comment?: string }): Promise<Review> {
    const response: AxiosResponse<ApiResponse<Review>> = await this.api.post('/reviews', data);
    return response.data.data!;
  }

  async updateReview(reviewId: string, data: { rating: number; title?: string; comment?: string }): Promise<Review> {
    const response: AxiosResponse<ApiResponse<Review>> = await this.api.put(`/reviews/${reviewId}`, data);
    return response.data.data!;
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.api.delete(`/reviews/${reviewId}`);
  }

  async getUserReviews(page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    const response: AxiosResponse<PaginatedResponse<Review>> = await this.api.get('/reviews/user/reviews', {
      params: { page, limit }
    });
    return response.data;
  }

  // Admin endpoints
  async getDashboardStats(): Promise<{
    stats: {
      totalProducts: number;
      totalOrders: number;
      totalUsers: number;
      totalRevenue: number;
    };
    recentOrders: Order[];
    lowStockProducts: Product[];
    pendingPrescriptions: Order[];
  }> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/admin/dashboard');
    return response.data.data!;
  }

  async getAdminProducts(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Product>> {
    const response: AxiosResponse<PaginatedResponse<Product>> = await this.api.get('/admin/products', {
      params: { page, limit, ...filters }
    });
    return response.data;
  }

  async createProduct(data: ProductFormData): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.post('/admin/products', data);
    return response.data.data!;
  }

  async updateProduct(productId: string, data: Partial<ProductFormData>): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.put(`/admin/products/${productId}`, data);
    return response.data.data!;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.api.delete(`/admin/products/${productId}`);
  }

  async getAdminOrders(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Order>> {
    const response: AxiosResponse<PaginatedResponse<Order>> = await this.api.get('/admin/orders', {
      params: { page, limit, ...filters }
    });
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data.data!;
  }

  async updatePrescriptionStatus(orderId: string, prescriptionApproved: boolean, notes?: string): Promise<Order> {
    const response: AxiosResponse<ApiResponse<Order>> = await this.api.put(`/admin/orders/${orderId}/prescription`, {
      prescriptionApproved,
      notes
    });
    return response.data.data!;
  }

  async getSalesAnalytics(period = 30): Promise<{
    salesData: Array<{ _id: string; totalSales: number; orderCount: number }>;
    topProducts: Array<{ _id: string; totalSold: number; totalRevenue: number; product: Product }>;
  }> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/admin/analytics/sales', {
      params: { period }
    });
    return response.data.data!;
  }

  async getAdminUsers(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<User>> {
    const response: AxiosResponse<PaginatedResponse<User>> = await this.api.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  }

  async getAdminCategories(): Promise<Category[]> {
    const response: AxiosResponse<ApiResponse<Category[]>> = await this.api.get('/admin/categories');
    return response.data.data!;
  }

  async createCategory(data: CategoryFormData): Promise<Category> {
    const response: AxiosResponse<ApiResponse<Category>> = await this.api.post('/admin/categories', data);
    return response.data.data!;
  }

  async getAdminReviews(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Review>> {
    const response: AxiosResponse<PaginatedResponse<Review>> = await this.api.get('/admin/reviews', {
      params: { page, limit, ...filters }
    });
    return response.data;
  }

  async verifyReview(reviewId: string): Promise<Review> {
    const response: AxiosResponse<ApiResponse<Review>> = await this.api.put(`/admin/reviews/${reviewId}/verify`);
    return response.data.data!;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/admin/users/${userId}/role`, { role });
    return response.data.data!;
  }

  async updateCategory(categoryId: string, data: Partial<CategoryFormData>): Promise<Category> {
    const response: AxiosResponse<ApiResponse<Category>> = await this.api.put(`/admin/categories/${categoryId}`, data);
    return response.data.data!;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.api.delete(`/admin/categories/${categoryId}`);
  }

  // Demo Data Generation Methods
  async generateDemoData(type: string, quantity: number): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> = await this.api.post('/admin/demo/generate', { type, quantity });
    return response.data;
  }

  async generateAllDemoData(quantities: {
    users: number;
    categories: number;
    products: number;
    orders: number;
    reviews: number;
  }): Promise<{ success: boolean; message: string; data?: { quantities: any } }> {
    const response: AxiosResponse<ApiResponse<{ quantities: any }>> = await this.api.post('/admin/demo/generate-all', { quantities });
    return response.data;
  }

  async clearAllDemoData(): Promise<{ success: boolean; message: string }> {
    const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> = await this.api.delete('/admin/demo/clear');
    return response.data;
  }

  async getDemoDataStats(): Promise<{
    users: number;
    categories: number;
    products: number;
    orders: number;
    reviews: number;
  }> {
    const response: AxiosResponse<ApiResponse<{
      users: number;
      categories: number;
      products: number;
      orders: number;
      reviews: number;
    }>> = await this.api.get('/admin/demo/stats');
    return response.data.data!;
  }
}

export const apiService = new ApiService();
export const api = apiService;
export default apiService; 
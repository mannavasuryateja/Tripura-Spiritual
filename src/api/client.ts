import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

/**
 * Centralized Secure Axios Client for Tripura Spiritual
 * - withCredentials: true ensures httpOnly, SameSite=Strict cookies are automatically sent with all requests
 * - Response interceptors catch 401 Unauthorized responses globally for clean session handling
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 20000
});

// Event listener callback for unauthorized sessions
type UnauthorizedHandler = () => void;
let onUnauthorizedCallback: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  onUnauthorizedCallback = handler;
};

// Request Interceptor: Attach standard security headers and auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('tripura_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Extracts and formats user-friendly error messages based on HTTP status code and response body.
 */
export function getApiErrorMessage(err: any, defaultFallback: string = 'An error occurred. Please try again.'): string {
  if (!err) return defaultFallback;

  // Network / Connection failure
  if (err.code === 'ERR_NETWORK' || !err.response) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  const status = err.response.status;
  const data = err.response.data;

  // 409 Conflict (Duplicate email / resource)
  if (status === 409) {
    return data?.message || 'An account with this email already exists.';
  }

  // 400 Bad Request (Validation failure or input constraint)
  if (status === 400) {
    if (data?.validationErrors && typeof data.validationErrors === 'object' && Object.keys(data.validationErrors).length > 0) {
      return Object.values(data.validationErrors).join('. ');
    }
    return data?.message || 'Please check the information you entered.';
  }

  // 401 Unauthorized
  if (status === 401) {
    return data?.message || 'Authentication failed. Please check your credentials.';
  }

  // 429 Too Many Requests
  if (status === 429) {
    return data?.message || 'Too many signup attempts. Please try again later.';
  }

  // 500+ Internal Server Error
  if (status >= 500) {
    return "We couldn't create your account right now. Please try again.";
  }

  return data?.message || err.message || defaultFallback;
}

// Response Interceptor: Global 401 & error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Centralized API Domain Services
// ==========================================

export interface LoginPayload {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface OtpSendPayload {
  name?: string;
  phone: string;
}

export interface OtpVerifyPayload {
  phone: string;
  otpCode: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },
  signup: async (payload: SignUpPayload) => {
    const response = await apiClient.post('/auth/signup', payload);
    return response.data;
  },
  sendOtp: async (payload: OtpSendPayload) => {
    const response = await apiClient.post('/auth/send-otp', payload);
    return response.data;
  },
  verifyOtp: async (payload: OtpVerifyPayload) => {
    const response = await apiClient.post('/auth/verify-otp', payload);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

export const booksApi = {
  getAllBooks: async () => {
    const response = await apiClient.get('/books');
    return response.data;
  },
  getBookById: async (idOrSlug: number | string) => {
    const response = await apiClient.get(`/books/${idOrSlug}`);
    return response.data;
  },
  getEpisodes: async (bookId: number | string) => {
    const response = await apiClient.get(`/books/${bookId}/episodes`);
    return response.data;
  },
  getMyUnlockedBookIds: async () => {
    const response = await apiClient.get('/books/my-unlocked');
    return response.data;
  },
  playEpisode: async (bookId: number | string, episodeId: number | string) => {
    const response = await apiClient.get(`/books/${bookId}/episodes/${episodeId}/play`);
    return response.data;
  }
};

export const productsApi = {
  getActiveProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  }
};

export const paymentsApi = {
  createOrder: async (payload: {
    productType: string;
    productId?: string;
    sessionId?: number;
    bookId?: number;
    bookingId?: number;
    amount?: number;
  }) => {
    const response = await apiClient.post('/payments/create-order', payload);
    return response.data;
  },
  verify: async (payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }) => {
    const response = await apiClient.post('/payments/verify', payload);
    return response.data;
  },
  recordFailure: async (payload: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    reason?: string;
  }) => {
    const response = await apiClient.post('/payments/fail', payload);
    return response.data;
  },
  getMyPurchases: async () => {
    const response = await apiClient.get('/payments/my-purchases');
    return response.data;
  }
};

export const sessionsApi = {
  getSessions: async () => {
    const response = await apiClient.get('/sessions');
    return response.data;
  }
};

export const recordingsApi = {
  getSessionRecordings: async (sessionId: number | string) => {
    const response = await apiClient.get(`/recordings/session/${sessionId}`);
    return response.data;
  },
  getSignedStreamToken: async (recordingId: number | string) => {
    const response = await apiClient.get(`/recordings/${recordingId}/stream-token`);
    return response.data;
  }
};

export const mentorApi = {
  bookSession: async (payload: {
    category: string;
    durationMinutes: number;
    primaryDate: string;
    secondaryDate: string;
    preferredTimeSlot: string;
    notes?: string;
  }) => {
    const response = await apiClient.post('/mentor/book', payload);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await apiClient.get('/mentor/my-bookings');
    return response.data;
  },
  getAllBookings: async () => {
    const response = await apiClient.get('/mentor/all-bookings');
    return response.data;
  },
  updateBookingStatus: async (bookingId: number | string, status: string, notes?: string) => {
    const response = await apiClient.post(`/mentor/bookings/${bookingId}/status`, { status, notes });
    return response.data;
  }
};

export const settingsApi = {
  getPublicSettings: async () => {
    const response = await apiClient.get('/settings/public');
    return response.data;
  }
};

export const adminApi = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  updateUserRole: async (userId: number | string, role: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
  getEnrollments: async () => {
    const response = await apiClient.get('/admin/enrollments');
    return response.data;
  },
  getPayments: async () => {
    const response = await apiClient.get('/admin/payments');
    return response.data;
  },
  getAuditLogs: async () => {
    const response = await apiClient.get('/admin/audit-logs');
    return response.data;
  },
  getSessions: async () => {
    const response = await apiClient.get('/admin/sessions');
    return response.data;
  },
  createSession: async (session: any) => {
    const response = await apiClient.post('/admin/sessions', session);
    return response.data;
  },
  updateSession: async (id: number | string, session: any) => {
    const response = await apiClient.put(`/admin/sessions/${id}`, session);
    return response.data;
  },
  getRecordings: async () => {
    const response = await apiClient.get('/admin/recordings');
    return response.data;
  },
  createRecording: async (recording: any) => {
    const response = await apiClient.post('/admin/recordings', recording);
    return response.data;
  },
  deleteRecording: async (id: number | string) => {
    const response = await apiClient.delete(`/admin/recordings/${id}`);
    return response.data;
  },
  getBooks: async () => {
    const response = await apiClient.get('/admin/books');
    return response.data;
  },
  createBook: async (book: any) => {
    const response = await apiClient.post('/admin/books', book);
    return response.data;
  },
  updateBook: async (id: number | string, book: any) => {
    const response = await apiClient.put(`/admin/books/${id}`, book);
    return response.data;
  },
  deleteBook: async (id: number | string) => {
    const response = await apiClient.delete(`/admin/books/${id}`);
    return response.data;
  },
  getEpisodes: async (bookId: number | string) => {
    const response = await apiClient.get(`/admin/books/${bookId}/episodes`);
    return response.data;
  },
  createEpisode: async (bookId: number | string, episode: any) => {
    const response = await apiClient.post(`/admin/books/${bookId}/episodes`, episode);
    return response.data;
  },
  updateEpisode: async (episodeId: number | string, episode: any) => {
    const response = await apiClient.put(`/admin/episodes/${episodeId}`, episode);
    return response.data;
  },
  deleteEpisode: async (episodeId: number | string) => {
    const response = await apiClient.delete(`/admin/episodes/${episodeId}`);
    return response.data;
  },
  getMedia: async () => {
    const response = await apiClient.get('/admin/media');
    return response.data;
  },
  uploadMedia: async (formData: FormData) => {
    const response = await apiClient.post('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  deleteMedia: async (id: number | string) => {
    const response = await apiClient.delete(`/admin/media/${id}`);
    return response.data;
  },
  getProducts: async () => {
    const response = await apiClient.get('/admin/products');
    return response.data;
  },
  createProduct: async (product: any) => {
    const response = await apiClient.post('/admin/products', product);
    return response.data;
  },
  updateProduct: async (id: number | string, product: any) => {
    const response = await apiClient.put(`/admin/products/${id}`, product);
    return response.data;
  },
  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },
  updateSetting: async (key: string, value: string, description?: string) => {
    const response = await apiClient.put(`/admin/settings/${key}`, { value, description });
    return response.data;
  }
};

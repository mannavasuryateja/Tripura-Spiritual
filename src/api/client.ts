import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

/**
 * Centralized Secure Axios Client for Tripura Spiritual
 * - withCredentials: true ensures httpOnly, SameSite=Strict cookies are automatically sent with all requests
 * - Response interceptors catch 401 Unauthorized responses globally for clean session termination
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Enables automatic httpOnly cookie transmission
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 15000
});

// Event listener callback for unauthorized sessions
type UnauthorizedHandler = () => void;
let onUnauthorizedCallback: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  onUnauthorizedCallback = handler;
};

// Request Interceptor: Attach standard security headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Note: Sensitive JWTs are stored in httpOnly cookies, NOT in localStorage!
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global 401 & error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Catch 401 Unauthorized globally
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
  name: string;
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

export const paymentsApi = {
  createOrder: async (sessionId: number, type: string) => {
    const response = await apiClient.post('/payments/create-order', { sessionId, type });
    return response.data;
  },
  verifyAndFulfill: async (payload: { sessionId: number; type: string; razorpayPaymentId: string }) => {
    const response = await apiClient.post('/payments/verify-and-fulfill', payload);
    return response.data;
  }
};

export const mentorApi = {
  bookSession: async (payload: {
    primaryDate: string;
    secondaryDate: string;
    timeSlot: string;
    guidanceTopic: string;
    notes?: string;
  }) => {
    const response = await apiClient.post('/mentor/book', payload);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await apiClient.get('/mentor/my-bookings');
    return response.data;
  }
};

export const booksApi = {
  getAllBooks: async () => {
    const response = await apiClient.get('/books');
    return response.data;
  },
  getBookById: async (id: number | string) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  }
};

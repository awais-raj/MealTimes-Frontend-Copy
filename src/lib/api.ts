import axios from 'axios';

// Base API setup
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handler for responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000';

// ---------- Auth ----------
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/User/login', { email, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/currentUser');
    return response.data;
  },

  // Role-specific registration
  registerCorporate: async (data: any) => {
    const response = await axios.post(`${API_URL}/User/register/company`, data);
    return response.data;
  },
  registerEmployee: async (data: any) => {
    const response = await axios.post(`${API_URL}/User/register/employee`, data);
    return response.data;
  },
  registerHomeChef: async (data: any) => {
    const response = await axios.post(`${API_URL}/User/register/chef`, data);
    return response.data;
  },
  registerDeliveryPerson: async (data: any) => {
    const response = await axios.post(`${API_URL}/User/register/delivery-person`, data);
    return response.data;
  }
};

// Subscription Plans API
export const subscriptionPlans = {
  getAll: async () => {
    const response = await api.get('/SubscriptionPlan');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/SubscriptionPlan/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/SubscriptionPlan', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/SubscriptionPlan/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/SubscriptionPlan/${id}`);
    return response.data;
  }
};

// Companies API
export const companies = {
  getAll: async () => {
    const response = await api.get('/CorporateCompany');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/CorporateCompany/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/CorporateCompany/${id}`, data);
    return response.data;
  },
  getEmployees: async (companyId: string) => {
    const response = await api.get(`/Employee/company/${companyId}`);
    return response.data;
  }
};

// Employees API
export const employees = {
  getById: async (id: string) => {
    const response = await api.get(`/Employee/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/Employee/${id}`, data);
    return response.data;
  }
};

// Delivery Persons API
export const deliveryPersons = {
  getAll: async () => {
    const response = await api.get('/DeliveryPerson/all');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/DeliveryPerson/${id}`);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/DeliveryPerson/${id}`, data);
    return response.data;
  },
  getAssignedDeliveries: async (deliveryPersonId: string) => {
    const response = await api.get(`/Delivery/delivery-person/${deliveryPersonId}`);
    return response.data;
  }
};

// ---------- Admin ----------
export const admin = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getRecentOrders: async () => {
    const response = await api.get('/admin/recent-orders');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/User');
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/User/${userId}`);
    return response.data;
  },
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  }
};

// Meals API
export const meals = {
  getAll: async () => {
    const response = await api.get('/Meal/all');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/Meal/${id}`);
    return response.data;
  },
  getMealsByChefId: async (chefId: string) => {
    const response = await api.get(`/Meal/chef/${chefId}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/Meal', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/Meal/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/Meal/${id}`);
    return response.data;
  },
  updateAvailability: async (mealId: number, availability: boolean) => {
    const response = await api.patch('/Meal/availability', { mealId, availability });
    return response.data;
  },
  getChefMeals: async () => {
    const response = await api.get('/meals/chef');
    return response.data;
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/meals/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Chefs API
export const chefs = {
  getById: async (id: string) => {
    const response = await api.get(`/HomeChef/${id}`);
    return response.data;
  },
  getProfile: async (id: string) => {
    const response = await api.get(`/chefs/${id}`);
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/chefs/profile', data);
    return response.data;
  },
  getReviews: async (id: string) => {
    const response = await api.get(`/chefs/${id}/reviews`);
    return response.data;
  }
};

// ---------- Nutrition ----------
export const nutrition = {
  getMealNutrition: async (mealId: string) => {
    const response = await api.get(`/nutrition/${mealId}`);
    return response.data;
  }
};

// ---------- Rewards ----------
export const rewards = {
  getPoints: async () => {
    const response = await api.get('/rewards');
    return response.data;
  }
};

// ---------- Meal Plans ----------
export const mealPlans = {
  getPlans: async () => {
    const response = await api.get('/meal-plans');
    return response.data;
  },
  subscribe: async (planId: string) => {
    const response = await api.post(`/meal-plans/${planId}/subscribe`);
    return response.data;
  },
  createCheckoutSession: async (priceId: string) => {
    const response = await api.post('/meal-plans/create-checkout-session', { priceId });
    return response.data;
  }
};

// ---------- Orders ----------
export const orders = {
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/order', data);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
  // New order endpoints
  getAllOrders: async () => {
    const response = await api.get('/Order/all');
    return response.data;
  },
  getOrdersByCompany: async (companyId: string) => {
    const response = await api.get(`/Order/company/${companyId}`);
    return response.data;
  },
  getOrdersByEmployee: async (employeeId: string) => {
    const response = await api.get(`/Order/employee/${employeeId}`);
    return response.data;
  },
  getOrdersByChef: async (chefId: string) => {
    const response = await api.get(`/Order/chef/${chefId}`);
    return response.data;
  },
  updateOrderStatus: async (data: { orderId: number; newStatus: string; chefId: number }) => {
    const response = await api.patch('/Order/chef/update-status', data);
    return response.data;
  },
  trackOrder: async (trackingNumber: string) => {
    const response = await api.get(`/Order/track/${trackingNumber}`);
    return response.data;
  },
  cancelOrder: async (orderId: number) => {
    const response = await api.delete(`/Order/cancel/${orderId}`);
    return response.data;
  }
};

// ---------- Delivery ----------
export const delivery = {
  assignDelivery: async (data: {
    orderID: number;
    deliveryPersonID: number;
    deliveryServiceName: string;
    trackingNumber: string;
  }) => {
    const response = await api.post('/Delivery/assign', data);
    return response.data;
  },
  updateDeliveryStatus: async (data: { deliveryID: number; newStatus: string }) => {
    const response = await api.patch('/Delivery/update-status', data);
    return response.data;
  },
  getDeliveriesByPerson: async (deliveryPersonId: string) => {
    const response = await api.get(`/Delivery/delivery-person/${deliveryPersonId}`);
    return response.data;
  }
};

// ---------- Corporate ----------
export const corporate = {
  getAccountDetails: async () => {
    const response = await api.get('/corporate/account');
    return response.data;
  },
  updateAccount: async (data: any) => {
    const response = await api.put('/corporate/account', data);
    return response.data;
  },
  getDepartments: async () => {
    const response = await api.get('/corporate/departments');
    return response.data;
  }
};

// ---------- Payments ----------
export const payments = {
  subscribeToplan: async (data: any) => {
    const response = await api.post('/payment/subscribe', data);
    return response.data;
  },
  getAllPayments: async () => {
    const response = await api.get('/Payments/all');
    return response.data;
  }
};

// ---------- Support ----------
export const support = {
  getFAQs: async () => {
    const response = await api.get('/support/faqs');
    return response.data;
  },
  submitTicket: async (data: any) => {
    const response = await api.post('/support/tickets', data);
    return response.data;
  }
};

// ---------- Events ----------
export const events = {
  getUpcoming: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },
  register: async (eventId: string) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  }
};

// ---------- Tracking ----------
export const tracking = {
  getOrderStatus: async (orderId: string) => {
    const response = await api.get(`/tracking/${orderId}`);
    return response.data;
  }
};

export default api;
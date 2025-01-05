import { getToken, refreshToken } from "./tokenService";

const API_BASE_URL = "http://localhost:8080/api";

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  let token = getToken();

  if (!token) {
    throw new Error("No token found");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(`${API_BASE_URL}${url}`, options);

  if (response.status === 401) {
    // Token might be expired, try to refresh it
    token = await refreshToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    response = await fetch(`${API_BASE_URL}${url}`, options);
  }

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
};

// Cart API methods
export const CartAPI = {
  fetchCart: (cartId: number) => apiRequest(`/cart/${cartId}`, { method: "GET" }),
  getOrCreateCart: (userId: number) =>
    apiRequest(`/cart/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),

  addItemToCart: (userId: number, productId: number, quantity: number, notes: string) =>
    apiRequest(`/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity, notes }),
    }),

  updateCartItemQuantity: (cartItemId: number, newQuantity: number) =>
    apiRequest(`/cart/update/${cartItemId}?newQuantity=${newQuantity}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }),

  removeCartItem: (cartItemId: number) =>
    apiRequest(`/cart/remove/${cartItemId}`, {
      method: "DELETE",
    }),
};


export const UserAPI = {
  fetchUserOrders: (userId: number) => apiRequest(`/orders/user/${userId}`, { method: "GET" }),

  login: async (email: string, password: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Login failed. Please check your credentials.");
    }

    return response.json();
  },
};

export const OrderAPI = {
  fetchOrderById: (orderId: string): Promise<any> =>
    apiRequest(`/orders/${orderId}`, { method: "GET" }),
  createOrder: (payload: any): Promise<any> =>
    apiRequest(`/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

export const ProductAPI = {
  fetchProducts: async (): Promise<any> => {
    const response = await fetch('http://localhost:8080/api/products');
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    return response.json();
  },

  fetchProductDetailsById: (productId: string): Promise<any> =>
    apiRequest(`/products/${productId}`, { method: "GET" }),
};

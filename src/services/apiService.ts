const API_BASE_URL = "http://localhost:8080/api";

// Helper function to handle requests
const request = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Cart API methods
export const CartAPI = {
  fetchCart: (cartId: number) => request(`/cart/${cartId}`, { method: "GET" }),
  createCart: () => request(`/cart`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: [] }) }),
  updateCart: (cartId: number, updatedCart: any) =>
    request(`/cart/${cartId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCart),
    }),
  addItemToCart: (cartId: number, productId: number, quantity: number, notes: string) =>
    request(`/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, productId, quantity, notes }),
    }),
};

// User API methods (if needed)
export const UserAPI = {
  fetchUserOrders: (userId: number) => request(`/orders/user/${userId}`, { method: "GET" }),
  updateUserProfile: (userId: number, updatedUser: any) =>
    request(`/users/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    }),
};

export const OrderAPI = {
  fetchOrderById: async (orderId: string): Promise<any> => {
    const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch order.");
    }
    return response.json();
  },
};

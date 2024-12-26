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
  createCart: (userId: number) =>
    request(`/cart/user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),

  addItemToCart: (cartId: number, productId: number, quantity: number, notes: string) =>
    request(`/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, productId, quantity, notes }),
    }),

  updateCartItemQuantity: async (cartItemId: number, newQuantity: number) => {
    const response = await fetch(
      `http://localhost:8080/api/cart/update/${cartItemId}?newQuantity=${newQuantity}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update cart item quantity.");
    }
    return await response.json();
  },


  removeCartItem: async (cartItemId: number) => {
    const response = await fetch(
      `http://localhost:8080/api/cart/remove/${cartItemId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove cart item.");
    }
  },
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

export const ProductAPI = {
  fetchProducts: async (): Promise<any> => {
    const response = await fetch('http://localhost:8080/api/products');
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }
    return response.json();
  },

  fetchProductDetailsById: async (productId: string): Promise<any> => {
    const response = await fetch(`http://localhost:8080/api/products/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details.");
    }
    return response.json();
  },
};

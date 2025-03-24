import { AxiosInstance } from "../configs/axios";

export async function getCart(id) {
  try {
    const response = await AxiosInstance.get(`/cart/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error.response?.data || error.message);
    return null;
  }
}

export async function addToCart(userId, productId, quantity) {
  try {
    const response = await AxiosInstance.post(`/cart/add/${userId}`, {
      productId,
      quantity,
    });
    return response;
  } catch (error) {
    console.error(
      "Lỗi thêm vào giỏ hàng:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function removeFromCart(userId, productId) {
  try {
    const response = await AxiosInstance.delete(
      `/cart/delete/${userId}/${productId}`
    );
    return response;
  } catch (error) {
    console.error(
      "Lỗi xóa sản phẩm khỏi giỏ hàng:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function updateCartQuantity(userId, productId, quantity) {
  try {
    const response = await AxiosInstance.patch(`/cart/update/${userId}`, {
      productId,
      quantity,
    });
    return response;
  } catch (error) {
    console.error(
      "Lỗi cập nhật số lượng:",
      error.response?.data || error.message
    );
    return null;
  }
}

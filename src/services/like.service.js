import { AxiosInstance } from "../configs/axios";

export async function getLike(id) {
  try {
    const response = await AxiosInstance.get(`/like/${id}`);
    return response;
  } catch (error) {
    console.error("Lỗi lấy sản phẩm thích:", error);
    return null;
  }
}

export async function addToLike(userId, productId) {
  try {
    const response = await AxiosInstance.post(`/like/add/${userId}`, {
      productId, // Đúng định dạng mong đợi của API
    });
    return response;
  } catch (error) {
    console.error("Lỗi thêm vào giỏ ưa thích:", error);
    return null;
  }
}

export async function removeFromLike(userId, productId) {
  try {
    const response = await AxiosInstance.delete(
      `/like/delete/${userId}/${productId}`
    );
    return response;
  } catch (error) {
    console.error("Lỗi xóa sản phẩm khỏi giỏ ưa thích:", error);
    return null;
  }
}

export async function deleteAllLike(userId) {
  try {
    const response = await AxiosInstance.delete(`/like/delete/${userId}`);
    return response;
  } catch (error) {
    console.error("Lỗi xóa tất cả sản phẩm ưa thích:", error);
    return null;
  }
}

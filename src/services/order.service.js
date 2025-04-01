import { AxiosInstance } from "../configs/axios";

export async function getAllOrder() {
  try {
    const response = await AxiosInstance.get(`/order`);
    return response;
  } catch (error) {
    console.error("Lỗi lấy tất cả các đơn hàng:", error);
    return null;
  }
}

export async function getOrderUser(userId) {
  try {
    const response = await AxiosInstance.post(`/order/${userId}`);
    return response;
  } catch (error) {
    console.error("Lỗi lấy tất cả các đơn hàng của người dùng:", error);
    return null;
  }
}

import { AxiosInstance } from "../configs/axios";

export const fetchCartDetails = async (userId) => {
  try {
    const response = await AxiosInstance.get(`/check-out/${userId}`);
    return response; // Trả về dữ liệu giỏ hàng
  } catch (error) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
};

export const createOrder = async (userId, data) => {
  try {
    const response = await AxiosInstance.post(
      `/check-out/order/${userId}`,
      data
    );
    return response; // Trả về thông tin đơn hàng
  } catch (error) {
    console.error("❌ Lỗi khi đặt hàng:", error);
    throw error;
  }
};

export const OrderSuccess = async (orderId) => {
  try {
    const response = await AxiosInstance.get(`/check-out/success/${orderId}`);
    return response; // Trả về thông tin đơn hàng
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng:", error);
    throw error;
  }
};

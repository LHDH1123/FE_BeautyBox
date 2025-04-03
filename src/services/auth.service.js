import { AxiosInstance } from "../configs/axios";

export async function loginPost(data) {
  try {
    const response = await AxiosInstance.post("/auth/loginPost", data, {
      withCredentials: true, // Đảm bảo cookies được gửi đi
    });
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi đăng nhập:",
      error.response?.data?.error || error.message
    );
    return null;
  }
}

export async function logout() {
  try {
    await AxiosInstance.get("/auth/logout", { withCredentials: true });
    return true;
  } catch (error) {
    console.error(
      "Lỗi khi đăng xuất:",
      error.response?.data?.error || error.message
    );
    return false;
  }
}

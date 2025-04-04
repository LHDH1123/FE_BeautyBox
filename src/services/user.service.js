import { AxiosInstance } from "../configs/axios";

export async function getAllUser() {
  try {
    const response = await AxiosInstance.get(`/user`);
    return response;
  } catch (error) {
    console.error("Lỗi lấy tất cả người dùng:", error);
    return null;
  }
}

export async function getUser(id) {
  try {
    const response = await AxiosInstance.get(`/user/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editUser(id, data) {
  try {
    const response = await AxiosInstance.patch(`/user/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function registerPost(data) {
  try {
    const response = await AxiosInstance.post("/user/register", data);
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi đăng ký:",
      error.response?.data?.error || error.message
    );
    return null;
  }
}

export async function loginPost(data) {
  try {
    const response = await AxiosInstance.post(
      "/user/login",
      data,
      { withCredentials: true } // Bật gửi cookie
    );
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
    await AxiosInstance.get("/user/logout", { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return false;
  }
}

export async function refreshTokenUser() {
  try {
    const response = await AxiosInstance.post("/user/refresh-token", null, {
      withCredentials: true, // Gửi cookie HTTP-only chứa refreshToken
    });
    const newAccessToken = response.accessToken;
    if (newAccessToken) {
      AxiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      return newAccessToken;
    }
  } catch (error) {
    console.error(
      "❌ Lỗi refresh token:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

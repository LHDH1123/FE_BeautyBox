import { AxiosInstance } from "../configs/axios";

export async function getAllReviews() {
  try {
    const response = await AxiosInstance.get("/review");
    return response;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
}

export async function toggleLike(userId, productId) {
  try {
    const response = await AxiosInstance.post(`/review/${userId}/${productId}`);
    return response;
  } catch (error) {
    console.error("Error like product:", error);
    return null;
  }
}

export async function creatReview(userId, productId, data) {
  try {
    const response = await AxiosInstance.post(
      `/review/${userId}/${productId}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error create review:", error);
    return null;
  }
}

export async function getProductFeedback(id) {
  try {
    const response = await AxiosInstance.get(`/review/feedback/${id}`);
    return response;
  } catch (error) {
    console.error("Error feedback:", error);
    throw new Error(error);
  }
}

export async function changePublic(userId, status) {
  try {
    const response = await AxiosInstance.patch(
      `/review/change-public/${userId}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error feedback:", error);
    throw new Error(error.response.data.error);
  }
}

export async function edit(id, data) {
  try {
    const response = await AxiosInstance.patch(`/review/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error edit:", error);
    throw new Error(error);
  }
}

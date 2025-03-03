import { AxiosInstance } from "../configs/axios";

export async function getAllProducts() {
  try {
    const response = await AxiosInstance.get("/products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function getDetailProduct(id) {
  try {
    const response = await AxiosInstance.get(`/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function addProduct(data) {
  try {
    const response = await AxiosInstance.post("/products/create", data);
    return response;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await AxiosInstance.delete(`/products/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
}

export async function updateProduct(id, data) {
  try {
    const response = await AxiosInstance.patch(`/products/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error editing product:", error);
    return null;
  }
}

export async function changeStatusProduct(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/products/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error editing product:", error);
    return null;
  }
}

export async function changeMultiProduct(data) {
  try {
    const response = await AxiosInstance.patch(`/products/change-multi`, data);
    return response;
  } catch (error) {
    console.error("Error editing product:", error);
    return null;
  }
}


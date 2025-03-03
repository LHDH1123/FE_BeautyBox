import { AxiosInstance } from "../configs/axios";

export async function getBrands() {
  try {
    const response = await AxiosInstance.get("/brands");
    return response;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return null;
  }
}

export async function getDetail(id) {
  try {
    const response = await AxiosInstance.get(`/brands/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return null;
  }
}

export async function addBrand(brand) {
  try {
    const response = await AxiosInstance.post("/brands/create", brand);
    return response;
  } catch (error) {
    console.error("Error adding brand:", error);
    return null;
  }
}

export async function deletebrand(id) {
  try {
    const response = await AxiosInstance.delete(`/brands/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting brand:", error);
    return null;
  }
}

export async function updateBrand(id, brand) {
  try {
    const response = await AxiosInstance.patch(`/brands/edit/${id}`, brand);
    return response;
  } catch (error) {
    console.error("Error editing brand:", error);
    return null;
  }
}

export async function changeStatus(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/brands/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error editing brand:", error);
    return null;
  }
}

export async function changeMulti(data) {
  try {
    const response = await AxiosInstance.patch(`/brands/change-multi`, data);
    return response;
  } catch (error) {
    console.error("Error editing brand:", error);
    return null;
  }
}

export async function getNameBrand(id) {
  try {
    const response = await AxiosInstance.get(`/brands/${id}`);
    return response.name;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return null;
  }
}

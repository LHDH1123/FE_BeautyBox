import { AxiosInstance } from "../configs/axios";

export const getAddress = async (userId) => {
  try {
    const response = await AxiosInstance.get(`address/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export const getAddressById = async (addressId) => {
  try {
    const response = await AxiosInstance.get(`address/getAddress/${addressId}`);
    return response;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export const createAddress = async (userId, addressData) => {
  try {
    const response = await AxiosInstance.post(
      `address/add/${userId}`,
      addressData
    );
    return response;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

export const updateAddress = async (addressId, updatedData) => {
  try {
    const response = await AxiosInstance.patch(
      `address/edit/${addressId}`,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await AxiosInstance.delete(`address/delete/${addressId}`);
    return response;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

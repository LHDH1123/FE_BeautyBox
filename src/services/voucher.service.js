import { AxiosInstance } from "../configs/axios";

// Lấy danh sách voucher
export async function getAllVouchers() {
  try {
    const response = await AxiosInstance.get("/voucher");
    return response;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return null;
  }
}

// Lấy thông tin voucher theo ID
export async function getVoucherById(id) {
  try {
    const response = await AxiosInstance.get(`/voucher/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    return null;
  }
}

// Tạo mới voucher
export async function createVoucher(data) {
  try {
    const response = await AxiosInstance.post("/voucher/create", data);
    return response;
  } catch (error) {
    console.error("Error creating voucher:", error);
    return null;
  }
}

// Chỉnh sửa voucher theo ID
export async function updateVoucher(id, data) {
  try {
    const response = await AxiosInstance.patch(`/voucher/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating voucher:", error);
    return null;
  }
}

// Thay đổi trạng thái voucher
export async function changeVoucherStatus(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/voucher/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error changing voucher status:", error);
    return null;
  }
}

// Xóa mềm voucher
export async function deleteVoucher(id) {
  try {
    const response = await AxiosInstance.delete(`/voucher/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return null;
  }
}

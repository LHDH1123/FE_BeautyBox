import { aiAxios } from "../../src/configs/axios/axiosAI";

export const getProductsAIRCMByTitle = async (title, topN = 5) => {
  try {
    const res = await aiAxios.get("/recommend/by-title", {
      params: {
        title,
        top_n: topN,
      },
    });
    return res;
  } catch (err) {
    console.error("❌ Lỗi gọi API recommend/by-title:", err);
    throw err;
  }
};

export const getProductsAIRCMById = async (productId, topN = 5) => {
  try {
    const res = await aiAxios.get("/recommend/by-id", {
      params: {
        product_id: productId,
        top_n: topN,
      },
    });
    return res;
  } catch (err) {
    console.error("❌ Lỗi gọi API recommend/by-id:", err);
    throw err;
  }
};

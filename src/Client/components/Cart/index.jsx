import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { getDetailProduct } from "../../../services/product.service";

const cx = classNames.bind(styles);

function Cart({ cart }) {
  const [products, setProducts] = useState([]);

  // Hàm lấy chi tiết sản phẩm từ API
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || !cart.products) return;

      try {
        const productDetails = await Promise.all(
          cart.products.map(async (item) => {
            const product = await getDetailProduct(item.product_id);
            console.log(product[0]);
            return {
              id: product[0]._id,
              thumbnail: Array.isArray(product[0].thumbnail)
                ? product[0].thumbnail[0] // Nếu là mảng, lấy ảnh đầu tiên
                : product[0].thumbnail,
              SKU: product[0].SKU,
              title: product[0].title,
              price: product[0].price,
              discountPercentage: product[0].discountPercentage,
              quantity: item.quantity, // Lấy số lượng từ cart
            };
          })
        );

        setProducts(productDetails);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [cart]); // Chạy lại khi `cart` thay đổi

  console.log(products);

  return (
    <div className={cx("div-cart")}>
      <div className={cx("cart")}>
        <input type="checkbox" />
        <div className={cx("title")}>Chọn tất cả</div>
      </div>
      <div className={cx("saperator")}></div>

      <div className={cx("body")}>
        {products.map((product) => (
          <div className={cx("product")}>
            <input type="checkbox" />
            <div className={cx("img-product")}>
              <img src={product.thumbnail} alt="" />
            </div>
            <div className={cx("info-product")}>
              <div className={cx("title-product")}>
                {/* <div className={cx("description-product")}>Sản phẩm 1</div> */}
                <a href="/">{product.title}</a>
                <button>
                  <RemoveIcon fontSize="smal" />
                </button>
              </div>

              <div className={cx("code-product")}>SKU: {product.SKU}</div>

              <div className={cx("number-product")}>
                <div className={cx("number")}>
                  <button>
                    <RemoveIcon
                      fontSize="inherit"
                      style={{
                        fontSize: "12px",
                        stroke: "currentColor", // Thêm viền
                        strokeWidth: 1, // Làm viền đậm hơn
                      }}
                    />
                  </button>
                  <div className={cx("quantity")}>{product.quantity}</div>
                  <button style={{ fontWeight: "600" }}>
                    <AddIcon
                      fontSize="inherit"
                      style={{
                        fontSize: "12px",
                        stroke: "currentColor", // Thêm viền
                        strokeWidth: 1, // Làm viền đậm hơn
                      }}
                    />
                  </button>
                </div>
                {product.discountPercentage === 0 ? (
                  <div className={cx("price-product")}>
                    <div className={cx("new-price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        product.price -
                          (product.price * product.discountPercentage) / 100
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={cx("price-product")}>
                    <div className={cx("price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </div>
                    <div className={cx("new-price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        product.price -
                          (product.price * product.discountPercentage) / 100
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;

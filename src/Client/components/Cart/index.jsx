import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { getDetailProduct } from "../../../services/product.service";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../../services/cart.service";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Cart({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || !cart.products) return;

      try {
        const productDetails = await Promise.all(
          cart.products.map(async (item) => {
            const product = await getDetailProduct(item.product_id);
            return {
              id: product[0]._id,
              thumbnail: Array.isArray(product[0].thumbnail)
                ? product[0].thumbnail[0]
                : product[0].thumbnail,
              SKU: product[0].SKU,
              title: product[0].title,
              price: product[0].price,
              slug: product[0].slug,
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
  }, [cart]);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return; // Không cho giảm số lượng dưới 1

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );

    const response = await updateCartQuantity(cart.user_id, id, newQuantity);
    if (!response) {
      console.error("❌ Cập nhật số lượng thất bại");
    } else {
      setCart(response.cart);
    }
  };

  const handleRemoveCart = async (id) => {
    const response = await removeFromCart(cart.user_id, id);
    if (response) {
      console.log("Xóa sản phẩm thành công", response);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setCart(response.cart);
    }
  };

  const handleNavigate = (slug) => {
    navigate(`/detailProduct/${slug}`);
  };

  return (
    <div className={cx("div-cart")}>
      <div className={cx("cart")}>
        <input type="checkbox" />
        <div className={cx("title")}>Chọn tất cả</div>
      </div>
      <div className={cx("saperator")}></div>

      <div className={cx("body")}>
        {products.map((product) => (
          <div className={cx("product")} key={product.id}>
            <input type="checkbox" />
            <div className={cx("img-product")}>
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <div className={cx("info-product")}>
              <div className={cx("title-product")}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavigate(product.slug)}
                >
                  {product.title}
                </div>
                <div
                  className={cx("remove-cart")}
                  onClick={() => handleRemoveCart(product.id)}
                >
                  <button>
                    <RemoveIcon fontSize="inherit" />
                  </button>
                </div>
              </div>

              <div className={cx("code-product")}>SKU: {product.SKU}</div>

              <div className={cx("number-product")}>
                <div className={cx("number")}>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(product.id, product.quantity - 1)
                    }
                  >
                    <RemoveIcon
                      fontSize="inherit"
                      style={{
                        fontSize: "12px",
                        stroke: "currentColor",
                        strokeWidth: 1,
                      }}
                    />
                  </button>
                  <div className={cx("quantity")}>{product.quantity}</div>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(product.id, product.quantity + 1)
                    }
                  >
                    <AddIcon
                      fontSize="inherit"
                      style={{
                        fontSize: "12px",
                        stroke: "currentColor",
                        strokeWidth: 1,
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
                      }).format(product.price)}
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

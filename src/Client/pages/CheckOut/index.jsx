import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CheckOut.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";
import { getDetailProduct } from "../../../services/product.service";
import {
  getAllVouchers,
  getVoucherById,
} from "../../../services/voucher.service";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../../services/cart.service";
import { getAllAddress } from "../../../services/address.service";
import { refreshTokenUser } from "../../../services/user.service";
import { jwtDecode } from "jwt-decode";

const cx = classNames.bind(styles);

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [sale, setSale] = useState([]);
  const [userId, setUserId] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [defaultddress, setDefaultddress] = useState([]);

  // console.log(selectedVoucher);
  const location = useLocation();
  const cart = location.state;

  const fetchVoucherDiscount = async () => {
    try {
      if (selectedVoucher !== "") {
        const response = await getVoucherById(selectedVoucher);
        if (response) {
          setSale(response[0].discount / -100);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAddress = async () => {
    try {
      if (userId) {
        const response = await getAllAddress(userId);
        if (response) {
          setAllAddress(response);

          // Lọc địa chỉ mặc định (status === true)
          const defaultAddress = response.find(
            (address) => address.status === true
          );
          if (defaultAddress) {
            setDefaultddress(defaultAddress);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await refreshTokenUser();
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setUserId(decodedUser.userId);
        } catch (error) {
          console.error("❌ Lỗi giải mã token:", error);
        }
      } else {
        console.warn("🚪 Người dùng chưa đăng nhập hoặc token hết hạn");
      }
    };

    fetchUser();
  }, []);

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
              discountPercentage: product[0].discountPercentage,
              quantity: item.quantity,
            };
          })
        );

        setProducts(productDetails);
        const total = productDetails.reduce((sum, product) => {
          const discountedPrice =
            product.price - (product.price * product.discountPercentage) / 100;
          return sum + discountedPrice * product.quantity;
        }, 0);

        setTotalPrice(total);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchProductDetails();
  }, [cart]);

  const fetchVouchers = async () => {
    try {
      const response = await getAllVouchers();
      if (response) {
        setVouchers(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchVoucherDiscount();
    fetchAddress();
  });

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handleVoucherChange = (voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return; // Không cho giảm số lượng dưới 1

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );

    // Cập nhật ngay tổng giá trị đơn hàng
    setTotalPrice((prevTotal) => {
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) return prevTotal;

      const oldSubtotal =
        (productToUpdate.price -
          (productToUpdate.price * productToUpdate.discountPercentage) / 100) *
        productToUpdate.quantity;

      const newSubtotal =
        (productToUpdate.price -
          (productToUpdate.price * productToUpdate.discountPercentage) / 100) *
        newQuantity;

      return prevTotal - oldSubtotal + newSubtotal;
    });

    const response = await updateCartQuantity(cart.user_id, id, newQuantity);
    if (!response) {
      console.error("❌ Cập nhật số lượng thất bại");
    }
  };

  const handleRemoveCart = async (id) => {
    const response = await removeFromCart(cart.user_id, id);
    if (response) {
      console.log("Xóa sản phẩm thành công", response);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    }
  };

  return (
    <div className={cx("checkout-container")}>
      <div className={cx("left-section")}>
        <div className={cx("title")}>Thông tin thanh toán</div>
        <BuyerInfo defaultddress={defaultddress} />
        <PaymentMethods
          selectedPayment={selectedPayment}
          onPaymentChange={handlePaymentChange}
          selectedVoucher={selectedVoucher}
          onVoucherChange={handleVoucherChange}
          vouchers={vouchers}
          totalPrice={totalPrice}
        />
      </div>

      <div className={cx("right-section")}>
        <OrderSummary
          products={products}
          totalPrice={totalPrice}
          sale={sale}
          handleUpdateQuantity={handleUpdateQuantity}
          handleRemoveCart={handleRemoveCart}
        />
        <div className={cx("btn")}>
          <button className={cx("btn-order")}>ĐẶT HÀNG</button>
        </div>
        <p className={cx("note")}>*Vui lòng không hủy đơn hàng đã thanh toán</p>
      </div>
    </div>
  );
};

const BuyerInfo = ({ defaultddress }) => {
  return (
    <div>
      <div className={cx("contact-account")}>
        <div className={cx("title")} style={{ fontSize: "20px" }}>
          Thông tin người mua hàng
        </div>
        <div className={cx("account")}>
          <span>Bạn đã đăng nhập với tài khoản </span>
          <span className={cx("text-underline")}>{defaultddress.email}</span>.
          <span className={cx("logout")}> Đăng xuất</span>
        </div>
      </div>
      <div
        className={cx("buyer-info")}
        style={{ display: "flex", border: "1px solid rgb(223, 223, 223)" }}
      >
        <div>
          <div className={cx("contact-info")}>
            {defaultddress.last_name} {defaultddress.name} |{" "}
            {defaultddress.phone} | {defaultddress.email}
          </div>
          <div>
            {defaultddress.titleAddress} | {defaultddress.address},{" "}
            {defaultddress.ward}, {defaultddress.districts},{" "}
            {defaultddress.city}
          </div>
        </div>
        <div className={cx("change")}>Thay đổi</div>
      </div>
    </div>
  );
};

const PaymentMethods = ({
  selectedPayment,
  onPaymentChange,
  selectedVoucher,
  onVoucherChange,
  vouchers,
  totalPrice,
}) => {
  const methods = [
    { id: "COD", label: "Trả tiền mặt khi nhận hàng (COD)" },
    { id: "ZaloPay", label: "Zalopay & Chuyển khoản Ngân Hàng" },
  ];

  return (
    <div>
      <h3 className={cx("payment-title")}>Phương thức thanh toán</h3>
      <div className={cx("payment-methods")}>
        {methods.map((method) => (
          <div key={method.id} className={cx("method")}>
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === method.id}
              onChange={() => onPaymentChange(method.id)}
            />
            <label>{method.label}</label>
          </div>
        ))}
      </div>

      <h3 className={cx("payment-title")}>Voucher giảm giá</h3>
      <div className={cx("payment-methods")}>
        {vouchers.map((voucher) => {
          // Điều kiện voucher có phù hợp với totalPrice không?
          const isApplicable = totalPrice >= voucher.minOrderValue; // Giả sử voucher có minOrderValue
          return (
            <div
              key={voucher._id}
              className={cx("method")}
              style={{ opacity: isApplicable ? 1 : 0.5 }}
            >
              <input
                type="radio"
                name="voucher"
                checked={selectedVoucher === voucher._id}
                onChange={() => onVoucherChange(voucher._id)}
                disabled={!isApplicable} // Không cho chọn nếu không đủ điều kiện
              />
              <label>{voucher.title}</label>
              <div className={cx("condition")}>{voucher.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderSummary = ({
  products,
  totalPrice,
  sale,
  handleUpdateQuantity,
  handleRemoveCart,
}) => {
  return (
    <div className={cx("order-summary")}>
      <h3 className={cx("order-title")}>Đơn hàng</h3>

      <div className={cx("body")}>
        {products.map((product) => (
          <div className={cx("product")} key={product.id}>
            <div className={cx("img-product")}>
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <div className={cx("info-product")}>
              <div className={cx("title-product")}>
                <a href="/">{product.title}</a>
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
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={cx("total-section")}>
        <div className={cx("totalProduct")}>
          <div className={cx("title-product")}>Tổng giá trị đơn hàng</div>
          <div className={cx("total-cart")}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice)}
          </div>
        </div>
        <div className={cx("totalProduct")}>
          <div className={cx("title-product")}>Giảm giá</div>
          <div className={cx("total-cart")} style={{ color: "#0992d0" }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice * sale)}
          </div>
        </div>
        <div
          className={cx("totalProduct")}
          style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "10px" }}
        >
          <div className={cx("title-product")}>Phí vận chuyển</div>
          <div className={cx("price-product")}>
            <div className={cx("price")}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(27000)}
            </div>
            <div className={cx("total-cart")}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(12000)}
            </div>
          </div>
        </div>

        <div className={cx("totalProduct")}>
          <div className={cx("title-product")}>Tổng</div>
          <div className={cx("total-cart")}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalPrice - totalPrice * sale + 12000)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

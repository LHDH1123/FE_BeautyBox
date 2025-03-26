import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./CheckOut.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const cx = classNames.bind(styles);

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("COD");
  const [selectedVoucher, setSelectedVoucher] = useState("1");

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handleVoucherChange = (voucher) => {
    setSelectedVoucher(voucher);
  };

  return (
    <div className={cx("checkout-container")}>
      <div className={cx("left-section")}>
        <div className={cx("title")}>Thông tin thanh toán</div>
        <BuyerInfo />
        <PaymentMethods
          selectedPayment={selectedPayment}
          onPaymentChange={handlePaymentChange}
          selectedVoucher={selectedVoucher}
          onVoucherChange={handleVoucherChange}
        />
      </div>

      <div className={cx("right-section")}>
        <OrderSummary />
        <div className={cx("btn")}>
          <button className={cx("btn-order")}>ĐẶT HÀNG</button>
        </div>
        <p className={cx("note")}>*Vui lòng không hủy đơn hàng đã thanh toán</p>
      </div>
    </div>
  );
};

const BuyerInfo = () => {
  return (
    <div>
      <div className={cx("contact-account")}>
        <div className={cx("title")} style={{ fontSize: "20px" }}>
          Thông tin người mua hàng
        </div>
        <div className={cx("account")}>
          <span>Bạn đã đăng nhập với tài khoản </span>
          <span className={cx("text-underline")}>lehuuduchuy124@gmail.com</span>
          .<span className={cx("logout")}> Đăng xuất</span>
        </div>
      </div>
      <div
        className={cx("buyer-info")}
        style={{ display: "flex", border: "1px solid rgb(223, 223, 223)" }}
      >
        <div>
          <div className={cx("contact-info")}>
            123 | 840932598727 | lehuuduchuy124@gmail.com
          </div>
          <div>
            Khối 5 | 12 Trần Nhân Tông, phường Vĩnh Điện, Thị xã Điện Bàn, Quảng
            Nam
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
}) => {
  const methods = [
    { id: "COD", label: "Trả tiền mặt khi nhận hàng (COD)" },
    { id: "ZaloPay", label: "Zalopay & Chuyển khoản Ngân Hàng" },
  ];

  const vouchers = [
    {
      id: "1",
      title: "Giảm 5%",
      desciption: "Điều kiện: Tổng đơn hàng trên 500k",
    },
    {
      id: "2",
      title: "Giảm 10%",
      desciption: "Điều kiện: Tổng đơn hàng trên 1000k",
    },
    {
      id: "3",
      title: "Giảm 15%",
      desciption: "Điều kiện: Tổng đơn hàng trên 2000k",
    },
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
        {vouchers.map((voucher) => (
          <div key={voucher.id} className={cx("method")}>
            <input
              type="radio"
              name="voucher"
              checked={selectedVoucher === voucher.id}
              onChange={() => onVoucherChange(voucher.id)}
            />
            <label>{voucher.title}</label>
            <div className={cx("condition")}>{voucher.desciption}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderSummary = () => {
  const products = [
    {
      SKU: "EC24-BBX12-CAMP-10",
      id: "67ca77fc08ce99e90c59f200",
      title:
        "Trải Nghiệm Đủ Loại Mặt Nạ Hàn Tốt Nhất Từ Nhiều Thương Hiệu THE FACE SHOP - Goodal - Dermatory (20 miếng)",
      price: 1123000,
      discountPercentage: 56,
      quantity: 1,
      thumbnail:
        "http://res.cloudinary.com/dqluwmghj/image/upload/v1741322236/products/bysazedtotnmpqpvnfh5.png",
    },
    {
      SKU: "27280232",
      id: "67d0fcf0fbc023f56a6bfe5d",
      title:
        "(Phiên bản mới - Soda Cafe) Son Tint Bóng Peripera Căng Mướt Môi Ink Mood Glowy Tint 4g",
      price: 229000,
      discountPercentage: 26,
      quantity: 2,
      thumbnail:
        "https://image.hsv-tech.io/600x600/bbx/common/1df00f8c-b370-4292-b48f-38cfb61b5228.webp",
    },
    {
      SKU: "27280232",
      id: "67d0fcf0fbc023f56a6bfe5d",
      title:
        "(Phiên bản mới - Soda Cafe) Son Tint Bóng Peripera Căng Mướt Môi Ink Mood Glowy Tint 4g",
      price: 229000,
      discountPercentage: 26,
      quantity: 2,
      thumbnail:
        "https://image.hsv-tech.io/600x600/bbx/common/1df00f8c-b370-4292-b48f-38cfb61b5228.webp",
    },
    {
      SKU: "27280232",
      id: "67d0fcf0fbc023f56a6bfe5d",
      title:
        "(Phiên bản mới - Soda Cafe) Son Tint Bóng Peripera Căng Mướt Môi Ink Mood Glowy Tint 4g",
      price: 229000,
      discountPercentage: 26,
      quantity: 2,
      thumbnail:
        "https://image.hsv-tech.io/600x600/bbx/common/1df00f8c-b370-4292-b48f-38cfb61b5228.webp",
    },
  ];

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
                  //   onClick={() => handleRemoveCart(product.id)}
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
                  // onClick={() =>
                  //   handleUpdateQuantity(product.id, product.quantity - 1)
                  // }
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
                  // onClick={() =>
                  //   handleUpdateQuantity(product.id, product.quantity + 1)
                  // }
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
      <div className={cx("total-section")}>
        <div className={cx("totalProduct")}>
          <div className={cx("title-product")}>Tổng giá trị đơn hàng</div>
          <div className={cx("total-cart")}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(1085000)}
          </div>
        </div>
        <div className={cx("totalProduct")}>
          <div className={cx("title-product")}>Giảm giá</div>
          <div className={cx("total-cart")} style={{ color: "#0992d0" }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(-122000)}
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
            }).format(1050000)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

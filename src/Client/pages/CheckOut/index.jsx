import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CheckOut.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailProduct } from "../../../services/product.service";
import {
  getAllVouchers,
  getVoucherById,
} from "../../../services/voucher.service";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../../services/cart.service";
import {
  createAddress,
  getAddressById,
  getAllAddress,
  updateAddress,
} from "../../../services/address.service";
import { getUser, refreshTokenUser } from "../../../services/user.service";
import { jwtDecode } from "jwt-decode";
import { Box, Dialog, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { createOrder } from "../../../services/checkout.service";
import { useAuth } from "../../Context/AuthContext";

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
  const [isAddress, setIsAddress] = useState(false);
  const [editAddress, setEditAddress] = useState({
    titleAddress: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    districts: "",
    ward: "",
    address: "",
    status: true,
  });
  const location = useLocation();
  const selectCart = location.state;
  const [isModalAddress, setIsModalAddress] = useState(false);
  const [isModalAllAddress, setIsModalAllAddress] = useState(false);
  // const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { cart, setCart } = useAuth();

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
          const defaultAddress = response.find(
            (address) => address.status === true
          );
          console.log(response);
          setDefaultddress(defaultAddress);
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    fetchVoucherDiscount();
  }, [selectedVoucher]);

  useEffect(() => {
    fetchAddress();
    fetchVouchers();
  }, [userId]);

  // Chỉ chạy khi allAddress thay đổi

  useEffect(() => {
    const fetchUser = async () => {
      const token = await refreshTokenUser();
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setUserId(decodedUser.userId);
          const response = await getUser(decodedUser.userId);
          if (response) {
            setUserEmail(response.user);
          }
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
      if (!selectCart || !selectCart.products) return;

      try {
        const productDetails = await Promise.all(
          selectCart.products.map(async (item) => {
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
  }, [selectCart]);

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
  };

  const handleVoucherChange = (id) => {
    setSelectedVoucher(id);
  };
  const [cartState, setCartState] = useState(selectCart);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (selectCart._id) {
      if (newQuantity < 1) return;

      // Check if the quantity has already been updated for this product
      const productToUpdate = products.find((product) => product.id === id);
      if (productToUpdate && productToUpdate.quantity === newQuantity) return; // Skip if already updated

      // Set products with the updated quantity
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, quantity: newQuantity } : product
        )
      );

      // Update the cart state with the new quantity
      setCartState((prevCart) => ({
        ...prevCart,
        products: prevCart.products.map((item) =>
          item.product_id === id ? { ...item, quantity: newQuantity } : item
        ),
      }));

      // Update the total price based on the updated quantity
      setTotalPrice((prevTotal) => {
        const productToUpdate = products.find((product) => product.id === id);
        if (!productToUpdate) return prevTotal;

        const oldSubtotal =
          (productToUpdate.price -
            (productToUpdate.price * productToUpdate.discountPercentage) /
              100) *
          productToUpdate.quantity;

        const newSubtotal =
          (productToUpdate.price -
            (productToUpdate.price * productToUpdate.discountPercentage) /
              100) *
          newQuantity;

        return prevTotal - oldSubtotal + newSubtotal;
      });

      // Update the quantity in the backend (selectCart)
      const response = await updateCartQuantity(
        selectCart.user_id,
        id,
        newQuantity
      );
      if (!response) {
        console.error("❌ Cập nhật số lượng thất bại");
      }
    } else {
      setCartState((prevCart) => ({
        ...prevCart,
        products: prevCart.products.map((item) =>
          item.product_id === id ? { ...item, quantity: newQuantity } : item
        ),
      }));

      // Cập nhật số lượng trên UI (products state)
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, quantity: newQuantity } : product
        )
      );
    }
  };

  const handleRemoveCart = async (id) => {
    const response = await removeFromCart(selectCart.user_id, id);
    if (response) {
      console.log("Xóa sản phẩm thành công", response);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    }
  };

  const handleModal = () => {
    setIsModalAddress((prev) => !prev);
  };

  const handleModalAllAddress = () => {
    setIsModalAllAddress((prev) => !prev);
  };

  const handleChangeEdit = (e) => {
    const { name, value, type, checked } = e.target;

    setEditAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateAddress = async () => {
    try {
      const response = await updateAddress(editAddress._id, editAddress);
      if (response) {
        setAllAddress((prevAddresses) =>
          prevAddresses.map(
            (addr) =>
              addr._id === editAddress._id
                ? { ...response, status: editAddress.status }
                : { ...addr, status: editAddress.status ? false : addr.status } // Set false nếu addr không phải là editAddress
          )
        );
        handleModal();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
    }
  };

  const handleEdit = async (id) => {
    handleModal();
    try {
      const response = await getAddressById(id);
      if (response) {
        setEditAddress(response);
      } else {
        console.warn("No address found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleModalAdd = async () => {
    handleModal();
    setEditAddress({
      titleAddress: "",
      name: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      districts: "",
      ward: "",
      address: "",
      status: true,
    });
    setIsAddress(true);
  };

  const handleAdd = async () => {
    try {
      const response = await createAddress(userId, editAddress);
      if (response) {
        setAllAddress((prevAddresses) =>
          allAddress.status
            ? prevAddresses
                .map((addr) => ({ ...addr, status: false }))
                .concat(response.data)
            : [...prevAddresses, response.data]
        );
        handleModal();
        setEditAddress({
          titleAddress: "",
          name: "",
          lastName: "",
          email: "",
          phone: "",
          city: "",
          districts: "",
          ward: "",
          address: "",
          status: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
    }
  };

  const handleChooseAddress = async () => {
    try {
      const response = await getAddressById(selectedAddress);
      if (response) {
        setDefaultddress(response);
        setIsModalAllAddress(false);
      } else {
        console.warn("No address found for the given ID");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleOrder = async () => {
    try {
      const fullName = userEmail.fullName;
      const phone = userEmail.phone;
      const address = `${defaultddress.address}, ${defaultddress.ward}, ${defaultddress.districts}, ${defaultddress.city}`;
      const orderCart = cartState.products;
      const voucher_id = selectedVoucher;
      const isCheckout = selectedPayment === "ZaloPay";

      const response = await createOrder(userId, {
        fullName,
        phone,
        address,
        voucher_id,
        isCheckout,
        cart: orderCart,
      });
      if (response) {
        console.log(response);
        const orderId = response;
        navigate("/order-checkout", { state: { orderId, sale } });
        setCart({
          products: cart.products.filter(
            (item) =>
              !orderCart.some(
                (orderItem) => orderItem.product_id === item.product_id
              )
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cx("checkout-container")}>
      <div className={cx("left-section")}>
        <div className={cx("title")}>Thông tin thanh toán</div>
        <BuyerInfo
          defaultddress={defaultddress}
          handleModalAllAddress={handleModalAllAddress}
          userEmail={userEmail}
        />
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
          <button className={cx("btn-order")} onClick={handleOrder}>
            ĐẶT HÀNG
          </button>
        </div>
        <p className={cx("note")}>*Vui lòng không hủy đơn hàng đã thanh toán</p>
      </div>

      <Dialog
        open={isModalAddress}
        onClose={handleModal}
        maxWidth="none"
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "600px",
            width: "700px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button
                onClick={() => {
                  handleModal();
                }}
              >
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            {isAddress ? (
              <div className={cx("title-edit")}>Thêm địa chỉ</div>
            ) : (
              <div className={cx("title-edit")}>Chỉnh sửa địa chỉ</div>
            )}

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="titleAddress"
                value={editAddress.titleAddress}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Tên địa chỉ (vd: Văn phòng, Nhà, ...)"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("fullname")}>
                <input
                  type="text"
                  name="name"
                  value={editAddress.name}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Tên"
                />
                <input
                  type="text"
                  name="last_name"
                  value={editAddress.last_name}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Họ"
                />
              </div>
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="phone"
                value={editAddress.phone}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="SĐT"
              />
            </div>
            <div className={cx("formGroup")}>
              <input
                type="text"
                name="email"
                value={editAddress.email}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Email"
              />
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="city"
                value={editAddress.city}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Tỉnh/ Thành phố"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("districts")}>
                <input
                  type="text"
                  name="districts"
                  value={editAddress.districts}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Quận/ Huyện"
                />
                <input
                  type="text"
                  name="ward"
                  value={editAddress.ward}
                  className={cx("input")}
                  onChange={handleChangeEdit}
                  placeholder="Phường/ Xã"
                />
              </div>
            </div>

            <div className={cx("formGroup")}>
              <input
                type="text"
                name="address"
                value={editAddress.address}
                className={cx("input")}
                onChange={handleChangeEdit}
                placeholder="Tòa nhà, số nhà, tên đường"
              />
            </div>

            <div className={cx("formGroup")}>
              <div className={cx("default")}>
                <div>
                  <input
                    type="checkbox"
                    name="status"
                    checked={editAddress.status}
                    onChange={(e) =>
                      setEditAddress({
                        ...editAddress,
                        status: e.target.checked,
                      })
                    }
                    className={cx("input")}
                  />
                </div>
                <div className={cx("addressDefault")}>
                  Đặt làm dịa chỉ mặc định
                </div>
              </div>
            </div>

            <div className={cx("buttons")}>
              {isAddress ? (
                <div>
                  <button
                    type="submit"
                    className={cx("btn-submit")}
                    onClick={handleAdd}
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="submit"
                    className={cx("btn-submit")}
                    onClick={handleUpdateAddress}
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Dialog>

      <Dialog
        open={isModalAllAddress}
        onClose={handleModalAllAddress}
        maxWidth="none"
        PaperProps={{
          style: {
            marginTop: "-200px",
            borderRadius: "16px",
            width: "700px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button
                onClick={() => {
                  handleModalAllAddress();
                }}
              >
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title-choose")}>Chọn địa chỉ</div>

            <div>
              {allAddress.map((address) => (
                <div key={address._id} className={cx("address-item")}>
                  <input
                    type="radio"
                    value={address.id}
                    checked={selectedAddress === address._id}
                    onChange={() => setSelectedAddress(address._id)}
                  />
                  <div className={cx("address-info")}>
                    <div className={cx("title-header")}>
                      <div className={cx("title-address")}>
                        {address.last_name} {address.name} | {address.phone} |{" "}
                        {address.email}
                      </div>
                      <div className={cx("icon-edit")}>
                        {address.status === true && (
                          <div className={cx("title-default")}>Mặc định</div>
                        )}
                        <DriveFileRenameOutlineIcon
                          fontSize="inherit"
                          sx={{
                            color: "#ab2328",
                            marginTop: "5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEdit(address._id)}
                        />
                      </div>
                    </div>
                    <div className={cx("title-address")}>
                      {address.titleAddress} | {address.address}, {address.ward}
                      , {address.districts}, {address.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={cx("add-save")}>
              <div className={cx("add")} onClick={handleModalAdd}>
                + Thêm địa chỉ
              </div>
              <button className={cx("save")} onClick={handleChooseAddress}>
                Lưu
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

const BuyerInfo = ({ defaultddress, handleModalAllAddress, userEmail }) => {
  return (
    <div>
      <div className={cx("contact-account")}>
        <div className={cx("title")} style={{ fontSize: "20px" }}>
          Thông tin người mua hàng
        </div>
        <div className={cx("account")}>
          <span>Bạn đã đăng nhập với tài khoản </span>
          <span className={cx("text-underline")}>{userEmail.email}</span>.
        </div>
      </div>
      <div
        className={cx("buyer-info")}
        style={{ display: "flex", border: "1px solid rgb(223, 223, 223)" }}
      >
        <div>
          <div className={cx("contact-info")}>
            {defaultddress?.last_name} {defaultddress?.name} |{" "}
            {defaultddress?.phone} | {defaultddress?.email}
          </div>
          <div>
            {defaultddress?.titleAddress} | {defaultddress?.address},{" "}
            {defaultddress?.ward}, {defaultddress?.districts},{" "}
            {defaultddress?.city}
          </div>
        </div>
        <div className={cx("change")} onClick={() => handleModalAllAddress()}>
          Thay đổi
        </div>
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
            }).format(totalPrice + totalPrice * sale + 12000)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

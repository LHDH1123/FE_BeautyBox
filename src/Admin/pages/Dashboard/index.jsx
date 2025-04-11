import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
// import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import iconOder from "../../../assets/images/file-text-icon-01.svg";
import iconSale from "../../../assets/images/weekly-earning.svg";
import iconUser from "../../../assets/images/user-svgrepo-com.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getAllProducts } from "../../../services/product.service";
import { getAllUser } from "../../../services/user.service";
import { getAllOrder } from "../../../services/order.service";
import { ResponsiveContainer } from "recharts"; // nhớ thêm import nếu chưa có
// const data = [
//   { name: "Jan", Sales: 300 },
//   { name: "Feb", Sales: 200 },
//   { name: "Mar", Sales: 400 },
//   { name: "Apr", Sales: 300 },
//   { name: "May", Sales: 200 },
//   { name: "Jun", Sales: 100 },
//   { name: "Jul", Sales: 350 },
//   { name: "Aug", Sales: 400 },
//   { name: "Sep", Sales: 300 },
//   { name: "Oct", Sales: 200 },
//   { name: "Nov", Sales: 100 },
//   { name: "Dec", Sales: 350 },
// ];
const cx = classNames.bind(styles);

const Dashboard = () => {
  const [listProduct, setListProduct] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listOrder, setListOrder] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalMonth, setTotalMonth] = useState([]);

  const formatRevenueData = (orders) => {
    const revenueByMonth = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth() + 1;

      order.products.forEach((product) => {
        const { price, discountPercentage, quantity } = product;
        const discountedPrice = price * (1 - discountPercentage / 100);
        const total = discountedPrice * quantity;
        revenueByMonth[month] = (revenueByMonth[month] || 0) + total;
      });
    });

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return {
        name: `Tháng ${month}`,
        Sales: Math.round(revenueByMonth[month] || 0),
      };
    });

    return chartData;
  };

  const fetchProduct = async () => {
    try {
      const response = await getAllProducts();
      if (response) {
        // Sắp xếp sản phẩm theo createAt giảm dần (mới nhất -> cũ nhất)
        const sortedProducts = response.sort(
          (a, b) =>
            new Date(b.createdBy.createAt) - new Date(a.createdBy.createAt)
        );

        // Lấy 5 sản phẩm mới nhất
        const latestProducts = sortedProducts.slice(0, 5);

        setListProduct(latestProducts);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUser();
      if (response) {
        setListUser(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder();
      if (response) {
        setListOrder(response);

        const calculateTotalPrice = (orders) => {
          return orders.reduce((total, order) => {
            const orderTotal = order.products.reduce((sum, product) => {
              return (
                sum +
                (product.price -
                  (product.price * product.discountPercentage) / 100) *
                  product.quantity
              );
            }, 0);
            return total + orderTotal;
          }, 0);
        };

        // Tổng doanh thu toàn bộ đơn hàng

        // 👉 Doanh thu tháng hiện tại (KHÔNG cần kiểm tra isCheckout)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const ordersThisMonth = response.filter((order) => {
          const createdAt = new Date(order.createdAt);
          return (
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear
          );
        });

        const totalMonthRevenue = calculateTotalPrice(ordersThisMonth);
        setTotalMonth(totalMonthRevenue.toLocaleString("vi-VN"));

        // Dữ liệu biểu đồ
        const data = formatRevenueData(response);
        setChartData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchUsers();
    fetchOrders();
  }, []);

  return (
    <div className={cx("dashboard")}>
      <div className={cx("welcome")}>
        <div className={cx("welcome-text")}>
          <div className={cx("title-welcome")}>Chào bạn!,</div>
          <div className={cx("text")}>
            Đây là những gì đang xảy ra với cửa hàng của bạn ngày hôm nay.
          </div>
        </div>
        {/* 
        <div className={cx("filter-calender")}>
          <div className={cx("calendar")}>
            <div className={cx("icon")}>
              <CalendarTodayOutlinedIcon fontSize="inherit" />
            </div>
            <input
              type="text"
              className={cx("form-control")}
              placeholder="Select"
              defaultValue="01/03/1992 - 02/03/2002"
            />

            <div className={cx("select-cal")}></div>
          </div>

          <div className={cx("btn-replay")}>
            <div className={cx("icon")}>
              <ReplayOutlinedIcon />
            </div>
          </div>
        </div> */}
      </div>

      <div className={cx("sales-cards")}>
        <div className={cx("total-sale")}>
          <div className={cx("card")}>
            <h6>Doanh Thu Tháng Này</h6>
            <h3>
              <span className={cx("counters")} data-count="95000.45">
                {totalMonth}
              </span>
              VNĐ
            </h3>
          </div>
          <img src={iconSale} alt="" />
        </div>
        <div className={cx("total-oder")}>
          <div className={cx("card")}>
            <h3 className={cx("counters")}>{listOrder.length}</h3>
            <div className={cx("title-card")}>Tổng hóa đơn</div>
          </div>
          <img src={iconOder} alt="" />
        </div>
        <div className={cx("total-oder", "pg-green")}>
          <div className={cx("card")}>
            <h3 className={cx("counters")}>{listUser.length}</h3>
            <p>Tổng khách hàng</p>
          </div>
          <img src={iconUser} alt="" />
        </div>
      </div>

      <div className={cx("content")}>
        <div className={cx("recharts")}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
              width: "100%", // quan trọng để container mở rộng
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{
                color: "#333",
                fontWeight: "700",
                fontSize: "18px",
                letterSpacing: "1px",
                paddingBottom: "15px",
                borderBottom: "solid 1px #ddd",
              }}
            >
              Doanh thu năm
            </Typography>

            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => {
                      if (value >= 1_000_000)
                        return `${(value / 1_000_000).toFixed(1)}tr`;
                      if (value >= 1_000)
                        return `${(value / 1_000).toFixed(0)}k`;
                      return value;
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString("vi-VN")}₫`,
                      "Doanh thu",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="Sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Box>
        </div>

        <div className={cx("best-seller")}>
          <div className={cx("card-header")}>
            <div className={cx("card-title")}>Sản phẩm gần đây</div>
            <div className={cx("view-all-link")}>
              <a href="/adminbb/product-list" className={cx("view-all")}>
                View All
              </a>
              <ArrowForwardIcon className={cx("icon")} fontSize="inherit" />
            </div>
          </div>
          <div className={cx("card-body")}>
            <div className={cx("table-responsive")}>
              <table className={cx("table")}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {listProduct.map((product, index) => (
                    <tr key={product._id}>
                      <td>{index + 1}</td>
                      <td className={cx("productimgname")}>
                        <a
                          href="/adminbb/product-list"
                          className={cx("product-img")}
                        >
                          <img
                            src={
                              Array.isArray(product.thumbnail)
                                ? product.thumbnail[0]
                                : product.thumbnail
                            }
                            alt="product"
                          />
                        </a>
                        <a
                          href="/adminbb/product-list"
                          className={cx("product-title")}
                        >
                          {product.title}
                        </a>
                      </td>
                      <td>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

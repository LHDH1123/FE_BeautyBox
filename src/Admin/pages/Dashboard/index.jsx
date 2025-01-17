import React from "react";
import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import iconOder from "../../../assets/images/file-text-icon-01.svg";
import iconSale from "../../../assets/images/weekly-earning.svg";
import iconUser from "../../../assets/images/user-svgrepo-com.svg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import imgProduct from "../../../assets/images/product.webp";
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
const data = [
  { name: "Jan", Sales: 300 },
  { name: "Feb", Sales: 200 },
  { name: "Mar", Sales: 400 },
  { name: "Apr", Sales: 300 },
  { name: "May", Sales: 200 },
  { name: "Jun", Sales: 100 },
  { name: "Jul", Sales: 350 },
  { name: "Aug", Sales: 400 },
  { name: "Sep", Sales: 300 },
  { name: "Oct", Sales: 200 },
  { name: "Nov", Sales: 100 },
  { name: "Dec", Sales: 350 },
];
const cx = classNames.bind(styles);

const Dashboard = () => {

  return (
    <div className={cx("dashboard")}>
      <div className={cx("welcome")}>
        <div className={cx("welcome-text")}>
          <div className={cx("title-welcome")}>Chào bạn!,</div>
          <div className={cx("text")}>
            Đây là những gì đang xảy ra với cửa hàng của bạn ngày hôm nay.
          </div>
        </div>

        <div className={cx("filter-calender")}>
          <div className={cx("calendar")}>
            <div className={cx("icon")}>
              <CalendarTodayOutlinedIcon fontSize="inherit" />
            </div>
            <input
              type="text"
              className={cx("form-control")}
              placeholder="Select"
              value="01/03/1992 - 02/03/2002"
            />
            <div className={cx("select-cal")}>
              
            </div>
          </div>

          <div className={cx("btn-replay")}>
            <div className={cx("icon")}>
              <ReplayOutlinedIcon />
            </div>
          </div>
        </div>
      </div>

      <div className={cx("sales-cards")}>
        <div className={cx("total-sale")}>
          <div className={cx("card")}>
            <h6>Doanh Thu</h6>
            <h3>
              <span className={cx("counters")} data-count="95000.45">
                95000.45
              </span>
              VNĐ
            </h3>
          </div>
          <img src={iconSale} alt="" />
        </div>
        <div className={cx("total-oder")}>
          <div className={cx("card")}>
            <h3 className={cx("counters")}>10,000</h3>
            <div className={cx("title-card")}>Tổng hóa đơn</div>
          </div>
          <img src={iconOder} alt="" />
        </div>
        <div className={cx("total-oder", "pg-green")}>
          <div className={cx("card")}>
            <h3 className={cx("counters")}>800</h3>
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
              // boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{
                color: "#333", // Thay đổi màu chữ
                fontWeight: "700", // Đặt font-weight
                fontSize: "18px", // Thay đổi kích thước font
                letterSpacing: "1px", // Thêm khoảng cách giữa các ký tự
                paddingBottom: "15px",
                borderBottom: "solid 1px #ddd",
              }}
            >
              Purchase & Sales
            </Typography>
            <BarChart
              width={700}
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sales" fill="#82ca9d" />
            </BarChart>
          </Box>
        </div>

        <div className={cx("best-seller")}>
          <div className={cx("card-header")}>
            <div className={cx("card-title")}>Recent Products</div>
            <div className={cx("view-all-link")}>
              <a href="/" className={cx("view-all")}>
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
                    <th>Products</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td className={cx("productimgname")}>
                      <a href="product-list.html" className={cx("product-img")}>
                        <img src={imgProduct} alt="product" />
                      </a>
                      <a href="product-list.html">Lenevo 3rd Generation</a>
                    </td>
                    <td>12500VNĐ</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td className={cx("productimgname")}>
                      <a href="product-list.html" className={cx("product-img")}>
                        <img src={imgProduct} alt="product" />
                      </a>
                      <a href="product-list.html">Bold V3.2</a>
                    </td>
                    <td>1600VNĐ</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td className={cx("productimgname")}>
                      <a href="product-list.html" className={cx("product-img")}>
                        <img src={imgProduct} alt="product" />
                      </a>
                      <a href="product-list.html">Nike Jordan</a>
                    </td>
                    <td>2000VNĐ</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td className={cx("productimgname")}>
                      <a href="product-list.html" className={cx("product-img")}>
                        <img src={imgProduct} alt="product" />
                      </a>
                      <a href="product-list.html">Apple Series 5 Watch</a>
                    </td>
                    <td>800VNĐ</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td className={cx("productimgname")}>
                      <a href="product-list.html" className={cx("product-img")}>
                        <img src={imgProduct} alt="product" />
                      </a>
                      <a href="product-list.html">Apple Series 5 Watch</a>
                    </td>
                    <td>800VNĐ</td>
                  </tr>
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

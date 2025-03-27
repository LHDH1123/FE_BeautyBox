import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { OrderSuccess } from "../../../services/checkout.service";

const OrderSummary = () => {
  const location = useLocation();
  const { orderId, sale } = location.state; // Nhận orderId từ location.state
  const [order, setOrder] = useState(null);
  console.log(sale);
  console.log(orderId);

  useEffect(() => {
    const fetchOrderSuccess = async () => {
      try {
        const response = await OrderSuccess(orderId.orderId);
        if (response) {
          setOrder(response.order);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn hàng:", error);
      }
    };

    fetchOrderSuccess();
  }, [orderId]);

  if (!order) {
    return <Typography align="center">Đang tải đơn hàng...</Typography>;
  }

  return (
    <div>
      <h1 style={{ maxWidth: 1050, margin: "auto" }}>
        Order#
        <span>{order._id}</span>
      </h1>
      <Card
        sx={{
          maxWidth: 1050,
          margin: "auto",
          mt: 0,
          p: 0,
          border: "1px solid rgb(217, 217, 217)",
          marginTop: "20px",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Đơn hàng
          </Typography>
          <List>
            {order.products.map((item, index) => (
              <div key={index}>
                <ListItem sx={{ px: 3 }} style={{ padding: "10px 0px" }}>
                  <Avatar
                    src={item.productInfo.thumbnail[0]}
                    alt={item.productInfo.title}
                    sx={{ width: 50, height: 50, marginRight: 2 }}
                  />
                  <ListItemText
                    primary={
                      <span
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {item.productInfo.title}
                      </span>
                    }
                    secondary={
                      <span style={{ color: "black" }}>x{item.quantity}</span>
                    }
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {parseInt(item.priceNew).toLocaleString()}đ
                  </Typography>
                </ListItem>
                {index < order.products.length - 1 && <Divider />}
              </div>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" my={1} px={0}>
            <Typography>Tạm tính</Typography>
            <Typography>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" my={1} px={0}>
            <Typography>Giảm giá</Typography>
            <Typography color="#0992d0">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total * sale)}
            </Typography>
          </Box>
          {/* <Box display="flex" flexWrap="wrap" gap={1} mt={2} px={3}>
            <Chip label="sticker vegan" variant="outlined" />
            <Chip label="AWO CLIO - Đồng giá 279k" variant="outlined" />
            <Chip label="AWO CLIO - Đồng giá 179k" variant="outlined" />
            <Chip label="FREESHIP 15k cho mọi đơn" variant="outlined" />
          </Box> */}
          <Box display="flex" justifyContent="space-between" my={1} px={0}>
            <Typography>Shipping</Typography>
            <Typography>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(12000)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="space-between"
            my={1}
            fontWeight="bold"
            px={0}
          >
            <Typography>Tổng</Typography>
            <Typography>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                fontWeight: "bold",
                currency: "VND",
              }).format(order.total + order.total * sale + 12000)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;

import React from "react";
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

const OrderSummary = () => {
  const orderItems = [
    {
      name: "Mascara Chống Trôi Clio Kill Lash Superproof Mascara 7G",
      price: 339000,
      sku: "17990022",
      quantity: 1,
      image: "https://via.placeholder.com/50",
    },
    {
      name: "Son Kem Peripera Mịn Lì Over Blur Tint 3.5g",
      price: 249000,
      sku: "25260012",
      quantity: 1,
      image: "https://via.placeholder.com/50",
    },
    {
      name: "Nước Cân Bằng Cocoon Hoa Sen Hau Giang Lotus Soothing Toner",
      price: 195000,
      sku: "11111239",
      quantity: 1,
      image: "https://via.placeholder.com/50",
    },
  ];

  const discount = 130000;
  const shipping = 12000;
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal - discount + shipping;

  return (
    <div>
      <h1 style={{ maxWidth: 1050, margin: "auto" }}>
        Order# <span>32LAGJ23</span>
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
            {orderItems.map((item, index) => (
              <div key={index}>
                <ListItem sx={{ px: 3 }} style={{ padding: "10px 0px" }}>
                  <Avatar
                    src={item.image}
                    alt={item.name}
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
                        {item.name}
                      </span>
                    }
                    secondary={
                      <span style={{ color: "black" }}>
                        <span>SKU:</span> {item.sku} &nbsp; x{item.quantity}
                      </span>
                    }
                  />
                  <Typography variant="body1" fontWeight="bold">
                    {item.price.toLocaleString()}đ
                  </Typography>
                </ListItem>
                {index < orderItems.length - 1 && <Divider />}
              </div>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" my={1} px={0}>
            <Typography>Tạm tính</Typography>
            <Typography>{subtotal.toLocaleString()}đ</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" my={1} px={0}>
            <Typography>Giảm giá</Typography>
            <Typography color="#0992d0">
              -{discount.toLocaleString()}đ
            </Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1} mt={2} px={3}>
            <Chip label="sticker vegan" variant="outlined" />
            <Chip label="AWO CLIO - Đồng giá 279k" variant="outlined" />
            <Chip label="AWO CLIO - Đồng giá 179k" variant="outlined" />
            <Chip label="FREESHIP 15k cho mọi đơn" variant="outlined" />
          </Box>
          <Box display="flex" justifyContent="space-between" my={1} px={0}>
            <Typography>Shipping</Typography>
            <Typography>{shipping.toLocaleString()}đ</Typography>
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
            <Typography>{total.toLocaleString()}đ</Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;

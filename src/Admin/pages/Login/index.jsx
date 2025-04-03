import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Grid, Paper, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginPost } from "../../../services/auth.service";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [token, setToken] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginPost(formData); // Gọi API để đăng nhập

      if (response) {
        console.log(response.token);
        setToken(response.token);

        // Sử dụng navigate từ React Router để chuyển hướng
        navigate("/adminbb"); // Chuyển đến trang admin sau khi đăng nhập thành công
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // if (token) {
    //   navigate("/adminbb"); // Nếu có token, chuyển đến trang admin
    // }
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: "100vh" }}>
        {/* Left Side - Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
        >
          <img
            src="https://image.hsv-tech.io/300x0/bbx/common/50a26167-9341-4be8-8aba-9682d3b4a916.webp"
            alt="Logo"
            width={200}
          />
          <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: "bold" }}>
            We are the Beauty Box
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 3, width: "100%", maxWidth: 360 }}
            onSubmit={handleLogin}
          >
            <TextField
              fullWidth
              label="UserName"
              name="email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
                mb: 2,
                background:
                  "linear-gradient(90deg, #ffd400, #c73130 50.52%, #663695 99.61%)",
              }}
            >
              LOG IN
            </Button>
          </Box>
        </Grid>

        {/* Right Side - Information Panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(90deg, #ffd400, #c73130 50.52%, #663695 99.61%)",
            color: "white",
            textAlign: "center",
            padding: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              We are more than just a company
            </Typography>
            <Typography sx={{ mt: 2 }}>
              We are committed to delivering true value, continuously innovating
              and growing to create better things.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;

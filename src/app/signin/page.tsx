"use client";

import { Box, Button, Typography, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import SnackbarComponent from "../Components/common/Snackbar";
import { Utility } from "@/utils";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const { snackbarAndNavigate } = Utility();
  const dispatch = useDispatch();



  // Define the snackbar close handler
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleEmailPasswordLogin = async (e: any) => {
    e.preventDefault(); // Correct usage of preventDefault
    console.log("signin")

    const response = await fetch("http://localhost:4006/api/v1/patient-service/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log("response", response)

    if (data.statusCode === 200) {
      snackbarAndNavigate(dispatch, true, "success", "Login Successful");
      // Store token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("NAME", "MONIS");  // Assuming the token is in data.token
      console.log(">>>>> data", data)

      console.log('redirect to home')
      window.location.href = '/'; // Redirect to '/'
    } else {
      console.error("Login failed", data);
      // Handle error, maybe show a message to the user
    }
  };



  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#5B99C2"
        padding="15px"
      >
        <Box
          display="flex"
          flexDirection="column"
          bgcolor="#ffffff"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
          borderRadius="30px"
          overflow="hidden"
          maxWidth="1200px"
          width="100%"
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            flex="1"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flex="1"
              bgcolor="#f4f5fa"
            >
              <Box
                component="img"
                src="https://img.freepik.com/premium-photo/online-doctor-concept-vector-cartoon-illustration-telemedicine-services_1240525-32132.jpg?w=740"
                alt="Login illustration"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              flex="1"
              padding={{ xs: "20px", md: "40px" }}
              bgcolor="#ffffff"
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
                maxWidth="400px"
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{ color: "#1976d2", textAlign: "center" }}
                >
                  Welcome to Arogya!
                </Typography>

                <Typography variant="body1" gutterBottom textAlign="center">
                  Please sign in to your account.
                </Typography>

                {/* Email and Password Login Form */}
                <Box component="form" width="100%" noValidate onSubmit={handleEmailPasswordLogin}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    style={{ backgroundColor: "#1976d2", color: "#fff", marginTop: "20px" }}
                  >
                    Sign in
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </>

  );

}

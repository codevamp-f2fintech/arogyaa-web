"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SnackbarComponent from "../Components/common/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Utility } from "@/utils";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const { snackbarAndNavigate } = Utility();
  const dispatch: AppDispatch = useDispatch();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    // Username validation
    if (!formData.username) {
      newErrors.username = "Full name is required.";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
      isValid = false;
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }

    // Password validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters long, contain at least one number, one special character, one uppercase, and one lowercase letter.";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      snackbarAndNavigate(dispatch, true, "error", "Please fix the errors.");
      return;
    }

    const { confirmPassword, ...data } = formData;

    try {
      const response = await axios.post(
        "http://localhost:4006/api/v1/patient-service/create-patient",
        data
      );
      console.log("Response >>>>", response);

      if (response.status === 201) {
        snackbarAndNavigate(
          dispatch,
          true,
          "success",
          "Patient created successfully"
        );
      } else {
        snackbarAndNavigate(
          dispatch,
          true,
          "warning",
          response.data?.message || "Unexpected warning."
        );
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 409) {
        snackbarAndNavigate(dispatch, true, "error", "Email already exists.");
      } else if (status === 500) {
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          "Internal server error. Please try again."
        );
      } else {
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          message || "Signup failed. Please try again."
        );
      }
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev); // Function to toggle visibility
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "#449AC8",
        color: "white",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
        }}
      >
        <img
          src="https://img.freepik.com/free-vector/medical-health-insurance-with-doctor-patient_107791-11142.jpg?w=900&t=st=1723524662~exp=1723525262~hmac=b248f85be5e4bc60130e807c6b5b9e17d852b5716ec65d985f5905a93a8170a4"
          alt="doctor"
          width={700}
          height={430}
          style={{
            borderRadius: 8,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Box>

      <Box
        sx={{
          width: "38%",
          p: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#449AC8",
          }}
        >
          Welcome To Arogyaa
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            color: "gray",
          }}
        >
          Please Sign-Up To Your Account For Consult With Our Doctors
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="10px"
            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          >
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              name="username"
              label="Full Name"
              variant="outlined"
              onChange={handleChange}
              value={formData.username}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              name="email"
              label="Email Address"
              variant="outlined"
              onChange={handleChange}
              value={formData.email}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              name="phone"
              label="Phone Number"
              variant="outlined"
              onChange={handleChange}
              value={formData.phone}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              error={!!errors.gender}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
                sx={{
                  textAlign: "left", // Align the select box label and selected value to the left
                }}
              >
                <MenuItem value="male" sx={{ textAlign: "left" }}>
                  Male
                </MenuItem>
                <MenuItem value="female" sx={{ textAlign: "left" }}>
                  Female
                </MenuItem>
                <MenuItem value="other" sx={{ textAlign: "left" }}>
                  Other
                </MenuItem>
              </Select>
              {errors.gender && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ textAlign: "left" }}
                >
                  {errors.gender}
                </Typography>
              )}
            </FormControl>

            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              name="password"
              type={showConfirmPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              onChange={handleChange}
              value={formData.password}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              variant="outlined"
              onChange={handleChange}
              value={formData.confirmPassword}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              type="submit"
              sx={{
                gridColumn: "span 2",
                m: "10px auto",
                backgroundColor: "#449AC8",
                "&:hover": {
                  backgroundColor: "#357A9E",
                },
              }}
              variant="contained"
              fullWidth
            >
              Sign Up
            </Button>
          </Box>
        </form>
      </Box>
      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
};

export default Signup;

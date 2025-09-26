"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
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
import PersonIcon from "@mui/icons-material/Person";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WcIcon from "@mui/icons-material/Wc";
import LockIcon from "@mui/icons-material/Lock";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import SnackbarComponent from "../components/common/Snackbar";
import { AppDispatch, RootState } from "@/redux/store";
import { creator } from "@/apis/apiClient";
import { useCreatePatient } from "@/hooks/patient";
import { Utility } from "@/utils";
import { backIn, color } from "framer-motion";

interface SignupResponse {
  token: string;
  message: string;
  statusCode: number;
}

const inputStyles = {
  fontFamily: "Poppins",
  backgroundColor: "white",
  "& .MuiInputBase-root": {
    fontFamily: "Poppins",
    backgroundColor: "white",
  },
  "& .MuiInputLabel-root": {
    color: "#7A4D9C",
    fontFamily: "Poppins",
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins",
    color: "#000",
    "& fieldset": {
      borderColor: "#7A4D9C",
    },
    "&:hover fieldset": {
      borderColor: "#7A4D9C",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7A4D9C",
    },
  },
  input: {
    fontFamily: "Poppins",
    color: "#000", // Ensure text is black while typing
  },
};

const menuItemStyles = {
  fontFamily: "Poppins",
  color: "#000", // Ensure text is black while typing
};

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    email: "",
    contact: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    age: "",
    email: "",
    contact: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { snackbarAndNavigate } = Utility();
  const { createPatient } = useCreatePatient("/create-patient");
  const rawRedirect = searchParams.get("redirect");
  const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

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

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required.";
      isValid = false;
    } else if (!/^\d+$/.test(formData.age)) {
      newErrors.age = "Age must be a valid number.";
      isValid = false;
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      newErrors.age = "Age must be between 18 and 100.";
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

    // contact validation
    if (!formData.contact) {
      newErrors.contact = "Contact is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be 10 digits long.";
      isValid = false;
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }

    // Password validation
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain at least one number, one special character, one uppercase, and one lowercase letter.";
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
    const isValid = validateForm();
    if (!isValid) return;
    const { confirmPassword, ...data } = formData;

    try {
      const createPatientResponse = await createPatient(data);

      if (createPatientResponse?.statusCode === 201) {
        const response: SignupResponse = await creator("patient", "/login", {
          email: createPatientResponse?.data?.email,
          password: data?.password,
        });
        if (response?.statusCode === 200) {
          document.cookie = `token=${response.token}; path=/; max-age=${
            1 * 24 * 60 * 60
          }; secure; samesite=strict`;
          snackbarAndNavigate(
            dispatch,
            true,
            "success",
            "Patient created successfully",
            () => router.push(decodedRedirect || "/doctors")
          );
        }
      } else {
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          createPatientResponse?.message ||
            "Error Creating Patient. Please Try Again",
          null,
          true
        );
      }
    } catch (error: any) {
      console.log(error, "this is errp");
      const status = error.response?.status;
      const message = error.response?.message || error.message;
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
          message || "Signup failed. Please try again.",
          null,
          true
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
        fontFamily: "Poppins",
        marginTop: { xs: "10px", sm: "20px", md: "30px" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "space-evenly",
        background:
          "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
        color: "white",
        padding: { xs: "10px", sm: "15px", md: "20px" },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          maxWidth: { md: "50%", lg: "45%" },
        }}
      >
        <img
          src="signup.png"
          alt="doctor"
          style={{
            borderRadius: 8,
            maxWidth: "100%",
            height: "auto",
            maxHeight: "485px",
          }}
        />
      </Box>

      <Box
        sx={{
          fontFamily: "Poppins",
          width: {
            xs: "100%",
            sm: "90%",
            md: "45%",
            lg: "38%",
          },
          maxWidth: "600px",
          p: { xs: 2, sm: 3 },
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          margin: { xs: "10px 0", md: "0" },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#7A4D9C",
            marginBottom: 2,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
          }}
        >
          Please Fill In Patient Details{" "}
          {decodedRedirect ? "To Book Appointment" : ""}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="16px"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            }}
          >
            <TextField
              fullWidth
              name="username"
              label="Username"
              variant="outlined"
              sx={inputStyles}
              autoComplete="off"
              onChange={handleChange}
              value={formData.username}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="age"
              label="Age"
              variant="outlined"
              sx={inputStyles}
              autoComplete="off"
              onChange={handleChange}
              value={formData.age}
              error={!!errors.age}
              helperText={errors.age}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LooksOneIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              style={{ marginTop: 10, width: "100%" }}
              fullWidth
              name="email"
              label="Email"
              variant="outlined"
              sx={{
                ...inputStyles,
                gridColumn: { xs: "span 1", sm: "span 2" },
              }}
              autoComplete="off" // Turn off autofill
              onChange={handleChange}
              value={formData.email}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
                style: { overflow: "auto" },
              }}
              inputProps={{
                style: { whiteSpace: "nowrap" },
              }}
            />

            <TextField
              fullWidth
              name="password"
              type={showConfirmPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              sx={inputStyles}
              onChange={handleChange}
              value={formData.password}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
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
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              variant="outlined"
              sx={inputStyles}
              onChange={handleChange}
              value={formData.confirmPassword}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowConfirmPassword}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="contact"
              label="Contact"
              variant="outlined"
              style={{ marginTop: 10 }}
              sx={inputStyles}
              onChange={handleChange}
              value={formData.contact}
              error={!!errors.contact}
              helperText={errors.contact}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              fullWidth
              style={{ marginTop: 10 }}
              sx={inputStyles}
              error={!!errors.gender}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
                startAdornment={
                  <InputAdornment position="start">
                    <WcIcon />
                  </InputAdornment>
                }
              >
                <MenuItem sx={menuItemStyles} value="male">
                  Male
                </MenuItem>
                <MenuItem sx={menuItemStyles} value="female">
                  Female
                </MenuItem>
                <MenuItem sx={menuItemStyles} value="other">
                  Other
                </MenuItem>
              </Select>
              {errors.gender && (
                <Typography variant="body2" color="error">
                  {errors.gender}
                </Typography>
              )}
            </FormControl>

            <Button
              type="submit"
              sx={{
                m: "10px auto",
                fontFamily: "Poppins",
                background:
                  "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)",
                "&:hover": {
                  backgroundColor: "#357A9E",
                },
                width: {
                  xs: "100%",
                  sm: "100%",
                },
                gridColumn: { xs: "span 1", sm: "span 2" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                padding: { xs: "10px 16px", sm: "12px 24px" },
              }}
              variant="contained"
            >
              Sign Up
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                fontFamily: "Poppins",
                gridColumn: { xs: "1", sm: "span 2" },
                borderColor: "#1976d2",
                color: "#1976d2",
                py: 1.5,
              }}
              onClick={() => {
                const redirectParam = decodedRedirect
                  ? `?redirect=${decodedRedirect}`
                  : "";

                router.push(`/signin${redirectParam}`);
              }}
            >
              Already have an account? Sign In
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

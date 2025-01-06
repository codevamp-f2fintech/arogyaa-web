"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { Formik, Form } from "formik";

import SnackbarComponent from "../components/common/Snackbar";
import { Utility } from "@/utils";
import { RootState } from "@/redux/store";
import { useCreatePatient } from "@/hooks/patient";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("This Field Is Required"),
  password: Yup.string().min(8, "Password too short").required("This Field Is Required"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const { createPatient } = useCreatePatient("/login");
  const { snackbarAndNavigate } = Utility();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Define the snackbar close handler
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleLogin = React.useCallback(
    async (values: { email: string; password: string }): Promise<void> => {
      console.log(values, "submitted values");
      setLoading(true);
      try {
        const response = await createPatient({
          email: values.email,
          password: values.password,
        });
        console.log(response, "this is response from login");
        if (response?.statusCode === 200) {
          document.cookie = `token=${response.token}; path=/; max-age=${1 * 24 * 60 * 60
            }; secure; samesite=strict`;
          snackbarAndNavigate(
            dispatch,
            true,
            "success",
            response.message || "Login Successful",
            () => router.push("/"),
            "/"
          );
        } else if (response?.statusCode === 409) {
          snackbarAndNavigate(
            dispatch,
            true,
            "error",
            "Patient Not Found"
          );
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        } else if (response?.statusCode === 400) {
          snackbarAndNavigate(dispatch, true, "error", "Invalid Password");
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Login failed", error);
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          "Error Loggin in. Please Try Again"
        );
        setTimeout(() => {
          setLoading(false);
        }, 2200);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2200);
      }
    },
    []
  );

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
                <Typography variant="body1" gutterBottom textAlign="center">
                  Please sign in to your account.
                </Typography>

                {/* Email and Password Login Form */}
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={LoginSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    await handleLogin(values);
                    setSubmitting(false);
                  }}
                >
                  {({
                    errors,
                    touched,
                    values,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    dirty,
                  }) => (
                    <Form>
                      {/* Email Field */}
                      <TextField
                        margin="normal"
                        fullWidth
                        label="*Email Address"
                        name="email"
                        autoComplete="off"
                        autoFocus
                        value={values.email} // Bind Formik values
                        onChange={handleChange} // Bind Formik handleChange
                        onBlur={handleBlur} // Update Formik touched state
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: "black" }} />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />

                      {/* Password Field */}
                      <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={values.password} // Bind Formik values
                        onChange={handleChange} // Bind Formik handleChange
                        onBlur={handleBlur} // Update Formik touched state
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: "black" }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                sx={{ color: "black" }}
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 2,
                          mb: 2,
                          borderRadius: "8px",
                          background:
                            "linear-gradient(45deg, #2C3CE3, #1976D2)",
                          color: "#fff",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #1976D2, #6A1B9A)",
                          },
                        }}
                        disabled={!dirty || isSubmitting}
                      >
                        {isSubmitting && loading ? (
                          <CircularProgress size={22} />
                        ) : (
                          "Log In"
                        )}
                      </Button>

                      <Button
                        variant="outlined"
                        fullWidth
                        style={{
                          color: "#1976d2",
                          borderColor: "#1976d2",
                          marginTop: "10px",
                          textTransform: "none",
                        }}
                        onClick={() => (window.location.href = "/signup")}
                      >
                        Don’t have an account? Sign Up
                      </Button>
                    </Form>
                  )}
                </Formik>
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

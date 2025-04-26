"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import SnackbarComponent from "../components/common/Snackbar";
import { creator } from "@/apis/apiClient";
import { RootState } from "@/redux/store";
import { Utility } from "@/utils";

interface SignInResponse {
  token: string;
  message: string;
  statusCode: number;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("This Field Is Required"),
  password: Yup.string()
    .min(8, "Password too short")
    .required("This Field Is Required"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { snackbarAndNavigate } = Utility();
  const rawRedirect = searchParams.get("redirect");
  const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

  const handleClickShowPassword = (): void => {
    setShowPassword((prev) => !prev);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
      setLoading(true);
      try {
        const response: SignInResponse = await creator("patient", "/login", {
          email: values.email,
          password: values.password,
        });
        if (response?.statusCode === 200) {
          document.cookie = `token=${response.token}; path=/; max-age=${
            1 * 24 * 60 * 60
          }; secure; samesite=strict`;
          snackbarAndNavigate(
            dispatch,
            true,
            "success",
            response?.message || "Login Successful",
            () => router.push(decodedRedirect || "/doctors")
          );
        } else if (response?.statusCode === 409) {
          snackbarAndNavigate(dispatch, true, "error", "Patient Not Found");
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
      <Container maxWidth="xl" disableGutters>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          padding="15px"
          sx={{
            background:
              "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
            animation: "backgroundAnimation 5s infinite alternate",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            borderRadius="30px"
            overflow="hidden"
            maxWidth="100%"
            width="100%"
            sx={{
              animation: "boxAnimation 1s ease-in-out",
              padding: "30px",
            }}
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
                padding={{ xs: "20px", md: "40px" }}
              >
                <Box
                  component="img"
                  src="signin.png"
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
                color="#7A4D9C"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  maxWidth="500px"
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    textAlign="center"
                    sx={{
                      fontFamily: "Poppins",
                    }}
                  >
                    Please Sign In To Your Account.
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
                          variant="outlined"
                          autoFocus
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#7A4D9C",
                              },
                              "&:hover fieldset": {
                                borderColor: "#7A4D9C",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#7A4D9C",
                              },
                              "& input": {
                                paddingLeft: "3px",
                                color: "black !important",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#7A4D9C",
                              fontFamily: "Poppins",
                            },
                            input: {
                              fontFamily: "Poppins",
                            },

                            "& .css-1xs3t0r-MuiFormControl-root-MuiTextField-root .MuiOutlinedInput-root input":
                              {
                                color: "black !important",
                              },
                          }}
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur} // Update Formik touched state
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: "black" }} />
                              </InputAdornment>
                            ),
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
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#7A4D9C",
                              },
                              "&:hover fieldset": {
                                borderColor: "#7A4D9C",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#7A4D9C",
                              },
                              "& input": {
                                paddingLeft: "3px",
                                color:'black !important'
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#7A4D9C",
                              fontFamily: "Poppins",
                            },
                            input: {
                              fontFamily: "Poppins",
                            },
                          }}
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
                            fontFamily: "Poppins",
                            mb: 2,
                            borderRadius: "8px",
                            background:
                              "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background:
                                "linear-gradient(180deg, rgba(104,82,164,0.9) 0%, rgba(126,107,177,0.9) 100%)",
                              color: "#fff",
                            },
                            "&:active": {
                              color: "#fff",
                            },
                            "&:focus": {
                              color: "#fff",
                            },
                            "&.Mui-disabled": {
                              color: "#fff",
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
                            fontFamily: "Poppins",
                          }}
                          onClick={() => {
                            const redirectParam = decodedRedirect
                              ? `?redirect=${decodedRedirect}`
                              : "";

                            router.push(`/signup${redirectParam}`);
                          }}
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
      </Container>
      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </>
  );
}

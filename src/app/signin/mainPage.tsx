"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
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
  Divider,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from "@mui/icons-material";
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
  const { data: session } = useSession();

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
            () => router.push(decodedRedirect || "/")
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

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: rawRedirect ? decodeURIComponent(rawRedirect) : "/",
    });
  };
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  // Add this effect
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

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
                          // autoFocus
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

                        {/* Divider */}
                        <Divider sx={{ my: 2, fontFamily: "Poppins" }}>
                          or
                        </Divider>

                        {/* Google Sign-In Button */}
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                          }
                          onClick={handleGoogleSignIn}
                          sx={{
                            backgroundColor: "#fff",
                            color: "#5f6368",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            textTransform: "none",
                            border: "1px solid #dadce0",
                            borderRadius: "4px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            "&:hover": {
                              backgroundColor: "#f8f9fa",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                              border: "1px solid transparent", // Removes border on hover
                            },
                            "& .MuiButton-startIcon": {
                              marginRight: "12px",
                            },
                          }}
                        >
                          Continue with Google
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            const redirectParam = decodedRedirect
                              ? `?redirect=${decodedRedirect}`
                              : "";
                            router.push(`/signup${redirectParam}`);
                          }}
                          sx={{
                            backgroundColor: "#fff",
                            color: "#7A4D9C",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            textTransform: "none",
                            border: "1px solid #BCAEE0",
                            borderRadius: "4px",
                            padding: { xs: "8px 12px", sm: "8px 16px" }, // Slightly less horizontal padding on very small screens
                            fontSize: { xs: "13px", sm: "14px" }, // Slightly smaller font on very small screens
                            boxShadow: "0 1px 2px rgba(122, 77, 156, 0.1)",
                            marginTop: "10px",
                            "&:hover": {
                              backgroundColor: "#F3EFF9",
                              boxShadow: "0 2px 4px rgba(122, 77, 156, 0.15)",
                              border: "1px solid transparent",
                            },
                            // Ensure text doesn't wrap on small screens
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Don't have an account?{" "}
                          <span style={{ fontWeight: "600", color: "#5C2D91" }}>
                            Sign Up
                          </span>
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

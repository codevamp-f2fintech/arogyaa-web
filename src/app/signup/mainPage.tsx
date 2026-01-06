"use client";

import React, { useState, useRef, useEffect } from "react";
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
  CircularProgress,
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
import { auth, RecaptchaVerifier } from "@/utils/firebase";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: import("firebase/auth").RecaptchaVerifier;
    confirmationResult: import("firebase/auth").ConfirmationResult;
  }
}

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
    color: "#000",
  },
};

const menuItemStyles = {
  fontFamily: "Poppins",
  color: "#000",
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
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [timer, setTimer] = useState<number>(120);

  const otpRefs = useRef<HTMLInputElement[]>([]);
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { snackbarAndNavigate } = Utility();
  const { createPatient } = useCreatePatient("/create-patient");
  const rawRedirect = searchParams.get("redirect");
  const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && !otpVerified && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpVerified, timer]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Full name is required.";
      isValid = false;
    }

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

    if (!formData.email) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }

    if (!formData.contact) {
      newErrors.contact = "Contact is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be 10 digits long.";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
      isValid = false;
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const setUpRecaptcha = async (phone: string): Promise<ConfirmationResult> => {
    const oldContainer = document.getElementById("recaptcha-container");
    if (oldContainer) {
      oldContainer.remove();
      const newContainer = document.createElement("div");
      newContainer.id = "recaptcha-container";
      newContainer.style.display = "none";
      document.body.appendChild(newContainer);
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          snackbarAndNavigate(
            dispatch,
            true,
            "error",
            "reCAPTCHA expired. Please try again."
          );
        },
      }
    );

    await window.recaptchaVerifier.render();

    return await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      window.recaptchaVerifier
    );
  };

  const handleSendOtp = async () => {
    // Validate only contact field before sending OTP
    if (!formData.contact) {
      setErrors({ ...errors, contact: "Contact is required." });
      snackbarAndNavigate(dispatch, true, "error", "Please enter phone number");
      return;
    }
    if (!/^\d{10}$/.test(formData.contact)) {
      setErrors({ ...errors, contact: "Contact must be 10 digits long." });
      snackbarAndNavigate(dispatch, true, "error", "Invalid phone number");
      return;
    }

    setOtpSending(true);
    try {
      const confirmationResult = await setUpRecaptcha(formData.contact);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setTimer(120);
      snackbarAndNavigate(
        dispatch,
        true,
        "success",
        "OTP sent to " + formData.contact
      );
    } catch (err: any) {
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        err?.message || "Failed to send OTP"
      );
    } finally {
      setOtpSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit input
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setOtpVerifying(true);
    try {
      const otpString = otp.join("");
      if (otpString.length !== 6) {
        snackbarAndNavigate(
          dispatch,
          true,
          "error",
          "Please enter complete OTP"
        );
        setOtpVerifying(false);
        return;
      }

      const result = await window.confirmationResult.confirm(otpString);
      setOtpVerified(true);
      snackbarAndNavigate(
        dispatch,
        true,
        "success",
        "OTP verified successfully"
      );
    } catch (error: any) {
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Wrong OTP. Please try again."
      );
      setOtp(["", "", "", "", "", ""]);
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!otpVerified) {
      snackbarAndNavigate(dispatch, true, "error", "Please verify OTP first");
      return;
    }

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
      console.log(error, "this is error");
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
    setShowConfirmPassword((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
              autoComplete="off"
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
              disabled={otpSent}
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

            {/* OTP Section */}
            {otpSent && !otpVerified && (
              <>
                <Box
                  sx={{
                    gridColumn: { xs: "span 1", sm: "span 2" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Enter the 6-digit OTP sent to +91 {formData.contact}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1.5,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (otpRefs.current[index] = el)}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        inputProps={{
                          maxLength: 1,
                          style: {
                            textAlign: "center",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            padding: "12px 8px",
                            color: "#000",
                          },
                        }}
                        sx={{
                          width: 48,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "& fieldset": {
                              borderWidth: 2,
                              borderColor: "#7A4D9C",
                            },
                            "&:hover fieldset": {
                              borderColor: "#7A4D9C",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#7A4D9C",
                            },
                            "& .MuiInputBase-input": {
                              color: "#000", // 👈 OR ADD HERE FOR SAFETY
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Time remaining: {formatTime(timer)}
                  </Typography>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={
                      otpVerifying || otp.join("").length !== 6 || timer === 0
                    }
                    variant="contained"
                    fullWidth
                    sx={{
                      fontFamily: "Poppins",
                      background:
                        "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)",
                      "&:hover": {
                        backgroundColor: "#357A9E",
                      },
                      py: 1.5,
                    }}
                  >
                    {otpVerifying ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp(["", "", "", "", "", ""]);
                      setTimer(120);
                    }}
                    sx={{
                      color: "#7A4D9C",
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    Change Phone Number
                  </Button>
                </Box>
              </>
            )}

            {/* Send OTP Button */}
            {!otpSent && (
              <Button
                onClick={handleSendOtp}
                disabled={otpSending || !formData.contact}
                variant="outlined"
                sx={{
                  m: "10px auto",
                  fontFamily: "Poppins",
                  borderColor: "#7A4D9C",
                  color: "#7A4D9C",
                  "&:hover": {
                    borderColor: "#6B3D8C",
                    backgroundColor: "rgba(122, 77, 156, 0.04)",
                  },
                  width: {
                    xs: "100%",
                    sm: "100%",
                  },
                  gridColumn: { xs: "span 1", sm: "span 2" },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  padding: { xs: "10px 16px", sm: "12px 24px" },
                }}
              >
                {otpSending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Send OTP"
                )}
              </Button>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={!otpVerified}
              sx={{
                m: "10px auto",
                fontFamily: "Poppins",
                background: otpVerified
                  ? "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)"
                  : "grey",
                "&:hover": {
                  backgroundColor: otpVerified ? "#357A9E" : "grey",
                },
                width: {
                  xs: "100%",
                  sm: "100%",
                },
                gridColumn: { xs: "span 1", sm: "span 2" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                padding: { xs: "10px 16px", sm: "12px 24px" },
                opacity: otpVerified ? 1 : 0.6,
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

      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container" style={{ display: "none" }} />

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

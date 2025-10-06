"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { creator, fetcher } from "@/apis/apiClient";

type ResetValues = {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
};

const Schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("This Field Is Required"),
 
  newPassword: Yup.string()
    .min(8, "Password too short")
    .matches(/[a-z]/, "Include a lowercase letter")
    .matches(/[A-Z]/, "Include an uppercase letter")
    .matches(/[0-9]/, "Include a digit")
    .required("This Field Is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
    .required("This Field Is Required"),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const prefillEmail = decodeURIComponent(searchParams.get("email") || "");
  const prefillToken = searchParams.get("token") || "";

  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Generic Alert Dialog state
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState<string>("");
  const [alertSeverity, setAlertSeverity] = React.useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [alertMessage, setAlertMessage] = React.useState<React.ReactNode>("");

  const openAlert = (
    title: string,
    msg: React.ReactNode,
    severity: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setAlertTitle(title);
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleSubmit = React.useCallback(
    async (values: ResetValues): Promise<void> => {
      setLoading(true);
      try {
        const email = values.email.trim().toLowerCase();
        const token = values.token.trim();
        const newPassword = values.newPassword;

        // 1️⃣ Check if patient exists
        const existsResponse = await fetcher(
          "patient",
          `/patient/exists?email=${encodeURIComponent(email)}`
        );

        // Defensive check for nested structure
        const exists =
          existsResponse?.exists ?? existsResponse?.data?.exists ?? false;

        if (!exists) {
          // ❌ STOP everything here — DO NOT proceed
          setLoading(false);
          openAlert(
            "Email not found",
            <>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                We couldn’t find any patient account with:
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ wordBreak: "break-all", fontWeight: 600 }}
              >
                {email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please check the email address or try another one.
              </Typography>
            </>,
            "error"
          );
          return; // 🔥 this ensures we never call confirm API below
        }

        // 2️⃣ If patient exists, then and only then reset password
        const res: any = await creator(
          "patient",
          "/patient/reset-password/confirm",
          {
            email,
            token,
            newPassword,
          }
        );

        if (res?.statusCode === 200) {
          const msg = res?.message || "Password updated successfully";
          openAlert("Success", msg, "success");
        } else {
          openAlert(
            "Unable to reset password",
            res?.message || "Something went wrong",
            "error"
          );
        }
      } catch (e: any) {
        console.error("reset-password confirm error", e);
        openAlert("Error", e?.message || "Something went wrong", "error");
      } finally {
        setLoading(false);
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
            sx={{ animation: "boxAnimation 1s ease-in-out", padding: "30px" }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              flex="1"
            >
              {/* Left illustration (same as login) */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flex="1"
                padding={{ xs: "20px", md: "40px" }}
              >
                <Box
                  component="img"
                  src="/signin.png"
                  alt="Reset illustration"
                  sx={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>

              {/* Right form */}
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
                    sx={{ fontFamily: "Poppins" }}
                  >
                    Reset your password
                  </Typography>

                  <Formik<ResetValues>
                    initialValues={{
                      email: prefillEmail,
                      token: prefillToken,
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    enableReinitialize
                    validationSchema={Schema}
                    onSubmit={async (values, helpers) => {
                      await handleSubmit(values);
                      helpers.setSubmitting(false);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      isSubmitting,
                    }) => (
                      <Form>
                        {/* Email */}
                        <TextField
                          margin="normal"
                          fullWidth
                          label="*Email Address"
                          name="email"
                          autoComplete="off"
                          variant="outlined"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#7A4D9C" },
                              "&:hover fieldset": { borderColor: "#7A4D9C" },
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
                            input: { fontFamily: "Poppins" },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: "black" }} />
                              </InputAdornment>
                            ),
                          }}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && (errors.email as string)}
                        />

                        {/* New Password */}
                        <TextField
                          margin="normal"
                          fullWidth
                          name="newPassword"
                          label="*New Password"
                          type={showNew ? "text" : "password"}
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#7A4D9C" },
                              "&:hover fieldset": { borderColor: "#7A4D9C" },
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
                            input: { fontFamily: "Poppins" },
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
                                  onClick={() => setShowNew((p) => !p)}
                                  edge="end"
                                >
                                  {showNew ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={
                            touched.newPassword && Boolean(errors.newPassword)
                          }
                          helperText={
                            touched.newPassword &&
                            (errors.newPassword as string)
                          }
                        />

                        {/* Confirm Password */}
                        <TextField
                          margin="normal"
                          fullWidth
                          name="confirmPassword"
                          label="*Confirm Password"
                          type={showConfirm ? "text" : "password"}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": { borderColor: "#7A4D9C" },
                              "&:hover fieldset": { borderColor: "#7A4D9C" },
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
                            input: { fontFamily: "Poppins" },
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
                                  onClick={() => setShowConfirm((p) => !p)}
                                  edge="end"
                                >
                                  {showConfirm ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={
                            touched.confirmPassword &&
                            Boolean(errors.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword &&
                            (errors.confirmPassword as string)
                          }
                        />

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
                            "& .MuiButton-startIcon": { marginRight: "10px" },
                          }}
                          disabled={isSubmitting || loading}
                          startIcon={
                            isSubmitting || loading ? (
                              <CircularProgress size={22} />
                            ) : undefined
                          }
                        >
                          {isSubmitting || loading
                            ? "Updating..."
                            : "Update Password"}
                        </Button>

                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => router.push("/signin")}
                          sx={{
                            backgroundColor: "#fff",
                            color: "#7A4D9C",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                            textTransform: "none",
                            border: "1px solid #BCAEE0",
                            borderRadius: "4px",
                            padding: { xs: "8px 12px", sm: "8px 16px" },
                            fontSize: { xs: "13px", sm: "14px" },
                            boxShadow: "0 1px 2px rgba(122, 77, 156, 0.1)",
                            "&:hover": {
                              backgroundColor: "#F3EFF9",
                              boxShadow: "0 2px 4px rgba(122, 77, 156, 0.15)",
                              border: "1px solid transparent",
                            },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          Back to Login
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

    
      <Dialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        aria-labelledby="alert-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-title" sx={{ fontFamily: "Poppins" }}>
          {alertTitle}
        </DialogTitle>
        <DialogContent dividers sx={{ fontFamily: "Poppins" }}>
          <Alert severity={alertSeverity} sx={{ alignItems: "flex-start" }}>
            <Box>{alertMessage}</Box>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button
            onClick={() => setAlertOpen(false)}
            variant="outlined"
            sx={{ textTransform: "none", fontFamily: "Poppins" }}
          >
            Close
          </Button>
          {alertSeverity === "success" && (
            <Button
              onClick={() => {
                setAlertOpen(false);
                router.push("/signin");
              }}
              variant="contained"
              sx={{
                textTransform: "none",
                fontFamily: "Poppins",
                background:
                  "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)",
              }}
            >
              Go to Login
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

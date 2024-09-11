"use client";
import { Box, Button, Typography, Grid } from "@mui/material";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
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

              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<FacebookIcon />}
                    onClick={() => signIn("facebook")}
                    style={{ backgroundColor: "#3b5998", color: "#fff" }}
                  >
                    Sign in with Facebook
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={() => signIn("google")}
                    style={{ backgroundColor: "#db4437", color: "#fff" }}
                  >
                    Sign in with Google
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<TwitterIcon />}
                    onClick={() => signIn("twitter")}
                    style={{ backgroundColor: "#1da1f2", color: "#fff" }}
                  >
                    Sign in with Twitter
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

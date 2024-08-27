import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

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
                style={{
                  color: "#1976d2",
                  textAlign: "center",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                Sign in
              </Typography>

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

              <form style={{ width: "100%" }}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                  autoComplete="current-password"
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <FormControlLabel
                    control={<Checkbox name="rememberMe" />}
                    label="Remember Me"
                  />
                  <Link href="#" underline="none">
                    Forgot Password?
                  </Link>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "16px" }}
                >
                  SIGN IN
                </Button>
              </form>
              <Box mt={2} textAlign="center">
                <Typography variant="body2">
                  New on our platform?{" "}
                  <Link href="#" underline="none">
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Box>

            <Box
              my={3}
              display="flex"
              alignItems="center"
              width="100%"
              maxWidth="400px"
            >
              <Divider style={{ flexGrow: 1 }} />
              <Typography variant="body2" style={{ margin: "0 16px" }}>
                or
              </Typography>
              <Divider style={{ flexGrow: 1 }} />
            </Box>

            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <IconButton color="primary" aria-label="Login with Facebook">
                  <FacebookIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary" aria-label="Login with Twitter">
                  <TwitterIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary" aria-label="Login with GitHub">
                  <GitHubIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton color="primary" aria-label="Login with Google">
                  <GoogleIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

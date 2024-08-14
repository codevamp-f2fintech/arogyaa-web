import {
  Box,
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Image from "next/image";
import { url } from "inspector";

const signup = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          marginTop: "4",
          marginRight: "4",
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
            width={750}
            height={500}
            style={{}}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            maxWidth: 400,
            padding: 4,
            margin: 2,
            marginBottom: "8",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", fontSize: "h6.fontSize", padding: 4 }}
          >
            Welcome To Arogyaa
          </Typography>

          <Typography variant="h6" sx={{ fontSize: "default" }}>
            Please Sign-Up To Your Account For Consult With Our Doctors{" "}
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              id="outlined-basic"
              label="Password"
              variant="outlined"
            />
            <TextField
              style={{ marginTop: 10 }}
              fullWidth
              id="outlined-basic"
              label="Confirm-Password"
              variant="outlined"
            />
          </Box>
          <FormControlLabel
            control={<Checkbox />}
            label="remind me"
            sx={{ display: "block", textAlign: "left" }}
          />
          <Button fullWidth variant="contained">
            Sign Up
          </Button>
          <Box>
            <Button>FORGET PASSWORD ?</Button>
            <Button>CREATE AN ACCOUNT</Button>
          </Box>
          <Typography variant="subtitle1">or sign in with </Typography>
          <Box>
            <Button>
              <FacebookIcon />
            </Button>
            <Button>
              <XIcon />
            </Button>
            <Button>
              <GitHubIcon />
            </Button>
            <Button>
              <GoogleIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default signup;

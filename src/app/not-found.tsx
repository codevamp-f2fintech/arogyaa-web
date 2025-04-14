"use client";

import React from "react";
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const NotFoundPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background:
            "linear-gradient(180deg, rgba(85,65,138,1) 0%, rgba(93,73,147,1) 100%)",
          backgroundSize: "cover",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#edf7fd",
            borderRadius: "16px",
            padding: theme.spacing(4),
            boxShadow: 3,
            maxWidth: "900px",
            width: "90%",
            margin: "0 auto",
            transition: "all 0.3s ease-in-out", 
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: 8, 
            },
          }}
        >
          {/* Left Side: Illustration */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: isSmallScreen ? theme.spacing(2) : 0,
              height: isSmallScreen ? "auto" : "400px", 
              overflow: "hidden", 
            }}
          >
            <img
              src="404img.webp"
              style={{
                maxWidth: "100%",
                height: "100%", 
                objectFit: "cover", 
                borderRadius: "12px", 
              }}
            />
          </Box>

          {/* Right Side: Text and Button */}
          <Box
            sx={{
              flex: 1,
              textAlign: isSmallScreen ? "center" : "left",
              paddingLeft: isSmallScreen ? 0 : theme.spacing(4),
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                fontFamily: "Poppins",
                color: "#b497d6",
                fontSize: isSmallScreen ? "1.5rem" : "2.9rem", 
                marginBottom: theme.spacing(2),
                // textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)",
              }}
            >
              404 Page Not Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Poppins",
                marginTop: theme.spacing(2),
                color: "#555",
                fontSize: isSmallScreen ? "1rem" : "1.25rem",
                lineHeight: 1.8,
              }}
            >
              Please check the URL or go back to the homepage.
            </Typography>
            <Button
              href="/"
              variant="contained"
              sx={{
                marginTop: theme.spacing(4),
                paddingX: theme.spacing(4),
                paddingY: theme.spacing(1.5),
                borderRadius: "30px",
                backgroundColor: "#b497d6",
                fontFamily: "Poppins",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#29175e",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease-in-out", 
              }}
            >
              Go Back Home
            </Button>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default NotFoundPage;

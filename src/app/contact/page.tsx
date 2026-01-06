"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Info as InfoIcon,
  Email,
  LocationOn,
  Phone,
  ChatBubbleOutline as ChatIcon,
} from "@mui/icons-material";

// Optional: Use a logo (path to image or styled text)
const logoUrl = "/path/to/logo.png"; // Update with your logo path

const ContactUs = () => {
  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 6, padding: "20px" }}>
        <Box
          sx={{
            backgroundColor: "#29175e",
            borderRadius: "20px",
            boxShadow: 3,
            padding: "40px",
            marginTop: "15px",
            border: "3px solid #fff",
          }}
        >
          {/* Header Section */}
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "30px",
              fontSize: "36px",
              textTransform: "uppercase",
            }}
          >
            Contact Us
          </Typography>

          {/* Get in Touch Section */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChatIcon
              sx={{ marginRight: 1, fontSize: "24px", color: "#b497d6" }}
            />
            Get in Touch
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            If you have any questions, concerns, or inquiries, feel free to
            reach out to us using the contact information below.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Merchant Legal Entity Section */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} />
            Board of Directors
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#fff" }}>
            HARPREET SINGH & ABHINAV AWAL
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Registered Address Section */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocationOn sx={{ marginRight: 1, color: "#b497d6" }} />
            Registered Address
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#fff" }}>
            A-25, M-1 Arv Park, A-Block, Sector 63, Noida, Uttar Pradesh -
            201301, India
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Phone Section */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Phone sx={{ marginRight: 1, color: "#b497d6" }} />
            Telephone
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#fff" }}>
            +918810600135
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Email Section */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Email sx={{ marginRight: 1, color: "#b497d6" }} />
            Email
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",

              borderRadius: "8px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: "#fff",
                textDecoration: "none",
                marginRight: "10px",
              }}
            >
              <a href="mailto:arogyaa.f2@gmail.com" style={{ color: "#fff" }}>
                arogyaa.f2@gmail.com
              </a>{" "}
              /
              <a
                href="mailto:wecare@f2fintech.com"
                style={{ color: "#fff", marginLeft: "10px" }}
              >
                wecare@f2fintech.com
              </a>
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ContactUs;

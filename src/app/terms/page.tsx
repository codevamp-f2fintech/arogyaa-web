"use client";
import React from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Info as InfoIcon,
  KeyboardArrowRight as ArrowIcon,
  Email,
} from "@mui/icons-material";

const TermsAndConditions = () => {
  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 6, padding: "20px" }}>
        <Box
          sx={{
            backgroundColor: "#29175e",
            borderRadius: "80px",
            boxShadow: 3,
            padding: "40px",
            marginTop: "15px",
            border: "3px solid #fff",
          }}
        >
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
            Terms and Conditions
          </Typography>

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Overview
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            These Terms and Conditions govern your use of our services and
            platform. By accessing or using our services, you agree to comply
            with these terms.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Acceptance of
            Terms
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            By using our platform and services, you agree to the following terms
            and conditions. If you do not agree with these terms, you should
            immediately stop using our platform.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> User
            Responsibilities
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            As a user, you agree to use the services responsibly and comply with
            all applicable laws and regulations. You are solely responsible for
            your actions and any content you post on our platform.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Prohibited
            Activities
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            Users are prohibited from engaging in the following activities:
            <ul>
              <li>Posting harmful or unlawful content.</li>
              <li>
                Attempting to interfere with the proper functioning of the
                platform.
              </li>
              <li>
                Engaging in fraudulent activities or illegal transactions.
              </li>
            </ul>
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Limitation of
            Liability
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            Our platform is provided on an "as-is" basis. We are not liable for
            any indirect, incidental, or consequential damages arising from the
            use or inability to use our platform or services.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Termination
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            We reserve the right to terminate or suspend your access to our
            platform if you violate any of the terms and conditions outlined
            here.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Changes to
            Terms
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            We may update these terms from time to time. Any changes will be
            posted on this page, and your continued use of the platform will be
            considered acceptance of the updated terms.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Contact
            Details
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#fff" }}>
            If you have any questions or concerns about these Terms and
            Conditions, please contact us at:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 0.5,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Email sx={{ marginRight: 1, color: "#b497d6" }} />
            arogyaa.f2@gmail.com
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default TermsAndConditions;

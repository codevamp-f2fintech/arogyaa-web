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

const RefundPolicy = () => {
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
            Refund Policy
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
            This Refund Policy explains the terms under which you may request a
            refund for purchases made on our platform. By using our service, you
            agree to the terms outlined in this policy.
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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Refund
            Eligibility
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            You are eligible for a refund if:
            <ul>
              <li>
                The treatment you received was not as expected or did not meet
                the agreed-upon standard.
              </li>
              <li>
                The doctor or healthcare professional did not provide the
                service as described during your consultation.
              </li>
              <li>
                You did not receive the treatment or care as scheduled or agreed
                upon.
              </li>
              <li>
                The consultation or service did not align with the details
                provided to you at the time of booking.
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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Refund
            Process
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1, color: "#fff" }}
          >
            To request a refund, please contact our support team with the
            following details:Order ID,Reason for refund,Date of purchase
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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Refund
            Timeline
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            Refunds will be processed within 5-7 business days after the request
            is approved. The refund will be issued to the original payment
            method.
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
            <InfoIcon sx={{ marginRight: 1, color: "#b497d6" }} /> Important
            Information
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            - Refund requests must be made within 30 days of the service or
            treatment date.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.8, color: "#fff" }}
          >
            - Any refund request after 30 days will not be considered, unless
            there is a valid reason for the delay.
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
            If you have any questions or concerns about this Refund Policy or
            need to request a refund, please contact our support team:
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

export default RefundPolicy;

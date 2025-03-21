import React from "react";
import { Container, Typography, Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import { Info as InfoIcon, Person as PersonIcon, Security as SecurityIcon, Share as ShareIcon, Email as EmailIcon, Phone as PhoneIcon } from "@mui/icons-material";

const PrivacyPolicy = () => {
  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 6, padding: "20px" }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "80px",
            boxShadow: 3,
            padding: "40px",
            marginTop: "15px",
            border: "3px solid #20ADA0",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "20px",
            }}
          >
            Privacy Policy
          </Typography>

          {/* Overview Section */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon sx={{ marginRight: 1 }} /> Overview
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "#34495E" }}>
            We prioritize your privacy and are committed to safeguarding the personal information you provide. This Privacy Policy outlines how we collect, use, and protect your information when you use our doctor-patient portal. By accessing and using our service, you consent to the terms of this Privacy Policy.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Types of Data Collected */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PersonIcon sx={{ marginRight: 1 }} /> Types of Data Collected
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "#34495E" }}>
            We collect two types of information from our users:
            <ul>
              <li><strong>Personal Data:</strong> This includes your name, email address, phone number, date of birth, medical history.</li>
              <li><strong>Usage Data:</strong> Information automatically collected when you interact with our platform, such as device information, IP address, browser type, and pages visited.</li>
            </ul>
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Use of Personal Data */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SecurityIcon sx={{ marginRight: 1 }} /> Use of Your Personal Data
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "#34495E" }}>
            We use your data to provide and improve our services, manage your account, and communicate with you. This includes using your data to facilitate consultations, maintain medical records, and send reminders or updates. We may also employ cookies and tracking technologies to enhance your experience.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Sharing Your Information */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ShareIcon sx={{ marginRight: 1 }} /> Sharing Your Information
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "#34495E" }}>
            We may share your information with third parties, including:
            <ul>
              <li><strong>Healthcare providers:</strong> We share relevant medical data with the doctors and healthcare professionals involved in your care.</li>
              <li><strong>Service providers:</strong> Third-party vendors who assist in the operation of our platform (e.g., email services).</li>
              <li><strong>Legal compliance:</strong> We may disclose your information if required by law or to protect the rights and safety of others.</li>
            </ul>
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Changes to Privacy Policy */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon sx={{ marginRight: 1 }} /> Changes to this Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "#34495E" }}>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website. We encourage you to review this policy periodically to stay informed about how we protect your information.
          </Typography>

          <Divider sx={{ margin: "30px 0", borderColor: "#ddd" }} />

          {/* Contact Us */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#20ADA0",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <EmailIcon sx={{ marginRight: 1 }} /> Contact Us
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "#34495E" }}>
            If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us at:
          </Typography>

          {/* Email Contact */}
          <Typography
            variant="body1"
            sx={{
              lineHeight: 0.5,
              color: "#34495E",
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
           
            arogyaa.f2@gmail.com
          </Typography>

        
        </Box>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;

"use client";

import { useState } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled, keyframes, alpha } from "@mui/material/styles";

const moveImageVertical = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(20px); // Move 20px down
  }
  100% {
    transform: translateY(0); // Return to original position
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledBanner = styled(Box)(({ theme }) => ({
  minHeight: "50vh", // Reduced height
  position: "relative",
  padding: theme.spacing(6, 2),
  background: `linear-gradient(60deg, rgba(86,159,157,1) 29%, rgba(60,137,133,1) 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: `0 10px 40px ${alpha("#20ADA0", 0.1)}`,
  animation: `${fadeIn} 0.6s ease-out`,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(8, 4),
  },
}));

const StyledImage = styled("img")(({ theme }) => ({
  position: "absolute",
  bottom: -10,
  left: 0,
  height: "100%",
  objectFit: "contain",
  opacity: 0.95,
  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
  animation: `${moveImageVertical} 5s ease-in-out infinite`,
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const FAQWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
}));

const FAQPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {/* Banner Section */}
      <StyledBanner>
        <StyledImage
          alt="Doctor"
          src="/assets/images/doctor-with-his-arms-crossed-white-background.png"
        />
        <Grid
          container
          spacing={4}
          sx={{
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}></Grid>
          {/* FAQ Section */}
          <FAQWrapper id="faq"
            sx={{
              marginRight: "94px", // Add margin on the right
              borderRadius: "12px", // Apply a rounded border radius
              width: "600px",
              backgroundColor: "#E5F9F5", // Light background with the color combination
              padding: "16px", // Add some padding for better spacing
            }}
          >
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 3,
                fontWeight: 700,
                color: "#20ADA0", // Color for the heading
              }}
            >
              FAQ
            </Typography>

            {/* Accordion 1 */}
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
              sx={{
                backgroundColor: "#ffffff", // Accordion background
                border: "1px solid #20ADA0", // Border with color combination
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Add shadow to accordion
                "&:hover": {
                  backgroundColor: "#F2F9F8", // Change background color on hover
                  transform: "translateY(-5px)", // Move accordion up on hover
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: "#F2F9F8", // Accordion header background
                  color: "#20ADA0", // Text color in the header
                  fontWeight: "bold", // Make the text bold
                  "&:hover": {
                    color: "#ffffff", // Change text color on hover
                    backgroundColor: "#20ADA0", // Change header background color on hover
                  },
                }}
              >
                <Typography variant="h6">
                  Are your online doctors qualified?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We follow a strict verification process for every doctor
                  providing online medical services on Practo. Our team manually
                  verifies necessary documents, registrations, and
                  certifications for every doctor.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 2 */}
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              sx={{
                backgroundColor: "#ffffff", // Accordion background
                border: "1px solid #20ADA0", // Border with color combination
                "&:hover": {
                  backgroundColor: "#F2F9F8", // Change background color on hover
                  transform: "translateY(-5px)", // Move accordion up on hover
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  backgroundColor: "#F2F9F8", // Accordion header background
                  color: "#20ADA0", // Text color in the header
                  fontWeight: "bold", // Make the text bold
                  "&:hover": {
                    color: "#ffffff", // Change text color on hover
                    backgroundColor: "#20ADA0", // Change header background color on hover
                  },
                }}
              >
                <Typography variant="h6">
                  How can I schedule an appointment?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  You can schedule an appointment through our online portal or
                  by calling our office.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 3 */}
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
              sx={{
                backgroundColor: "#ffffff", // Accordion background
                border: "1px solid #20ADA0", // Border with color combination
                "&:hover": {
                  backgroundColor: "#F2F9F8", // Change background color on hover
                  transform: "translateY(-5px)", // Move accordion up on hover
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3-content"
                id="panel3-header"
                sx={{
                  backgroundColor: "#F2F9F8", // Accordion header background
                  color: "#20ADA0", // Text color in the header
                  fontWeight: "bold", // Make the text bold
                  "&:hover": {
                    color: "#ffffff", // Change text color on hover
                    backgroundColor: "#20ADA0", // Change header background color on hover
                  },
                }}
              >
                <Typography variant="h6">
                  What insurance do you accept?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  We accept a variety of insurance providers. Please contact us
                  for more information.
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 4 */}
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
              sx={{
                backgroundColor: "#ffffff", // Accordion background
                border: "1px solid #20ADA0", // Border with color combination
                "&:hover": {
                  backgroundColor: "#F2F9F8", // Change background color on hover
                  transform: "translateY(-5px)", // Move accordion up on hover
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4-content"
                id="panel4-header"
                sx={{
                  backgroundColor: "#F2F9F8", // Accordion header background
                  color: "#20ADA0", // Text color in the header
                  fontWeight: "bold", // Make the text bold
                  "&:hover": {
                    color: "#ffffff", // Change text color on hover
                    backgroundColor: "#20ADA0", // Change header background color on hover
                  },
                }}
              >
                <Typography variant="h6">
                  For how long is the consultation valid?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  In the case of a paid consult, you can follow-up with your
                  doctor for up to 3 days. In case you opt for a free consult,
                  follow-up questions are valid for one day only. Do you have a
                  refund policy? We have a “take-it-easy” policy. If for any
                  reason you’re not convinced with your online consultation, you
                  can write to us at contact@1mgdoctors.com and we will review
                  the consult with the doctor - seeking clarifications on your
                  queries that were answered. 100% refund will be given in
                  genuine cases.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </FAQWrapper>
        </Grid>
      </StyledBanner>
    </Box>
  );
};

export default FAQPage;

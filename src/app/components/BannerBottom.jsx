"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container,
} from "@mui/material";

const faqs = [
  {
    question: "Are your online doctors qualified?",
    answer:
      "We follow a strict verification process for every doctor providing online medical services on Practo. Our team manually verifies necessary documents, registrations, and certifications for every doctor.",
  },
  {
    question: "How can I schedule an appointment?",
    answer:
      "You can schedule an appointment through our online portal or by calling our office.",
  },
  {
    question: "What insurance do you accept?",
    answer:
      "We accept a variety of insurance providers. Please contact us for more information.",
  },
  {
    question: "For how long is the consultation valid?",
    answer:
      'In the case of a paid consult, you can follow-up with your doctor for up to 3 days. In case you opt for a free consult, follow-up questions are valid for one day only. Do you have a refund policy? We have a "take-it-easy" policy. If for any reason you\'re not convinced with your online consultation, you can write to us at contact wecare@f2fintech.com and we will review the consult with the doctor - seeking clarifications on your queries that were answered. 100% refund will be given in genuine cases.',
  },
];

export default function FAQpage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Box
      sx={{
        background: "rgb(175,159,219)",
        background:
          "linear-gradient(180deg, rgba(175,159,219,1) 0%, rgba(190,176,225,1) 100%)",
        color: "#29175e",
        // minHeight: "100vh",
        minHeight: { xs: "fit-content", md: "fit-content", lg: "100vh" }, // Changed here
        height: "auto",
        width: "100%",
        padding: { xs: "20px", md: "40px 60px" },
        overflow: "hidden",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
          sm: "column",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "45%" },
          animation: "fadeIn 0.8s ease-out",
          "@keyframes fadeIn": {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          padding: { xs: "15px", sm: "20px", md: "30px" }, // Adjust padding for mobile and tablet
          boxSizing: "border-box", // Ensures padding is considered in the width
          display: "flex",
          flexDirection: "column", // Ensuring column direction for mobile
          alignItems: "center", // Center content on mobile
          justifyContent: "center", // Center vertically on mobile
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.8rem", sm: "2rem", md: "3.5rem" }, // Adjusted font size for mobile and tablet
            mb: 1,
            color: "black",
            textAlign: "center", // Centered the text on smaller screens
          }}
        >
          Questions?
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "2.8rem" }, // Adjusted font size for mobile and tablet
            mb: 3,
            color: "#29175e",
            textAlign: "center", // Centered the text on smaller screens
          }}
        >
          Your Health, Made Easy
        </Typography>
        <Typography
          sx={{
            color: "#29175e",
            fontSize: { xs: "1rem", sm: "1.1rem" }, // Adjusted font size for mobile and tablet
            fontWeight: 550,
            fontFamily: "Poppins",
            lineHeight: 1.6,
            mb: 2,
            textAlign: "center", // Centered the text on smaller screens
            width: { xs: "80vw", md: "auto" },
          }}
        >
          We get it—healthcare terms can be confusing. That's why we’ve made our
          FAQs easy to understand.
        </Typography>
        <Typography
          sx={{
            color: "#29175e",
            fontSize: { xs: "1rem", sm: "1.1rem" }, // Adjusted font size for mobile and tablet
            fontWeight: 550,
            fontFamily: "Poppins",
            lineHeight: 1.6,
            textAlign: "center",
            width: { xs: "80vw", md: "auto" },
          }}
        >
          Need more help? Cassie, our AI assistant, is always here to guide you!
        </Typography>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "50%" }, // Adjust width for mobile, tablet, and desktop
          animation: "slideIn 0.8s ease-out",
          "@keyframes slideIn": {
            "0%": { opacity: 0, transform: "translateX(20px)" },
            "100%": { opacity: 1, transform: "translateX(0)" },
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "15px", sm: "20px", md: "30px" }, // Adjust padding for mobile, tablet, and desktop
          boxSizing: "border-box", // Ensures padding is considered in the width
        }}
      >
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={openIndex === index}
            onChange={() => setOpenIndex(openIndex === index ? null : index)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#29175e",
              borderRadius: "8px",
              mb: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              flexDirection: "row",
              width: {
                xs: "100%", // Full width on mobile
                sm: "80%", // 80% width on small screens
                md: "auto", // Auto width on medium screens and above
              },
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                transform: "scale(1.01)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ChevronDown
                  style={{
                    color: "#29175e",
                    transition: "transform 0.3s ease",
                    transform:
                      openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              }
              sx={{
                padding: {
                  xs: "12px 16px",
                  sm: "16px 24px",
                },

                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
                "& .MuiAccordionSummary-content": {
                  transition: "all 0.3s ease",
                },
                "& .MuiAccordionSummary-content.Mui-expanded": {
                  transform: "translateX(8px)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#29175e",
                  fontSize: { xs: "1rem", sm: "1.1rem" }, // Adjust font size for mobile and tablet
                  fontWeight: 550,
                  fontFamily: "Poppins",
                  lineHeight: 1.6,
                  transition: "all 0.3s ease",
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: { xs: "0px 16px 15px", sm: "0px 24px 20px" }, // Adjust padding for mobile and tablet
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                animation:
                  openIndex === index
                    ? "fadeInContent 0.5s ease-in-out"
                    : "none",
                "@keyframes fadeInContent": {
                  "0%": { opacity: 0, transform: "translateY(-10px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#29175e",
                  fontSize: { xs: "0.9rem", sm: "1rem" }, // Adjust font size for mobile and tablet
                  fontWeight: 400,
                  fontFamily: "Poppins",
                  lineHeight: 1.6,
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Floating circles decoration similar to the website */}
      <Box
        sx={{
          position: "absolute",
          right: "15%",
          top: "60%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.07)",
          filter: "blur(30px)",
          animation: "float 6s infinite ease-in-out 1s",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "20%",
          bottom: "10%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          filter: "blur(35px)",
          animation: "float 7s infinite ease-in-out 0.5s",
        }}
      />

      {/* Feature badges similar to the ones in the image */}
      {/* <Box
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          bottom: "40px",
          right: "40px",
          gap: "12px",
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            padding: "8px 16px",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#29175e",
            marginRight: "2.5rem",
            backdropFilter: "blur(5px)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-3px)",
            },
          }}
        >
          24/7 Support
        </Box>
      </Box> */}
    </Box>
  );
}

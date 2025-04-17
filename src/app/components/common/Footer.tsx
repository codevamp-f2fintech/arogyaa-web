"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  IconButton,
  Stack,
  TextField,
  Button,
  Paper,
  Divider,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  MedicalServices,
  LocalHospital,
} from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import Link from "next/link";

// Theme configuration
const THEME = {
  colors: {
    primary: "#29175e",
    secondary: "#50c878",
    // accent: "#FF7E5D",
    text: {
      dark: "#29175e",
      light: "#29175e",
    },
  },
};

// Component for Footer Menu Items
const FooterMenuItem = ({ label, route, icon }) => {
  return (
    <Typography
      component={Link}
      href={route}
      sx={{
        fontSize: "1rem",
        mb: 1.5,
        color: THEME.colors.text.light,
        transition: "all 0.3s ease",
        cursor: "pointer",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        "&:hover": {
          color: THEME.colors.primary,
          transform: "translateX(5px)",
        },
      }}
    >
      {icon &&
        React.cloneElement(icon, {
          sx: {
            fontSize: 18,
            mr: 1.5,
            color: THEME.colors.accent,
          },
        })}
      {label}
    </Typography>
  );
};

// Component for Social Media Button
const SocialButton = ({ Icon, label, link }) => {
  return (
    <Tooltip title={label} arrow>
      <IconButton
        size="medium"
        component="a"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: "#c1b4e2",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          border: `1px solid ${alpha(THEME.colors.primary, 0.2)}`,
          "&:hover": {
            backgroundColor: "#29175e",
            transform: "translateY(-3px)",
            boxShadow: `0 6px 12px ${alpha(THEME.colors.primary, 0.2)}`,
            "& .MuiSvgIcon-root": {
              color: "#c1b4e2",
            },
          },
          transition: "all 0.3s ease",
        }}
      >
        <Icon
          sx={{
            color: THEME.colors.primary,
            fontSize: 20,
            transition: "all 0.3s ease",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

// Component for Contact Info Item
const ContactItem = ({ Icon, text, link }) => {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={2}>
      <Box
        sx={{
          backgroundColor: alpha(THEME.colors.primary, 0.1),
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ color: THEME.colors.primary, fontSize: 18 }} />
      </Box>
      <Typography
        variant="body1"
        component={link ? "a" : "p"}
        href={link}
        target="_blank"
        sx={{
          color: THEME.colors.text.light,
          fontWeight: 500,
          lineHeight: 1.5,
          "&:hover": {
            color: link ? THEME.colors.primary : "inherit",
          },
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
};

// Main Footer Component
const Footer = () => {
  const theme = useTheme();

  // Mock data - would typically come from a localization file
  const content = {
    title: "Arogyaa",
    tagline:
      "The Best Medical Care for Your Family(Owned By F2 Fintech Private Limited)",
    address:
      "A-25, M-1 Arv Park, A-Block, Sector-63, Noida, Uttar Pradesh - 201301",
    phone: "+918810600135",
    email: "wecare@f2fintech.com",
    sections: {
      pages: {
        title: "Pages",
        items: [
          { label: "Doctors", route: "/doctors", icon: <MedicalServices /> },
          {
            label: "About Us",
            route: "#aboutsection",
            icon: <MedicalServices />,
          },
          {
            label: "Our Services",
            route: "#specialitiesSection",
            icon: <MedicalServices />,
          },
        ],
      },
      support: {
        title: "Support",
        items: [
          { label: "Appointments", route: "/doctors",},
          { label: "Emergency Care", route: "#" },
        ],
      },
    },
    social: {
      title: "Follow Us",
      items: [
        {
          Icon: InstagramIcon,
          label: "Instagram",
          link: "https://www.instagram.com/f2fintech?igsh=YXgzdmRubmlwMTY4",
        },
        {
          Icon: FacebookIcon,
          label: "Facebook",
          link: "https://www.facebook.com/share/1RQwbHLbyL/?mibextid=qi2Omg",
        },
        {
          Icon: XIcon,
          label: "Twitter",
          link: "https://x.com/i/flow/login?redirect_after_login=%2Ff2fintech",
        },
        {
          Icon: LinkedIn,
          label: "LinkedIn",
          link: "https://www.linkedin.com/posts/f2fintech_financialawareness-f2fintech-moneymantra-activity-7245737850351038464-EkBM?utm_source=share&utm_medium=member_android&rcm=ACoAADDeB8cBMnXt2Wdr6xQehwWWtg2UOGLWAIg",
        },
      ],
    },
    newsletter: {
      title: "Stay Updated",
      description: "Subscribe to our newsletter for health tips and updates",
    },
    copyright:
      "© Copyright 2024, All rights reserved with Arogyaa HealthCare — Healing with Care",
    bottomLinks: [
      {
        label: "Contact Us",
        route: "/contact",
      },
      {
        label: "Privacy Policy",
        route: "/privacy",
      },
      { label: "Terms & Conditions", route: "/terms" },
      {
        label: "Refund Policy",
        route: "/refund",
      },
    ],
  };

  const googleMapsLink = `https://www.google.com/maps/search/?q=${encodeURIComponent(
    content.address
  )}`;

  // Section Title component
  const SectionTitle = ({ children }) => (
    <Typography
      variant="h6"
      sx={{
        fontSize: "1.1rem",
        fontWeight: 700,
        mb: 3,
        color: THEME.colors.text.dark,
        textTransform: "uppercase",
        letterSpacing: 1,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -8,
          left: 0,
          width: "40px",
          height: "3px",
          borderRadius: "3px",
          backgroundColor: THEME.colors.accent,
        },
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box
      component="footer"
      sx={{
        background: "rgb(188,174,224)",
        background:
          "linear-gradient(180deg, rgba(188,174,224,1) 0%, rgba(255,255,255,1) 100%)",
        color: THEME.colors.text.dark,
        borderTop: "1px solid #fff",
        pt: 8,
        pb: 4,
        width: "100%",
        position: "relative",
        // borderTop: `1px solid ${alpha(THEME.colors.primary, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Logo and About Section */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {/* Logo */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  mb: 1,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: alpha(THEME.colors.primary, 0.1),
                    borderRadius: "12px",
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalHospital
                    sx={{
                      fontSize: 36,
                      color: THEME.colors.primary,
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  component={Link}
                  href="/"
                  sx={{
                    color: THEME.colors.text.dark,
                    textDecoration: "none",
                    fontSize: "2rem",
                    fontWeight: 800,
                    letterSpacing: 0.5,
                  }}
                >
                  {content.title}
                </Typography>
              </Stack>

              {/* Main Tagline */}
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 100,
                  mb: 4,
                  color: THEME.colors.text.dark,
                  lineHeight: 1.6,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -15,
                    left: 0,
                    width: "80px",
                    height: "3px",
                    backgroundColor: THEME.colors.primary,
                    borderRadius: "3px",
                  },
                }}
              >
                {content.tagline}
              </Typography>

              {/* Contact Information */}
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <ContactItem
                  Icon={LocationOn}
                  text={content.address}
                  link={googleMapsLink}
                />
                <ContactItem Icon={Phone} text={content.phone} />
                <ContactItem Icon={Email} text={content.email} />
              </Stack>
            </Stack>
          </Grid>

          {/* Pages Section */}
          <Grid item xs={6} md={2}>
            <SectionTitle>{content.sections.pages.title}</SectionTitle>
            <Stack spacing={1.5}>
              {content.sections.pages.items.map((item, index) => (
                <FooterMenuItem
                  key={index}
                  label={item.label}
                  route={item.route}
                  icon={item.icon}
                />
              ))}
            </Stack>
          </Grid>

          {/* Support Section */}
          <Grid item xs={6} md={2}>
            <SectionTitle>{content.sections.support.title}</SectionTitle>
            <Stack spacing={1.5}>
              {content.sections.support.items.map((item, index) => (
                <FooterMenuItem
                  key={index}
                  label={item.label}
                  route={item.route}
                />
              ))}
            </Stack>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={3}>
            <SectionTitle>{content.social.title}</SectionTitle>
            <Typography
              variant="body1"
              sx={{
                color: THEME.colors.text.light,
                mb: 3,
                fontSize: "0.95rem",
              }}
            >
              Connect with us on social media for updates and health tips.
            </Typography>

            {/* Social Media Icons */}
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              {content.social.items.map((item, index) => (
                <SocialButton
                  key={index}
                  Icon={item.Icon}
                  label={item.label}
                  link={item.link}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Footer with Copyright */}
        <Box sx={{ mt: 8 }}>
          <Divider
            sx={{
              mb: 4,
              borderColor: alpha(THEME.colors.text.dark, 0.1),
            }}
          />

          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  opacity: 0.8,
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: THEME.colors.text.light,
                }}
              >
                {content.copyright.split("Arogyaa HealthCare")[0]}
                <Box
                  component="span"
                  sx={{
                    color: THEME.colors.primary,
                    mx: 0.5,
                    fontWeight: 600,
                  }}
                >
                  Arogyaa
                </Box>
                {content.copyright.split("Arogyaa HealthCare")[1]}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 3 }}
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
                flexWrap="wrap"
                sx={{ mt: { xs: 2, md: 0 } }}
              >
                {content.bottomLinks.map((item, index) => (
                  <Typography
                    key={index}
                    component={Link}
                    href={item.route}
                    sx={{
                      color: THEME.colors.text.light,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      "&:hover": {
                        color: THEME.colors.primary,
                      },
                    }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

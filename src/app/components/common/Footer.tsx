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
    primary: "#20ADA0",
    secondary: "#1A8F84",
    text: {
      dark: "#0a2540",
      light: "#4a5568",
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
        fontSize: "1.2rem",
        mb: 2,
        color: THEME.colors.text.light,
        transition: "all 0.3s ease",
        cursor: "pointer",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        "&:hover": {
          color: THEME.colors.primary,
          transform: "translateX(8px)",
        },
      }}
    >
      {icon &&
        React.cloneElement(icon, {
          sx: { fontSize: 20, mr: 1, color: THEME.colors.primary },
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
        size="large"
        component="a"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: `2px solid ${alpha(THEME.colors.primary, 0.2)}`,
          "&:hover": {
            backgroundColor: THEME.colors.primary,
            borderColor: THEME.colors.primary,
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          },
          transition: "all 0.3s ease",
        }}
      >
        <Icon
          sx={{
            color: THEME.colors.primary,
            fontSize: 24,
            transition: "all 0.3s ease",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

// Component for Contact Info Item
const ContactItem = ({ Icon, text }) => {
  return (
    <Stack direction="row" alignItems="center">
      <Icon sx={{ color: THEME.colors.primary, mr: 2 }} />
      <Typography
        variant="body1"
        sx={{ color: THEME.colors.text.light, fontWeight: 500 }}
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
    tagline: "The Best Medical Care for Your Family",
    address:
      "A-25, M-1 Arv Park, A-Block, Sector-63, Noida Utter Pradesh - 201301",
    phone: "+918810600135",
    email: "wecare@f2fintech.com",
    sections: {
      pages: {
        title: "Pages",
        items: [
          { label: "Doctors", route: "/doctors", icon: <MedicalServices /> },
          // { label: "Clinics", route: "/clinics", icon: <LocalHospital /> },
          { label: "About Us", route: "#", icon: <MedicalServices /> },
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
          { label: "Appointments", route: "#" },
          { label: "Emergency Care", route: "#" },
          
        ],
      },
    },
    social: {
      title: "Social",
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
        label: "Privacy Policy",
        route: "/privacy",
        
      },
      { label: "Terms & Conditions", route: "/terms" },
      
          {
            label: "Refund Policy",
            route: "/refund",
         
          },
      // { label: "Sitemap", route: "/sitemap" },
    ],
  };

  const googleMapsLink = `https://www.google.com/maps/search/?q=${encodeURIComponent(
    content.address
  )}`;

  // Section Title component
  const SectionTitle = ({ children }) => (
    <Typography
      sx={{
        fontSize: "1.5rem",
        fontWeight: 700,
        mb: 4,
        color: THEME.colors.text.dark,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -12,
          left: 0,
          width: "60px",
          height: "4px",
          borderRadius: "4px",
          backgroundColor: THEME.colors.primary,
        },
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: THEME.colors.text.dark,
        pt: 8,
        pb: 4,
        width: "100%",
        position: "relative",
        boxShadow: "0px -5px 20px rgba(0,0,0,0.05)",
        borderTop: `4px solid ${THEME.colors.primary}`,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Logo and About Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Logo */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mb: 2,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <LocalHospital
                  sx={{
                    fontSize: 60,
                    color: THEME.colors.primary,
                    mr: 2,
                  }}
                />
                <Typography
                  variant="h4"
                  component={Link}
                  href="/"
                  sx={{
                    color: THEME.colors.text.dark,
                    textDecoration: "none",
                    fontSize: "2.4rem",
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  {content.title}
                </Typography>
              </Stack>

              {/* Main Tagline */}
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 500,
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
              <Stack spacing={3} sx={{ mt: 2 }}>
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
          <Grid item xs={12} md={3}>
            <SectionTitle>{content.sections.pages.title}</SectionTitle>
            <Stack spacing={1} sx={{ mt: 3 }}>
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
          <Grid item xs={12} md={2}>
            <SectionTitle>{content.sections.support.title}</SectionTitle>
            <Stack spacing={1} sx={{ mt: 3 }}>
              {content.sections.support.items.map((item, index) => (
                <FooterMenuItem
                  key={index}
                  label={item.label}
                  route={item.route}
                />
              ))}
            </Stack>
          </Grid>

          {/* Social Media and Newsletter Section */}
          <Grid item xs={12} md={3}>
            <SectionTitle>{content.social.title}</SectionTitle>

            {/* Social Media Icons */}
            <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 4 }}>
              {content.social.items.map((item, index) => (
                <SocialButton
                  key={index}
                  Icon={item.Icon}
                  label={item.label}
                  link={item.link}
                />
              ))}
            </Stack>

            {/* Newsletter Subscription */}
            {/* <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(THEME.colors.primary, 0.1)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[4],
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: THEME.colors.text.dark,
                  mb: 1,
                }}
              >
                {content.newsletter.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: THEME.colors.text.light,
                  mb: 2,
                }}
              >
                {content.newsletter.description}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                component="form"
              >
                <TextField
                  placeholder="Your email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: THEME.colors.primary,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: THEME.colors.primary,
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: THEME.colors.primary,
                    color: "white",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: THEME.colors.secondary,
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Stack>
            </Paper> */}
          </Grid>
        </Grid>

        {/* Bottom Footer with Copyright */}
        <Box sx={{ mt: 8 }}>
          <Divider
            sx={{
              mb: 4,
              "&::before, &::after": {
                borderColor: alpha(THEME.colors.text.dark, 0.1),
              },
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 4,
                backgroundColor: THEME.colors.primary,
                borderRadius: 2,
              }}
            />
          </Divider>

          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  opacity: 0.9,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: THEME.colors.text.light,
                }}
              >
                {content.copyright.split("Arogyaa HealthCare")[0]}
                <Box
                  component="span"
                  sx={{ color: THEME.colors.primary, mx: 1 }}
                >
                  Arogyaa
                </Box>
                {content.copyright.split("Arogyaa HealthCare")[1]}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={4}
                justifyContent={{ xs: "flex-start", md: "flex-end" }}
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
                      position: "relative",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      "&:hover": {
                        color: THEME.colors.primary,
                        "&::after": {
                          width: "100%",
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: -4,
                        left: 0,
                        width: "0%",
                        height: "2px",
                        backgroundColor: THEME.colors.primary,
                        transition: "width 0.3s ease",
                        borderRadius: "1px",
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

"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import AdbIcon from "@mui/icons-material/Adb";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import {
  Container,
  IconButton,
  useTheme,
  alpha,
  Zoom,
  Tooltip,
} from "@mui/material";

import en from "@/locales/en.json";
import Link from "next/link";
import { LinkedIn } from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();

  // Updated color palette for white background and black text
  const mainColor = "#ffffff";
  const textColor = "#000000";
  const logoColor = "#20ADA0";

  const styles = {
    mainFooter: {
      backgroundColor: mainColor,
      color: textColor,
      pt: 4,
      width: "-webkit-fill-available",
      position: "relative",
      boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
    },
    logoSection: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    logoBox: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 3,
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "scale(1.03)",
      },
    },
    logoIcon: {
      fontSize: 56,
      color: logoColor,
    },
    logoText: {
      color: textColor,
      textDecoration: "none",
      fontSize: "2.2rem",
      fontWeight: 700,
      letterSpacing: 1.5,
    },
    mainTitle: {
      fontSize: "1.8rem",
      fontWeight: 500,
      mb: 3,
      color: textColor,
      lineHeight: 1.5,
    },
    sectionTitle: {
      fontSize: "1.4rem",
      fontWeight: 600,
      mb: 4,
      color: textColor,
      position: "relative",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: -12,
        left: 0,
        width: "60px",
        height: "4px",
        borderRadius: "2px",
        backgroundColor: textColor,
      },
    },
    menuItem: {
      fontSize: "1.2rem",
      mb: 3,
      color: textColor,
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      "&:hover": {
        color: alpha(textColor, 0.7),
        transform: "translateX(10px)",
      },
      "&::before": {
        content: '""',
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: textColor,
        marginRight: "15px",
        transition: "all 0.3s ease",
        opacity: 0.7,
      },
      "&:hover::before": {
        opacity: 1,
        transform: "scale(1.3)",
      },
    },
    socialSection: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    socialIcons: {
      display: "flex",
      gap: 3,
      mb: 5,
    },
    iconButton: {
      backgroundColor: textColor,
      padding: "15px",
      "&:hover": {
        backgroundColor: alpha(textColor, 0.8),
        transform: "translateY(-5px)",
      },
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    bottomFooter: {
      color: textColor,
      mt: 4,
      py: 4,
      borderTop: "1px solid rgba(0,0,0,0.1)",
    },
    bottomLinks: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 5,
      flexWrap: "wrap",
    },
    bottomLink: {
      color: textColor,
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      fontSize: "1.1rem",
      "&:hover": {
        color: alpha(textColor, 0.7),
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: -4,
        left: 0,
        width: "0%",
        height: "2px",
        backgroundColor: textColor,
        transition: "width 0.3s ease",
      },
      "&:hover::after": {
        width: "100%",
      },
    },
  };

  return (
    <>
      <Box sx={styles.mainFooter}>
        <Container
          sx={{
            width: "1900px",
          }}
        >
          <Grid container spacing={8}>
            <Grid xs={12} md={5}>
              <Box sx={styles.logoSection}>
                <Box sx={styles.logoBox}>
                  <AdbIcon sx={styles.logoIcon} />
                  <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={styles.logoText}
                  >
                    {en.footer.title}
                  </Typography>
                </Box>
                <Typography sx={styles.mainTitle}>
                  {en.footer.the_best_medical}
                </Typography>
              </Box>
            </Grid>

            <Grid xs={12} md={4}>
              <Typography sx={styles.sectionTitle}>
                {en.footer.pages_section.title}
              </Typography>
              <Box sx={{ mt: 4 }}>
                {[
                  { label: en.footer.pages_section.doctors, route: "/doctors" },
                  {
                    label: en.footer.contact_section.clinics,
                    route: "#healthConcerns",
                  },
                  // {
                  //   label: en.footer.contact_section.hospitals,
                  //   route: "/hospitals",
                  // },
                  // {
                  //   label: en.footer.contact_section.medicines,
                  //   route: "/medicines",
                  // },
                ].map((item, index) => (
                  <Zoom
                    in={true}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    key={index}
                  >
                    {item.route ? (
                      <Link href={item.route} passHref>
                        <Typography sx={styles.menuItem} component="a">
                          {item.label}
                        </Typography>
                      </Link>
                    ) : (
                      <Typography sx={styles.menuItem}>{item.label}</Typography>
                    )}
                  </Zoom>
                ))}
              </Box>
            </Grid>

            <Grid xs={12} md={3}>
              <Box sx={styles.socialSection}>
                <Typography sx={styles.sectionTitle}>
                  {en.footer.social}
                </Typography>
                <Box sx={styles.socialIcons}>
                  {[
                    {
                      Icon: InstagramIcon,
                      label: "Instagram",
                      link: "https://www.instagram.com/f2fintech?igsh=bWdqemk4Ym1xYnhq",
                    },
                    {
                      Icon: FacebookIcon,
                      label: "Facebook",
                      link: "https://www.facebook.com/f2fintech/",
                    },
                    {
                      Icon: XIcon,
                      label: "Twitter",
                      link: "https://x.com/i/flow/login?redirect_after_login=%2Ff2fintech",
                    },
                    {
                      Icon: LinkedIn,
                      label: "LinkedIn",
                      link: "https://www.linkedin.com/company/f2fintech/",
                    },
                  ].map(({ Icon, label, link }, index) => (
                    <Tooltip
                      title={label}
                      key={index}
                      TransitionComponent={Zoom}
                    >
                      <IconButton
                        sx={{
                          ...styles.iconButton,
                          borderRadius: "50%",
                          padding: "10px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: alpha(textColor, 0.8),
                            transform: "scale(1.1)",
                          },
                        }}
                        size="large"
                        component="a"
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon sx={{ color: "#fff", fontSize: 28 }} />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box sx={styles.bottomFooter}>
          <Container maxWidth="xl">
            <Grid container alignItems="center" spacing={3}>
              <Grid xs={12} md={6}>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, fontWeight: 500, fontSize: "1.1rem" }}
                >
                  © Copyright 2024, All rights reserved with Arogya HealthCare
                </Typography>
              </Grid>
              <Grid xs={12} md={6}>
                <Box sx={styles.bottomLinks}>
                  {[
                    {
                      label: en.footer.pages_section.privacy,
                      route: "/privacy",
                    },
                    { label: en.footer.pages_section.terms, route: "/terms" },
                    { label: en.footer.pages_section.faq, route: "#faq" },
                  ].map((item, index) => (
                    <Link href={item.route || "#"} key={index} passHref>
                      <Typography
                        variant="body2"
                        sx={styles.bottomLink}
                        component="a"
                      >
                        {item.label}
                      </Typography>
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Footer;

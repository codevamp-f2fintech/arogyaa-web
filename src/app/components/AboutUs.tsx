"use client";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";
import en from "@/locales/en.json";
import styles from "../page.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const AboutUs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardData = [
    {
      title: en.homepage.aboutUs.cardTitle1,
      description: en.homepage.aboutUs.cardDescription1,
      href: "/doctors",
    },
    {
      title: en.homepage.aboutUs.cardTitle2,
      description: en.homepage.aboutUs.cardDescription2,
    },
    {
      title: en.homepage.aboutUs.cardTitle3,
      description: en.homepage.aboutUs.cardDescription3,
    },
  ];
  // const theme = useTheme();

  return (
    <Box
      className={styles.aboutUsContainer}
      id="aboutsection"
      sx={{
        py: { xs: 6, sm: 8, md: 12 },

        overflow: "hidden",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(126,107,177,1) 0%, rgba(164,145,215,1) 100%)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 4, sm: 6 }}
          alignItems="center"
          component={motion.div}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Image Section */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              order: { xs: 2, md: 1 },
            }}
            component={motion.div}
            variants={itemVariants}
          >
            <Box
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              sx={{
                width: "100%",
                maxWidth: { xs: "280px", sm: "350px", md: "100%" },
                borderRadius: "20px",
                boxShadow: "0 25px 50px -12px rgba(32, 173, 160, 0.25)",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(32, 173, 160, 0.1) 0%, transparent 100%)",
                  zIndex: 1,
                },
              }}
            >
              <Box
                component="img"
                className={styles.image}
                alt="Doctor in White Coat"
                src="/aboutus.png"
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  transition: "transform 0.8s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Text Section */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{ order: { xs: 1, md: 2 } }}
            component={motion.div}
            variants={containerVariants}
          >
            <Typography
              variant="h3"
              component={motion.h2}
              variants={itemVariants}
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "2.5rem",
                fontWeight: 550,
                marginTop: "2px",
                color: "#fff !important",
                fontFamily: "Poppins",
                letterSpacing: "0.5px",
                lineHeight: "1.2",
              }}
              animate={{
                color: ["#fff", "#fff", "#b497d6"],
                textShadow: [
                  "0 0 10px rgba(180,151,214,0.5)",
                  "0 0 20px rgba(180,151,214,0.8)",
                  "0 0 10px rgba(180,151,214,0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              {en.homepage.aboutUs.title1}
              <Box
                component="span"
                sx={{
                  color: "#29175e",
                  fontWeight: 700,
                  ml: 1,
                  position: "relative",
                  fontFamily: "'Poppins', sans-serif",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "4px",
                    bottom: "-6px",
                    left: 0,
                    backgroundColor: "#29175e",
                    borderRadius: "2px",
                    transformOrigin: "left",
                    transition: "transform 0.3s ease",
                    transform: "rotate(-5deg)", // Tilting the line by -5 degrees
                  },
                  "&:hover::after": {
                    transform: "rotate(0deg)", // Reset on hover
                  },
                }}
              >
                {en.homepage.aboutUs.title2}
              </Box>
            </Typography>

            <Typography
              variant="body1"
              component={motion.p}
              variants={itemVariants}
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                color: theme.palette.text.primary,
                lineHeight: 1.7,
                mt: 3,
                mb: 4,
                textAlign: { xs: "justify", md: "left" },
                width: { md: "90%", xs: "25%" },
                fontFamily: "'DM Sans', sans-serif",
                marginLeft: {
                  xs: "60vh",
                  md: "0",
                  sm: "0",
                },
              }}
            >
              {en.homepage.aboutUs.description}
            </Typography>

            {/* Cards Section */}
            <Grid
              container
              spacing={{ xs: 2, sm: 3 }}
              component={motion.div}
              variants={containerVariants}
            >
              {cardData.map((card, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  component={motion.div}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <Link href={card.href ? card.href : "#"} passHref>
                    <Paper
                      elevation={0}
                      component={motion.div}
                      whileHover={{
                        y: -8,
                        boxShadow:
                          index === 0
                            ? "0 15px 30px rgba(32, 173, 160, 0.3)"
                            : "0 15px 30px rgba(0, 0, 0, 0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      sx={{
                        cursor: "pointer",
                        p: { xs: 2, sm: 3 },
                        height: { xs: "auto", sm: "85%" },
                        minHeight: { xs: "140px", sm: "180px" },
                        borderRadius: "16px",
                        textAlign: "center",
                        overflow: "hidden",
                        position: "relative",
                        transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #29175e 100%, #333 0%)"
                            : "#29175e",
                        color: index === 0 ? "#fff" : "#fff",
                        boxShadow:
                          index === 0
                            ? "0 10px 20px rgba(32, 173, 160, 0.2)"
                            : "0 8px 16px rgba(0, 0, 0, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        fontFamily: "'DM Sans', sans-serif",
                        "&::before":
                          index == 3
                            ? {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "6px",
                                height: "40%",
                                background:
                                  "linear-gradient(180deg, red 0%, transparent 100%)",
                                borderRadius: "3px",
                                transition: "height 0.3s ease",
                              }
                            : {},
                        "&:hover::before":
                          index !== 0
                            ? {
                                height: "100%",
                              }
                            : {},
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontSize: {
                            xs: "1.2rem",
                            sm: "1.3rem",
                            md: "1.4rem",
                            lg: "1.5rem",
                          },

                          fontWeight: 600,
                          mb: { xs: 1, sm: 2 },
                          position: "relative",
                          display: "inline-block",
                          marginLeft: "auto",
                          marginRight: "auto",
                          fontFamily: "'DM Sans', sans-serif",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: -8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "40px",
                            height: "2px",
                          },
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: {
                            xs: "0.9rem",
                            sm: "0.95rem",
                            md: "1rem",
                            lg: "1.05rem",
                          },
                          lineHeight: 1.6,
                          opacity: index === 0 ? 0.9 : 0.8,
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {card.description}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;

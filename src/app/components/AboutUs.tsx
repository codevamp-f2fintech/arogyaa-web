"use client";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import en from "@/locales/en.json";
import styles from "../page.module.css";

const AboutUs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Data for cards with improved copy
  const cardData = [
    {
      title: en.homepage.aboutUs.cardTitle1,
      description: en.homepage.aboutUs.cardDescription1,
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

  return (
    <Box
      className={styles.aboutUsContainer}
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(180deg, rgba(240,248,247,0.4) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
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
          >
            <Box
              component="img"
              className={styles.image}
              alt="Doctor in White Coat"
              src="../assets/images/online-doctor-with-white-coat.png"
              sx={{
                width: "100%",
                maxWidth: { xs: "280px", sm: "380px", md: "100%" },
                height: "550px",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(32, 173, 160, 0.15)",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            />
          </Grid>

          {/* Text Section */}
          <Grid item xs={12} md={7} sx={{ order: { xs: 1, md: 2 } }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#222",
                textAlign: { xs: "center", md: "left" },
                mb: 2,
              }}
            >
              {en.homepage.aboutUs.title1}
              <Box
                component="span"
                sx={{
                  color: "#20ada0",
                  fontWeight: 700,
                  ml: 1,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "4px",
                    bottom: "-6px",
                    left: 0,
                    backgroundColor: "#20ada0",
                    borderRadius: "2px",
                  },
                }}
              >
                {en.homepage.aboutUs.title2}
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                color: "#555",
                lineHeight: 1.8,
                mt: 3,
                mb: 4,
                textAlign: { xs: "center", md: "left" },
                maxWidth: { md: "90%" },
              }}
            >
              {en.homepage.aboutUs.description}
            </Typography>

            {/* Cards Section */}
            <Grid container spacing={3}>
              {cardData.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: "100%",
                      minHeight: "220px",
                      borderRadius: "16px",
                      textAlign: "center",
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.3s ease",
                      background:
                        index === 0
                          ? "linear-gradient(135deg, #20ada0 0%, #0d8b80 100%)"
                          : "#fff",
                      color: index === 0 ? "#fff" : "#333",
                      boxShadow:
                        index === 0
                          ? "0 10px 20px rgba(32, 173, 160, 0.2)"
                          : "0 8px 16px rgba(0, 0, 0, 0.06)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow:
                          index === 0
                            ? "0 15px 30px rgba(32, 173, 160, 0.3)"
                            : "0 15px 30px rgba(0, 0, 0, 0.1)",
                      },
                      "&::before":
                        index !== 0
                          ? {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "6px",
                              height: "40%",
                              background:
                                "linear-gradient(180deg, #20ada0 0%, transparent 100%)",
                              borderRadius: "3px",
                            }
                          : {},
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{
                        fontSize: { xs: "1.3rem", md: "1.5rem" },
                        fontWeight: 600,
                        mb: 2,
                        position: "relative",
                        display: "inline-block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.95rem", md: "1.05rem" },
                        lineHeight: 1.7,
                        opacity: index === 0 ? 0.9 : 0.8,
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Paper>
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

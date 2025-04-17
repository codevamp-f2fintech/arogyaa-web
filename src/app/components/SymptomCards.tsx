"use client";
import { useCallback, useState } from "react";
import styles from "../page.module.css";
import en from "@/locales/en.json";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  createTheme,
  ThemeProvider,
  Grow,
  useMediaQuery,
} from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";
import { useGetSymptom } from "@/hooks/symptoms";
import { motion } from "framer-motion";
import { useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "blue",
      light: "#E6F6F4",
      dark: "#188F84",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F8FAFC",
      light: "#FFFFFF",
      dark: "#E2E8F0",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(32, 173, 160, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          textTransform: "none",
          fontSize: "1rem",
          boxShadow: "none",
        },
        contained: {
          boxShadow: "0 8px 16px rgba(32, 173, 160, 0.2)",
          "&:hover": {
            boxShadow: "0 12px 20px rgba(32, 173, 160, 0.3)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          height: 28,
          fontSize: "0.875rem",
          fontWeight: 600,
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
});

const SymptomCards = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 40,
  });

  const {
    value: data,
    swrLoading,
    error,
  } = useGetSymptom(null, "get-symptoms", pageSize.page, pageSize.size);

  const handleConsult = useCallback(
    (symptomsName: string) => {
      router.push(`/doctors?keyword=${encodeURIComponent(symptomsName)}`);
    },
    [router]
  );

  // Split symptoms into two groups for different directions
  const firstHalfSymptoms = data?.results?.slice(0, 22) || [];
  const secondHalfSymptoms = data?.results?.slice(22, 39) || [];

  // Create duplicated arrays for infinite scrolling effect
  const duplicatedFirstHalf = [...firstHalfSymptoms, ...firstHalfSymptoms];
  const duplicatedSecondHalf = [...secondHalfSymptoms, ...secondHalfSymptoms];
  const firstControls = useAnimation();
  const firstRef = useRef(null);
  const secondControls = useAnimation();
  const secondRef = useRef(null);

  useEffect(() => {
    firstControls.start({
      x: "-50%",
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [firstControls]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        sx={{
          background:
            "linear-gradient(180deg, rgba(93,73,147,1) 0%, rgba(104,82,164,1) 100%)",
          minHeight: "100vh",
          py: { xs: 8, md: 12 },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 8 },
          }}
        >
          <Typography
            sx={{
              color: "#fff !important",
              fontFamily: "Poppins",
              fontSize: "1.8rem !important",
            }}
            variant="h5"
            component="h5"
            className={styles.title1}
          >
            {en.homepage.symptomCards.title1}
          </Typography>
          <motion.div
            // variant="h2"
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
            {en.homepage.symptomCards.title2}
          </motion.div>
        </Box>
        <Box
          sx={{
            width: "100vw",
          }}
        >
          {/* First row - right to left infinite scroll */}
          <Box
            sx={{
              overflow: "hidden",
              mb: 1,
              position: "relative",
            }}
          >
            <motion.div
              ref={firstRef}
              animate={firstControls}
              style={{
                display: "flex",
                width: "200%",
                gap: "2rem",
              }}
              onMouseEnter={() => firstControls.stop()}
              onMouseLeave={() =>
                firstControls.start({
                  x: "-50%",
                  transition: {
                    duration: 10,
                    ease: "linear",
                    repeat: Infinity,
                  },
                })
              }
            >
              {duplicatedFirstHalf.map((symptom, index) => (
                <Box
                  key={`first-${symptom._id}-${index}`}
                  sx={{
                    flex: "0 0 calc(16.666% - 1.67rem)",
                    position: "relative",
                  }}
                >
                  <Grow
                    in={true}
                    timeout={((index % 3) + 1) * 300}
                    style={{ transformOrigin: "center top" }}
                  >
                    <Card
                      sx={{
                        height: "90%",
                        background: "#b497d6",
                        border: "1px solid rgba(32, 173, 160, 0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: theme.palette.primary.light,
                              boxShadow: "0 12px 24px rgba(32, 173, 160, 0.1)",
                            }}
                          >
                            <img
                              src={
                                symptom.icon ||
                                "/assets/images/online-doctor-with-white-coat.png" ||
                                "/placeholder.svg"
                              }
                              alt={symptom.name}
                              style={{ width: 40, height: 40 }}
                            />
                          </Box>
                          <Box sx={{ ml: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#29175e",
                                fontFamily: "Poppins",
                                mb: 1,
                                fontWeight: 550,
                              }}
                            >
                              {symptom.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            mb: 3,
                            color: "#29175e",
                            fontSize: ".9rem",
                            fontWeight: 550,
                            fontFamily: "Poppins",
                            lineHeight: 1.7,
                          }}
                        >
                          {symptom.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                  <Button
                    variant="contained"
                    className="consultButton"
                    endIcon={<ArrowCircleRight />}
                    onClick={() => handleConsult(symptom.name)}
                    sx={{
                      position: "relative",
                      bottom: 60,
                      marginLeft: "45px",
                      width: "75%",
                      background: "#29175e !important",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)!important",
                      },
                    }}
                  >
                    Consult Now
                  </Button>
                </Box>
              ))}
            </motion.div>
          </Box>

          {/* Second row - left to right infinite scroll */}
          <Box sx={{ overflow: "hidden", position: "relative" }}>
            <motion.div
              ref={secondRef}
              animate={secondControls}
              style={{
                display: "flex",
                width: "200%", // Ensure the width is enough for the movement
                gap: "2rem",
              }}
              onMouseEnter={() => {
                // Stop animation when hovered
                secondControls.stop();
              }}
              onMouseLeave={() => {
                // Start animation again when mouse leaves
                secondControls.start({
                  x: "-50%", // Animation moves from 0% to -50%
                  transition: {
                    duration: 10,
                    ease: "linear",
                    repeat: Infinity,
                  },
                });
              }}
            >
              {duplicatedSecondHalf.map((symptom, index) => (
                <Box
                  key={`second-${symptom._id}-${index}`}
                  sx={{
                    flex: "0 0 calc(16.666% - 1.67rem)",
                    position: "relative",
                  }}
                >
                  <Grow
                    in={true}
                    timeout={((index % 3) + 4) * 300}
                    style={{ transformOrigin: "center top" }}
                  >
                    <Card
                      sx={{
                        height: "90%",
                        background: "#b497d6",
                        border: "1px solid rgba(32, 173, 160, 0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 3,
                          }}
                        >
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: "24px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: theme.palette.primary.light,
                              boxShadow: "0 12px 24px rgba(32, 173, 160, 0.1)",
                            }}
                          >
                            <img
                              src={
                                symptom.icon ||
                                "/assets/images/online-doctor-with-white-coat.png" ||
                                "/placeholder.svg"
                              }
                              alt={symptom.name}
                              style={{ width: 40, height: 40 }}
                            />
                          </Box>
                          <Box sx={{ ml: 2 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#29175e",
                                fontFamily: "Poppins",
                                mb: 1,
                                fontWeight: 550,
                              }}
                            >
                              {symptom.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            mb: 3,
                            color: "#29175e",
                            fontSize: ".9rem",
                            fontWeight: 550,
                            fontFamily: "Poppins",
                            lineHeight: 1.7,
                          }}
                        >
                          {symptom.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                  <Button
                    variant="contained"
                    className="consultButton"
                    endIcon={<ArrowCircleRight />}
                    onClick={() => handleConsult(symptom.name)}
                    sx={{
                      position: "relative",
                      bottom: 60,
                      marginLeft: "45px",
                      width: "75%",
                      background: "#29175e !important",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)!important",
                      },
                    }}
                  >
                    Consult Now
                  </Button>
                </Box>
              ))}
            </motion.div>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SymptomCards;

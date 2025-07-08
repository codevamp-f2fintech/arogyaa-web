"use client";
import { useCallback, useState, useEffect, useRef } from "react";
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
import { motion, useAnimation } from "framer-motion";

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
  const firstControls = useAnimation();
  const secondControls = useAnimation();
  const firstRef = useRef(null);
  const secondRef = useRef(null);

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
    (symptomsName) => {
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

  const animationDuration = 15;

  useEffect(() => {
    // First row - right to left
    firstControls.start({
      x: "-50%",
      transition: {
        ease: "linear",
        duration: 40,
        repeat: Infinity,
        repeatType: "loop",
      },
    });

    // Second row - left to right
    secondControls.start({
      x: "0%",
      transition: {
        ease: "linear",
        duration: 40,
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  }, [firstControls, secondControls]);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth={false}
        sx={{
          background:
            "linear-gradient(180deg, rgba(93,73,147,1) 0%, rgba(104,82,164,1) 100%)",
          // minHeight: "55vh",
          py: { xs: 8, md: 12 },
          width: "100vw",
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
              fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
            }}
            variant="h5"
            component="h5"
            className={styles.title1}
          >
            {en.homepage.symptomCards.title1}
          </Typography>
          <motion.div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: 550,
              marginTop: "2px",
              color: "#fff !important",
              fontFamily: "Poppins",
              letterSpacing: "0.5px",
              lineHeight: "1.2",
              flex: " 0 0 100%",
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
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* First row - right to left infinite scroll */}
          <motion.div
            ref={firstRef}
            initial={{ x: "0%" }}
            animate={firstControls}
            style={{
              display: isMobile ? "none" : "flex",
              width: "200%",
              gap: "2rem",
              overflow: "visible",
            }}
            onMouseEnter={() => {
              if (!isMobile) {
                firstControls.stop();
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                firstControls.start({
                  x: "-50%",
                  transition: {
                    ease: "linear",
                    duration: animationDuration,
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                });
              }
            }}
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
                      height: isMobile ? "80%" : "90%",
                      width: isMobile ? "100%" : "auto",
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
                            width: {
                              xs: 48,
                              sm: 56,
                              md: 64,
                            },
                            height: {
                              xs: 48,
                              sm: 56,
                              md: 64,
                            },
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

          {/* Second row - left to right infinite scroll */}
          <motion.div
            ref={secondRef}
            initial={{ x: "-50%" }}
            animate={secondControls}
            style={{
              display: isMobile ? "none" : "flex",
              width: "200%",
              gap: "2rem",
              overflow: "visible",
              marginTop: "2rem",
            }}
            onMouseEnter={() => {
              if (!isMobile) {
                secondControls.stop();
              }
            }}
            onMouseLeave={() => {
              if (!isMobile) {
                secondControls.start({
                  x: "0%",
                  transition: {
                    ease: "linear",
                    duration: animationDuration,
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                });
              }
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

                            "@media (max-width: 600px)": {
                              width: "15vh",
                              borderRadius: "50%",
                            },
                          }}
                        >
                          <img
                            src={
                              symptom.icon ||
                              "/assets/images/online-doctor-with-white-coat.png" ||
                              "/placeholder.svg"
                            }
                            alt={symptom.name}
                            style={{ width: 50, height: 50 }}
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
                              "@media (max-width: 600px)": {
                                fontSize: "1.4rem",
                              },
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
                          "@media (max-width: 600px)": {
                            mb: 8,
                            fontSize: "1rem",
                          },
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
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    width: "75%",
                    background: "#29175e !important",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)!important",
                    },
                    "@media (max-width: 600px)": {
                      width: "80%",
                      height: "4vh",
                      bottom: 40,
                      ml: 3.3,
                    },
                  }}
                >
                  Consult Now
                </Button>
              </Box>
            ))}
          </motion.div>

          {/* Mobile horizontal scroll view */}
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              overflowX: "auto",
              overflowY: "hidden",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#b497d6",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "#9c84c4",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                pb: 2,
                px: 1,
                width: "max-content",
              }}
            >
              {[...duplicatedFirstHalf, ...duplicatedSecondHalf].map(
                (symptom, index) => (
                  <Box
                    key={`mobile-${symptom._id}-${index}`}
                    sx={{
                      flex: "0 0 280px",
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
                          height: "320px",
                          background: "#b497d6",
                          border: "1px solid rgba(32, 173, 160, 0.1)",
                          borderRadius: "16px",
                        }}
                      >
                        <CardContent sx={{ p: 2, height: "100%" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: theme.palette.primary.light,
                                boxShadow: "0 8px 16px rgba(32, 173, 160, 0.1)",
                              }}
                            >
                              <img
                                src={
                                  symptom.icon ||
                                  "/assets/images/online-doctor-with-white-coat.png" ||
                                  "/placeholder.svg"
                                }
                                alt={symptom.name}
                                style={{ width: 36, height: 36 }}
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
                                  fontSize: "1.1rem",
                                }}
                              >
                                {symptom.name}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography
                            sx={{
                              mb: 2,
                              color: "#29175e",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              fontFamily: "Poppins",
                              lineHeight: 1.6,
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {symptom.description}
                          </Typography>

                          <Button
                            variant="contained"
                            className="consultButton"
                            endIcon={<ArrowCircleRight />}
                            onClick={() => handleConsult(symptom.name)}
                            sx={{
                              position: "absolute",
                              bottom: 16,
                              left: 16,
                              right: 16,
                              width: "calc(100% - 32px)",
                              background: "#29175e !important",
                              color: "white",
                              fontWeight: "bold",
                              borderRadius: "12px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              transition: "all 0.3s ease",
                              fontSize: "0.85rem",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                              },
                            }}
                          >
                            Consult Now
                          </Button>
                        </CardContent>
                      </Card>
                    </Grow>
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SymptomCards;

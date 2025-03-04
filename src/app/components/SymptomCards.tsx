"use client";
import React, { useCallback, useState } from "react";
import styles from "../page.module.css";
import en from "@/locales/en.json";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  createTheme,
  ThemeProvider,
  Grow,
  useMediaQuery,
  Chip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VerifiedIcon from "@mui/icons-material/Verified";
import PeopleIcon from "@mui/icons-material/People";
import { ArrowCircleRight } from "@mui/icons-material";
import { useGetSymptom } from "@/hooks/symptoms";

const theme = createTheme({
  palette: {
    primary: {
      main: "#20ADA0",
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
          // padding: "12px 24px",
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
  const [hoveredCard, setHoveredCard] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 6,
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "#FFFFFF",
          minHeight: "100vh",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              mb: { xs: 6, md: 8 },
            }}
          >
            <Typography variant="h5" component="h5" className={styles.title1}>
              {en.homepage.symptomCards.title1}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                mb: { xs: 4, md: 6 },
                fontSize: { xs: "2rem", sm: "2.5rem", md: "2.5rem" },
                fontWeight: 600,
                // fontFamily: "Roboto",
                color: "black",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              {en.homepage.symptomCards.title2}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {data?.results?.map((symptom, index) => (
              <Grid item xs={12} sm={6} md={4} key={symptom._id}>
                <Grow
                  in={true}
                  timeout={(index + 1) * 300}
                  style={{ transformOrigin: "center top" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      background: "#FFFFFF",
                      border: "1px solid rgba(32, 173, 160, 0.1)",
                    }}
                    onMouseEnter={() => setHoveredCard(symptom._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent sx={{ p: 4 }}>
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
                            src={symptom.icon || "/assets/images/online-doctor-with-white-coat.png"}
                            alt={symptom.name}
                            style={{ width: 40, height: 40 }}
                          />
                        </Box>
                        <Box sx={{ ml: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              color: "text.primary",
                              mb: 1,
                            }}
                          >
                            {symptom.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          mb: 3,
                          color: "text.secondary",
                          fontSize: "1.1rem",
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
                    background: "#20ADA0 !important",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Consult Now
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SymptomCards;

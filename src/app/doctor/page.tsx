"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  Box,
  Collapse,
  Select,
  InputBase,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Divider,
  IconButton,
  Rating,
  Skeleton,
  List,
  ListItemText,
  ListItem,
} from "@mui/material";
import styles from "../page.module.css";
import ChatIcon from "@mui/icons-material/Chat";
import WorkIcon from "@mui/icons-material/Work";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookAppointmentModal from "../components/common/BookAppointmentModal";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { useGetDoctors } from "@/hooks/doctor";
import { fetcher } from "@/apis/apiClient";
import { DoctorData } from "@/types/doctor";

const theme = createTheme({
  palette: {
    primary: {
      main: "#20ADA0",
      light: "#4FBEB3",
      dark: "#178F84",
    },
    secondary: {
      main: "#354C5C",
      light: "#5A7082",
      dark: "#233240",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: "'system-ui'",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },

    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default function ModernDoctorProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>();
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [filters, setFilters] = useState({
    gender: "",
    experienceFilter: "",
    sortBy: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyword(keyword);
    debouncedFetchResults(keyword);
  };
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const {
    value: doctors,
    swrLoading,
    error,
  } = useGetDoctors(null, "get-doctors", 1, 6, filters);

  const fetchDoctorResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetcher(
        "doctor",
        `get-doctors?keyword=${encodeURIComponent(searchTerm)}`
      );
      if (response && response.results && Array.isArray(response.results)) {
        setResults(response.results);
      } else {
        console.error("Unexpected response structure:", response);
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  const openModal = (doctor: DoctorData): void => {
    const userToken = Cookies.get("token");
    if (!userToken) {
      const encodedReturnUrl = encodeURIComponent(
        `/doctor?autoBookDoctorId=${doctor._id}`
      );
      router.push(`/signup?redirect=${encodedReturnUrl}`);
      return;
    }
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setSelectedDoctor(null);
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetchResults = useCallback(
    debounce(fetchDoctorResults, 500),
    []
  );

  // 3) On mount (or after fetch), check if the URL has ?autoBookDoctorId=XXXX
  //    If the user is already logged in, automatically open the modal for that doctor
  useEffect(() => {
    const token = Cookies.get("token");
    const autoBookDoctorId = searchParams.get("autoBookDoctorId");

    if (token && autoBookDoctorId && doctors?.results?.length) {
      const found = doctors.results.find(
        (doc: DoctorData) => doc._id === autoBookDoctorId
      );
      if (found) {
        setSelectedDoctor(found);
        setModalOpen(true);
      }
    }
  }, [searchParams, doctors?.results?.length]);

  if (swrLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" color="error" align="center">
          Error loading doctor list: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{ py: 12 }}>
        {/* Search Bar */}
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {/* Search Bar on the Right */}
          <Grid item xs={12} sm={4} md={4}>
            <Paper
              component="form"
              className={styles.searchBarWrapper}
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "1rem 0rem",
                padding: "0.25rem", // Reduced padding to make it more compact
                maxWidth: "400px", // Increased width
                width: "100%", // Ensures responsiveness
                borderRadius: "20px", // Adjusted for a sleeker look
                backgroundColor: "rgba(255, 255, 255, 0.90)",
                position: "relative",
                marginLeft: "auto",
              }}
            >
              <InputBase
                value={keyword}
                onChange={handleChange}
                className={styles.searchBarInput}
                placeholder="Search for Doctors and Specialties"
                inputProps={{ "aria-label": "search" }}
                sx={{
                  flex: 1,
                  padding: "0.3rem 0.5rem",
                  fontSize: { xs: "0.75rem", sm: "0.9rem" },
                }}
              />
              <IconButton
                type="submit"
                aria-label="search"
                className={styles.searchBarButton}
                sx={{
                  backgroundColor: "#20ADA0",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "0.4rem",
                  "&:hover": {
                    backgroundColor: "#1A8575",
                  },
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </Paper>

            <Box
              sx={{
                position: "absolute",
                top: "160px",
                width: "28vw",
                mx: "30px",
                my: "0px",
                backgroundColor: "#fff",
                color: "#000",
                maxWidth: { xs: "100%", sm: "600px" },
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
                overflow: "hidden",
              }}
            >
              <Collapse in={results.length > 0}>
                {results.length > 0 ? (
                  <List
                    sx={{
                      maxHeight: "180px",
                      overflowY: "auto",
                      padding: "8px",
                      "::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "::-webkit-scrollbar-thumb": {
                        backgroundColor: "#20ADA0",
                        borderRadius: "4px",
                      },
                      "::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "#1A8575",
                      },
                    }}
                  >
                    {results.map((doctor) => (
                      <ListItem key={doctor._id}>
                        <Link
                          href={`/doctor/profile/${doctor._id}`}
                          passHref
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                          }}
                        >
                          <ListItemText
                            primary={doctor.username}
                            sx={{
                              cursor: "pointer",
                              "&:hover": {
                                color: "black",
                              },
                            }}
                          />
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      margin: "1rem",
                      color: "#555",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      textAlign: "center",
                    }}
                  >
                    No results found for "{keyword}"
                  </Typography>
                )}
              </Collapse>
            </Box>
          </Grid>
        </Grid>

        {/* Filters */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{
            justifyContent: "flex-start",
            mb: 3,
            marginTop: "-75px",
          }}
        >
          {/* Gender Filter */}
          <Grid item xs={4} sm={3} md={2}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.90)",
                borderRadius: "30px",
                minWidth: 120, // Set a consistent width
              }}
            >
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender-select"
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                label="Gender"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderRadius: "40px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Experience Filter */}
          <Grid item xs={4} sm={3} md={2}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                background: "#fff",
                borderRadius: "30px",
              }}
            >
              <InputLabel id="experience-label">Experience</InputLabel>
              <Select
                labelId="experience-label"
                id="experience-select"
                value={filters.experienceFilter}
                onChange={(e) =>
                  handleFilterChange("experienceFilter", e.target.value)
                }
                label="Experience"
                sx={{
                  "&:focus-visible": {
                    borderColor: "black",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderRadius: "40px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="above 5 years">5+ Years</MenuItem>
                <MenuItem value="above 10 years">10+ Years</MenuItem>
                <MenuItem value="above 15 years">15+ Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Fees Filter */}
          <Grid item xs={4} sm={3} md={2}>
            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                background: "#fff",
                borderRadius: "30px",
              }}
            >
              <InputLabel id="fees-label">Fees</InputLabel>
              <Select
                labelId="fees-label"
                id="fees-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                label="Fees"
                sx={{
                  "&:focus-visible": {
                    borderColor: "black",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                    borderRadius: "40px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black",
                  },
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="fee_high_to_low">High To Low</MenuItem>
                <MenuItem value="fee_low_to_high">Low To High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <Link href="/appointment/chat" passHref>
            <IconButton
              color="primary"
              sx={{
                backgroundColor: "#20ADA0",
                color: "#fff",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  backgroundColor: "#178F84",
                },
              }}
            >
              <ChatIcon fontSize="large" />
            </IconButton>
          </Link>
        </Box>
        {/* Doctor List */}
        <Grid
          container
          spacing={3}
          sx={{
            marginTop: "20px",
          }}
        >
          {Array.isArray(doctors?.results) &&
            doctors.results.map((doctor: any) => (
              <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                <Paper
                  elevation={5}
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",

                    // "&:hover": {
                    //   transform: "scale(1.02)",
                    //   boxShadow: "0px 12px 20px rgba(0, 0, 0, 0.3)",
                    // },
                  }}
                >
                  {/* Header Section */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        doctor.profilePicture ||
                        "https://blog.pincel.app/wp-content/uploads/2024/02/Doctor_headshot_happy_full_body_in_a_medical_coat_professional_light_blue_background.jpeg"
                      }
                      alt={doctor.username || "Doctor"}
                      sx={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #fff",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        marginRight: "20px",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "black" }}
                      >
                        {doctor.username || "Unknown Doctor"}
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<CheckCircleOutlineIcon />}
                          label={
                            doctor.tags?.length > 0
                              ? doctor.tags.join(" | ")
                              : "Languages not available"
                          }
                          sx={{
                            color: "#20ADA0",
                          }}
                          variant="body2"
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "black",
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 16, color: "gray", mr: 0.5 }}
                        />
                        {doctor.address || "Doctor Title"} |{" "}
                        {doctor.hospitalAffiliations?.[0] || "Hospital Name"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Details Section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 3,
                      py: 2,
                      borderTop: "1px solid #f0f0f0",
                      borderBottom: "1px solid #f0f0f0",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      <WorkIcon fontSize="small" color="primary" />
                      {doctor.experience
                        ? `${doctor.experience} Years Experience`
                        : "Experience Not Available"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "bold",
                        color: "rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      <CurrencyRupeeIcon fontSize="small" color="primary" />
                      {doctor.consultationFee || "Not Available"}
                    </Typography>
                  </Box>

                  {/* Actions Section */}
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: "#fefefe",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderRadius: "0px",
                        textTransform: "none",
                        background: "#20ada0",
                        color: "#fff",
                        borderRight: "1px solid #f0f0f0",
                        "&:hover": {
                          backgroundColor: "#074799",
                        },
                      }}
                      onClick={() => {
                        router.push(
                          `/doctor/profile/${encodeURIComponent(doctor._id)}`
                        );
                      }}
                    >
                      View Full Profile
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: "0px",
                        textTransform: "none",
                        backgroundColor: "orange",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "green",
                        },
                      }}
                      onClick={() => openModal(doctor)}
                    >
                      Book Appointment
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
        <BookAppointmentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          data={selectedDoctor}
        />
      </Container>
    </ThemeProvider>
  );
}

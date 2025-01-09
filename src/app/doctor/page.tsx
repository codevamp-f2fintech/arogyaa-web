"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
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
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

import ModalOne from "../components/common/BookAppointmentModal";
import StarIcon from "@mui/icons-material/Star";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { useGetDoctors } from "@/hooks/doctor";

// Create a custom theme
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
      default: "#F5F7FA",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
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
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    gender: "",
    experienceFilter: "",
    sortBy: "",
  });
  const openModal = (): void => {
    setModalOpen(true);
  };
  const closeModal = (): void => {
    setModalOpen(false);
  };
  const router = useRouter();

  const {
    value: doctors,
    swrLoading,
    error,
  } = useGetDoctors(null, "get-doctors", 1, 6, filters);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleFilterSubmit = () => {
    fetch(filters);
  };

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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          sx={{ marginTop: "revert" }}
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Find Your Perfect Doctor
        </Typography>
        <ModalOne isOpen={isModalOpen} onClose={closeModal} />

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            backgroundColor: "background.paper",
          }}
        >
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender-select"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  label="Gender"
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="experience-label">Experience</InputLabel>
                <Select
                  labelId="experience-label"
                  id="experience-select"
                  value={filters.experienceFilter}
                  onChange={(e) =>
                    handleFilterChange("experienceFilter", e.target.value)
                  }
                  label="Experience"
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="fees-label">Fees</InputLabel>
                <Select
                  labelId="fees-label"
                  id="fees-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  label="Fees"
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="fee_high_to_low">High To Low</MenuItem>
                  <MenuItem value="fee_low_to_high">Low To High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<FilterListIcon />}
                sx={{
                  height: "56px",
                  color: "#fff",
                  background: "#20ADA0",
                  borderRadius: "4px",
                  ":hover": {
                    bgcolor: "#20ADA0",
                    color: "white",
                  },
                }}
                onClick={handleFilterSubmit}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Doctor list */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8} md={8}>
            {Array.isArray(doctors?.results) ? (
              doctors.results.map((doctor: any) => (
                <Paper
                  key={doctor._id}
                  sx={{
                    display: "flex",
                    marginTop: "15px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box
                    sx={{
                      padding: "10px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="img"
                      alt={doctor.username}
                      src={
                        doctor.profilePicture ||
                        "../../../assets/images/drRanjanaSharma.jpg"
                      }
                      sx={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "5px solid white",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "20px",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: "#20ADA0",
                          lineHeight: "1.5rem",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {doctor.username || "Unknown Doctor"}
                        &nbsp;[
                        <PhoneIcon
                          sx={{ fontSize: "1rem", marginRight: "4px" }}
                        />
                        {doctor.contact || "Unknown Doctor"}]
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 400,
                          color: "gray",
                          lineHeight: "1.2rem",
                          marginTop: "5px",
                        }}
                      >
                        Bio: {doctor.bio || "Not available"}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 400,
                          color: "gray",
                          lineHeight: "1.2rem",
                          marginTop: "5px",
                        }}
                      >
                        Gender: {doctor.gender || "Not available"} | Fees:{" "}
                        {doctor.consultationFee || "Not available"}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 400,
                          color: "gray",
                          lineHeight: "1.2rem",
                          marginTop: "5px",
                        }}
                      >
                        Qualifications:{" "}
                        {doctor.qualificationIds?.join(", ") || "Not available"}
                      </Typography>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#354c5c",
                            lineHeight: "1.2rem",
                            marginTop: "10px",
                            marginBottom: "5px",
                          }}
                        >
                          Availability:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {doctor.availability &&
                          doctor.availability.length > 0 ? (
                            doctor.availability.map((slot, index) => (
                              <Typography
                                key={index}
                                sx={{
                                  fontSize: "0.8rem",
                                  color: "#20ada0",
                                  backgroundColor: "#e0e0e0",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  textDecoration: "bold",
                                }}
                              >
                                {slot.day}: {slot.startTime}-{slot.endTime}
                              </Typography>
                            ))
                          ) : (
                            <Typography
                              sx={{ fontSize: "0.8rem", color: "#354c5c" }}
                            >
                              No availability information
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#354c5c",
                            lineHeight: "1.2rem",
                          }}
                        >
                          {doctor.experience != null
                            ? `${doctor.experience} years of experience`
                            : "Experience not available"}
                        </Typography>
                        <span
                          style={{
                            color: "gray",
                            margin: "0px 10px",
                          }}
                        >
                          |
                        </span>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#354c5c",
                            lineHeight: "1.2rem",
                          }}
                        >
                          {doctor.languagesSpoken?.length > 0
                            ? doctor.languagesSpoken.join(", ")
                            : "Languages not available"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        textAlign: "right",
                        marginTop: "15px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      {/* Chat Button */}
                      <Link href={`/appointment/chat`} passHref>
                        <Button
                          variant="contained"
                          startIcon={<ChatIcon />}
                          sx={{
                            backgroundColor: "#20ADA0",
                            color: "#fff",
                            borderRadius: "20px",
                            ":hover": { backgroundColor: "#1a8c80" },
                            marginRight: 1,
                            mb: 1,
                          }}
                        >
                          Chat
                        </Button>
                      </Link>

                      {/* View Profile Button */}
                      <Button
                        variant="contained"
                        startIcon={<AccountCircleIcon />}
                        sx={{
                          backgroundColor: "#20ADA0",
                          color: "#fff",
                          borderRadius: "20px",
                          ":hover": { backgroundColor: "#1a8c80" },
                          marginRight: 1,
                          mb: 2, // Add spacing below View Profile button
                        }}
                        onClick={() => {
                          router.push(
                            `/doctor/profile/${encodeURIComponent(doctor._id)}`
                          );
                        }}
                      >
                        View Profile
                      </Button>

                      <Button
                        onClick={() => {
                          openModal();
                          console.log("Doctor ID:", doctor._id);
                        }}
                        variant="contained"
                        startIcon={<BookOnlineIcon />}
                        sx={{
                          backgroundColor: "#20ADA0",
                          color: "#fff",
                          borderRadius: "20px",
                          ":hover": { backgroundColor: "#1a8c80" },
                          marginRight: 1,
                          mb: 2,
                        }}
                      >
                        Book Appointment
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography>No doctors available</Typography>
            )}
          </Grid>

          {/* Right Column Content */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ mb: 4, overflow: "hidden" }}>
              <CardContent sx={{ bgcolor: "primary.light", color: "white" }}>
                <Typography variant="h5" gutterBottom>
                  Book an Appointment
                </Typography>
                <Typography variant="h4" gutterBottom>
                  Expert Dietitians
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Diet Consultation @Rs.299 Only
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li">50+ Expert Dietitians</Typography>
                  <Typography component="li">
                    Personalized Diet Plans
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={0}>
              <CardContent>
                <Typography
                  variant="h5"
                  color="primary"
                  align="center"
                  gutterBottom
                >
                  We're Here to Help!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  gutterBottom
                >
                  Get an instant callback within minutes
                </Typography>
                <form>
                  <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    select
                    label="Select Location"
                    defaultValue=""
                    helperText="Please select your location"
                    margin="normal"
                  >
                    <MenuItem value="bareilly">Bareilly</MenuItem>
                    <MenuItem value="delhi">Delhi</MenuItem>
                    <MenuItem value="mumbai">Mumbai</MenuItem>
                  </TextField>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Request Callback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

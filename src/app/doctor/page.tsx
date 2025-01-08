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
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

import ModalOne from "../components/common/BookAppointmentModal";
import { useGetDoctors } from "@/hooks/doctor";

export default function BasicSelect() {
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading doctor list: {error.message}</div>;
  }

  return (
    <Box
      sx={{
        padding: "30px",
        marginTop: "40px",
        paddingBottom: 0,
      }}
    >
      <ModalOne isOpen={isModalOpen} onClose={closeModal} />
      {/* Filters */}
      <Box sx={{ marginBottom: "10px" }}>
        <Paper sx={{ padding: "10px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender-select"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  label="Gender"
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    color: "#354c5c",
                    lineHeight: "1.2rem",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
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
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    color: "#354c5c",
                    lineHeight: "1.2rem",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
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
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    color: "#354c5c",
                    lineHeight: "1.2rem",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="fee_high_to_low">High To Low</MenuItem>
                  <MenuItem value="fee_low_to_high">Low To High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                sx={{
                  width: "auto",
                  marginTop: "8px",
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
      </Box>

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
        <Grid item xs={12} sm={4} md={4}>
          <Box
            sx={{
              padding: "10px",
              background: "white",
              marginTop: "15px",
            }}
          >
            <Typography
              sx={{
                color: "#20ada0",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Book an Appointment with Expert Dietitians
            </Typography>
            <Typography
              sx={{
                color: "black",
                fontSize: "0.9rem",
                fontWeight: 400,
                marginTop: "10px",
              }}
            >
              Diet Consultation @Rs.299 Only
            </Typography>
            <ul
              style={{
                marginTop: "10px",
              }}
            >
              <li
                style={{
                  color: "gray",
                  fontSize: "0.8rem",
                  fontWeight: 400,
                  listStyle: "none",
                  marginTop: "5px",
                }}
              >
                With over 50+ expert Dietitians
              </li>
              <li
                style={{
                  color: "gray",
                  fontSize: "0.8rem",
                  fontWeight: 400,
                  listStyle: "none",
                  marginTop: "5px",
                }}
              >
                Get personalized diet plan
              </li>
            </ul>
          </Box>

          <Box
            sx={{
              marginTop: "15px",
              background: "white",
              padding: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#20ada0",
                fontSize: "1.25rem",
                fontWeight: "bold",
                listStyle: "none",
                marginTop: "5px",
                textAlign: "center",
              }}
            >
              We are Here to Help!
            </Typography>
            <Typography
              sx={{
                color: "gray",
                fontSize: "0.8rem",
                fontWeight: 400,
                listStyle: "none",
                marginTop: "5px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Get instant call back in few mins
            </Typography>
            <FormControl fullWidth>
              <TextField
                id="outlined-basic"
                label="Enter Name"
                variant="outlined"
                inputProps={{
                  style: { fontSize: ".8rem" },
                }}
                InputLabelProps={{
                  style: { fontSize: ".8rem" },
                }}
              />
              <TextField
                id="outlined-basic"
                label="Enter Phone Number"
                variant="outlined"
                sx={{ marginTop: "10px", marginBottom: "10px" }}
                inputProps={{
                  style: { fontSize: ".8rem" },
                }}
                InputLabelProps={{
                  style: { fontSize: ".8rem" },
                }}
              />

              <TextField
                id="outlined-select-currency"
                select
                label="Select"
                defaultValue=""
                helperText="Please select your Location"
                sx={{
                  fontSize: ".8rem",
                }}
              >
                <MenuItem value="bareilly"> Bareilly </MenuItem>
              </TextField>
              <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  width: "auto",
                  color: "#fff",
                  background: "#20ADA0",
                  borderRadius: "4px",
                  ":hover": {
                    bgcolor: "#20ADA0",
                    color: "white",
                  },
                }}
              >
                Book Now
              </Button>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

// -----------------------------------
// Extra arrays (unchanged)
// -----------------------------------
const drlist = [
  {
    drsrc: "../assets/images/drRanjanaSharma.jpg",
    name: "Dr. Ranjana Sharma",
    type: "General Physician",
    work: "MS GR Medical College, Gwalior",
    exep: "42+ years of experience",
    lang: "Hindi, English, Bit of Arabic",
    rating: "Rating 4.5",
    button1: "View Profile",
    button2: "Book Appointment2",
    onsultationfee: "Consultation Fees",
    rs: "500",
  },
  {
    drsrc: "../assets/images/drNidhiSharma.jpg",
    name: "Dr. Nidhi Sharma",
    type: "General Physician",
    work: "MS (Obgyn) PGIMS, Rohtak",
    exep: "13+ years of experience",
    lang: "Speaks Hindi, English, French, Punjabi, Marathi",
    rating: "Rating 4.5",
    button1: "View Profile",
    button2: "Book Appointment3",
    onsultationfee: "Consultation Fees",
    rs: "700",
  },
  {
    drsrc: "../assets/images/niranjanaDr.jpg",
    name: "Dr.Niranjana Jayakrishnan",
    type: "General Physician",
    work: "MD Amrita Vishwa Vidyapeetham University, Kochi",
    exep: "13+ years of experience",
    lang: "Speaks Hindi, English, French, Punjabi, Marathi",
    rating: "Rating 4.5",
    button1: "View Profile",
    button2: "Book Appointment4",
    onsultationfee: "Consultation Fees",
    rs: "1000",
  },
];

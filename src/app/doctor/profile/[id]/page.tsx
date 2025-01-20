"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { Box, Grid, Paper, Typography, Button, Tabs, Tab,ThemeProvider,
  createTheme, } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import ModalOne from "../../../components/common/BookAppointmentModal";
import { fetcher } from "@/apis/apiClient";

// Define TypeScript interfaces for profile data
interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface ProfileData {
  data?: {
    id: string;
    username: string;
    profilePicture?: string;
    email: string;
    contact: string;
    bio?: string;
    experienceYears?: number;
    languagesSpoken?: string[];
    gender?: string;
    dob?: string;
    address?: string;
    consultationFee?: number;
    availability?: AvailabilitySlot[];
  };
}

// Define props for ModalOne if needed
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrProfile: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [appointmentTabValue, setAppointmentTabValue] = useState<number>(0);
  const params = useParams();
  const doctorId = params?.id;
  const cardStyle = {
    padding: "26px",
    borderRadius: "10px",
    height: "190px",
    backgroundColor: "#f9f9f9", // Same background for all cards
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Same shadow for all cards
  };
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

  const [profileData, setProfileData] = useState<ProfileData>({});
  const [modalData, setModalData] = useState<{
    doctorId: string;
    doctorName: string;
    consultationFee?: number;
    address?: string;
    availability?: AvailabilitySlot[];
  } | null>(null);
  useEffect(() => {
    if (doctorId) {
      const fetchProfileData = async () => {
        try {
          const response: ProfileData = await fetcher(
            "doctor",
            `get-doctor-by-id/${doctorId}`
          );
          setProfileData(response);
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        }
      };
      fetchProfileData();
    }
  }, [doctorId]);
  const openModal = (): void => {
    if (profileData.data) {
      setModalData({
        doctorId: profileData.data.id,
        doctorName: profileData.data.username,
        consultationFee: profileData.data.consultationFee,
        address: profileData.data.address,
        availability: profileData.data.availability,
      });
      setModalOpen(true);
    }
  };
  const closeModal = (): void => {
    setModalOpen(false);
    setModalData(null);
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setTabValue(newValue);
  };

  const handleAppointmentTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setAppointmentTabValue(newValue);
  };

  const handleClinicTabClick = (
    event: MouseEvent<HTMLButtonElement>,
    newValue: number
  ): void => {
    setAppointmentTabValue(newValue);
    setTabValue(1);
  };

  return (
      <ThemeProvider theme={theme}>
    <Box
      sx={{
        padding: "20px",
        paddingTop: "20px",
        marginTop: "20px",
      }}
    >
      <ModalOne isOpen={isModalOpen} onClose={closeModal} data={modalData} />
      <Box sx={{ padding: "10px" }}>
        <Grid container spacing={3}>
          {/* Doctor Information Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                display: "flex",
                padding: "30px",
                position: "relative",
              }}
            >
              {/* Doctor Details */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "#20ada0",
                  alignItems: "center",
                  borderRadius: "10px",
                }}
              >
                {/* Doctor Image */}
                <Box
                  component="img"
                  alt="Doctor"
                  src={
                    profileData.data?.profilePicture ||
                    "/assets/images/drRanjanaSharma.jpg"
                  }
                  sx={{
                    width: "150px",
                    height: "150px",
                    marginLeft: "20px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "5px",
                  }}
                />

                {/* Doctor Information */}
                <Box
                  sx={{
                    flex: 1,
                    marginLeft: "20px",
                    marginTop: "40px",
                    borderRadius: "30px",
                    backgroundColor: "#20ada0",
                  }}
                >
                  {/* Username and Verified Badge */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {profileData.data?.username || "Name not available"}
                    <Box
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#354c5c",
                        lineHeight: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "10px",
                        border: "1px solid #fff",
                        borderRadius: "4px",
                        padding: "3px",
                      }}
                    >
                      <VerifiedIcon
                        sx={{ color: "#fff", marginRight: "5px" }}
                      />
                      {/* Verified profile */}
                    </Box>
                  </Typography>

                  {/* Email and Contact */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                      marginBottom: "10px",
                      padding: "10px",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  >
                    {/* Email Icon */}
                    <EmailIcon
                      sx={{
                        fontSize: "18px",
                        marginRight: "10px",
                        color: "#fff",
                      }}
                    />
                    {/* Email Text */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#fff",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {profileData.data?.email || "Email not available"}
                    </Typography>

                    {/* Divider */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#fff",
                        lineHeight: "1.2rem",
                        marginX: "10px",
                      }}
                    >
                      |
                    </Typography>

                    {/* Phone Icon */}
                    <PhoneIcon
                      sx={{
                        fontSize: "18px", // Adjust the icon size
                        marginRight: "10px", // Spacing between icon and text
                        color: "#fff", // Icon color
                      }}
                    />
                    {/* Contact Text */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#fff",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {profileData.data?.contact || "Contact not available"}
                    </Typography>
                  </Box>

                  {/* Bio */}
                  <Box
                    sx={{
                      marginBottom: "2px",
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
                    {/* Profile Icon */}
                    <WorkIcon
                      sx={{
                        fontSize: "18px",
                        marginRight: "8px",
                        color: "#fff",
                      }}
                    />
                    {/* Bio Section */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#fff",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {profileData.data?.bio || "Bio not available"}
                    </Typography>
                  </Box>

                  {/* Appointment Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: "0.2px",
                    }}
                  >
                    <Box>
                      {/* <Button
                        onClick={openModal}
                        variant="contained"
                        aria-label="Book a video appointment"
                        startIcon={<VideoCallIcon sx={{ fontSize: "20px" }} />}
                        sx={{
                          marginRight: "5px",
                          paddingX: "5px",
                          marginBottom: "14px",
                          paddingY: "3px",
                          color: "#20ADA0",
                          background: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "1rem",
                          textTransform: "none",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          // ":hover": {
                          //   transform: "scale(1.05)",
                          //   boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                          //   background:
                          //     "linear-gradient(90deg, #1D877A, #20ADA0)",
                          // },
                          // ":focus-visible": {
                          //   outline: "2px solid #20ADA0",
                          //   outlineOffset: "2px",
                          // },
                        }}
                      >
                        Book Video Appointment
                      </Button> */}

                      <Button
                        onClick={openModal}
                        variant="contained"
                        startIcon={
                          <LocalHospitalIcon sx={{ fontSize: "20px" }} />
                        }
                        sx={{
                          marginRight: "15px",
                          paddingX: "26px",
                          marginBottom: "14px",
                          paddingY: "2px",
                          color: "#fff",
                          background: "orange",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          fontSize: "1rem",
                          textTransform: "none",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                      >
                        Book Appointment
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Rating Section */}
              <Box
                sx={{
                  position: "absolute",
                  top: "60px",
                  right: "60px",
                  backgroundColor: "#f8f9fa",
                  width: "170px",
                  padding: "8px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundImage: 'url("/assets/images/vector_plus.png")',
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "90px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    color: "#333",
                    fontWeight: "500",
                    marginBottom: "4px",
                  }}
                >
                  Rating
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "2rem",
                    textAlign: "center",
                    color: "#20ada0",
                    fontWeight: "bold",
                  }}
                >
                  5/5
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "4px", // Added slight spacing
                  }}
                >
                  {[...Array(5)].map((_, index) => (
                    <Box
                      key={index}
                      component="img"
                      alt="Star"
                      src="/assets/images/star-fill.png"
                      sx={{
                        width: "24px", // Smaller star size
                        height: "24px",
                        marginX: "2px",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={8} md={8}>
            <Box sx={{ width: "100%", background: "white" }}>
              {/* Profile Tabs */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                aria-label="Profile Tabs"
                sx={{
                  background: "#e8e8e8",
                  "& .MuiTabs-indicator": { display: "none" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    backgroundColor: "#f0f0f5",
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#20ada0",
                      borderLeft: "1px solid #20ada0",
                      borderRight: "1px solid #20ada0",
                      borderTop: "1px solid #20ada0",
                    },
                  },
                }}
              >
                <Tab label="Profile" />
                <Tab label="Clinic Location" />
                <Tab label="Blog Post" />
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <Box>
                    {/* Profile Information */}
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "300",
                        color: "black",
                        lineHeight: "1.5rem",
                        marginBottom: "20px",
                      }}
                    >
                      <span
                        style={{
                          color: "#007bff",
                          fontWeight: "600",
                        }}
                      >
                        {profileData.data?.username || "Doctor"}
                      </span>{" "}
                      is a passionate and experienced mental health
                      professional. Completed MBBS from Manipal University and
                      post-graduation in psychiatry from St John’s Medical
                      College Bangalore.
                    </Typography>

                    {/* Conditions Treated */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#20ada0",

                        lineHeight: "1.8rem",
                        marginBottom: "10px",
                      }}
                    >
                      Conditions Treated
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        padding: 0,
                        listStyleType: "none",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "15px",
                      }}
                    >
                      {[
                        "Stress and anger management",
                        "Sleep problems",
                        "Communication and relationship problems",
                        "Anxiety and Depressive disorders",
                        "Schizophrenia and psychotic disorders, OCD, Bipolar disorders",
                        "ADHD, Autism",
                        "Childhood motor disorders",
                        "Childhood emotional and mental wellbeing",
                        "Career guidance",
                      ].map((condition, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "0.9rem",
                            fontWeight: "400",
                            color: "#354c5c",
                            lineHeight: "1.4rem",
                            padding: "8px 12px",
                            border: "1px solid #20ada0",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <DoneIcon
                            sx={{
                              fontSize: "18px",
                              color: "#20ada0",
                              marginRight: "8px",
                            }}
                          />
                          {condition}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Grid container spacing={4}>
                      {/* Clinic Location */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={cardStyle}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#20ada0",
                              marginBottom: "10px",
                            }}
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: "300",
                              color: "#354c5c",
                            }}
                          >
                            {profileData.data?.address ||
                              "Address not available"}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Availability */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={cardStyle}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#20ada0",
                              marginBottom: "10px",
                            }}
                          >
                            Availability
                          </Typography>
                          {profileData.data?.availability?.length ? (
                            profileData.data.availability.map((slot, index) => (
                              <Box key={index} sx={{ marginBottom: "10px" }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "0.9rem",
                                    fontWeight: "500",
                                    color: "#20ADA0",
                                  }}
                                >
                                  {slot.day}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: "300",
                                    color: "#354c5c",
                                  }}
                                >
                                  {slot.startTime} - {slot.endTime}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: "300",
                                color: "#354c5c",
                              }}
                            >
                              No Availability
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      {/* In-Clinic Visit */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={cardStyle}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#20ada0",
                              marginBottom: "10px",
                            }}
                          >
                            In-Clinic Visit
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              color: "#354c5c",
                              marginBottom: "10px",
                            }}
                          >
                            <CurrencyRupeeIcon
                              sx={{ marginRight: "5px", color: "#20ada0" }}
                            />
                            Fee: ₹ {profileData.data?.consultationFee || "N/A"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.9rem",
                              fontWeight: "500",
                              color: "#354c5c",
                            }}
                          >
                            <PaymentIcon
                              sx={{ marginRight: "5px", color: "#20ada0" }}
                            />
                            Online Payment Available
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    <Box
                      sx={{
                        padding: "15px",
                        borderRadius: "10px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          color: "#20ada0",
                          marginBottom: "10px",
                        }}
                      >
                        Home Consultation
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "300",
                          color: "#354c5c",
                        }}
                      >
                        Home visits available in{" "}
                        <span style={{ fontWeight: "500" }}>
                          {profileData.data?.address || "your area"}
                        </span>{" "}
                        only, subject to doctor availability.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Appointment Tabs */}
          <Grid item xs={12} sm={4} md={4}>
            <Box sx={{ width: "100%", background: "white" }}>
              <Tabs
                value={appointmentTabValue}
                onChange={handleAppointmentTabChange}
                variant="fullWidth"
                aria-label="Appointment Tabs"
                sx={{
                  background: "#e8e8e8",
                  "& .MuiTabs-indicator": { display: "none" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    backgroundColor: "#f0f0f5",
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#20ada0",
                      borderLeft: "1px solid #20ada0",
                      borderRight: "1px solid #20ada0",
                      borderTop: "1px solid #20ada0",
                    },
                  },
                }}
              >
                <Tab label="Video" />
                <Tab
                  label="Clinic"
                  onClick={(e) => handleClinicTabClick(e, 1)}
                />
              </Tabs>

              {/* Appointment Content */}
              <Box sx={{ p: 3 }}>
                {appointmentTabValue === 0 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginTop: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      Available Tomorrow
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        color: "#000",
                        lineHeight: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      Delhi, Gurugram
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        padding: 0,
                        listStyleType: "none",
                      }}
                    >
                      {profileData.data?.availability?.map((slot, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            marginTop: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "300",
                            color: "black",
                            padding: "8px 10px",
                            border: "1px solid #20ada0",
                            borderRadius: "4px",
                            marginRight: "10px",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                          }}
                        >
                          {slot.startTime}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {appointmentTabValue === 1 && (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginTop: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      Available Tomorrow
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        color: "#000",
                        lineHeight: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      Delhi, Gurugram
                    </Typography>
                    <Box
                      component="ul"
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        padding: 0,
                        listStyleType: "none",
                      }}
                    >
                      {profileData.data?.availability?.map((slot, index) => (
                        <Box
                          key={index}
                          component="li"
                          sx={{
                            marginTop: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "300",
                            color: "black",
                            padding: "8px 10px",
                            border: "1px solid #20ada0",
                            borderRadius: "4px",
                            marginRight: "10px",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                          }}
                        >
                          {slot.startTime}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </ThemeProvider>
  );
};

export default DrProfile;

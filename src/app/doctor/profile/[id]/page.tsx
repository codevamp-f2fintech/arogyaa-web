"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { Box, Grid, Paper, Typography, Button, Tabs, Tab } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";

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

  const [profileData, setProfileData] = useState<ProfileData>({});

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
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
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
    <Box
      sx={{
        padding: "40px",
        paddingTop: "90px",
      }}
    >
      <ModalOne isOpen={isModalOpen} onClose={closeModal} />
      <Box sx={{ padding: "10px" }}>
        <Grid container spacing={3}>
          {/* Doctor Information Section */}
          <Grid item xs={12}>
            <Paper
              sx={{
                display: "flex",
                padding: "20px",
                position: "relative",
              }}
            >
              {/* Doctor Details */}
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  alignItems: "flex-start",
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
                    width: "200px",
                    height: "auto",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />

                {/* Doctor Information */}
                <Box sx={{ flex: 1, marginLeft: "20px" }}>
                  {/* Username and Verified Badge */}
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#20ada0",
                      display: "flex",
                      alignItems: "center",
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
                        border: "1px solid #20ada0",
                        borderRadius: "4px",
                        padding: "3px",
                      }}
                    >
                      <VerifiedIcon
                        sx={{ color: "#20ada0", marginRight: "5px" }}
                      />
                      Verified profile
                    </Box>
                  </Typography>

                  {/* Email and Contact */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                      marginBottom: "10px",
                      color: "#20ada0",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {profileData.data?.email || "Email not available"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginX: "10px",
                      }}
                    >
                      |
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {profileData.data?.contact || "Contact not available"}
                    </Typography>
                  </Box>

                  {/* Bio */}
                  <Box sx={{ marginBottom: "10px" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                      }}
                    >
                      {profileData.data?.bio || "Bio not available"}
                    </Typography>
                  </Box>

                  {/* Experience and Languages */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                      color: "#354c5c",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#354c5c",
                        lineHeight: "1.2rem",
                        marginRight: "10px",
                      }}
                    >
                      {profileData.data?.experience || 0} years of experience
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#354c5c",
                        lineHeight: "1.2rem",
                      }}
                    >
                      |
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#354c5c",
                        lineHeight: "1.2rem",
                        marginLeft: "10px",
                      }}
                    >
                      Speaks{" "}
                      {profileData.data?.languagesSpoken?.length
                        ? profileData.data.languagesSpoken.join(", ")
                        : "No languages specified"}
                    </Typography>
                  </Box>

                  {/* Appointment Buttons */}
                  <Box sx={{ marginTop: "20px" }}>
                    <Button
                      onClick={openModal}
                      variant="contained"
                      sx={{
                        marginRight: "20px",
                        paddingX: "16px",
                        paddingY: "8px",
                        color: "#fff",
                        background: "#20ADA0",
                        borderRadius: "4px",
                        ":hover": {
                          bgcolor: "#20ADA0",
                          color: "white",
                        },
                      }}
                    >
                      Book a Video Appointment
                    </Button>
                    <Button
                      onClick={openModal}
                      variant="contained"
                      sx={{
                        paddingX: "16px",
                        paddingY: "8px",
                        color: "#fff",
                        background: "#20ADA0",
                        borderRadius: "4px",
                        ":hover": {
                          bgcolor: "#20ADA0",
                          color: "white",
                        },
                      }}
                    >
                      Book an In-Clinic Appointment
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Rating Section */}
              <Box
                sx={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  backgroundColor: "#ededed",
                  width: "200px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundImage: 'url("/assets/images/vector_plus.png")',
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "102px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "2rem",
                    textAlign: "center",
                    color: "black",
                    fontWeight: "normal",
                  }}
                >
                  Rating
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "3rem",
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
                    marginTop: "10px",
                  }}
                >
                  {[...Array(5)].map((_, index) => (
                    <Box
                      key={index}
                      component="img"
                      alt="Star"
                      src="/assets/images/star-fill.png"
                      sx={{
                        width: "30px",
                        height: "30px",
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
                        fontSize: "0.85rem",
                        fontWeight: "300",
                        color: "#354c5c",
                        lineHeight: "1.2rem",
                        marginBottom: "20px",
                      }}
                    >
                      {profileData.data?.username || "Doctor"} is a passionate
                      and experienced mental health professional. Completed MBBS
                      from Manipal University and post-graduation in psychiatry
                      from St John’s Medical College Bangalore.
                    </Typography>

                    {/* Gender and DOB */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginTop: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      Gender: {profileData.data?.gender || "Not specified"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      DOB: {profileData.data?.dob || "Not specified"}
                    </Typography>

                    {/* Conditions Treated */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginTop: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      Conditions Treated
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ padding: 0, listStyleType: "none" }}
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
                            fontSize: "0.8rem",
                            fontWeight: "300",
                            color: "#354c5c",
                            lineHeight: "1.2rem",
                            marginBottom: "5px",
                          }}
                        >
                          <DoneIcon
                            sx={{ fontSize: "15px", marginRight: "5px" }}
                          />
                          {condition}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    {/* Clinic Location */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box
                          sx={{
                            borderBottom: "1px solid gray",
                            paddingBottom: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#20ada0",
                              lineHeight: "1.2rem",
                              marginTop: "20px",
                              marginBottom: "10px",
                            }}
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: "300",
                              color: "#354c5c",
                              lineHeight: "1.2rem",
                            }}
                          >
                            {profileData.data?.address ||
                              "Address not available"}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Availability */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ marginBottom: "10px" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              color: "#20ada0",
                              lineHeight: "1.2rem",
                              marginTop: "20px",
                              marginBottom: "10px",
                            }}
                          >
                            Availability
                          </Typography>
                          {profileData.data?.availability?.length ? (
                            profileData.data.availability.map((slot, index) => (
                              <Box key={index} sx={{ marginBottom: "10px" }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: "0.9rem",
                                    fontWeight: "600",
                                    color: "#000",
                                    lineHeight: "1.2rem",
                                    marginBottom: "5px",
                                  }}
                                >
                                  {slot.day}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: "300",
                                    color: "#354c5c",
                                    lineHeight: "1.2rem",
                                  }}
                                >
                                  {slot.startTime} - {slot.endTime}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: "300",
                                color: "#354c5c",
                                lineHeight: "1.2rem",
                              }}
                            >
                              No Availability
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      {/* In-Clinic Visit */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ marginBottom: "10px" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              color: "#20ada0",
                              lineHeight: "1.2rem",
                              marginTop: "20px",
                              marginBottom: "10px",
                            }}
                          >
                            In-Clinic Visit
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              color: "#354c5c",
                              lineHeight: "1.2rem",
                              marginBottom: "10px",
                            }}
                          >
                            <CurrencyRupeeIcon sx={{ marginRight: "5px" }} />
                            Fee : ₹ {profileData.data?.consultationFee || "N/A"}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              color: "#354c5c",
                              lineHeight: "1.2rem",
                              marginBottom: "10px",
                            }}
                          >
                            <PaymentIcon sx={{ marginRight: "5px" }} />
                            Online Payment Available
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              color: "#354c5c",
                              lineHeight: "1.2rem",
                              marginTop: "15px",
                            }}
                          >
                            Online Audio and Video Consultation
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem",
                              fontWeight: "300",
                              color: "#354c5c",
                              lineHeight: "1.2rem",
                              marginTop: "10px",
                            }}
                          >
                            <CurrencyRupeeIcon sx={{ marginRight: "5px" }} />
                            Fee : ₹ {profileData.data?.consultationFee || "N/A"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box>
                    {/* Blog Post Content */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#20ada0",
                        lineHeight: "1.2rem",
                        marginBottom: "10px",
                      }}
                    >
                      Home Consultation
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        marginTop: "10px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: "#354c5c",
                        lineHeight: "1.2rem",
                      }}
                    >
                      Home visits available in{" "}
                      {profileData.data?.address || "your area"} only, subject
                      to doctor availability.
                    </Typography>
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
  );
};

export default DrProfile;

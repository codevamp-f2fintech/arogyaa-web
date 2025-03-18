"use client";

import { useRouter, useParams } from "next/navigation";
import React, {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useCallback,
} from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  Rating,
} from "@mui/material";
import Cookies from "js-cookie";
import StarIcon from "@mui/icons-material/Star";
import { Create } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";

import VideoCallIcon from "@mui/icons-material/VideoCall";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import BookAppointmentModal from "../../../components/common/BookAppointmentModal";
import CreateTestimonialDialog from "@/app/components/common/createTestimonialDialog";
import { fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";

interface Qualification {
  _id: string;
  name: string;
}
interface Testimonial {
  _id: string;
  patientId: {
    _id: string | string[];
    username: string;
    profilePicture?: string;
  };
  doctorId: string;
  review: string;
  rating: number;
  createdAt: string;
}
interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface ProfileData {
  data?: {
    hospitalAffiliations: any;
    _id: string;
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
    qualificationIds?: Qualification[];
  };
}

const cardStyle = {
  padding: "26px",
  borderRadius: "10px",
  height: "190px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
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

const DrProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [appointmentTabValue, setAppointmentTabValue] = useState<number>(0);
  const router = useRouter();
  const params = useParams();
  const doctorId = params?.id;
  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id; // Get the logged-in patient's ID

  // const [qualification, setQualification] = useState<string | null>(null);

  //testimonial

  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const openTestimonialDialog = () => {
    const userToken = Cookies.get("token"); // Check if user is logged in
    if (!userToken) {
      const encodedReturnUrl = encodeURIComponent(window.location.pathname); // Preserve the current URL
      router.push(`/signup?redirect=${encodedReturnUrl}`);
      return;
    }

    if (!doctorId) {
      console.error("Doctor ID is missing!");
      return;
    }

    console.log("Opening Testimonial Dialog...");
    setTestimonialDialogOpen(true);
  };

  const closeTestimonialDialog = () => setTestimonialDialogOpen(false);

  const existingReview =
    testimonials.find(
      (testimonial) => testimonial.patientId?._id === patientId
    ) || null;

  useEffect(() => {
    if (doctorId) {
      fetchProfileData();
      fetchTestimonials();
    }
  }, [doctorId]);

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
  const fetchTestimonials = useCallback(async () => {
    if (!doctorId) return;
    try {
      const response = await fetcher(
        "testimonial",
        `get-testimonial-by-doctor-id/${doctorId}`
      );
      console.log("Doctor ID:", doctorId);
      console.log("Fetched Testimonials:", response?.data);
      setTestimonials(response?.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);
  const openModal = (): void => {
    const userToken = Cookies.get("token");
    if (!userToken) {
      const encodedReturnUrl = encodeURIComponent(
        `/doctors?autoBookDoctorId=${profileData?.data?._id}`
      );
      router.push(`/signup?redirect=${encodedReturnUrl}`);
      return;
    }
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: "20px",
          paddingTop: "20px",
          marginTop: "20px",
        }}
      >
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
                    flex: 2,
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
                      "/assets/images/online-doctor-with-white-coat.png"
                    }
                    sx={{
                      width: "150px",
                      height: "150px",
                      marginLeft: "20px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "5px",
                      marginTop: "20px",
                    }}
                  />

                  {/* Doctor Information */}
                  <Box
                    sx={{
                      flex: 1,
                      marginLeft: "20px",
                      marginTop: "30px",
                      borderRadius: "30px",
                      backgroundColor: "#20ada0",
                    }}
                  >
                    {/* Username and Verified Badge */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: "2.2rem",
                        fontWeight: "bold",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {profileData.data?.username || "Doctor Name"}

                      {/* Conditionally render Verified Badge */}
                      {profileData.data?.isVerified && (
                        <>
                          <VerifiedIcon
                            sx={{
                              color: "#FFD700",
                              marginLeft: "10px",
                              fontSize: "24px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#FFD700",
                              marginLeft: "5px",
                            }}
                          >
                            Verified by Arogyaa
                          </Typography>
                        </>
                      )}
                    </Typography>
                    {/* Specialties / Tags Section */}
                    <Box
                      sx={{
                        marginTop: "2px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      {profileData.data?.tags?.length > 0 ? (
                        profileData.data.tags.map((tag, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "#fff",
                              color: "#354C5C",
                              padding: "2px 14px",
                              borderRadius: "16px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
                              transition: "transform 0.2s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "#FFC107",
                              },
                            }}
                          >
                            {tag}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: "#ddd" }}>
                          No specialties listed
                        </Typography>
                      )}
                    </Box>

                    {/* Email & Contact Section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginTop: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#fff",
                        }}
                      >
                        <EmailIcon
                          sx={{
                            fontSize: "18px",
                            color: "#FFD700",
                            marginRight: "5px",
                          }}
                        />
                        <Typography variant="body3">
                          {profileData.data?.email || "No Email"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: "1px",
                          height: "20px",
                          background: "#FFD700",
                        }}
                      ></Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "#fff",
                        }}
                      >
                        <PhoneIcon
                          sx={{
                            fontSize: "18px",
                            color: "#FFD700",
                            marginRight: "5px",
                          }}
                        />
                        <Typography variant="body3">
                          {profileData.data?.contact || "No Contact"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Hospital Affiliations */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "8px",
                        marginLeft: "10px",
                      }}
                    >
                      <LocalHospitalIcon
                        sx={{
                          fontSize: "18px",
                          color: "#FFD700",
                          marginRight: "8px",
                        }}
                      />
                      <Typography variant="body3" sx={{ color: "#fff" }}>
                        <strong>Hospital Affiliated:</strong>{" "}
                        {profileData.data?.hospitalAffiliations?.length > 0
                          ? profileData.data.hospitalAffiliations.join(", ")
                          : "No hospital affiliations"}
                      </Typography>
                    </Box>

                    {/* Bio */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "8px",
                        marginLeft: "10px",
                      }}
                    >
                      <WorkIcon
                        sx={{
                          fontSize: "18px",
                          color: "#FFD700",
                          marginRight: "8px",
                        }}
                      />
                      <Typography variant="body3" sx={{ color: "#fff" }}>
                        {profileData.data?.bio || "No bio available"}
                      </Typography>
                    </Box>

                    {/* Appointment Buttons */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        marginTop: "-30px",
                        paddingBottom: "8px",
                        gap: existingReview ? "0px" : "10px",
                        marginRight: "10px",
                      }}
                    >
                      {!existingReview && (
                        <Box
                          sx={{
                            position: "absolute",
                            right: "45px",
                            top: "70px",
                            backgroundColor: "#fff",
                            padding: "12px",
                            borderRadius: "5px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            textAlign: "center",
                            width: "200px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {/* Heading: Share Feedback */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              color: "#354C5C",
                              marginBottom: "4px",
                            }}
                          >
                            Share Your Feedback!
                          </Typography>

                          {/* Subtext */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#666",
                              fontSize: "0.85rem",
                              marginBottom: "12px",
                            }}
                          >
                            Help others by sharing your experience.
                          </Typography>

                          {/* Leave a Review Button */}
                          <Button
                            variant="contained"
                            onClick={openTestimonialDialog}
                            startIcon={
                              <Create
                                sx={{
                                  fontSize: "10px",
                                  marginLeft: "5px",
                                }}
                              />
                            }
                            sx={{
                              backgroundColor: "#20ADA0",
                              color: "#fff",

                              fontSize: "0.9rem",
                              fontWeight: "600",
                              paddingX: "8px",
                              paddingY: "2px",
                              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "#18a18c",
                              },
                            }}
                          >
                            Leave a Review
                          </Button>
                        </Box>
                      )}

                      <Button
                        onClick={openModal}
                        variant="contained"
                        startIcon={<EventIcon sx={{ fontSize: "20px" }} />}
                        sx={{
                          paddingX: "22px",
                          paddingY: "1px",
                          color: "#20ADA0",
                          background: "#fff",
                          marginTop: "20px",

                          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                          fontSize: "1rem",
                          textTransform: "none",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": { backgroundColor: "#f5f7fa" },
                        }}
                      >
                        Book Appointment
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Rating Section */}
                {existingReview && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "70px",
                      right: "45px",
                      backgroundColor: "#f8f9fa",
                      width: "200px",
                      padding: "12px",
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
                        fontSize: "1.3rem",
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
                        color: "#20ADA0",
                        fontWeight: "bold",
                      }}
                    >
                      {existingReview.rating}/5
                    </Typography>
                    <Rating
                      value={Number(existingReview.rating)}
                      readOnly
                      precision={0.1}
                    />
                  </Box>
                )}
                <BookAppointmentModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={profileData?.data}
                />
                <CreateTestimonialDialog
                  open={testimonialDialogOpen}
                  onClose={closeTestimonialDialog}
                  doctorId={doctorId}
                  doctorName={profileData?.data?.username || "Unknown"}
                  fetchTestimonials={fetchTestimonials}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={8} md={8}>
              <Box
                sx={{
                  width: "100%",
                  background: "white",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
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
                      height: "48px",
                      "&.Mui-selected": {
                        backgroundColor: "#fff",
                        color: "#20ada0",
                        borderLeft: "1px solid #20ada0",
                        borderRight: "1px solid #20ada0",
                        borderTop: "1px solid #20ada0",
                      },
                    },
                    height: "48px",
                  }}
                >
                  <Tab label="Profile" />
                  <Tab label="Clinic" />
                  <Tab label="Blog Post" />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
                  {tabValue === 0 && (
                    <Box sx={{ height: "100%" }}>
                      {/* Profile Information */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "200",
                          lineHeight: "1.6rem",
                          marginBottom: "20px",
                        }}
                      >
                        Meet{" "}
                        <span style={{ color: "#20ADA0", fontWeight: "600" }}>
                          {profileData.data?.username || "Dr. [Name]"}
                        </span>
                        , a highly skilled and{" "}
                        <span style={{ fontWeight: "500", color: "#20ADA0" }}>
                          {profileData.data?.experience || "N/A"}+ years
                        </span>{" "}
                        experienced medical professional, specializing in{" "}
                        <span style={{ fontWeight: "600", color: "#20ADA0" }}>
                          {profileData.data?.specializationIds &&
                          profileData.data.specializationIds.length > 0
                            ? profileData.data.specializationIds
                                .map(
                                  (spec) =>
                                    spec.name || "Unnamed Specialization"
                                )
                                .join(", ")
                            : "various medical fields"}
                        </span>
                        . Dedicated to providing top-tier healthcare,{" "}
                        <span style={{ color: "#20ADA0", fontWeight: "600" }}>
                          {profileData.data?.username || "Dr. [Name]"}
                        </span>{" "}
                        is known for expertise in{" "}
                        <span style={{ fontWeight: "600", color: "#20ADA0" }}>
                          {profileData.data?.bio ||
                            "advanced medical care and patient well-being"}
                          .
                        </span>
                      </Typography>

                      {/* Qualification Section */}
                      <Box sx={{ marginTop: "15px" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            color: "#354C5C",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <VerifiedIcon
                            sx={{
                              color: "#20ADA0",
                              fontSize: "20px",
                              marginRight: "5px",
                            }}
                          />
                          Qualifications:
                        </Typography>

                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                        >
                          {profileData.data?.qualificationIds &&
                          profileData.data.qualificationIds.length > 0 ? (
                            profileData.data.qualificationIds.map(
                              (qual, index) => (
                                <Typography
                                  key={index}
                                  variant="body2"
                                  sx={{
                                    backgroundColor: "#FFD700",
                                    color: "#354C5C",
                                    padding: "1px 10px",
                                    borderRadius: "20px",
                                    fontSize: "0.9rem",
                                    fontWeight: "500",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  {qual?.name || "Unnamed Qualification"}
                                </Typography>
                              )
                            )
                          ) : (
                            <Typography variant="body2" sx={{ color: "#888" }}>
                              Qualifications not available
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Symptoms Treated Section */}
                      <Box sx={{ marginTop: "20px" }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            color: "#354C5C",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <LocalHospitalIcon
                            sx={{
                              color: "#20ADA0",
                              fontSize: "20px",
                              marginRight: "5px",
                            }}
                          />
                          Common Symptoms Treated:
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          {profileData.data?.symptomIds &&
                          profileData.data.symptomIds.length > 0 ? (
                            profileData.data.symptomIds.map(
                              (symptom, index) => (
                                <Typography
                                  key={index}
                                  variant="body2"
                                  sx={{
                                    backgroundColor: "#20ADA0",
                                    color: "#fff",
                                    padding: "2px 12px",
                                    borderRadius: "20px",
                                    fontSize: "0.9rem",
                                    fontWeight: "500",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  {symptom.name || "Unnamed Symptom"}
                                </Typography>
                              )
                            )
                          ) : (
                            <Typography variant="body2" sx={{ color: "#888" }}>
                              No specific symptoms listed
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginTop: "5px",
                        }}
                      >
                        If you are experiencing any of the symptoms mentioned
                        above, it is recommended to seek professional advice.
                        Schedule a consultation today to receive expert medical
                        guidance.
                      </Typography>
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box sx={{ height: "100%" }}>
                      <Grid container spacing={4}>
                        {/* Clinic Location */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={cardStyle}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "1.1rem",
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
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                color: "#20ada0",
                                marginBottom: "10px",
                              }}
                            >
                              Availability
                            </Typography>
                            {profileData.data?.availability?.length ? (
                              profileData.data.availability.map(
                                (slot, index) => (
                                  <Box
                                    key={index}
                                    sx={{ marginBottom: "10px" }}
                                  >
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
                                )
                              )
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
                                fontSize: "1.1rem",
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
                              Fee: ₹{" "}
                              {profileData.data?.consultationFee || "N/A"}
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
                    <Box sx={{ height: "100%" }}>
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
                  <Tab label="Video Consultation" />
                  <Tab
                    label="Clinic Consultation"
                    onClick={(e) => handleClinicTabClick(e, 1)}
                  />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  {appointmentTabValue === 0 && (
                    <Box sx={{ textAlign: "center" }}>
                      <VideoCallIcon
                        sx={{
                          fontSize: "40px",
                          color: "#20ADA0",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#20ADA0",
                          marginBottom: "8px",
                        }}
                      >
                        <Button
                          onClick={openModal}
                          variant="contained"
                          startIcon={
                            <VideoCallIcon sx={{ fontSize: "20px" }} />
                          }
                          sx={{
                            marginRight: "10px",
                            paddingX: "10px",
                            paddingY: "2px",
                            color: "#fff",
                            background: "#20ADA0",
                            borderRadius: "8px",
                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                            fontSize: "1rem",
                            textTransform: "none",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                        >
                          Book Online Appointment
                        </Button>
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "400",
                          color: "#555",
                          marginBottom: "15px",
                        }}
                      >
                        Get expert medical advice from the comfort of your home.
                      </Typography>

                      {/* Available Slots */}
                      <Box
                        component="ul"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          padding: 0,
                          listStyleType: "none",
                          justifyContent: "center",
                        }}
                      >
                        {profileData.data?.availability?.map((slot, index) => (
                          <Box
                            key={index}
                            component="li"
                            sx={{
                              marginTop: "10px",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              color: "#20ADA0",
                              padding: "6px 14px",
                              border: "1px solid #20ADA0",
                              borderRadius: "20px",
                              marginRight: "10px",
                              cursor: "pointer",
                              backgroundColor: "#fff",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "#20ADA0",
                                color: "#fff",
                              },
                            }}
                          >
                            {slot.startTime} - {slot.endTime}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* CLINIC VISIT SECTION */}
                  {appointmentTabValue === 1 && (
                    <Box sx={{ textAlign: "center" }}>
                      <LocalHospitalIcon
                        sx={{
                          fontSize: "30px",
                          color: "#20ADA0",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#20ADA0",
                          marginBottom: "2px",
                        }}
                      >
                        <Button
                          onClick={openModal}
                          variant="contained"
                          startIcon={<EventIcon sx={{ fontSize: "20px" }} />}
                          sx={{
                            marginRight: "1px",
                            paddingX: "10px",
                            paddingY: "2px",
                            color: "#fff",
                            background: "#20ADA0",
                            borderRadius: "8px",
                            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                            fontSize: "1rem",
                            textTransform: "none",
                            transition: "transform 0.2s, box-shadow 0.2s",
                          }}
                        >
                          Book In-Person Appointment
                        </Button>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "400",
                          color: "#555",
                          marginBottom: "15px",
                        }}
                      >
                        Meet the doctor in person at the clinic for a physical
                        examination.
                      </Typography>

                      {/* Clinic Address */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#000",
                          marginBottom: "10px",
                        }}
                      >
                        {profileData.data?.address ||
                          "Clinic address not available"}
                      </Typography>

                      {/* Available Slots */}
                      <Box
                        component="ul"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          padding: 0,
                          listStyleType: "none",
                          justifyContent: "center",
                        }}
                      >
                        {profileData.data?.availability?.map((slot, index) => (
                          <Box
                            key={index}
                            component="li"
                            sx={{
                              marginTop: "10px",
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              color: "#20ADA0",
                              padding: "6px 14px",
                              border: "1px solid #20ADA0",
                              borderRadius: "20px",
                              marginRight: "10px",
                              cursor: "pointer",
                              backgroundColor: "#fff",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "#20ADA0",
                                color: "#fff",
                              },
                            }}
                          >
                            {slot.startTime} - {slot.endTime}
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

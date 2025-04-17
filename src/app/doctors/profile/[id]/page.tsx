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
import { articles } from "@/static-data";
import PaymentIcon from "@mui/icons-material/Payment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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

  // const handleClinicTabClick = (
  //   event: MouseEvent<HTMLButtonElement>,
  //   newValue: number
  // ): void => {
  //   setAppointmentTabValue(newValue);
  //   setTabValue(1);
  // };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: "20px",
          paddingTop: "20px",
          marginTop: "20px",
          background: "rgb(175,159,219)",
          background:
            "linear-gradient(180deg, rgba(175,159,219,1) 0%, rgba(190,176,225,1) 100%)",
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
                  marginTop: "50px",
                  position: "relative",
                  border: "1px solid green",
                  backgroundColor: "#29175e",
                  borderRadius: "0 !important",
                }}
              >
                {/* Doctor Details */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flex: 2,
                    backgroundColor: "#29175e",
                    alignItems: "center",
                    borderRadius: "0 !important",
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
                      borderRadius: "0",
                      backgroundColor: "transparent",
                    }}
                  >
                    {/* Username and Verified Badge */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: "2.2rem",
                        fontWeight: "700",
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
                              color: "#2ECC71",
                              marginLeft: "10px",
                              fontSize: "24px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#2ECC71",
                              marginLeft: "5px",
                            }}
                          >
                            Verified
                          </Typography>
                        </>
                      )}
                    </Typography>
                    {/* Specialties / Tags Section */}
                    <Box
                      sx={{
                        marginTop: "4px",
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginLeft: "10px",
                      }}
                    >
                      {/* LocalOfferIcon added here */}

                      {profileData.data?.tags?.length > 0 ? (
                        profileData.data.tags.map((tag, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "#2ECC71",
                              color: "#f2f2f2",
                              padding: "2px 7px",
                              borderRadius: "16px",
                              fontSize: "12px",
                            }}
                          >
                            <LocalOfferIcon
                              sx={{
                                fontSize: "16px",
                                marginRight: "6px",
                              }}
                            />{" "}
                            {/* Tag Icon */}
                            <Typography variant="body2">{tag}</Typography>
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
                            color: "#2ECC71",
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
                          background: "#fff",
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
                            color: "#2ECC71",
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
                          color: "#2ECC71",
                          marginRight: "8px",
                        }}
                      />
                      <Typography variant="body3" sx={{ color: "#fff" }}>
                        {profileData.data?.availability?.length > 0 ? (
                          <span
                            style={{
                              display: "inline-block",
                              whiteSpace: "normal",
                            }}
                          >
                            {profileData.data.availability
                              .map(
                                (slot) =>
                                  `${
                                    slot.hospital?.name || "Unknown Hospital"
                                  }, ${
                                    slot.hospital?.location ||
                                    "Unknown Location"
                                  }`
                              )
                              .join(" || ")}
                          </span>
                        ) : (
                          "No hospital affiliations"
                        )}
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
                          color: "#2ECC71",
                          marginRight: "8px",
                        }}
                      />
                      <Typography
                        variant="body3"
                        sx={{
                          color: "#fff",
                          maxWidth: "70%",
                          fontFamily: "Poppins !importaant",
                        }}
                      >
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
                            backgroundColor: "#b497d6",
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
                              color: "#29175e",
                              marginBottom: "4px",
                            }}
                          >
                            Share Your Feedback!
                          </Typography>

                          {/* Subtext */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#29175e",
                              fontSize: ".9rem",
                              fontWeight: "600",
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
                              backgroundColor: "#29175e",
                              color: "#fff",

                              fontSize: "0.9rem",
                              fontWeight: "600",
                              paddingX: "8px",
                              paddingY: "2px",
                              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: "#56428b",
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
                          color: "#29175e",
                          background: "#b497d6",
                          marginTop: "20px",
                          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                          fontSize: "1rem",
                          textTransform: "none",
                          transition:
                            "transform 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s", // Added transition for color and background-color
                          "&:hover": {
                            backgroundColor: "#56428b",
                            color: "#fff",
                            transform: "scale(1.05)", // Optional: Slight scale-up effect on hover for a smooth zoom effect
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)", // Optional: stronger shadow on hover for depth
                          },
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
                    backgroundColor: "#b497d6 !important",
                    color: "#fff",
                    "& .MuiTabs-indicator": { display: "none" },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      backgroundColor: "#b497d6",
                      color: "#fff",
                      height: "48px",
                      "&.Mui-selected": {
                        backgroundColor: "#29175e",
                        color: "#fff",
                        borderLeft: "1px solid #2ecc71",
                        borderRight: "1px solid #2ecc71",
                        borderTop: "1px solid #2ecc71",
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
                <Box
                  sx={{
                    p: 3,
                    flex: 1,
                    overflowY: "auto",
                    background: "#29175e",
                  }}
                >
                  {tabValue === 0 && (
                    <Box sx={{ height: "100%" }}>
                      {/* Profile Information */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "400",
                          lineHeight: "1.6rem",
                          marginBottom: "20px",
                        }}
                      >
                        Meet{" "}
                        <span
                          style={{
                            color: "	#2ECC71",
                            textDecoration: "underline",
                            fontWeight: "600",
                          }}
                        >
                          {profileData.data?.username || "Dr. [Name]"}
                        </span>
                        , a highly skilled and{" "}
                        <span
                          style={{
                            fontWeight: "500",
                            color: "	#2ECC71",
                            textDecoration: "underline",
                          }}
                        >
                          {profileData.data?.experience || "N/A"} years
                        </span>{" "}
                        experienced medical professional, specializing in{" "}
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#2ECC71",
                            textDecoration: "underline",
                          }}
                        >
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
                        <span
                          style={{
                            color: "#2ECC71",
                            textDecoration: "underline",
                            fontWeight: "600",
                          }}
                        >
                          {profileData.data?.username || "Dr. [Name]"}
                        </span>{" "}
                        is known for expertise in{" "}
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#2ECC71",
                            textDecoration: "underline",
                          }}
                        >
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
                            fontWeight: "550",
                            color: "#fff",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <SchoolIcon
                            sx={{
                              color: "#2ECC71",
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
                                    backgroundColor: "#2ECC71",
                                    color: "#f2f2f2",
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
                            fontWeight: "550",
                            color: "#fff",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <LocalHospitalIcon
                            sx={{
                              color: "#2ECC71",
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
                                    backgroundColor: "#2ECC71",
                                    color: "#f2f2f2",
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
                          color: "#fff",
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
                        <Grid item xs={12} sm={4} md={4}>
                          <Box
                            sx={{
                              ...cardStyle,
                              padding: "16px",
                              borderRadius: "0",
                              backgroundColor: "#29175e",
                              boxShadow: "0 5px 100px rgba(46,204,113,0.5)",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                color: "#2ecc71",
                                marginBottom: "12px",
                              }}
                            >
                              Address
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <LocationOnIcon
                                fontSize="small"
                                color="primary"
                                sx={{ marginRight: "4px", color: "#2ecc71" }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "0.9rem",
                                  fontWeight: 500,
                                  color: "#fff",
                                }}
                              >
                                {profileData.data?.clinicAddress ||
                                  "Address not available"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        {/* Availability */}
                        <Grid item xs={12} sm={4} md={4}>
                          <Box
                            sx={{
                              ...cardStyle,
                              padding: "16px",
                              ...cardStyle,
                              padding: "16px",
                              borderRadius: "0",
                              backgroundColor: "#29175e",
                              boxShadow: "0 5px 100px rgba(46,204,113,0.5)",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                color: "#2ecc71",
                                marginBottom: "12px",
                              }}
                            >
                              Availability
                            </Typography>

                            {profileData.data?.availability?.length ? (
                              profileData.data.availability.map(
                                (slot, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      padding: "8px",
                                      borderRadius: "8px",
                                      backgroundColor: "transparent",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    {/* Day with Calendar Icon */}
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                      sx={{ marginBottom: "4px" }}
                                    >
                                      <CalendarTodayIcon
                                        fontSize="small"
                                        sx={{ color: "#2ecc71" }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontSize: "0.9rem",
                                          fontWeight: "500",
                                          color: "#fff",
                                        }}
                                      >
                                        {slot.day}
                                      </Typography>
                                    </Box>

                                    {/* Time with Clock Icon */}
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <AccessTimeIcon
                                        fontSize="small"
                                        sx={{ color: "#2ecc71" }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontSize: "0.85rem",
                                          fontWeight: "400",
                                          color: "#fff",
                                        }}
                                      >
                                        {slot.startTime} - {slot.endTime}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )
                              )
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "0.85rem",
                                  fontWeight: "400",
                                  color: "#354c5c",
                                }}
                              >
                                No Availability
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        {/* In-Clinic Visit */}
                        <Grid item xs={12} sm={4} md={4}>
                          <Box
                            sx={{
                              ...cardStyle,
                              padding: "16px",
                              padding: "16px",
                              borderRadius: "0",
                              backgroundColor: "#29175e",
                              boxShadow: "0 5px 100px rgba(46,204,113,0.5)",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                color: "#2ecc71",
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
                                color: "#fff",
                                marginBottom: "10px",
                              }}
                            >
                              <CurrencyRupeeIcon
                                sx={{ marginRight: "5px", color: "#2ecc71" }}
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
                                color: "#fff",
                              }}
                            >
                              <PaymentIcon
                                sx={{ marginRight: "5px", color: "#2ecc71" }}
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
                        }}
                      >
                        {/* <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            color: "#20ada0",
                            marginBottom: "10px",
                            marginLeft: "11px",
                          }}
                        >
                          Blog Post
                        </Typography> */}

                        {/* Filter and Display Articles based on Doctor's Tags */}
                        {articles
                          .filter((article) =>
                            profileData.data?.tags?.some((tag) =>
                              article.tags.some((articleTag) =>
                                articleTag
                                  .toLowerCase()
                                  .includes(tag.toLowerCase())
                              )
                            )
                          )
                          .map((article, index) => (
                            <Box
                              key={index}
                              sx={{
                                marginTop: "15px",
                                padding: "12px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#f9f9f9",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontSize: "1.6rem",
                                  fontWeight: "600",
                                  color: "#20ada0",
                                }}
                              >
                                {article.title}:
                              </Typography>

                              <Typography
                                variant="body1"
                                sx={{
                                  marginTop: "10px",
                                  fontSize: "1rem",
                                  color: "#666",
                                  lineHeight: "1.6rem",
                                }}
                              >
                                {article.Content}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <Box
                sx={{ width: "100%", background: "white", borderRadius: "8px" }}
              >
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
                      backgroundColor: "#b497d6",
                      color: "#fff",
                      "&.Mui-selected": {
                        backgroundColor: "#29175e",
                        color: "#fff",
                        borderLeft: "1px solid #20ADA0",
                        borderRight: "1px solid #20ADA0",
                        borderTop: "1px solid #20ADA0",
                      },
                    },
                  }}
                >
                  <Tab label="Video Consultation" />
                  <Tab label="Clinic Consultation" />
                </Tabs>

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#29175e",
                  }}
                >
                  {appointmentTabValue === 0 && (
                    <Box sx={{ textAlign: "center" }}>
                      <VideoCallIcon
                        sx={{
                          fontSize: "40px",
                          color: "#2ecc71",
                          marginBottom: "10px",
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "red",
                          marginBottom: "8px",
                        }}
                      >
                        <Button
                          onClick={openModal}
                          variant="contained"
                          startIcon={
                            <VideoCallIcon
                              sx={{ fontSize: "20px", color: "#2ecc71" }}
                            />
                          }
                          sx={{
                            marginRight: "10px",
                            paddingX: "12px",
                            paddingY: "1px",
                            color: "#fff",
                            background: "#29175e",
                            borderRadius: "0px",
                            boxShadow: "0 4px 30px rgba(46,204,113,0.5)",
                            fontSize: "1rem",
                            textTransform: "none",
                            transition:
                              "transform 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s",
                            "&:hover": {
                              backgroundColor: "#29175e",
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 30px rgba(46,204,113,0.5)",
                            },
                          }}
                        >
                          Book Online Appointment
                        </Button>
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "450",
                          color: "#fff",
                          marginBottom: "15px",
                        }}
                      >
                        Get expert medical advice from the comfort of your home.
                      </Typography>

                      {/* Available Slots with Day & Time INLINE */}
                      <Box
                        sx={{
                          padding: "15px",
                          backgroundColor: "#29175e",
                          boxShadow: "0 4px 30px rgba(46,204,113,0.5)",
                          color: "#fff",
                          borderRadius: "0px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                        >
                          Availability Slots
                        </Typography>

                        <Box
                          component="ul"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 0,
                            listStyleType: "none",
                            gap: "5px",
                          }}
                        >
                          {profileData.data?.availability?.map(
                            (slot, index) => (
                              <Box
                                key={index}
                                component="li"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "4px 16px",
                                  backgroundColor: "#29175e",
                                  color: "",
                                  fontSize: "1rem",
                                  fontWeight: "500",

                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    backgroundColor: "#29175e",
                                    color: "#fff",
                                    "& svg": { color: "#2ecc71" },
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <AccessTimeIcon
                                    fontSize="small"
                                    sx={{ color: "#2ecc71" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "1rem" }}
                                  >
                                    {slot.day} :
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    textAlign: "right", // Align time to the right for better visual separation
                                  }}
                                >
                                  {slot.startTime} - {slot.endTime}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {/* CLINIC VISIT SECTION */}
                  {appointmentTabValue === 1 && (
                    <Box sx={{ textAlign: "center" }}>
                      <LocalHospitalIcon
                        sx={{
                          fontSize: "30px",
                          color: "#2ecc71",
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
                          startIcon={
                            <LocalHospitalIcon
                              sx={{ fontSize: "0px", color: "#2ecc71" }}
                            />
                          }
                          sx={{
                            marginRight: "10px",
                            paddingX: "12px",
                            paddingY: "1px",
                            color: "#fff",
                            background: "#29175e",
                            borderRadius: "0px",
                            boxShadow: "0 4px 30px rgba(46,204,113,0.5)",
                            fontSize: "1rem",
                            textTransform: "none",
                            transition:
                              "transform 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s",
                            "&:hover": {
                              backgroundColor: "#29175e",
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 30px rgba(46,204,113,0.5)",
                            },
                          }}
                        >
                          Book In-Person Appointment
                        </Button>
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "450",
                          color: "#fff",
                          marginBottom: "15px",
                          marginTop: "7px",
                        }}
                      >
                        Meet the doctor in person at the clinic for a physical
                        examination.
                      </Typography>

                      {/* Clinic Address */}
                      {/* <Typography
            variant="body2"
            sx={{ fontSize: "0.9rem", fontWeight: "600", color: "#000", marginBottom: "10px" }}
          >
            {profileData.data?.clinicAddress || "Clinic address not available"}
          </Typography> */}

                      {/* Available Slots with Day & Time INLINE */}
                      <Box
                        sx={{
                          padding: "15px",
                          backgroundColor: "#29175e",
                          boxShadow: "0 4px 30px rgba(46,204,113,0.5)",
                          color: "#fff",
                          borderRadius: "0px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginBottom: "4px",
                          }}
                        >
                          Availability Slots
                        </Typography>

                        <Box
                          component="ul"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 0,
                            listStyleType: "none",
                            gap: "5px",
                          }}
                        >
                          {profileData.data?.availability?.map(
                            (slot, index) => (
                              <Box
                                key={index}
                                component="li"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "4px 16px",
                                  backgroundColor: "#29175e",
                                  color: "#fff",
                                  fontSize: "1rem",
                                  fontWeight: "500",

                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    backgroundColor: "#29175e",
                                    color: "#fff",
                                    "& svg": { color: "#2ecc71" },
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <AccessTimeIcon
                                    fontSize="small"
                                    sx={{ color: "#2ecc71" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: "1rem" }}
                                  >
                                    {slot.day} :
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    textAlign: "right", // Align time to the right for better visual separation
                                  }}
                                >
                                  {slot.startTime} - {slot.endTime}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
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

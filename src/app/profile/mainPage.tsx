"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import {
  MonitorWeight,
  Straighten,
  Event as EventIcon,
} from "@mui/icons-material";
import type { AppDispatch, RootState } from "@/redux/store";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EditIcon from "@mui/icons-material/Edit";
import WcIcon from "@mui/icons-material/Wc";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import HealingIcon from "@mui/icons-material/Healing";
import MedicationIcon from "@mui/icons-material/Medication";
import { Cancel } from "@mui/icons-material";

import { Utility } from "@/utils";
import { fetcher, modifier } from "@/apis/apiClient";
import type { PatientData } from "@/types/patient";

import AppointmentHistory from "../components/appointment-history";
import TestHistory from "../components/Test-history";
import BillingHistory from "../components/Billing-history";
import TreatmentHistory from "../components/Treatment-history";
import SnackbarComponent from "../components/common/Snackbar";
import { color } from "framer-motion";
import { useSession } from "next-auth/react";

interface Appointment {
  hospitalName: string;
  _id: string;
  appointmentDate: string;
  appointmentTime: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<PatientData>();
  const { data: session } = useSession();

  const [profilePicture, setProfilePicture] = useState<string | File>(
    "/iconimg.jpg"
  );
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [isModified, setIsModified] = useState(false);
  const { decodedToken, snackbarAndNavigate } = Utility();
  const patientId = decodedToken()?.id;
  const [activeView, setActiveView] = useState<
    "appointments" | "tests" | "billings" | "treatments"
  >(() => {
    return (
      (view as "appointments" | "tests" | "billings" | "treatments") ||
      "appointments"
    );
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { snackbar } = useSelector((state: RootState) => state.snackbar);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValues(user || {});
  };

  const currentDate = new Date();

  const nextVisit = useMemo(() => {
    return (
      appointments
        .filter(
          (appointment) => new Date(appointment.appointmentDate) >= currentDate
        )
        .sort(
          (a, b) =>
            new Date(a.appointmentDate).getTime() -
            new Date(b.appointmentDate).getTime()
        )[0] || null
    );
  }, [appointments]);

  const previousVisit = useMemo(() => {
    return (
      appointments
        .filter(
          (appointment) => new Date(appointment.appointmentDate) < currentDate
        )
        .sort(
          (a, b) =>
            new Date(b.appointmentDate).getTime() -
            new Date(a.appointmentDate).getTime()
        )[0] || null
    );
  }, [appointments]);

  const quickActions = [
    { icon: CalendarTodayIcon, label: "Appointments", value: "appointments" },
    { icon: FolderIcon, label: "Tests", value: "tests" },
    { icon: CheckCircleIcon, label: "Treatments", value: "treatments" },
    { icon: CurrencyRupeeIcon, label: "Billings", value: "billings" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
      setProfilePicture(file);
      setIsModified(true);
    }
  };

  const fetchUserProfile = useCallback(async () => {
    if (patientId) {
      try {
        const { data: response } = await fetcher(
          "patient",
          `get-patient-by-id/${patientId}`
        );
        setUser(response);
        setEditValues(response || {});
        if (response?.profilePicture) {
          setProfilePicture(response.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    }
  }, [patientId]);

  const fetchUserProfileByEmail = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await fetcher(
          "patient",
          `get-patient-by-email/${session.user.email}`
        );

        setUser(response.data); // Set the fetched user data
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserProfileByEmail(); // Fetch user profile by email on initial load
    }
  }, [session, fetchUserProfile]);

  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    if (patientId) {
      try {
        console.log("Fetching appointments for patient ID:", patientId);
        const response = await fetcher(
          "appointment",
          `get-patients-appointment/${patientId}?page=1`
        );

        if (!response) {
          throw new Error("No response from the API");
        }
        setAppointments(response.results || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    }
  }, [patientId]);

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;
    // Contact validation
    if (!editValues.contact) {
      newErrors.contact = "Contact is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(editValues.contact)) {
      newErrors.contact = "Contact must be 10 digits long.";
      isValid = false;
    }
    // Email validation
    if (!editValues.email) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(editValues.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const updateUserProfile = useCallback(async () => {
    if (!patientId || !isModified) return;

    const isValid = validateForm();
    if (!isValid) return;

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await modifier(
        "patient",
        "update-patient",
        {
          _id: patientId,
          ...editValues,
          profilePicture,
        },
        {
          ...headers,
        }
      );

      if (!response || response.error) {
        throw new Error(response?.error || "No response from the API");
      }

      snackbarAndNavigate(
        dispatch,
        true,
        "success",
        "Profile updated successfully!"
      );

      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...editValues, profilePicture } : prevUser
      );

      setIsEditing(false);
      setIsModified(false);
    } catch (error) {
      console.error("Error updating patient profile:", error);
      snackbarAndNavigate(
        dispatch,
        true,
        "error",
        "Error updating profile. Please try again."
      );
    }
  }, [patientId, editValues, profilePicture, dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setEditValues((prevValues) => ({ ...prevValues, [field]: value }));
    setIsModified(true);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  React.useEffect(() => {
    fetchUserProfile();
    fetchAppointments();
  }, [fetchUserProfile, fetchAppointments]);

  const CustomMenuItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
        "& .MuiTypography-root": {
          color: activeView === value ? "#29175e" : "#29175e",
          fontWeight: activeView === value ? "550" : "570",
          fontFamily: activeView === value ? "Poppins" : "Poppins",
        },
        "& .MuiSvgIcon-root": {
          color: activeView === value ? "#29175e" : "#B497D6",
        },
      }}
      onClick={() => setActiveView(value as typeof activeView)}
    >
      <Icon sx={{ fontSize: "2rem", mb: 1 }} />
      <Typography variant="body2">{label}</Typography>
    </Paper>
  );

  if (!user) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    );
  }

  return (
    <Box
      sx={{
        marginTop: "50px",
        maxHeight: {
          xs: "auto",
          md: "700px",
          sm: "700px",
        },
        padding: "1.5rem",
        width: "100vw",
        background:
          "linear-gradient(180deg, rgba(175,159,219,1) 0%, rgba(190,176,225,1) 100%)",
        overflowY: "auto",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          flexWrap: {
            xs: "",
            md: "nowrap",
          },
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",

            alignItems: "center",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%)",
              p: { xs: 1, sm: 2 },
              borderRadius: "16px",
              overflowY: "auto", // Ensures scrolling when content overflows vertically
              height: "87vh", // Set the height limit for the Box
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              textAlign: "center",
              width: "100%",
              maxWidth: "450px",
              position: "relative",
            }}
          >
            {/* Edit Button */}
            {!isEditing && (
              <IconButton
                onClick={toggleEditMode}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "white",
                  backgroundColor: "#7A4D9C",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  fontFamily: "Poppins",
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#5e3a78",
                  },
                }}
              >
                Edit
                <EditIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            )}

            {/* Profile Picture */}
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Box
                sx={{
                  width: { xs: "110px", sm: "130px" },
                  height: { xs: "110px", sm: "130px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "4px solid #ffffff",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  marginTop: "15px",
                  mx: "auto",
                }}
              >
                <Box
                  component="img"
                  src={imagePreview || profilePicture}
                  alt="Profile Image"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {isEditing && (
                <IconButton
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    background: "white",
                    boxShadow: 2,
                    borderRadius: "50%",
                    padding: "5px",
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Username */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              {isEditing ? (
                <TextField
                  variant="outlined"
                  size="small"
                  value={editValues.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  sx={{
                    width: { xs: "70%", sm: "50%" },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      fontSize: ".9rem",
                      fontWeight: "500",
                      fontFamily: "Poppins",
                      color: "#000",
                      padding: "8px 16px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "600",
                    color: "#ffffff",
                    fontFamily: "Poppins",
                    mb: 0.5,
                    textTransform: "lowercase",
                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
                  }}
                >
                  {user?.username || "N/A"}
                </Typography>
              )}
            </Box>

            {/* Personal Information Section */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: "600",
                fontFamily: "Poppins",
                color: "#ffffff",
                mb: 2,
                fontSize: { xs: "1.1rem", sm: "1.2rem" },
              }}
            >
              Personal Information
            </Typography>

            {/* Information Fields */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                width: "100%",
                px: { xs: 1, sm: 2 },
                "& .css-1n4twyu-MuiInputBase-input-MuiOutlinedInput-input": {
                  color: "#000",
                },
              }}
            >
              {[
                {
                  icon: <PhoneIcon sx={{ color: "#ffffff" }} />,
                  label: "Contact",
                  key: "contact",
                },
                {
                  icon: <EmailIcon sx={{ color: "#ffffff" }} />,
                  label: "Email",
                  key: "email",
                },
                {
                  icon: <WcIcon sx={{ color: "#ffffff" }} />,
                  label: "Gender",
                  key: "gender",
                },
                {
                  icon: <CalendarMonthIcon sx={{ color: "#ffffff" }} />,
                  label: "Age",
                  key: "age",
                },
                {
                  icon: <Straighten sx={{ color: "#ffffff" }} />,
                  label: "Height",
                  key: "height",
                },
                {
                  icon: <MonitorWeight sx={{ color: "#ffffff" }} />,
                  label: "Weight",
                  key: "weight",
                },
                {
                  icon: <LocationOnIcon sx={{ color: "#ffffff" }} />,
                  label: "Address",
                  key: "address",
                },
                {
                  icon: <FavoriteIcon sx={{ color: "#ffffff" }} />,
                  label: "Blood Group",
                  key: "bloodGroup",
                },
                {
                  icon: <MedicalInformationIcon sx={{ color: "#ffffff" }} />,
                  label: "Medical History",
                  key: "medicalHistory",
                },
                {
                  icon: <HealingIcon sx={{ color: "#ffffff" }} />,
                  label: "Allergies",
                  key: "allergies",
                },
                {
                  icon: <MedicationIcon sx={{ color: "#ffffff" }} />,
                  label: "Current Medication",
                  key: "currentMedication",
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: "50px",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                    width: "100%",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#aaa", // border on hover
                    },
                    "& fieldset": {
                      borderColor: "#aaa",
                      borderRadius: "25px",
                    },
                    "&:hover fieldset": {
                      borderColor: "red", // Border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "red", // Border color when focused
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#B497D6",
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: { color: "#29175e", fontSize: "18px" },
                      fontSize: "small",
                    })}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      minWidth: { xs: "50px", sm: "60px" },
                      color: "#56428B",
                    }}
                  >
                    {item.label}:
                  </Typography>

                  <Box
                    sx={{
                      flex: 1,
                      textAlign: "left",
                      overflow: "hidden",
                    }}
                  >
                    {isEditing ? (
                      item.key === "gender" ? (
                        <Select
                          size="small"
                          value={editValues[item.key] || ""}
                          onChange={(e) =>
                            handleInputChange(item.key, e.target.value)
                          }
                          sx={{
                            width: "100%",
                            borderRadius: "25px",

                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#aaa", // border on hover
                              borderRadius: "25px",
                            },
                            "& .MuiSelect-select": {
                              backgroundColor: "", // make selected area black
                              color: "#000", // make selected text white
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                backgroundColor: "#fff", // white dropdown background
                                color: "#000", // black text color
                                "& .MuiMenuItem-root": {
                                  color: "#000", // explicitly set black text for each menu item
                                },
                              },
                            },
                          }}
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      ) : (
                        <TextField
                          size="small"
                          value={editValues[item.key] || ""}
                          onChange={(e) =>
                            handleInputChange(item.key, e.target.value)
                          }
                          type={item.key === "email" ? "email" : "text"}
                          sx={{ width: "100%" }}
                        />
                      )
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          color: "#2C3E50",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user?.[item.key] ?? "N/A"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Save and Cancel buttons */}
            {isEditing && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  position: "relative",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  gap: 1,
                  zIndex: 10,
                  marginTop: "auto",
                  justifyContent: "center",
                  paddingTop: "5vh",
                }}
              >
                <Button
                  onClick={updateUserProfile}
                  sx={{
                    minWidth: "150px",
                    color: "#fff",
                    background: "#29175E",
                    borderRadius: "4px",
                    marginLeft: "20px",
                    textTransform: "none",
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  sx={{
                    minWidth: "150px",
                    color: "#fff",
                    background: "#29175E",
                    borderRadius: "4px",
                    marginLeft: "20px",
                    textTransform: "none",
                  }}
                  startIcon={<Cancel sx={{ fontSize: 22 }} />}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid
          sx={{
            height: "90vh",
            width: "60vw",
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
          }}
          item
          xs={12}
          md={8}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1.5, sm: 2 }, // Reduced padding on mobile for better space usage
              width: "100%", // Maintains original width
              height: "auto", // Auto height to fit content
              minHeight: { xs: "240px", sm: "260px", md: "280px" }, // Responsive minHeight
              borderRadius: "16px",
              // background: "rgb(175,159,219)",
              background: "#7b56ce",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                borderColor: "#29175e",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                ml: { xs: 2, sm: 3 }, // Slightly reduced margin-left on mobile
                color: "#fff",
                fontWeight: "700",
                fontSize: { xs: "1.125rem", sm: "1.25rem" }, // Smaller font on mobile
                position: "relative",
                fontFamily: "Poppins",
                "&::after": {
                  content: '""',
                  bottom: -8,
                  left: 0,
                  width: "40px",
                  height: "3px",
                  background: "linear-gradient(90deg, #29175e, transparent)",
                  borderRadius: "3px",
                  transition: "width 0.3s ease",
                },
                "&:hover::after": {
                  width: "80px",
                },
              }}
            >
              Quick Actions
            </Typography>

            <Grid
              container
              spacing={{ xs: 0.5, sm: 1 }} // Reduced spacing on mobile
              sx={{ justifyContent: "space-around" }}
            >
              {quickActions.map((action, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Box
                    sx={{
                      height: "100%",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <CustomMenuItem
                      icon={action.icon}
                      label={action.label}
                      value={action.value}
                      sx={{
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(245, 245, 245, 0.7)",
                        },
                        // Ensure CustomMenuItem scales properly on mobile
                        fontSize: { xs: "0.875rem", sm: "1rem" }, // Smaller text on mobile
                        padding: { xs: "8px", sm: "12px" }, // Adjust padding for mobile
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              marginTop: { xs: "10px", sm: "15px", md: "20px" }, // Responsive margin-top
              p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
              borderRadius: { xs: "12px", sm: "16px", md: "20px" }, // Slightly smaller radius on mobile
              background: "#7b56ce",
            }}
          >
            {activeView === "appointments" && <AppointmentHistory />}
            {activeView === "tests" && <TestHistory />}
            {activeView === "billings" && <BillingHistory />}
            {activeView === "treatments" && <TreatmentHistory />}
          </Paper>
        </Grid>
      </Grid>
      <SnackbarComponent
        alerting={snackbar.snackbarAlert}
        severity={snackbar.snackbarSeverity}
        message={snackbar.snackbarMessage}
      />
    </Box>
  );
};

export default UserProfile;

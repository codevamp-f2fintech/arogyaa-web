"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import WcIcon from "@mui/icons-material/Wc";

import { Utility } from "@/utils";
import { fetcher, modifier } from "@/apis/apiClient";
import { PatientData } from "@/types/patient";

import AppointmentHistory from "../components/appointment-history";
import TestHistory from "../components/Test-history";
import BillingHistory from "../components/Billing-history";
import TreatmentHistory from "../components/Treatment-history";
import SnackbarComponent from "../components/common/Snackbar";

import {
  MonitorWeight,
  Straighten,
  Event as EventIcon,
} from "@mui/icons-material";

interface Appointment {
  _id: string;
  appointmentDate: string;
  appointmentTime: string;
}
const UserProfile = () => {
  const [user, setUser] = useState<PatientData>();
  const [profilePicture, setProfilePicture] = useState("/iconimg.jpg");
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [isModified, setIsModified] = useState(false);
  const { decodedToken, snackbarAndNavigate } = Utility();
  const patientId = decodedToken()?.id;
  const [activeView, setActiveView] = useState<
    "appointments" | "tests" | "billing" | "treatment"
  >("appointments");
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
    { icon: CheckCircleIcon, label: "Treatment", value: "treatment" },
    { icon: CurrencyRupeeIcon, label: "Billing", value: "billing" },
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
        background:
          activeView === value
            ? "linear-gradient(135deg, #20ADA0 0%, #B6DADA 100%)"
            : "#fff",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
        "& .MuiTypography-root": {
          color: activeView === value ? "white" : "#2C3E50",
          fontWeight: activeView === value ? "700" : "500",
        },
        "& .MuiSvgIcon-root": {
          color: activeView === value ? "white" : "#20ADA0",
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
          background: "linear-gradient(135deg, #20ADA0 0%, #B6DADA 100%)",
        }}
      ></Box>
    );
  }

  return (
    <Box
      sx={{
        marginTop: "50px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #20ADA0 0%, #B6DADA 100%)",
        padding: "1.5rem",
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          flexWrap: "nowrap",
        }}
      >
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
              p: 0.5,
              borderRadius: "16px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Edit Button */}
            {isEditing ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  gap: 1,
                }}
              >
                <Button
                  onClick={updateUserProfile}
                  sx={{
                    backgroundColor: "#20ADA0",
                    borderRadius: "50px",
                    padding: "4px 20px",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#20ADA0",
                    },
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  sx={{
                    backgroundColor: "red",
                    borderRadius: "50px",
                    padding: "4px 20px",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <IconButton
                onClick={toggleEditMode}
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <EditIcon />
              </IconButton>
            )}
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Box
                sx={{
                  width: "130px",
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border: "3px solid #20ADA0",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
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

            <Box sx={{ textAlign: "center", mb: 1 }}>
              {isEditing ? (
                <TextField
                  variant="outlined"
                  size="small"
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    width: "50%",
                    borderRadius: "12px",
                    padding: "8px 16px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  value={editValues.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
              ) : (
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "700", color: "#2C3E50", mb: 0.5 }}
                >
                  {user?.username || "N/A"}
                </Typography>
              )}
            </Box>

            {/* User Information */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "12px",
                p: 0.3,
                my: 4,
                width: "90%",
                maxWidth: "500px",
                textAlign: "center",
                mx: "auto",
                gap: 1,
                // background: "#e8f6ff",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "600", color: "#20ADA0", mb: 1 }}
              >
                Personal Information
              </Typography>
              {[
                {
                  icon: <PhoneIcon sx={{ color: "#20ADA0" }} />,
                  label: "Contact",
                  key: "contact",
                },
                {
                  icon: <EmailIcon sx={{ color: "#20ADA0" }} />,
                  label: "Email",
                  key: "email",
                },
                {
                  icon: <WcIcon sx={{ color: "#20ADA0" }} />,
                  label: "Gender",
                  key: "gender",
                },
                {
                  icon: <CalendarMonthIcon sx={{ color: "#20ADA0" }} />,
                  label: "Age",
                  key: "age",
                },
                {
                  icon: <Straighten sx={{ color: "#20ADA0" }} />,
                  label: "Height",
                  key: "height",
                },
                {
                  icon: <MonitorWeight sx={{ color: "#20ADA0" }} />,
                  label: "Weight",
                  key: "weight",
                },
                {
                  icon: <LocationOnIcon sx={{ color: "#20ADA0" }} />,
                  label: "Address",
                  key: "address",
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 1,
                    borderRadius: "20px",
                    color: "#2C3E50",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    width: "85%",
                    maxWidth: "420px",
                    justifyContent: "space-between",
                    background: "#F1FAFA",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #20ADA0",
                    textAlign: "left",
                    transition: "0.3s ease-in-out",
                  }}
                >
                  {/* Icon and Label */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    {item.icon}
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        minWidth: "60px",
                      }}
                    >
                      {item.label}:
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 2,
                      textAlign: "left",
                      mr: 1,
                      display: "flex",
                      alignItems: "center",
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
                          error={!!errors[item.key]}
                          helperText={errors[item.key]}
                        />
                      )
                    ) : (
                      <>
                        <Typography>{user?.[item.key] ?? "N/A"}</Typography>
                        {item.key === "contact" && (
                          <IconButton
                            sx={{ ml: 8 }}
                            onClick={() => {
                              if (user?.contact) {
                                navigator.clipboard.writeText(user.contact);
                                snackbarAndNavigate(
                                  dispatch,
                                  true,
                                  "success",
                                  "Contact copied to clipboard!"
                                );
                              }
                            }}
                          >
                            <ContentCopyIcon
                              sx={{ color: "#20ADA0", fontSize: "15px" }}
                            />
                          </IconButton>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              ))}
              {/* Next Visit & Previous Visit */}
              <Box
                sx={{
                  p: 1,
                  borderRadius: "16px",
                  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
                  color: "#2C3E50",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  border: "1px solid #E0E0E0",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                  width: "90%",
                  maxWidth: "520px",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "700",
                    color: "#20ADA0",
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Visit Information
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Previous Visit */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      backgroundColor: "#F1FAFA",
                      border: "1px solid #E0E0E0",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#E6F7F2",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EventIcon sx={{ color: "#20ADA0" }} />
                      <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Previous Visit:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        color: "#2C3E50",
                      }}
                    >
                      {previousVisit
                        ? `${new Date(
                            previousVisit.appointmentDate
                          ).toLocaleDateString()} at ${
                            previousVisit.appointmentTime
                          }`
                        : "N/A"}
                    </Typography>
                  </Box>
                  {/* Next Visit */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      backgroundColor: "#F1FAFA",
                      border: "1px solid #E0E0E0",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#E6F7F2",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EventIcon sx={{ color: "#20ADA0" }} />
                      <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Next Visit:
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        color: "#2C3E50",
                      }}
                    >
                      {nextVisit
                        ? `${new Date(
                            nextVisit.appointmentDate
                          ).toLocaleDateString()} at ${
                            nextVisit.appointmentTime
                          }`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                color: "#2C3E50",
                fontWeight: "700",
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ justifyContent: "space-around" }}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <CustomMenuItem
                    icon={action.icon}
                    label={action.label}
                    value={action.value}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              marginTop: "26px",
              p: 4,
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            {activeView === "appointments" && <AppointmentHistory />}
            {activeView === "tests" && <TestHistory />}
            {activeView === "billing" && <BillingHistory />}
            {activeView === "treatment" && <TreatmentHistory />}
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

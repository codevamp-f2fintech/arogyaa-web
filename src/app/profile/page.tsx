"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Box, Typography, Grid, Paper, IconButton } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WcIcon from "@mui/icons-material/Wc";

import { Utility } from "@/utils";
import { fetcher } from "@/apis/apiClient";
import { PatientData } from "@/types/patient";

import AppointmentHistory from "../components/appointment-history";
import TestHistory from "../components/Test-history";
import BillingHistory from "../components/Billing-history";
import TreatmentHistory from "../components/Treatment-history";

import {
  MonitorWeight,
  Straighten,
  Event as EventIcon,
  HeightOutlined,
} from "@mui/icons-material";

const UserProfile = () => {
  const [user, setUser] = useState<PatientData>();
  const [profilePicture, setProfilePicture] = useState("/iconimg.jpg");
  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;
  const [activeView, setActiveView] = useState<
    "appointments" | "tests" | "billing" | "treatment"
  >("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
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
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result as string); 
        }
      };
      reader.readAsDataURL(file);
    }
  };
  interface Appointment {
    _id: string;
    appointmentDate: string;
    appointmentTime: string;
  }
  const fetchUserProfile = React.useCallback(async () => {
    if (patientId) {
      try {
        const { data: response } = await fetcher(
          "patient",
          `get-patient-by-id/${patientId}`
        );
        setUser(response);

      
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
        console.log("API Response:", response);
        if (!response || !response.results) {
          console.error("No valid data received from API.");
          setAppointments([]);
          return;
        }

        setAppointments(response.results || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    }
  }, [patientId]);

  React.useEffect(() => {
    fetchUserProfile();
    fetchAppointments();
  }, [fetchUserProfile, fetchAppointments]);

  const MenuItem = ({
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
        padding: "2rem",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
              p: 4,
              borderRadius: "16px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            {/* Profile Image */}
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Box
                component="img"
                src={profilePicture}
                alt="Profile"
                sx={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "3px solid #20ADA0",
                  objectFit: "cover",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>

            {/* User Name & Role */}
            <Typography
              variant="h5"
              sx={{ fontWeight: "700", color: "#2C3E50", mb: 0.5 }}
            >
              {user?.username || "N/A"}
            </Typography>

            {/* Personal Information Section */}
            <Box
              sx={{
                background: "#f1f8ff",
                borderRadius: "12px",
                p: 2,
                my: 2,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "600", color: "#2C3E50", mb: 1 }}
              >
                Personal Information
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 2,
                  justifyItems: "center",
                  width: "100%",
                }}
              >
                {[
                  {
                    icon: <PhoneIcon />,
                    label: "Contact",
                    value: user?.contact || "N/A",
                    isLink: false,
                  },
                  {
                    icon: <EmailIcon />,
                    label: "Email",
                    value: user?.email || "N/A",
                    isLink: `mailto:${user?.email || ""}`,
                  },
                  {
                    icon: <WcIcon />,
                    label: "Gender",
                    value: user?.gender || "N/A",
                  },
                  {
                    icon: <Straighten />,
                    label: "Height",
                    value: user?.height || "N/A",
                  },
                  {
                    icon: <MonitorWeight />,
                    label: "Weight",
                    value: user?.weight || "N/A",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 3,
                      py: 0.8,
                      borderRadius: "20px",
                      color: "#20ADA0",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      width: "80%",
                      justifyContent: "space-between",
                      border: "1px solid #20ADA0",
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
                          fontSize: "0.85rem",
                          minWidth: "100px",
                          textAlign: "left",
                        }}
                      >
                        {item.label}:
                      </Typography>
                    </Box>

                    {/* Value or Link */}
                    <Box sx={{ flex: 1, textAlign: "right" }}>
                      {item.isLink ? (
                        <Typography
                          component="a"
                          href={item.isLink}
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            color: "inherit",
                            textDecoration: "none",
                            whiteSpace: "nowrap", 
                            "&:hover": { color: "white" },
                          }}
                        >
                          {item.value}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.value}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Address Section */}
              <Box
                sx={{
                  textAlign: "left",
                  mt: 2,
                  background: "#f8fbff",
                  borderRadius: "12px",
                  p: 2,
                  boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#20ADA0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LocationOnIcon
                      sx={{ color: "white", fontSize: "1.2rem" }}
                    />
                  </Box>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "0.98rem", color: "#333" }}
                  >
                    Address:
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: "0.98rem", color: "#555" }}
                  >
                    {user?.address || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Next Visit & Previous Visit */}
            <Box
              sx={{
                background: "#e8f6ff",
                borderRadius: "12px",
                p: 2,
                my: 2,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "600", color: "#2C3E50", mb: 1 }}
              >
                Visit Information
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {[
                  {
                    label: "Previous Visit :",
                    value: previousVisit
                      ? `${new Date(
                          previousVisit.appointmentDate
                        ).toLocaleDateString()} at ${
                          previousVisit.appointmentTime
                        }`
                      : "N/A",
                  },
                  {
                    label: "Next Visit :",
                    value: nextVisit
                      ? `${new Date(
                          nextVisit.appointmentDate
                        ).toLocaleDateString()} at ${nextVisit.appointmentTime}`
                      : "N/A",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1,
                      borderRadius: "20px",
                      background: "#20ADA0",
                      color: "white",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: "0.85rem" }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
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
                  <MenuItem
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
            {/* {activeView === "overview" && <PatientOverview user={user} />} */}
            {activeView === "appointments" && <AppointmentHistory />}
            {activeView === "tests" && <TestHistory />}
            {activeView === "billing" && <BillingHistory />}
            {activeView === "treatment" && <TreatmentHistory />}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;

"use client";

import React, { useState } from "react";
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

import { Utility } from "@/utils";
import { fetcher } from "@/apis/apiClient";
import { PatientData } from "@/types/patient";

import AppointmentHistory from "../components/appointment-history";
import TestHistory from "../components/Test-history";
import BillingHistory from "../components/Billing-history";
import TreatmentHistory from "../components/Treatment-history";
import PatientOverview from "../components/Patient-overview";

const UserProfile = () => {
  const [user, setUser] = useState<PatientData>();
  const [profilePicture, setProfilePicture] = useState("/iconimg.jpg");
  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;
  const [activeView, setActiveView] = useState<
    "overview" | "appointments" | "tests" | "billing" | "treatment"
  >("overview");

  // Define quick action buttons
  const quickActions = [
    { icon: DashboardIcon, label: "Overview", value: "overview" },
    { icon: CalendarTodayIcon, label: "Appointments", value: "appointments" },
    { icon: FolderIcon, label: "Tests", value: "tests" },
    { icon: CheckCircleIcon, label: "Treatment", value: "treatment" },
    { icon: MonetizationOnIcon, label: "Billing", value: "billing" },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePicture(e.target.result as string); // Update profile picture
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUserProfile = React.useCallback(async () => {
    if (patientId) {
      try {
        const { data: response } = await fetcher(
          "patient",
          `get-patient-by-id/${patientId}`
        );
        setUser(response);
        console.log(response, 'patient')
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    }
  }, [patientId]);

  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

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
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Loading user details...
        </Typography>
      </Box>
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
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: "20px",
              height: "100%",
              background: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <Box
                component="img"
                src={profilePicture}
                alt="Profile"
                sx={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "2px solid #e0e0e0",
                  objectFit: "cover",
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  top: "100px",
                  right: "6px",
                  mb: 40,
                  backgroundColor: "white",
                  mr: 14,
                  width: "30px",
                  height: "30px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <PhotoCameraIcon sx={{ color: "#757575" }} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </IconButton>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "700",
                color: "#2C3E50",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {user?.username || "N/A"}
            </Typography>

            <Box sx={{ mb: 4, mt: 5 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#20ADA0", fontWeight: "600" }}
              >
                Contact Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <PhoneIcon sx={{ color: "#20ADA0", fontSize: "1.2rem" }} />
                  <Typography>{user?.contact || "N/A"}</Typography>

                  <IconButton
                    onClick={() => {
                      if (user?.contact) {
                        navigator.clipboard.writeText(user?.contact);
                        alert("Contact number copied to clipboard!");
                      }
                    }}
                    sx={{
                      backgroundColor: "#20ADA0",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#18a189",
                      },
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: "11px" }} />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon sx={{ color: "#20ADA0", fontSize: "1.2rem" }} />
                  <Typography
                    component="a"
                    href={`mailto:${user?.email || ""}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        color: "#20ADA0",
                      },
                    }}
                  >
                    {user?.email || "N/A"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <LocationOnIcon
                    sx={{ color: "#20ADA0", fontSize: "1.2rem" }}
                  />
                  <Typography
                    component="a"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      "15 Trevelyan Avenue, London"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        color: "#20ADA0",
                      },
                    }}
                  >
                    15 Trevelyan Avenue, London
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
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
            {activeView === "overview" && <PatientOverview />}
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

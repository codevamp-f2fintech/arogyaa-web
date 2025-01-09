"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, Paper, IconButton } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HealingIcon from "@mui/icons-material/Healing";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { Utility } from "@/utils";
import { fetcher } from "@/apis/apiClient";

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profilePicture, setProfilePicture] = useState("/iconimg.jpg");
  const { decodedToken } = Utility();
  const patientId = decodedToken()?.id;

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
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    }
  }, [patientId]);

  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const MenuItem = ({ icon: Icon, label }: { icon: any; label: string }) => (
    <Paper
      elevation={1}
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
          background: "linear-gradient(135deg, #20ADA0 0%, #B6DADA 100%)",
          "& .MuiTypography-root": { color: "white" },
          "& .MuiSvgIcon-root": { color: "white" },
        },
      }}
    >
      <Icon sx={{ fontSize: "2rem", mb: 1, color: "#20ADA0" }} />
      <Typography variant="body2" sx={{ fontWeight: "500" }}>
        {label}
      </Typography>
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
                  bottom: "6px",
                  right: "6px",
                  backgroundColor: "white",
                  border: "2px solid #e0e0e0",
                  mr: 16,
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
              {user.username || "N/A"}
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
                  <Typography>{user.phone || "N/A"}</Typography>

                  {/* Copy Button */}
                  <IconButton
                    onClick={() => {
                      if (user.phone) {
                        navigator.clipboard.writeText(user.phone);
                        alert("Phone number copied to clipboard!");
                      } else {
                        alert("No phone number available to copy.");
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
                    href={`mailto:${user.email || ""}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": {
                        // textDecoration: "underline",
                        color: "#20ADA0",
                      },
                    }}
                  >
                    {user.email || "N/A"}
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
                        // textDecoration: "underline",
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
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 3, color: "#2C3E50", fontWeight: "700" }}
            >
              Patient Overview
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  icon: PersonIcon,
                  label: "Gender",
                  value: user.gender || "N/A",
                },
                {
                  icon: CalendarTodayIcon,
                  label: "Date of Birth",
                  value: "10/03/1987",
                },
                {
                  icon: CalendarTodayIcon,
                  label: "Previous Visit",
                  value: "25/11/2020",
                },
                {
                  icon: CalendarTodayIcon,
                  label: "Next Visit",
                  value: "09/12/2020",
                },
                {
                  icon: HealingIcon,
                  label: "Allergies",
                  value: "Hayfever, Crayfish",
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      background: "#f8f9fa",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        gap: 1,
                      }}
                    >
                      <item.icon sx={{ color: "#20ADA0" }} />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "600", color: "#2C3E50" }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ ml: 4 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

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
            <Grid
              container
              spacing={2}
              //   sx={{
              //     border: "2px solid green",
              //   }}
            >
              {[
                { icon: CalendarTodayIcon, label: "Appointments" },
                { icon: HealingIcon, label: "Doctors" },
                { icon: FolderIcon, label: "Tests" },
                { icon: CheckCircleIcon, label: "Treatment" },
                { icon: PersonIcon, label: "Partner" },
                { icon: MonetizationOnIcon, label: "Billing" },
              ].map((item, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <MenuItem icon={item.icon} label={item.label} />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;

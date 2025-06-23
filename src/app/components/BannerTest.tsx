"use client";
import React, { useState, useCallback, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScienceIcon from "@mui/icons-material/Science";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import {
  Box,
  Button,
  Paper,
  InputBase,
  Typography,
  IconButton,
  Container,
  Chip,
  Stack,
  ListItem,
  List,
  ListItemText,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";
import AIAssistant from "./AIAssistant";

const BannerComponentTest: React.FC = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [isSearchingNearby, setIsSearchingNearby] = useState<boolean>(false);

  const { capitalizeFirstLetter } = Utility();
  const router = useRouter();

  // Get user's current location
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });
    });
  };

  // Get city name from coordinates using reverse geocoding
  const getCityFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      // Using a free geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();

      return (
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        "Unknown City"
      );
    } catch (error) {
      console.error("Error getting city name:", error);
      return "Unknown City";
    }
  };

  // Debounce function to prevent unnecessary API calls
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch doctors based on search input
  const fetchDoctorResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetcher(
        "doctor",
        `get-doctors?keyword=${encodeURIComponent(searchTerm)}`
      );
      if (response && response.results && Array.isArray(response.results)) {
        setResults(response.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  // Fetch doctors based on location
  const fetchDoctorsByLocation = async (
    latitude: number,
    longitude: number,
    city?: string
  ) => {
    setIsSearchingNearby(true);
    try {
      // You can modify this API call based on your backend implementation
      let apiUrl = `get-doctors-by-location?latitude=${latitude}&longitude=${longitude}`;

      // If you prefer to search by city name instead of coordinates
      if (city) {
        apiUrl = `get-doctors?location=${encodeURIComponent(city)}`;
      }

      const response = await fetcher("doctor", apiUrl);

      if (response && response.results && Array.isArray(response.results)) {
        setResults(response.results);
        setKeyword(`Doctors near ${city || "your location"}`);
      } else {
        setResults([]);
        setLocationError("No doctors found in your area");
      }
    } catch (error) {
      console.error("Error fetching doctors by location:", error);
      setLocationError("Failed to fetch doctors in your area");
      setResults([]);
    } finally {
      setIsSearchingNearby(false);
    }
  };

  const getIconColor = (index: number) => {
    const colors = ["#fff", "#fff", "#fff", "#fff"];
    return colors[index % colors.length];
  };

  const debouncedFetchResults = useCallback(
    debounce(fetchDoctorResults, 500),
    []
  );

  const features = [
    "100% Expert Doctors",
    "Medicine & Instrument",
    "From Scientific Journal",
    "Instant Operation",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setKeyword(keyword);
    setLocationError(""); // Clear location error when user starts typing
    debouncedFetchResults(keyword);
  };

  const handleClear = () => {
    setKeyword("");
    setResults([]);
    setLocationError("");
  };

  const handleNearMeClick = async () => {
    setLocationError("");
    setIsLoadingLocation(true);

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      // Get city name from coordinates
      const cityName = await getCityFromCoordinates(latitude, longitude);

      setUserLocation({
        latitude,
        longitude,
        city: cityName,
      });

      // Fetch doctors in the area
      await fetchDoctorsByLocation(latitude, longitude, cityName);
    } catch (error: any) {
      console.error("Error getting location:", error);

      if (error.code === 1) {
        setLocationError(
          "Location access denied. Please enable location services."
        );
      } else if (error.code === 2) {
        setLocationError("Unable to retrieve your location. Please try again.");
      } else if (error.code === 3) {
        setLocationError("Location request timed out. Please try again.");
      } else {
        setLocationError(
          "Failed to get your location. Please search manually."
        );
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleNavigation = (link: string) => {
    const userToken = Cookies.get("token");
    if (!userToken) {
      router.push(`/signup?redirect=${encodeURIComponent(link)}`);
      return;
    }
    router.push(link);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
          md: "row",
        },
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
        position: "relative",
        padding: "40px 20px",
        background:
          "linear-gradient(180deg, rgba(85,65,138,1) 0%, rgba(93,73,147,1) 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('/pattern.png')",
          backgroundSize: "cover",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          flex: 1,
          position: "relative",
          zIndex: 2,
          height: "70vh",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              marginBottom: { xs: "10px", sm: "20px" },
              fontSize: { xs: "34px", sm: "32px", md: "40px", lg: "48px" },
              marginTop: { xs: "2px", sm: "10px" },
              fontWeight: 600,
              color: "#fff",
              fontFamily: "Poppins",
              letterSpacing: "0.5px",
              lineHeight: "1.2",
              textShadow: "0 4px 8px rgba(0,0,0,0.2)",
              width: { xs: "100%", sm: "80%", md: "inherit" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            Welcome to{" "}
            <motion.span
              style={{ color: "#b497d6", fontSize: "50px" }}
              animate={{
                color: ["#b497d6", "#d4c1e9", "#b497d6"],
                textShadow: [
                  "0 0 10px rgba(180,151,214,0.5)",
                  "0 0 20px rgba(180,151,214,0.8)",
                  "0 0 10px rgba(180,151,214,0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              Arogyaa
            </motion.span>
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "500",
                color: "#fff",
                textShadow: "2px 2px 15px rgba(0, 0, 0, 0.6)",
                mb: "20px",
                mt: "20px",
                width: {
                  xs: "300px",
                  md: "inherit",
                },
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "bold" }}
                whileHover={{ scale: 1.05 }}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row", md: "row" },
                }}
              >
                Find & Book
              </span>{" "}
              Healthcare Services Instantly
            </Typography>
          </motion.div>
        </motion.div>

        {/* Location Error Alert */}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: "10px", width: "100%", maxWidth: "600px" }}
          >
            <Alert
              severity="warning"
              onClose={() => setLocationError("")}
              sx={{
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                color: "#fff",
                "& .MuiAlert-icon": { color: "#ffb74d" },
              }}
            >
              {locationError}
            </Alert>
          </motion.div>
        )}

        {/* Search Input and Near Me Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1000px",
            marginTop: "15px",
          }}
        >
          <Paper
            sx={{
              mb: "70px",
              display: "flex",
              alignItems: "center",
              padding: "4px 15px",
              borderRadius: "50px",
              background: "#fff",
              width: { xs: "90%", sm: "75%", md: "33vw" },
              justifyContent: "space-between",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
              gap: 0,
              overflow: "hidden",
            }}
          >
            <InputBase
              value={keyword}
              onChange={handleChange}
              placeholder="Search by name, specialties, location.."
              sx={{
                flex: 1,
                minWidth: 0,
                color: "#29175e",
                fontWeight: 310,
                fontSize: ".9rem",
                fontFamily: "Poppins",
                zIndex: 10,
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                style={{
                  position: "relative",
                  display: "inline-block",
                  zIndex: 10,
                }}
              >
                {keyword ? (
                  <IconButton onClick={handleClear} sx={{ color: "#29175e" }}>
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton sx={{ color: "#29175e" }}>
                    <SearchIcon />
                  </IconButton>
                )}
                <Button
                  onClick={handleNearMeClick}
                  disabled={isLoadingLocation || isSearchingNearby}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    fontFamily: "Poppins",
                    borderRadius: "20px",
                    backgroundColor: "#b497d6",
                    color: "#29175e",
                    px: 0.8,
                    py: 0.2,
                    "& .MuiButton-startIcon": {
                      marginRight: "4px",
                    },
                    "&:hover": {
                      backgroundColor: "#29175e",
                      color: "#fff",
                      "& .MuiButton-startIcon": {
                        color: "#fff",
                      },
                    },
                    "&:disabled": {
                      backgroundColor: "#ddd",
                      color: "#999",
                    },
                  }}
                >
                  {isLoadingLocation || isSearchingNearby ? (
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                  ) : (
                    <LocationOnIcon sx={{ fontSize: "1.3rem" }} />
                  )}
                  {isLoadingLocation
                    ? "Getting Location..."
                    : isSearchingNearby
                    ? "Searching..."
                    : userLocation?.city
                    ? `Near ${userLocation.city}`
                    : "Near Me"}
                </Button>
              </motion.div>
            </Box>
          </Paper>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "65%",
              padding: "12px 0",
              textAlign: "center",
              justifyContent: "center",
              zIndex: 5,
              mb: "1px",
            }}
          >
            {results.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom:
                    results.length < 2
                      ? "110px"
                      : results.length < 3
                      ? "60px"
                      : "-80px",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "5px",
                  overflow: "scroll",
                  maxHeight: "300px",
                  zIndex: 10,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#b497d6",
                    borderRadius: "10px",
                  },
                }}
              >
                <List
                  sx={{
                    padding: "0px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                  }}
                >
                  {results.map((doctor: any, index: number) => (
                    <ListItem
                      key={doctor._id || index}
                      sx={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        ":hover": {
                          backgroundColor: "#f4f4f4",
                        },
                      }}
                    >
                      <Link
                        href={`/doctors/profile/${doctor._id}`}
                        passHref
                        sx={{ textDecoration: "none" }}
                      >
                        <ListItemText
                          primary={`${doctor.username || "Unknown"} - ${
                            doctor.specializationIds
                              ?.map((spec: any) =>
                                capitalizeFirstLetter(spec.name)
                              )
                              .join(", ") || "Specialty not available"
                          }`}
                          sx={{
                            fontSize: "0.9rem",
                            textDecoration: "none",
                            fontfamily: "Poppins",
                            color: "#29175e",
                          }}
                        />
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Container>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0, delay: 0 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: "20px", sm: "50px" },
                    mt: 30,
                    maxWidth: "1200px",
                    flexWrap: { xs: "nowrap", sm: "nowrap" },
                    justifyContent: { xs: "center", sm: "center" },
                    padding: { xs: "10px", sm: "0" },
                    height: {
                      xs: "auto",
                      sm: "inherit",
                    },
                    width: {
                      xs: "100%",
                      sm: "inherit",
                    },
                  }}
                >
                  {[
                    {
                      icon: <CalendarMonthIcon />,
                      text: "View Appointment",
                      link: "/profile?view=appointments",
                    },
                    {
                      icon: <ScienceIcon />,
                      text: "View Test",
                      link: "/profile?view=tests",
                    },
                    {
                      icon: <AssignmentIcon />,
                      text: "View Treatment",
                      link: "/profile?view=treatments",
                    },
                    {
                      icon: <LocalPharmacyIcon />,
                      text: "Billing Details",
                      link: "/profile?view=billings",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{
                        scale: 1.1,
                        y: -5,
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.9 + index * 0.1 },
                      }}
                    >
                      <Box
                        onClick={() => handleNavigation(item.link)}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          cursor: "pointer",
                          color: "#b497d6",
                          height: "60px",
                          width: { xs: "70px", sm: "75px" },
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          padding: "15px",
                          borderRadius: "12px",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(255, 255, 255, 0.2)",
                            boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <motion.div
                          whileHover={{
                            rotate: [0, -10, 10, -10, 0],
                            transition: { duration: 0.5 },
                          }}
                          style={{
                            fontSize: "25px",
                            marginBottom: "8px",
                            color: getIconColor(index),
                          }}
                        >
                          {item.icon}
                        </motion.div>
                        <motion.span
                          style={{
                            color: "#fff",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 550,
                            marginTop: "10px",
                          }}
                          animate={{
                            color: ["#fff", "#fff", "#b497d6"],
                            textShadow: [
                              "0 0 10px rgba(180,151,214,0.5)",
                              "0 0 20px rgba(180,151,214,0.8)",
                              "0 0 10px rgba(180,151,214,0.5)",
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        >
                          {item.text}
                        </motion.span>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Container>
          </Box>
        </motion.div>
      </Box>
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        sx={{
          flex: 1,
          position: "relative",
          height: { xs: "300px", sm: "400px", md: "400px" },
          width: "100%",
          overflow: "hidden",
          display: {
            xs: "none",
            sm: "flex",
            md: "flex",
            lg: "flex",
          },
          borderRadius: "20px",
          margin: { xs: "0 10px", sm: "0 15px", md: "0 20px" },
        }}
      >
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('homePage.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: { xs: "15px", sm: "20px", md: "20px" },
            display: "flex",
            justifyContent: "center",
            width: "100%",
            "@media (max-width: 600px)": {
              padding: "10px",
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Stack direction="row" spacing={1} justifyContent="center">
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  sx={{
                    background: "#29175e",
                    color: "white",
                    fontWeight: 550,
                    backdropFilter: "blur(5px)",
                    fontSize: "12px",
                    fontFamily: "Poppins",
                    boxShadow: "none !important",
                  }}
                  component={motion.div}
                  whileHover={{ scale: 1.1 }}
                />
              ))}
            </Stack>
          </motion.div>
        </Box>
      </Box>
      <AIAssistant />
    </Box>
  );
};

export default BannerComponentTest;

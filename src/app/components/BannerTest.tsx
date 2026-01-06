"use client";
import React, { useState, useCallback, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
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
  Container,
  Chip,
  Stack,
  ListItem,
  List,
  ListItemText,
  Link,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";
import AIAssistant from "./AIAssistant";
import useMediaQuery from "@mui/material/useMediaQuery";
const BannerComponentTest: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:599px)", { noSsr: true });
  const isTablet = useMediaQuery("(min-width:600px) and (max-width:899px)", {
    noSsr: true,
  });
  const isiPhoneSE = useMediaQuery("(max-width:320px)", { noSsr: true });
  const [nameKeyword, setNameKeyword] = useState<string>("");
  const [locationKeyword, setLocationKeyword] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude?: number;
    longitude?: number;
    city?: string;
    region?: string;
    country?: string;
    pincode?: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [isSearchingNearby, setIsSearchingNearby] = useState<boolean>(false);
  const [activeSearchBar, setActiveSearchBar] = useState<
    "name" | "location" | null
  >(null);

  const { capitalizeFirstLetter } = Utility();
  const router = useRouter();

  // Browser-based geolocation with reverse geocode
  const getLocationUsingBrowser = async (): Promise<{
    latitude?: number;
    longitude?: number;
    city?: string;
    region?: string;
    country?: string;
    pincode?: string;
  }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=b4953ca380c5441399830b0c05c656b6`
            );

            if (!res.ok) {
              throw new Error("Failed to fetch location details");
            }

            const data = await res.json();
            const components = data.results[0]?.components || {};
            resolve({
              latitude,
              longitude,
              city:
                components.city ||
                components.town ||
                components.village ||
                "Unknown",
              region: components.state || "Unknown",
              country: components.country || "Unknown",
              pincode: components.postcode || "N/A",
            });
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            resolve({
              latitude,
              longitude,
              city: "Unknown",
              region: "Unknown",
              country: "Unknown",
              pincode: "N/A",
            });
          }
        },
        (err) => {
          let errorMessage = "Location access denied or unavailable";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable location permissions.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case err.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = `Location error: ${err.message}`;
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  };

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Combined search function
  const performSearch = async (nameSearch: string, locationSearch: string) => {
    if (!nameSearch.trim() && !locationSearch.trim()) {
      setResults([]);
      return;
    }

    try {
      let apiUrl = "get-doctors?";
      const params = new URLSearchParams();

      if (nameSearch.trim()) {
        params.append("keyword", nameSearch.trim());
      }

      if (locationSearch.trim()) {
        params.append("location", locationSearch.trim());
      }

      const response = await fetcher("doctor", apiUrl + params.toString());

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
  const fetchDoctorsByLocation = async (locationData: {
    latitude?: number;
    longitude?: number;
    city?: string;
    region?: string;
    country?: string;
    pincode?: string;
  }) => {
    setIsSearchingNearby(true);
    try {
      let apiUrl = "";
      let searchLocation = "";

      if (locationData.city && locationData.city !== "Unknown") {
        searchLocation = locationData.city;
        setLocationKeyword(locationData.city);
        apiUrl = `get-doctors?location=${encodeURIComponent(
          locationData.city
        )}`;
      } else if (locationData.region && locationData.region !== "Unknown") {
        searchLocation = locationData.region;
        setLocationKeyword(locationData.region);
        apiUrl = `get-doctors?location=${encodeURIComponent(
          locationData.region
        )}`;
      } else if (locationData.country && locationData.country !== "Unknown") {
        searchLocation = locationData.country;
        setLocationKeyword(locationData.country);
        apiUrl = `get-doctors?location=${encodeURIComponent(
          locationData.country
        )}`;
      } else if (locationData.latitude && locationData.longitude) {
        searchLocation = "your location";
        setLocationKeyword("Near me");
        apiUrl = `get-doctors-by-location?latitude=${locationData.latitude}&longitude=${locationData.longitude}`;
      } else {
        throw new Error("No valid location data available");
      }

      const response = await fetcher("doctor", apiUrl);

      if (response && response.results && Array.isArray(response.results)) {
        setResults(response.results);
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

  const debouncedSearch = useCallback(
    debounce((nameSearch: string, locationSearch: string) => {
      performSearch(nameSearch, locationSearch);
    }, 500),
    []
  );

  // Handle Enter key press for location field
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (locationKeyword.trim()) {
        // Navigate to doctor listing page with location pre-filled
        router.push(
          `/doctors?location=${encodeURIComponent(locationKeyword.trim())}`
        );
      }
    }
  };

  // Handle Enter key press for name/specialty field
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Navigate to doctor listing page with search parameters
      const params = new URLSearchParams();

      if (nameKeyword.trim()) {
        params.append("keyword", nameKeyword.trim());
      }

      if (locationKeyword.trim()) {
        params.append("location", locationKeyword.trim());
      }

      const queryString = params.toString();
      router.push(`/doctors${queryString ? `?${queryString}` : ""}`);
    }
  };

  // Handle name/specialty search
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameKeyword(value);
    setLocationError("");
    setActiveSearchBar("name");
    debouncedSearch(value, locationKeyword);
  };

  // Handle location search
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationKeyword(value);
    setLocationError("");
    setActiveSearchBar("location");
    debouncedSearch(nameKeyword, value);
  };

  const handleClearName = () => {
    setNameKeyword("");
    setResults([]);
    setLocationError("");
    setActiveSearchBar(null);
    if (locationKeyword) {
      debouncedSearch("", locationKeyword);
    }
  };

  const handleClearLocation = () => {
    setLocationKeyword("");
    setResults([]);
    setLocationError("");
    setActiveSearchBar(null);
    if (nameKeyword) {
      debouncedSearch(nameKeyword, "");
    }
  };

  const handleNearMeClick = async () => {
    setLocationError("");
    setIsLoadingLocation(true);
    setActiveSearchBar("location");

    try {
      const locationData = await getLocationUsingBrowser();
      setUserLocation(locationData);
      await fetchDoctorsByLocation(locationData);
    } catch (error: any) {
      console.error("Error getting browser location:", error);
      setLocationError(
        error.message || "Failed to get your location. Please search manually."
      );
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

  const getIconColor = (index: number) => {
    const colors = ["#fff", "#fff", "#fff", "#fff"];
    return colors[index % colors.length];
  };

  const features = [
    "100% Expert Doctors",
    "Medicine & Instrument",
    "From Scientific Journal",
    "Instant Operation",
  ];

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
        "@media (max-width: 375px)": {
          // iPhone SE width
          height: "110vh",
        },
        "@media (max-width: 414px)": {
          // Samsung S8+ width
          height: "110vh",
        },
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
          height: isMobile ? "80vh" : isTablet ? "60vh" : "80vh",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          style={{
            width: isMobile ? "80vw" : isTablet ? "60vw" : "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: isMobile ? "1rem" : isTablet ? "8rem" : "inherit",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              marginBottom: { xs: "10px", sm: "20px" },
              fontSize: { xs: "34px", sm: "42px", md: "40px", lg: "48px" },
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
            <span style={{ marginRight: "8px" }}>Welcome to</span>
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
              <motion.span
                style={{ color: "#fff", fontWeight: "bold" }}
                whileHover={{ scale: 1.05 }}
              >
                Find & Book &nbsp;
              </motion.span>
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
        <Box
          sx={{
            position: "relative",
            width: isMobile ? "90%" : isTablet ? "70%" : "70%",
            maxWidth: "700px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            layout
            style={{
              display: "flex",
              justifyContent: "center",
              // width: isMobile ? "90%" : isTablet ? "70%" : "70%",
              maxWidth: "700px",
              marginTop: "10px",
            }}
          >
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: {
                  xs: "20px",
                  sm: "50px",
                  md: "50px",
                  lg: "50px",
                },
                width: "100%", // Ensures full width of parent
                flexDirection: {
                  xs: "column", // Stack vertically on mobile
                  sm: "row", // Horizontal on tablet/desktop
                },
                border: "1px solid #ccc",
                boxShadow: "none",
                overflow: "hidden",
                // marginBottom: isMobile
                //   ? "11rem"
                //   : isTablet
                //   ? "13rem"
                //   : "inherit",
              }}
            >
              {/* Location Field */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  px: 2,
                  py: 1.5,
                  gap: 1,
                  position: "relative",
                  width: "100%", // Full width on mobile
                  borderBottom: {
                    xs: "1px solid #ccc", // Add divider between fields on mobile
                    sm: "none", // Remove on tablet/desktop
                  },
                }}
              >
                <LocationOnIcon fontSize="small" sx={{ color: "gray" }} />
                <InputBase
                  placeholder="Enter location..."
                  value={locationKeyword}
                  onChange={handleLocationChange}
                  onKeyDown={handleLocationKeyDown}
                  sx={{
                    flex: 1,
                    fontSize: "0.95rem",
                    fontFamily: "Poppins",
                    color: "#333",
                    "&::placeholder": {
                      fontSize: "0.75rem",
                    },
                  }}
                  inputProps={{
                    sx: {
                      "::placeholder": {
                        fontSize: "0.75rem", // ✅ placeholder font size
                      },
                    },
                  }}
                />
                <Button
                  onClick={handleNearMeClick}
                  disabled={isLoadingLocation || isSearchingNearby}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontFamily: "Poppins",
                    borderRadius: "20px",
                    backgroundColor: "#b497d6",
                    color: "#29175e",
                    px: 1.5,
                    py: 0.5,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "#29175e",
                      color: "#fff",
                    },
                    "&:disabled": {
                      backgroundColor: "#ddd",
                      color: "#999",
                    },
                  }}
                >
                  {isLoadingLocation || isSearchingNearby ? (
                    <CircularProgress size={14} />
                  ) : (
                    "Near Me"
                  )}
                </Button>
              </Box>
              {/* Divider */}
              <Divider orientation="vertical" flexItem />

              {/* Doctor Name / Specialty Field */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  px: 2,
                  py: 1.5,
                  gap: 1,
                  width: "100%", // Full width on mobile
                }}
              >
                <SearchIcon fontSize="small" sx={{ color: "gray" }} />
                <InputBase
                  placeholder="Search by doctor or specialty..."
                  value={nameKeyword}
                  onChange={handleNameChange}
                  onKeyDown={handleNameKeyDown}
                  sx={{
                    flex: 1,
                    fontSize: "0.95rem",
                    fontFamily: "Poppins",
                    color: "#333",
                    "&::placeholder": {
                      fontSize: "0.75rem",
                    },
                  }}
                  inputProps={{
                    sx: {
                      "::placeholder": {
                        fontSize: "0.75rem", // ✅ placeholder font size
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>

          {/* Search Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    height: {
                      duration: 0.8,
                      ease: "easeInOut",
                    },
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  height: 0,
                  transition: {
                    duration: 0.4,
                    ease: "easeIn",
                  },
                }}
                style={{
                  overflow: "hidden",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    overflow: "auto",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    mt: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: {
                      xs: "90vw",
                      sm: "70vw",
                      md: "50vw",
                      lg: "40vw",
                      xl: "30vw",
                    },
                    maxHeight: "50vh",
                    zIndex: 10,
                  }}
                >
                  <List
                    sx={{
                      padding: 0,
                      width: "100%",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#b497d6",
                        borderRadius: "6px",
                      },
                    }}
                  >
                    {results.map((doctor: any, index: number) => (
                      <motion.div
                        key={doctor._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: index * 0.1,
                            duration: 0.4,
                            ease: "easeOut",
                          },
                        }}
                      >
                        <ListItem
                          sx={{
                            padding: "10px 15px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            "&:hover": {
                              backgroundColor: "#f4f4f4",
                            },
                          }}
                        >
                          <Link
                            href={`/doctors/profile/${doctor._id}`}
                            passHref
                            sx={{ textDecoration: "none", width: "100%" }}
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
                                "& .MuiListItemText-primary": {
                                  fontSize: "0.9rem",
                                  fontFamily: "Poppins",
                                  color: "#29175e",
                                },
                              }}
                            />
                          </Link>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Box
          sx={{
            height: isMobile ? "11rem" : isTablet ? "13rem" : "0",
          }}
        />
        {/* Action Buttons */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "90%",
            padding: "12px 0",
            textAlign: "center",
            justifyContent: "center",
            zIndex: 5,
            marginTop: {
              md: "5rem",
            },
          }}
        >
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: "15px", sm: "30px" },
                  justifyContent: "center",
                  flexWrap: "wrap",
                  maxWidth: "600px",
                  mx: "auto",
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
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 1.2 + index * 0.1 },
                    }}
                  >
                    <Box
                      onClick={() => handleNavigation(item.link)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#b497d6",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(5px)",
                        padding: "15px",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        width: {
                          xs: "100px", // small screens
                          sm: "110px", // tablets
                          md: "100px", // medium+ screens
                        },
                        height: {
                          xs: "100px",
                          sm: "110px",
                          md: "100px",
                        },
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
                          fontSize: "28px",
                          marginBottom: "8px",
                          color: getIconColor(index),
                        }}
                      >
                        {item.icon}
                      </motion.div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#fff",
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>

      {/* Image Section */}
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
          minWidth: "50%",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          display: {
            xs: "none",
            sm: "none",
            md: "flex",
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

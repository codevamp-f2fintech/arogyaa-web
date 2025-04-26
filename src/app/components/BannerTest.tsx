"use client";
import React, { useState, useCallback } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import { fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";
import AIAssistant from "./AIAssistant";

const BannerComponentTest: React.FC = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const { capitalizeFirstLetter } = Utility();
  const router = useRouter();

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
  const getIconColor = (index) => {
    const colors = ["#fff", "#fff", "#fff", "#fff"];
    return colors[index % colors.length]; // It will cycle through colors
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
    debouncedFetchResults(keyword);
  };

  const handleClear = () => {
    setKeyword("");
    setResults([]);
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
              width: { xs: "100%", sm: "80%", md: "inherit" }, // Ensure it takes full width on smaller screens
              display: "flex",
              justifyContent: "center", // Ensure center alignment
              alignItems: "center", // Vertically center the content
              flexDirection: { xs: "column", md: "row" }, // Stack content on small screens
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
                  flexDirection: { xs: "column", sm: "row", md: "row" }, // xs for mobile screens, sm for larger screens
                }}
              >
                Find & Book
              </span>{" "}
              Healthcare Services Instantly
            </Typography>
          </motion.div>
        </motion.div>

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
              width: { xs: "90%", sm: "75%", md: "33vw" }, // Adjust width based on screen size
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
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: "1.3rem" }} />
                  Near Me
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
                  bottom: results.length < 2 ? "110px" : results.length < 3 ? "60px" : "-80px",
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
                      <Link href={`/doctors/profile/${doctor._id}`} passHref
                        sx={{
                          textDecoration: "none"
                        }}
                      >
                        <ListItemText
                          primary={`${doctor.username || "Unknown"} - ${doctor.specializationIds
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
                    gap: { xs: "20px", sm: "50px" }, // Adjust gap for mobile and tablet sizes
                    mt: 30,
                    maxWidth: "1200px",
                    flexWrap: { xs: "nowrap", sm: "nowrap" }, // Allow wrapping on mobile
                    justifyContent: { xs: "center", sm: "center" },
                    padding: { xs: "10px", sm: "0" }, // Add padding for smaller screens to prevent overlap
                    height: {
                      xs: "auto", // Allow height to adjust for mobile devices
                      sm: "inherit",
                    },
                    width: {
                      xs: "100%", // Take full width on small devices
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
                          width: { xs: "70px", sm: "75px" }, // Adjust width on smaller screens
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
      </Box >
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        sx={{
          flex: 1,
          position: "relative",
          height: { xs: "300px", sm: "400px", md: "400px" }, // Height adjusted for mobile and tablet
          width: "100%", // Full width for all devices
          overflow: "hidden",
          display: {
            xs: "none",
            sm: "flex",
            md: "flex",
            lg: "flex",
          },
          borderRadius: "20px",
          margin: { xs: "0 10px", sm: "0 15px", md: "0 20px" }, // Adjust margins for mobile and tablet
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
            padding: { xs: "15px", sm: "20px", md: "20px" }, // Adjust padding for mobile and tablet
            display: "flex",
            justifyContent: "center",
            width: "100%", // Ensure the Box takes full width on all screen sizes
            "@media (max-width: 600px)": {
              padding: "10px", // Custom padding for smaller mobile screens
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
      </Box>{" "}
      <AIAssistant />
    </Box >
  );
};

export default BannerComponentTest;

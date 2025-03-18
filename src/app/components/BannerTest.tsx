"use client";

import React, { useState, useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScienceIcon from "@mui/icons-material/Science";
import PersonIcon from "@mui/icons-material/Person";
import BoltIcon from "@mui/icons-material/Bolt";

import Link from "next/link";
import {
  Box,
  Paper,
  InputBase,
  Typography,
  IconButton,
  Container,
  Divider,
  ListItem,
  List,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";

const popularSearches = [
  "Cardiology",
  "Orthopedics",
  "Gynecologists",
  "Physiotherapists",
];

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

  const debouncedFetchResults = useCallback(
    debounce(fetchDoctorResults, 500),
    []
  );

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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
        position: "relative",
        padding: "40px 20px",
        backgroundImage: "url('/blur1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              textShadow: "2px 2px 20px rgba(0, 0, 0, 0.6)",
              mb: "15px",
            }}
          >
            Welcome to{" "}
            <span style={{ color: "#20ADA0", fontSize: "50px" }}>Arogyaa</span>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "500",
              color: "#fff",
              textShadow: "2px 2px 15px rgba(0, 0, 0, 0.6)",
            }}
          >
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              Find & Book
            </span>{" "}
            Healthcare Services Instantly
          </Typography>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ width: "100%", maxWidth: "1000px", marginTop: "15px" }}
        >
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              padding: "4px 15px",
              borderRadius: "50px",
              background: "#fff",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            {/* <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <IconButton sx={{ color: "#20ADA0" }}>
                <LocationOnIcon sx={{ fontSize: "1.6rem" }} />
              </IconButton>
              <InputBase
                value="Noida"
                sx={{ fontWeight: "bold", color: "#20ADA0", minWidth: "80px" }}
                disabled
              />
            </Box> */}

            {/* <Divider
              sx={{ height: 28, mx: 1.5, backgroundColor: "#20ADA0" }}
              orientation="vertical"
            /> */}

            <InputBase
              value={keyword}
              onChange={handleChange}
              placeholder="Search by name, specialties and location.."
              sx={{ flex: 3, color: "#20ADA0" }}
            />
            {keyword ? (
              <IconButton onClick={handleClear} sx={{ color: "#20ADA0" }}>
                <CloseIcon />
              </IconButton>
            ) : (
              <IconButton sx={{ color: "#20ADA0" }}>
                <SearchIcon />
              </IconButton>
            )}
          </Paper>
        </motion.div>

        {/* Search Results */}
        {results.length > 0 && (
          <Box
            sx={{
              mt: "5px",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "8px",
              width: "100%",
              maxWidth: "100vw",
            }}
          >
            <List sx={{ padding: "0px" }}>
              {results.map((doctor: any, index: number) => (
                <ListItem
                  key={doctor._id || index}
                  sx={{ padding: "6px 10px" }}
                >
                  <Link href={`/doctors/profile/${doctor._id}`} passHref>
                    <ListItemText
                      primary={`${doctor.username || "Unknown"} - ${
                        doctor.specializationIds
                          ?.map((spec: any) => capitalizeFirstLetter(spec.name))
                          .join(", ") || "Specialty not available"
                      }`}
                      sx={{
                        cursor: "pointer",
                        ":hover": { color: "#20ADA0" },
                        fontSize: "0.9rem",
                      }}
                    />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Popular Searches */}

        <Box
          sx={{
            mt: "3px",
            display: "flex",
            gap: "7px",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              mt: "3px",
              display: "flex",
              gap: "7px",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            popular searches:
          </Typography>
          {popularSearches.map((search, index) => (
            <Button
              key={index}
              startIcon={<BoltIcon sx={{ marginRight: "-9px" }} />}
              sx={{
                color: "white",
                padding: "2px 1px",
                "&:hover": { backgroundColor: "#20ADA0" },
              }}
            >
              {search}
            </Button>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: "#20ADA0",
          padding: "12px 0",
          textAlign: "center",
          zIndex: 5,
        }}
      >
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "40px" }}>
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
              <motion.div key={index} whileHover={{ scale: 1.1 }}>
                <Box
                  onClick={() => handleNavigation(item.link)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{ fontWeight: "500", marginTop: "5px", color: "#fff" }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default BannerComponentTest;

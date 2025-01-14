"use client";

import styles from "../page.module.css";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import SearchIcon from "@mui/icons-material/Search";

import {
  Box,
  Button,
  CardContent,
  Grid,
  Paper,
  InputBase,
  Typography,
  IconButton,
} from "@mui/material";

import en from "@/locales/en.json";
import { useCallback, useState } from "react";

const BannerComponent: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  // Debounce function to delay the API call
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // API call function
  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) return; // Skip empty searches
    console.log("Fetching results for:", searchTerm);

    try {
      const response = await fetch(
        `http://localhost:4004/api/v1/doctor-service/get-doctors?keyword=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      console.log("Results:", data);
      setResults(data); // Update results state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Debounced version of the fetchResults function
  const debouncedFetchResults = useCallback(debounce(fetchResults, 500), []);

  const handleChange = (e) => {
    const keyword = e.target.value;
    console.log("keyword", keyword);
    setKeyword(keyword); // Update keyword state
    debouncedFetchResults(keyword); // Call the debounced API function
  };

  return (
    <div className={styles.homeBanner}>
      <div className={styles.bannerContent}>
        <Box
          component="img"
          className={styles.bannerImage}
          alt="The house from the offer."
          src={"/assets/images/dr1.png"}
        />
 
        <Box
          sx={{
            position: "absolute",
            left: "140px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#ffffff",
            zIndex: 3,
            maxWidth: "600px",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: "3.5rem",
              lineHeight: 1.2,
              marginBottom: "16px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            Welcome to <span style={{ color: "#20ADA0" }}>Arogyaa</span>
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: "400",
              fontSize: "1.25rem",
              lineHeight: 1.5,
              marginBottom: "20px",
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
            }}
          >
            Experience world-class medical services and healthcare designed for
            you and your family.
          </Typography>
          <Paper
            component="form"
            className={styles.searchBarWrapper}
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "1rem auto",
              marginLeft: "1px",
              padding: "1.9px",

              maxWidth: "800px",
              borderRadius: "23px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              position: "relative",
              zIndex: 3,
            }}
          >
            <InputBase
              onChange={handleChange}
              className={styles.searchBarInput}
              placeholder="Search for Doctors, Specialties, and Hospitals"
              inputProps={{ "aria-label": "search" }}
              sx={{
                flex: 1,
                padding: "0.5rem",
                fontWeight: "650",
                fontSize: "1rem",
              }}
            />
            <IconButton
              type="submit"
              aria-label="search"
              className={styles.searchBarButton}
              sx={{
                backgroundColor: "#20ADA0",
                color: "#fff",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#1A8575",
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
        <CardContent className={styles.bannerCardContent}>
          <Typography
            variant="h5"
            component="span"
            className={styles.bannerBestMedical}
          >
            {en.homepage.bannerComponent.the_best_medical}
          </Typography>
          <Typography
            variant="h4"
            component="h4"
            className={styles.bannerTreatment}
          >
            {en.homepage.bannerComponent.treatment}
          </Typography>
        </CardContent>
      </div>
    </div>
  );
};

export default BannerComponent;

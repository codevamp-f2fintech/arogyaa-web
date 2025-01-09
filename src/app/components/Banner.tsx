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
        {/* <Grid
          sx={{ marginLeft: ".1rem" }}
          container
          spacing={6}
          columns={{ xs: 4, sm: 8, md: 12 }}
        > */}
        <Paper
          component="form"
          className={styles.searchBarWrapper}
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "1rem 0",
            padding: "1rem",
            width: "125%",
            borderRadius: "23px",
            backgroundColor: "rgba(255, 255, 255, 0.90)",
            marginTop: "110px",
            // zIndex: -1,
            position: "relative",
          }}
        >
          <InputBase
            onChange={handleChange}
            className={styles.searchBarInput}
            placeholder="Search for Doctors, Specialties, and Hospitals"
            inputProps={{ "aria-label": "search" }}
            sx={{ flex: 1, padding: "0.5rem", fontWeight: "650" }}
          />
          <IconButton
            type="submit"
            aria-label="search"
            className={styles.searchBarButton}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        {/* </Grid> */}

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

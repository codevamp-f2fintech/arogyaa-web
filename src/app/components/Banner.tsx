"use client";

import React, { useCallback, useState } from "react";
import styles from "../page.module.css";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import {
  Box,
  CardContent,
  Paper,
  InputBase,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import en from "@/locales/en.json";
import { fetcher } from "@/apis/apiClient";

const BannerComponent: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

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
        console.error("Unexpected response structure:", response);
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
              padding: "1.9px",

              maxWidth: "800px",
              borderRadius: "23px",
              backgroundColor: "rgba(255, 255, 255, 0.90)",
              marginTop: "180px",
              position: "relative",
            }}
          >
            <InputBase
              value={keyword}
              onChange={handleChange}
              className={styles.searchBarInput}
              placeholder="Search for Doctors and Specialties"
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
        <CardContent
          sx={{
            filter: results.length > 0 ? "blur(4px)" : "none",
            transition: "filter 0.3s ease",
          }}
          className={styles.bannerCardContent}
        >
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

        {/* Display search results */}
        <Box
          sx={{
            marginTop: "0.1rem",
            backgroundColor: "rgba(255, 255, 255, 0.90)",
            position: "relative",
            borderRadius: "8px",
            zIndex: 10,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {results.length > 0 ? (
            <List>
              {results.map((doctor: any, index: number) => (
                <ListItem key={doctor._id || index}>
                  <Link
                    href={`/doctor/profile/${doctor._id}`}
                    passHref
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                    }}
                  >
                    <ListItemText
                      primary={doctor.username || ""}
                      sx={{
                        cursor: "pointer",
                        ":hover": {
                          color: "#20ADA0",
                        },
                      }}
                    />
                  </Link>
                </ListItem>
              ))}
            </List>
          ) : (
            keyword && (
              <Typography variant="body2" sx={{ marginTop: "1rem" }}>
                No results found for "{keyword}"
              </Typography>
            )
          )}
        </Box>
      </div>
    </div>
  );
};

export default BannerComponent;

"use client";

import React, { useCallback, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import {
  Box,
  Paper,
  InputBase,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../page.module.css";
import en from "@/locales/en.json";
import { fetcher } from "@/apis/apiClient";
import { Utility } from "@/utils";

const BannerComponent: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const { capitalizeFirstLetter } = Utility();

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
  const handleClear = () => {
    setKeyword("");
    setResults([]);
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
            left: { xs: "20px", sm: "50px", md: "100px" },
            top: "50%",
            transform: "translateY(-50%)",
            color: "#ffffff",
            zIndex: 3,
            maxWidth: { xs: "90%", sm: "600px" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" },
              lineHeight: 1.2,
              marginBottom: "20px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            Welcome to <span style={{ color: "#20ADA0" }}>Arogyaa</span>
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: "300",
              fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
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
              padding: "5px",
              maxWidth: { xs: "100%", sm: "600px" },
              borderRadius: "23px",
              backgroundColor: "rgba(255, 255, 255, 0.90)",
              position: "relative",
            }}
          >
            <IconButton
              type="submit"
              aria-label="search"
              sx={{
                backgroundColor: "#20ADA0",
                color: "#fff",
                padding: "8px 8px",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#1A8575",
                },
              }}
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              value={keyword}
              onChange={handleChange}
              placeholder="Search by Doctors and Specialties"
              inputProps={{ "aria-label": "search" }}
              sx={{
                flex: 1,
                padding: "0.5rem",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            />
            {keyword && (
              <IconButton
                onClick={handleClear}
                sx={{
                  color: "#555",
                  "&:hover": {
                    color: "#000",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Paper>
        </Box>

        {/* Display search results */}
        <Box
          sx={{
            marginTop: "21.4rem",
            marginLeft: "3rem",
            backgroundColor: "rgba(255, 255, 255, 0.90)",
            position: "relative",
            left: { xs: "0px", sm: "0px", md: "0px" },
            maxWidth: { xs: "60%", sm: "600px" },
            borderRadius: "23px",

            zIndex: 10,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
            overflow: "hidden",
            transform: "scaleY(0)",
            transformOrigin: "top",
            animation:
              results.length > 0 ? "openBox 0.3s ease-out forwards" : "",
          }}
        >
          {results.length > 0 ? (
            <Box
              sx={{
                maxHeight: "168px",
                overflowY: "auto",
              }}
            >
              <List>
                {results.map((doctor: any, index: number) => (
                  <ListItem key={doctor._id || index}>
                    <Link
                      href={`/doctors/profile/${doctor._id}`}
                      passHref
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        width: "100%",
                      }}
                    >
                      <ListItemText
                        primary={`${doctor.username || ""} - ${
                          doctor.specializationIds &&
                          doctor.specializationIds.length > 0
                            ? doctor.specializationIds
                                .map((spec: any) =>
                                  capitalizeFirstLetter(spec.name)
                                )
                                .join(", ") // Join specializations with commas
                            : "Specialty not available"
                        }`}
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
            </Box>
          ) : (
            keyword && (
              <Typography
                variant="body2"
                sx={{
                  margin: "1rem",
                  color: "#555",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  textAlign: "center",
                }}
              >
                No results found for "{keyword}"
              </Typography>
            )
          )}
        </Box>

        <style jsx global>{`
          @keyframes openBox {
            0% {
              transform: scaleY(0);
              opacity: 0;
            }
            100% {
              transform: scaleY(1);
              opacity: 1;
            }
          }
        `}</style>
        <CardContent
          className={`${styles.bannerCardContent} ${
            results.length > 0 ? styles.blurredContent : ""
          }`}
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
      </div>
    </div>
  );
};

export default BannerComponent;

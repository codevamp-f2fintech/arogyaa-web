"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Button,
} from "@mui/material";
import { FormatQuote } from "@mui/icons-material";
import en from "@/locales/en.json";
import styles from "../page.module.css";
import { fetcher } from "@/apis/apiClient";
import { useTheme } from "@mui/material/styles";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetcher("testimonial", "get-testimonials");
      if (response && response?.results) {
        setTestimonials(response?.results);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }, []);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  const theme = useTheme();

  // Pagination logic
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = testimonials.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(162,143,213,1) 0%, rgba(175,159,219,1) 100%)!important",
      }}
      className={styles.testimonialsSection}
    >
      {/* Title Section */}
      <Box className={styles.testimonialsTitleBox}>
        <Typography
          sx={{
            textAlign: "center",
            color: "#fff !important",
            fontFamily: "Poppins",
            fontSize: "2rem !important",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
          variant="h5"
          component="h5"
          className={styles.title1}
        >
          {en.homepage.testimonials.title1}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            color: "#fff !important",
            fontFamily: "Poppins",
            fontSize: "2.2rem !important",
            letterSpacing: "-0.5px",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {en.homepage.testimonials.title2}
        </Typography>
      </Box>

      {/* Testimonials List */}
      <Box className={styles.testimonialsContainer}>
        {currentItems.length > 0 ? (
          <>
            {currentItems.map((testimonial, index) => (
              <Card
                sx={{
                  backgroundColor: "#29175e !important",
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                }}
                key={index}
                className={styles.testimonialCard}
              >
                <CardContent>
                  {/* Avatar Section */}
                  <Box className={styles.testimonialHeader}>
                    <Avatar
                      src={
                        testimonial?.patientId?.profilePicture ||
                        `https://ui-avatars.com/api/?name=${testimonial?.patientId?.username}`
                      }
                      alt={testimonial?.patientId?.username}
                      className={styles.testimonialAvatar}
                    />
                  </Box>

                  {/* Quote Icon */}
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <FormatQuote sx={{ fontSize: 30, color: "#b497d6" }} />
                  </Box>

                  {/* Review Text */}
                  {testimonial?.review && testimonial?.review.trim() !== "" && (
                    <Typography
                      sx={{
                        color: "white !important",
                        fontWeight: 500,
                        fontFamily: "Poppins",
                      }}
                      variant="body1"
                      className={styles.testimonialDescription}
                    >
                      “{testimonial?.review}”
                    </Typography>
                  )}

                  {/* Doctor's Name */}
                  <Typography
                    variant="h6"
                    className={styles.testimonialName}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                      color: "#fff !important",
                      fontFamily: "Poppins",
                      fontWeight: "550",
                    }}
                  >
                    {testimonial?.doctorId?.username}
                  </Typography>

                  {/* Star Rating */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 1,
                      color: "white",
                    }}
                  >
                    <Rating
                      sx={{
                        "& .MuiRating-icon": {
                          color: "white",
                        },
                        "& .MuiRating-iconFilled": {
                          color: "#ffd700",
                        },
                      }}
                      value={testimonial?.rating}
                      readOnly
                      precision={0.1}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      sx={{
                        backgroundColor:
                          page === currentPage ? "#29175e" : "#fff",
                        color: page === currentPage ? "#fff" : "#29175e",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        minWidth: "40px",
                        height: "40px",
                        "&:hover": {
                          backgroundColor:
                            page === currentPage ? "#29175e" : "#f0f0f0",
                        },
                      }}
                    >
                      {page}
                    </Button>
                  )
                )}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#29175e",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            No testimonials available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Testimonials;

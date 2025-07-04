"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
} from "@mui/material";
import { FormatQuote, Person, Star } from "@mui/icons-material";
import en from "@/locales/en.json";
import styles from "../page.module.css";
import { fetcher } from "@/apis/apiClient";
import { useTheme } from "@mui/material/styles";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetcher("testimonial", "get-testimonials");
      console.log("Fetched Testimonials:", response);

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
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(162,143,213,1) 0%, rgba(175,159,219,1) 100%)!important",
      }}
      className={styles.testimonialsSection}
    >
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

      <Box className={styles.testimonialsContainer}>
        {testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => (
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

                {/* Quote Icon for Review */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FormatQuote sx={{ fontSize: 30, color: "#b497d6" }} />
                </Box>

                {/* Review Text */}
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

                {/* Doctor's Name with Icon */}
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

                {/* Star Rating with Icon */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <Rating
                    sx={{ color: "#ffd700" }}
                    value={testimonial?.rating}
                    readOnly
                    precision={0.1}
                  />
                </Box>
              </CardContent>
            </Card>
          ))
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

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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonial = useCallback(async () => {
    try {
      const response = await fetcher("testimonial", "get-testimonials");
      console.log("Fetched Testimonials:", response);

      if (response && response.results) {
        setTestimonials(response.results);
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

  return (
    <Box className={styles.testimonialsSection}>
      <Box className={styles.testimonialsTitleBox}>
        <Typography variant="h5" component="h5" className={styles.title1}>
          {en.homepage.testimonials.title1}
        </Typography>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "2px",
            color: "black",
          }}
        >
          {en.homepage.testimonials.title2}
        </h1>
      </Box>

      <Box className={styles.testimonialsContainer}>
        {testimonials.length > 0 ? (
          testimonials.map((testimonial, index) => (
            <Card key={index} className={styles.testimonialCard}>
              <CardContent>
                {/* Avatar Section */}
                <Box className={styles.testimonialHeader}>
                  <Avatar
                    src={testimonial?.patientId?.profilePicture || `https://ui-avatars.com/api/?name=${testimonial?.patientId?.username}`}
                    alt={testimonial?.patientId?.username}
                    className={styles.testimonialAvatar}
                  />
                </Box>

                {/* Quote Icon for Review */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <FormatQuote sx={{ fontSize: 30, color: "#20ADA0" }} />
                </Box>

                {/* Review Text */}
                <Typography
                  variant="body1"
                  className={styles.testimonialDescription}
                >
                  “{testimonial.review}”
                </Typography>

                {/* Doctor's Name with Icon */}
                <Typography
                  variant="h6"
                  className={styles.testimonialName}
                  sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}
                >
                 
                  {testimonial.doctorId.username}
                </Typography>

                {/* Star Rating with Icon */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
                 
                  <Rating
                    sx={{ color: "#20ADA0" }}
                    value={testimonial.rating}
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

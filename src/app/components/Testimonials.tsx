"use client";

import { Box, Typography } from "@mui/material";
import SliderComponent from "./common/SliderComponent";

import en from "@/locales/en.json";
import styles from "../page.module.css";
import { useGetTestimonial } from "@/hooks/testimonial";
import { Testimonial } from "@/types/testimonial";

const Testimonials: React.FC = () => {

  const {
    data: testimonials,
    swrLoading,
    error,
  } = useGetTestimonial([], "http://localhost:3000/api/v1/get-testimonials");

  if (swrLoading) return <p>Loading testimonials...</p>;
  if (error) return <p>Failed to load testimonials. Please try again later.</p>;

 
  const mappedTestimonials = testimonials.map((testimonial: Testimonial) => ({
    src: testimonial.src || "/assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png", 
    srcquote: testimonial.srcquote || "/assets/images/icons8-quote-left-100.png",
    description: testimonial.description,
    name: testimonial.patientName, 
    age: testimonial.age || "Unknown", 
  }));

  return (
    <Box
      className={`${styles.testimonialsSection} ${styles.testimonialsBackground}`}
    >
      <Box className={styles.testimonialsTitleBox}>
        <Typography variant="h5" className={styles.testimonialsTitle1}>
          {en.homepage.testimonials.title1}
        </Typography>
        <Typography variant="h2" className={styles.testimonialsTitle2}>
          {en.homepage.testimonials.title2}
        </Typography>
      </Box>
      <SliderComponent images={mappedTestimonials} />
    </Box>
  );
};

export default Testimonials;

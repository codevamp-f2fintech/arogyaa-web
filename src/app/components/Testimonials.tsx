"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
} from "@mui/material";

import en from "@/locales/en.json";
import styles from "../page.module.css";

const Testimonials: React.FC = () => {
  const dummyTestimonials = [
    {
      src: "/assets/images/avatar1.jpg",
      srcquote: "/assets/images/icons8-quote-left-100.png",
      description: "The staff was friendly and very professional. I felt truly cared for!",
      name: "Emily Johnson",
      age: "28",
      rating: 4.8,
    },
    {
      src: "/assets/images/avatar2.jpg",
      srcquote: "/assets/images/icons8-quote-left-100.png",
      description: "The facilities were top-notch, and the service exceeded my expectations.",
      name: "James Carter",
      age: "35",
      rating: 5,
    },
    {
      src: "/assets/images/avatar3.jpg",
      srcquote: "/assets/images/icons8-quote-left-100.png",
      description: "I had an amazing experience! The staff went above and beyond to help.",
      name: "Sophia Lee",
      age: "30",
    
    },
  ];

  return (
    <Box
      className={`${styles.testimonialsSection} ${styles.testimonialsBackground}`}
    >
      <Box className={styles.testimonialsTitleBox}>
        <Typography variant="h5" className={styles.testimonialsTitle1}>
          {en.homepage.testimonials.title1 || "Our Happy Clients"}
        </Typography>
        <Typography variant="h2" className={styles.testimonialsTitle2}>
          {en.homepage.testimonials.title2 || "What People Say About Us"}
        </Typography>
      </Box>

      <Box className={styles.testimonialsContainer}>
        {dummyTestimonials.map((testimonial, index) => (
          <Card key={index} className={styles.testimonialCard}>
            <CardContent>
              <Avatar
                src={testimonial.src}
                alt={testimonial.name}
                className={styles.testimonialAvatar}
              />
              <img
                src={testimonial.srcquote}
                alt="Quote Icon"
                className={styles.quoteIcon}
              />
              <Typography
                variant="body1"
                className={styles.testimonialDescription}
              >
                "{testimonial.description}"
              </Typography>
              <Typography variant="h6" className={styles.testimonialName}>
                {testimonial.name}, Age: {testimonial.age}
              </Typography>
              <Rating value={testimonial.rating} readOnly precision={0.1} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;

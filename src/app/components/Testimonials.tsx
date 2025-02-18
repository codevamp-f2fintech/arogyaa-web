"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import en from "@/locales/en.json";
import styles from "../page.module.css";

const Testimonials = () => {
  const dummyTestimonials = [
    {
      src: "/dr1.png",
      description:
        "The staff was friendly and very careful.They truly cared for all patients!",
      name: "Dr. Tanmay Joshi",

      rating: 4.8,
      video: "#",
    },
    {
      src: "/assets/images/avatar2.jpg",
      description:
        "The facilities were top-notch, and the service exceeded my expectations.",
      name: "Nayni Srividhya",

      rating: 5,
      video: "#",
    },
    {
      src: "/assets/images/avatar3.jpg",
      description:
        "I had an amazing experience! The staff went above and beyond to help.",
      name: "Dr. Medidi Sree",

      rating: 4.9,
      video: "#",
    },
  ];

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
            // border: "2px solid blue",
            color: "black",
            // fontFamily: "Roboto",
          }}
        >
          {en.homepage.testimonials.title2}
        </h1>
      </Box>

      <Box className={styles.testimonialsContainer}>
        {dummyTestimonials.map((testimonial, index) => (
          <Card key={index} className={styles.testimonialCard}>
            <CardContent>
              <Box className={styles.testimonialHeader}>
                <Avatar
                  src={testimonial.src}
                  alt={testimonial.name}
                  className={styles.testimonialAvatar}
                />
                {/* <IconButton className={styles.playButton}>
                  <PlayCircleIcon fontSize="large" />
                </IconButton> */}
              </Box>
              <Typography
                variant="body1"
                className={styles.testimonialDescription}
              >
                “{testimonial.description}”
              </Typography>
              <Typography variant="h6" className={styles.testimonialName}>
                {testimonial.name}
              </Typography>
              <Rating sx={{color:"#20ADA0"}} value={testimonial.rating} readOnly precision={0.1} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;

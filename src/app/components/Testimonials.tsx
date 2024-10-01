import { Box, Typography } from "@mui/material";

import SliderComponent from "./common/SliderComponent";

import en from "@/locales/en.json";

import { images } from "@/data";

import styles from "../page.module.css";

const Testimonials: React.FC = () => {
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
      <SliderComponent images={images} />
    </Box>
  );
};

export default Testimonials;

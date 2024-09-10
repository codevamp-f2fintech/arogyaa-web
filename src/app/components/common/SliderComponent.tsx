/* eslint-disable @next/next/no-img-element */
"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useRef } from "react";
import Slider from "react-slick";

import { Box, Paper, Typography } from "@mui/material";
import styles from "../../page.module.css"; 

interface ImageData {
  src: string;
  srcquote: string;
  description: string;
  name: string;
  age: string;
}

interface SliderComponentProps {
  images: ImageData[];
}

const SliderComponent: React.FC<SliderComponentProps> = ({ images }) => {
  const sliderForRef = useRef<Slider | null>(null);
  const sliderNavRef = useRef<Slider | null>(null);

  const settingsFor = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: sliderNavRef.current,
  };

  const settingsNav = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: sliderForRef.current,
    dots: true,
    centerMode: true,
    focusOnSelect: true,
  };

  return (
    <Box className={styles.sliderContainer}>
      <Box className={styles.sliderForBox}>
        <Slider {...settingsFor} ref={sliderForRef}>
          {images.map((image, index) => (
            <Paper key={index} className={styles.sliderForPaper}>
              <img
                src={image.srcquote}
                alt={`Quote ${index}`}
                className={styles.sliderForQuoteImage}
              />
              <p className={styles.sliderForDescription}>{image.description}</p>
              <Box className={styles.sliderForStarsBox}>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src="/assets/images/filled_star.png"
                    alt={`Star ${i}`}
                    className={styles.sliderForStarImage}
                  />
                ))}
              </Box>
            </Paper>
          ))}
        </Slider>
      </Box>

      <Box>
        <Slider {...settingsNav} ref={sliderNavRef}>
          {images.map((image, index) => (
            <Box key={index} className={styles.sliderNavBox}>
              <Paper className={styles.sliderNavPaper}>
                <img
                  src={image.src}
                  alt={`User ${index}`}
                  className={styles.sliderNavUserImage}
                />
                <Box>
                  <Typography
                    variant="h4"
                    component="h4"
                    className={styles.sliderNavName}
                  >
                    {image.name}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="h4"
                    className={styles.sliderNavAge}
                  >
                    {image.age}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default SliderComponent;

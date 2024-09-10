/* eslint-disable @next/next/no-img-element */
"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Slider from "react-slick";

import { Box, Button, Grid, ImageListItem } from "@mui/material";

import en from "@/locales/en.json";
import styles from "../page.module.css";

import { specialistData } from "@/data";

interface Specialist {
  img: string;
  title: string;
  caption: string;
  readmore: string;
}

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  autoplay: false,
  autoplaySpeed: 3000,
  customPaging: (i) => <div className={styles.customDot}>{i + 1}</div>,
  dotsClass: `slick-dots ${styles.customDots}`,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const SpecialitySlider: React.FC = () => {
  return (
    <>
      <Box className={styles.outerBox}></Box>
      <div>
        <h1 className={styles.specialityTitle}>
          {en.homepage.specialitySlider.title}
        </h1>

        <Slider {...settings}>
          {specialistData.map((item: Specialist, index: number) => (
            <Box className={styles.specialistBox} key={index}>
              <img
                src="/assets/images/speciality-icons/vector_plus.png"
                alt="Icon"
                className={styles.specialistIcon}
              />
              <ImageListItem className={styles.specialistImage}>
                <img
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>

              <h2 className={styles.specialistTitle}>{item.title}</h2>
              <h4 className={styles.specialistCaption}>{item.caption}</h4>
              <Button
                variant="contained"
                className={styles.readMoreButton}
                endIcon={<ArrowCircleRightIcon />}
              >
                {item.readmore}
              </Button>
            </Box>
          ))}
        </Slider>

        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={12} sx={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              className={styles.gridButton}
              endIcon={<ArrowCircleRightIcon />}
            >
              {en.homepage.specialitySlider.buttonText}
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default SpecialitySlider;

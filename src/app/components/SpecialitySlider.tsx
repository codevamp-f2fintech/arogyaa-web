/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid, ImageListItem } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

import en from "@/locales/en.json";
import { AppDispatch, RootState } from "@/redux/store";
import { icons } from "@/static-data";
import { useGetSpecialities } from "@/hooks/specialities";
import {
  setLoading,
  setSpecialities,
} from "@/redux/features/specialitiesSlice";

import styles from "../page.module.css";

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
  customPaging: (i: number) => (
    <div className={styles.customDot}>
      {/* You can add custom content here */}
      {i + 1}
    </div>
  ),
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
  const dispatch: AppDispatch = useDispatch();
  const { specialities } = useSelector(
    (state: RootState) => state.specialities
  );

  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 2,
  });

  const { data } = useGetSpecialities(
    [],
    `http://localhost:4002/api/v1/speciality-service/get-specialities?page=${pageSize.page}&limit=${pageSize.size}`
  );
  console.log("data", data);

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(setSpecialities(data));
    }
  }, [data]);

  const handleFetchNext = () => {
    setPageSize((prevSize) => ({
      ...prevSize,
      size: prevSize.size + 5,
    }));
    dispatch(setLoading(true));
  };

  // Display data logic
  const displayData = specialities.length > 0 ? specialities : [];

  return (
    <>
      <Box className={styles.outerBox}></Box>
      <div>
        <h1 className={styles.specialityTitle}>
          {en.homepage.specialitySlider.title}
        </h1>

        <Slider {...settings}>
          {specialities?.map((item, index: number) => {
            const icon = icons.find((icon) => icon.title === item.name)?.path;
            return (
              <Box className={styles.specialistBox} key={index}>
                <img
                  src="/assets/images/speciality-icons/vector_plus.png"
                  alt="Icon"
                  className={styles.specialistIcon}
                />
                <ImageListItem className={styles.specialistImage}>
                  <img src={icon} alt={item.name} loading="lazy" />
                </ImageListItem>

                <h2 className={styles.specialistTitle}>{item.name}</h2>
                <h4 className={styles.specialistCaption}>{item.description}</h4>
                <Button
                  variant="contained"
                  className={styles.readMoreButton}
                  endIcon={<ArrowCircleRightIcon />}
                >
                  {" "}
                  Consult Now
                </Button>
              </Box>
            );
          })}
        </Slider>

        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={12} sx={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              className={styles.gridButton}
              endIcon={<ArrowCircleRightIcon />}
              onClick={handleFetchNext}
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

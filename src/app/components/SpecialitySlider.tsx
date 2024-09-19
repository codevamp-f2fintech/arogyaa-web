"use client";

import React, { useEffect } from "react";
import Slider from "react-slick";
import { Box, Button, Grid, ImageListItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialities } from "@/redux/features/specialitiesSlice"; // import the async action
import { AppDispatch, RootState } from "@/redux/store";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import en from "@/locales/en.json";
import styles from "../page.module.css";
import { icons } from "@/data";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  autoplay: false,
  autoplaySpeed: 3000,
  customPaging: (i: number) => <div className={styles.customDot}>{i + 1}</div>,
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
  const dispatch = useDispatch<AppDispatch>();

  // Access Redux state
  const { specialities, reduxLoading, error } = useSelector(
    (state: RootState) => state.specialities
  );

  // Fetch specialities when the component mounts
  useEffect(() => {
    dispatch(fetchSpecialities());
  }, [dispatch]);

  if (reduxLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Box
        sx={{
          background: "#F9F6F6",
          padding: "50px",
          height: 50,
          width: "100%",
        }}
      ></Box>
      <div>
        <h1
          style={{
            fontSize: "32px",
            color: "#000",
            lineHeight: "40px",
            fontWeight: 700,
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {en.homepage.specialitySlider.title}
        </h1>

        <Slider {...settings}>
          {specialities?.map((item, index) => {
            const icon = icons.find((icon) => icon.title === item.name)?.path;
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "white",
                  height: "100%",
                  border: "4px solid white",
                  borderRadius: "30px",
                  padding: "20px",
                  position: "relative",
                  boxShadow:
                    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                  textAlign: "center",
                }}
                key={index}
              >
                <img
                  src={"assets/images/speciality-icons/vector_plus.png"}
                  alt="Icon"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                  }}
                />
                <ImageListItem
                  sx={{
                    height: 100,
                    width: 100,
                    background: "#f9f6f6",
                    borderRadius: "100px",
                    padding: "20px",
                  }}
                >
                  <img src={icon} alt={item.name} loading="lazy" />
                </ImageListItem>

                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: "26px",
                    color: "#000",
                    marginTop: "20px",
                  }}
                >
                  {item.name}
                </h2>
                <h4
                  style={{
                    fontSize: "14px",
                    color: "#000",
                    lineHeight: "18px",
                    fontWeight: "400",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {item.description}
                </h4>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: 2,
                    width: "auto",
                    color: "#fff",
                    background: "#20ADA0",
                    borderRadius: "100px",
                    ":hover": {
                      bgcolor: "#20ADA0",
                      color: "white",
                    },
                  }}
                  endIcon={<ArrowCircleRightIcon />}
                >
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
              sx={{
                marginTop: 4,
                marginLeft: 2,
                width: "auto",
                color: "#fff",
                background: "#20ADA0",
                borderRadius: "100px",
                ":hover": {
                  bgcolor: "#20ADA0",
                  color: "white",
                },
              }}
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

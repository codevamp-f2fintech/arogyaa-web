"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Box, Button, Paper, Typography } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  setexpert_specialist_doctor,
  setLoading,
} from "@/redux/features/expert_specialist_doctorSlice";
import { useGetexpert_specialist_doctor } from "@/hooks/expert_specialist_doctor";
import styles from "../page.module.css";
import en from "@/locales/en.json";

const ExpertSpecialistSlider: React.FC = () => {
  const dispatch = useDispatch();

  const { data, swrLoading } = useGetexpert_specialist_doctor(
    [],
    `http://localhost:4004/api/v1/doctor-service/get-doctors`
  );

  const { expert_specialist_doctor, reduxLoading } = useSelector(
    (state: RootState) => state.expert_specialist_doctor
  );

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(setexpert_specialist_doctor(data));
    }
    dispatch(setLoading(swrLoading));
  }, [data, swrLoading, dispatch]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box className={styles.expertSpecialistSlider}>
      <Box className={styles.sliderHeading}>
        <Typography variant="h5" component="h5" className={styles.title1}>
          {en.homepage.expertSpecialistSlider.title1}
        </Typography>
        <Typography variant="h2" component="h2" className={styles.title2}>
          {en.homepage.expertSpecialistSlider.title2}
        </Typography>
      </Box>

      {reduxLoading || swrLoading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <>
          <Slider {...sliderSettings} className={styles.slider}>
            {expert_specialist_doctor.map((doctor) => (
              <div key={doctor._id}>
                <Paper
                  className={styles.specialistCardShort}
                  style={{
                    margin: "0 10px",
                    height: "310px",
                    marginBottom: "15px",
                  }}
                >
                  <Box
                    component="img"
                    className={styles.doctorImage}
                    alt={doctor.username}
                    src={
                      doctor.imageUrl || // Add image URL from API if available
                      "../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png"
                    }
                  />
                  <Typography
                    variant="h4"
                    component="h4"
                    className={styles.drName}
                  >
                    {doctor.username}
                  </Typography>
                  {/* <Typography
                    variant="h6"
                    component="h6"
                    className={styles.field}
                  >
                    {doctor.specializationId
                      .slice(0, Math.ceil(doctor.specializationId.length / 2))
                      .join(", ")}
                    <br />
                    {doctor.specializationId
                      .slice(Math.ceil(doctor.specializationId.length / 2))
                      .join(", ")}
                  </Typography> */}
                  <Typography
                    variant="h6"
                    component="p"
                    className={styles.experience}
                  >
                    {doctor.experienceYears} years of experience
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    className={styles.bio}
                    style={{ marginTop: "10px" }}
                  >
                    {doctor.bio}
                  </Typography>
                </Paper>
              </div>
            ))}
          </Slider>

          <Box
            className={styles.buttonWrapper}
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Link href={`/doctor/list`}>
              <Button
                variant="contained"
                className={styles.learnMoreButton}
                endIcon={<ArrowCircleRightIcon />}
              >
                {en.homepage.expertSpecialistSlider.buttonText}
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ExpertSpecialistSlider;

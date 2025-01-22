"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, Typography } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { setDoctor } from "@/redux/features/doctorSlice";
import { useGetDoctors } from "@/hooks/doctor";
import styles from "../page.module.css";
import en from "@/locales/en.json";
import Loader from "./common/Loader";
import ModalOne from "../components/common/BookAppointmentModal"; 

const ExpertSpecialistSlider: React.FC = () => {
  const { doctor, reduxLoading } = useSelector(
    (state: RootState) => state.doctors
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { value: data, swrLoading } = useGetDoctors(null, "get-doctors", 1, 6);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);


  const openModal = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };


  const closeModal = () => {
    setModalOpen(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      dispatch(setDoctor(data));
    }
  }, [data, dispatch]);

  const sliderSettings = {
    dots: true,
    infinite: false,
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
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
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
        <Loader />
      ) : (
        <>
          <Slider {...sliderSettings} className={styles.slider}>
            {doctor?.results?.map((doctor) => (
              <div key={doctor._id}>
                <Paper
                  className={styles.specialistCardShort}
                  style={{
                    margin: "0 10px",
                    height: "310px",
                    marginBottom: "15px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{
                        fontSize: "24px",
                        color: "#20ADA0",
                        cursor: "pointer",
                        transition: "color 0.3s",
                      }}
                      onClick={() => {
                        router.push(
                          `/doctor/profile/${encodeURIComponent(doctor._id)}`
                        );
                      }}
                    />
                    <BookOnlineIcon
                      sx={{
                        fontSize: "24px",
                        color: "#20ADA0",
                        cursor: "pointer",
                        transition: "color 0.3s",
                      }}
                      onClick={() => openModal(doctor)}
                    />
                  </Box>

                  <Box
                    component="img"
                    className={styles.doctorImage}
                    alt={doctor.username}
                    src={
                      doctor.profilePicture ||
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
                    {doctor.experience} years of experience
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
            <Link href={`/doctor`}>
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

      <ModalOne
        isOpen={isModalOpen}
        onClose={closeModal}
        data={{
          doctorId: selectedDoctor?._id,
          doctorName: selectedDoctor?.username,
          consultationFee: selectedDoctor?.consultationFee,
          address: selectedDoctor?.address,
        }}
      />
    </Box>
  );
};

export default ExpertSpecialistSlider;

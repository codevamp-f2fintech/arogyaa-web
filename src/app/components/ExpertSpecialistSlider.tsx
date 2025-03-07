"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

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
import BookAppointmentModal from "../components/common/BookAppointmentModal";
import { DoctorData } from "@/types/doctor";
import Cookies from "js-cookie";

const ExpertSpecialistSlider: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { doctor, reduxLoading } = useSelector(
    (state: RootState) => state.doctors
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { value: data, swrLoading } = useGetDoctors(null, "get-doctors", 1, 6);

  const openModal = (doctor: DoctorData): void => {
    const userToken = Cookies.get("token");
    if (!userToken) {
      const encodedReturnUrl = encodeURIComponent(
        `/doctors?autoBookDoctorId=${doctor._id}`
      );
      router.push(`/signup?redirect=${encodedReturnUrl}`);
      return;
    }
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    if (data?.results?.length) {
      dispatch(setDoctor(data));
    }
  }, [data, dispatch]);

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true, // This ensures the slider will loop infinitely
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      lazyLoad: "ondemand",
      pauseOnHover: true,
      autoplay: true, // Enables auto-play
      autoplaySpeed: 3000, // Interval between each slide transition in milliseconds
      cssEase: "ease-in-out",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
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
    }),
    []
  );

  return (
    <Box className={styles.expertSpecialistSlider}>
      <Box className={styles.sliderHeading}>
        <Typography variant="h5" component="h5" className={styles.title1}>
          {en.homepage.expertSpecialistSlider.title1}
        </Typography>
        <h1
          id="docoters"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "2px",
            color: "black",
          }}
        >
          {en.homepage.expertSpecialistSlider.title2}
        </h1>
      </Box>

      {reduxLoading || swrLoading ? (
        <Loader />
      ) : (
        <>
          <Slider {...sliderSettings} className={styles.slider}>
            {doctor?.results?.map((doctor) => (
              <div key={doctor._id}>
                <Paper
                  elevation={3}
                  sx={{
                    m: 1,
                    height: "435px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    transition: "all 0.3s ease",
                    backgroundColor: "#FFFFFF",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(32, 173, 160, 0.15)",
                      "& .doctor-image": {
                        transform: "scale(1.05)",
                      },
                    },
                  }}
                >
                  {/* Enhanced Top Banner */}
                  <Box
                    sx={{
                      height: "100px",
                      background:
                        "linear-gradient(135deg, #20ADA0 0%, #0D847A 100%)",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40px",
                        background:
                          "linear-gradient(180deg, transparent 0%, rgba(32, 173, 160, 0.1) 100%)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": { backgroundColor: "#FFFFFF" },
                        }}
                      >
                        <VerifiedIcon
                          sx={{ color: "#20ADA0", fontSize: "20px" }}
                        />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Enhanced Profile Image */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(32, 173, 160, 0.2)",
                    }}
                  >
                    <Box
                      component="img"
                      className="doctor-image"
                      src={
                        doctor.profilePicture ||
                        "../assets/images/online-doctor-with-white-coat.png"
                      }
                      alt={doctor.username}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "transform 0.3s ease",
                      }}
                      onClick={() =>
                        router.push(
                          `/doctors/profile/${encodeURIComponent(doctor._id)}`
                        )
                      }
                    />
                  </Box>

                  {/* Enhanced Content */}
                  <Box sx={{ mt: 6, p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#2C3E50",
                        fontWeight: "600",
                        mb: 1,
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#20ADA0" },
                      }}
                      onClick={() =>
                        router.push(
                          `/doctors/profile/${encodeURIComponent(doctor._id)}`
                        )
                      }
                    >
                      {doctor.username}
                      <LocalHospitalIcon
                        sx={{
                          fontSize: "16px",
                          ml: 1,
                          color: "#20ADA0",
                          verticalAlign: "text-top",
                        }}
                      />
                    </Typography>

                    {/* Enhanced Chips */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          flexWrap: "wrap", // Wrap if too long
                        }}
                      >
                        {doctor.qualificationIds?.map(
                          (qualification, index) => (
                            <Chip
                              key={index}
                              icon={<SchoolIcon sx={{ color: "#20ADA0" }} />}
                              label={qualification.name}
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: "#20ADA0",
                                "&:hover": {
                                  backgroundColor: "rgba(32, 173, 160, 0.05)",
                                  borderColor: "#20ADA0",
                                },
                              }}
                            />
                          )
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          icon={<SchoolIcon sx={{ color: "#20ADA0" }} />}
                          label={`${doctor.experience} Years Exp.`}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#20ADA0",
                            "&:hover": {
                              backgroundColor: "rgba(32, 173, 160, 0.05)",
                              borderColor: "#20ADA0",
                            },
                          }}
                        />

                        <Chip
                          icon={<LocationOnIcon sx={{ color: "#20ADA0" }} />}
                          label={`${doctor.address}`}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#20ADA0",
                            "&:hover": {
                              backgroundColor: "rgba(32, 173, 160, 0.05)",
                              borderColor: "#20ADA0",
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Rating
                      value={doctor.rating || 0} 
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{
                        mb: 2,
                        "& .MuiRating-iconFilled": {
                          color: "#20ADA0",
                        },
                      }}
                    />

                    <Divider
                      sx={{
                        mb: 2,
                        "&::before, &::after": {
                          borderColor: "rgba(32, 173, 160, 0.2)",
                        },
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#7F8C8D",
                        mb: 2,
                        height: "48px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.5,
                        px: 1,
                      }}
                    >
                      {doctor.bio}
                    </Typography>

                    {/* Enhanced Button */}
                    <Button
                      variant="contained"
                      onClick={() => openModal(doctor)}
                      startIcon={<EventIcon />}
                      sx={{
                        bottom: "20px",
                        background: "#20ADA0",
                        borderRadius: "25px",
                        padding: "8px 24px",
                        textTransform: "none",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(32, 173, 160, 0.2)",
                        mb: 2,
                        "&:hover": {
                          background: "#10897F",
                          boxShadow: "0 6px 16px rgba(32, 173, 160, 0.3)",
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Box>
                </Paper>
              </div>
            ))}
          </Slider>

          <Box
            className={styles.buttonWrapper}
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Link href={`/doctors`}>
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

      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedDoctor}
      />
    </Box>
  );
};

export default ExpertSpecialistSlider;

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Rating,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion } from "framer-motion";

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
import BookAppointmentModal from "./common/BookAppointmentModal";
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: isMobile ? 1 : isTablet ? 2 : 4, // 2 cards on tablet
      slidesToScroll: isMobile ? 1 : isTablet ? 2 : 1,
      lazyLoad: "ondemand",
      pauseOnHover: true,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: "ease-in-out",
      responsive: [
        {
          breakpoint: 1200, // Desktop large
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 900, // Tablet landscape
          settings: {
            slidesToShow: 2, // 2 cards for tablet
            slidesToScroll: 2,
            arrows: true,
          },
        },
        {
          breakpoint: 600, // Tablet portrait / mobile
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    }),
    [isMobile, isTablet]
  );

  // Calculate consistent card dimensions
  const getCardDimensions = () => {
    if (isMobile) {
      return {
        height: "520px",
        imageHeight: "200px",
        chipsHeight: "48px",
        bioHeight: "60px",
      };
    }
    if (isTablet) {
      // iPad Mini dimensions - consistent 2-column layout
      return {
        height: "540px",
        imageHeight: "220px",
        chipsHeight: "52px",
        bioHeight: "65px",
      };
    }
    // Desktop
    return {
      height: "560px",
      imageHeight: "240px",
      chipsHeight: "52px",
      bioHeight: "65px",
    };
  };

  const cardDims = getCardDimensions();

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(93,73,147,1) 0%, rgba(93,73,147,1) 100%)!important",
        width: "100vw",
        px: { xs: 2, sm: 3, md: 4 },
        py: 1,
      }}
      className={styles.expertSpecialistSlider}
    >
      {/* Updated heading styling to match old code */}
      <Box className={styles.sliderHeading}>
        <Typography
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "1.8rem",
            marginTop: "2px",
            color: "#fff",
            fontFamily: "Poppins",
            letterSpacing: "0.5px",
            lineHeight: "1.2",
          }}
          variant="h5"
          component="h5"
          className={styles.title1}
        >
          {en.homepage.expertSpecialistSlider.title1}
        </Typography>
        <motion.div
          id="docoters"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "2.5rem",
            fontWeight: 550,
            marginTop: "2px",
            color: "#fff !important",
            fontFamily: "Poppins",
            letterSpacing: "0.5px",
            lineHeight: "1.2",
          }}
          animate={{
            color: ["#fff", "#fff", "#b497d6"],
            textShadow: [
              "0 0 10px rgba(180,151,214,0.5)",
              "0 0 20px rgba(180,151,214,0.8)",
              "0 0 10px rgba(180,151,214,0.5)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {en.homepage.expertSpecialistSlider.title2}
        </motion.div>
      </Box>

      {reduxLoading ? (
        <Loader />
      ) : (
        <>
          {/* Container for consistent tablet layout */}
          <Box
            sx={{
              maxWidth: {
                xs: "100%",
                sm: "768px", // Fixed width for tablet (iPad Mini width)
                md: "100%",
              },
              mx: "auto",
              px: { sm: 2, md: 0 }, // Add padding on tablet for better spacing
            }}
          >
            <Slider {...sliderSettings} className={styles.slider}>
              {doctor?.results?.map((doctor) => (
                <div key={doctor._id}>
                  {/* Card Container with consistent dimensions */}
                  <Paper
                    elevation={3}
                    sx={{
                      m: { xs: 0.5, sm: 1.5 }, // More margin on tablet
                      height: cardDims.height,
                      minHeight: cardDims.height,
                      maxHeight: cardDims.height,
                      borderRadius: "16px",
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.3s ease",
                      backgroundColor: "#b497d6",
                      display: "flex",
                      flexDirection: "column",
                      width: {
                        xs: "95%",
                        sm: "calc(100% - 16px)", // Account for margins
                        md: "auto",
                      },

                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(32, 173, 160, 0.15)",
                        "& .doctor-image": {
                          transform: "scale(1.05)",
                        },
                        "& .verified-badge-text": {
                          opacity: 1,
                          visibility: "visible",
                        },
                        "& .default-icon": {
                          opacity: 0,
                        },
                      },
                    }}
                  >
                    {/* Verified Badge */}
                    {doctor.isVerified && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: { xs: "12px", sm: "14px" },
                          right: { xs: "12px", sm: "14px" },
                          zIndex: 2,
                        }}
                      >
                        <Box
                          className="verified-badge-text"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: "4px", sm: "6px" },
                            opacity: 0,
                            visibility: "hidden",
                            transition:
                              "opacity 0.3s ease, visibility 0s linear 0.3s",
                            backgroundColor: "#29175e",
                            padding: { xs: "3px 6px", sm: "4px 10px" },
                            borderRadius: "30px",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <VerifiedIcon
                            sx={{
                              color: "#fff",
                              fontSize: { xs: "12px", sm: "14px", md: "15px" },
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "Poppins",
                              fontWeight: "500",
                              color: "#fff",
                              fontSize: {
                                xs: "0.6rem",
                                sm: "0.65rem",
                                md: "0.7rem",
                              },
                            }}
                          >
                            Verified
                          </Typography>
                        </Box>

                        <VerifiedIcon
                          className="default-icon"
                          sx={{
                            color: "#fff",
                            fontSize: { xs: "12px", sm: "14px", md: "15px" },
                            position: "absolute",
                            top: "4px",
                            right: "5px",
                            opacity: 1,
                            transition: "opacity 0.3s ease",
                          }}
                        />
                      </Box>
                    )}

                    {/* Image Section */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: cardDims.imageHeight,
                        minHeight: cardDims.imageHeight,
                        flexShrink: 0,
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
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "#29175e",
                          padding: { xs: "8px", sm: "10px" },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: "center",
                            color: "#ffffff",
                            fontSize: {
                              xs: "0.85rem",
                              sm: "0.9rem",
                              md: "1rem",
                            },
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "color 0.2s ease",
                            "&:hover": { color: "#b497d6" },
                          }}
                          onClick={() =>
                            router.push(
                              `/doctors/profile/${encodeURIComponent(
                                doctor._id
                              )}`
                            )
                          }
                        >
                          {doctor.username}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Content Section */}
                    <Box
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      {/* Chips Container */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          gap: { xs: 1, sm: 1.5 },
                          mb: 1,
                          height: cardDims.chipsHeight,
                          minHeight: cardDims.chipsHeight,
                          overflow: "hidden",
                          position: "relative",
                          "&:hover .slider-content": {
                            animationPlayState: "paused",
                          },
                        }}
                      >
                        <Box
                          className="slider-content"
                          sx={{
                            display: "flex",
                            animation: "scroll 20s linear infinite",
                            "@keyframes scroll": {
                              "0%": { transform: "translateX(0)" },
                              "100%": { transform: "translateX(-100%)" },
                            },
                            gap: { xs: 1, sm: 1.5 },
                          }}
                        >
                          {doctor.experience && (
                            <Chip
                              icon={
                                <SchoolIcon
                                  sx={{ color: "#29175e!important" }}
                                />
                              }
                              label={`${doctor.experience} Years Exp.`}
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: "#29175e",
                                color: "#29175e",
                                fontWeight: 500,
                                fontSize: {
                                  xs: "0.65rem",
                                  sm: "0.7rem",
                                  md: "0.8rem",
                                },
                                fontFamily: "Poppins",
                                height: { xs: "26px", sm: "28px", md: "32px" },
                                "&:hover": {
                                  backgroundColor: "rgba(32, 173, 160, 0.05)",
                                  borderColor: "#29175e",
                                },
                              }}
                            />
                          )}

                          <Tooltip
                            title={doctor.clinicAddress}
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  backgroundColor: "#5b4791",
                                  color: "#fff",
                                  fontFamily: "Poppins",
                                  fontWeight: 500,
                                  fontSize: "0.8rem",
                                  padding: "6px 16px",
                                  borderRadius: "8px",
                                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                  maxWidth: "300px",
                                  border: "1px solid #e0e0e0",
                                },
                              },
                            }}
                          >
                            {doctor.clinicAddress && (
                              <Chip
                                icon={
                                  <LocationOnIcon
                                    sx={{ color: "#29175e !important" }}
                                  />
                                }
                                label={
                                  isMobile
                                    ? `${doctor.clinicAddress.substring(
                                        0,
                                        12
                                      )}...`
                                    : `${doctor.clinicAddress.substring(
                                        0,
                                        18
                                      )}...`
                                }
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: "#29175e",
                                  color: "#29175e",
                                  maxWidth: isMobile ? "100px" : "140px",
                                  fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.7rem",
                                    md: "0.8rem",
                                  },
                                  fontWeight: 500,
                                  fontFamily: "Poppins",
                                  height: {
                                    xs: "26px",
                                    sm: "28px",
                                    md: "32px",
                                  },
                                  "&:hover": {
                                    backgroundColor: "#b497d6",
                                    borderColor: "#29175e",
                                  },
                                }}
                              />
                            )}
                          </Tooltip>

                          {doctor.qualificationIds
                            ?.slice(0, 1)
                            .map((qualification, index) => (
                              <Chip
                                key={index}
                                icon={
                                  <SchoolIcon
                                    sx={{
                                      color: "#29175e !important",
                                      fontSize: {
                                        xs: "0.6rem",
                                        sm: "0.65rem",
                                        md: "0.7rem",
                                      },
                                    }}
                                  />
                                }
                                label={
                                  isMobile
                                    ? `${qualification.name.substring(
                                        0,
                                        12
                                      )}...`
                                    : `${qualification.name.substring(
                                        0,
                                        18
                                      )}...`
                                }
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: "#29175e",
                                  color: "#29175e",
                                  fontWeight: 500,
                                  fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.7rem",
                                    md: "0.8rem",
                                  },
                                  fontFamily: "Poppins",
                                  height: {
                                    xs: "26px",
                                    sm: "28px",
                                    md: "32px",
                                  },
                                  "&:hover": {
                                    backgroundColor: "rgba(32, 173, 160, 0.05)",
                                    borderColor: "#29175e",
                                  },
                                }}
                              />
                            ))}
                        </Box>
                      </Box>

                      {/* Rating Section */}
                      <Box sx={{ textAlign: "center", mb: 1 }}>
                        <Rating
                          value={doctor.averageRating || 0}
                          precision={0.5}
                          readOnly
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            mb: 0.1,
                            "& .MuiRating-iconFilled": {
                              color: "yellow",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "#fff",
                            fontSize: {
                              xs: "0.65rem",
                              sm: "0.7rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          {doctor.totalRatingCount > 0
                            ? `(${doctor.totalRatingCount} review${
                                doctor.totalRatingCount > 1 ? "s" : ""
                              })`
                            : "No reviews yet"}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{
                          mb: 1,
                          "&::before, &::after": {
                            borderColor: "rgba(32, 173, 160, 0.2)",
                          },
                        }}
                      />

                      {/* Bio Section */}
                      <Tooltip
                        title={doctor.bio}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#5b4791",
                              color: "#fff",
                              fontFamily: "Poppins",
                              fontSize: "0.85rem",
                              padding: "8px 12px",
                              borderRadius: "8px",
                              maxWidth: "300px",
                              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                            },
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#fff",
                            fontFamily: "Poppins",
                            textAlign: "center",
                            fontWeight: 500,
                            cursor: "pointer",
                            flex: 1,
                            minHeight: cardDims.bioHeight,
                            maxHeight: cardDims.bioHeight,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                            fontSize: {
                              xs: "0.75rem",
                              sm: "0.8rem",
                              md: "0.85rem",
                            },
                            lineHeight: 1.4,
                            mb: 1,
                          }}
                        >
                          {doctor.bio}
                        </Typography>
                      </Tooltip>

                      {/* Button Section - Updated to match old code */}
                      <Box sx={{ mt: "auto", textAlign: "center" }}>
                        <Button
                          variant="contained"
                          onClick={() => openModal(doctor)}
                          startIcon={<EventIcon />}
                          sx={{
                            background: "#29175e",
                            borderRadius: "25px",
                            padding: "8px 24px",
                            mt: 2,
                            textTransform: "none",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 12px rgba(32, 173, 160, 0.2)",
                            "&:hover": {
                              background: "#29175e",
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
                    </Box>
                  </Paper>
                </div>
              ))}
            </Slider>
          </Box>

          <Box
            className={styles.buttonWrapper}
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Link href={`/doctors`}>
              <Button
                sx={{
                  marginTop: "20px",
                  background: "#29175e !important",
                  borderRadius: "25px",
                  padding: "8px 20px",
                  height: { xs: "6vh", md: "7.5vh" },
                  textTransform: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(32, 173, 160, 0.2)",
                  mb: 2,
                  "&:hover": {
                    background: "#29175e",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
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

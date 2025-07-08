"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import Tooltip from "@mui/material/Tooltip";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
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
import { fetcher } from "@/apis/apiClient";

const ExpertSpecialistSlider: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const { doctor, reduxLoading } = useSelector(
    (state: RootState) => state.doctors
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { value: data, swrLoading } = useGetDoctors(null, "get-doctors", 1, 6);
  // const [ratingsMap, setRatingsMap] = useState<
  //   Record<string, { avg: number; count: number }>
  // >({});
  // const [isLoadingRatings, setIsLoadingRatings] = useState(true);

  // Fetch rating stats for a doctor
  // const fetchDoctorRatingStats = useCallback(async (doctorId: string) => {
  //   try {
  //     const response = await fetcher(`/api/doctors/${doctorId}/rating-stats`);
  //     if (response.statusCode === 200) {
  //       return response.data;
  //     }
  //     return { averageRating: 0, totalCount: 0 };
  //   } catch (error) {
  //     console.error("Error fetching rating stats:", error);
  //     return { averageRating: 0, totalCount: 0 };
  //   }
  // }, []);

  // Fetch ratings for all doctors
  // useEffect(() => {
  //   const fetchAllRatings = async () => {
  //     if (!doctor?.results) return;

  //     setIsLoadingRatings(true);
  //     const ratings: Record<string, { avg: number; count: number }> = {};

  //     try {
  //       await Promise.all(
  //         doctor.results.map(async (doc) => {
  //           const stats = await fetchDoctorRatingStats(doc._id);
  //           ratings[doc._id] = {
  //             avg: stats.averageRating,
  //             count: stats.totalCount,
  //           };
  //         })
  //       );

  //       setRatingsMap(ratings);
  //     } catch (error) {
  //       console.error("Error fetching ratings:", error);
  //     } finally {
  //       setIsLoadingRatings(false);
  //     }
  //   };

  //   fetchAllRatings();
  // }, [doctor, fetchDoctorRatingStats]);

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

  // const fetchTestimonials = useCallback(async () => {
  //   try {
  //     if (response && response.results) {
  //       const allTestimonials: Testimonial[] = response.results || [];
  //       const groupedRatings: Record<string, number[]> = {};
  //       if (response && response.results) {
  //         const allTestimonials: Testimonial[] = response.results || [];
  //         const groupedRatings: Record<string, number[]> = {};
  //         allTestimonials.forEach((review) => {
  //           const doctor = review.doctorId;
  //           if (doctor && doctor._id) {
  //             const doctorId = doctor._id;
  //             if (!groupedRatings[doctorId]) {
  //               groupedRatings[doctorId] = [];
  //             }
  //             groupedRatings[doctorId].push(review.rating);
  //           }
  //         });

  //         const finalRatings: Record<string, { avg: number; count: number }> =
  //           {};
  //         Object.entries(groupedRatings).forEach(([doctorId, ratings]) => {
  //           const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  //           finalRatings[doctorId] = {
  //             avg: parseFloat(avg.toFixed(1)),
  //             count: ratings.length,
  //           };
  //         });

  //         setRatingsMap(finalRatings);
  //       }

  //       setRatingsMap(finalRatings);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching testimonials:", error);
  //     console.error("Error fetching testimonials:", error);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchTestimonials();
  // }, [fetchTestimonials]);

  console.log("selectddoc", doctor);

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      lazyLoad: "ondemand",
      pauseOnHover: true,
      autoplay: true,
      autoplaySpeed: 3000,
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
    <Box
      sx={{
        background:
          "linear-gradient(180deg, rgba(93,73,147,1) 0%, rgba(93,73,147,1) 100%)!important",
        width: "100vw",
        px: 4,
        py: 1,
      }}
      // background: 'linear-gradient(180deg, rgba(93,73,147,1) 0%, rgba(104,82,164,1) 100%)',

      className={styles.expertSpecialistSlider}
    >
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
          <Slider {...sliderSettings} className={styles.slider}>
            {doctor?.results?.map((doctor, index) => (
              <div key={doctor._id}>
                <Paper
                  elevation={3}
                  sx={{
                    m: 1,
                    height: { md: "85vh", xs: "85vh" },
                    borderRadius: "16px",
                    overflow: "hidden",
                    position: "relative",
                    transition: "all 0.3s ease",
                    backgroundColor: "#b497d6",
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
                  {/* Conditionally render verified badge only if doctor is verified */}
                  {doctor.isVerified && (
                    <Box
                      sx={{
                        top: "1%",
                        right: "10%",
                        backgroundColor: "#b497d6",
                        position: "absolute",
                        zIndex: 2,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "40px",
                        },
                      }}
                    >
                      {/* Verified Badge Box (Text + Icon) */}
                      <Box
                        className="verified-badge-text"
                        sx={{
                          position: "absolute",
                          top: "6px",
                          right: "1px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          opacity: 0,
                          visibility: "hidden", // Initially hidden
                          transition:
                            "opacity 0.3s ease, visibility 0s linear 0.3s",
                          backgroundColor: "#29175e",
                          padding: "3px 10px",
                          borderRadius: "30px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                          fontSize: "1rem",
                          color: "#fff",
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {/* Verified Icon inside the text badge */}
                        <VerifiedIcon
                          sx={{
                            color: "#fff",
                            fontSize: "15px",
                          }}
                        />
                        {/* Text */}
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontWeight: "500",
                            color: "#fff",
                            fontSize: "0.7rem",
                          }}
                        >
                          Verified
                        </Typography>
                      </Box>

                      <VerifiedIcon
                        className="default-icon"
                        sx={{
                          color: "#fff",
                          fontSize: "15px",
                          position: "absolute",
                          top: "4px",
                          right: "5px",
                          opacity: 1,
                          transition: "opacity 0.3s ease",
                        }}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "40vh",
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
                        height: "90%",
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
                        top: "76%",
                        width: "100%",
                        display: "flex",
                        padding: "5px",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "10vh",
                        backgroundColor: "#29175e",
                        borderRadius: "5%",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          textAlign: "center",
                          margin: "0 auto",
                          zIndex: 2,
                          color: "#ffffff",
                          fontSize: "1rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                          "&:hover": { color: "#b497d6" },
                        }}
                        onClick={() =>
                          router.push(
                            `/doctors/profile/${encodeURIComponent(doctor._id)}`
                          )
                        }
                      >
                        {doctor.username}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Enhanced Content */}
                  <Box sx={{ marginTop: "2vh", p: 2, textAlign: "center" }}>
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
                      {/* Top row: Qualification + Experience */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {doctor.qualificationIds?.map(
                          (qualification, index) => (
                            <Chip
                              key={index}
                              icon={
                                <SchoolIcon
                                  sx={{
                                    color: "#29175e !important",
                                    fontSize: "0.7rem",
                                  }}
                                />
                              }
                              label={qualification.name}
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: "#29175e",
                                color: "#29175e",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                fontFamily: "Poppins",
                                "&:hover": {
                                  backgroundColor: "rgba(32, 173, 160, 0.05)",
                                  borderColor: "#29175e",
                                },
                              }}
                            />
                          )
                        )}

                        <Chip
                          icon={
                            <SchoolIcon sx={{ color: "#29175e!important" }} />
                          }
                          label={`${doctor.experience} Years Exp.`}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "#29175e",
                            color: "#29175e",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            fontFamily: "Poppins",
                            "&:hover": {
                              backgroundColor: "rgba(32, 173, 160, 0.05)",
                              borderColor: "#29175e",
                            },
                          }}
                        />
                      </Box>

                      {/* Bottom: Location only */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 1,
                        }}
                      >
                        <Tooltip
                          title={doctor.clinicAddress}
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: "#5b4791", // light transparent gray
                                color: "#fff",
                                fontFamily: "Poppins",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                padding: "6px 16px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                                maxWidth: "300px",
                                border: "1px solid #e0e0e0",
                                transition: "background-color 0.3s ease",
                              },
                            },
                          }}
                        >
                          <Chip
                            icon={
                              <LocationOnIcon
                                sx={{ color: "#29175e !important" }}
                              />
                            }
                            label={`${doctor.clinicAddress}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: "#29175e",
                              color: "#29175e",
                              width: "10vw",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              fontFamily: "Poppins",
                              "&:hover": {
                                backgroundColor: "#b497d6",
                                borderColor: "#29175e",
                              },
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Rating */}
                    <Rating
                      value={doctor.averageRating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                      sx={{
                        mb: 0.1,
                        "& .MuiRating-iconFilled": {
                          color: "yellow",
                        },
                      }}
                    />
                    <br />
                    <Typography
                      variant="caption"
                      sx={
                        {
                          /* styles */
                        }
                      }
                    >
                      {doctor.totalRatingCount > 0
                        ? `(based on ${doctor.totalRatingCount} patient${
                            doctor.totalRatingCount > 1 ? "s" : ""
                          })`
                        : "No reviews yet"}
                    </Typography>

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
                        color: "#fff",
                        // height: "8vh",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.5,
                        px: 1,
                        fontFamily: "Poppins",
                        width: "100%",
                        textAlign: "center",
                        margin: "0 auto",
                        fontWeight: 500,
                        "&:hover": {
                          textShadow:
                            "0px 6px 12px rgba(0, 0, 0, 0.4), 0px 12px 24px rgba(0, 0, 0, 0.3)",
                          transform: "scale(1.05)",
                        },
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
                        marginTop: "16px",
                        background: "#29175e",
                        borderRadius: "25px",
                        padding: "8px 24px",
                        textTransform: "none",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(32, 173, 160, 0.2)",
                        mb: 2,
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

"use client";
import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Box, Paper, Typography, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import type { AppDispatch, RootState } from "@/redux/store";
import { useGetSpeciality } from "@/hooks/speciality";
import { setSpeciality } from "@/redux/features/specialitySlice";
import Loader from "./common/Loader";
import SpecialistCard from "./SpecialistCard";
import { motion } from "framer-motion";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import en from "@/locales/en.json";

const SpecialitySlider: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { speciality } = useSelector((state: RootState) => state.specialities);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 200,
  });

  const { value: data, swrLoading } = useGetSpeciality(
    null,
    "get-specialities",
    pageSize.page,
    pageSize.size
  );

  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      dispatch(setSpeciality(data));
    }
  }, [data, dispatch]);

  const handleFetchNext = useCallback(() => {
    setPageSize((prevSize) => ({
      ...prevSize,
      page: prevSize.page + 1,
    }));
  }, []);

  const handleConsult = useCallback(
    (specialtyName: string) => {
      router.push(`/doctors?keyword=${encodeURIComponent(specialtyName)}`);
    },
    [router]
  );

  const sliderSettings = useMemo(() => {
    // Detect if we're on a mobile device using window.innerWidth
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;

    return {
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplaySpeed: isMobile ? 3000 : 3000, // Slower on mobile: 5 seconds vs 2.5 seconds
      lazyLoad: "progressive",
      pauseOnHover: true,
      autoplay: true,
      cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplaySpeed: 3000, // 3 seconds for tablets
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplaySpeed: 4000, // 4 seconds for small tablets
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            autoplaySpeed: 5000, // 5 seconds for mobile phones
          },
        },
      ],
    };
  }, []);
  const theme = useTheme();
  console.log("color", theme.palette.secondary.main);

  return (
    <Box
      id="specialitiesSection"
      sx={{
        background: "rgb(104,82,164)",
        background:
          "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)!important",
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: "1400px !important",
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: { xs: 4, md: 6 },
            fontSize: { xs: "1.7rem", sm: "2.5rem", md: "2.5rem" },
            fontWeight: 600,
            fontFamily: "Poppins",
            color: "black",
            letterSpacing: "-0.10px",
            lineHeight: 1.2,
            width: {
              xs: "90vw",
            },
            marginLeft: { xs: "0px", md: "inherit" },
          }}
        >
          {en.homepage.specialitySlider.title} {/* This is shown first */}
          <motion.span
            sx={{
              mb: { xs: 4, md: 6 },
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "2.5rem" },
              fontWeight: 600,
              fontFamily: "Poppins",
              color: "black",
              letterSpacing: "-0.10px",
              lineHeight: 1.2,
              border: "1px solid yellow",
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
            {en.homepage.specialitySlider.title2}{" "}
            {/* This is shown at the end */}
          </motion.span>
        </Typography>

        <Box>
          {speciality && speciality?.results?.length > 0 ? (
            <Slider {...sliderSettings}>
              {speciality.results.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    height: "100%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      height: { md: "100%" },
                      width: {
                        xs: "85vw",
                        md: "inherit",
                      },
                      ml: 0.6,
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: (theme) => theme.shadows[8],
                      },
                    }}
                  >
                    <SpecialistCard
                      icon={item?.icon || ""}
                      name={item.name}
                      description={item.description.slice(0, 90) + "..."}
                      onConsult={() => handleConsult(item.name)}
                    />
                  </Paper>
                </Box>
              ))}
            </Slider>
          ) : (
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "text.secondary",
                py: 8,
              }}
            >
              No Specialities Found
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 8,
          }}
        >
          {swrLoading && <Loader />}
        </Box>
      </Container>
    </Box>
  );
};

export default SpecialitySlider;

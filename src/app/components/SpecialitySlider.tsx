"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Box, Paper, Typography, Container, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import type { AppDispatch, RootState } from "@/redux/store";
import { useGetSpeciality } from "@/hooks/speciality";
import { setSpeciality } from "@/redux/features/specialitySlice";
import Loader from "./common/Loader";
import SpecialistCard from "./SpecialistCard";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import en from "@/locales/en.json";

const SpecialitySlider = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const { speciality } = useSelector((state: RootState) => state.specialities);
  const [pageSize] = useState({ page: 1, size: 200 });
  const { value: data, swrLoading } = useGetSpeciality(
    null,
    "get-specialities",
    pageSize.page,
    pageSize.size
  );
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    if (data?.results?.length > 0) {
      dispatch(setSpeciality(data));
    }
  }, [data, dispatch]);

  // Infinite scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval);
  }, []);

  const handleConsult = useCallback(
    (specialtyName: string) => {
      router.push(`/doctors?keyword=${encodeURIComponent(specialtyName)}`);
    },
    [router]
  );

  const sliderSettings = useMemo(
    () => ({
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplaySpeed: 3000,
      lazyLoad: "progressive",
      pauseOnHover: true,
      autoplay: false, // Disable built-in autoplay since we're implementing our own
      cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    }),
    []
  );

  return (
    <Box
      id="specialitiesSection"
      sx={{
        background:
          "linear-gradient(180deg, rgba(104,82,164,1) 0%, rgba(126,107,177,1) 100%)",
        width: "100vw",
        minHeight: "80vh",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 0, sm: 6, md: 8 },
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
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            display: "flex", // ✅ Flex to align inline items
            justifyContent: "center", // ✅ Center horizontally
            alignItems: "center", // ✅ Align vertically if multi-line
            flexWrap: "wrap", // ✅ Wrap text if needed
            textAlign: "center",
            mb: { xs: 4, md: 6 },
            fontSize: { xs: "1.7rem", sm: "2.5rem", md: "2.5rem" },
            fontWeight: 600,
            fontFamily: "Poppins",
            color: "white",
            letterSpacing: "-0.10px",
            lineHeight: 1.2,
            width: { xs: "90vw", md: "100%" },
            mx: "auto",
          }}
        >
          <span>{en.homepage.specialitySlider.title}</span>
          <motion.span
            style={{ display: "inline-block", marginLeft: "8px" }}
            animate={{
              color: ["#fff", "#b497d6", "#fff"],
              textShadow: [
                "0 0 8px rgba(180,151,214,0.5)",
                "0 0 16px rgba(180,151,214,0.8)",
                "0 0 8px rgba(180,151,214,0.5)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {en.homepage.specialitySlider.title2}
          </motion.span>
        </Typography>

        <Box sx={{ position: "relative" }}>
          {swrLoading ? (
            <Loader />
          ) : speciality?.results?.length > 0 ? (
            <Slider ref={sliderRef} {...sliderSettings}>
              {speciality.results.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    px: 1,
                    py: 2,
                    outline: "none",
                    "&:focus": { outline: "none" },
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 24px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <SpecialistCard
                      icon={item?.icon || "/default-icon.svg"}
                      name={item.name}
                      description={
                        item.description.length > 90
                          ? `${item.description.slice(0, 90)}...`
                          : item.description
                      }
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
                color: "white",
                py: 8,
                fontFamily: "Poppins",
              }}
            >
              No Specialities Found
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SpecialitySlider;

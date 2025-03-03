"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid, Paper, Typography, Container } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import en from "@/locales/en.json";
import { AppDispatch, RootState } from "@/redux/store";
import { icons } from "@/static-data";
import { useGetSpeciality } from "@/hooks/speciality";
import { setSpeciality } from "@/redux/features/specialitySlice";
import Loader from "./common/Loader";
import SpecialistCard from "./SpecialistCard";

const SpecialitySlider: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { speciality } = useSelector((state: RootState) => state.specialities);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 6,
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

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplaySpeed: 3000,
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
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
          },
        },
      ],
    }),
    []
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: "1400px",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6, md: 8 },
        background: "#f9f6f6",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          mb: { xs: 4, md: 6 },
          fontSize: { xs: "2rem", sm: "2.5rem", md: "2.5rem" },
          fontWeight: 600,
          // fontFamily: "Roboto",
          color: "black",
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}
      >
        {en.homepage.specialitySlider.title}
      </Typography>

      <Box
        // sx={{
        //   ".slick-slide": {
        //     px: 1.5,
        //   },
        //   ".slick-dots": {
        //     bottom: -40,
        //     "& li button:before": {
        //       fontSize: 12,
        //       color: "#20ada0",
        //       opacity: 0.4,
        //     },
        //     "& li.slick-active button:before": {
        //       opacity: 1,
        //     },
        //   },
        //   ".slick-prev, .slick-next": {
        //     zIndex: 1,
        //     width: 40,
        //     height: 40,
        //     "&:before": {
        //       fontSize: 40,
        //       color: "#20ada0",
        //     },
        //   },
        //   ".slick-prev": {
        //     left: { xs: -20, md: -40 },
        //   },
        //   ".slick-next": {
        //     right: { xs: -20, md: -40 },
        //   },
        // }}
      >
        <Slider {...sliderSettings}>
          {speciality && speciality?.results?.length > 0 ? (
            speciality.results.map((item) => {
              const icon = icons.find(
                (icon) => icon.title === item.name.toLowerCase()
              )?.path;
              return (
                <Box
                  key={item._id}
                  sx={{
                    height: "100%",
                    p: 1,
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      height: "100%",
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
                      icon={icon}
                      name={item.name}
                      description={item.description.slice(0, 90) + "..."}
                      onConsult={() => handleConsult(item.name)}
                    />
                  </Paper>
                </Box>
              );
            })
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
        </Slider>
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
  );
};

export default SpecialitySlider;
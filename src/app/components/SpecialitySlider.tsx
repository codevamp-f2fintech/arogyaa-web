"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
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
    (id: string) => {
      // router.push(`/doctor/profile/${encodeURIComponent(id)}`);
      router.push("/doctor");
      console.log(id, "consult click");
    },
    [router]
  );

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplay: true,
      autoplaySpeed: 3000,
      lazyLoad: "progressive",
      pauseOnHover: true,
      cssEase: "ease-in-out",
      dotsClass: "slick-dots custom-dots",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    []
  );

  return (
    <Box sx={{ maxWidth: "1300px", margin: "0 auto" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "20px", marginTop: "50px" }}
      >
        {en.homepage.specialitySlider.title}
      </h1>

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
                  position: "relative",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  maxHeight: "800px",
                  "@media (max-width: 1024px)": {
                    margin: "8px",
                    padding: "8px",
                  },
                  "@media (max-width: 600px)": {
                    margin: "5px",
                    padding: "5px",
                  },
                }}
              >
                <SpecialistCard
                  icon={icon}
                  name={item.name}
                  description={item.description.slice(0, 100) + "..."}
                  onConsult={() => handleConsult(item._id)}
                />
                <Box
                  sx={{
                    position: "absolute",
                    borderRadius: "20px",
                    bottom: 78,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(145deg, #20ADA0, #17a98d)",
                    color: "#fff",
                    padding: "10px 10px",
                    opacity: 0,
                    transition: "opacity 0.3s, transform 0.3s ease-in-out",
                    transform: "translateY(10px)",
                    "&:hover": {
                      opacity: 1,
                      transform: "translateY(0)",
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    },
                    fontSize: "14px",
                    textAlign: "center",

                    letterSpacing: "0.5px",

                    "@media (max-width: 1024px)": {
                      fontSize: "12px",
                      padding: "8px 16px",
                    },
                    "@media (max-width: 600px)": {
                      fontSize: "10px",
                      padding: "6px 12px",
                    },
                  }}
                >
                  {item.description}
                </Box>
              </Box>
            );
          })
        ) : (
          <div>No Specialities Found</div>
        )}
      </Slider>

      <Grid
        sx={{ mt: 2 }}
        container
        spacing={2}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid
          xs={12}
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "40px",
          }}
        >
          {swrLoading && <Loader />}

          <Button
            variant="contained"
            endIcon={<ArrowCircleRightIcon />}
            onClick={handleFetchNext}
            sx={{
              background: "#20ADA0",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "30px",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "#20ADA0",
              },
            }}
          >
            {en.homepage.specialitySlider.buttonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SpecialitySlider;

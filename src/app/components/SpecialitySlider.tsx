"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useRouter } from 'next/navigation';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import en from "@/locales/en.json";
import { AppDispatch, RootState } from "@/redux/store";
import { icons } from "@/static-data";
import { useGetSpeciality } from "@/hooks/speciality";
import { setSpeciality } from "@/redux/features/specialitySlice";

import styles from "../page.module.css";
import Loader from "./common/Loader";
import SpecialistCard from "./SpecialistCard";

const SpecialitySlider: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { speciality, reduxLoading } = useSelector(
    (state: RootState) => state.specialities
  );
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 6,
  });

  const {
    value: data,
    swrLoading,
    error,
  } = useGetSpeciality(null, "get-specialities", pageSize.page, pageSize.size);

  // Update Redux store with fetched data
  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      dispatch(setSpeciality(data));
    }
  }, [data, dispatch]);

  // Fetch next set of specialities
  const handleFetchNext = useCallback(() => {
    setPageSize((prevSize) => ({
      ...prevSize,
      page: prevSize.page + 1,
      size: prevSize.size + 5,
    }));
  }, [dispatch]);

  const handleConsult = useCallback((id: string) => {
    // router.push(`/doctor/profile/${encodeURIComponent(id)}`);
    router.push('/doctor');
    console.log(id, 'consult click')
  }, [router]);

  // Slider settings memoization to prevent re-renders
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: false,
    autoplaySpeed: 3000,
    lazyLoad: 'ondemand',
    customPaging: (i: number) => (
      <div className={styles.customDot}>
        {i + 1}
      </div>
    ),
    dotsClass: `slick-dots ${styles.customDots}`,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
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
  }), []);

  return (
    <>
      <Box className={styles.outerBox}></Box>
      <div>
        <h1 className={styles.specialityTitle}>
          {en.homepage.specialitySlider.title}
        </h1>

        <Slider {...sliderSettings}>
          {speciality && speciality?.results?.length > 0 ?
            speciality.results.map((item) => {
              const icon = icons.find((icon) => icon.title === item.name.toLowerCase())?.path;
              return (
                <SpecialistCard
                  key={item._id}
                  icon={icon}
                  name={item.name}
                  description={item.description}
                  onConsult={() => handleConsult(item._id)}
                />
              );
            })
            : <div>No Specialities Found</div>
          }
        </Slider>

        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={12} sx={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              className={styles.gridButton}
              endIcon={<ArrowCircleRightIcon />}
              onClick={handleFetchNext}
            >
              {en.homepage.specialitySlider.buttonText}
            </Button>
          </Grid>
        </Grid>

        {swrLoading && <Loader />}
      </div>
    </>
  );
};

export default SpecialitySlider;

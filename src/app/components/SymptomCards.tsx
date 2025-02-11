/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  Box,
  Button,
  CardMedia,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import en from "@/locales/en.json";
import styles from "../page.module.css";

import type { AppDispatch, RootState } from "@/redux/store";
import { symptomsList } from "@/static-data";
import { setSymptom, setLoading } from "@/redux/features/symptomsSlice";
import { useGetSymptom } from "@/hooks/symptoms";
import { useRouter } from "next/navigation";

const screens = {
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
  "2xl": "1920px",
};

const SymptomCards: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { symptom, reduxLoading } = useSelector((state: RootState) => state.symptoms);
  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 6,
  });

  const {
    value: data,
    swrLoading,
    error,
  } = useGetSymptom(null, "get-symptoms", pageSize.page, pageSize.size);

  // Update Redux store with fetched data
  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      dispatch(setSymptom(data));
    }
  }, [data, dispatch]);

  const handleFetchNext = useCallback(() => {
    setPageSize((prevSize) => ({
      ...prevSize,
      page: prevSize.page + 1,
      size: prevSize.size + 5,
    }));
  }, [dispatch]);

  return (
    <Box className={styles.symptomBox}>
      <Typography variant="h2" component="h2" className={styles.symptomTitle}>
        <span className={styles.symptomTitleSpan}>
          {en.homepage.symptomCards.title1}
        </span>
        <br />
        {en.homepage.symptomCards.title2}
      </Typography>

      <Grid container spacing={2}>
        {symptom && symptom?.results?.length > 0 ? (
          symptom.results.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              key={item._id}
              sx={{
                [`@media (min-width: ${screens.sm})`]: { width: "50%" },
                [`@media (min-width: ${screens.md})`]: { width: "33.33%" },
                [`@media (min-width: ${screens.lg})`]: { width: "25%" },
                [`@media (min-width: ${screens.xl})`]: { width: "16.66%" },
              }}
            >
              <Paper elevation={3} className={styles.symptomPaper}>
                <CardMedia
                  component="img"
                  className={styles.symptomCardMedia}
                  image={item.icon}
                  alt={item.icon}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    component="h5"
                    className={styles.symptomCardTitle}
                  >
                    {item.name}
                  </Typography>

                  <Button
                    variant="contained"
                    className={styles.symptomButton}
                    endIcon={<ArrowCircleRightIcon />}
                    onClick={() => router.push("/doctor")}
                  >
                    Consult Now
                  </Button>
                </CardContent>
              </Paper>
            </Grid>
          ))
        ) : (
          <div>No Symptoms Found</div>
        )}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            className={styles.gridButton}
            endIcon={<ArrowCircleRightIcon />}
            onClick={handleFetchNext}
          >
            {en.homepage.symptomCards.buttonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SymptomCards;

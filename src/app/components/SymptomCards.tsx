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

      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        {symptom && symptom?.results?.length > 0 ?
          symptom.results.map((item) => {
            const icon = symptomsList.find((icon) => icon.title === item.name)?.image;
            return (
              <Grid item xs={3} className={styles.symptomGrid} key={item._id}>
                <Paper elevation={3} className={styles.symptomPaper}>
                  <CardMedia
                    component="img"
                    className={styles.symptomCardMedia}
                    image={icon}
                    alt={icon}
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
                      onClick={() => router.push('/doctor')}
                    >
                      Consult Now
                    </Button>
                  </CardContent>
                </Paper>
              </Grid>
            );
          })
          : <div>No Symptoms Found</div>
        }
      </Grid>

      <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
        <Grid xs={12} sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            className={styles.gridButton}
            endIcon={<ArrowCircleRightIcon />}
          // onClick={handleFetchNext}
          >
            {en.homepage.symptomCards.buttonText}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SymptomCards;

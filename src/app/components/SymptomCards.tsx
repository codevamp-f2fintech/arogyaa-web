/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
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
import { icons } from "@/static-data";
import { setSymptoms, setLoading } from "@/redux/features/symptomsSlice";
import { useGetSymptoms } from "@/hooks/symptoms";

const SymptomCards: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { symptoms } = useSelector((state: RootState) => state.symptoms);

  const [pageSize, setPageSize] = useState({
    page: 1,
    size: 8,
  });

  // Fetch data from the API
  const { data } = useGetSymptoms(
    [],
    `http://localhost:4002/api/v1/symptom-service/get-symptoms`
  );
  console.log(data);
  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(setSymptoms(data));
    }
  }, [data]);

  const handleFetchNext = () => {
    setPageSize((prevSize) => ({
      ...prevSize,
      size: prevSize.size + 5,
    }));
    dispatch(setLoading(true));
  };

  // Display data logic
  const displayData = symptoms.length > 0 ? symptoms : [];

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
        {displayData.slice(0, pageSize.size).map((item) => {
          const icon = icons.find((icon) => icon.title === item.name)?.path;

          return (
            <Grid item xs={3} className={styles.symptomGrid} key={item.id}>
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
                  >
                    Consult Now
                  </Button>
                </CardContent>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
        <Grid xs={12} sx={{ textAlign: "center", marginTop: "20px" }}>
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

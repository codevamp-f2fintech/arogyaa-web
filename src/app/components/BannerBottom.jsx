import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  Box,
  Button,
  InputBase,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import en from "@/locales/en.json";
import styles from "../page.module.css";

const BannerBottom = () => {
  return (
    <Box sx={{ border: "2px solid pink" }} className={styles.bannerBottom}>
      <Box
        component="img"
        className={styles.bannerImage3}
        alt="Doctor"
        src="/assets/images/doctor-with-his-arms-crossed-white-background.png"
      />
      <Grid sx={{border:"black"}}
        container
        spacing={2}
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.gridContainer}
      >
        <Grid item xs={6}></Grid>
        <Grid item xs={6} className={styles.gridItem}>
          <CardContent className={styles.cardContent}>
            <Typography
              variant="h5"
              component="span"
              className={styles.cardTitle2}
            >
              {en.homepage.bannerBottom.make_your_health}
            </Typography>
            <Typography
              variant="h4"
              component="h4"
              className={styles.cardSubtitle2}
            >
              {en.homepage.bannerBottom.overlook}
            </Typography>
          </CardContent>

          <Button
            variant="contained"
            className={styles.callToActionButton}
            endIcon={<ArrowCircleRightIcon />}
          >
            {en.homepage.bannerBottom.buttonText}
          </Button>

          <Box
            className={styles.formContainer}
          >
            <h1 className={styles.formHeading}>
              {en.homepage.bannerComponent.request}
            </h1>
            <p className={styles.formDescription}>
              {en.homepage.bannerComponent.description}
            </p>
            <Paper component="form" className={styles.inputPaper}>
              <InputBase
                className={styles.inputBase}
                placeholder="Name"
                inputProps={{ "aria-label": "Name" }}
              />
            </Paper>
            <Paper component="form" className={styles.inputPaper}>
              <InputBase
                className={styles.inputBase}
                placeholder="Phone Number"
                inputProps={{ "aria-label": "Phone Number" }}
              />
            </Paper>
            <Box className={styles.submitButtonContainer}>
              <Button
                variant="contained"
                className={styles.submitButton}
                endIcon={<ArrowCircleRightIcon />}
              >
                {en.homepage.bannerComponent.buttonText}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BannerBottom;

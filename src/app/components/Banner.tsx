import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {
  Box,
  Button,
  CardContent,
  Grid,
  Paper,
  InputBase,
  Typography,
} from "@mui/material";

import en from "@/locales/en.json";

import styles from "../page.module.css";

const BannerComponent: React.FC = () => {
  return (
    <div className={styles.homebanner}>
      <div className={styles.bannerContent}>
        <Box
          component="img"
          className={styles.bannerImage}
          alt="The house from the offer."
          src={"/assets/images/dr1.png"}
        />
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={6}>
            <div className={styles.bannerTextWrapper}>
              <h1 className={styles.bannerHeading}>
                {en.homepage.bannerComponent.request}
              </h1>
              <p className={styles.bannerDescription}>
                {en.homepage.bannerComponent.description}
              </p>
              <Paper component="form" className={styles.inputPaper}>
                <InputBase
                  className={styles.inputBase}
                  placeholder="Name"
                  inputProps={{ "aria-label": "name" }}
                />
              </Paper>
              <Paper component="form" className={styles.inputPaper}>
                <InputBase
                  className={styles.inputBase}
                  placeholder="Phone Number"
                  inputProps={{ "aria-label": "phone number" }}
                />
              </Paper>

              <Box className={styles.submitButtonWrapper}>
                <Button
                  variant="contained"
                  className={styles.submitButton}
                  endIcon={<ArrowCircleRightIcon />}
                >
                  {en.homepage.bannerComponent.buttonText}
                </Button>
              </Box>
            </div>
          </Grid>
        </Grid>

        <CardContent className={styles.bannerCardContent}>
          <Typography
            variant="h5"
            component="span"
            className={styles.bannerBestMedical}
          >
            {en.homepage.bannerComponent.the_best_medical}
          </Typography>
          <Typography
            variant="h4"
            component="h4"
            className={styles.bannerTreatment}
          >
            {en.homepage.bannerComponent.treatment}
          </Typography>
        </CardContent>
      </div>
    </div>
  );
};

export default BannerComponent;

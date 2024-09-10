import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import en from "@/locales/en.json";
import styles from "../page.module.css";

const ExpertSpecialistSlider: React.FC = () => {
  return (
    <Box className={styles.expertSpecialistSlider}>
      <Box className={styles.sliderHeading}>
        <Typography variant="h5" component="h5" className={styles.title1}>
          {en.homepage.expertSpecialistSlider.title1}
        </Typography>
        <Typography variant="h2" component="h2" className={styles.title2}>
          {en.homepage.expertSpecialistSlider.title2}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper className={styles.specialistCardShort}>
            <Box
              component="img"
              className={styles.doctorImage}
              alt="Doctor"
              src={
                "../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png"
              }
            />
            <Typography variant="h4" component="h4" className={styles.drName}>
              {en.homepage.expertSpecialistSlider.drName}
            </Typography>
            <Typography variant="h6" component="h6" className={styles.field}>
              {en.homepage.expertSpecialistSlider.field}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              className={styles.experience}
            >
              {en.homepage.expertSpecialistSlider.experiance}
            </Typography>
          </Paper>
          <Box className={styles.buttonWrapper}>
            <Button
              variant="contained"
              className={styles.learnMoreButton}
              endIcon={<ArrowCircleRightIcon />}
            >
              {en.homepage.expertSpecialistSlider.buttonText}
            </Button>
          </Box>
        </Grid>

        <Grid item xs>
          <Paper className={styles.specialistCard}>
            <Box
              component="img"
              className={styles.doctorImage}
              alt="Doctor"
              src={
                "/assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png"
              }
            />
            <Typography variant="h4" component="h4" className={styles.drName}>
              {en.homepage.expertSpecialistSlider.drName}
            </Typography>
            <Typography variant="h6" component="h6" className={styles.field}>
              {en.homepage.expertSpecialistSlider.field}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              className={styles.experience}
            >
              {en.homepage.expertSpecialistSlider.experiance}
              <br />
              {en.homepage.expertSpecialistSlider.randomText} <br />
              {en.homepage.expertSpecialistSlider.randomText}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs>
          <Paper className={styles.specialistCard}>
            <Box
              component="img"
              className={styles.doctorImage}
              alt="Doctor"
              src={
                "../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png"
              }
            />
            <Typography variant="h4" component="h4" className={styles.drName}>
              {en.homepage.expertSpecialistSlider.drName}
            </Typography>
            <Typography variant="h6" component="h6" className={styles.field}>
              {en.homepage.expertSpecialistSlider.field}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              className={styles.experience}
            >
              {en.homepage.expertSpecialistSlider.experiance}
              <br />
              {en.homepage.expertSpecialistSlider.randomText} <br />
              {en.homepage.expertSpecialistSlider.randomText}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs>
          <Paper className={styles.specialistCard}>
            <Box
              component="img"
              className={styles.doctorImage}
              alt="Doctor"
              src={
                "../assets/images/portrait-young-woman-doctor-with-stethoscope-uniform (1).png"
              }
            />
            <Typography variant="h4" component="h4" className={styles.drName}>
              {en.homepage.expertSpecialistSlider.drName}
            </Typography>
            <Typography variant="h6" component="h6" className={styles.field}>
              {en.homepage.expertSpecialistSlider.field}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              className={styles.experience}
            >
              {en.homepage.expertSpecialistSlider.experiance}
              <br />
              {en.homepage.expertSpecialistSlider.randomText} <br />
              {en.homepage.expertSpecialistSlider.randomText}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpertSpecialistSlider;

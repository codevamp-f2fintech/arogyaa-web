import { Box, Grid, Paper, Typography } from "@mui/material";

import en from "@/locales/en.json";
import styles from "../page.module.css";

const AboutUs: React.FC = () => {
  return (
    <Box className={styles.aboutUsContainer}>
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid xs={4} className={styles.imageGrid}>
          <Box
            component="img"
            className={styles.image}
            alt="The house from the offer."
            src={"../assets/images/online-doctor-with-white-coat.png"}
          />
        </Grid>
        <Grid xs={8} className={styles.textGrid}>
          <Typography variant="h4" component="h4" className={styles.title}>
            {en.homepage.aboutUs.title1}
            <span className={styles.titleHighlight}>
              {en.homepage.aboutUs.title2}
            </span>
          </Typography>
          <Typography variant="h6" component="p" className={styles.description}>
            {en.homepage.aboutUs.description}
          </Typography>

          <Grid
            container
            spacing={3}
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.cardsGrid}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Paper className={styles.cardGreen}>
                <Typography
                  variant="h4"
                  component="h4"
                  className={styles.cardTitle}
                >
                  {en.homepage.aboutUs.cardTitle1}
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  className={styles.cardDescription}
                >
                  {en.homepage.aboutUs.cardDescription1}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className={styles.cardWhite}>
                <Typography
                  variant="h4"
                  component="h4"
                  className={styles.cardTitle}
                >
                  {en.homepage.aboutUs.cardTitle2}
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  className={styles.cardDescription}
                >
                  {en.homepage.aboutUs.cardDescription2}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper className={styles.cardWhite}>
                <Typography
                  variant="h4"
                  component="h4"
                  className={styles.cardTitle}
                >
                  {en.homepage.aboutUs.cardTitle3}
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  className={styles.cardDescription}
                >
                  {en.homepage.aboutUs.cardDescription3}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;

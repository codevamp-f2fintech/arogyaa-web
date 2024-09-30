import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import AdbIcon from "@mui/icons-material/Adb";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { InputBase, Paper } from "@mui/material";

import en from "@/locales/en.json";
import styles from "../../page.module.css";

const Footer = () => {
  return (
    <>
      <Box className={styles.footer}>
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={5} className={styles["footer-grid-item"]}>
            <Box>
              <Box className={styles.logoBox}>
                <AdbIcon className={styles.arogyaIcon} />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  className={styles.logoText}
                >
                  {en.footer.title}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="h4"
                className={styles.mainTitle}
              >
                {en.footer.the_best_medical}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles.arogya2024}
              >
                Arogya 2024
              </Typography>
              <Typography variant="h6" component="h6">
                {en.footer.dated}
              </Typography>
            </Box>
          </Grid>

          <Grid xs={2} className={styles["footer-grid-item"]}>
            <Typography variant="h4" className={styles["footer-title"]}>
              {en.footer.contact_section.title}
            </Typography>
            <Box>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.opening_hours}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.clinics}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.hospitals}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.medicines}
              </Typography>
            </Box>
          </Grid>

          <Grid xs={2} className={styles["footer-grid-item"]}>
            <Typography variant="h4" className={styles["footer-title"]}>
              {en.footer.pages_section.title}
            </Typography>
            <Box>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.pages_section.doctors}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.clinics}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.hospitals}
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                className={styles["footer-typography-h6"]}
              >
                {en.footer.contact_section.medicines}
              </Typography>
            </Box>
          </Grid>

          <Grid xs={3} className={styles["footer-grid-item"]}>
            <Typography variant="h4" className={styles["footer-title"]}>
              {en.footer.social}
            </Typography>
            <Box className={styles["footer-subscription"]}>
              <InstagramIcon className={styles["social-icons"]} />
              <FacebookIcon className={styles["social-icons"]} />
              <XIcon className={styles["social-icons"]} />
              <YouTubeIcon className={styles["social-icons"]} />
              <Paper component="form" className={styles["email-input"]}>
                <InputBase
                  placeholder="Enter Email"
                  inputProps={{ "aria-label": "search google maps" }}
                  className={styles.emailInput}
                />
              </Paper>
              <Button
                variant="contained"
                className={styles["subscribe-button"]}
              >
                {en.footer.button}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className={styles["footer-bottom"]}>
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={5} className={styles["footer-grid-item"]}>
            <Typography
              variant="body2"
              component="p"
              className={styles["footer-copyright"]}
            >
              © Copyright 2024, All rights reserved with Arogya HealthCare
            </Typography>
          </Grid>
          <Grid xs={7} className={styles["footer-right"]}>
            <Typography
              variant="body2"
              component="p"
              className={styles["footer-pages"]}
            >
              {en.footer.pages_section.privacy}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className={styles["footer-pages"]}
            >
              {en.footer.pages_section.terms}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className={styles["footer-pages"]}
            >
              {en.footer.pages_section.faq}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Footer;

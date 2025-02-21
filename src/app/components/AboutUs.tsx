import { Box, Grid, Paper, Typography } from "@mui/material";
import en from "@/locales/en.json";
import styles from "../page.module.css";

const AboutUs: React.FC = () => {
  // Data for cards
  const cardData = [
    {
      title: en.homepage.aboutUs.cardTitle1,
      description: en.homepage.aboutUs.cardDescription1,
    },
    {
      title: en.homepage.aboutUs.cardTitle2,
      description: en.homepage.aboutUs.cardDescription2,
    },
    {
      title: en.homepage.aboutUs.cardTitle3,
      description: en.homepage.aboutUs.cardDescription3,
    },
  ];

  return (
    <Box className={styles.aboutUsContainer} sx={{ py: 6 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Image Section */}
        <Grid
          item
          xs={12}
          md={5}
          className={styles.imageGrid}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            component="img"
            className={styles.image}
            alt="Doctor in White Coat"
            src="../assets/images/online-doctor-with-white-coat.png"
            sx={{
              width: "100%",
              maxWidth: { xs: "300px", sm: "400px", md: "100%" },
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Grid>

        {/* Text Section */}
        <Grid item xs={12} md={7} className={styles.textGrid}>
          <Typography
            variant="h4"
            component="h4"
            className={styles.title}
            sx={{
              fontSize: { xs: "1.8rem", sm: "2rem", md: "2.5rem" },
              lineHeight: "1.5",
              fontWeight: 700,
              color: "#333",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {en.homepage.aboutUs.title1}
            <span
              className={styles.titleHighlight}
              style={{
                color: "#20ada0",
                fontWeight: "600",
                marginLeft: "0.5rem",
              }}
            >
              {en.homepage.aboutUs.title2}
            </span>
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={styles.description}
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
              color: "#555",
              lineHeight: "1.8",
              marginTop: "16px",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {en.homepage.aboutUs.description}
          </Typography>

          {/* Cards Section */}
          <Grid
            container
            spacing={3}
            sx={{
              marginTop: "24px",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {cardData.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    padding: "20px",
                    borderRadius: "15px",
                    textAlign: "center",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                    },
                    backgroundColor: index === 0 ? "#20ada0" : "#fff",
                    color: index === 0 ? "#fff" : "#333",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "200px", // Fixed height for all cards
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h5"
                    sx={{
                      fontSize: { xs: "1.2rem", md: "1.5rem" },
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      lineHeight: "1.5",
                      flexGrow: 1, // This will ensure the content stretches to fill space
                    }}
                  >
                    {card.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;

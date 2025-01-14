"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  InputBase,
  CardContent,
  Grid,
  Paper,
  Typography,
  alpha,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import en from "@/locales/en.json";
import styles from '../page.module.css';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const float = keyframes`
  0% { transform: translateY(0px) translateX(-20%); }
  50% { transform: translateY(-10px) translateX(-20%); }
  100% { transform: translateY(0px) translateX(-20%); }
`;
const StyledBanner = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(6, 2),
  background: `linear-gradient(60deg, rgba(86,159,157,1) 29%, rgba(60,137,133,1) 100%)`, // Updated gradient background
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: `0 10px 40px ${alpha("#20ADA0", 0.1)}`,
  animation: `${fadeIn} 0.6s ease-out`,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(8, 4),
  },
}));

const StyledImage = styled("img")(({ theme }) => ({
  position: "absolute",
  bottom: -12,
  left: 0,
  height: "95%",
  objectFit: "contain",
  opacity: 0.95,
  animation: `${float} 6s ease-in-out infinite`,
  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));
const ContentWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  backdropFilter: "blur(10px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2.5), // Reduced padding
  boxShadow: `0 8px 32px ${alpha("#20ADA0", 0.1)}`,
  maxWidth: "90%", // Added max-width for smaller form
  margin: "0 auto", // Center the form
}));
const StyledInputPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.75), // Reduced padding
  marginBottom: theme.spacing(1.5), // Reduced margin
  boxShadow: "none",
  border: `1px solid ${alpha("#20ADA0", 0.2)}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: "all 0.3s ease",
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  "&:hover, &:focus-within": {
    border: `1px solid #20ADA0`,
    boxShadow: `0 0 0 3px ${alpha("#20ADA0", 0.1)}`,
    transform: "translateY(-2px)",
  },
}));
const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3.5), // Reduced padding
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem", // Slightly reduced font size
  background: `linear-gradient(45deg, #20ADA0, ${alpha("#20ADA0", 0.8)})`,
  boxShadow: `0 8px 16px ${alpha("#20ADA0", 0.25)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 12px 24px ${alpha("#20ADA0", 0.35)}`,
    transform: "translateY(-2px)",
  },
}));
const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(120deg,
    #20ADA0,
    ${alpha("#20ADA0", 0.8)} 60%,
    ${alpha("#20ADA0", 0.6)})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textFillColor: "transparent",
}));

const BannerBottom = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [focusedField, setFocusedField] = useState(null);
  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
  };
  const router = useRouter();

  const handleClick2 = () => {
    router.push("/doctor");
  };

  return (
    <StyledBanner>
      <StyledImage
        alt="Doctor"
        src="/assets/images/doctor-with-his-arms-crossed-white-background.png"
      />
      <Grid sx={{ mb: 3, marginTop: "200px" }} container spacing={4}>
        <Grid item xs={12} md={6} />
        <Grid item xs={12} md={6}>
          <ContentWrapper>
            <CardContent>
              {" "}
              {/* Reduced margin */}
              <GradientText
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  letterSpacing: "0.5px",
                }}
              >
                {en.homepage.bannerBottom.make_your_health}
              </GradientText>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2, // Reduced margin
                  fontSize: isMobile ? "2rem" : "2.5rem", // Slightly reduced font sizes
                  lineHeight: 1.2,
                  color: theme.palette.text.primary,
                }}
              >
                {en.homepage.bannerBottom.overlook}
              </Typography>
              <Box className={styles.appointmentButtonContainer1}>
                <Button
                  onClick={handleClick2} // Handle button click
                  variant="outlined"
                  className={styles.appointmentButton}
                  endIcon={<ArrowCircleRightIcon />}
                >
                  {en.topbar.appointment} {/* Button label */}
                </Button>
              </Box>
            </CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              {" "}
              {/* Reduced margin */}
              <Typography
                variant="h6"
                sx={{
                  mb: 1.5, // Reduced margin
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {en.homepage.bannerComponent.request}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3, // Reduced margin
                  color: alpha(theme.palette.text.primary, 0.7),
                  lineHeight: 1.6,
                }}
              >
                {en.homepage.bannerComponent.description}
              </Typography>
              <StyledInputPaper
                elevation={0}
                sx={{
                  transform:
                    focusedField === "name" ? "translateY(-2px)" : "none",
                }}
              >
                <InputBase
                  fullWidth
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: "#20ADA0" }} />
                    </InputAdornment>
                  }
                  sx={{ fontSize: "1rem" }} // Slightly reduced font size
                />
              </StyledInputPaper>
              <StyledInputPaper
                elevation={0}
                sx={{
                  transform:
                    focusedField === "phone" ? "translateY(-2px)" : "none",
                }}
              >
                <InputBase
                  fullWidth
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange("phone")}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  startAdornment={
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#20ADA0" }} />
                    </InputAdornment>
                  }
                  sx={{ fontSize: "1rem" }} // Slightly reduced font size
                />
              </StyledInputPaper>
              <ActionButton
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<ArrowCircleRightIcon />}
              >
                {en.homepage.bannerComponent.buttonText}
              </ActionButton>
            </Box>
          </ContentWrapper>
        </Grid>
      </Grid>
    </StyledBanner>
  );
};

export default BannerBottom;

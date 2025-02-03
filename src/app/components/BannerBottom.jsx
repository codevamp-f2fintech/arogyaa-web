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
import styles from "../page.module.css";

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

const StyledBanner = styled(Box)(({ theme }) => ({
  minHeight: "50vh", // Reduced height
  position: "relative",
  padding: theme.spacing(6, 2),
  background: `linear-gradient(60deg, rgba(86,159,157,1) 29%, rgba(60,137,133,1) 100%)`,
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
  bottom: -10,
  left: 0,
  height: "100%", 
  objectFit: "contain",
  opacity: 0.95,
  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  boxShadow: `0 8px 32px ${alpha("#20ADA0", 0.1)}`,
  maxWidth: "80%",
  margin: "0 auto",
}));

const StyledInputPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
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
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  background: `linear-gradient(45deg, #20ADA0, ${alpha("#20ADA0", 0.8)})`,
  boxShadow: `0 8px 16px ${alpha("#20ADA0", 0.25)}`,
  "&:hover": {
    boxShadow: `0 12px 24px ${alpha("#20ADA0", 0.35)}`,
    transform: "translateY(-2px)",
  },
}));

const BannerBottom = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [formData, setFormData] = useState({ name: "", phone: "" });
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
     <Grid
  container
  spacing={4}
  sx={{
    alignItems: "center",
    justifyContent: "flex-end",
  }}
>
  <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
    
  </Grid>
  <Grid item xs={12} md={6}>
    <ContentWrapper>
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: theme.palette.text.primary,
          }}
        >
          {en.homepage.bannerBottom.make_your_health}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 3,
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            lineHeight: 1.2,
          }}
        >
          {en.homepage.bannerBottom.overlook}
        </Typography>
        <Button
          onClick={handleClick2}
          variant="outlined"
          className={styles.appointmentButton}
          endIcon={<ArrowCircleRightIcon />}
          sx={{
            fontWeight: 600,
            padding: "10px 20px",
            borderColor: "#20ADA0",
            color: "#20ADA0",
            "&:hover": {
              backgroundColor: "#20ADA0",
              color: "#fff",
            },
          }}
        >
          {en.topbar.appointment}
        </Button>
      </CardContent>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {en.homepage.bannerComponent.request}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: alpha(theme.palette.text.primary, 0.7),
            lineHeight: 1.6,
          }}
        >
          {en.homepage.bannerComponent.description}
        </Typography>
        <StyledInputPaper>
          <InputBase
            fullWidth
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange("name")}
            startAdornment={
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: "#20ADA0" }} />
              </InputAdornment>
            }
          />
        </StyledInputPaper>
        <StyledInputPaper>
          <InputBase
            fullWidth
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange("phone")}
            startAdornment={
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: "#20ADA0" }} />
              </InputAdornment>
            }
          />
        </StyledInputPaper>
        <ActionButton type="submit" fullWidth>
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

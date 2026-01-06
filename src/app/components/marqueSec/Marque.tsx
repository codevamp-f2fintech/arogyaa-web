"use client";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";

// Define the scrolling animations
const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const scrollRight = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
`;

// Styled components for the marquee
const MarqueeContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  background:
    "linear-gradient(311deg, rgba(22,15,65,1) 10%, rgba(46,25,102,1) 74%)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(4, 0),
  position: "relative",
}));

const MarqueeTrack = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  animation: "scrollAnimation 180s linear infinite",
  "&:hover": {
    animationPlayState: "paused",
  },
  "@keyframes scrollAnimation": {
    "0%": { transform: "translateX(0)" },
    "100%": { transform: "translateX(-100%)" },
  },
}));

const MarqueeItem = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  padding: theme.spacing(2, 3),
  margin: theme.spacing(1, 1.5),
  whiteSpace: "nowrap",
  borderRadius: "50px",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  background: "#333",
  backdropFilter: "blur(5px)",
  color: "white",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "#333",
    transform: "scale(1.05)",
  },
}));

// Define the data for each row
const row1Items = [
  "Adenomyosis",
  "Endometriosis",
  "Early Menopause (40-45 years old)",
  "Fibroids",
  "Premenstrual Syndrome",
];

const row2Items = [
  "Iron Deficiency Anaemia",
  "Hypothyroidism (subclinical/overt)",
  "Vitamin D Deficiency",
  "Thyroid Disorders",
];

const row3Items = [
  "Low/diminished Egg Reserve",
  "Menopause (over 45 year old)",
  "Pelvic Inflammatory Disease",
  "Hormonal Imbalance",
];

const row4Items = [
  "Uterine (Endometrial) Polyps",
  "Polycystic Ovary Syndrome (PCOS)",
  "Premature Ovarian Insufficiency",
  "Recurrent Miscarriage",
];

export default function ConditionMarquee() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to duplicate items to ensure continuous scrolling
  const duplicateItems = (items: string[]) => [...items, ...items, ...items];

  return (
    <MarqueeContainer>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Row 1: Left to Right */}
        <Box sx={{ overflow: "hidden", mb: 2 }}>
          <MarqueeTrack direction="right">
            {duplicateItems(row1Items).map((item, index) => (
              <MarqueeItem key={`row1-${index}`}>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  fontWeight="medium"
                >
                  {item}
                </Typography>
              </MarqueeItem>
            ))}
          </MarqueeTrack>
        </Box>

        {/* Row 2: Right to Left */}
        <Box sx={{ overflow: "hidden", mb: 2 }}>
          <MarqueeTrack direction="left">
            {duplicateItems(row2Items).map((item, index) => (
              <MarqueeItem key={`row2-${index}`}>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  fontWeight="medium"
                >
                  {item}
                </Typography>
              </MarqueeItem>
            ))}
          </MarqueeTrack>
        </Box>

        {/* Row 3: Left to Right */}
        <Box sx={{ overflow: "hidden", mb: 2 }}>
          <MarqueeTrack direction="right">
            {duplicateItems(row3Items).map((item, index) => (
              <MarqueeItem key={`row3-${index}`}>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  fontWeight="medium"
                >
                  {item}
                </Typography>
              </MarqueeItem>
            ))}
          </MarqueeTrack>
        </Box>

        {/* Row 4: Right to Left */}
        <Box sx={{ overflow: "hidden" }}>
          <MarqueeTrack direction="left">
            {duplicateItems(row4Items).map((item, index) => (
              <MarqueeItem key={`row4-${index}`}>
                <Typography
                  variant={isMobile ? "body2" : "body1"}
                  fontWeight="medium"
                >
                  {item}
                </Typography>
              </MarqueeItem>
            ))}
          </MarqueeTrack>
        </Box>
      </Container>
    </MarqueeContainer>
  );
}

import React from "react";
import { Box, Grid, Typography } from "@mui/material";

interface SpecialistCardProps {
  icon: string;
  name: string;
  description: string;
  onConsult: () => void;
}

const SpecialistCard: React.FC<SpecialistCardProps> = React.memo(
  ({ icon, name, description, onConsult }) => {
    return (
      <Grid
        item
        sx={{
          position: "relative",
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          padding: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "all 0.3s ease",
          border: "1px solid #20ada0",
          "&:hover": {
            // transform: "translateY(-8px)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
            "& .specialistIconWrapper": {
              transform: "rotate(180deg)",
            },
          },
        }}
      >
        <Box
          className="specialistIconWrapper"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
            filter: "drop-shadow(0px 0px 0px black)"
          }}
        >
          <img
            src="/assets/images/speciality-icons/vector_plus.png"
            alt="Add Icon"
            width={40}
            height={40}
            // style={{ filter: "brightness(0) invert(1)" }}
          />
        </Box>

        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <img
            src={icon}
            alt={`${name} Icon`}
            width={80}
            height={80}
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#20ada0",
              mb: 1,
              textAlign: "center",
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              flexGrow: 1,
              width: "100%",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.5,
              minHeight: "6em",
            }}
          >
            {description}
          </Typography>
          {/* <Button
          variant="contained"
          className="consultButton"
          endIcon={<ArrowCircleRightIcon />}
          onClick={onConsult}
          sx={{
            width: "80%",
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            transition: "all 0.3s ease",
            backgroundColor: "primary.main",
            color: "common.white",
            "&:hover": {
              backgroundColor: "primary.dark",
              transform: "translateY(-2px)",
            },
          }}
        >
          Consult Now
        </Button> */}
        </Box>
      </Grid>
    );
  }
);

export default SpecialistCard;

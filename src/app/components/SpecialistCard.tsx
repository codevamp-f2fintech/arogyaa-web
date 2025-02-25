import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";

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
            alignItems: 'center',
            flexGrow: 1,
            width: "100%",
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
          <Button
            variant="contained"
            className="consultButton"
            endIcon={<ArrowCircleRight />}
            onClick={onConsult}
            sx={{
              width: '75%',
              background: "#20ADA0 !important",
              color: "white",
              fontWeight: "bold",
              borderRadius: "20px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-2px)",
              },
            }}
          >
            Consult Now
          </Button>
        </Box>
      </Grid>
    );
  }
);

export default SpecialistCard;

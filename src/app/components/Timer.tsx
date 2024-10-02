"use client";

import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Timer: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const countdownTime = 172800000;    // 2 days in milliseconds

  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "#333",
          marginLeft: "-80vh",
          marginTop: "10vh",
        }}
      >
        <Box sx={{ textAlign: "center", margin: "0 10px" }}>
          <Typography variant="h4">{days}</Typography>
          <Typography variant="caption">DAYS</Typography>
        </Box>
        <Typography variant="h4">:</Typography>
        <Box sx={{ textAlign: "center", margin: "0 10px" }}>
          <Typography variant="h4">{hours.toString().padStart(2, "0")}</Typography>
          <Typography variant="caption">HOURS</Typography>
        </Box>
        <Typography variant="h4">:</Typography>
        <Box sx={{ textAlign: "center", margin: "0 10px" }}>
          <Typography variant="h4">{minutes.toString().padStart(2, "0")}</Typography>
          <Typography variant="caption">MINUTES</Typography>
        </Box>
        <Typography variant="h4">:</Typography>
        <Box sx={{ textAlign: "center", margin: "0 10px" }}>
          <Typography variant="h4">{seconds.toString().padStart(2, "0")}</Typography>
          <Typography variant="caption">SECONDS</Typography>
        </Box>
      </Box>
    );
  };

  if (!mounted || isNaN(countdownTime)) {
    return null;
  }

  return (
    <Countdown
      date={Date.now() + countdownTime}
      renderer={renderer}
    />
  );
};

export default Timer;

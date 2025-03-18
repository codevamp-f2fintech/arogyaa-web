"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Typography, Box, Alert } from "@mui/material"; // MUI components
import axios from "axios";

import Loader from "./common/Loader";
import BannerComponent from "./Banner";
import BannerComponentTest from "./BannerTest";

const SpecialitySlider = dynamic(() => import("./SpecialitySlider"), {
  suspense: true,
});
const ExpertSpecialistSlider = dynamic(
  () => import("./ExpertSpecialistSlider"),
  { suspense: true }
);
const SymptomCards = dynamic(() => import("./SymptomCards"), {
  suspense: true,
});
const AboutUs = dynamic(() => import("./AboutUs"), { suspense: true });
const Testimonials = dynamic(() => import("./Testimonials"), {
  suspense: true,
});
const BannerBottom = dynamic(() => import("./BannerBottom"), {
  suspense: true,
});

const Home = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Replace this with your OpenCage API key
  const API_KEY = "b4953ca380c5441399830b0c05c656b6";

  // Get patient's location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          // Fetch the city using reverse geocoding
          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
            );

            // Check for city or alternative location component in the response
            const city =
              response.data.results[0]?.components.city ||
              response.data.results[0]?.components.town ||
              response.data.results[0]?.components.village ||
              response.data.results[0]?.components.state ||
              response.data.results[0]?.components.country;

            console.log("response.data.results[0]", response.data.results[0]);

            if (city) {
              setLocation((prevLocation) => ({
                ...prevLocation, // Spread previous state
                city, // Add city to the location object
              }));
            } else {
              setError("City not found.");
            }
          } catch (err) {
            setError("Error fetching city information.");
            console.error("Geocoding error:", err);
          }
        },
        (err) => {
          setError("Error: Location access denied or unavailable.");
          console.error("Error getting location", err);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <BannerComponentTest/>
      {/* <BannerComponent /> */}
      <SpecialitySlider />
      <ExpertSpecialistSlider />
      <SymptomCards />
      <AboutUs />
      <Testimonials />
      <BannerBottom />
    </Suspense>
  );
};

export default Home;

"use client";
import { createTheme } from "@mui/material";

// Simplified color palette with explicit definition for white and black
export const theme = createTheme({
  palette: {
    background: {
      default: "#fff", // White background for default
      paper: "#f5f5f5",
      card: "#b497d6",
    },
    text: {
      primary: "#ffffff", //defoult text using //
      secondary: "#a7d8b2", // double text using //
      white: "#29175e", // when using white bg //
    },
    black: {
      main: "#000000", // Explicitly define black color
    },
  },
  typography: {
    allVariants: {
      fontFamily: "'Arial', sans-serif", // Default font for all text
      textTransform: "none", // Prevent automatic transformation (uppercase/lowercase)
    },
    h1: {
      fontSize: "2rem", // Heading 1 size
      fontWeight: 700, // Bold weight for h1
    },
    h2: {
      fontSize: "1.5rem", // Heading 2 size
      fontWeight: 600, // Semi-bold weight for h2
    },
    body1: {
      fontSize: "1rem", // Standard body text size
      fontWeight: 400, // Normal weight for body text
    },
  },
});

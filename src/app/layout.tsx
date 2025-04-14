import dynamic from "next/dynamic";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "./theme"; // Import the theme you created

import ReduxProvider from "@/redux/provider";
import Topbar from "./components/common/Topbar";
const Footer = dynamic(() => import("./components/common/Footer"));
import { CssBaseline } from "@mui/material";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arogyaa Web App",
  description: "Online Doctor Consultation",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <head>
        <Link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap
"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <ReduxProvider>
            <CssBaseline />
            <Topbar />

            {children}
          </ReduxProvider>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

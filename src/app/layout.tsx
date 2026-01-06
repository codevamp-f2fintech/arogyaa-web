import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Suspense } from "react"; // Added Suspense

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import ReduxProvider from "@/redux/provider";
import Loader from "./components/common/Loader";

import { theme } from "./theme";
const Topbar = dynamic(() => import("./components/common/Topbar"), {
  ssr: false, // Important for client-side only components
});

import SessionProvider from "./components/SessionProvider";
const Footer = dynamic(() => import("./components/common/Footer"));

import "./globals.css";

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
          href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap"
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <ReduxProvider>
              <CssBaseline />
              <Suspense fallback={<Loader />}>
                <Topbar />
                {children}
              </Suspense>
              <Footer />
            </ReduxProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;

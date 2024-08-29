"user client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "@/redux/provider";
import SnackbarComponent from "./snackbar/page";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arogyaa Web App",
  description: "Online Doctor Consultation",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <SnackbarComponent />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;

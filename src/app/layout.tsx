import dynamic from 'next/dynamic';
import { Metadata } from "next";
import { Inter } from "next/font/google";

import ReduxProvider from '@/redux/provider';
import Topbar from "./components/common/Topbar";
const Footer = dynamic(() => import('./components/common/Footer'));
import { CssBaseline } from '@mui/material';
import './globals.css';

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
          <CssBaseline />
          <Topbar />

          {children}
        </ReduxProvider>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;

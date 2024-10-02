import { Metadata } from "next";
import { Inter } from "next/font/google";

import './globals.css';
import ReduxProvider from '@/redux/provider';
import SessionProviderWrapper from "./SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arogyaa Web App",
  description: "Online Doctor Consultation",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;

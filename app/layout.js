import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import NextAuthSessionProvider  from "./components/NextAuthSessionProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: "RL Spencer CRM",
};


export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <NextAuthSessionProvider> 

          <AuthProvider>
            <ThemeProvider theme={theme}>
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </AuthProvider>
          </NextAuthSessionProvider> 

      </body>
    </html>
  );
}

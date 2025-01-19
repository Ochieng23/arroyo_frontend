import localFont from "next/font/local";
import "./globals.css";

// Import the UserProvider

import { UserProvider } from "@/context/userContext";

// Variable fonts
const geistSans = localFont({
  src: [
    {
      path: "./fonts/GeistVF.woff",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "./fonts/GeistMonoVF.woff",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap your app in UserProvider here */}
        {/* Wrap your app in SocketProvider here */}
        
        <UserProvider>
          {children}
        </UserProvider>
        
      </body>
    </html>
  );
}

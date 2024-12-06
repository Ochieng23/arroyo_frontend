import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
      <div className="flex flex-col items-center justify-center min-h-screen">
        
        <h1 className="text-4xl font-bold">Arroyo Coming Soon</h1>
        <p className="mt-4 text-lg text-center">
          We are working hard to bring you something amazing. Stay tuned!
        </p>
      </div>
    </>
  );
}

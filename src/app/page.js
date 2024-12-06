import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Explainer from "@/components/Explainer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Explainer />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Arroyo Coming Soon</h1>
        <p className="mt-4 text-lg text-center">
          We are working hard to bring you something amazing. Stay tuned!
        </p>
      </div>
    </>
  );
}

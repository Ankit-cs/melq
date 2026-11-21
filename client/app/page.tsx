"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Architecture from "@/components/landing/Architecture";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background with warm cream and burnt orange glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,84,30,0.06),transparent_40%)]" />

        <div className="absolute left-1/2 top-0 h-150 w-150 -translate-x-1/2 rounded-full bg-[#D9541E]/4 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-[#D9541E]/3 blur-3xl" />
      </div>

      <Navbar />

      <Hero />

      <Stats />

      <Features />

      <Architecture />

      <Cta />

      <Footer />
    </main>
  );
}

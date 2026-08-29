import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ClientLogos } from "@/components/landing/ClientLogos";
import { Services } from "@/components/landing/Services";
import { Framework } from "@/components/landing/Framework";
import { GrowthCalculator } from "@/components/landing/GrowthCalculator";
import { CaseStudies } from "@/components/landing/CaseStudies";
import { Testimonials } from "@/components/landing/Testimonials";
import { AuditForm } from "@/components/landing/AuditForm";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ClientLogos />
        <Services />
        <Framework />
        <GrowthCalculator />
        <CaseStudies />
        <Testimonials />
        <AuditForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

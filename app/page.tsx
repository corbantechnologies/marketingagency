import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientLogos } from "@/components/ClientLogos";
import { Services } from "@/components/Services";
import { Framework } from "@/components/Framework";
import { GrowthCalculator } from "@/components/GrowthCalculator";
import { CaseStudies } from "@/components/CaseStudies";
import { Testimonials } from "@/components/Testimonials";
import { AuditForm } from "@/components/AuditForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

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

"use client";

import React from "react";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <h1 className="text-3xl font-extrabold">Terms of Service & Biomedical Disclaimer</h1>
        <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">Effective: May 2026</p>
        
        <div className="border-t border-foreground/5 pt-8 space-y-6 text-xs text-foreground/75 leading-relaxed font-medium">
          <p className="text-red-500 font-bold border border-red-500/20 bg-red-500/5 p-4 rounded-xl">
            IMPORTANT DISCLAIMER: VitalCore is a preventive wellness optimization and cognitive tracking platform. It is NOT a medical device, nor does it provide clinical diagnostic evaluations or cardiac prescriptions. Always consult a physician before engaging in high-intensity cardiovascular changes.
          </p>

          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Platform Intended Purpose</h2>
          <p>
            The predictions, stability indexes, fatigue scores, and digital twin simulators are calculated using mathematical lifestyle modeling. They represent recommendations, not diagnostic determinations.
          </p>

          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">2. Account Responsibility</h2>
          <p>
            When utilizing active Supabase features, you are responsible for maintaining secure passwords. We recommend enabling secure JWT and OAuth procedures to prevent unauthorized profile access.
          </p>

          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">3. Boundary Operations</h2>
          <p>
            We supply the platform code as-is. All localized mock databases run entirely client-side. The user agrees not to exploit or reverse engineer code systems for illegitimate purposes.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

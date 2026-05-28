"use client";

import React from "react";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <h1 className="text-3xl font-bold">Privacy & Data Governance Statement</h1>
        <p className="text-xs text-foreground/50 font-semibold">Effective: May 2026</p>
        
        <div className="border-t border-foreground/5 pt-8 space-y-6 text-xs text-foreground/75 leading-relaxed font-medium">
          <p>
            At VitalCore, we treat biometric, cardiac, and lifestyle activity telemetry with standard-level medical classification security. Our framework is inspired by international GDPR and HIPAA compliant safety principles.
          </p>

          <h2 className="text-sm font-bold text-foreground">1. Data Storage Boundaries</h2>
          <p>
            If you run this application without setting up active Supabase credentials (Mock Mode), all biometric tracking, sleep statistics, chat coach inputs, and macro entries exist exclusively inside your local browser sandbox (LocalStorage). No packets are transmitted to external servers.
          </p>

          <h2 className="text-sm font-bold text-foreground">2. Supabase Integration Security</h2>
          <p>
            If you wire active credentials, all biometric entries are isolated using strict PostgreSQL Row Level Security (RLS) constraints. Other authenticated accounts are strictly restricted from selects or updates of your personal datasets.
          </p>

          <h2 className="text-sm font-bold text-foreground">3. Right to Erasure</h2>
          <p>
            Under GDPR, you maintain absolute control. You can wipe all local storage data from the Control Panel settings, or execute direct account deletions via active Supabase configurations at any time.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

"use client";

import React from "react";
import { Activity, ShieldCheck, Heart, Cpu } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Preventive Longevity Mission</h1>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            VitalCore was founded by clinical wellness practitioners and software engineers to transition healthcare from reactive intervention to proactive preventative intelligence.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t border-b border-foreground/5 py-12">
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-foreground">The Paradigm Shift in Longevity</h2>
            <p className="text-xs text-foreground/75 leading-relaxed font-medium">
              Modern medicine waits for systems to collapse before initiating treatment. We believe in tracking daily micro-declines—the invisible physiological drops in sleep metrics, heart rate variance stability, and systemic stress—to adapt routines before burnout or health degradation manifests.
            </p>
            <p className="text-xs text-foreground/75 leading-relaxed font-medium">
              By mapping parameters against chronological baselines, VitalCore models individual performance curves and implements environmental safety nets to protect developers, creative directors, and families.
            </p>
          </div>
          <div className="rounded-3xl glass-panel p-8 border-foreground/5 flex flex-col gap-6 bg-gradient-to-tr from-primary/10 to-accent/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Cpu className="h-4 w-4" />
              The VitalCore Engine Standard
            </h3>
            <ul className="space-y-4 text-xs text-foreground/80 font-semibold">
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Continuous Biometric Processing Models</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>HIPAA-Inspired Row Level Security Policies</span>
              </li>
              <li className="flex gap-2">
                <span className="text-secondary">✓</span>
                <span>Elderly Adaptive Accessibility Interfaces</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Value Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glowColor="violet" className="space-y-3">
            <Activity className="h-6 w-6 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Continuous Predictability</h3>
            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
              Forecasting recovery debt and stamina decline months in advance so high-performers never compromise their base health assets.
            </p>
          </GlassCard>

          <GlassCard glowColor="emerald" className="space-y-3">
            <ShieldCheck className="h-6 w-6 text-secondary" />
            <h3 className="text-sm font-bold text-foreground">HIPAA Standard Security</h3>
            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
              Your biometric logs are locked using PostgreSQL RLS constraints. If run in mock mode, data exists strictly in your local sandbox.
            </p>
          </GlassCard>

          <GlassCard glowColor="rose" className="space-y-3">
            <Heart className="h-6 w-6 text-accent" />
            <h3 className="text-sm font-bold text-foreground">Empathetic Intelligence</h3>
            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
              AI coaching that adapts to human vulnerabilities, remembers motivation patterns, and adapts workout difficulty dynamically.
            </p>
          </GlassCard>
        </div>

      </div>
      <Footer />
    </div>
  );
}

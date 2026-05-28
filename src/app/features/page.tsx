"use client";

import React from "react";
import { Sparkles, Brain, Moon, TrendingUp, Thermometer, Layers } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Footer from "@/components/layout/Footer";

export default function FeaturesPage() {
  const featureList = [
    {
      title: "Predictive Health Shift Forecasting",
      description: "Applies multivariate regression analysis to your biological markers (HRV consistency, sleep cycles, steps) to map future wellness patterns.",
      icon: TrendingUp,
      color: "violet"
    },
    {
      title: "Fatigue & Overtraining Intelligence",
      description: "Computes physical vs mental fatigue indicators. Prevents exercise burnout by scaling workout difficulty targets down during high cognitive stress phases.",
      icon: Brain,
      color: "rose"
    },
    {
      title: "Circadian Sleep Rhythm Optimizer",
      description: "Tracks sleep architecture (Deep, REM durations) and plots ideal circadian phases to match melatonin rises, maximizing sleep efficiency scores.",
      icon: Moon,
      color: "emerald"
    },
    {
      title: "Adaptive Atmospheric AI Integration",
      description: "Queries real-time meteorological metrics to protect respiratory wellness during excessive summer heatwaves or sub-zero freezing spells.",
      icon: Thermometer,
      color: "amber"
    },
    {
      title: "Digital Twin Lifestyle Simulation",
      description: "Renders visual models of your future physical parameters over 3-6 months. Prompts positive daily habit adjustments.",
      icon: Layers,
      color: "violet"
    },
    {
      title: "Invisible Biometric Decline Radar",
      description: "Flags creeping trends, like gradual hydration decline or micro sleep deficits, to avoid catastrophic burnout periods.",
      icon: Sparkles,
      color: "rose"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Preventative AI Architecture</h1>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            VitalCore uses state-of-the-art predictive healthcare modeling to optimize longevity, cardiovascular strength, cognitive focus, and active recovery.
          </p>
        </div>

        {/* Features Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-foreground/5 pt-12">
          {featureList.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassCard key={index} glowColor={item.color as any} className="flex gap-4 p-6 hoverEffect">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
      <Footer />
    </div>
  );
}

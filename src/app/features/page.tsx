"use client";

import React from "react";
import { Sparkles, Brain, Moon, TrendingUp, Thermometer, Layers } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Footer from "@/components/layout/Footer";

export default function FeaturesPage() {
  const featureList = [
    {
      title: "Your Future Health Trends",
      description: "Analyzes your heart rate, sleep quality, and daily steps to show you helpful patterns and future health trends.",
      icon: TrendingUp,
      color: "violet"
    },
    {
      title: "Fatigue & Energy Guides",
      description: "Checks your physical and mental tiredness to help prevent burnout, suggesting lighter activities on busy or stressful days.",
      icon: Brain,
      color: "rose"
    },
    {
      title: "Sleep Schedule Tracker",
      description: "Helps you keep a consistent sleep schedule, tracking deep rest and REM sleep so you wake up feeling completely refreshed.",
      icon: Moon,
      color: "emerald"
    },
    {
      title: "Weather-Smart Recommendations",
      description: "Checks local weather, air quality, and temperature to give you smart indoor exercise ideas on too-hot or freezing days.",
      icon: Thermometer,
      color: "amber"
    },
    {
      title: "Visualize Your Progress",
      description: "Shows you a simple visual forecast of how your health and energy can improve over the next 3 to 6 months by staying consistent.",
      icon: Layers,
      color: "violet"
    },
    {
      title: "Burnout Warning Radar",
      description: "Flags small trends like slipping sleep or low water before they turn into fatigue, helping you stay ahead of burnout.",
      icon: Sparkles,
      color: "rose"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">How VitalCore Helps You</h1>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            VitalCore brings together friendly wellness coaching and simple insights to help you build healthy habits, sleep better, and boost your daily energy.
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

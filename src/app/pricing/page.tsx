"use client";

import React from "react";
import Link from "next/link";
import { Smile } from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  const plans = [
    {
      name: "VitalCore Standard",
      price: "0",
      description: "Basic wellness logging and daily step tracking.",
      features: [
        "Interactive Daily Wellness Dashboard",
        "Calorie & food logging",
        "Sleep & water tracking",
        "Simple health logs"
      ],
      cta: "Get Started Free"
    },
    {
      name: "VitalCore Professional",
      price: "19",
      description: "Complete daily energy predictions, stress insights, and smart weather recommendations.",
      features: [
        "All Standard capabilities",
        "Smart daily predictions & trend alerts",
        "Stress & fatigue tracking",
        "Weather-smart recommendations",
        "Sleep schedule trends",
        "Elderly & beginner modes"
      ],
      highlighted: true,
      cta: "Unlock Pro Features"
    },
    {
      name: "VitalCore Elite",
      price: "49",
      description: "Explore your future health patterns and build healthy habits with family and friends.",
      features: [
        "All Professional capabilities",
        "Visual 3-6 month health forecasts",
        "Body age estimates",
        "Family & friends tracking circles",
        "Secure developer API tools",
        "Custom metrics tracking"
      ],
      cta: "Unlock Elite Features"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, Friendly Pricing</h1>
          <p className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that best fits your wellness journey.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-foreground/5 pt-12 items-stretch">
          {plans.map((plan, index) => (
            <GlassCard 
              key={index}
              glowColor={plan.highlighted ? "violet" : "none"}
              className={`flex flex-col justify-between relative ${
                plan.highlighted ? "border-2 border-primary/50 shadow-2xl" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[9px] font-bold text-white">
                  Most Popular
                </span>
              )}
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">$</span>
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-xs text-foreground/60 font-semibold ml-1">/ month</span>
                </div>
                <p className="text-xs text-foreground/70 font-medium leading-relaxed">{plan.description}</p>
                
                <ul className="space-y-3 pt-4 border-t border-foreground/5 text-xs text-foreground/80 font-medium">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Smile className="h-3.5 w-3.5 text-secondary shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link href="/auth/signup">
                  <Button variant={plan.highlighted ? "primary" : "glass"} className="w-full py-3">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
}

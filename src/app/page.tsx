"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Activity, 
  Brain, 
  HeartPulse, 
  Sparkles, 
  Moon, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Zap, 
  Shield, 
  Thermometer, 
  AlertTriangle,
  Smile,
  Compass,
  Layers,
  ChevronDown
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  // Live Dashboard Simulator States
  const [stressSim, setStressSim] = useState(50);
  const [sleepHoursSim, setSleepHoursSim] = useState(7.5);
  const [workHoursSim, setWorkHoursSim] = useState(8);

  // Dynamic calculations based on simulator sliders
  const simRecovery = Math.round(
    Math.max(15, Math.min(100, (sleepHoursSim * 11) - (stressSim * 0.3) - (workHoursSim * 1.5)))
  );
  
  const simBurnoutRisk = Math.round(
    Math.max(5, Math.min(99, (stressSim * 0.7) + (workHoursSim * 4) - (sleepHoursSim * 5)))
  );

  const simStability = Math.round(
    Math.max(20, Math.min(100, 100 - (simBurnoutRisk * 0.5) + (simRecovery * 0.2)))
  );

  const features = [
    {
      title: "Predictive Health Evolution",
      description: "AI-driven algorithms process time-series metrics to forecast obesity, cardiovascular decline, and muscle overload risks 3–6 months in advance.",
      icon: TrendingUp,
      color: "violet"
    },
    {
      title: "Invisible Decline Detection",
      description: "Identifies creeping cardiovascular and recovery stress markers that users normally ignore before they develop into chronic fatigue.",
      icon: ShieldAlert,
      color: "rose"
    },
    {
      title: "Fatigue Intelligence System",
      description: "Measures central nervous system and metabolic fatigue by crossing sleep debt, stress levels, and muscle soreness zones.",
      icon: HeartPulse,
      color: "emerald"
    },
    {
      title: "Conversational AI Life Coach",
      description: "An adaptive wellness companion that remembers excuses, schedules focus periods based on hydration, and optimizes energy timelines.",
      icon: Brain,
      color: "amber"
    },
    {
      title: "Adaptive Environment Modifiers",
      description: "Translates external environmental variables (heatwaves, sub-zero cold, poor AQI air pollution indices) into dynamic routine throttling rules.",
      icon: Thermometer,
      color: "violet"
    },
    {
      title: "Cognitive Wellness Tracker",
      description: "Integrates screen-lock focus spans and mental fatigue metrics to protect developer and corporate athlete productivity.",
      icon: Zap,
      color: "rose"
    }
  ];

  const pricingPlans = [
    {
      name: "VitalCore Standard",
      price: "0",
      description: "Core biometric loggers and baseline sleep hygiene monitoring.",
      features: [
        "Interactive Daily Wellness Dashboard",
        "Standard Calorie & Macro logs",
        "Baseline Sleep & Hydration meters",
        "Manual Biometric integrations"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "VitalCore Professional",
      price: "19",
      description: "Full AI predictions, fatigue intelligence, and dynamic environment adjustments.",
      features: [
        "All Standard capabilities",
        "Preventative AI Predictions Engine",
        "Active Fatigue Intelligence metrics",
        "Circadian Rhythm Sleep tracking",
        "Adaptation environment weather offsets",
        "Elderly & Beginner custom mode profiles"
      ],
      cta: "Activate AI Pro",
      highlighted: true
    },
    {
      name: "VitalCore Enterprise / Elite",
      price: "49",
      description: "Deep continuous digital twin health forecasting & advanced team accountability circles.",
      features: [
        "All Pro capabilities",
        "3-6 Month Digital Twin simulations",
        "Advanced Biological Age estimators",
        "Family & Friend Accountability circles",
        "Admin developer HIPAA portal logs",
        "Dedicated preventive coaching integrations"
      ],
      cta: "Access Elite System",
      highlighted: false
    }
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does VitalCore predict future health changes?",
      answer: "VitalCore uses advanced time-series predictive modeling. By comparing your sleep quality consistency, baseline heart rate variability (HRV) trends, physical exertion, stress levels, and macro food logging over time, the system forecasts metabolic stability and chronic fatigue patterns up to 6 months before symptoms manifest."
    },
    {
      question: "What is the Invisible Decline Alert?",
      answer: "Most users ignore small daily declines, like sleeping 20 minutes less each day or minor increases in resting heart rate. VitalCore isolates these slow micro-declines from daily noise, sending proactive alerts (e.g. 'Sleep quality down 6% over 14 days; overtraining risk has increased by 15%') to prevent clinical burnout."
    },
    {
      question: "How do the Elderly and Beginner Modes adapt the platform?",
      answer: "You can toggle modes directly in the top navigation bar. Beginner Mode simplifies charts and provides lighter exercise suggestions, while Elderly Mode scales up all typography for high contrast, removes complex data dashboards, and focuses strictly on simple metrics like step consistency, gentle stretching, and daily hydration reminders."
    },
    {
      question: "How secure is my wellness data?",
      answer: "Security is built directly into our database architecture. We use PostgreSQL with Row-Level Security (RLS) enabled on all tables via Supabase. If you run in local mock mode, all data is stored purely within your own browser's LocalStorage. If you connect to real Supabase, all transactions are secured using JWT validation, matching industry-standard healthcare HIPAA inspired practices."
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/15 px-3 py-1 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation Preventive Healthcare Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl max-w-4xl mx-auto"
          >
            Predict. Prevent.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Perform.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-foreground/70 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered wellness intelligence that maps your biometrics, forecasts fatigue decay, detects invisible health decline, and adapts with your lifestyle environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <span>Access Console</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="glass" size="lg">Explore Biometric Models</Button>
            </Link>
          </motion.div>

          {/* Quick Hero metrics review */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-10 flex flex-wrap justify-center gap-4 text-xs font-bold text-foreground/80 max-w-3xl mx-auto"
          >
            <div className="px-4 py-2.5 rounded-xl glass-panel border-foreground/5 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Biometric Forecasting Model V2.4 Active</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl glass-panel border-foreground/5 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-secondary" />
              <span>HRV Recovery Mapping</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl glass-panel border-foreground/5 flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              <span>Burnout Simulation Enabled</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. DYNAMIC INTERACTIVE CONSOLE PREVIEW */}
      <section className="py-16 bg-background relative border-t border-b border-foreground/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl">biomedical simulation console</h2>
            <p className="text-xs text-foreground/60 font-semibold">Try adjusting parameters to simulate your daily wellness response</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Parameters Controller */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl glass-panel border-foreground/5">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Compass className="h-4.5 w-4.5 text-primary" />
                  Biometric Controller
                </h3>
                
                {/* Stress Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Daily Cognitive Stress</span>
                    <span className="text-primary">{stressSim}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={stressSim}
                    onChange={(e) => setStressSim(Number(e.target.value))}
                    className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-foreground/50">Higher stress exhausts mental energy and delays muscular recovery.</p>
                </div>

                {/* Sleep Hours Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Sleep Quality Duration</span>
                    <span className="text-secondary">{sleepHoursSim} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={sleepHoursSim}
                    onChange={(e) => setSleepHoursSim(Number(e.target.value))}
                    className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <p className="text-xs text-foreground/50">Deep recovery occurs during long, consistent sleep phases.</p>
                </div>

                {/* Workload hours slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Coding / Focus Work Hours</span>
                    <span className="text-accent">{workHoursSim} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    value={workHoursSim}
                    onChange={(e) => setWorkHoursSim(Number(e.target.value))}
                    className="w-full h-1 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <p className="text-xs text-foreground/50">Extended screen times drain battery efficiency reserves.</p>
                </div>
              </div>

              <div className="border-t border-foreground/5 pt-4 mt-6 text-xs text-foreground/60 font-medium">
                Note: Simulates reactive physiological response model generated by VitalCore AI.
              </div>
            </div>

            {/* Right Screen Output metrics */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Recovery card */}
              <GlassCard glowColor={simRecovery > 65 ? "emerald" : "rose"} className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--muted)]">Biorecovery Score</span>
                  <HeartPulse className="h-4 w-4 text-secondary" />
                </div>
                <div className="my-3">
                  <span className="analytics-number text-[var(--foreground)]">{simRecovery}%</span>
                </div>
                <div className="text-xs text-[var(--muted)] leading-normal">
                  {simRecovery > 65 ? "Cardiovascular HRV capacity primed." : "Sleep debt active; prioritize light stretching."}
                </div>
              </GlassCard>

              {/* Burnout risk card */}
              <GlassCard glowColor={simBurnoutRisk > 60 ? "rose" : "violet"} className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--muted)]">Burnout Probability</span>
                  <AlertTriangle className="h-4 w-4 text-accent" />
                </div>
                <div className="my-3">
                  <span className="analytics-number text-[var(--foreground)]">{simBurnoutRisk}%</span>
                </div>
                <div className="text-xs text-[var(--muted)] leading-normal">
                  {simBurnoutRisk > 60 ? "High fatigue risk. Limit focus work today." : "Wellness parameters stable."}
                </div>
              </GlassCard>

              {/* Wellness stability score */}
              <GlassCard glowColor={simStability > 70 ? "violet" : "amber"} className="flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--muted)]">Lifestyle Stability</span>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="my-3">
                  <span className="analytics-number text-[var(--foreground)]">{simStability}%</span>
                </div>
                <div className="text-xs text-[var(--muted)] leading-normal">
                  {simStability > 70 ? "Healthy balance maintained." : "System instability. Hydrate and sleep early."}
                </div>
              </GlassCard>

              {/* digital twin future version card span */}
              <div className="sm:col-span-3 rounded-2xl glass-panel p-5 border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 justify-center sm:justify-start">
                    <Layers className="h-4 w-4 text-primary animate-pulse" />
                    Digital Twin 3-Month Projection
                  </h4>
                  <p className="text-xs text-foreground/60">
                    Based on these active parameters, you will experience a{" "}
                    <span className={`font-bold ${simStability > 70 ? "text-secondary" : "text-red-500"}`}>
                      {simStability > 70 ? "14.2% Stamina Gain" : "22.5% Sleep Quality Degradation"}
                    </span>{" "}
                    by month 3.
                  </p>
                </div>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm" className="whitespace-nowrap flex items-center gap-1">
                    <span>Activate Digital Twin</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. KEY CORE FEATURES GRID */}
      <section className="py-20 bg-background relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <motion.h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI Preventive Architecture Features
            </motion.h2>
            <p className="text-sm text-foreground/75 leading-relaxed">
              VitalCore replaces fragmented trackers with unified, adaptive wellness intelligence designed for longevity and peak capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <GlassCard key={index} glowColor={feat.color as any} className="space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{feat.title}</h3>
                  <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                    {feat.description}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SLIDER SECTION */}
      <section className="py-20 bg-background/50 relative border-t border-foreground/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-bold">Longevity Success Stories</h2>
            <p className="text-sm text-foreground/60 font-semibold">biometric optimization validation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <GlassCard glowColor="violet" className="flex flex-col justify-between min-h-[220px]">
              <p className="text-xs text-foreground/75 leading-relaxed font-medium italic">
                "As a lead software architect doing 10-hour days, I was constantly suffering from fatigue. VitalCore's Fatigue Intelligence and burnout indicators caught a massive decline in my HRV trends. Swapping to active recovery routines saved my sanity."
              </p>
              <div className="border-t border-foreground/5 pt-4 mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/25 font-bold text-xs flex items-center justify-center text-primary">DR</div>
                <div>
                  <h4 className="text-xs font-bold">David R.</h4>
                  <p className="text-xs text-foreground/50">Lead Developer & Hyper-exertion user</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="emerald" className="flex flex-col justify-between min-h-[220px]">
              <p className="text-xs text-foreground/75 leading-relaxed font-medium italic">
                "I activate the Elderly Mode for my grandfather. The scaled typography, highly visible hydration meters, and simple joint stretching guidance are beautifully customized. He finds it easily readable, and it notifies me of step consistency drops."
              </p>
              <div className="border-t border-foreground/5 pt-4 mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary/25 font-bold text-xs flex items-center justify-center text-secondary">LK</div>
                <div>
                  <h4 className="text-xs font-bold">Linda K.</h4>
                  <p className="text-xs text-foreground/50">Family Circle Administrator</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="rose" className="flex flex-col justify-between min-h-[220px]">
              <p className="text-xs text-foreground/75 leading-relaxed font-medium italic">
                "The Environmental AI is magical. On days with poor AQI air quality or high heat warnings in Arizona, VitalCore instantly recalculates my running schedule to suggest respiratory-safe indoor resistance workouts. Absolute game changer!"
              </p>
              <div className="border-t border-foreground/5 pt-4 mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent/25 font-bold text-xs flex items-center justify-center text-accent">SM</div>
                <div>
                  <h4 className="text-xs font-bold">Sarah M.</h4>
                  <p className="text-xs text-foreground/50">Competitive Triathlete</p>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </section>

      {/* 5. PRICING SOLUTIONS */}
      <section className="py-20 bg-background relative border-t border-foreground/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Biomedical Plan Tiers</h2>
            <p className="text-sm text-foreground/70 leading-relaxed font-medium">
              Choose the depth of preventative health simulation that matches your lifestyle complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, index) => (
              <GlassCard 
                key={index} 
                glowColor={plan.highlighted ? "violet" : "none"} 
                className={`flex flex-col justify-between relative ${
                  plan.highlighted ? "border-2 border-primary/50 shadow-2xl" : ""
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[9px] font-bold text-white">
                    Recommended AI Mode
                  </span>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-0.5 my-1">
                    <span className="text-xl font-bold">$</span>
                    <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-xs text-[var(--muted)] ml-1">/ month</span>
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
      </section>

      {/* 6. FAQ COLLAPSIBLE ACCORDION */}
      <section className="py-20 bg-background/30 relative border-t border-foreground/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-bold">Preventative Intelligence FAQ</h2>
            <p className="text-sm text-foreground/60 font-semibold">understanding the biometric engine</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl glass-panel border border-foreground/5 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-foreground hover:bg-foreground/5 transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-foreground/60 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-foreground/75 leading-relaxed font-medium border-t border-foreground/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. PRE-FOOTER CTA CONSOLE BLOCK */}
      <section className="py-20 bg-background relative border-t border-foreground/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl glass-panel border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/5 p-8 md:p-12 text-center relative overflow-hidden space-y-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent_60%)]" />
            
            <h2 className="text-2xl font-bold sm:text-4xl relative z-10">
              Ready to secure your wellness longevity?
            </h2>
            <p className="text-sm text-foreground/75 max-w-2xl mx-auto leading-relaxed relative z-10">
              Initialize your health simulation parameters now. Access fatigue tracking, environment-adapted cardiovascular optimization, and AI Coach support instantly.
            </p>
            
            <div className="flex justify-center pt-2 relative z-10">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg" className="flex items-center gap-2 px-8">
                  <span>Open Biometrics Console</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

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

  const features = [
    {
      title: "Your Future Health Trends",
      description: "Simple wellness insights that look at your habits to help you see patterns and stay healthy 3 to 6 months ahead.",
      icon: TrendingUp,
      color: "violet"
    },
    {
      title: "Burnout Warning Radar",
      description: "Flags small shifts in your sleep and recovery patterns early, helping you avoid fatigue before it starts.",
      icon: ShieldAlert,
      color: "rose"
    },
    {
      title: "Daily Fatigue & Energy Guide",
      description: "Checks your sleep quality, daily stress, and physical fatigue to guide you toward perfect rest.",
      icon: HeartPulse,
      color: "emerald"
    },
    {
      title: "Your Personal Wellness Coach",
      description: "A friendly wellness companion that checks in on your daily routine, prompts you to stay hydrated, and helps you organize your energy.",
      icon: Brain,
      color: "amber"
    },
    {
      title: "Weather-Smart Recommendations",
      description: "Checks local weather, temperatures, and air quality to automatically suggest perfect indoor alternatives when needed.",
      icon: Thermometer,
      color: "violet"
    },
    {
      title: "Focus & Mind Relaxer",
      description: "Tracks screen time and mental fatigue to help you take timely breaks, unwind, and clear your mind.",
      icon: Zap,
      color: "rose"
    }
  ];

  const pricingPlans = [
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
      cta: "Get Started Free",
      highlighted: false
    },
    {
      name: "VitalCore Professional",
      price: "19",
      description: "Complete daily energy predictions, stress insights, and smart weather recommendations.",
      features: [
        "All Standard capabilities",
        "Smart daily predictions & trend alerts",
        "Stress & fatigue tracking",
        "Sleep schedule trends",
        "Weather-smart recommendations",
        "Elderly & beginner modes"
      ],
      cta: "Unlock Pro Features",
      highlighted: true
    },
    {
      name: "VitalCore Enterprise / Elite",
      price: "49",
      description: "Explore your future health patterns and build healthy habits with family and friends.",
      features: [
        "All Pro capabilities",
        "Visual 3-6 month health forecasts",
        "Body age estimates",
        "Family & friends tracking circles",
        "Secure developer API tools",
        "Dedicated wellness coaching"
      ],
      cta: "Unlock Elite Features",
      highlighted: false
    }
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does VitalCore predict future health changes?",
      answer: "VitalCore looks at your daily habits – like sleep quality, heart rate trends, active steps, stress levels, and meals. By noticing small changes in these numbers over time, we can show you how your energy is trending and help you stay ahead of burnout before you even start feeling tired."
    },
    {
      question: "What is the Burnout Warning Radar?",
      answer: "It's easy to miss tiny daily shifts, like sleeping 15 minutes less each night or having slightly higher stress. The warning radar spots these slow, creeping patterns early, letting you know with friendly tips (like: 'Your sleep has been a little short this week, let's take it easy today!') so you can recharge before feeling drained."
    },
    {
      question: "How do the Elderly and Beginner Modes work?",
      answer: "You can easily switch modes in the top navigation bar! Beginner Mode makes charts simpler and offers daily activity tips, while Elderly Mode uses larger, high-contrast text, simplifies the screen, and focuses entirely on easy, important goals like gentle stretching, water reminders, and daily walks."
    },
    {
      question: "How secure is my wellness data?",
      answer: "Your privacy is our top priority. If you're using our standard Mock Mode, everything you track stays completely private on your own device – none of your data ever leaves your browser. If you choose to connect an account to our secure cloud, your personal logs are strictly locked to you, ensuring nobody else can ever access them."
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      {/* Soft Ambient Cinematic Background Asset */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1000px] bg-cover bg-center pointer-events-none opacity-85 dark:opacity-40 z-0"
        style={{ backgroundImage: "url('/images/saas_background.png')" }}
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden z-10">
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/15 px-3 py-1 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Your Friendly Personal Wellness Companion</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-semibold tracking-tight sm:text-4xl max-w-4xl mx-auto"
          >
            Live Healthier. Feel Better.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
              Sleep Deeper.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm text-foreground/75 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Get warm, personalized wellness coaching and simple insights to help you build healthy habits, stay hydrated, and feel energized every single day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="glass" size="lg">See How It Works</Button>
            </Link>
          </motion.div>

          {/* Quick Hero metrics review */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-10 flex flex-wrap justify-center gap-4 text-xs font-semibold text-foreground/80 max-w-3xl mx-auto"
          >
            <div className="px-4 py-2.5 rounded-xl glass-panel border-foreground/5 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span>Wellness Assistant Connected</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl glass-panel border-foreground/5 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-secondary" />
              <span>Heart Rate & Rest Insights</span>
            </div>
            <div className="px-4 py-2.5 rounded-xl glass-panel border-foreground/5 flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              <span>Burnout Prevention Alerts</span>
            </div>
          </motion.div>

          {/* Centered Premium App Mockup illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="pt-12 max-w-3xl mx-auto"
          >
            <div className="rounded-[32px] overflow-hidden border border-foreground/5 bg-[var(--card-bg)] shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-2.5 relative group">
              {/* Decorative premium gradients */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/10 via-secondary/10 to-accent/5 rounded-[34px] blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              
              <div className="relative rounded-[24px] overflow-hidden border border-foreground/5 aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center p-6 sm:p-12 bg-gradient-to-tr from-[var(--muted-bg)]/80 to-[var(--card-bg)]/80 shadow-inner">
                
                {/* Embedded Illustrative Mockup Content */}
                <div className="w-full max-w-lg bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[24px] p-5 sm:p-6 text-left space-y-4 shadow-xl select-none">
                  {/* Mockup Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-foreground/5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[9px] font-bold text-[var(--foreground)] uppercase tracking-widest">Wellness Twin Stance</span>
                    </div>
                    <span className="text-[9px] text-[var(--muted)] font-semibold">Today's forecast</span>
                  </div>
                  
                  {/* Mockup Body Content */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[var(--muted)] block font-semibold">Biological Recovery Status</span>
                      <h3 className="text-base font-semibold text-[var(--foreground)] tracking-tight leading-tight">Your recovery is excellent.</h3>
                      <p className="text-[10px] text-[var(--muted)] leading-relaxed font-normal">
                        Cardiac indices and sleep debt are fully balanced. Today is optimized for active training.
                      </p>
                    </div>
                    
                    {/* Visual graph / mini progress layout */}
                    <div className="bg-[var(--muted-bg)]/40 p-4 rounded-2xl border border-foreground/5 flex flex-col justify-between min-h-[100px]">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-[var(--muted)]">
                        <span>Energy Reserves</span>
                        <span className="text-primary font-bold">88%</span>
                      </div>
                      <div className="w-full bg-[var(--border)] h-1 rounded-full overflow-hidden mt-1.5">
                        <div className="bg-primary h-full rounded-full" style={{ width: "88%" }} />
                      </div>
                      <span className="text-[9px] text-[var(--muted)] block leading-normal mt-2 font-medium">
                        +12% capacity boost compared to yesterday.
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

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
              VitalCore replaces complicated trackers with a single, simple wellness companion designed to help you stay healthy and feel energized.
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
            <h2 className="text-3xl font-bold">Real Success Stories</h2>
            <p className="text-sm text-foreground/60 font-semibold">what our members say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <GlassCard glowColor="violet" className="flex flex-col justify-between min-h-[220px]">
              <p className="text-xs text-foreground/75 leading-relaxed font-medium italic">
                "As a lead software developer working long hours, I was always feeling tired. VitalCore's fatigue checks noticed when my energy was dropping and gently suggested a lighter routine. Swapping to active recovery saved my energy!"
              </p>
              <div className="border-t border-foreground/5 pt-4 mt-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/25 font-bold text-xs flex items-center justify-center text-primary">DR</div>
                <div>
                  <h4 className="text-xs font-bold">David R.</h4>
                  <p className="text-xs text-foreground/50">Lead Developer</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="emerald" className="flex flex-col justify-between min-h-[220px]">
              <p className="text-xs text-foreground/75 leading-relaxed font-medium italic">
                "I turned on the Elderly Mode for my grandfather. The large text, bright water meters, and gentle joint stretching routines are perfect for him. It's so easy to read, and it helps our family stay connected and look out for him."
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
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-foreground/60 font-semibold">answers to common questions</p>
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
              Ready to start your wellness journey?
            </h2>
            <p className="text-sm text-foreground/75 max-w-2xl mx-auto leading-relaxed relative z-10">
              Join today to start building healthy habits, track your daily energy and sleep quality, and get warm, supportive guidance from your AI Coach.
            </p>
            
            <div className="flex justify-center pt-2 relative z-10">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg" className="flex items-center gap-2 px-8">
                  <span>Get Started</span>
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

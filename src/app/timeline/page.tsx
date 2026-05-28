"use client";

import React, { useState, useEffect } from "react";
import { Milestone, TrendingUp, Sparkles, Layers, ShieldAlert } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getDigitalTwinForecast, DailyMetrics, TwinForecastPoint } from "@/utils/mockData";

export default function TimelinePage() {
  const { activeMode } = useTheme();
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [simulationMonths, setSimulationMonths] = useState(6);
  const [twinPoints, setTwinPoints] = useState<TwinForecastPoint[]>([]);

  useEffect(() => {
    const base = getBaseMetrics(activeMode);
    setMetrics(base);
    setTwinPoints(getDigitalTwinForecast(base.stabilityScore, simulationMonths));
  }, [activeMode, simulationMonths]);

  if (!metrics) return null;

  const timelineEvents = [
    {
      date: "May 24, 2026",
      title: "Circadian Sync Milestone",
      description: "Achieved 14 consecutive sleep schedules with latency deviation below 10 minutes. Sleep score rose by 8%.",
      type: "milestone",
      color: "border-secondary text-secondary"
    },
    {
      date: "May 18, 2026",
      title: "Invisible Cardiovascular Decline Alert",
      description: "AI flagged gradual 4.5% rise in resting heart rate over 14 days linked to late-night snacking.",
      type: "decline",
      color: "border-red-500 text-red-500"
    },
    {
      date: "May 10, 2026",
      title: "Environment Throttling Event",
      description: "Sub-zero pollution trigger: Active outdoor cardiovascular target adapted to indoor functional routines.",
      type: "adaptation",
      color: "border-primary text-primary"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Milestone className="h-6 w-6 text-primary animate-pulse" />
              Health Evolution & Digital Twin Simulator
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              3-6 Months future trend forecasting, biological age & chronic stability indexes
            </p>
          </div>
        </div>

        {/* 1. DUAL HIGHLIGHTS: Stability & Biological Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <GlassCard glowColor="violet" className="p-5 flex justify-between items-center min-h-[120px]">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground/60">Wellness Stability index</span>
              <h2 className="text-3xl font-bold">{metrics.stabilityScore}%</h2>
              <p className="text-xs text-foreground/60 leading-normal font-semibold">Lifestyle stability is high. Hydration consistency protects organs.</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              S
            </div>
          </GlassCard>

          <GlassCard glowColor="emerald" className="p-5 flex justify-between items-center min-h-[120px]">
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground/60">Biological Age Estimator</span>
              <h2 className="text-3xl font-bold">{metrics.biologicalAge} yrs</h2>
              <p className="text-xs text-foreground/60 leading-normal font-semibold"> lifestyle is {metrics.biologicalAge < 30 ? "younger" : "older"} than chronological benchmark.</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-bold text-sm shrink-0">
              A
            </div>
          </GlassCard>

        </div>

        {/* 2. DUAL LAYOUT: Digital Twin projection table vs Vertical timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Digital Twin forecasting table */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-primary" />
                Digital Twin 6-Month forecasting Simulator
              </h3>
              <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                Simulates your physical trajectory under continuous positive adjustments vs default habit decay:
              </p>

              {/* Forecast points list */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-3 text-xs font-bold text-foreground/60 pb-2 border-b border-foreground/5 text-center">
                  <span>Timeline</span>
                  <span className="text-secondary">Constructive path</span>
                  <span className="text-red-500">Destructive decay</span>
                </div>

                {twinPoints.map((pt, idx) => (
                  <div key={idx} className="grid grid-cols-3 text-xs font-semibold py-2.5 border-b border-foreground/5 text-center items-center">
                    <span className="text-foreground/70">{pt.month}</span>
                    <span className="text-secondary font-bold">{pt.constructiveScore}% Stability</span>
                    <span className="text-red-500 font-bold">{pt.destructiveScore}% Stability</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-foreground/5">
              <span className="text-xs text-foreground/50 font-semibold">Twin forecaster model: Active</span>
              <div className="flex gap-2">
                <Button variant="glass" size="sm" onClick={() => setSimulationMonths(3)} className={simulationMonths === 3 ? "border-primary text-primary" : ""}>3 months</Button>
                <Button variant="glass" size="sm" onClick={() => setSimulationMonths(6)} className={simulationMonths === 6 ? "border-primary text-primary" : ""}>6 months</Button>
              </div>
            </div>
          </div>

          {/* Right panel: Timeline events list */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 space-y-4">
            <h3 className="text-xs font-bold text-foreground">Health Evolution Logs</h3>
            
            <div className="space-y-5 pt-3 relative pl-4 border-l border-foreground/5">
              {timelineEvents.map((ev, idx) => (
                <div key={idx} className="space-y-1 relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[20.5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-background border-primary shrink-0" />
                  
                  <span className="text-[9px] font-bold text-foreground/50">{ev.date}</span>
                  <h4 className="text-xs font-bold text-foreground">{ev.title}</h4>
                  <p className="text-xs text-foreground/70 leading-normal font-semibold">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

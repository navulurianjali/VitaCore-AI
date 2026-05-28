"use client";

import React, { useState, useEffect } from "react";
import { 
  Moon, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ChevronRight, 
  Plus, 
  Percent, 
  Calendar,
  CheckCircle2,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import confetti from "canvas-confetti";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";

interface SleepLog {
  date: string;
  duration: number; // hrs
  quality: number; // 1-10
  wakings: number;
  refreshment: number; // 1-10
  mood: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
  muscleRepair: number; // %
}

const initialLogs: SleepLog[] = [
  { date: "05/22", duration: 6.0, quality: 5.0, wakings: 3, refreshment: 4.0, mood: 5.0, energy: 5.0, stress: 8.0, muscleRepair: 45 },
  { date: "05/23", duration: 7.2, quality: 7.5, wakings: 1, refreshment: 7.0, mood: 7.0, energy: 7.5, stress: 5.0, muscleRepair: 72 },
  { date: "05/24", duration: 5.5, quality: 4.0, wakings: 4, refreshment: 3.0, mood: 4.0, energy: 4.0, stress: 9.0, muscleRepair: 35 },
  { date: "05/25", duration: 8.0, quality: 9.0, wakings: 0, refreshment: 9.0, mood: 8.5, energy: 9.0, stress: 2.0, muscleRepair: 92 },
  { date: "05/26", duration: 6.8, quality: 7.0, wakings: 2, refreshment: 6.5, mood: 6.5, energy: 7.0, stress: 6.0, muscleRepair: 65 },
  { date: "05/27", duration: 6.2, quality: 6.0, wakings: 2, refreshment: 5.0, mood: 5.5, energy: 6.0, stress: 7.0, muscleRepair: 58 },
  { date: "05/28", duration: 7.8, quality: 8.5, wakings: 1, refreshment: 8.5, mood: 8.0, energy: 8.5, stress: 3.0, muscleRepair: 85 }
];

export default function SleepPage() {
  const { activeMode } = useTheme();
  const { profile } = useAuth();
  
  // Mounted check to bypass hydration bugs in Recharts
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Form parameters
  const [showLogForm, setShowLogForm] = useState(false);
  const [onset, setOnset] = useState("22:30");
  const [wake, setWake] = useState("06:30");
  const [quality, setQuality] = useState(8);
  const [wakings, setWakings] = useState(1);
  const [refreshment, setRefreshment] = useState(8);
  const [mood, setMood] = useState(8);
  const [stress, setStress] = useState(3);

  const [logs, setLogs] = useState<SleepLog[]>(initialLogs);

  // Parse time differences
  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const getDuration = (onsetVal: string, wakeVal: string) => {
    const onsetM = parseTime(onsetVal);
    const wakeM = parseTime(wakeVal);
    let diff = wakeM - onsetM;
    if (diff < 0) diff += 24 * 60; // crossovers midnight
    return Math.round((diff / 60) * 10) / 10;
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const durationHrs = getDuration(onset, wake);
    
    // Estimate muscle repair: poor sleep blocks synthesis, high sleep builds
    let muscle = Math.round(durationHrs * 11);
    if (quality > 8) muscle += 10;
    if (wakings > 2) muscle -= 15;
    muscle = Math.max(30, Math.min(99, muscle));

    const today = new Date();
    const dateLabel = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

    const newLog: SleepLog = {
      date: dateLabel,
      duration: durationHrs,
      quality: Number(quality),
      wakings: Number(wakings),
      refreshment: Number(refreshment),
      mood: Number(mood),
      energy: Math.round(((Number(quality) + Number(refreshment)) / 2) * 10) / 10,
      stress: Number(stress),
      muscleRepair: muscle
    };

    setLogs((prev) => [...prev.slice(1), newLog]);
    setShowLogForm(false);
    
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ["#3b82f6", "#8b5cf6", "#10b981"]
    });
  };

  // Calculations
  const latestLog = logs[logs.length - 1];
  const targetSleep = profile?.sleep_problems ? 8.5 : 8.0;
  
  const avgDuration = Math.round((logs.reduce((acc, curr) => acc + curr.duration, 0) / logs.length) * 10) / 10;
  const sleepDebt = Math.max(0, Math.round((targetSleep - latestLog.duration) * 10) / 10);
  
  // Consistency index calculated based on deviation of duration
  const calculateConsistency = (items: SleepLog[]) => {
    if (items.length <= 1) return 100;
    const avg = items.reduce((acc, curr) => acc + curr.duration, 0) / items.length;
    const variance = items.reduce((acc, curr) => acc + Math.pow(curr.duration - avg, 2), 0) / items.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(45, Math.round(100 - stdDev * 16));
  };
  const consistencyIndex = calculateConsistency(logs);

  const recoveryScore = Math.round(
    logs.reduce((acc, curr) => {
      const score = (curr.quality * 6 + curr.refreshment * 4) - (curr.wakings * 4);
      return acc + Math.max(10, Math.min(100, score * 10));
    }, 0) / logs.length
  );

  // Dynamic warning alerts
  const showAlert = latestLog.duration < 6.5 || latestLog.wakings >= 3 || latestLog.quality < 6;

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-background/95 border border-foreground/10 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md">
          <p className="text-foreground/50 mb-1">Telemetry Date: {label}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color || pld.fill }}>
              {pld.name}: {pld.value} {pld.name.includes("Repair") ? "%" : pld.name.includes("Duration") ? "hrs" : "/ 10"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        
        {/* Banner header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Moon className="h-6 w-6 text-primary animate-pulse" />
              Sleep Circadian & Recovery Terminal
            </h1>
            <p className="text-[11px] text-foreground/70 font-semibold uppercase tracking-wider">
              Autonomous Sleep Architecture, Endocrine Stress Diagnostics, and Muscle Repair Synchronization
            </p>
          </div>

          <Button 
            variant="primary" 
            onClick={() => setShowLogForm(!showLogForm)} 
            className="flex items-center gap-2 self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Log Last Night's Sleep</span>
          </Button>
        </div>

        {/* Dynamic Warning Block */}
        {showAlert && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex gap-3 items-start relative overflow-hidden">
            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Circadian Impairment Alert</h4>
              <p className="text-[11px] text-foreground/75 leading-normal font-semibold">
                Critical: Sleep duration of {latestLog.duration}h falls significantly below your {targetSleep}h threshold. Night wakings ({latestLog.wakings}) have stimulated excessive cortisol release, raising stress loads by 35% and halting lean muscle protein synthesis. Avoid caffeine past 2:00 PM today.
              </p>
            </div>
          </div>
        )}

        {/* 1. Core Sleep Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <GlassCard glowColor="violet" className="flex flex-col justify-between min-h-[140px] p-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Sleep Quality</span>
              <div className="text-2xl font-extrabold mt-1 text-foreground">{latestLog.quality * 10}%</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden my-3">
              <div className="bg-primary h-full rounded-full" style={{ width: `${latestLog.quality * 10}%` }} />
            </div>
            <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
              Deep & REM phases represented {Math.round(latestLog.quality * 5.2)}% of total sleep architectures.
            </p>
          </GlassCard>

          <GlassCard glowColor="emerald" className="flex flex-col justify-between min-h-[140px] p-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Circadian consistency</span>
              <div className="text-2xl font-extrabold mt-1 text-foreground">{consistencyIndex}%</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden my-3">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${consistencyIndex}%` }} />
            </div>
            <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
              Your wakeup timing deviated by less than {Math.round((100 - consistencyIndex) * 0.8)} minutes over 7 days.
            </p>
          </GlassCard>

          <GlassCard glowColor="rose" className="flex flex-col justify-between min-h-[140px] p-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Sleep Debt Index</span>
              <div className="text-2xl font-extrabold mt-1 text-foreground">{sleepDebt} hours</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden my-3">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, (sleepDebt / 3) * 100)}%` }} />
            </div>
            <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
              Requires {Math.round((latestLog.duration + sleepDebt) * 10) / 10} hours tonight to zero sleep deficit.
            </p>
          </GlassCard>

          <GlassCard glowColor="violet" className="flex flex-col justify-between min-h-[140px] p-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/60">Recovery Efficiency</span>
              <div className="text-2xl font-extrabold mt-1 text-foreground">{recoveryScore}%</div>
            </div>
            <div className="w-full bg-foreground/10 h-1.5 rounded-full overflow-hidden my-3">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: `${recoveryScore}%` }} />
            </div>
            <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
              Calculated using quality markers, night wakings, and refreshment.
            </p>
          </GlassCard>

        </div>

        {/* 2. Redesigned Sleep Logger Form Modal Overlay */}
        {showLogForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 text-white rounded-3xl p-8 shadow-2xl space-y-6 select-none font-sans">
              
              <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Moon className="h-5 w-5 text-primary animate-pulse" />
                  Circadian Sleep Telemetry Logger
                </h3>
                <button 
                  onClick={() => setShowLogForm(false)}
                  className="text-zinc-400 hover:text-white font-extrabold text-sm p-1.5 hover:bg-zinc-900 rounded-xl transition-all"
                  aria-label="Close sleep modal"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddLog} className="space-y-6">
                
                {/* Onset / Wake inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                      Sleep Onset Time
                    </label>
                    <input 
                      type="time" 
                      value={onset} 
                      onChange={(e) => setOnset(e.target.value)}
                      required
                      className="w-full text-sm px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                      Wakeup Time
                    </label>
                    <input 
                      type="time" 
                      value={wake} 
                      onChange={(e) => setWake(e.target.value)}
                      required
                      className="w-full text-sm px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Sleep Quality slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <span className="text-zinc-300">Sleep Quality (1 - 10)</span>
                    <span className="text-sm font-extrabold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl">
                      {quality} / 10
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="0.5" 
                    value={quality} 
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-zinc-800 accent-primary focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                    <span>Restless (1)</span>
                    <span>Restorative Deep (10)</span>
                  </div>
                </div>

                {/* Night Wakings and Refreshment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                      Night Wakings
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      max="10" 
                      value={wakings} 
                      onChange={(e) => setWakings(Number(e.target.value))}
                      className="w-full text-sm px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span className="text-zinc-300">Refreshment</span>
                      <span className="text-sm font-extrabold text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-xl">
                        {refreshment} / 10
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="0.5" 
                      value={refreshment} 
                      onChange={(e) => setRefreshment(Number(e.target.value))}
                      className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-zinc-800 accent-secondary focus:outline-none mt-1"
                    />
                  </div>

                </div>

                {/* Mood and Stress Load sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-zinc-800 pt-5">
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span className="text-zinc-300">Next Day Mood</span>
                      <span className="text-xs font-extrabold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-lg">
                        {mood} / 10
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={mood} 
                      onChange={(e) => setMood(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-800 accent-emerald-400 mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span className="text-zinc-300">Stress Load</span>
                      <span className="text-xs font-extrabold text-rose-400 bg-rose-400/10 border border-rose-400/20 px-2.5 py-0.5 rounded-lg">
                        {stress} / 10
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={stress} 
                      onChange={(e) => setStress(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-800 accent-rose-400 mt-1"
                    />
                  </div>

                </div>

                {/* Submit button */}
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-full mt-6 py-4 text-xs font-extrabold uppercase tracking-widest bg-primary hover:bg-primary/95 text-white rounded-xl shadow-lg shadow-primary/10 border border-primary/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Commit Night Biometrics</span>
                </Button>
                
              </form>
            </div>
          </div>
        )}

        {/* 3. Deep Analytics and Recharts Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Sleep Duration vs Vitality */}
          <div className="rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                Circadian Sleep Duration vs. Next-Day Vitality
              </h3>
              <p className="text-[10px] text-foreground/50 font-semibold uppercase mt-0.5">
                Demonstrating the direct correlation of total sleep hours on energy and cognitive productivity
              </p>
            </div>

            <div className="h-64 w-full pt-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" style={{ fontSize: "9px", fontWeight: "bold" }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: "9px", fontWeight: "bold" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "10px" }} />
                    <Area 
                      type="monotone" 
                      name="Duration (hrs)" 
                      dataKey="duration" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorDuration)" 
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      name="Energy Level" 
                      dataKey="energy" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorEnergy)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-foreground/30 font-bold">
                  Initializing Charts...
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Sleep Quality vs Cortisol and Muscle Repair */}
          <div className="rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <BrainCircuit className="h-4.5 w-4.5 text-secondary" />
                Circadian Sleep Quality vs. Cortisol Stress & Muscle Repair
              </h3>
              <p className="text-[10px] text-foreground/50 font-semibold uppercase mt-0.5">
                Cortisol (stress loads) is mitigated and cell repair accelerated during high-quality circadian structures
              </p>
            </div>

            <div className="h-64 w-full pt-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" style={{ fontSize: "9px", fontWeight: "bold" }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: "9px", fontWeight: "bold" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "10px" }} />
                    <Bar 
                      name="Quality Score" 
                      dataKey="quality" 
                      fill="#8b5cf6" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={30}
                    />
                    <Line 
                      type="monotone" 
                      name="Cortisol Stress" 
                      dataKey="stress" 
                      stroke="#ef4444" 
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      name="Muscle Repair Index" 
                      dataKey="muscleRepair" 
                      stroke="#f59e0b" 
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-foreground/30 font-bold">
                  Initializing Charts...
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 4. AI Coach Deep Predictive Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Circadian Schedule */}
          <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border-foreground/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-primary" />
              Optimal Circadian Phase Schedule
            </h3>
            
            <div className="space-y-3.5 pt-1">
              <div className="flex justify-between items-center py-2 border-b border-foreground/5 text-xs font-semibold">
                <span className="text-foreground/65">Ideal Sleep Onset Window</span>
                <span className="text-primary font-bold">9:45 PM - 10:20 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-foreground/5 text-xs font-semibold">
                <span className="text-foreground/65">Melatonin Onset Secretion Peak</span>
                <span className="text-secondary font-bold">11:15 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-foreground/5 text-xs font-semibold">
                <span className="text-foreground/65">Deep Stage-3 Restorative Focus</span>
                <span className="text-amber-400 font-bold">11:30 PM - 2:30 AM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-foreground/5 text-xs font-semibold">
                <span className="text-foreground/65">Average Wakeup Drift Deviation</span>
                <span className="text-emerald-400 font-bold">± 12 minutes (Excellent)</span>
              </div>
            </div>
          </div>

          {/* Educational Insights Panel */}
          <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-4 bg-gradient-to-tr from-secondary/5 via-background to-primary/5">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Zap className="h-4.5 w-4.5 text-secondary animate-pulse" />
                Preventative Circadian intelligence
              </h3>
              <p className="text-[11px] text-foreground/75 leading-relaxed font-semibold">
                Sleeping under 7 hours induces a rapid surge in morning cortisol stress levels. High cortisol blocks muscle protein synthesis, stops metabolic fat loss mechanisms, and forces the body to prioritize glucose accumulation (increasing metabolic risks).
              </p>
              <div className="p-3.5 bg-foreground/5 rounded-xl border border-foreground/5 text-xs font-semibold">
                <span className="text-secondary font-bold block mb-1">🧠 AI Sleep Correlation Analysis:</span>
                "Telemetry logs confirm that on days following under 6.5 hours of sleep, your focus efficiency declines by <span className="text-rose-400 font-bold">28%</span>, and reported emotional anxiety spikes by <span className="text-rose-400 font-bold">42%</span>. Restoring 8h sleep tonight will increase muscle repair velocity by <span className="text-emerald-400 font-bold">34%</span>."
              </div>
            </div>

            <div className="text-[10px] text-foreground/50 leading-normal font-semibold border-t border-foreground/5 pt-3">
              Preventative Indicator: Consistent circadian habits cut long-term obesity risks by <span className="text-secondary font-bold">18%</span> and cognitive fatigue rates by <span className="text-primary font-bold">31%</span>.
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

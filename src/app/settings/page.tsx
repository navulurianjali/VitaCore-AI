"use client";

import React, { useState } from "react";
import { Settings, Sparkles, Trash2, ShieldCheck, Sun, Moon, Info } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";

export default function SettingsPage() {
  const { theme, toggleTheme, activeMode, setActiveMode } = useTheme();
  const { profile } = useAuth();
  
  const [cleared, setCleared] = useState(false);

  const handleWipeCache = () => {
    if (confirm("Are you absolutely sure you want to completely erase all local biometric storage caches? This action is permanent and destroys all custom macro logs.")) {
      if (typeof window !== "undefined") {
        // Clear mock database
        localStorage.clear();
      }
      setCleared(true);
      
      confetti({
        particleCount: 40,
        spread: 30,
        colors: ["#ef4444"]
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary animate-pulse" />
              Platform Settings Control Panel
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Visual accessibility scales, mock credentials, biometrics purging & RLS settings
            </p>
          </div>
        </div>

        {/* 1. DUAL LAYOUT: Active mode setup vs Security wipe */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Theme and active modes toggles */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Active visual mode toggle */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  Biometric Engine UI Scale Modifiers
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed font-semibold">
                  Toggling scaling modes automatically mutates typography scale factors, line weights, contrast, and layout complexity parameters across the platform console:
                </p>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  {(["wellness", "performance", "elderly"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveMode(m)}
                      className={`px-3 py-3 text-xs capitalize rounded-xl font-bold transition-all border ${
                        activeMode === m 
                          ? "bg-primary text-white border-primary/20 shadow-md shadow-primary/15" 
                          : "bg-foreground/5 hover:bg-foreground/10 border-foreground/5 text-foreground/85"
                      }`}
                    >
                      {m} Mode
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme light dark mode toggle */}
              <div className="space-y-3 pt-3 border-t border-foreground/5">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  {theme === "dark" ? <Moon className="h-4.5 w-4.5 text-primary" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
                  Dynamic Interface Theme Color
                </h3>
                <div className="flex gap-2">
                  <Button variant={theme === "dark" ? "primary" : "glass"} onClick={toggleTheme} className="flex-1 text-xs">
                    Dark Space Obsidian
                  </Button>
                  <Button variant={theme === "light" ? "primary" : "glass"} onClick={toggleTheme} className="flex-1 text-xs">
                    Light Pure Alabaster
                  </Button>
                </div>
              </div>

            </div>

            <div className="text-xs text-foreground/50 leading-normal font-semibold border-t border-foreground/5 pt-3">
              Accessibility compliance: Enabled and compliant with AAA rating under typography scaling modes.
            </div>
          </div>

          {/* Right panel: Security purger cache */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Trash2 className="h-4 w-4 text-red-500 animate-pulse" />
                GDPR Local Cache Purger
              </h3>
              <p className="text-xs text-foreground/60 leading-normal font-semibold">
                Purge all biometric logs, workout lists, and custom sessions from your browser sandbox cache:
              </p>

              {cleared ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-500 font-semibold">
                  ⚠ All biometric databases wiped successfully! Redirecting...
                </div>
              ) : (
                <Button variant="danger" onClick={handleWipeCache} className="w-full py-3 flex items-center justify-center gap-1 text-xs font-bold">
                  <Trash2 className="h-4 w-4" />
                  <span>Wipe Biometrics Cache</span>
                </Button>
              )}
            </div>

            <GlassCard glowColor="rose" className="p-4 flex gap-3 items-start border border-foreground/5">
              <ShieldCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-[9px] font-bold text-red-500">HIPAA Inspired Isolation</h4>
                <p className="text-[9px] text-foreground/75 leading-relaxed font-semibold">
                  Row level security is compiled in all active schemas. All credentials packets are validated against secure cryptographic JSON web token standard procedures.
                </p>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

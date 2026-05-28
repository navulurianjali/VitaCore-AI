"use client";

import React, { useState } from "react";
import { Scan, Upload, Sparkles, AlertTriangle, CheckCircle, Apple, Info, CornerDownRight } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { parseSimulatedFoodScan, ScanResult } from "@/utils/mockData";
import confetti from "canvas-confetti";

export default function FoodScannerPage() {
  const [inputText, setInputText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScanSimulation = (query: string) => {
    if (!query.trim()) return;

    setScanning(true);
    setResult(null);

    // Simulate fast futuristic scanning animation
    setTimeout(() => {
      const scanResult = parseSimulatedFoodScan(query);
      setResult(scanResult);
      setScanning(false);
      setInputText("");

      // Trigger achievement confettis if the scanned food has a perfect health score
      if (scanResult.healthScore >= 80) {
        confetti({
          particleCount: 40,
          spread: 30,
          colors: ["#10b981", "#8b5cf6"]
        });
      }
    }, 1800);
  };

  const sampleFoods = [
    { label: "Salmon Salad", query: "Atlantic Salmon Avocado Salad" },
    { label: "Pepperoni Pizza", query: "Double Cheese Pepperoni Pizza Slice" },
    { label: "Fuji Apple", query: "Organic Fuji Apple" },
    { label: "Energy Bar (Barcode)", query: "73204901842" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Scan className="h-6 w-6 text-primary animate-pulse" />
              AI-Powered Food & Barcode Scanner
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Futuristic ingredient analysis, glycemic spike warnings & healthy alternatives
            </p>
          </div>
        </div>

        {/* 1. MAIN SCANNER CONSOLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Trigger Console */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                Diagnostic Scan Trigger
              </h3>

              {/* Photo upload simulator box */}
              <div 
                onClick={() => handleScanSimulation("Atlantic Salmon Avocado Salad")}
                className="h-40 rounded-2xl border-2 border-dashed border-foreground/15 hover:border-primary/50 bg-foreground/5 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-background border border-foreground/5 flex items-center justify-center text-foreground/70 group-hover:scale-110 transition-transform">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground">Simulate Photo Upload</span>
                <span className="text-xs text-foreground/50">Supports JPEG, PNG biometrics</span>
              </div>

              {/* Barcode scanner form */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Barcode / Food Item Search</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter barcode or food name"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                  />
                  <Button 
                    variant="primary" 
                    onClick={() => handleScanSimulation(inputText)} 
                    className="px-4 py-2.5 text-xs font-bold shrink-0"
                  >
                    Scan
                  </Button>
                </div>
              </div>

              {/* Sample pre-seeded logs */}
              <div className="space-y-2 pt-2">
                <span className="text-[9px] font-bold text-foreground/50 block">Instant Demos</span>
                <div className="flex flex-wrap gap-2">
                  {sampleFoods.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleScanSimulation(s.query)}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-foreground/5 border border-foreground/5 hover:border-primary/30 transition-all cursor-pointer text-foreground/75"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[9px] text-foreground/50 leading-normal font-semibold border-t border-foreground/5 pt-3">
              *AI scanner models conform to public database indices logs.
            </div>
          </div>

          {/* Right panel: Scan results display */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-center min-h-[380px]">
            
            {scanning && (
              <div className="flex flex-col items-center gap-3 text-center py-10">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <span className="text-xs font-bold tracking-widest text-primary animate-pulse">Running Neural Scanner...</span>
                <p className="text-xs text-foreground/60 max-w-xs">Extracting glycemic vectors, calorie estimates, and packaging chemicals logs.</p>
              </div>
            )}

            {!scanning && !result && (
              <div className="flex flex-col items-center gap-2 text-center py-10 text-foreground/45 select-none">
                <Scan className="h-10 w-10 text-foreground/30 animate-pulse" />
                <span className="text-xs font-bold">Console Empty</span>
                <p className="text-xs max-w-xs">Upload a food snapshot or scan a barcode to generate macromolecule reports instantly.</p>
              </div>
            )}

            {!scanning && result && (
              <div className="space-y-6">
                
                {/* Result header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="rounded-full bg-primary/10 border border-primary/15 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                      Portion: {result.portionSize}
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-1">{result.foodName}</h3>
                  </div>
                  
                  {/* Health Score circle */}
                  <div className={`h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg ${
                    result.healthScore >= 80 
                      ? "border-secondary text-secondary shadow-secondary/10" 
                      : "border-red-500 text-red-500 shadow-red-500/10"
                  }`}>
                    <span className="text-[8px] font-bold">Score</span>
                    <span className="text-base font-bold">{result.healthScore}</span>
                  </div>
                </div>

                {/* Macro breakdown grid */}
                <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
                  <div className="bg-foreground/5 p-2 rounded-lg border border-foreground/5">
                    <span className="text-primary block font-bold">Protein</span>
                    <span className="text-sm font-bold block mt-0.5">{result.protein}g</span>
                  </div>

                  <div className="bg-foreground/5 p-2 rounded-lg border border-foreground/5">
                    <span className="text-secondary block font-bold">Carbs</span>
                    <span className="text-sm font-bold block mt-0.5">{result.carbs}g</span>
                  </div>

                  <div className="bg-foreground/5 p-2 rounded-lg border border-foreground/5">
                    <span className="text-accent block font-bold">Fats</span>
                    <span className="text-sm font-bold block mt-0.5">{result.fat}g</span>
                  </div>

                  <div className="bg-foreground/5 p-2 rounded-lg border border-foreground/5">
                    <span className="text-red-400 block font-bold">Sugars</span>
                    <span className="text-sm font-bold block mt-0.5">{result.sugar}g</span>
                  </div>
                </div>

                {/* Sugar Warning */}
                {result.sugarAlert && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-500 font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Heavy glycemic load warning! Sugar count exceeds safe snack limits.</span>
                  </div>
                )}

                {/* Chemical Additives Warnings */}
                {result.unhealthyAdditives.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-red-500 block">Unhealthy Chemical Additives Detected:</span>
                    <div className="flex flex-wrap gap-2">
                      {result.unhealthyAdditives.map((ad, idx) => (
                        <span key={idx} className="rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-500">
                          {ad}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Narrative Diagnostic */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-foreground/50 block">Preventative Diagnostics:</span>
                  <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                    {result.nutritionRecommendation}
                  </p>
                </div>

                {/* Healthier Alternatives */}
                <div className="space-y-2 pt-2 border-t border-foreground/5">
                  <span className="text-[9px] font-bold text-secondary block">Healthier Alternative Suggestions:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-foreground/80">
                    {result.alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-2 bg-secondary/5 rounded-lg border border-secondary/10">
                        <CornerDownRight className="h-3 w-3 text-secondary shrink-0" />
                        <span>{alt}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

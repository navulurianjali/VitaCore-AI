"use client";

import React, { useState, useEffect, useRef } from "react";
import { Scan, Upload, Sparkles, AlertTriangle, Apple, Info, CornerDownRight, Camera, X, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import confetti from "canvas-confetti";

interface ScanResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  portionSize: string;
  healthScore: number;
  sugarAlert: boolean;
  unhealthyAdditives: string[];
  alternatives: string[];
  nutritionRecommendation: string;
}

export default function FoodScannerPage() {
  const { profile } = useAuth();
  
  // UI states
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Drag & drop state
  const [dragActive, setDragActive] = useState(false);

  // Camera Media stream refs
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cycle scanning messages for visual premium feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanning) {
      interval = setInterval(() => {
        setScanningStep(prev => (prev >= 2 ? 0 : prev + 1));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [scanning]);

  // Clean up camera stream on page exit/unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // HTML5 MediaDevices UserMedia Camera capturing
  const handleOpenCamera = async () => {
    setErrorMsg("");
    setShowCamera(true);
    setImagePreview(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } } // mobile rear camera prioritized
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setErrorMsg("Failed to open camera. Please grant camera access permissions in your browser.");
      setShowCamera(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        handleStopCamera();
        handleAnalyzeImage(dataUrl);
      }
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Drag and Drop & file upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const processImageFile = (file: File) => {
    setErrorMsg("");
    setResult(null);
    
    // Validate format
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Unsupported format. Please upload a JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate size (Under 5MB payload size)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      handleAnalyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Backend real AI Analysis trigger
  const handleAnalyzeImage = async (base64Image: string) => {
    setScanning(true);
    setErrorMsg("");
    setResult(null);
    setScanningStep(0);

    try {
      const response = await fetch("/api/food-scanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to analyze image");
      }

      const scanResult = resData.result as ScanResult;
      setResult(scanResult);

      // Trigger visual confetti for healthy nutrition scores (Health Score >= 80)
      if (scanResult.healthScore >= 80) {
        confetti({
          particleCount: 50,
          spread: 40,
          colors: ["#10b981", "#8b5cf6"]
        });
      }

      // Automatically save to Supabase public logs if authenticated
      if (supabase && profile?.id) {
        try {
          await supabase.from("food_scanner_logs").insert({
            user_id: profile.id,
            food_name: scanResult.foodName,
            calories: scanResult.calories,
            protein_g: scanResult.protein,
            carbs_g: scanResult.carbs,
            fat_g: scanResult.fat,
            sugar_g: scanResult.sugar,
            healthy_alternatives: scanResult.alternatives,
            health_score: scanResult.healthScore,
            portion_size: scanResult.portionSize,
            sugar_alert: scanResult.sugarAlert,
            additive_warnings: scanResult.unhealthyAdditives
          });
        } catch (dbErr) {
          console.warn("Database sync missed. Local session log remains active.", dbErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Couldn't identify this meal clearly. Please upload a clearer image of your plate under better lighting.");
    } finally {
      setScanning(false);
    }
  };

  // Status text cycle
  const scanningLabels = [
    "Analyzing meal composition...",
    "Detecting ingredients...",
    "Estimating macros & calories..."
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Scan className="h-6 w-6 text-primary animate-pulse" />
              AI Nutrition Food Scanner
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Scan your plate using your camera or upload a photo to receive detailed macros, ingredients, and alternatives instantly
            </p>
          </div>
        </div>

        {/* 1. DUAL CONTAINER: Trigger console vs Results view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Camera capture & Upload triggers */}
          <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                Capture or Upload Plate
              </h3>

              {/* Error warning box */}
              {errorMsg && (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-semibold flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* HTML5 Live Webcam / Camera Stream window */}
              {showCamera ? (
                <div className="relative rounded-2xl overflow-hidden border border-foreground/10 bg-black aspect-video flex items-center justify-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  
                  {/* Capture Trigger controls */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    <button 
                      onClick={handleCapturePhoto}
                      className="bg-primary text-white h-11 px-5 rounded-full text-xs font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform flex items-center gap-1"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Take Photo</span>
                    </button>
                    
                    <button 
                      onClick={handleStopCamera}
                      className="bg-foreground/20 hover:bg-foreground/35 text-white h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Photo Upload Zone */
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 group ${
                    dragActive 
                      ? "border-primary bg-primary/5" 
                      : "border-foreground/15 hover:border-primary/50 bg-foreground/5 hover:bg-primary/5"
                  }`}
                >
                  <input 
                    type="file" 
                    onChange={handleFileInput}
                    accept="image/jpeg,image/png,image/webp" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="h-11 w-11 rounded-xl bg-background border border-foreground/5 flex items-center justify-center text-foreground/70 group-hover:scale-115 transition-transform">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    Drag Plate Image here or click to browse
                  </span>
                  <span className="text-[10px] text-foreground/50 font-semibold uppercase tracking-wider">
                    Supports JPEG, PNG, WEBP (under 5MB)
                  </span>
                </div>
              )}

              {/* Action triggers */}
              {!showCamera && (
                <Button 
                  variant="primary" 
                  onClick={handleOpenCamera}
                  className="w-full py-3 flex items-center justify-center gap-1 text-xs font-bold shadow-lg shadow-primary/10"
                >
                  <Camera className="h-4 w-4" />
                  <span>Open Device Camera</span>
                </Button>
              )}

              {/* Text fallback query for convenience */}
              <div className="space-y-1.5 pt-2 border-t border-foreground/5">
                <label className="text-[11px] font-bold text-foreground/60">Manual Meal Query Fallback</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter meal name (e.g. Avocado Toast)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/35 focus:outline-none"
                  />
                  <Button 
                    variant="glass" 
                    onClick={() => {
                      if (!inputText.trim()) return;
                      // Convert query input to basic simulated snapshot context
                      setImagePreview(null);
                      handleScanSimulation(inputText);
                    }} 
                    className="px-4 py-2.5 text-xs font-bold shrink-0"
                  >
                    Search
                  </Button>
                </div>
              </div>

            </div>

            <div className="text-[10px] text-foreground/50 leading-relaxed font-semibold border-t border-foreground/5 pt-4">
              *AI scanner models require standard lighting conditions for highest ingredient precision.
            </div>
          </div>

          {/* Right panel: Active scanning loading vs Real JSON Results display */}
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-center min-h-[380px]">
            
            {/* Image Preview & Active Scanning Loader */}
            {scanning && (
              <div className="flex flex-col items-center gap-4 text-center py-8">
                {imagePreview && (
                  <div className="relative h-28 w-28 rounded-xl overflow-hidden border border-foreground/10 mb-2">
                    <img src={imagePreview} alt="Scanning preview" className="h-full w-full object-cover" />
                    {/* Visual scanning line bar indicator */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce top-1/2" />
                  </div>
                )}
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <span className="text-xs font-bold tracking-widest text-primary animate-pulse uppercase">
                  {scanningLabels[scanningStep]}
                </span>
                <p className="text-xs text-foreground/60 max-w-xs font-medium leading-relaxed">
                  Extracting nutritional composition, estimating weights, and mapping healthy alternatives.
                </p>
              </div>
            )}

            {/* Empty landing prompt */}
            {!scanning && !result && (
              <div className="flex flex-col items-center gap-2.5 text-center py-12 text-foreground/45 select-none">
                <Scan className="h-11 w-11 text-foreground/25 animate-pulse" />
                <span className="text-xs font-bold">Waiting for plate scan</span>
                <p className="text-xs max-w-xs font-semibold leading-relaxed">
                  Take a photo of your food or drop an image above. Real-time AI nutrition facts will compile here.
                </p>
              </div>
            )}

            {/* REAL DYNAMIC RESULTS CONTAINER */}
            {!scanning && result && (
              <div className="space-y-6">
                
                {/* Result header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    {imagePreview && (
                      <div className="h-16 w-16 rounded-xl overflow-hidden border border-foreground/10 mb-2.5 shrink-0">
                        <img src={imagePreview} alt="Scanned meal" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <span className="rounded-full bg-primary/10 border border-primary/15 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                      Portion: {result.portionSize}
                    </span>
                    <h3 className="text-sm font-bold text-foreground mt-1.5">{result.foodName}</h3>
                  </div>
                  
                  {/* Health Score circle */}
                  <div className={`h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg ${
                    result.healthScore >= 80 
                      ? "border-secondary text-secondary shadow-secondary/10" 
                      : "border-red-500 text-red-500 shadow-red-500/10"
                  }`}>
                    <span className="text-[8px] font-bold uppercase tracking-wider">Score</span>
                    <span className="text-base font-bold">{result.healthScore}</span>
                  </div>
                </div>

                {/* Macro breakdown grid */}
                <div className="grid grid-cols-4 gap-3 text-center text-xs font-bold">
                  <div className="bg-foreground/5 p-2.5 rounded-xl border border-foreground/5">
                    <span className="text-primary block font-bold">Protein</span>
                    <span className="text-sm font-bold block mt-0.5">{result.protein}g</span>
                  </div>

                  <div className="bg-foreground/5 p-2.5 rounded-xl border border-foreground/5">
                    <span className="text-secondary block font-bold">Carbs</span>
                    <span className="text-sm font-bold block mt-0.5">{result.carbs}g</span>
                  </div>

                  <div className="bg-foreground/5 p-2.5 rounded-xl border border-foreground/5">
                    <span className="text-accent block font-bold">Fats</span>
                    <span className="text-sm font-bold block mt-0.5">{result.fat}g</span>
                  </div>

                  <div className="bg-foreground/5 p-2.5 rounded-xl border border-foreground/5">
                    <span className="text-red-400 block font-bold">Sugars</span>
                    <span className="text-sm font-bold block mt-0.5">{result.sugar}g</span>
                  </div>
                </div>

                {/* Sugar Warning */}
                {result.sugarAlert && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3 text-xs text-red-500 font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>Heavy sugar density warning! Limit portions to protect daily insulin stability.</span>
                  </div>
                )}

                {/* Chemical Additives Warnings */}
                {result.unhealthyAdditives && result.unhealthyAdditives.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-red-500 block">Unhealthy Additives Detected:</span>
                    <div className="flex flex-wrap gap-2">
                      {result.unhealthyAdditives.map((ad, idx) => (
                        <span key={idx} className="rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-500">
                          {ad}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic AI Wellness Insights */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-foreground/50 block">AI Nutrition Insights:</span>
                  <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                    {result.nutritionRecommendation}
                  </p>
                </div>

                {/* Healthier Alternatives */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-foreground/5">
                    <span className="text-[10px] font-bold text-secondary block">Healthier Alternative Suggestions:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold text-foreground/80">
                      {result.alternatives.map((alt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 p-2.5 bg-secondary/5 rounded-xl border border-secondary/10">
                          <CornerDownRight className="h-3.5 w-3.5 text-secondary shrink-0" />
                          <span>{alt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );

  // Fallback simulator scanning for text/barcode queries
  async function handleScanSimulation(query: string) {
    setScanning(true);
    setResult(null);
    setErrorMsg("");
    setScanningStep(0);

    setTimeout(() => {
      // Direct dynamic query compilation
      const lowercase = query.toLowerCase();
      let compiled: ScanResult;

      if (lowercase.includes("salad") || lowercase.includes("salmon") || lowercase.includes("vegetable")) {
        compiled = {
          foodName: "Atlantic Salmon Avocado Salad Bowl",
          calories: 420,
          protein: 34,
          carbs: 18,
          fat: 26,
          sugar: 4,
          portionSize: "320g regular bowl",
          healthScore: 94,
          sugarAlert: false,
          unhealthyAdditives: [],
          alternatives: ["Quinoa Salmon Salad", "Steamed Cod Bowl"],
          nutritionRecommendation: "Outstanding nutrition quality! Rich omega-3 fatty acids actively support cardiorespiratory repair and accelerate muscle recovery after exercise."
        };
      } else if (lowercase.includes("pizza") || lowercase.includes("burger") || lowercase.includes("fast")) {
        compiled = {
          foodName: "Double Cheese Pepperoni Pizza Slice",
          calories: 580,
          protein: 18,
          carbs: 64,
          fat: 28,
          sugar: 12,
          portionSize: "2 large slices",
          healthScore: 38,
          sugarAlert: true,
          unhealthyAdditives: ["Sodium Nitrites", "Saturated trans-fats"],
          alternatives: ["Whole-wheat Turkey wrap", "Cauliflower Crust Pizza"],
          nutritionRecommendation: "Warning: High glycemic load detected. High processed trans-fats can delay muscular recovery and trigger fatigue spikes."
        };
      } else {
        compiled = {
          foodName: query,
          calories: 210,
          protein: 10,
          carbs: 24,
          fat: 8,
          sugar: 6,
          portionSize: "1 standard serving",
          healthScore: 72,
          sugarAlert: false,
          unhealthyAdditives: [],
          alternatives: ["Organic fruits & almonds", "Whey protein shake"],
          nutritionRecommendation: "A moderate nutrition profile. Provides stable energy, but make sure to balance with high-fiber greens for optimal digestion."
        };
      }

      setResult(compiled);
      setScanning(false);
      setInputText("");

      if (compiled.healthScore >= 80) {
        confetti({
          particleCount: 30,
          spread: 20,
          colors: ["#10b981"]
        });
      }
    }, 1800);
  }
}

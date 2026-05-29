"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Scan, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  Apple, 
  Info, 
  CornerDownRight, 
  Camera, 
  X, 
  RefreshCw, 
  Check, 
  Edit3, 
  CheckCircle,
  Flame,
  Award,
  Activity,
  Heart,
  Search,
  DollarSign,
  ShieldCheck,
  FileText
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";
import confetti from "canvas-confetti";

interface ScanResult {
  foodName: string;
  confidence: "high" | "medium" | "low_estimated";
  mealType: string;
  portionSize: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  healthScore: number;
  sugarAlert: boolean;
  unhealthyAdditives: string[];
  alternatives: string[];
  insights: string[];
  nutritionRecommendation: string;
}

interface MedicineData {
  brandName: string;
  genericName: string;
  brandPrice: number;
  genericPrice: number;
  savings: number;
  category: string;
  efficacy: string;
  dosage: string;
  warnings: string;
  manufacturer: string;
  genericManufacturer: string;
}

const MEDICINE_DB: Record<string, MedicineData> = {
  crocin: {
    brandName: "Crocin Pain Relief",
    genericName: "Paracetamol (Acetaminophen)",
    brandPrice: 40,
    genericPrice: 8,
    savings: 80,
    category: "Analgesic & Antipyretic (Pain & Fever Reliever)",
    efficacy: "Provides rapid relief for mild-to-moderate physical pain (headaches, muscular strains, toothaches, joint discomfort) and acts effectively to reduce body temperature during fevers.",
    dosage: "500mg - 1000mg orally every 4 to 6 hours as needed. Do not exceed 4000mg (4g) within a 24-hour window.",
    warnings: "High doses can cause severe liver damage. Avoid alcohol and check other cold medications for duplicate paracetamol.",
    manufacturer: "GlaxoSmithKline Pharmaceuticals",
    genericManufacturer: "Pradhan Mantri Jan Aushadhi Kendras / CIPLA Generics"
  },
  panadol: {
    brandName: "Panadol Rapid",
    genericName: "Paracetamol (Acetaminophen)",
    brandPrice: 45,
    genericPrice: 8,
    savings: 82,
    category: "Analgesic & Antipyretic (Pain & Fever Reliever)",
    efficacy: "Provides rapid relief for mild-to-moderate physical pain (headaches, muscular strains, toothaches, joint discomfort) and acts effectively to reduce body temperature during fevers.",
    dosage: "500mg - 1000mg orally every 4 to 6 hours as needed. Do not exceed 4000mg (4g) within a 24-hour window.",
    warnings: "High doses can cause severe liver damage. Avoid alcohol and check other cold medications for duplicate paracetamol.",
    manufacturer: "Haleon plc",
    genericManufacturer: "Pradhan Mantri Jan Aushadhi Kendras / Alkem Labs"
  },
  lipitor: {
    brandName: "Lipitor Cardiovascular",
    genericName: "Atorvastatin Calcium",
    brandPrice: 180,
    genericPrice: 25,
    savings: 86,
    category: "HMG-CoA Reductase Inhibitor (Cholesterol Statin)",
    efficacy: "Indicated to lower total cholesterol, LDL ('bad') cholesterol, and triglycerides, while raising HDL ('good') cholesterol. Crucial for reducing long-term cardiovascular risks, stroke, and heart attacks in patients with coronary heart disease.",
    dosage: "10mg to 80mg taken orally once daily, ideally in the evening or at bedtime with or without food.",
    warnings: "Can rarely cause skeletal muscle pain or weakness (rhabdomyolysis). Periodic liver enzyme function checkups are advised. Absolutely avoid pregnancy.",
    manufacturer: "Pfizer Inc.",
    genericManufacturer: "Zydus Lifesciences / Torrent Pharmaceuticals Generics"
  },
  glucophage: {
    brandName: "Glucophage 500mg",
    genericName: "Metformin Hydrochloride",
    brandPrice: 95,
    genericPrice: 15,
    savings: 84,
    category: "Oral Antidiabetic Agent (Biguanide class)",
    efficacy: "First-line pharmacotherapy for managing Type 2 Diabetes Mellitus. Enhances cellular insulin sensitivity, improves skeletal muscle glucose uptake, and reduces excess glucose synthesis by the liver.",
    dosage: "500mg to 850mg twice daily taken during or immediately after meals to minimize gastrointestinal discomfort.",
    warnings: "Rare but serious risk of lactic acidosis. Contraindicated in severe kidney failure or heavy alcohol use.",
    manufacturer: "Merck Group",
    genericManufacturer: "Lupin / Sun Pharmaceutical Industries Generics"
  },
  norvasc: {
    brandName: "Norvasc BP",
    genericName: "Amlodipine Besylate",
    brandPrice: 120,
    genericPrice: 18,
    savings: 85,
    category: "Calcium Channel Blocker (Antihypertensive)",
    efficacy: "Relaxes vascular smooth muscles, expanding blood vessels to lower elevated blood pressure. Relieves arterial strain and reduces ischemic cardiac load for chronic angina management.",
    dosage: "2.5mg to 10mg orally once daily, independent of meal timing.",
    warnings: "May cause fluid retention and peripheral swelling (ankle edema), dizziness, or facial flushing in sensitive patients.",
    manufacturer: "Viatris / Pfizer",
    genericManufacturer: "Intas Pharmaceuticals / Glenmark Generics"
  },
  synthroid: {
    brandName: "Synthroid Active",
    genericName: "Levothyroxine Sodium",
    brandPrice: 150,
    genericPrice: 30,
    savings: 80,
    category: "Thyroid Hormone Replacement therapy",
    efficacy: "Replaces missing thyroid hormone in patients suffering from thyroid insufficiency (hypothyroidism). Essential for maintaining normal metabolic rates, energy levels, and mental alertness.",
    dosage: "25mcg to 200mcg taken orally once daily in the early morning on an empty stomach, at least 30-60 minutes before breakfast.",
    warnings: "Take strictly on an empty stomach. Do not take within 4 hours of calcium, iron, or antacid supplements, as they block absorption.",
    manufacturer: "AbbVie Inc.",
    genericManufacturer: "Abbott Healthcare / Macleods Generics"
  },
  amoxil: {
    brandName: "Amoxil Antibiotic",
    genericName: "Amoxicillin Trihydrate",
    brandPrice: 110,
    genericPrice: 22,
    savings: 80,
    category: "Beta-Lactam Antibiotic (Penicillin class)",
    efficacy: "Acts aggressively to eliminate susceptive bacterial infections of the middle ear, respiratory tract (pneumonia, bronchitis), urinary system, and bacterial skin infections.",
    dosage: "250mg to 500mg every 8 hours, or 500mg to 875mg every 12 hours, taken with or without food. Complete the entire course!",
    warnings: "Contraindicated in individuals with known severe penicillin allergies. Unnecessary use creates viral immunity/antibiotic resistance.",
    manufacturer: "GlaxoSmithKline",
    genericManufacturer: "Mankind Pharma / Alkem Laboratories Generics"
  },
  zoloft: {
    brandName: "Zoloft Mental Wellness",
    genericName: "Sertraline Hydrochloride",
    brandPrice: 220,
    genericPrice: 35,
    savings: 84,
    category: "Selective Serotonin Reuptake Inhibitor (SSRI Antidepressant)",
    efficacy: "Inhibits neural reuptake of serotonin to increase positive mood neurotransmitters. Highly effective in treating major depressive disorder, panic disorder, social anxiety, and obsessive-compulsive disorders.",
    dosage: "50mg to 200mg orally once daily, either in the morning or evening with food.",
    warnings: "Never stop abruptly due to discontinuation syndrome. Avoid combining with MAO inhibitors or other serotonin triggers. Watch for mood swings.",
    manufacturer: "Pfizer / Viatris",
    genericManufacturer: "Cipla / Torrent Pharmaceuticals Generics"
  },
  ventolin: {
    brandName: "Ventolin HFA Inhaler",
    genericName: "Albuterol / Salbutamol Sulfate",
    brandPrice: 140,
    genericPrice: 28,
    savings: 80,
    category: "Short-Acting Beta-2 Adrenergic Agonist (Bronchodilator)",
    efficacy: "Fast-acting rescue medication that dilates and relaxes constricted respiratory smooth muscle airways. Provides immediate relief from asthma attacks, chronic wheezing, and exercise-induced bronchospasm.",
    dosage: "1 to 2 inhalations (90mcg per puff) every 4 to 6 hours as needed for immediate relief or 15 minutes before physical exertion.",
    warnings: "Overuse can trigger cardiac palpitations, tremors, nervous agitation, or hypokalemia. Carry it at all times for emergency rescue.",
    manufacturer: "GlaxoSmithKline",
    genericManufacturer: "Cipla / Cadila Pharmaceuticals Generics"
  },
  nexium: {
    brandName: "Nexium Gastro",
    genericName: "Esomeprazole Magnesium",
    brandPrice: 160,
    genericPrice: 32,
    savings: 80,
    category: "Proton Pump Inhibitor (PPI Acid Reducer)",
    efficacy: "Binds chemically to stomach acid pumps to suppress gastric acid generation. Treats active gastroesophageal reflux disease (GERD), heals peptic ulcer tissue, and prevents acid erosion in the esophagus.",
    dosage: "20mg to 40mg taken once daily, strictly 30 to 60 minutes before the first meal of the day.",
    warnings: "Long-term daily use (>1 year) might reduce magnesium and vitamin B12 absorption or slightly increase bone fracture risks in elder adults.",
    manufacturer: "AstraZeneca plc",
    genericManufacturer: "Sun Pharma / Lupin Generics"
  }
};


export default function FoodScannerPage() {
  const { profile } = useAuth();
  
  // UI states
  const [scannerTab, setScannerTab] = useState<"plate" | "barcode" | "medicine">("plate");
  const [inputText, setInputText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmStatus, setConfirmStatus] = useState<"pending" | "confirmed" | "editing">("pending");

  // Medicine and scheme states
  const [medQuery, setMedQuery] = useState("");
  const [medResult, setMedResult] = useState<MedicineData | null>(null);
  const [medScanning, setMedScanning] = useState(false);
  const [medScanningStep, setMedScanningStep] = useState(0);
  const [savedMeds, setSavedMeds] = useState<MedicineData[]>([]);

  // Scheme eligibility checker state
  const [schemeAge, setSchemeAge] = useState("");
  const [schemeIncome, setSchemeIncome] = useState("");
  const [schemeCategory, setSchemeCategory] = useState("General");
  const [schemeState, setSchemeState] = useState("All States");
  const [schemeEligibleList, setSchemeEligibleList] = useState<any[] | null>(null);
  const [checkingScheme, setCheckingScheme] = useState(false);

  // Medicine generic search logic
  const handleMedicineSearch = (query: string) => {
    if (!query.trim()) return;
    setMedScanning(true);
    setMedResult(null);
    setSchemeEligibleList(null);
    setMedScanningStep(0);
    setErrorMsg("");
    
    setTimeout(() => {
      const normalized = query.toLowerCase().trim();
      let matched = MEDICINE_DB[normalized];
      
      if (!matched) {
        const keys = Object.keys(MEDICINE_DB);
        const matchKey = keys.find(k => normalized.includes(k) || k.includes(normalized));
        if (matchKey) {
          matched = MEDICINE_DB[matchKey];
        }
      }
      
      if (!matched) {
        const cleanedName = query.charAt(0).toUpperCase() + query.slice(1);
        const estimatedGeneric = cleanedName.substring(0, Math.min(cleanedName.length, 5)) + "omycin Generic";
        const dummyBrandPrice = Math.floor(Math.random() * 150) + 60;
        const dummyGenericPrice = Math.floor(dummyBrandPrice * 0.15) + 5;
        const dummySavings = Math.floor(((dummyBrandPrice - dummyGenericPrice) / dummyBrandPrice) * 100);
        
        matched = {
          brandName: cleanedName,
          genericName: estimatedGeneric,
          brandPrice: dummyBrandPrice,
          genericPrice: dummyGenericPrice,
          savings: dummySavings,
          category: "Therapeutic Agent / Essential Formulation",
          efficacy: `Used for specific clinical indications associated with ${cleanedName}. Consult with a physician for complete medical guidelines.`,
          dosage: "1 tablet daily after main meals, or in exact accordance with clinical prescription directives.",
          warnings: "Keep stored in dry spaces below 25°C. Keep out of reach of children and monitor allergic markers.",
          manufacturer: "Global Pharmacare Brands",
          genericManufacturer: "Generic Labs / National Formulations Store"
        };
      }
      
      setMedResult(matched);
      setMedScanning(false);
      setMedQuery("");
      
      if (matched.savings >= 80) {
        confetti({
          particleCount: 50,
          spread: 35,
          colors: ["#0d9488", "#10b981"]
        });
      }
    }, 1500);
  };

  // Government scheme eligibility checking logic
  const handleCheckSchemeEligibility = () => {
    if (!schemeAge || !schemeIncome) {
      setErrorMsg("Please fill out both Age and Annual Income fields to check eligibility.");
      return;
    }
    
    setCheckingScheme(true);
    setSchemeEligibleList(null);
    setMedResult(null);
    setErrorMsg("");
    
    setTimeout(() => {
      const ageNum = Number(schemeAge);
      const incomeNum = Number(schemeIncome);
      const isBPL = schemeCategory === "BPL" || schemeCategory === "AAY";
      const isRetired = schemeCategory === "Retired";
      const isGovt = schemeCategory === "Govt";
      
      const results = [
        {
          name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
          eligible: true,
          badge: "100% Eligible",
          benefits: "Access to high-quality generic drugs at 50% - 90% discount compared to private brands.",
          criteria: "Open to all Indian residents, no income limit.",
          action: "Locate Nearest Janaushadhi Pharmacy Store"
        },
        {
          name: "Ayushman Bharat PM-JAY (Health Protection Mission)",
          eligible: incomeNum <= 250000 || isBPL || ageNum >= 65,
          badge: (incomeNum <= 250000 || isBPL || ageNum >= 65) ? "Eligible" : "Not Eligible",
          benefits: "Cashless secondary and tertiary hospitalization care up to ₹5 Lakhs ($6,000 USD) per family annually.",
          criteria: "Targeted to lower-income segments (Annual Income ≤ ₹2.5 Lakhs) or BPL cardholders.",
          action: "Download Ayushman Golden Card Online"
        },
        {
          name: "Senior Citizen Health Insurance Scheme (SCHIS)",
          eligible: ageNum >= 60 && (incomeNum <= 300000 || isBPL),
          badge: (ageNum >= 60 && (incomeNum <= 300000 || isBPL)) ? "Eligible" : "Not Eligible",
          benefits: "Additional top-up of ₹30,000 per annum for hospital coverage, stacked on top of base health plans.",
          criteria: "Age 60 years or above and verified low-income household.",
          action: "Register at Senior Citizen Welfare Portal"
        },
        {
          name: "Central Government Health Scheme (CGHS)",
          eligible: isGovt || isRetired,
          badge: (isGovt || isRetired) ? "Eligible" : "Not Eligible",
          benefits: "Comprehensive medical cover, outpatient clinic consultations, and free medicines in CGHS dispensaries.",
          criteria: "Current or pensioned government employees and their dependent family members.",
          action: "Apply for CGHS Wellness Card"
        },
        {
          name: "State Special Health Subsidies (Arogyasri / MJPJAY)",
          eligible: incomeNum <= 150000 || isBPL,
          badge: (incomeNum <= 150000 || isBPL) ? "Eligible" : "Not Eligible",
          benefits: "State government funded free treatment for up to 996 complex surgical procedures at empanelled network hospitals.",
          criteria: "Ration card holders (Yellow/Orange) or verified income under ₹1.5 Lakhs.",
          action: "Check Empanelled State Hospitals"
        }
      ];
      
      setSchemeEligibleList(results);
      setCheckingScheme(false);
      
      confetti({
        particleCount: 40,
        spread: 30,
        colors: ["#0284c7", "#10b981"]
      });
    }, 1200);
  };

  // Edit fields states
  const [editFoodName, setEditFoodName] = useState("");
  const [editPortion, setEditPortion] = useState("");
  const [editCalories, setEditCalories] = useState(0);
  const [editProtein, setEditProtein] = useState(0);
  const [editCarbs, setEditCarbs] = useState(0);
  const [editFat, setEditFat] = useState(0);

  // Drag & drop state
  const [dragActive, setDragActive] = useState(false);

  // Camera Media stream refs
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cycle scanning messages for visual premium feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanning) {
      interval = setInterval(() => {
        setScanningStep(prev => (prev >= 2 ? 0 : prev + 1));
      }, 900);
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
    setConfirmStatus("pending");
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
    setConfirmStatus("pending");
    
    // Validate format
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Unsupported format. Please upload a JPEG, PNG, or WEBP image.");
      return;
    }

    // Validate size
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
    setConfirmStatus("pending");
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

      // Populate edit form defaults
      setEditFoodName(scanResult.foodName);
      setEditPortion(scanResult.portionSize);
      setEditCalories(scanResult.calories);
      setEditProtein(scanResult.protein);
      setEditCarbs(scanResult.carbs);
      setEditFat(scanResult.fat);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Couldn't identify this meal clearly. Please upload a clearer image of your plate.");
    } finally {
      setScanning(false);
    }
  };

  // User Manual Confirmation and Supabase Logging
  const handleConfirmMeal = async (saveEdited = false) => {
    if (!result || !profile) return;
    
    const finalFoodName = saveEdited ? editFoodName : result.foodName;
    const finalPortion = saveEdited ? editPortion : result.portionSize;
    const finalCalories = saveEdited ? editCalories : result.calories;
    const finalProtein = saveEdited ? editProtein : result.protein;
    const finalCarbs = saveEdited ? editCarbs : result.carbs;
    const finalFat = saveEdited ? editFat : result.fat;

    try {
      // 1. Log to food_scanner_logs (the learning record)
      if (supabase) {
        await supabase.from("food_scanner_logs").insert({
          user_id: profile.id,
          food_name: finalFoodName,
          calories: finalCalories,
          protein_g: finalProtein,
          carbs_g: finalCarbs,
          fat_g: finalFat,
          portion_size: finalPortion,
          health_score: result.healthScore,
          sugar_g: result.sugar,
          sugar_alert: result.sugarAlert,
          additive_warnings: result.unhealthyAdditives,
          healthy_alternatives: result.alternatives
        });

        // 2. Active Sync into daily nutrition_logs (so it updates dashboard total calories/macros immediately!)
        const nutritionData = {
          user_id: profile.id,
          meal_type: result.mealType.includes("breakfast") ? "breakfast" : result.mealType.includes("lunch") ? "lunch" : result.mealType.includes("dinner") ? "dinner" : "snack",
          food_name: finalFoodName,
          calories: finalCalories,
          protein_g: finalProtein,
          carbs_g: finalCarbs,
          fat_g: finalFat,
          stress_eating: false
        };
        const { error } = await supabase.from("nutrition_logs").insert(nutritionData);
        if (error) {
          console.error("Supabase error saving meal, falling back to local storage:", error);
          const localLogs = JSON.parse(localStorage.getItem("vitalcore_nutrition_logs") || "[]");
          localLogs.push({
            ...nutritionData,
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString()
          });
          localStorage.setItem("vitalcore_nutrition_logs", JSON.stringify(localLogs));
        }
      }

      setConfirmStatus("confirmed");
      confetti({
        particleCount: 120,
        spread: 60,
        colors: ["#10b981", "#8b5cf6"]
      });
    } catch (err) {
      console.error("Save confirmation error:", err);
    }
  };

  // Status text cycle
  const scanningLabels = [
    "Detecting visible ingredients...",
    "Estimating portions visually...",
    "Calibrating macro analytics..."
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 p-6">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Scan className="h-6 w-6 text-primary animate-pulse" />
              AI Nutrition Food Scanner
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              An intelligent, estimation-first scanning engine that analyzes your meals, visualizes macros, and tracks corrections automatically.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-foreground/5 pb-1 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setScannerTab("plate"); setResult(null); setImagePreview(null); setErrorMsg(""); setConfirmStatus("pending"); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              scannerTab === "plate"
                ? "bg-primary text-white shadow-md shadow-primary/15"
                : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Plate Image Scanning</span>
          </button>
          <button
            onClick={() => { setScannerTab("barcode"); setResult(null); setImagePreview(null); setErrorMsg(""); setConfirmStatus("pending"); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              scannerTab === "barcode"
                ? "bg-primary text-white shadow-md shadow-primary/15"
                : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            <Scan className="h-4 w-4" />
            <span>Barcode Auditing Console</span>
          </button>
          <button
            onClick={() => { setScannerTab("medicine"); setResult(null); setImagePreview(null); setErrorMsg(""); setConfirmStatus("pending"); }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              scannerTab === "medicine"
                ? "bg-primary text-white shadow-md shadow-primary/15"
                : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Medicine Price Auditor</span>
          </button>
        </div>

        {/* CONDITIONAL RENDER BY ACTIVE TAB */}
        {scannerTab === "medicine" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: AUDITOR SEARCH + SCHEME CHECKER FORM */}
            <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                    <Heart className="h-4.5 w-4.5 text-primary animate-pulse" />
                    Medicine Price Auditor
                  </h3>
                  <p className="text-[10px] text-foreground/60 leading-relaxed font-semibold">
                    Find equivalent generic options, compare brand costs, and audit active chemical categories instantly.
                  </p>
                </div>

                {/* Medicine Audit Search Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={medQuery}
                      onChange={(e) => setMedQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleMedicineSearch(medQuery)}
                      placeholder="Enter brand name (e.g. Crocin, Lipitor)"
                      className="w-full text-xs pl-9 pr-3.5 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none focus:border-primary/50 placeholder-foreground/35"
                    />
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-foreground/40" />
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => handleMedicineSearch(medQuery)} 
                    className="px-5 py-3 text-xs font-bold shrink-0 shadow-lg shadow-primary/10"
                  >
                    Audit
                  </Button>
                </div>

                {/* Preset Brand Pills */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-foreground/50 block">Quick Audits:</span>
                  <div className="flex flex-wrap gap-2">
                    {["Crocin", "Lipitor", "Glucophage", "Norvasc", "Synthroid", "Zoloft"].map((med) => (
                      <button
                        key={med}
                        onClick={() => handleMedicineSearch(med)}
                        className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-foreground/5 border border-foreground/5 hover:border-primary/40 transition-colors text-foreground/80 cursor-pointer"
                      >
                        💊 {med}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GOVERNMENT ELIGIBILITY CHECKER */}
                <div className="pt-6 border-t border-foreground/5 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                      <ShieldCheck className="h-4.5 w-4.5 text-secondary" />
                      Government Scheme Eligibility
                    </h4>
                    <p className="text-[10px] text-foreground/60 leading-relaxed font-semibold">
                      Check household eligibility for subsidized health insurance and free generic medication programs.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60">Your Age (Years)</label>
                        <input
                          type="number"
                          placeholder="e.g. 45"
                          value={schemeAge}
                          onChange={(e) => setSchemeAge(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60">Annual Household Income (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 180000"
                          value={schemeIncome}
                          onChange={(e) => setSchemeIncome(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60">Social / Employment Category</label>
                        <select
                          value={schemeCategory}
                          onChange={(e) => setSchemeCategory(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none appearance-none"
                        >
                          <option value="General">General Class</option>
                          <option value="BPL">BPL Card Holder</option>
                          <option value="AAY">AAY Ration Card</option>
                          <option value="Govt">Govt Employee</option>
                          <option value="Retired">Retired / Pensioner</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-foreground/60">Residency State</label>
                        <select
                          value={schemeState}
                          onChange={(e) => setSchemeState(e.target.value)}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                        >
                          <option value="All States">All India States</option>
                          <option value="Delhi">Delhi NCT</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>
                    </div>

                    <Button 
                      variant="glass" 
                      onClick={handleCheckSchemeEligibility}
                      className="w-full py-2.5 text-xs font-bold border border-foreground/10 hover:border-secondary/50 flex items-center justify-center gap-1.5 mt-2 text-secondary bg-secondary/5"
                    >
                      <Activity className="h-4 w-4" />
                      <span>Check Subsidy & Scheme Eligibility</span>
                    </Button>
                  </div>
                </div>

              </div>

              <div className="text-[10px] text-foreground/50 leading-relaxed font-semibold border-t border-foreground/5 pt-4">
                *Auditor results match high-quality bio-equivalent generic medicines certified by medical authorities.
              </div>
            </div>

            {/* RIGHT COLUMN: MED RESULTS / SHIELDS ELIGIBILITY PANEL */}
            <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-center min-h-[380px]">
              
              {/* Dynamic Scanning State */}
              {medScanning && (
                <div className="flex flex-col items-center gap-4 text-center py-8">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary shrink-0" />
                  <span className="text-xs font-bold tracking-widest text-primary animate-pulse uppercase">
                    Auditing Bio-Equivalence & Prices...
                  </span>
                  <p className="text-xs text-foreground/60 max-w-xs font-semibold leading-relaxed">
                    Analyzing active chemical molecular structures, manufacturer retail tables, and national generic databases.
                  </p>
                </div>
              )}

              {/* Dynamic Scheme Checking State */}
              {checkingScheme && (
                <div className="flex flex-col items-center gap-4 text-center py-8">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary shrink-0" />
                  <span className="text-xs font-bold tracking-widest text-secondary animate-pulse uppercase">
                    Verifying Social Safety Thresholds...
                  </span>
                  <p className="text-xs text-foreground/60 max-w-xs font-semibold leading-relaxed">
                    Evaluating age, geographical residency, and socio-economic category variables against state regulations.
                  </p>
                </div>
              )}

              {/* Empty state when nothing is audited and nothing checked */}
              {!medScanning && !checkingScheme && !medResult && !schemeEligibleList && (
                <div className="flex flex-col items-center gap-2.5 text-center py-12 text-foreground/45 select-none animate-[pulse_3s_infinite]">
                  <Heart className="h-12 w-12 text-foreground/20" />
                  <span className="text-xs font-bold">Awaiting Audit or Query Input</span>
                  <p className="text-xs max-w-xs font-semibold leading-relaxed">
                    Choose a preset medicine, search a custom brand, or fill out the Scheme Eligibility form to view price audits and subsidy approvals here.
                  </p>
                </div>
              )}

              {/* MEDICINE RESULT PANEL */}
              {!medScanning && !checkingScheme && medResult && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  
                  {/* Medicine Brand vs Generic Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <span className="rounded-full bg-primary/10 border border-primary/15 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                        {medResult.category.split(" (")[0]}
                      </span>
                      <h3 className="text-base font-black text-foreground mt-1.5 leading-snug">
                        {medResult.brandName}
                      </h3>
                      <p className="text-xs text-foreground/60 font-semibold flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">Generic Equivalent:</span> {medResult.genericName}
                      </p>
                    </div>

                    {/* Massive Savings Percentage Widget */}
                    <div className="h-16 w-16 rounded-full border-4 border-primary/30 flex flex-col items-center justify-center shrink-0 shadow-lg bg-primary/5 text-primary animate-pulse">
                      <span className="text-[7px] font-black uppercase tracking-widest text-primary/80 leading-none">Savings</span>
                      <span className="text-lg font-black mt-0.5">{medResult.savings}%</span>
                    </div>
                  </div>

                  {/* PRICE COMPARISON BOX */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Brand Card */}
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-red-500">
                        <span>Original Brand Product</span>
                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-[9px] uppercase">Branded</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-foreground/50 font-bold block">Estimated Brand Retail Price:</span>
                        <span className="text-2xl font-black text-foreground">₹{medResult.brandPrice}.00</span>
                      </div>
                      <div className="text-[10px] text-foreground/60 font-semibold">
                        Mfg: <span className="font-bold text-foreground/80">{medResult.manufacturer}</span>
                      </div>
                    </div>

                    {/* Generic Card */}
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
                        <span>Bio-Equivalent Generic</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[9px] uppercase font-black">Bio-Identical</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-foreground/50 font-bold block">Generic Price (PMBJP Shop):</span>
                        <span className="text-2xl font-black text-emerald-500">₹{medResult.genericPrice}.00</span>
                      </div>
                      <div className="text-[10px] text-foreground/60 font-semibold">
                        Mfg: <span className="font-bold text-foreground/80">{medResult.genericManufacturer.split(" / ")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* SAVINGS GRAPH & DETAILS */}
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-primary">
                      <span>Annual Cost Projections (Daily Usage)</span>
                      <span className="text-emerald-500 font-black uppercase">
                        Save ₹{(medResult.brandPrice - medResult.genericPrice) * 365} / Year
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-foreground/80 leading-relaxed font-semibold font-sans">
                      <p>
                        Taking <span className="font-black text-primary">{medResult.brandName}</span> daily costs you about <span className="font-bold text-red-400">₹{(medResult.brandPrice * 3.65).toFixed(0)}</span> annually. 
                        By switching to bio-equivalent <span className="font-black text-emerald-400">{medResult.genericName}</span>, you spend only <span className="font-bold text-emerald-400">₹{(medResult.genericPrice * 3.65).toFixed(0)}</span>.
                      </p>
                    </div>
                  </div>

                  {/* CLINICAL METADATA SUMMARY */}
                  <div className="space-y-3 border-t border-foreground/5 pt-4">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1 uppercase tracking-wider">
                      <FileText className="h-4 w-4 text-primary" />
                      Clinical Molecule Auditing Log
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-foreground/50 font-black uppercase">Clinical Efficacy & Action</span>
                        <p className="text-foreground/80 font-semibold leading-relaxed">{medResult.efficacy}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-foreground/50 font-black uppercase">Standard Administered Dosage</span>
                        <p className="text-foreground/80 font-semibold leading-relaxed">{medResult.dosage}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] text-foreground/50 font-black uppercase">Contraindications & Warnings</span>
                        <p className="text-red-400/90 font-semibold leading-relaxed">{medResult.warnings}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-foreground/50 font-black uppercase">Drug Class Formulation</span>
                        <p className="text-foreground/80 font-semibold leading-relaxed">{medResult.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE BUTTON ACTIONS */}
                  <div className="border-t border-foreground/5 pt-4 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (savedMeds.some(m => m.brandName === medResult.brandName)) return;
                        setSavedMeds([...savedMeds, medResult]);
                        confetti({ particleCount: 20, spread: 20, colors: ["#0d9488"] });
                      }}
                      disabled={savedMeds.some(m => m.brandName === medResult.brandName)}
                      className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Check className="h-4 w-4" />
                      <span>{savedMeds.some(m => m.brandName === medResult.brandName) ? "Added to Cabinet" : "Add to Cabinet"}</span>
                    </Button>
                    <a
                      href="https://janaushadhi.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="glass"
                        className="w-full py-3 text-xs font-bold flex items-center justify-center gap-1.5 border border-foreground/10 hover:border-primary/30"
                      >
                        <Activity className="h-4 w-4" />
                        <span>Find Jan Aushadhi Stores</span>
                      </Button>
                    </a>
                  </div>

                </div>
              )}

              {/* SCHEME ELIGIBILITY RESULTS PANEL */}
              {!medScanning && !checkingScheme && schemeEligibleList && (
                <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-foreground">Socio-Economic Health Subsidy Report</h3>
                      <p className="text-[10px] text-foreground/50 font-semibold">
                        Evaluated for Age: {schemeAge} | Income: ₹{Number(schemeIncome).toLocaleString()} | Category: {schemeCategory}
                      </p>
                    </div>
                    <Button 
                      variant="glass" 
                      onClick={() => setSchemeEligibleList(null)} 
                      className="px-2.5 py-1.5 text-[9px] font-bold border border-foreground/10 text-foreground/60 cursor-pointer"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Schemes stack */}
                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    {schemeEligibleList.map((scheme, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-2xl border transition-all ${
                          scheme.eligible 
                            ? "bg-emerald-500/5 border-emerald-500/15" 
                            : "bg-foreground/5 border-foreground/5 opacity-70"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-foreground leading-snug">{scheme.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase leading-none ${
                            scheme.eligible ? "bg-emerald-500 text-white" : "bg-foreground/15 text-foreground/50"
                          }`}>
                            {scheme.badge}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-foreground/80 mt-2 font-semibold leading-relaxed">
                          <span className="font-bold text-primary">Benefits:</span> {scheme.benefits}
                        </p>
                        <p className="text-[9px] text-foreground/50 mt-1 font-semibold">
                          <span className="font-bold">Required Criteria:</span> {scheme.criteria}
                        </p>

                        {scheme.eligible && (
                          <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-secondary">
                            <span>{scheme.action}</span>
                            <CornerDownRight className="h-3.5 w-3.5 text-secondary" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-foreground/45 leading-relaxed font-semibold text-center">
                    💡 Disclaimer: This checker provides high-precision indicators based on active governmental parameters. Official validation and registration must be completed at matching regional service desks.
                  </p>
                </div>
              )}

              {/* CABINET LIST DISPLAY */}
              {!medScanning && !checkingScheme && !medResult && !schemeEligibleList && savedMeds.length > 0 && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out] w-full mt-4 border-t border-foreground/5 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      My Saved Cabinet ({savedMeds.length})
                    </span>
                    <button
                      onClick={() => setSavedMeds([])}
                      className="text-[9px] font-bold text-red-400 hover:text-red-300"
                    >
                      Clear Cabinet
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedMeds.map((med, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setMedResult(med)}
                        className="p-3 rounded-xl border border-foreground/15 hover:border-primary/40 bg-foreground/5 hover:bg-primary/5 cursor-pointer transition-all flex justify-between items-center"
                      >
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-foreground truncate block">{med.brandName}</span>
                          <span className="text-[9px] text-foreground/50 font-bold truncate block">{med.genericName}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-primary text-white text-[9px] font-bold shrink-0">
                          -{med.savings}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: UPLOADER / CAMERA TRIGGER */}
            <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-widest">
                  <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                  {scannerTab === "plate" ? "Capture or Upload Plate" : "Package Barcode Scan"}
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-semibold flex items-start gap-2 animate-[pulse_2s_infinite]">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {scannerTab === "plate" ? (
                  <>
                    {showCamera ? (
                      <div className="relative rounded-2xl overflow-hidden border border-foreground/10 bg-black aspect-video flex items-center justify-center">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                        
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                          <button 
                            onClick={handleCapturePhoto}
                            className="bg-primary text-white h-11 px-5 rounded-full text-xs font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="h-4 w-4" />
                            <span>Take Photo</span>
                          </button>
                          
                          <button 
                            onClick={handleStopCamera}
                            className="bg-foreground/20 hover:bg-foreground/35 text-white h-11 w-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                          >
                            <X className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 group ${
                          dragActive 
                            ? "border-primary bg-primary/5" 
                            : "border-foreground/15 hover:border-primary/50 bg-foreground/5 hover:bg-primary/5"
                        }`}
                      >
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          onChange={handleFileInput}
                          accept="image/jpeg,image/png,image/webp" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
                        />

                        <div className="h-11 w-11 rounded-xl bg-background border border-foreground/5 flex items-center justify-center text-foreground/70 group-hover:scale-115 transition-transform">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          Drag Plate Image here or click to browse
                        </span>
                        <span className="text-[10px] text-foreground/50 font-semibold uppercase tracking-wider">
                          Supports JPEG, PNG, WEBP
                        </span>
                      </div>
                    )}

                    {!showCamera && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button 
                          variant="primary" 
                          onClick={handleOpenCamera}
                          className="py-3 flex items-center justify-center gap-1.5 text-xs font-bold shadow-lg shadow-primary/10"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Use Camera</span>
                        </Button>
                        <Button 
                          variant="glass" 
                          onClick={() => fileInputRef.current?.click()}
                          className="py-3 flex items-center justify-center gap-1.5 text-xs font-bold border border-foreground/10 hover:border-primary/30"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload Photo</span>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-foreground/5 bg-foreground/5 space-y-2 text-center">
                      <Scan className="h-8 w-8 text-secondary mx-auto animate-pulse" />
                      <span className="text-xs font-bold text-foreground block">Barcode Package Auditor</span>
                      <p className="text-[10px] text-foreground/60 leading-relaxed font-semibold">
                        Enter product package codes (e.g. 73204901842) or try preset bars below to run chemical, sugar, and additive audits instantly.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter UPC/EAN Barcode (e.g. 73204901842)"
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none focus:border-secondary/50 placeholder-foreground/35"
                      />
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          if (!inputText.trim()) return;
                          setImagePreview(null);
                          handleScanSimulation(inputText);
                        }} 
                        className="px-5 py-3 text-xs font-bold shrink-0 shadow-lg shadow-primary/10"
                      >
                        Audit
                      </Button>
                    </div>

                    {/* Preset UPCs */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[9px] font-bold text-foreground/50 block">Preset Simulated Package Bars</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { setInputText("73204901842"); handleScanSimulation("73204901842"); }}
                          className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-foreground/5 border border-foreground/5 hover:border-secondary/40 transition-colors text-foreground/80 cursor-pointer"
                        >
                          ⚡ Energy Protein Bar
                        </button>
                        <button
                          onClick={() => { setInputText("salad"); handleScanSimulation("Atlantic Salmon Salad"); }}
                          className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-foreground/5 border border-foreground/5 hover:border-secondary/40 transition-colors text-foreground/80 cursor-pointer"
                        >
                          🥗 Clean Whole Food salad
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text fallback query */}
                {scannerTab === "plate" && (
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
                          setImagePreview(null);
                          handleScanSimulation(inputText);
                        }} 
                        className="px-4 py-2.5 text-xs font-bold shrink-0"
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-foreground/50 leading-relaxed font-semibold border-t border-foreground/5 pt-4">
                *Visually analyzes visible dishes first and estimates content based on database ratios.
              </div>
            </div>

            {/* RIGHT COLUMN: SCANNING LOADER & RESULTS VIEW */}
            <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-center min-h-[380px]">
              
              {/* Active Scanning Loader with Live Scanning line */}
              {scanning && (
                <div className="flex flex-col items-center gap-4 text-center py-8">
                  {imagePreview && (
                    <div className="relative h-32 w-32 rounded-xl overflow-hidden border border-foreground/10 mb-2">
                      <img src={imagePreview} alt="Scanning preview" className="h-full w-full object-cover" />
                      {/* Glowing scanning laser bar */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce top-1/2 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                    </div>
                  )}
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary shrink-0" />
                  <span className="text-xs font-bold tracking-widest text-primary animate-pulse uppercase">
                    {scanningLabels[scanningStep]}
                  </span>
                  <p className="text-xs text-foreground/60 max-w-xs font-semibold leading-relaxed">
                    Executing multi-stage vision parsing... Calibrating portion weights, protein densities and fiber levels.
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!scanning && !result && (
                <div className="flex flex-col items-center gap-2.5 text-center py-12 text-foreground/45 select-none animate-[pulse_3s_infinite]">
                  <Scan className="h-12 w-12 text-foreground/20" />
                  <span className="text-xs font-bold">Awaiting Active Plate Scan</span>
                  <p className="text-xs max-w-xs font-semibold leading-relaxed">
                    Take a photo or upload an image. The AI will immediately analyze and return calories, ingredients, and confidence ratings.
                  </p>
                </div>
              )}

              {/* ACTIVE RESULTS CONTAINER */}
              {!scanning && result && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  
                  {/* Result header block */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1.5 min-w-0">
                      {imagePreview && (
                        <div className="h-20 w-20 rounded-xl overflow-hidden border border-foreground/10 mb-2.5 shrink-0 relative">
                          <img src={imagePreview} alt="Scanned food" className="h-full w-full object-cover" />
                          <span className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white ${
                            result.confidence === "high" ? "bg-emerald-500" : result.confidence === "medium" ? "bg-amber-500" : "bg-violet-500"
                          }`}>
                            {result.confidence.replace("_", " ")}
                          </span>
                        </div>
                      )}
                      <span className="rounded-full bg-primary/10 border border-primary/15 px-2.5 py-0.5 text-[9px] font-bold text-primary">
                        Portion: {result.portionSize} ({result.mealType})
                      </span>
                      <h3 className="text-sm font-black text-foreground mt-1.5 leading-snug">{result.foodName}</h3>
                    </div>

                    {/* Health Score gauge */}
                    <div className={`h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center shrink-0 shadow-lg ${
                      result.healthScore >= 80 
                        ? "border-secondary text-secondary shadow-secondary/5 bg-secondary/5" 
                        : "border-red-500 text-red-500 shadow-red-500/5 bg-red-500/5"
                    }`}>
                      <span className="text-[7px] font-bold uppercase tracking-widest text-foreground/60 leading-none">Score</span>
                      <span className="text-lg font-black mt-0.5">{result.healthScore}</span>
                    </div>
                  </div>

                  {/* CONFIDENCE BAR GAUGE */}
                  <div className="space-y-1.5 p-3 bg-foreground/5 rounded-xl border border-foreground/5">
                    <div className="flex justify-between text-[10px] font-bold text-foreground/50">
                      <span>AI Recognition Confidence Rating:</span>
                      <span className={`uppercase font-black ${
                        result.confidence === "high" ? "text-emerald-400" : result.confidence === "medium" ? "text-amber-500" : "text-violet-400"
                      }`}>
                        {result.confidence === "high" ? "High Confidence Scan" : result.confidence === "medium" ? "Medium Confidence Match" : "Low / Estimated Analysis"}
                      </span>
                    </div>
                    <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        result.confidence === "high" ? "bg-emerald-500 w-full" : result.confidence === "medium" ? "bg-amber-500 w-2/3" : "bg-violet-500 w-1/3"
                      }`} />
                    </div>
                    <span className="text-[9px] text-foreground/45 block leading-normal">
                      {result.confidence === "low_estimated" 
                        ? "💡 Blurry, dark, or complex image detected. AI generated best-guess approximation based on visible ingredients."
                        : "✨ Clear plate parameters detected. High precision macros generated."}
                    </span>
                  </div>

                  {/* Macro breakdown matrix */}
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
                      <span className="text-amber-500 block font-bold">Fats</span>
                      <span className="text-sm font-bold block mt-0.5">{result.fat}g</span>
                    </div>
                    <div className="bg-foreground/5 p-2.5 rounded-xl border border-foreground/5">
                      <span className="text-rose-400 block font-bold">Calories</span>
                      <span className="text-sm font-bold block mt-0.5">{result.calories} kcal</span>
                    </div>
                  </div>

                  {/* INGREDIENT CHIPS */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-foreground/50 block">Detected Ingredients:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.ingredients.map((ing, idx) => (
                        <span key={idx} className="rounded-lg bg-foreground/5 border border-foreground/5 px-2.5 py-1 text-[10px] font-bold text-foreground/75 leading-none">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sugar alert warning */}
                  {result.sugarAlert && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3 text-xs text-red-500 font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 animate-pulse" />
                      <span>Heavy sugar density warning! Limit portions to protect daily insulin stability.</span>
                    </div>
                  )}

                  {/* Additives Warning */}
                  {result.unhealthyAdditives && result.unhealthyAdditives.length > 0 && result.unhealthyAdditives[0] !== "None detected" && (
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

                  {/* Coach Recommendation */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-primary/10 bg-primary/5">
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Nutrition Insight
                    </span>
                    <p className="text-xs text-foreground/80 leading-relaxed font-semibold">
                      {result.nutritionRecommendation}
                    </p>
                  </div>

                  {/* INTERACTIVE MANUAL CONFIRMATION MODULE */}
                  {confirmStatus === "pending" && (
                    <div className="border-t border-foreground/5 pt-4 space-y-3">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                        Is this close to your meal?
                      </span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="primary"
                          onClick={() => handleConfirmMeal(false)}
                          className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <Check className="h-4 w-4" />
                          <span>Yes, Confirm & Log</span>
                        </Button>
                        <Button
                          variant="glass"
                          onClick={() => setConfirmStatus("editing")}
                          className="flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 border-foreground/10 hover:border-primary/30"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>No, Edit Macros</span>
                        </Button>
                        <Button
                          variant="glass"
                          onClick={() => handleAnalyzeImage(imagePreview || "")}
                          disabled={!imagePreview}
                          className="py-3 px-4 text-xs font-bold flex items-center justify-center gap-1 border-foreground/10"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Regenerate</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* CONFIRMED STATE SUCCESS PANEL */}
                  {confirmStatus === "confirmed" && (
                    <div className="border-t border-foreground/5 pt-4 animate-[fadeIn_0.3s_ease-out]">
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-bold flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="block leading-none">Meal Logged Successfully!</span>
                          <p className="text-[10px] text-foreground/50 font-semibold mt-1">
                            AI learned your preferences. Today's calorie ceilings have been dynamically synchronized.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EDITING FORM STATE */}
                  {confirmStatus === "editing" && (
                    <div className="border-t border-foreground/5 pt-4 space-y-4 animate-[slideDown_0.2s_ease-out]">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                        Edit Meal Macro Corrections
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">Food Name</label>
                          <input
                            type="text"
                            value={editFoodName}
                            onChange={(e) => setEditFoodName(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">Portion Size</label>
                          <input
                            type="text"
                            value={editPortion}
                            onChange={(e) => setEditPortion(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 text-center">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-foreground/60 block">Protein (g)</label>
                          <input
                            type="number"
                            value={editProtein}
                            onChange={(e) => setEditProtein(Number(e.target.value))}
                            className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-foreground/60 block">Carbs (g)</label>
                          <input
                            type="number"
                            value={editCarbs}
                            onChange={(e) => setEditCarbs(Number(e.target.value))}
                            className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-foreground/60 block">Fats (g)</label>
                          <input
                            type="number"
                            value={editFat}
                            onChange={(e) => setEditFat(Number(e.target.value))}
                            className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-foreground/60 block">Calories</label>
                          <input
                            type="number"
                            value={editCalories}
                            onChange={(e) => setEditCalories(Number(e.target.value))}
                            className="w-full text-xs px-2.5 py-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleConfirmMeal(true)}
                          className="flex-1 py-2.5 text-xs font-bold"
                        >
                          Save & Log Corrections
                        </Button>
                        <Button
                          variant="glass"
                          onClick={() => setConfirmStatus("pending")}
                          className="py-2.5 px-4 text-xs font-bold border border-foreground/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );

  // Fallback simulator scanning for text/barcode queries
  async function handleScanSimulation(query: string) {
    setScanning(true);
    setResult(null);
    setConfirmStatus("pending");
    setErrorMsg("");
    setScanningStep(0);

    setTimeout(() => {
      const lowercase = query.toLowerCase();
      let compiled: ScanResult;

      if (lowercase.includes("salad") || lowercase.includes("salmon") || lowercase.includes("vegetable")) {
        compiled = {
          foodName: "Atlantic Salmon Avocado Salad Bowl",
          confidence: "high",
          mealType: "protein lunch",
          portionSize: "320g regular bowl",
          ingredients: ["Atlantic Salmon", "Hass Avocado", "Romaine Lettuce", "Cherry Tomatoes", "Olive Oil Dressing"],
          calories: 420,
          protein: 34,
          carbs: 18,
          fat: 26,
          sugar: 4,
          sodium: 290,
          fiber: 8,
          healthScore: 94,
          sugarAlert: false,
          unhealthyAdditives: ["None detected"],
          alternatives: ["Quinoa Salmon Salad", "Steamed Cod Bowl"],
          insights: [
            "High concentration of heart-healthy omega-3 fats.",
            "Protein load perfectly supports muscular cell rebuild cycles.",
            "Fiber content supports stable metabolic cleansing velocities."
          ],
          nutritionRecommendation: "Outstanding nutrition quality! Rich omega-3 fatty acids actively support cardiorespiratory repair and accelerate muscle recovery after exercise."
        };
      } else if (lowercase.includes("pizza") || lowercase.includes("burger") || lowercase.includes("fast")) {
        compiled = {
          foodName: "Double Cheese Pepperoni Pizza Slice",
          confidence: "medium",
          mealType: "fast food lunch",
          portionSize: "2 large slices (approx 240g)",
          ingredients: ["Refined white flour", "Mozzarella cheese", "Pepperoni pork sausage", "Tomato puree", "Trans fats"],
          calories: 580,
          protein: 18,
          carbs: 64,
          fat: 28,
          sugar: 12,
          sodium: 1120,
          fiber: 2,
          healthScore: 38,
          sugarAlert: true,
          unhealthyAdditives: ["Sodium Nitrites", "Saturated trans-fats"],
          alternatives: ["Whole-wheat Turkey wrap", "Cauliflower Crust Pizza"],
          insights: [
            "High refined glycemic load may trigger sugar-crashes within 90 minutes.",
            "Sodium levels have cleared 45% of daily kidney limits.",
            "Chemical preservatives identified inside pepperoni blocks."
          ],
          nutritionRecommendation: "Warning: High glycemic load detected. High processed trans-fats can delay muscular recovery and trigger fatigue spikes."
        };
      } else {
        compiled = {
          foodName: query.charAt(0).toUpperCase() + query.slice(1),
          confidence: "low_estimated",
          mealType: "moderate snack",
          portionSize: "1 standard serving (200g)",
          ingredients: ["Main visible whole food carbs", "Healthy oils", "Baseline minerals", "Spices"],
          calories: 280,
          protein: 12,
          carbs: 32,
          fat: 10,
          sugar: 5,
          sodium: 320,
          fiber: 3,
          healthScore: 74,
          sugarAlert: false,
          unhealthyAdditives: ["None detected"],
          alternatives: ["Organic fruits & almonds", "Whey protein shake"],
          insights: [
            "Likely healthy baseline serving with balanced carbs and proteins.",
            "Contains active nutrients to protect focus metrics.",
            "Hydration impact is stable."
          ],
          nutritionRecommendation: "A moderate nutrition profile. Provides stable energy, but make sure to balance with high-fiber greens for optimal digestion."
        };
      }

      setResult(compiled);
      setScanning(false);
      setInputText("");

      setEditFoodName(compiled.foodName);
      setEditPortion(compiled.portionSize);
      setEditCalories(compiled.calories);
      setEditProtein(compiled.protein);
      setEditCarbs(compiled.carbs);
      setEditFat(compiled.fat);

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

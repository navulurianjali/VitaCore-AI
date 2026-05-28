"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, Send, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { getBaseMetrics, getAICoachReply, DailyMetrics } from "@/utils/mockData";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function AICoachPage() {
  const { profile } = useAuth();
  const { activeMode } = useTheme();
  
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = getBaseMetrics(activeMode);
    setMetrics(base);
    
    // Initialize welcome message
    setMessages([
      {
        id: "msg-welcome",
        sender: "ai",
        text: `VitalCore AI Coach: Hello ${profile?.full_name || "Wellness Explorer"}! I have synchronized with your biometric telemetry. Currently, your Wellness Stability Index is at ${base.stabilityScore}% (Healthy) and physical fatigue is at ${base.physicalFatigue}%. You have accumulated a sleep debt of 1.2h. How can I optimize your preventative routine today?`,
        timestamp: new Date()
      }
    ]);
  }, [activeMode, profile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !metrics) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: inputVal,
      timestamp: new Date()
    };

    const currentInput = inputVal;
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");

    const aiMsgId = `msg-ai-${Date.now()}`;

    // Add placeholder first
    setMessages(prev => [...prev, {
      id: aiMsgId,
      sender: "ai",
      text: "...",
      timestamp: new Date()
    }]);

    let fullResponse = "";
    try {
      // Query secure server-side API endpoint
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages.concat(userMsg),
          profile,
          metrics
        })
      });

      if (!response.ok) {
        throw new Error("Simulator Mode active");
      }

      const resData = await response.json();
      fullResponse = resData.reply;
    } catch (err) {
      console.warn("AI Coach using local biometric simulator fallback:", err);
      fullResponse = getAICoachReply(currentInput, metrics, profile);
    }

    // Stream word-by-word
    const words = fullResponse.split(" ");
    let currentText = "";
    let wordIndex = 0;

    const timer = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: currentText } : m));
        wordIndex++;
      } else {
        clearInterval(timer);
      }
    }, 28); // Premium 28ms typewriter streaming speed
  };

  const samplePrompts = [
    "I'm feeling very sore from my workout yesterday.",
    "Can you analyze my sleep debt trends?",
    "What should I eat to avoid afternoon stress-eating slump?",
    "Schedule my optimal training timing today based on energy."
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full flex flex-col justify-between max-h-[85vh]">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5 shrink-0">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary animate-pulse" />
              AI Wellness Life Companion
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Conversational preventive health assistant
            </p>
          </div>
          <div className="text-xs font-bold text-foreground/50 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>Biometric Memory Synced</span>
          </div>
        </div>

        {/* Chat Console container */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Chat messages panel */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl glass-panel border-foreground/5 bg-background/40 min-h-[380px] p-4">
            
            {/* Scrollable Messages viewport */}
            <div className="flex-1 overflow-y-auto space-y-4 px-2 py-4 scrollbar-none max-h-[48vh]">
              {messages.map((msg) => {
                const isAI = msg.sender === "ai";
                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAI ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-secondary text-white shadow-md shadow-secondary/20"
                    }`}>
                      {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-semibold border ${
                      isAI 
                        ? "bg-foreground/5 text-foreground border-foreground/5" 
                        : "bg-primary text-white border-primary/20 shadow-md shadow-primary/10"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Form Input footer */}
            <form onSubmit={handleSendMessage} className="border-t border-foreground/5 pt-3 flex gap-2 shrink-0">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Query AI Coach (e.g. 'I am feeling sore after coding late...')"
                className="w-full text-xs px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/45 focus:outline-none focus:border-primary/50"
              />
              <Button variant="primary" type="submit" className="p-3.5 rounded-xl shrink-0">
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>

          </div>

          {/* Right side helper Panel: memory parameters & prompts */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Quick Sample Prompts */}
            <GlassCard glowColor="violet" className="space-y-4 p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Biomedical Prompts
                </h3>
                <p className="text-xs text-foreground/60 leading-normal font-semibold">
                  Select a predefined prompt to instantly query your Coach AI model:
                </p>
              </div>

              <div className="space-y-2.5 pt-2 flex-1">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputVal(prompt)}
                    className="w-full text-left p-3 rounded-xl bg-foreground/5 border border-foreground/5 text-xs font-semibold text-foreground/80 hover:bg-foreground/10 hover:border-primary/20 transition-all leading-normal"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* AI Companion Memory specs */}
            <GlassCard glowColor="amber" className="p-5 space-y-3">
              <h3 className="text-xs font-bold text-foreground">Companion Memory</h3>
              <ul className="space-y-2 text-xs text-foreground/75 font-semibold leading-normal">
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>**Active excuse logged**: Skips activity when coding runs past 9:00 PM due to focus inertia.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>**Cognitive stress correlation**: Macro food logs demonstrate a 25% sugar consumption surge when daily anxiety crosses 60%.</span>
                </li>
              </ul>
            </GlassCard>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

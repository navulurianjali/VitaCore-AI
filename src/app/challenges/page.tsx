"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { 
  Target, Users, Award, CheckCircle, 
  Droplets, Moon, Utensils, Activity, Plus,
  MessageCircle, Heart, Share2, Flame, UserPlus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";

export default function HealthyHabitsPage() {
  const { profile } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for data
  const [challenges, setChallenges] = useState<any[]>([]);
  const [userChallenges, setUserChallenges] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDuration, setNewDuration] = useState("7");
  
  // We removed the dummy groups state since there's no groups table in the real DB.
  // Real Challenges data only:
  useEffect(() => {
    fetchChallenges();
  }, [profile]);

  const fetchChallenges = async () => {
    if (!supabase) return;
    try {
      // 1. Fetch all public challenges from DB
      const { data: allC } = await supabase
        .from("challenges")
        .select("*")
        .order("id", { ascending: false });
      
      if (allC) {
        setChallenges(allC);
      }

      // 2. Fetch user's joined challenges from DB
      if (profile?.id) {
        const { data: uc } = await supabase
          .from("user_challenges")
          .select("*, challenge:challenges(*)")
          .eq("user_id", profile.id);
        
        if (uc) {
          setUserChallenges(uc);
        } else {
          setUserChallenges([]);
        }
      } else {
        setUserChallenges([]);
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    const userId = profile?.id;
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("user_challenges")
        .insert({ user_id: userId, challenge_id: challengeId, progress_percentage: 0 });
      
      if (!error) {
        fetchChallenges(); // Refresh lists
      } else {
        console.error("Failed to join challenge:", error);
      }
    } catch (err) {
      console.error("Join error:", err);
    }
  };

  const handleCreateChallenge = async () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    setLoading(true);
    
    const newChallenge = {
      title: newTitle,
      description: newDesc,
      category: "Community",
      difficulty: "Medium",
      duration_days: parseInt(newDuration) || 7
    };

    try {
      if (supabase && profile?.id) {
        const { data, error } = await supabase.from("challenges").insert(newChallenge).select();
        if (!error && data) {
          // Auto-join the challenge you just created
          await supabase.from("user_challenges").insert({
            user_id: profile.id,
            challenge_id: data[0].id,
            progress_percentage: 0
          });
        }
      }
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
      setShowCreateModal(false);
      setNewTitle("");
      setNewDesc("");
      fetchChallenges();
    }
  };

  const handleCompleteChallenge = async (userChallenge: any) => {
    // Optimistic UI update
    const updatedUc = userChallenges.map(uc => {
      if (uc.challenge_id === userChallenge.challenge_id) {
        return { ...uc, progress_percentage: 100, completed: true };
      }
      return uc;
    });
    setUserChallenges(updatedUc);
    setSelectedChallenge(null);

    // Persist to DB
    if (profile?.id && supabase) {
      try {
        await supabase
          .from("user_challenges")
          .update({ progress_percentage: 100, completed: true })
          .eq("user_id", profile.id)
          .eq("challenge_id", userChallenge.challenge_id);
      } catch (err) {
        console.error("Error completing challenge", err);
      }
    }
  };

  // Helper to check if joined
  const hasJoined = (id: string) => {
    return userChallenges.some((uc: any) => uc.challenge_id === id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-6xl mx-auto pb-10 font-sans">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-background to-blue-500/5 border border-foreground/5">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-7 w-7 text-emerald-500" />
              Healthy Habits
            </h1>
            <p className="text-sm text-foreground/70 font-medium">
              Join challenges, build great habits, and reach your goals together.
            </p>
          </div>
        </div>

        {/* SECTION 1 - TODAY'S GOAL */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Today's Goal
          </h2>
          <GlassCard className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="space-y-4 flex-1 w-full">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Walk 8,000 Steps</h3>
                  <p className="text-sm text-foreground/60 font-medium">Daily Walking Challenge</p>
                </div>
              </div>
              
              <div className="space-y-2 max-w-md">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-foreground/70">Progress</span>
                  <span>6,200 / 8,000</span>
                </div>
                <div className="w-full bg-foreground/5 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
                </div>
                <p className="text-sm text-foreground/60 pt-2 font-medium">
                  You are almost there. A short evening walk will complete today's goal.
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Button variant="primary" className="w-full md:w-auto px-8 py-3 text-sm font-bold shadow-lg shadow-blue-500/20">
                Continue Progress
              </Button>
            </div>
          </GlassCard>
        </section>

        {/* SECTION 5 - MY CHALLENGES */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            My Active Challenges
          </h2>
          {userChallenges.length === 0 ? (
            <div className="text-sm text-foreground/50 p-6 text-center border border-dashed rounded-2xl border-foreground/10">
              You haven't joined any challenges yet. Pick one below to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userChallenges.map((uc: any, idx: number) => (
                <GlassCard key={idx} className="p-5 flex items-center justify-between gap-4 border-l-4 border-l-orange-500">
                  <div className="space-y-1">
                    <h4 className="font-bold text-base">{uc.challenge?.title || "Custom Challenge"}</h4>
                    <p className="text-sm text-foreground/60 font-medium">In Progress</p>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-24 bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${uc.progress_percentage || 5}%` }} />
                      </div>
                      <span className="text-xs font-bold text-foreground/50">{uc.progress_percentage || 5}%</span>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedChallenge(uc)} variant="glass" size="sm" className="text-xs font-bold px-4">
                    View Details
                  </Button>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2 - POPULAR / COMMUNITY CHALLENGES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              Community Challenges
            </h2>
            <Button onClick={() => setShowCreateModal(true)} variant="glass" size="sm" className="text-xs font-bold flex items-center gap-1.5 border-primary/20 hover:border-primary/40">
              <Plus className="h-3.5 w-3.5" />
              Create Challenge
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.length > 0 ? challenges.map((ch: any) => (
              <GlassCard key={ch.id} className="p-5 space-y-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-3">
                  <div className={`w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center`}>
                    <Users className={`h-5 w-5 text-violet-500`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{ch.title}</h3>
                    <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">{ch.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-foreground/5">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground/50">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {Math.floor(Math.random() * 50) + 1} joined</span>
                    <span>{ch.duration_days || 7} days</span>
                  </div>
                  
                  {hasJoined(ch.id) ? (
                    <Button variant="secondary" className="w-full text-xs font-bold py-2 opacity-50 cursor-not-allowed">
                      <CheckCircle className="h-3.5 w-3.5 mr-1 inline" /> Joined
                    </Button>
                  ) : (
                    <Button onClick={() => handleJoinChallenge(ch.id)} variant="primary" className="w-full text-xs font-bold py-2">
                      Join Challenge
                    </Button>
                  )}
                </div>
              </GlassCard>
            )) : (
              <div className="col-span-full p-8 text-center text-sm font-bold text-foreground/50">
                Loading community challenges...
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Challenge Details Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{selectedChallenge.challenge?.title || "Custom Challenge"}</h3>
                <p className="text-sm text-foreground/60 mt-1">{selectedChallenge.challenge?.category || "Community"}</p>
              </div>
              <button onClick={() => setSelectedChallenge(null)} className="text-foreground/50 hover:text-foreground">✕</button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm font-medium leading-relaxed bg-foreground/5 p-4 rounded-xl">
                {selectedChallenge.challenge?.description || "Complete this challenge to earn points and improve your health."}
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-foreground/5">
                  <span className="block text-xs text-foreground/50 font-bold mb-1">Duration</span>
                  <span className="font-bold">{selectedChallenge.challenge?.duration_days || 7} Days</span>
                </div>
                <div className="p-3 rounded-xl bg-foreground/5">
                  <span className="block text-xs text-foreground/50 font-bold mb-1">Current Progress</span>
                  <span className="font-bold text-orange-500">{selectedChallenge.progress_percentage || 0}%</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex gap-3">
              <Button onClick={() => setSelectedChallenge(null)} variant="glass" className="flex-1 font-bold">Close</Button>
              <Button 
                onClick={() => handleCompleteChallenge(selectedChallenge)} 
                variant="primary" 
                className={`flex-1 font-bold border-0 ${selectedChallenge.progress_percentage === 100 ? "bg-emerald-500 hover:bg-emerald-600" : "bg-orange-500 hover:bg-orange-600"} text-white`}
                disabled={selectedChallenge.progress_percentage === 100}
              >
                {selectedChallenge.progress_percentage === 100 ? "Completed ✓" : "Mark as Complete"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}

    </DashboardLayout>
  );
}

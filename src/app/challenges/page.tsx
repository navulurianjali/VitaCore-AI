"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { 
  Target, Users, Award, CheckCircle, 
  Droplets, Moon, Utensils, Activity, Plus,
  MessageCircle, Heart, Share2, Flame, UserPlus
} from "lucide-react";

export default function HealthyHabitsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-5 flex items-center justify-between gap-4 border-l-4 border-l-orange-500">
              <div className="space-y-1">
                <h4 className="font-bold text-base">Daily Walking Challenge</h4>
                <p className="text-sm text-foreground/60 font-medium">Day 6 of 14</p>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-24 bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                  <span className="text-xs font-bold text-foreground/50">42%</span>
                </div>
              </div>
              <Button variant="glass" size="sm" className="text-xs font-bold px-4">
                View Details
              </Button>
            </GlassCard>

            <GlassCard className="p-5 flex items-center justify-between gap-4 border-l-4 border-l-emerald-500">
              <div className="space-y-1">
                <h4 className="font-bold text-base">Drink Water Challenge</h4>
                <p className="text-sm text-foreground/60 font-medium">Day 2 of 7</p>
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-24 bg-foreground/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                  <span className="text-xs font-bold text-foreground/50">28%</span>
                </div>
              </div>
              <Button variant="glass" size="sm" className="text-xs font-bold px-4">
                View Details
              </Button>
            </GlassCard>
          </div>
        </section>

        {/* SECTION 2 - POPULAR CHALLENGES */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-500" />
            Popular Challenges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {[
              { title: "Drink Water Challenge", desc: "Drink enough water for 7 days.", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10", joined: "1,240", duration: "7 days" },
              { title: "Daily Walking Challenge", desc: "Reach your daily step goal for 14 days.", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", joined: "3,800", duration: "14 days" },
              { title: "Better Sleep Challenge", desc: "Sleep at least 7 hours for one week.", icon: Moon, color: "text-indigo-500", bg: "bg-indigo-500/10", joined: "850", duration: "7 days" },
              { title: "Healthy Eating Challenge", desc: "Log healthy meals for 10 days.", icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10", joined: "2,100", duration: "10 days" },
            ].map((ch, idx) => (
              <GlassCard key={idx} className="p-5 space-y-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="space-y-3">
                  <div className={`w-10 h-10 ${ch.bg} rounded-xl flex items-center justify-center`}>
                    <ch.icon className={`h-5 w-5 ${ch.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{ch.title}</h3>
                    <p className="text-xs text-foreground/60 font-medium mt-1 leading-relaxed">{ch.desc}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-foreground/5">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground/50">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {ch.joined} joined</span>
                    <span>{ch.duration}</span>
                  </div>
                  <Button variant="primary" className="w-full text-xs font-bold py-2">
                    Join Challenge
                  </Button>
                </div>
              </GlassCard>
            ))}

          </div>
        </section>

        {/* SECTION 3 - COMMUNITY CHALLENGES & SECTION 4 - FRIENDS & GROUPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Community Challenges */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-pink-500" />
                Community Challenges
              </h2>
              <Button onClick={() => setShowCreateModal(true)} variant="glass" size="sm" className="text-xs font-bold flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Create Challenge
              </Button>
            </div>
            
            <div className="space-y-3">
              {[
                { title: "Walk 10,000 Steps Daily", author: "Sarah M.", likes: 45, comments: 12 },
                { title: "Drink 3 Liters Water", author: "Mike T.", likes: 112, comments: 8 },
                { title: "Morning Yoga Club", author: "Elena R.", likes: 89, comments: 24 },
                { title: "30-Day Weight Loss Journey", author: "David K.", likes: 230, comments: 45 },
              ].map((c, i) => (
                <GlassCard key={i} className="p-4 flex items-center justify-between hover:bg-foreground/[0.02] transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{c.title}</h4>
                    <p className="text-xs text-foreground/50 font-medium">Created by {c.author}</p>
                  </div>
                  <div className="flex items-center gap-4 text-foreground/40">
                    <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs font-bold">{c.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-bold">{c.comments}</span>
                    </button>
                    <button className="hover:text-emerald-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Friends & Groups */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-teal-500" />
              Friends & Groups
            </h2>
            
            <div className="space-y-3">
              {[
                { name: "Office Fitness Group", members: "24 members", icon: "🏢" },
                { name: "Healthy Eating Club", members: "128 members", icon: "🥗" },
                { name: "Evening Walk Team", members: "52 members", icon: "🚶" },
              ].map((g, i) => (
                <GlassCard key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-lg">
                      {g.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{g.name}</h4>
                      <p className="text-xs text-foreground/50 font-medium">{g.members}</p>
                    </div>
                  </div>
                  <Button variant="glass" size="sm" className="text-xs font-bold">
                    Join Group
                  </Button>
                </GlassCard>
              ))}
              
              <Button variant="glass" className="w-full mt-2 border-dashed border-2 py-4 text-sm font-bold text-foreground/60 hover:text-foreground">
                <Share2 className="h-4 w-4 mr-2 inline" />
                Invite Friends via Link
              </Button>
            </div>
          </section>
          
        </div>

        {/* SECTION 6 - ACHIEVEMENTS */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "First Workout Completed", icon: "🏆", color: "from-yellow-500/20 to-yellow-500/5" },
              { title: "7 Day Hydration Streak", icon: "💧", color: "from-blue-500/20 to-blue-500/5" },
              { title: "Sleep Champion", icon: "😴", color: "from-indigo-500/20 to-indigo-500/5" },
              { title: "100K Steps Milestone", icon: "🚶", color: "from-emerald-500/20 to-emerald-500/5" },
            ].map((ach, idx) => (
              <GlassCard key={idx} className={`p-5 text-center flex flex-col items-center justify-center gap-3 bg-gradient-to-b ${ach.color}`}>
                <div className="text-3xl drop-shadow-md">{ach.icon}</div>
                <h4 className="font-bold text-sm leading-tight max-w-[120px]">{ach.title}</h4>
              </GlassCard>
            ))}
          </div>
        </section>

      </div>

      {/* Create Challenge Modal (Placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Create New Challenge</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-foreground/50 hover:text-foreground">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70">Challenge Title</label>
                <input type="text" placeholder="e.g. Morning Yoga Club" className="w-full p-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/70">Description</label>
                <textarea placeholder="What's the goal of this challenge?" rows={3} className="w-full p-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-sm outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/70">Duration (Days)</label>
                  <input type="number" placeholder="7" className="w-full p-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/70">Privacy</label>
                  <select className="w-full p-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-sm outline-none focus:border-primary transition-colors">
                    <option>Public</option>
                    <option>Private (Invite Only)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex gap-3">
              <Button onClick={() => setShowCreateModal(false)} variant="glass" className="flex-1 font-bold">Cancel</Button>
              <Button variant="primary" className="flex-1 font-bold">Publish Challenge</Button>
            </div>
          </GlassCard>
        </div>
      )}

    </DashboardLayout>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Users, Sparkles, Smile, ShieldCheck, HeartPulse, Send, Award } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

interface CircleMember {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  stabilityScore: number;
  lastActive: string;
  status: string;
}

export default function CommunityPage() {
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [invitedEmail, setInvitedEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    // Generate initial simulated circle members
    setMembers([
      {
        id: "member-1",
        name: "Grandfather Charles",
        avatar: "C",
        streak: 14,
        stabilityScore: 92,
        lastActive: "4 mins ago",
        status: "Active stretching completed. Hydration logs synced!"
      },
      {
        id: "member-2",
        name: "Sarah M. (Arizona)",
        avatar: "S",
        streak: 8,
        stabilityScore: 84,
        lastActive: "1 hr ago",
        status: "Throttling active under heatwave overrides (35°C)."
      },
      {
        id: "member-3",
        name: "Dev Leader David",
        avatar: "D",
        streak: 2,
        stabilityScore: 58,
        lastActive: "Just now",
        status: "Late coding hyperfocus logged. Sleep debt accumulated."
      }
    ]);
  }, []);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitedEmail || !invitedEmail.includes("@")) return;

    setInviteSent(true);
    setInvitedEmail("");
    
    setTimeout(() => {
      setInviteSent(false);
    }, 4000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border-foreground/5 bg-gradient-to-r from-primary/10 via-background to-secondary/5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-primary animate-pulse" />
              Social Accountability Circles
            </h1>
            <p className="text-xs text-foreground/70 font-semibold">
              Motivate family, track elderly routines & secure community sharing
            </p>
          </div>
        </div>

        {/* 1. DUAL LAYOUT: Member feeds vs Circle management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Member list & active status updates */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <HeartPulse className="h-4.5 w-4.5 text-primary" />
              Circle Activity Telemetry Feeds
            </h3>

            <div className="space-y-4">
              {members.map((m) => (
                <GlassCard key={m.id} glowColor={m.stabilityScore < 60 ? "rose" : m.stabilityScore > 85 ? "emerald" : "violet"} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative border border-foreground/5">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                      {m.avatar}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        {m.name}
                        <span className="text-[9px] text-foreground/50 font-medium">({m.lastActive})</span>
                      </h4>
                      <p className="text-xs text-foreground/70 font-semibold leading-relaxed">
                        "{m.status}"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center shrink-0 text-xs font-bold text-foreground/80 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-foreground/5 w-full sm:w-auto justify-between sm:justify-start">
                    <div>
                      <span className="text-[9px] text-foreground/50 block font-semibold">Streak</span>
                      <span className="text-secondary font-bold">{m.streak} days</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 block font-semibold">Stability</span>
                      <span className={`font-bold ${m.stabilityScore < 60 ? "text-red-500" : "text-secondary"}`}>
                        {m.stabilityScore}%
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Right panel: Circle invitation & stats */}
          <div className="lg:col-span-4 rounded-2xl glass-panel p-6 border-foreground/5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-foreground">Invite to Circle</h3>
              <p className="text-xs text-foreground/60 leading-normal font-semibold">
                Transmit encrypted accountability circle invites to family or coaches:
              </p>

              {inviteSent ? (
                <div className="rounded-xl border border-secondary/15 bg-secondary/5 px-3 py-2.5 text-xs text-secondary font-semibold">
                  ✓ Encryption parameters generated! Invitation link sent successfully.
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={invitedEmail}
                    onChange={(e) => setInvitedEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground placeholder-foreground/45 focus:outline-none"
                    placeholder="partner@family.com"
                  />
                  <Button variant="primary" type="submit" className="w-full py-2.5 flex items-center justify-center gap-1 text-xs">
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Invite</span>
                  </Button>
                </form>
              )}
            </div>

            <GlassCard glowColor="violet" className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                Longevity Leadership
              </h4>
              <p className="text-xs text-foreground/75 leading-relaxed font-semibold">
                Your circle holds an average Wellness Stability Score of <span className="text-secondary font-bold">78%</span>. Keep sharing hydration consistency milestones!
              </p>
            </GlassCard>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

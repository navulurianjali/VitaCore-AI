"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  LayoutDashboard,
  Brain,
  Utensils,
  Moon,
  HeartPulse,
  Milestone,
  CheckSquare,
  Users,
  Settings,
  User,
  Shield,
  Activity,
  Menu,
  ChevronRight,
  Scan
} from "lucide-react";
import Button from "../ui/Button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const { activeMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Secure Route Guard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (profile && profile.onboarding_completed !== true && pathname !== "/auth/onboarding") {
        router.push("/auth/onboarding");
      }
    }
  }, [user, profile, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <span className="text-sm font-semibold tracking-wider animate-pulse">Syncing VitalCore Engine...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const sidebarLinks = [
    { name: "Overview Console", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Wellness Coach", href: "/ai-coach", icon: Brain, highlight: true },
    { name: "AI Food Scanner", href: "/scanner", icon: Scan, highlight: true },
    { name: "Smart Nutrition", href: "/nutrition", icon: Utensils },
    { name: "Sleep Analytics", href: "/sleep", icon: Moon },
    { name: "Recovery Center", href: "/recovery", icon: HeartPulse },
    { name: "Health Timeline", href: "/timeline", icon: Milestone },
    { name: "AI Challenges & Habits", href: "/challenges", icon: CheckSquare },
    { name: "Accountability Circle", href: "/community", icon: Users },
  ];

  const adminLink = { name: "Security Audit Logs", href: "/admin", icon: Shield };

  const footerLinks = [
    { name: "Wellness Profile", href: "/profile", icon: User },
    { name: "Control Panel", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-foreground/5 glass-panel bg-background shrink-0 select-none">
        
        {/* Profile Card Header */}
        <div className="p-5 border-b border-foreground/5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary/20">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-foreground truncate">{profile?.full_name}</h3>
              <p className="text-[10px] font-semibold text-secondary capitalize">{activeMode} Active Mode</p>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 scrollbar-none">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/15"
                    : link.highlight
                    ? "bg-secondary/10 hover:bg-secondary/15 text-secondary border border-secondary/10 hover:border-secondary/20"
                    : "text-foreground/75 hover:bg-foreground/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.name}</span>
                </div>
                {link.highlight && <ChevronRight className="h-3 w-3" />}
              </Link>
            );
          })}

          {/* Render Admin Tab if applicable */}
          {user?.email === "admin@vitalcore.ai" && (
            <div className="pt-4 mt-4 border-t border-foreground/5">
              <Link
                href={adminLink.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === adminLink.href ? "bg-primary text-white" : "text-foreground/75 hover:bg-foreground/5"
                }`}
              >
                <adminLink.icon className="h-4 w-4 text-accent shrink-0" />
                <span>{adminLink.name}</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-foreground/5 space-y-1.5">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? "bg-primary text-white" : "text-foreground/75 hover:bg-foreground/5"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

      </aside>

      {/* Main Console Content Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex h-14 items-center justify-between px-4 border-b border-foreground/5 glass-panel bg-background shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight text-sm">VitalCore Console</span>
          </Link>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl glass-panel text-foreground/80"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Responsive Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
            
            {/* Drawer */}
            <aside className="relative flex flex-col w-60 max-w-xs h-full bg-background border-r border-foreground/5 p-4 z-50 animate-slide-in">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-foreground/5">
                <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {profile?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="text-xs font-bold truncate">{profile?.full_name}</h4>
                  <p className="text-[9px] font-semibold text-secondary capitalize">{activeMode} Mode</p>
                </div>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-none">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive ? "bg-primary text-white" : "text-foreground/75 hover:bg-foreground/5"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-foreground/5 pt-4 space-y-1.5">
                {footerLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive ? "bg-primary text-white" : "text-foreground/75 hover:bg-foreground/5"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};
export default DashboardLayout;

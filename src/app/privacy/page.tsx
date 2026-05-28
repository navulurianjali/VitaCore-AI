"use client";

import React from "react";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col bg-background pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <h1 className="text-3xl font-bold">Privacy & Data Protection</h1>
        <p className="text-xs text-foreground/50 font-semibold">Effective: May 2026</p>
        
        <div className="border-t border-foreground/5 pt-8 space-y-6 text-xs text-foreground/75 leading-relaxed font-medium">
          <p>
            At VitalCore, we treat your health, sleep, and activity data with top-tier security. We design our app to follow the best privacy standards to keep your personal information completely safe and private.
          </p>

          <h2 className="text-sm font-bold text-foreground">1. Where Your Data is Saved</h2>
          <p>
            If you are using the app in Mock Mode, all your health tracking, sleep logs, water records, and chats stay on your own device (using your browser's local storage). No data is sent to external servers.
          </p>

          <h2 className="text-sm font-bold text-foreground">2. Secure Cloud Storage</h2>
          <p>
            If you connect your account to the cloud, all your wellness logs are protected by industry-standard security. Your personal information is strictly locked to your account, so no one else can ever access it.
          </p>

          <h2 className="text-sm font-bold text-foreground">3. Your Right to Delete Everything</h2>
          <p>
            You are in complete control of your data. You can clear all of your local logs instantly from your account settings, or delete your account and cloud data completely at any time.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

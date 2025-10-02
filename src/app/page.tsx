import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthSection from "@/components/AuthSection";
import { Target, Trophy, Sparkles, SearchCheckIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg border-2 border-b-4 border-r-4 border-border px-4 py-2 text-3xl font-bold transition-all hover:-translate-y-[2px]">
              Poornima's Quiz 
            </div>
            <Sparkles className="h-8 w-8" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Create personalized quizzes on any topic, get instant feedback, and track your progress. 
              Perfect for studying, teaching, or just having fun! Made by : Poornima Pulau 
            </p>
          </div>

          {/* CTA Buttons */}
          <AuthSection />

          {/* Feature Cards */}
          <div className="mt-24 grid gap-8 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                  <SearchCheckIcon className="h-8 w-8" />
                </div>
                <CardTitle>AI-Generated Questions</CardTitle>
                <CardDescription>
                  Just better than your knowledge
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle>Multiple Quiz Types</CardTitle>
                <CardDescription>
                  Choose between multiple choice questions or open-ended answers to suit your learning style
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                  <Trophy className="h-8 w-8" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your performance with detailed statistics and accuracy tracking
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

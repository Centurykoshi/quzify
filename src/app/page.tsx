"use client"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { authClient } from "@/lib/auth-clinet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Brain, 
  Lightbulb, 
  Target, 
  Zap, 
  Users, 
  Trophy,
  ArrowRight,
  LayoutDashboard,
  BookOpen,
  Sparkles
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const signInWithGoogle = () => {
    authClient.signIn.social({
      provider: "google",
    }, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: ({ error }) => {
        alert("Google sign-in failed: " + error.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg border-2 border-b-4 border-r-4 border-border px-4 py-2 text-3xl font-bold transition-all hover:-translate-y-[2px]">
              Quzify
            </div>
            <Sparkles className="h-8 w-8" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Test Your Knowledge with{" "}
              <span className="underline decoration-2 underline-offset-4">
                AI-Powered Quizzes
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Create personalized quizzes on any topic, get instant feedback, and track your progress. 
              Perfect for studying, teaching, or just having fun!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={signInWithGoogle}
              size="lg" 
              className="px-8 py-4 text-lg cursor-pointer"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
            
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg cursor-pointer">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/quiz">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg cursor-pointer">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Take Quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border">
                <Brain className="h-8 w-8" />
              </div>
              <CardTitle>AI-Generated Questions</CardTitle>
              <CardDescription>
                Our advanced AI creates unique, challenging questions tailored to your chosen topic
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

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-center text-3xl font-bold mb-12">
            How Quzify Works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose a Topic</h3>
              <p className="text-muted-foreground text-sm">
                Enter any subject you want to learn about
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold mb-2">AI Creates Quiz</h3>
              <p className="text-muted-foreground text-sm">
                Our AI generates personalized questions
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold mb-2">Take the Quiz</h3>
              <p className="text-muted-foreground text-sm">
                Answer questions at your own pace
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground text-sm">
                Review your performance and learn
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 rounded-2xl border px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Join the Learning Revolution</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold mb-2">AI-Powered</div>
              <div className="text-muted-foreground">Smart Question Generation</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Unlimited</div>
              <div className="text-muted-foreground">Quiz Topics Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Instant</div>
              <div className="text-muted-foreground">Feedback & Results</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners using Quzify to enhance their knowledge
          </p>
          <Button 
            onClick={signInWithGoogle}
            size="lg" 
            className="px-12 py-4 text-lg cursor-pointer"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  ); 

};

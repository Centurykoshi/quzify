"use client"; 
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


import { authClient } from "@/lib/auth-clinet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 


  Target, 


  
  Trophy,

  LayoutDashboard,
  BookOpen,
  Sparkles,

  SearchCheckIcon
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-lg border-2 border-b-4 border-r-4 border-border px-4 py-2 text-3xl font-bold transition-all hover:-translate-y-[2px]">
              Centuriz
            </div>
            <Sparkles className="h-8 w-8" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
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
                <SearchCheckIcon className="h-8 w-8" />
              </div>
              <CardTitle>AI-Generated Questions</CardTitle>
              <CardDescription>
                Just Better Than your knowledge
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
  ); 

};

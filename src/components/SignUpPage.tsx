"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-clinet";
import { FaGoogle } from "react-icons/fa";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SignUpPage = () => { 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignUp = async () => { 
        setIsLoading(true); 

  }; 

    const handleEmailSignUp = async(e: React.FormEvent) => { 
        e.preventDefault(); 
        setIsLoading(true); 

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        // Check password length
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long!");
            setIsLoading(false);
            return;
        }

        try{
            const result = await authClient.signUp.email({ 
                name,
                email, 
                password, 
                callbackURL: "/",
            }); 

            if(result.error){ 
                toast.error(result.error.message || "Failed to create account. Please try again.");
            }
            else {
                toast.success("Account created successfully! Please Login with your email to acess, Thank you .");
            }
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Join Poornima's Quiz App 
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Create your account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   

                {/* Email Sign-up Form */}
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                        Full Name
                    </Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12"
                        required
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        required
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                        required
                    />
                    <Button type="button"
                    variant={"ghost"}
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={()=> setShowPassword(!showPassword)}>
                        {showPassword? (<EyeOff className="h-4 w-4 text-muted-foreground"/>) :
                         (<Eye className="h-4 w-4 text-muted-foreground"/>)}
                    </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12"
                        required
                    />
                    <Button type="button"
                    variant={"ghost"}
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={()=> setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword? (<EyeOff className="h-4 w-4 text-muted-foreground"/>) :
                         (<Eye className="h-4 w-4 text-muted-foreground"/>)}
                    </Button>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Button variant="link" className="px-0 h-auto text-xs">
                        Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="px-0 h-auto text-xs">
                        Privacy Policy
                    </Button>
                </div>

                <Button type="submit" className="w-full h-12 font-medium"
                disabled={isLoading || !name || !email || !password || !confirmPassword}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                </form>
                </CardContent>

                <div className="text-center text-sm text-muted-foreground pb-6">
                    Already have an account?{" "}
                    <Button variant="link" className="px-0 font-medium cursor-pointer">
                        Sign in
                    </Button>
                </div>

            </Card>
        </div>
    )
}; 

export default SignUpPage;

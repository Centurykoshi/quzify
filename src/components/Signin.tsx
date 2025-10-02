"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-clinet";
import { FaGoogle } from "react-icons/fa";
import { Mail, Lock, Eye, EyeOff, Ghost } from "lucide-react";
import { use, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const SignInPage = () => { 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => { 
        setIsLoading(true); 

        try { 
            await authClient.signIn.social({ 
                provider: "google",
                callbackURL: "/",
                errorCallbackURL: "/error",
                newUserCallbackURL: "/",
                disableRedirect: false,
            });
        } catch (error) {
            toast.error("Failed to sign in with Google" + error);
        } finally {
            setIsLoading(false);
        }
    }; 

    const handleEmailSignIn = async(e: React.FormEvent) => { 
        e.preventDefault(); 
        setIsLoading(true); 

        try{
            const result = await authClient.signIn.email({ 
                email, 
                password, 
                callbackURL: "/",
            }); 

            if(result.error){ 
                toast.error(result.error.message || "Invalid email or password. Please try again.");
            }
            else {
                toast.success("Successfully signed in!");
            }
        } catch (error) {
            toast.error("Failed to sign in with email" + error);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        Welcome to Poornima's Quiz
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Button onClick={handleGoogleSignIn} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-12 text-sm font-medium border-2 hover:bg-red-50 dark:hover:bg-black transition-colors"
                >
                    <FaGoogle className="mr-3 h-5 w-5" />
                    Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    </div>
                    <div className="relative flex justify-center text-sm ">
                        <span className="bg-background px-2 text-muted-foreground">
                            or{" "}
                        </span>
                    </div>
                        <div className="relative flex justify-center text-sm ">
                        <span className="bg-background px-2 text-muted-foreground">
                             continue with email
                        </span>
                    </div>
                </div>

                {/* {email Sign-in Form } */}
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium m-2">
                        Email
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-20 h-12"
                        required
                    />

                    </div>
                </div>


                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium m-2">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 text-muted-foreground"/>
                        <Input id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-20 h-12"
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

                {/* <div className="flex items-center justify-between m-2">
                    <div className="flex items-center space-x-2">
                 <input
                   id="remember"
                   type="checkbox"
                   className="rounded border-gray-300"
                 />
                 <Label htmlFor="remember" className="text-sm text-muted-foreground">
                   Remember me
                 </Label>
                    </div>
                </div> */}

                <Button type="submit" className="w-full h-12 font-medium"
                disabled={isLoading || !email || !password}>
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                </form>
                </CardContent>

                <div className="text-center text-sm text-muted-foreground">
                    don't have an account?{" "}
                    <Button variant="link" className="px-0 font-medium cursor-pointer">
                        <Link href="/sign-up">Sign up</Link>
                    </Button>
                </div>

            </Card>


        </div>
    )
}; 

export default SignInPage;

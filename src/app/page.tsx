"use client"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-clinet";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit= ()=> { 
    authClient.signUp.email({
      email, 
      password, 
      name, 
    }, { 
      onSuccess: () => { 
        router.push("/"); // Redirect to home page after successful signup
      }, 
      onError: ({error}) => {
       alert("Signup failed: " + error.message);
      }
    }); 

    
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen ">
      <div className="flex-col flex gap-4 ">
        <Input value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name" />
        <Input value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email" />
        <Input value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" />

      </div>

      <Button onClick={onSubmit}>
        Submit
      </Button>
    </div>
  ); 

};

"use client"; 
import type { User } from "better-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";


import { LogOut } from "lucide-react";


import { authClient } from "@/lib/auth-clinet";
import UserAvatar from "./UserAvatar";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {

    const signOut = async () => { 
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.href = "/"; // Redirect to home page after sign out
                    }
                }
            }); 
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>

             <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium"
                        >{user.name}</p>}
                        {user.email && (<p className="text-sm "
                        >{user.email}</p>)}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                     <Link href={'/'}>Cemis</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>

                <DropdownMenuItem onSelect={(event)=> { 
                    event.preventDefault(); 
                    signOut(); 
                }}
                className="text-red-600 cursor-pointer"
                >
                    Sign-out
                    <LogOut className="w-4 h-4 ml-2"/>

                </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
)

};



export default UserAccountNav;
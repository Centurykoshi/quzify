import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import AuthButtons from "./auth-buttons";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";



const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border dark:border py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4  px-2 py-1 text-xl transition-all hover:-translate-y-[2px] md:block dark:border-b-4 dark:border-r-4">
            Centuriz
          </p>
        </Link>
        
        <div className="flex gap-4 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={"/dashboard"}>
                  <Button variant={"outline"} className="cursor-pointer">
                    <LayoutDashboard />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ThemeToggle className="mr-3" />
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

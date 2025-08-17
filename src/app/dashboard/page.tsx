
import HistoryCard from "@/components/dashboard/HistoryCard";
import HotTopicsCard from "@/components/dashboard/HotTopics";
import QuizMeCard from "@/components/dashboard/QuizmeCard";
import RecentActivityCard from "@/components/dashboard/RecentActiviy";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return redirect("/sign-in");
    }

    return (
        <main className="pt-20 p-8 mx-auto max-w-7xl">
            <div className="flex items-center">
                <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
                {/* detaildialog */}
            </div>

            <div className="grid gap-4 mt-4 md:grid-cols-2">
                <QuizMeCard />
                <HistoryCard />
            </div>

            <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
              <HotTopicsCard />
              <RecentActivityCard />
            </div>

        
        </main>
    );
}

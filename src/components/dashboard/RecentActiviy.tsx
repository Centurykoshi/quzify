import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import Link from "next/link";

import { redirect } from "next/navigation";
import HistoryCard from "./HistoryCard";
import History from "@/app/history/page";
import HistoryComponent from "../HistoryComponent";

export default async function RecentActivityCard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return redirect("/sign-in");
    }

    const games_count = await prisma.game.count({
        where: {
            userId: session.user.id,
        }
    });

    return (
        <Card className="col-span-4 lg:col-span-3 rounded-none">
            <CardHeader>
                <CardTitle className="text-2xl pb-2">
                    <Link href="/history">Recent Activity</Link>
                </CardTitle>


                <CardDescription>
                    You have {games_count} games played.
                </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[580px] overflow-x-auto  p-4">
                <HistoryComponent limit={10} userId={session.user.id} />
            </CardContent>


        </Card>
    );


};
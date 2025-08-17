import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import OpenEnded from "@/components/OpenEnded";

type Props = {
    params: {
        gameId: string;
    };
};

const openEndedPage = async ({ params }: Props) => {
    const { gameId } = await params; // Await params first
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return redirect("/");
    }

    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
            userId: session.user.id, // Only allow users to view their own games
        },
        include: {
            questions: {
                select: {
                    id: true,
                    question: true,
                    answer: true,
                },
            },
        },
    }); 
    
    if (!game || game.gameType === "mcq") {
        return redirect("/Quiz");
    }

    
    return <OpenEnded game={game} />;
}; 

export default openEndedPage; 
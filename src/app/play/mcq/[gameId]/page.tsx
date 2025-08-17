import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import MCQ from "@/components/MCQ";
 // Assuming you have an MCQ component to render the game


type Props = { 
    params: { 
        gameId: string;
    }; 
}; 

const MCQPAGE = async ({params} : Props)=> { 
        const {gameId} = await params; // Await params first

        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if(!session?.user){ 
            return redirect("/"); 
        }

        const game = await prisma.game.findUnique({
            where : {
                id : gameId, 
                userId : session.user.id, 
            }, 
            include : { 
                questions : { 
                    select : { 
                        id: true,
                        question: true, 
                        answer: true,
                        options: true  // Added this line!
                    }, 
                }, 
            }, 
        }); 

        if(!game || game.gameType ==="open_ended"){ 
            return redirect("/Quiz");
        }

        return <MCQ game={game} />;

}; 

export default MCQPAGE;
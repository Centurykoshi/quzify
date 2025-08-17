
import QuizPage from "@/components/QuizCreation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { 
    title : "Quiz | Centuriz",
    description: "Centuriz yourself on anything!",
}; 


interface Props{ 
    searchParams: { 
        topic?: string;
    }
}

const Quiz = async ({ searchParams }: Props) => { 
    const session = await auth.api.getSession({
        headers: await headers(),
    }); 

    if(!session?.user) {
        redirect("/");
    }

    return (
        <h1 className="">
          <QuizPage topic={searchParams.topic ?? ""} />
        </h1>
    );
}; 

export default Quiz;
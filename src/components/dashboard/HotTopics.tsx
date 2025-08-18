
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import WordCloud from "../WordCloud";

export default async function HotTopicsCard(){ 
    const topics = await prisma.topic_count.findMany({}); 

    const formattedTopics = topics.map((topic) => { 
        return { 
            text: topic.topic,
            value: topic.count,
        };
    });

    return (
        <Card className="col-span-4 rounded-none">
            <CardHeader>
                <CardTitle className="text-2xl">Hot Topics </CardTitle>
                <CardDescription>
                    Click on a topic to start a quiz on it.
                </CardDescription>
            </CardHeader>

            <CardContent className="pl-2">
                <div className="h-64 cursor-pointer">
                    <WordCloud formattedTopics={formattedTopics} />
                </div>
            </CardContent>
        </Card>
    ); 
}; 

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";


type props = { 
    accuracy: number; 
}

const AccuracyCard = ({ accuracy }: props) => {
    accuracy = Math.round(accuracy * 100) / 100;
    
    return (
        <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-2xl ">Average Accuracy </CardTitle>
            <Target/>

            </CardHeader>

            <CardContent>
                <div className="text-sm font-medium">{accuracy.toString() + "%"}</div>
            </CardContent>
        </Card>


    );

};

export default AccuracyCard; 

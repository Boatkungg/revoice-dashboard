import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CreateCustomGame() {
    return (
        <Link href={"/dashboard/custom-games/create"}>
            <Button variant="default" size="default">
                <span className="flex items-center space-x-1">
                    <span>Create Custom Game</span>
                    <Plus className="h-4 w-4" />
                </span>
            </Button>
        </Link>
    );
}

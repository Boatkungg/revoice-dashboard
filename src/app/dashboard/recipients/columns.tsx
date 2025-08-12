"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { $fetch } from "@/lib/fetch";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type Recipient = {
    gameUserId: string;
    name: string;
    image?: string | null;
    firstName: string;
    lastName: string;
    title: string;
    gender: string;
    birthDate?: string | null;
};

const ActionsCell = ({
    recipient,
    onRefetch,
}: {
    recipient: Recipient;
    onRefetch: () => void;
}) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const router = useRouter();

    async function handleRemoveRecipient() {
        // Implement remove recipient logic here
        console.log("Remove recipient clicked for:", recipient.gameUserId);

        const { error } = await $fetch("@post/dashboard/recipient/remove", {
            body: {
                gameUserId: recipient.gameUserId,
            },
            credentials: "include",
        });

        if (error) {
            console.error("Error removing recipient:", error);
            toast.error("Failed to remove recipient");
            return;
        }

        toast.success("Recipient removed successfully");
        onRefetch();
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Actions</span>
                        <User className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" align="end">
                    <DropdownMenuItem onClick={() => router.push(`/dashboard/recipients/${recipient.gameUserId}`)}>
                        View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-500"
                        onClick={handleRemoveRecipient}
                    >
                        Remove Recipient
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="w-full max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Recipient details</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <strong>Name:</strong> {recipient.name}
                        </div>
                        <div>
                            <strong>Full Name:</strong> {recipient.title}{" "}
                            {recipient.firstName} {recipient.lastName}
                        </div>
                        <div>
                            <strong>Game User ID:</strong>{" "}
                            {recipient.gameUserId}
                        </div>
                        <div>
                            <strong>Gender:</strong> {recipient.gender}
                        </div>
                        {recipient.birthDate && (
                            <div>
                                <strong>Birth Date:</strong>{" "}
                                {recipient.birthDate}
                            </div>
                        )}
                    </div>
                    <DialogFooter />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const createColumns = (
    onRefetch: () => void
): ColumnDef<Recipient>[] => [
    {
        id: "image",
        cell: ({ row }) => {
            const recipient = row.original;

            return (
                <Avatar>
                    <AvatarImage
                        src={recipient.image || ""}
                        draggable={false}
                    />
                    <AvatarFallback>{`${recipient.name.substring(
                        0,
                        2
                    )}`}</AvatarFallback>
                </Avatar>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorFn: (row) => `${row.title} ${row.firstName} ${row.lastName}`,
        id: "fullName",
        header: "Full Name",
    },
    {
        accessorKey: "gameUserId",
        header: "Game User ID",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const recipient = row.original;
            return <ActionsCell recipient={recipient} onRefetch={onRefetch} />;
        },
    },
];

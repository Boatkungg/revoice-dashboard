"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { $fetch } from "@/lib/fetch";
import { ColumnDef } from "@tanstack/react-table";
import { PencilLine, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AccessManagement } from "./access-management";

export type Game = {
    id: string;
    type: string;
    subtype?: string | null;
    name: string;
    description: string;
};

export type GameDetails = {
    id: string;
    type: string;
    subtype: string;
    name: string;
    description: string;
    stage: Array<{
        number: number;
        target: string;
        description: string;
        image: string;
    }>;
};

const ActionsCell = ({ game, onRefetch }: { game: Game, onRefetch: () => void }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [accessManagementOpen, setAccessManagementOpen] = useState(false);
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [loading, setLoading] = useState(false);

    async function fetchGameDetails() {
        setLoading(true);
        try {
            const { data, error } = await $fetch("@get/dashboard/custom-level/by-id", {
                query: {
                    customLevelId: game.id,
                },
                credentials: "include",
            });

            if (error) {
                console.error("Error fetching game details:", error);
                toast.error("Failed to fetch game details");
                return;
            }

            setGameDetails(data);
        } catch (err) {
            console.error("Error fetching game details:", err);
            toast.error("Failed to fetch game details");
        } finally {
            setLoading(false);
        }
    }

    async function handleViewDetails() {
        setDetailsOpen(true);
        await fetchGameDetails();
    }

    function handleDialogChange(open: boolean) {
        setDetailsOpen(open);
        if (!open) {
            setGameDetails(null);
            setLoading(false);
        }
    }

    async function handleRemoveGame() {
        console.log("Remove game clicked for:", game.id);
        
        const { error } = await $fetch("@post/dashboard/custom-level/delete", {
            body: {
                customLevelId: game.id,
            },
            credentials: "include",
        });

        if (error) {
            console.error("Error removing game:", error);
            toast.error("Failed to remove game");
            return;
        }

        toast.success("Game removed successfully");
        onRefetch();
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Actions</span>
                        <PencilLine className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" align="end">
                    <DropdownMenuItem onClick={handleViewDetails}>
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAccessManagementOpen(true)}>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Access
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500" onClick={handleRemoveGame}>
                        Remove Game
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Details Dialog */}
            <Dialog open={detailsOpen} onOpenChange={handleDialogChange}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Game Details</DialogTitle>
                    </DialogHeader>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Loading game details...</span>
                        </div>
                    ) : gameDetails ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong>Name:</strong> {gameDetails.name}
                                </div>
                                <div>
                                    <strong>Type:</strong> {gameDetails.type}
                                </div>
                                <div>
                                    <strong>Subtype:</strong> {gameDetails.subtype}
                                </div>
                                <div>
                                    <strong>ID:</strong> {gameDetails.id}
                                </div>
                            </div>
                            
                            <div>
                                <strong>Description:</strong>
                                <p className="mt-1 text-sm text-muted-foreground">{gameDetails.description}</p>
                            </div>
                            
                            {gameDetails.stage && gameDetails.stage.length > 0 && (
                                <div>
                                    <strong>Stages ({gameDetails.stage.length}):</strong>
                                    <div className="mt-2 space-y-4">
                                        {gameDetails.stage.map((stage) => (
                                            <div key={stage.number} className="border rounded-lg p-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                                            {stage.number}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div>
                                                            <strong>Target:</strong> {stage.target}
                                                        </div>
                                                        <div>
                                                            <strong>Description:</strong>
                                                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                                                        </div>
                                                        {stage.image && (
                                                            <div>
                                                                <strong>Image:</strong>
                                                                <div className="mt-1">
                                                                    <a 
                                                                        href={stage.image} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 underline break-all"
                                                                    >
                                                                        {stage.image}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            Failed to load game details
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Access Management Dialog */}
            <AccessManagement
                gameId={game.id}
                gameName={game.name}
                isOpen={accessManagementOpen}
                onClose={() => setAccessManagementOpen(false)}
            />
        </div>
    );
};

export const createColumns = (onRefetch: () => void): ColumnDef<Game>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "subtype",
        header: "Subtype",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell game={row.original} onRefetch={onRefetch} />,
    }
];

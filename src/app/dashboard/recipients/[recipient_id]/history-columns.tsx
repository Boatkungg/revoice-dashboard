"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { $fetch } from "@/lib/fetch";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Calendar, Clock, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type HistoryEntry = {
    id: string;
    sessionId: string;
    levelId: string;
    type: string;
    subtype: string;
    isCustom: boolean;
    name: string;
    description: string;
    startTime?: string | null;
    endTime?: string | null;
    score: number;
};

type HistoryDetails = HistoryEntry & {
    stageInfo?: Array<{
        number: number;
        target: string;
        description: string;
        image: string;
        attempts?: number;
        attemptValues?: string[];
        passed?: boolean;
    }> | null;
};

const HistoryDetailsCell = ({
    historyEntry,
    gameId,
}: {
    historyEntry: HistoryEntry;
    gameId: string;
}) => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [historyDetails, setHistoryDetails] = useState<HistoryDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistoryDetails = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/recipient/history",
                {
                    query: {
                        gameId: gameId,
                        historyId: historyEntry.id,
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch history details");
                return;
            }

            setHistoryDetails(data.history);
        } catch (err) {
            console.error("Error fetching history details:", err);
            toast.error("An unexpected error occurred while fetching history details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = () => {
        setDetailsOpen(true);
        fetchHistoryDetails();
    };

    return (
        <div>
            <Button variant="ghost" size="sm" onClick={handleViewDetails}>
                <Eye className="h-4 w-4" />
            </Button>

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{historyEntry.name}</DialogTitle>
                        <DialogDescription>{historyEntry.description}</DialogDescription>
                    </DialogHeader>
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-pulse">Loading details...</div>
                        </div>
                    ) : historyDetails ? (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm font-medium">Score: {historyDetails.score}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">
                                            {historyDetails.startTime 
                                                ? new Date(historyDetails.startTime).toLocaleDateString()
                                                : "No start date"
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant={historyDetails.isCustom ? "secondary" : "default"}>
                                        {historyDetails.isCustom ? "Custom" : "Main"} Game
                                    </Badge>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">
                                            {historyDetails.endTime 
                                                ? new Date(historyDetails.endTime).toLocaleDateString()
                                                : "Not completed"
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stage Information */}
                            {historyDetails.stageInfo && historyDetails.stageInfo.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-3">Stage Details</h4>
                                    <div className="space-y-3">
                                        {historyDetails.stageInfo.map((stage) => (
                                            <div key={stage.number} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">Stage {stage.number}</span>
                                                    {stage.passed !== undefined && (
                                                        <Badge variant={stage.passed ? "default" : "destructive"}>
                                                            {stage.passed ? "Passed" : "Failed"}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Target: {stage.target}
                                                </p>
                                                <p className="text-sm mb-2">{stage.description}</p>
                                                {stage.attempts !== undefined && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Attempts: {stage.attempts}
                                                    </p>
                                                )}
                                                {stage.attemptValues && stage.attemptValues.length > 0 && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Attempt values: {stage.attemptValues.join(", ")}
                                                    </div>
                                                )}
                                                {stage.image && (
                                                    <div className="mt-2">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img 
                                                            src={stage.image} 
                                                            alt={`Stage ${stage.number}`}
                                                            className="max-w-full h-auto max-h-32 object-contain rounded border"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No detailed information available
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const createHistoryColumns = (gameId: string): ColumnDef<HistoryEntry>[] => [
    {
        accessorKey: "name",
        header: "Game Name",
        cell: ({ row }) => {
            const history = row.original;
            return (
                <div>
                    <div className="font-medium">{history.name}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {history.description}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const history = row.original;
            return (
                <div>
                    <Badge variant={history.isCustom ? "secondary" : "default"}>
                        {history.isCustom ? "Custom" : "Main"}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                        {history.type} - {history.subtype}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => {
            const score = row.getValue("score") as number;
            return (
                <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{score}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "startTime",
        header: "Date Played",
        cell: ({ row }) => {
            const startTime = row.getValue("startTime") as string | null;
            if (!startTime) return <span className="text-muted-foreground">-</span>;
            
            return (
                <div className="text-sm">
                    {new Date(startTime).toLocaleDateString()}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const history = row.original;
            return <HistoryDetailsCell historyEntry={history} gameId={gameId} />;
        },
    },
];

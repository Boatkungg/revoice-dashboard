"use client";

import { $fetch } from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./history-data-table";
import { createHistoryColumns, HistoryEntry } from "./history-columns";
import { CalendarDays, Target, Trophy, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecipientDetails = {
    gameId: string;
    name: string;
    image?: string | null;
    firstName: string;
    lastName: string;
    title: string;
    gender: string;
    birthDate?: string | null;
    streak: {
        currentStreak: number;
        longestStreak: number;
        streakStartDate?: string | null;
        lastActivityDate?: string | null;
        totalDaysPlayed: number;
    };
};

export default function RecipientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const recipientId = params.recipient_id as string;
    
    const [recipient, setRecipient] = useState<RecipientDetails | null>(null);
    const [historyList, setHistoryList] = useState<Array<HistoryEntry>>([]);
    const [historyRowCount, setHistoryRowCount] = useState<number>(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    const fetchRecipientDetails = useCallback(async () => {
        if (!recipientId) return;
        
        setIsLoading(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/recipient/by-id",
                {
                    query: {
                        gameId: recipientId,
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch recipient details");
                return;
            }

            setRecipient(data);
        } catch (err) {
            console.error("Error fetching recipient details:", err);
            toast.error("An unexpected error occurred while fetching recipient details");
        } finally {
            setIsLoading(false);
        }
    }, [recipientId]);

    const fetchHistoryList = useCallback(async () => {
        if (!recipientId) return;
        
        setIsHistoryLoading(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/recipient/history-list",
                {
                    query: {
                        gameId: recipientId,
                        page: pagination.pageIndex + 1,
                        limit: pagination.pageSize,
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch recipient history");
                return;
            }

            setHistoryList(data.history);
            setHistoryRowCount(data.rowCount);
        } catch (err) {
            console.error("Error fetching recipient history:", err);
            toast.error("An unexpected error occurred while fetching recipient history");
        } finally {
            setIsHistoryLoading(false);
        }
    }, [recipientId, pagination]);

    useEffect(() => {
        fetchRecipientDetails();
    }, [fetchRecipientDetails]);

    useEffect(() => {
        fetchHistoryList();
    }, [fetchHistoryList]);

    const columns = createHistoryColumns(recipientId);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse">Loading recipient details...</div>
            </div>
        );
    }

    if (!recipient) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div>Recipient not found</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col mt-6 px-6 space-y-6">
            {/* Back Button */}
            <div className="flex items-center space-x-4 mb-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => router.push('/dashboard/recipients')}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Recipients</span>
                </Button>
            </div>

            {/* Recipient Info Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={recipient.image || ""} draggable={false} />
                            <AvatarFallback className="text-lg">
                                {recipient.name.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{recipient.name}</h1>
                            <p className="text-muted-foreground">
                                {recipient.title} {recipient.firstName} {recipient.lastName}
                            </p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Game User ID</p>
                                <p className="font-medium">{recipient.gameId}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CalendarDays className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Gender</p>
                                <p className="font-medium">{recipient.gender}</p>
                            </div>
                        </div>

                        {recipient.birthDate && (
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Birth Date</p>
                                    <p className="font-medium">{new Date(recipient.birthDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator className="my-6" />

                    {/* Streak Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                            Activity & Streaks
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {recipient.streak.currentStreak}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Current Streak</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {recipient.streak.longestStreak}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {recipient.streak.totalDaysPlayed}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Total Days Played</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        {recipient.streak.lastActivityDate 
                                            ? new Date(recipient.streak.lastActivityDate).toLocaleDateString()
                                            : "No recent activity"
                                        }
                                    </div>
                                    <p className="text-sm text-muted-foreground">Last Activity</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* History Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                        Game History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={historyList}
                        rowCount={historyRowCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        isLoading={isHistoryLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

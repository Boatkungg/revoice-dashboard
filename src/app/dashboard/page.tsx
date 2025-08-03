"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { $fetch } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function DashboardPage() {
    const [recipientCount, setRecipientCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRecipientCount = async () => {
            try {
                setLoading(true);
                const { data, error } = await $fetch(
                    "@get/dashboard/recipient/count",
                    {
                        credentials: "include",
                    }
                );

                if (error || !data) {
                    toast.error("Failed to fetch recipient count");
                    return;
                }

                setRecipientCount(data.count);
            } catch (err) {
                console.error("Error fetching recipient count:", err);
                toast.error("An unexpected error occurred while fetching recipient count");
            } finally {
                setLoading(false);
            }
        }

        fetchRecipientCount();
    }, [])

    const cardData = [
        {
            title: "Total recipients",
            value: recipientCount,
        },
        {
            title: "Total custom games",
            value: 3, // Placeholder value, replace with actual data fetching logic
        },
        {
            title: "Total daily quests completed",
            value: 5, // Placeholder value, replace with actual data fetching logic
        },
        {
            title: "Total games played",
            value: 14, // Placeholder value, replace with actual data fetching logic
        }
    ]

    // Chart configuration for daily quests
    const dailyQuestChartConfig: ChartConfig = {
        quests: {
            label: "Quests Completed",
            color: "hsl(var(--chart-1))",
        },
    }

    const dailyPlayedChartConfig: ChartConfig = {
        quests: {
            label: "Quests Completed",
            color: "hsl(var(--chart-1))",
        },
    }

    // Sample data for daily quest history (last 7 days)
    const dailyQuestData = [
        { day: "Mon", quests: 12 },
        { day: "Tue", quests: 8 },
        { day: "Wed", quests: 15 },
        { day: "Thu", quests: 10 },
        { day: "Fri", quests: 18 },
        { day: "Sat", quests: 22 },
        { day: "Sun", quests: 16 },
    ]

    // Sample data for daily quest history (last 7 days)
    const dailyPlayedData = [
        { day: "Mon", games: 23 },
        { day: "Tue", games: 15 },
        { day: "Wed", games: 28 },
        { day: "Thu", games: 15 },
        { day: "Fri", games: 38 },
        { day: "Sat", games: 41 },
        { day: "Sun", games: 21 },
    ]

    return (
        <div className="w-full h-full flex flex-col mt-6">
            <div className="grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cardData.map(({ title, value }) => (
                    <Card key={title} className=" w-full bg-card">
                    <CardHeader>
                        <CardTitle>
                            <div className="text-muted-foreground">{title}</div>
                            {!loading 
                            ? <div className="text-3xl mt-1">{value}</div> 
                            : <Skeleton className="h-9 w-9 mt-1"/>
                            }
                        </CardTitle>
                        <CardContent/>
                        <CardFooter/>
                    </CardHeader>
                </Card>))}
            </div>
            
            {/* Charts */}
            <div className="grid mt-8 px-6 grid-cols-1 gap-4 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Daily Quest (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={dailyQuestChartConfig} className="h-[300px] w-full">
                                <LineChart data={dailyQuestData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone"
                                        dataKey="quests" 
                                        stroke={`var(--color-chart-1)`}
                                        strokeWidth={2}
                                        dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Games Played (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={dailyPlayedChartConfig} className="h-[300px] w-full">
                                <LineChart data={dailyPlayedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone"
                                        dataKey="games" 
                                        stroke="var(--color-chart-2)"
                                        strokeWidth={2}
                                        dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
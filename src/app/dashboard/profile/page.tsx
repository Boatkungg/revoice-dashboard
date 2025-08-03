"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Shield, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const { 
        data: session, 
        isPending, 
        error 
    } = authClient.useSession();

    if (isPending) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-1">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <Skeleton className="w-24 h-24 rounded-full" />
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-red-200">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-red-500 mb-2">Error loading profile</div>
                                <p className="text-sm text-muted-foreground">{error.message}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-muted-foreground mb-2">No user session found</div>
                                <p className="text-sm">Please sign in to view your profile.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const user = session.user;
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
    };

    const formatDate = (date: string | Date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and personal information.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Profile Card */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage 
                                        src={user.image || `https://github.com/${user.name}.png`} 
                                        alt={user.name || "User"}
                                    />
                                    <AvatarFallback className="text-xl">
                                        {getInitials(user.name || "User")}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="text-center">
                                    <h2 className="text-xl font-semibold">{user.name || "Unknown User"}</h2>
                                    <p className="text-muted-foreground text-sm">{user.email}</p>
                                </div>

                                <Button variant="outline" className="w-full">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>
                                Your account details and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Email */}
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">Email</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                            </div>

                            {/* User ID */}
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <Shield className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">User ID</div>
                                    <div className="text-sm text-muted-foreground font-mono">{user.id}</div>
                                </div>
                            </div>

                            {/* Created At */}
                            {user.createdAt && (
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">Member Since</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email Verified */}
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">Email Status</div>
                                    <div className="text-sm text-muted-foreground">
                                        {user.emailVerified ? 'Verified' : 'Unverified'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Session Information (for debugging - can be removed) */}
                {process.env.NODE_ENV === 'development' && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Session Information</CardTitle>
                            <CardDescription>
                                Debug information (only visible in development)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
                                {JSON.stringify(session, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
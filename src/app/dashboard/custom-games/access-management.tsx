"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { $fetch } from "@/lib/fetch";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, UserMinus, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccessListUser = {
    gameUserId: string;
    name: string;
    image?: string | null;
    firstName: string;
    lastName: string;
    title: string;
};

type Recipient = {
    gameUserId: string;
    name: string;
    image?: string | null;
    firstName: string;
    lastName: string;
    title: string;
    gender: string;
    birthDate?: string | null;
};

interface AccessManagementProps {
    gameId: string;
    gameName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function AccessManagement({ gameId, gameName, isOpen, onClose }: AccessManagementProps) {
    const [accessList, setAccessList] = useState<AccessListUser[]>([]);
    const [allRecipients, setAllRecipients] = useState<Recipient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAccessList = useCallback(async () => {
        if (!gameId) return;
        
        setIsLoading(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/custom-level/access-list",
                {
                    query: {
                        customLevelId: gameId,
                        page: 1,
                        limit: 100, // Get all users for now
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch access list");
                return;
            }

            setAccessList(data.accessList);
        } catch (err) {
            console.error("Error fetching access list:", err);
            toast.error("An unexpected error occurred while fetching access list");
        } finally {
            setIsLoading(false);
        }
    }, [gameId]);

    const fetchAllRecipients = useCallback(async () => {
        setIsLoadingRecipients(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/recipient/list",
                {
                    query: {
                        page: 1,
                        limit: 100, // Get all recipients for now
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch recipients");
                return;
            }

            setAllRecipients(data.recipients);
        } catch (err) {
            console.error("Error fetching recipients:", err);
            toast.error("An unexpected error occurred while fetching recipients");
        } finally {
            setIsLoadingRecipients(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchAccessList();
            fetchAllRecipients();
        }
    }, [isOpen, fetchAccessList, fetchAllRecipients]);

    const handleAddAccess = async (recipientUserId: string) => {
        try {
            const { error } = await $fetch("@post/dashboard/custom-level/add-access", {
                body: {
                    customLevelId: gameId,
                    recipientUserId: recipientUserId,
                },
                credentials: "include",
            });

            if (error) {
                toast.error("Failed to add access");
                return;
            }

            toast.success("Access granted successfully");
            fetchAccessList(); // Refresh the access list
        } catch (err) {
            console.error("Error adding access:", err);
            toast.error("An unexpected error occurred while adding access");
        }
    };

    const handleRemoveAccess = async (recipientUserId: string) => {
        try {
            const { error } = await $fetch("@post/dashboard/custom-level/remove-access", {
                body: {
                    customLevelId: gameId,
                    recipientUserId: recipientUserId,
                },
                credentials: "include",
            });

            if (error) {
                toast.error("Failed to remove access");
                return;
            }

            toast.success("Access removed successfully");
            fetchAccessList(); // Refresh the access list
        } catch (err) {
            console.error("Error removing access:", err);
            toast.error("An unexpected error occurred while removing access");
        }
    };

    // Filter recipients that don't have access yet
    const availableRecipients = allRecipients.filter(
        recipient => !accessList.some(access => access.gameUserId === recipient.gameUserId)
    );

    // Filter recipients based on search query
    const filteredAvailableRecipients = availableRecipients.filter(
        recipient => 
            recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAccessList = accessList.filter(
        user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Manage Access - {gameName}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div>
                        <Label htmlFor="search">Search Recipients</Label>
                        <Input
                            id="search"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[50vh]">
                        {/* Users with Access */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-green-600 flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Has Access ({accessList.length})</span>
                            </h3>
                            
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span>Loading access list...</span>
                                </div>
                            ) : filteredAccessList.length > 0 ? (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredAccessList.map((user) => (
                                        <div key={user.gameUserId} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={user.image || ""} draggable={false} />
                                                    <AvatarFallback className="text-xs">
                                                        {user.name.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.title} {user.firstName} {user.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveAccess(user.gameUserId)}
                                            >
                                                <UserMinus className="h-3 w-3 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? "No matching users found" : "No users have access yet"}
                                </div>
                            )}
                        </div>

                        {/* Available Recipients */}
                        <div className="space-y-3">
                            <h3 className="font-medium text-blue-600 flex items-center space-x-2">
                                <UserPlus className="h-4 w-4" />
                                <span>Available Recipients ({availableRecipients.length})</span>
                            </h3>
                            
                            {isLoadingRecipients ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span>Loading recipients...</span>
                                </div>
                            ) : filteredAvailableRecipients.length > 0 ? (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredAvailableRecipients.map((recipient) => (
                                        <div key={recipient.gameUserId} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={recipient.image || ""} draggable={false} />
                                                    <AvatarFallback className="text-xs">
                                                        {recipient.name.substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{recipient.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {recipient.title} {recipient.firstName} {recipient.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleAddAccess(recipient.gameUserId)}
                                            >
                                                <UserPlus className="h-3 w-3 mr-1" />
                                                Grant
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? "No matching recipients found" : "All recipients already have access"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

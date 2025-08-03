"use client";

import Image from "next/image";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";
import { ChevronUp, Gamepad2, Home, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useMemo } from "react";

const base_menu_items = [
    {
        name: "Home",
        href: "/dashboard",
        icon: Home
    },
    {
        name: "Recipients",
        href: "/dashboard/recipients",
        icon: User
    },
    {
        name: "Custom Games",
        href: "/dashboard/custom-games",
        icon: Gamepad2
    }
]

export default function DashboardSidebar() {
    const { data: session, isPending } = authClient.useSession();

    // if session.role is admin add Main Games to the menu
    const menu_items = useMemo(() => {
        const items = [...base_menu_items];
        if (session?.user?.role === "admin") {
            items.push({
                name: "Main Games",
                href: "/dashboard/main-games",
                icon: Gamepad2
            });
        }
        return items;
    }, [session]);

    async function handleSignOut() {
        // Implement sign out logic here
        console.log("Sign out clicked");
        await authClient.signOut({}, {
            onSuccess: () => {
                redirect("/signin");
            }
        });
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
    };

    const getUserDisplayName = () => {
        if (isPending) return "Loading...";
        if (!session?.user) return "Guest";
        return session.user.name || session.user.email || "Unknown User";
    };

    const getUserInitials = () => {
        if (!session?.user?.name) return "GU"; // Guest User
        return getInitials(session.user.name);
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link href={"/dashboard"} className="h-8 w-fit flex items-center ">
                    <div className=" min-h-8 min-w-8 relative">
                        <Image src={"/revoice.svg"} alt="" fill draggable={false}/>
                    </div>
                    <span className="ml-2 text-xl group-data-[collapsible=icon]:hidden overflow-hidden">ReVoice</span>
                </Link>
                
            </SidebarHeader>
            <SidebarContent className=" mt-6">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                menu_items.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href}>
                                                <item.icon className="h-4 w-4"/>
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" disabled={isPending}>
                                    <Avatar>
                                        <AvatarImage 
                                            src={session?.user?.image || `https://github.com/${session?.user?.name || 'user'}.png`} 
                                            alt={session?.user?.name || "User"} 
                                            draggable={false} 
                                        />
                                        <AvatarFallback>
                                            {isPending ? "..." : getUserInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="ml-1">
                                        {getUserDisplayName()}
                                    </span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-56">
                                <Link href={"/dashboard/profile"}>
                                    <DropdownMenuItem
                                        disabled={!session?.user}
                                    >
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem 
                                    onClick={handleSignOut}
                                >
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
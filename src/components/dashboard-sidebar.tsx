import Image from "next/image";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";
import { ChevronUp, Gamepad2, Home, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const menu_items = [
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
                                <SidebarMenuButton size="lg">
                                    <Avatar>
                                        <AvatarImage src={"https://github.com/BoatKunGG.png"} alt="" draggable={false} />
                                        <AvatarFallback>UN</AvatarFallback>
                                    </Avatar>
                                    <span className="ml-1">BoatKunGG</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-56">
                                <DropdownMenuItem>
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
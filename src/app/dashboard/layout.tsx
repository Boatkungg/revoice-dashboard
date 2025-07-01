import { SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        
    </SidebarProvider>
  );
}
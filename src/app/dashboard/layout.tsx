import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar/>
      <main className="flex flex-1 relative flex-col w-full">
        <header className="h-12 shrink-0 gap-1 flex items-center p-2">
          <SidebarTrigger className="w-8 h-8"/>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
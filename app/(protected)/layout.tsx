import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from '@/lib/utils';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className={cn('m-4 bg-slate-900')} />
      <div className="min-h-screen p-4 pt-16">
        {children}
      </div>
    </SidebarProvider>
  )
}

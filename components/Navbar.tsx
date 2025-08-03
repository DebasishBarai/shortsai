'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, Users, UserPlus, Video, Plus, LayoutDashboardIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UpgradeDialog } from "@/components/UpgradeDialog";

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }); // This will redirect to the landing page after logout
  };

  const NavItems = () => (
    <>
      {session ? (
        <>
          <Link href="/dashboard">
            <Button variant="ghost">
              <LayoutDashboardIcon className="h-4 w-4 mr-2" />
              Dashboard

            </Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </Link>
          <Link href="/videos">
            <Button variant="ghost">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </Button>
          </Link>
          {/* <Link href="/contacts"> */}
          {/*   <Button variant="ghost"> */}
          {/*     <UserPlus className="h-4 w-4 mr-2" /> */}
          {/*     Contacts */}
          {/*   </Button> */}
          {/* </Link> */}
          {/* <Link href="/groups"> */}
          {/*   <Button variant="ghost"> */}
          {/*     <Users className="h-4 w-4 mr-2" /> */}
          {/*     Groups */}
          {/*   </Button> */}
          {/* </Link> */}
          {session.user?.subscriptionType !== 'premium' && (
            <UpgradeDialog
              currentPlan={session.user?.subscriptionType || 'free'}
              isTrialExpired={false} // You might want to pass this from session
            />
          )}
          <Button
            onClick={handleSignOut}
            variant="ghost"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/pricing">
            <Button variant="ghost">Pricing</Button>
          </Link>
          <Button
            onClick={() => signIn()}
          >
            Login
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link href="/" className="text-2xl font-bold">
          Shorts AI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavItems />
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 

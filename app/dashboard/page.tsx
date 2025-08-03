"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Bell, Settings, Plus, Trash2, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { SubscriptionBadge } from '@/components/SubscriptionBadge';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { SubscriptionType } from "@prisma/client";
import { UpgradeOptions } from "@/components/UpgradeOptions";
import { Badge } from '@/components/ui/badge';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface Group {
  id: string;
  name: string;
  contacts: Contact[];
}

interface Reminder {
  id: string;
  title: string;
  message: string;
  dateTime: string;
  frequency: string;
  phone: string;
  sent: boolean;
  createdAt: string;
  Group: Group | null;
}

interface User {
  subscriptionType: SubscriptionType;
  subscriptionEndDate: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const trialStatus = useTrialStatus(
    userData?.createdAt || null,
    userData?.subscriptionType || null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [remindersRes, userRes] = await Promise.all([
          fetch('/api/reminders'),
          fetch('/api/user')
        ]);

        const remindersData = await remindersRes.json();
        const userData = await userRes.json();

        if (Array.isArray(remindersData)) {
          setReminders(remindersData);
        }
        if (userData) {
          console.log(userData);
          setUserData(userData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeReminders = reminders.filter(r => !r.sent);
  const upcomingReminders = reminders.filter(r => {
    const reminderDate = new Date(r.dateTime);
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return reminderDate > now && reminderDate <= sevenDaysFromNow;
  });
  const totalSent = reminders.filter(r => r.sent).length;
  const groupReminders = reminders.filter(r => r.Group !== null);

  const deleteReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete reminder');
      }

      setReminders(reminders.filter(reminder => reminder.id !== id));
      toast.success('Reminder deleted successfully');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* User Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}</h1>
          <p className="text-muted-foreground">
            {userData?.subscriptionType === 'free' && !trialStatus.isExpired && (
              <span className="text-primary">
                {trialStatus.daysLeft} days left in trial
              </span>
            )}
          </p>
        </div>
        <SubscriptionBadge type={userData?.subscriptionType || 'free'} />
      </div>

      {/* Show upgrade prompt if trial expired */}
      {/* {userData?.subscriptionType === 'free' && trialStatus.isExpired && ( */}
      {/*   <UpgradePrompt /> */}
      {/* )} */}

      {/* Only show dashboard content if trial is active or user has paid plan */}
      {(!trialStatus.isExpired || userData?.subscriptionType !== 'free') ? (
        <>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              <Link href="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Video
                </Button>
              </Link>
              {/* <Link href="/contacts"> */}
              {/*   <Button variant="outline"> */}
              {/*     <UserPlus className="mr-2 h-4 w-4" /> */}
              {/*     Manage Contacts */}
              {/*   </Button> */}
              {/* </Link> */}
              {/* <Link href="/groups"> */}
              {/*   <Button variant="outline"> */}
              {/*     <Users className="mr-2 h-4 w-4" /> */}
              {/*     Manage Groups */}
              {/*   </Button> */}
              {/* </Link> */}
            </div>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> */}
          {/*   <Card> */}
          {/*     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"> */}
          {/*       <CardTitle className="text-sm font-medium">Active Reminders</CardTitle> */}
          {/*       <Bell className="h-4 w-4 text-muted-foreground" /> */}
          {/*     </CardHeader> */}
          {/*     <CardContent> */}
          {/*       <div className="text-2xl font-bold">{activeReminders.length}</div> */}
          {/*       <p className="text-xs text-muted-foreground">Currently active</p> */}
          {/*     </CardContent> */}
          {/*   </Card> */}
          {/**/}
          {/*   <Card> */}
          {/*     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"> */}
          {/*       <CardTitle className="text-sm font-medium">Upcoming Reminders</CardTitle> */}
          {/*       <CalendarDays className="h-4 w-4 text-muted-foreground" /> */}
          {/*     </CardHeader> */}
          {/*     <CardContent> */}
          {/*       <div className="text-2xl font-bold">{upcomingReminders.length}</div> */}
          {/*       <p className="text-xs text-muted-foreground">Next 7 days</p> */}
          {/*     </CardContent> */}
          {/*   </Card> */}
          {/**/}
          {/*   <Card> */}
          {/*     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"> */}
          {/*       <CardTitle className="text-sm font-medium">Group Reminders</CardTitle> */}
          {/*       <Users className="h-4 w-4 text-muted-foreground" /> */}
          {/*     </CardHeader> */}
          {/*     <CardContent> */}
          {/*       <div className="text-2xl font-bold">{groupReminders.length}</div> */}
          {/*       <p className="text-xs text-muted-foreground">Multiple recipients</p> */}
          {/*     </CardContent> */}
          {/*   </Card> */}
          {/**/}
          {/*   <Card> */}
          {/*     <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0"> */}
          {/*       <CardTitle className="text-sm font-medium">Total Sent</CardTitle> */}
          {/*       <Settings className="h-4 w-4 text-muted-foreground" /> */}
          {/*     </CardHeader> */}
          {/*     <CardContent> */}
          {/*       <div className="text-2xl font-bold">{totalSent}</div> */}
          {/*       <p className="text-xs text-muted-foreground">All time</p> */}
          {/*     </CardContent> */}
          {/*   </Card> */}
          {/* </div> */}

          {/* Recent Reminders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Videos</CardTitle>
                <Link href="/videos">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>Your recently created videos</CardDescription>
            </CardHeader>
            <CardContent>
              {reminders.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No videos yet</p>
                  <p className="text-sm">Create your first video to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.slice(0, 5).map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{reminder.title}</h3>
                          {reminder.Group && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {reminder.Group.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{reminder.message}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>{format(new Date(reminder.dateTime), 'PPp')}</span>
                          {reminder.Group ? (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {reminder.Group.contacts.length} recipients
                            </span>
                          ) : (
                            <span>{reminder.phone}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${reminder.sent
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                          }`}>
                          {reminder.sent ? 'Sent' : 'Pending'}
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this reminder? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteReminder(reminder.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <UpgradeOptions
          currentPlan={userData?.subscriptionType || 'free'}
          isTrialExpired={true}
        />
      )}
    </div>
  );
}

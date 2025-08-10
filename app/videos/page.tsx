'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Trash2, Search, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
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

export default function RemindersPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch('/api/reminders');
        const data = await res.json();
        if (Array.isArray(data)) {
          setReminders(data);
        }
      } catch (error) {
        console.error('Error fetching reminders:', error);
        toast.error('Failed to fetch reminders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

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

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'sent' && reminder.sent) ||
      (statusFilter === 'pending' && !reminder.sent);

    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'individual' && !reminder.Group) ||
      (typeFilter === 'group' && reminder.Group);

    return matchesSearch && matchesStatus && matchesType;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">All Videos</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Video
            </Button>
          </Link>
          {/* <Link href="/groups"> */}
          {/*   <Button variant="outline"> */}
          {/*     <Users className="mr-2 h-4 w-4" /> */}
          {/*     Manage Groups */}
          {/*   </Button> */}
          {/* </Link> */}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        {/* <div className="flex gap-2 w-full sm:w-auto"> */}
        {/*   <Select */}
        {/*     value={statusFilter} */}
        {/*     onValueChange={setStatusFilter} */}
        {/*   > */}
        {/*     <SelectTrigger className="w-full sm:w-[140px]"> */}
        {/*       <SelectValue placeholder="Status" /> */}
        {/*     </SelectTrigger> */}
        {/*     <SelectContent> */}
        {/*       <SelectItem value="all">All Status</SelectItem> */}
        {/*       <SelectItem value="pending">Pending</SelectItem> */}
        {/*       <SelectItem value="sent">Sent</SelectItem> */}
        {/*     </SelectContent> */}
        {/*   </Select> */}
        {/*   <Select */}
        {/*     value={typeFilter} */}
        {/*     onValueChange={setTypeFilter} */}
        {/*   > */}
        {/*     <SelectTrigger className="w-full sm:w-[140px]"> */}
        {/*       <SelectValue placeholder="Type" /> */}
        {/*     </SelectTrigger> */}
        {/*     <SelectContent> */}
        {/*       <SelectItem value="all">All Types</SelectItem> */}
        {/*       <SelectItem value="individual">Individual</SelectItem> */}
        {/*       <SelectItem value="group">Group</SelectItem> */}
        {/*     </SelectContent> */}
        {/*   </Select> */}
        {/* </div> */}
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No Videos found</p>
          </div>
        ) : (
          filteredReminders.map((reminder) => (
            <div key={reminder.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-sm">{reminder.title}</h3>
                    {reminder.Group && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        Group
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{reminder.message}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Created: {format(new Date(reminder.dateTime), 'PPp')}</div>
                    <div>Voice: {reminder.frequency}</div>
                    <div>Aspect Ratio: {reminder.Group ? reminder.Group.name : 'Individual'}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
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
                        <AlertDialogTitle>Delete Video</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this video? This action cannot be undone.
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
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm">Title</TableHead>
              <TableHead className="text-sm">Description</TableHead>
              <TableHead className="text-sm">Created At</TableHead>
              <TableHead className="text-sm">Voice</TableHead>
              <TableHead className="text-sm">Aspect Ratio</TableHead>
              <TableHead className="text-sm">Status</TableHead>
              <TableHead className="text-right text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReminders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No Videos found
                </TableCell>
              </TableRow>
            ) : (
              filteredReminders.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {reminder.title}
                      {reminder.Group && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Group
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{reminder.message}</TableCell>
                  <TableCell className="text-sm">{format(new Date(reminder.dateTime), 'PPp')}</TableCell>
                  <TableCell className="capitalize text-sm">{reminder.frequency}</TableCell>
                  <TableCell className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${reminder.sent
                      ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
                      }`}>
                      {reminder.sent ? 'Sent' : 'Pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {reminder.Group ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{reminder.Group.name}</span>
                      </div>
                    ) : (
                      'Individual'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
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
                          <AlertDialogTitle>Delete Video</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this video? This action cannot be undone.
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 

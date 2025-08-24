'use client';

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LandingContent = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Never Miss Important Dates
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule custom WhatsApp reminders for all your important dates and events
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" onClick={() => router.push('/login')}>
              <Bell className="w-4 h-4" />
              Get Started
            </Button>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="gap-2">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Calendar className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-muted-foreground">
              Set up reminders in seconds with our intuitive scheduling interface
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Recurring Reminders</h3>
            <p className="text-muted-foreground">
              Schedule daily, weekly, monthly, or yearly recurring reminders
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <Bell className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">WhatsApp Integration</h3>
            <p className="text-muted-foreground">
              Receive reminders directly on WhatsApp - no extra apps needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UpgradePrompt() {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Free Trial Expired</CardTitle>
        <CardDescription>
          Your 7-day free trial has ended. Upgrade to continue using RemindMe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/pricing">
          <Button className="w-full">Upgrade Now</Button>
        </Link>
      </CardContent>
    </Card>
  );
} 
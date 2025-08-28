import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4">
      <Card className="max-w-lg w-full shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-gray-300">
            Have questions, suggestions, or need support? <br />
            We’d love to hear from you!
          </p>

          <div className="flex items-center justify-center space-x-2 text-gray-200">
            <Mail className="h-5 w-5" />
            <Link
              href="mailto:debasishbarai.developer@gmail.com"
              className="text-blue-400 hover:underline"
            >
              debasishbarai.developer@gmail.com
            </Link>
          </div>

          <Button asChild className="w-full">
            <Link href="mailto:debasishbarai.developer@gmail.com">
              Send Email
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

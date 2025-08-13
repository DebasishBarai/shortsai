import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShortsAI – Instantly Create Viral Videos with AI',
  description: 'Create viral short videos instantly using AI-powered tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

'use client'

import { Check, Star, Zap, Coins, Video } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export function PricingCards() {

  const { data: session } = useSession();


  const creditPackages = [
    {
      name: "Starter Pack",
      credits: 60,
      price: 10,
      popular: false,
      features: [
        "60 AI Video Credits",
        "12 x 15-second videos, OR",
        "6 x 30-second videos, OR",
        "3 x 60-second video",
        "All Video Styles (Realistic, Cartoon, Watercolor, Sketch)",
        "All Voice Types (8 Premium Voices)",
        "9:16 Aspect Ratio for Short Videos",
        "No Watermark",
        "Perfect for beginners"
      ]
    },
    {
      name: "Creator Pack",
      credits: 160,
      price: 20,
      popular: true,
      features: [
        "160 AI Video Credits",
        "32 x 15-second videos, OR",
        "16 x 30-second videos, OR",
        "8 x 60-second videos",
        "All Video Styles (Realistic, Cartoon, Watercolor, Sketch)",
        "All Voice Types (8 Premium Voices)",
        "9:16 Aspect Ratio for Short Videos",
        "No Watermark",
        "Best value for creators"
      ]
    },
    {
      name: "Pro Pack",
      credits: 360,
      price: 40,
      popular: false,
      features: [
        "360 AI Video Credits",
        "72 x 15-second videos, OR",
        "36 x 30-second videos, OR",
        "18 x 60-second videos",
        "All Video Styles (Realistic, Cartoon, Watercolor, Sketch)",
        "All Voice Types (8 Premium Voices)",
        "9:16 Aspect Ratio for Short Videos",
        "No Watermark",
        "Perfect for businesses"
      ]
    }
  ];

  const onPaymentSuccess = async (credits: number, price: number) => {
    const res = await axios.post('/api/add-credits', {
      credits: credits,
    });

    if (!res.data.success) {
      toast.error('Payment failed');
      console.log('Payment failed:', res.data.error);
      return;
    }

    toast.success(`Successfully purchased ${res.data.credits} credits for ${price}`);
    toast.success(`Updated credits: ${res.data.newCredits}`);
    console.log('Payment success:', credits, price);
  };

  const onPaymentCancel = () => {
    toast.error('Payment cancelled');
    console.log('Payment cancel');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          Pay only for what you use
        </p>

        {/* <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8"> */}
        {/* Currency selector */}
        {/* <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Select currency:</span>
            <CurrencySelector />
          </div>
        </div> */}
      </div>

      {/* Value Proposition Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg mb-8 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5" />
          <span className="font-semibold text-lg">Flexible Credit System</span>
        </div>
        <p className="text-sm opacity-90 mb-2">
          <strong>15s video:</strong> 5 credits • <strong>30s video:</strong> 10 credits • <strong>60s video:</strong> 20 credits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {creditPackages.map((pkg, index) => (
          <div
            key={index}
            className={`border-2 rounded-xl p-6 sm:p-8 bg-white dark:bg-slate-800 flex flex-col hover:shadow-lg transition-shadow duration-300 relative group ${pkg.popular
              ? 'border-blue-500 dark:border-blue-400 shadow-lg'
              : 'border-slate-200 dark:border-slate-700'
              }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm flex items-center">
                <Star className="h-3 w-3 mr-1" /> Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                {pkg.name}
              </h3>

              <div className="flex items-center justify-center gap-2 mb-3">
                <Coins className="h-8 w-8 text-yellow-500" />
                <span className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-200">
                  {pkg.credits}
                </span>
                <span className="text-lg text-slate-500 dark:text-slate-400">Credits</span>
              </div>

              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                ${pkg.price}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                One-time payment • ${(pkg.price / pkg.credits).toFixed(2)} per credit
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700/50 h-px w-full mb-6"></div>

            <ul className="space-y-3 mb-8 flex-grow text-sm sm:text-base">
              {pkg.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            {session && (
              <div className="relative w-full">
                <Button
                  className={`w-full py-4 sm:py-6 text-base sm:text-lg pointer-events-none ${pkg.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200'
                    }`}
                >
                  Get {pkg.credits} Credits
                </Button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
          How Credits Work
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div className="flex flex-col items-center">
            <Video className="h-8 w-8 text-blue-500 mb-2" />
            <p className="text-slate-600 dark:text-slate-400">15s = 5 Credits</p>
            <p className="text-slate-600 dark:text-slate-400">30s = 10 Credits</p>
            <p className="text-slate-600 dark:text-slate-400">60s = 20 Credits</p>
          </div>
          <div className="flex flex-col items-center">
            <Coins className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-slate-600 dark:text-slate-400">Credits Never Expire</p>
          </div>
          <div className="flex flex-col items-center">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-slate-600 dark:text-slate-400">No Monthly Fees</p>
          </div>
        </div>
      </div>
    </div>
  );
} 

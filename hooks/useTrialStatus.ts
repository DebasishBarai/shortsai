import { useEffect, useState } from 'react';
import { addDays, isAfter } from 'date-fns';
import { SubscriptionType } from "@prisma/client";

interface TrialStatus {
  isExpired: boolean;
  daysLeft: number | null;
}

export function useTrialStatus(createdAt: string | null, subscriptionType: SubscriptionType | null) {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({ 
    isExpired: false, 
    daysLeft: null 
  });

  useEffect(() => {
    if (!createdAt || subscriptionType !== SubscriptionType.free) {
      return;
    }

    const accountCreatedDate = new Date(createdAt);
    const trialEndDate = addDays(accountCreatedDate, 7);
    const currentDate = new Date();
    
    const isExpired = isAfter(currentDate, trialEndDate);
    const daysLeft = isExpired ? 0 : 
      Math.ceil((trialEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    setTrialStatus({ isExpired, daysLeft });
  }, [createdAt, subscriptionType]);

  return trialStatus;
} 
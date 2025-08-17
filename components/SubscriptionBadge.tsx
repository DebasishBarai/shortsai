import { SubscriptionType } from "@prisma/client";

interface SubscriptionBadgeProps {
  type: SubscriptionType;
}

const getBadgeStyles = (type: SubscriptionType) => {
  switch (type) {
    case 'premium':
      return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
    case 'basic':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
  }
};

const formatPlanName = (type: SubscriptionType) => {
  if (!type) return 'Free Plan';
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Plan`;
};

export function SubscriptionBadge({ type = SubscriptionType.free }: SubscriptionBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeStyles(type)}`}>
      {formatPlanName(type)}
    </span>
  );
} 
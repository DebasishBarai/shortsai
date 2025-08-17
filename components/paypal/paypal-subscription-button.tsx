import React, { useEffect, useRef } from 'react';

interface PayPalSubscriptionButtonProps {
  clientId: string;
  planId: string;
  onSubscriptionSuccess?: (subscriptionId: string) => void;
}

const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  clientId,
  planId,
  onSubscriptionSuccess
}) => {
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if PayPal script is already loaded
    if (window.paypal) {
      renderPayPalButton();
      return;
    }

    // Load PayPal script
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.async = true;

    script.onload = () => {
      renderPayPalButton();
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, planId]);

  const renderPayPalButton = () => {
    if (window.paypal && paypalButtonContainerRef.current) {
      window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe',
        },
        createSubscription: (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: planId
          });
        },
        onApprove: (data: any) => {
          if (onSubscriptionSuccess) {
            onSubscriptionSuccess(data.subscriptionID);
          }
          // Optional: You can add a success message or redirect here
          alert(`Subscription successful! Subscription ID: ${data.subscriptionID}`);
        },
        onError: (err: any) => {
          console.error('PayPal Button Error:', err);
          alert('An error occurred with the PayPal subscription.');
        }
      }).render(paypalButtonContainerRef.current);
    }
  };

  return (
    <div
      ref={paypalButtonContainerRef}
      className="paypal-button-container w-full max-w-xs mx-auto"
    />
  );
};

export default PayPalSubscriptionButton;

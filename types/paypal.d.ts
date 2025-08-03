// types/paypal.d.ts
declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style?: {
          shape?: 'pill' | 'rect';
          color?: string;
          layout?: 'vertical' | 'horizontal';
          label?: string;
        };
        createSubscription?: (data: any, actions: any) => Promise<string>;
        onApprove?: (data: any) => void;
        onError?: (err: any) => void;
      }) => {
        render: (container: HTMLElement) => Promise<void>;
      };
    };
  }
}

export { };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We collect information that you provide directly to us, including your name, email address, and phone number for WhatsApp notifications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We use the information we collect to provide, maintain, and improve our services, including sending WhatsApp reminders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Data Security</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Subscription and Cancellation Policy</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            You may cancel your subscription at any time through your account settings.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Cancellations take effect at the end of your current billing cycle.</li>
            <li>No partial refunds are offered for the remainder of the billing period.</li>
            <li>If you face any issues canceling, contact us at <a href="mailto:support@remindme.me" className="text-primary hover:underline">support@remindme.me</a>.</li>
          </ul>
          <p className="text-slate-700 dark:text-slate-300 mt-4">
            We reserve the right to cancel or suspend your account in cases of misuse or violation of our terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Shipping and Delivery Policy</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Thank you for subscribing to our platform. As a digital service, we do not ship any physical goods. All services are delivered online through our web-based platform.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Service Delivery</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Access to your subscription is granted <strong>immediately upon successful payment</strong>.</li>
                <li>Once your account is active, you can start scheduling and sending bulk messages to your customers.</li>
                <li>All features — including custom templates, analytics, and scheduling tools — are available through your dashboard.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Delivery Failures</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                In rare cases, service access may be delayed due to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Payment verification issues</li>
                <li>System errors</li>
                <li>Maintenance or server downtime</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-3">
                If you face any issues accessing your service, please contact our support team at <a href="mailto:support@remindme.me" className="text-primary hover:underline">support@remindme.me</a>, and we'll resolve it promptly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">No Physical Shipping</h3>
              <p className="text-slate-700 dark:text-slate-300">
                This is a digital-only product. We do not deliver any physical goods, and no shipping is required.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mt-3">
                Thank you for choosing RemindMe.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 
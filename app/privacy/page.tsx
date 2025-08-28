export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We collect information that you provide directly to us when you sign up or use AI Shorts,
            including your name, email address, payment details (for subscriptions), and any prompts or content
            you provide when generating videos. We may also collect usage data to help us improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We use the information we collect to operate and improve AI Shorts, personalize your experience,
            process transactions, deliver generated content, and provide customer support.
            We may also use anonymized data for research, analytics, and service enhancements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Data Security</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We implement industry-standard security measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. Subscription and Cancellation Policy</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            You may cancel your subscription at any time through your account settings.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Cancellations take effect at the end of your current billing cycle.</li>
            <li>No partial refunds are provided for unused subscription periods.</li>
            <li>If you face any issues canceling, contact us at <a href="mailto:debasishbarai.developer@gmail.com" className="text-primary hover:underline">debasishbarai.developer@gmail.com</a>.</li>
          </ul>
          <p className="text-slate-700 dark:text-slate-300 mt-4">
            We reserve the right to suspend or terminate accounts that violate our Terms of Use or misuse the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Service Delivery Policy</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            AI Shorts is a fully digital service. We do not ship physical goods. All features and content are delivered
            online through our platform immediately after successful subscription or purchase.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Service Access</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Access to your account is granted <strong>immediately upon successful payment</strong>.</li>
                <li>Once active, you can start generating AI-powered short videos via your dashboard.</li>
                <li>Features such as customization, downloads, and editing tools are available within your account.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Delivery Issues</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                In rare cases, access to services may be delayed due to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Payment verification issues</li>
                <li>Temporary technical problems</li>
                <li>Scheduled maintenance or server downtime</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-3">
                If you face any access issues, please contact us at <a href="mailto:debasishbarai.developer@gmail.com" className="text-primary hover:underline">debasishbarai.developer@gmail.com</a>, and we will resolve it promptly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">No Physical Shipping</h3>
              <p className="text-slate-700 dark:text-slate-300">
                AI Shorts is a digital-only platform. No physical shipping or delivery is required.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mt-3">
                Thank you for choosing AI Shorts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


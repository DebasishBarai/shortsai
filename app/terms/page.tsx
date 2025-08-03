export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700 dark:text-slate-300">
            By accessing and using RemindMe, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Use License</h2>
          <p className="text-slate-700 dark:text-slate-300">
            Permission is granted to temporarily use RemindMe for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Service Description</h2>
          <p className="text-slate-700 dark:text-slate-300">
            RemindMe provides WhatsApp-based reminder services. We reserve the right to modify or discontinue the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>You are responsible for maintaining the confidentiality of your account information.</li>
            <li>You agree to use the service in compliance with all applicable laws and regulations.</li>
            <li>You will not use the service for any illegal or unauthorized purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Intellectual Property</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The service and its original content, features, and functionality are owned by RemindMe and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">6. Limitation of Liability</h2>
          <p className="text-slate-700 dark:text-slate-300">
            In no event shall RemindMe, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Changes to Terms</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Use on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">8. Contact Information</h2>
          <p className="text-slate-700 dark:text-slate-300">
            If you have any questions about these Terms, please contact us at <a href="mailto:support@remindme.me" className="text-primary hover:underline">support@remindme.me</a>.
          </p>
        </section>
      </div>
    </div>
  );
} 
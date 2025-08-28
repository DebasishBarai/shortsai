export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700 dark:text-slate-300">
            By accessing and using AI Shorts, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and all applicable laws and regulations.
            If you do not agree with these terms, you may not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">2. Use License</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use AI Shorts
            for personal or business purposes, strictly in accordance with these Terms.
            You may not resell, distribute, or exploit the service or generated content in ways that violate applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">3. Service Description</h2>
          <p className="text-slate-700 dark:text-slate-300">
            AI Shorts provides an AI-powered platform that allows users to generate short-form videos
            based on text prompts and other inputs. We may add, remove, or modify features at any time without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>You are responsible for any content you upload, generate, or share using AI Shorts.</li>
            <li>You agree not to use the platform to create or distribute harmful, illegal, or infringing content.</li>
            <li>You must comply with all applicable copyright, trademark, and intellectual property laws.</li>
            <li>You are responsible for safeguarding your account credentials and any activity under your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">5. Intellectual Property</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The AI Shorts platform, its software, algorithms, branding, and all associated intellectual property
            are owned by AI Shorts and protected by applicable copyright, trademark, and other IP laws.
            Users retain rights to the videos they generate, but grant AI Shorts a limited license to store and process
            content for the purposes of providing the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">6. Limitation of Liability</h2>
          <p className="text-slate-700 dark:text-slate-300">
            AI Shorts and its affiliates, employees, and partners are not liable for any indirect, incidental, special,
            consequential, or punitive damages, including but not limited to loss of data, revenue, profits, or
            business opportunities resulting from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">7. Changes to Terms</h2>
          <p className="text-slate-700 dark:text-slate-300">
            We reserve the right to update or modify these Terms of Use at any time.
            Any changes will be posted on this page, and continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-4">8. Contact Information</h2>
          <p className="text-slate-700 dark:text-slate-300">
            If you have any questions regarding these Terms of Use, please contact us at
            <a href="mailto:debasishbarai.developer@gmail.com" className="text-primary hover:underline"> debasishbarai.developer@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}


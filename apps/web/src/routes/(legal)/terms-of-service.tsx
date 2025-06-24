import { Button } from "@novelty/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(legal)/terms-of-service")({
  component: TermsOfService,
});

function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">
          Terms of Service
        </h1>
        <p className="text-slate-400 mb-8">Last Updated: June 23, 2025</p>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-8">
          <h2 className="mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing or using our services, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do
            not agree with any of these terms, you are prohibited from using or
            accessing this service.
          </p>

          <h2 className="mb-4">2. User Responsibilities</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You must:
          </p>
          <ul>
            <li>Keep your password secure and confidential</li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
            <li>Use the service in compliance with all applicable laws</li>
          </ul>

          <h2 className="mb-4">3. Privacy Policy</h2>
          <p className="mb-6">
            Your use of our services is governed by our Privacy Policy, which
            describes how we collect, use, and disclose your personal
            information. By using our services, you consent to the collection
            and use of information in accordance with the Privacy Policy.
          </p>

          <h2 className="mb-4">4. Limitation of Liability</h2>
          <p className="mb-6">
            To the maximum extent permitted by applicable law, we shall not be
            liable for any indirect, incidental, special, consequential or
            punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill,
            or other intangible losses.
          </p>

          <div className="mt-12">
            <Link to="/">
              <Button
                className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
                          shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                          active:scale-95 active:bg-indigo-700 rounded-sm"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

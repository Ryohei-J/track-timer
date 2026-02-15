import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - PomotimerX",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-text-primary p-8 font-sans flex justify-center">
      <article className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-accent hover:text-accent/85 transition-colors text-sm"
        >
          &larr; Back to PomotimerX
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-8">Privacy Policy</h1>
        <p className="text-text-secondary text-sm mb-8">
          Last updated: February 16, 2026
        </p>

        <section className="space-y-6 text-text-secondary leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              1. Overview
            </h2>
            <p>
              PomotimerX (&quot;the Service&quot;) is a browser-based Pomodoro
              timer with YouTube music playback. We are committed to
              transparency about how data is handled when you use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              2. Information We Collect
            </h2>
            <p>
              <strong>We do not collect any personal information.</strong> The
              Service does not require account creation, login, or any form of
              registration. There is no server-side database.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              3. Local Storage
            </h2>
            <p>
              The Service uses your browser&apos;s localStorage to save your
              preferences (timer durations, YouTube URLs, and theme settings)
              locally on your device. This data is never transmitted to any
              server. You can clear this data at any time through your
              browser&apos;s settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              4. Third-Party Services
            </h2>

            <h3 className="font-semibold text-text-primary mt-3 mb-1">
              YouTube API
            </h3>
            <p>
              The Service embeds YouTube videos using the YouTube IFrame Player
              API. When you load a YouTube video, Google may collect data such as
              cookies, IP addresses, and usage information in accordance with
              their privacy policies. By using the Service, you agree to be
              bound by the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/85 underline"
              >
                YouTube Terms of Service
              </a>{" "}
              and the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/85 underline"
              >
                Google Privacy Policy
              </a>
              .
            </p>

            <h3 className="font-semibold text-text-primary mt-3 mb-1">
              Hosting
            </h3>
            <p>
              The Service is hosted on Vercel. Vercel may collect standard
              server access logs (IP addresses, browser type, timestamps) as
              part of its infrastructure. Please refer to{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/85 underline"
              >
                Vercel&apos;s Privacy Policy
              </a>{" "}
              for details.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              5. Cookies
            </h2>
            <p>
              The Service itself does not set any cookies. However, embedded
              YouTube content may set cookies via Google&apos;s services. Please
              refer to the Google Privacy Policy linked above for details.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              6. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated revision date.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}

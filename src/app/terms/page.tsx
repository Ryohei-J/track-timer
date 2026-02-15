import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - PomotimerX",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background text-text-primary p-8 font-sans flex justify-center">
      <article className="w-full max-w-2xl">
        <Link
          href="/"
          className="text-accent hover:text-accent/85 transition-colors text-sm"
        >
          &larr; Back to PomotimerX
        </Link>

        <h1 className="text-3xl font-bold mt-6 mb-8">Terms of Service</h1>
        <p className="text-text-secondary text-sm mb-8">
          Last updated: February 16, 2026
        </p>

        <section className="space-y-6 text-text-secondary leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using PomotimerX (&quot;the Service&quot;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use the Service.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              2. Description of Service
            </h2>
            <p>
              PomotimerX is a free, browser-based Pomodoro timer application that
              allows users to play YouTube videos alongside timed work and break
              sessions. The Service is provided as-is for personal,
              non-commercial use.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              3. YouTube Content
            </h2>
            <p>
              The Service uses the YouTube IFrame Player API to embed YouTube
              videos. All YouTube content is subject to the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/85 underline"
              >
                YouTube Terms of Service
              </a>
              . You are solely responsible for the YouTube URLs you enter and the
              content you choose to play. The Service does not host, download, or
              store any video or audio content.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              4. Disclaimer of Warranties
            </h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL POMOTIMERX OR ITS OPERATOR BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
              OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              6. Modifications to the Service
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the
              Service (or any part thereof) at any time, with or without notice.
              We shall not be liable to you or any third party for any such
              modification, suspension, or discontinuation.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              7. Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the Service after any changes constitutes your acceptance of
              the revised terms.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}

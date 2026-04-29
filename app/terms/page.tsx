import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — Rosarium Today",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 font-body text-bone">
      <Link
        href="/"
        className="mb-8 inline-block font-ui text-sm text-muted transition-colors hover:text-bone"
      >
        ← Back
      </Link>

      <h1 className="mb-3 font-display text-4xl font-normal">Terms of Use</h1>
      <p className="mb-12 font-ui text-xs text-muted">Effective: January 1, 2026</p>

      <div className="space-y-10 leading-relaxed text-muted">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Free to use
          </h2>
          <p>
            Rosarium Today is free to use for personal and spiritual purposes.
            No account, payment, or license is required. No conditions are
            placed on your use of the app for personal prayer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            No warranties
          </h2>
          <p>
            This application is provided &ldquo;as is&rdquo; without warranties
            of any kind, express or implied. We make no guarantee of
            availability, accuracy, or fitness for any particular purpose.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Open source
          </h2>
          <p>
            The source code is licensed under the MIT License and is available
            on{" "}
            <a
              href="https://github.com/Brendovisk/rosarium-today"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Content
          </h2>
          <p>
            Prayer texts are from the traditional Catholic Rosary and are in the
            public domain. Audio recordings are original works; all rights
            reserved by their respective contributors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Changes
          </h2>
          <p>
            These terms may be updated at any time without prior notice.
            Continued use of the application after changes constitutes
            acceptance of the revised terms.
          </p>
        </section>
      </div>
    </main>
  );
}

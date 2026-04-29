import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Rosarium Today",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 font-body text-bone">
      <Link
        href="/"
        className="mb-8 inline-block font-ui text-sm text-muted transition-colors hover:text-bone"
      >
        ← Back
      </Link>

      <h1 className="mb-3 font-display text-4xl font-normal">Privacy Policy</h1>
      <p className="mb-12 font-ui text-xs text-muted">Effective: January 1, 2026</p>

      <div className="space-y-10 leading-relaxed text-muted">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            No data collected.
          </h2>
          <p>
            Rosarium Today does not collect, store, transmit, or track any
            personal data of any kind. There are no accounts, no sign-ups, no
            analytics, no third-party scripts, and no advertising.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Local storage only
          </h2>
          <p>
            Your prayer progress, streak, and UI settings are saved exclusively
            in your browser&apos;s local storage and a single functional cookie.
            This data never leaves your device and is never transmitted to any
            server.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            No third parties
          </h2>
          <p>
            No analytics platforms, advertising networks, tracking pixels, or
            external services of any kind are embedded in this application. All
            audio files and assets are served from the same domain.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Open source
          </h2>
          <p>
            The full source code is publicly available on{" "}
            <a
              href="https://github.com/Brendovisk/rosarium-today"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              GitHub
            </a>
            . You can verify these claims directly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            Contact
          </h2>
          <p>
            Questions or concerns? Open an issue on{" "}
            <a
              href="https://github.com/Brendovisk/rosarium-today/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

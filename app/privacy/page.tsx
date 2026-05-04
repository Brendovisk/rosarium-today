import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: t("pageTitle") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 font-body text-bone">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 font-ui text-sm text-muted transition-colors hover:text-bone"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {t("back")}
      </Link>

      <h1 className="mb-3 font-display text-4xl font-normal">{t("heading")}</h1>
      <p className="mb-12 font-ui text-xs text-muted">{t("effectiveDate")}</p>

      <div className="space-y-10 leading-relaxed text-muted">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("noDataTitle")}
          </h2>
          <p>{t("noDataBody")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("localStorageTitle")}
          </h2>
          <p>{t("localStorageBody")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("noThirdPartiesTitle")}
          </h2>
          <p>{t("noThirdPartiesBody")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("openSourceTitle")}
          </h2>
          <p>
            {t.rich("openSourceBody", {
              link: (chunks) => (
                <a
                  href="https://github.com/Brendovisk/rosarium-today"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("contactTitle")}
          </h2>
          <p>
            {t.rich("contactBody", {
              link: (chunks) => (
                <a
                  href="https://github.com/Brendovisk/rosarium-today/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </div>
    </main>
  );
}

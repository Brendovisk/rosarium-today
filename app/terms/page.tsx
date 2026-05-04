import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return { title: t("pageTitle") };
}

export default async function TermsPage() {
  const t = await getTranslations("terms");

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
            {t("freeToUseTitle")}
          </h2>
          <p>{t("freeToUseBody")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("noWarrantiesTitle")}
          </h2>
          <p>{t("noWarrantiesBody")}</p>
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
            {t("contentTitle")}
          </h2>
          <p>{t("contentBody")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-normal text-bone">
            {t("changesTitle")}
          </h2>
          <p>{t("changesBody")}</p>
        </section>
      </div>
    </main>
  );
}

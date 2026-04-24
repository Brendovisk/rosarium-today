import { useTranslations } from "next-intl";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Rosarium Today
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-tight text-bone sm:text-5xl">
              Pray with peace
            </h1>
          </div>

          <ThemeSwitcher />
        </header>

        <section className="max-w-2xl rounded-3xl border border-line bg-ink-2/70 p-8 backdrop-blur-sm">
          <p className="text-lg leading-relaxed text-muted">
            {t("description")}
          </p>
        </section>
      </div>
    </main>
  );
}

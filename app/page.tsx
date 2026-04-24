import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Rosarium Today
        </h1>
        <p>{t("description")}</p>
      </div>
    </main>
  );
}

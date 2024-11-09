import Image from "next/image";
import { useLocale } from "@/hooks";
import { CustomFooter } from "@/components/CustomFooter";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";
import LocaleToggle from "./widgets/locale-toggle";
import ThemeToggle from "./widgets/theme-toggle";

const repo = "https://github.com/three-dog-cloud/docs/tree/main";

export default {
  docsRepositoryBase: repo,
  project: {
    link: repo,
  },
  head: () => {
    const title = useLocale().t("siteTitle");
    const description = "Documentation for Three Dogs";
    const { asPath } = useRouter();
    const { title: pageTitle } = useConfig();
    return (
      <>
        <title>{asPath !== "/" ? `${pageTitle} - ${title}` : title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={repo} />
        <link
          rel="icon"
          sizes="20"
          href="/logo.jpg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
      </>
    );
  },
  logoLink: true,
  logo: () => {
    const { t } = useLocale();

    return (
      <div className="flex items-center justify-center font-bold text-3xl space-x-2">
        <Image
          src="/logo.jpg"
          width={40}
          height={40}
          alt={t("siteTitle")}
          className="rounded-full object-cover md:object-scale-down"
        />
        <span className="text-xl">{t("siteTitle")}</span>
      </div>
    );
  },
  footer: {
    component: () => <CustomFooter />,
  },
  feedback: {
    content: () => {
      const { t } = useLocale();
      return t("feedback");
    },
  },
  editLink: {
    content: () => {
      const { t } = useLocale();
      return t("editLink");
    },
  },
  search: {
    placeholder: () => {
      const { t } = useLocale();
      return t("search.placeholder");
    },
    error: () => {
      const { t } = useLocale();
      return t("search.error");
    },
    emptyResult: () => {
      const { t } = useLocale();
      return (
        <span className="block select-none p-8 text-center text-sm text-gray-400">
          {t("search.empty")}
        </span>
      );
    },
  },
  themeSwitch: {
    component: () => <></>,
  },
  i18n: [],
  navbar: {
    extraContent: () => {
      return (
        <>
          <LocaleToggle className="max-md:hidden" />
          <ThemeToggle className="max-md:hidden" />
        </>
      );
    },
  },
  sidebar: {
    toggleButton: true,
    defaultMenuCollapseLevel: 1,
  },
  nextThemes: {
    defaultTheme: "system",
  },
  toc: {
    backToTop: true,
  },
  gitTimestamp: ({ timestamp }) => {
    const { t, currentLocale } = useLocale();
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    };

    const lang = currentLocale === "zh" ? "zh-CN" : "en-US";

    return `${t("lastTimes")} ${date.toLocaleDateString(lang, options)}`;
  },
} satisfies DocsThemeConfig;

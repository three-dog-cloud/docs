import createWithNextra from "nextra";

const withNextra = createWithNextra({
  theme: "nextra-theme-docs",
  themeConfig: "./src/theme.config.tsx",
  defaultShowCopyCode: true,
});

/**
 * @type {import("next").NextConfig}
 */
export default withNextra({
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  distDir: "./out",
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
  },
  redirects: () => [
    {
      source: "/",
      destination: "/zh",
      permanent: true,
    },
  ],
});

import createWithNextra from "nextra";

const withNextra = createWithNextra({
  defaultShowCopyCode: true,
  contentDirBasePath: "/",
  codeHighlight: true,
});

/**
 * @type {import("next").NextConfig}
 */
export default withNextra({
  agentRules: false,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
});

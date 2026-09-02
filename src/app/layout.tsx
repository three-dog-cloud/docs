import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Head } from "nextra/components";
import "nextra-theme-docs/style.css";
import "../styles.css";

export const metadata: Metadata = {
  title: {
    default: "三狗云服务文档",
    template: "%s - 三狗云服务文档",
  },
  description: "三狗云服务用户、商户与开发者文档。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="🐕" />
      <body>{children}</body>
    </html>
  );
}

import { notFound } from "next/navigation";
import { getPageMap } from "nextra/page-map";
import {
  Footer,
  LastUpdated,
  Layout,
  Navbar,
} from "nextra-theme-docs";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const locales = ["zh", "en"] as const;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isZh = lang === "zh";

  return {
    title: {
      default: isZh ? "三狗云服务文档" : "TD Cloud Docs",
      template: isZh ? "%s - 三狗云服务文档" : "%s - TD Cloud Docs",
    },
    description: isZh
      ? "三狗云服务用户、商户与开发者文档。"
      : "Documentation for TD Cloud users, merchants, and developers.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as (typeof locales)[number])) {
    notFound();
  }

  const isZh = lang === "zh";
  const navbar = (
    <Navbar
      className="site-navbar"
      logo={
        <span className="site-logo">
          <img className="site-logo-image" src="/logo.jpg" width="40" height="40" alt="" />
          <strong>{isZh ? "三狗" : "TD Cloud"}</strong>
        </span>
      }
      logoLink={`/${lang}/`}
      projectLink="https://github.com/three-dog-cloud/docs"
    >
      <a
        className="website-link"
        href="https://tdcloud.cc"
        target="_blank"
        rel="noopener noreferrer"
        title={isZh ? "打开三狗云官网（新标签页）" : "Open TD Cloud website (new tab)"}
      >
        {isZh ? "官网" : "Website"} <span aria-hidden="true">↗</span>
      </a>
      <span className="locale-links" aria-label={isZh ? "切换语言" : "Switch language"}>
        <a aria-current={isZh ? "page" : undefined} href="/zh/">中文</a>
        <span aria-hidden="true"> / </span>
        <a aria-current={!isZh ? "page" : undefined} href="/en/">English</a>
      </span>
    </Navbar>
  );

  return (
    <Layout
      navbar={navbar}
      footer={
        <Footer>
          <div className="site-footer">
            <span>
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>
              {" · "}© {new Date().getFullYear()}{" "}
              <a href="https://github.com/three-dog-cloud">{isZh ? "三狗" : "TD Cloud"}</a>
            </span>
            <span className="site-footer-locales">
              <a aria-current={isZh ? "page" : undefined} href="/zh/">中文</a>
              <span aria-hidden="true"> / </span>
              <a aria-current={!isZh ? "page" : undefined} href="/en/">English</a>
            </span>
          </div>
        </Footer>
      }
      pageMap={await getPageMap(`/${lang}`)}
      search={null}
      docsRepositoryBase="https://github.com/three-dog-cloud/docs/tree/main"
      editLink={isZh ? "在 GitHub 上编辑此页" : "Edit this page on GitHub"}
      feedback={{
        content: isZh ? "有疑问？提交反馈" : "Question? Give us feedback",
      }}
      lastUpdated={
        <LastUpdated locale={isZh ? "zh-CN" : "en"}>
          {isZh ? "最后更新于" : "Last updated on"}
        </LastUpdated>
      }
      sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
      toc={{
        backToTop: isZh ? "返回顶部" : "Back to top",
        title: isZh ? "本页内容" : "On This Page",
      }}
      themeSwitch={{
        dark: isZh ? "深色" : "Dark",
        light: isZh ? "浅色" : "Light",
        system: isZh ? "跟随系统" : "System",
      }}
      nextThemes={{ defaultTheme: "system" }}
    >
      {children}
    </Layout>
  );
}

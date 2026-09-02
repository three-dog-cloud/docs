import { generateStaticParamsFor, importPage } from "nextra/pages";
import type { FC } from "react";
import { useMDXComponents as getMDXComponents } from "../../../../mdx-components";

const generateAllStaticParams = generateStaticParamsFor("mdxPath");

export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  const allParams = await generateAllStaticParams();

  return allParams
    .filter(({ mdxPath }) => mdxPath[0] === params.lang)
    .map(({ mdxPath }) => ({ mdxPath: mdxPath.slice(1) }));
}

type PageProps = Readonly<{
  params: Promise<{
    lang: string;
    mdxPath?: string[];
  }>;
}>;

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { metadata } = await importPage([
    params.lang,
    ...(params.mdxPath ?? []),
  ]);

  if (!params.mdxPath?.length) {
    return {
      ...metadata,
      title: {
        absolute: params.lang === "zh" ? "三狗云服务文档" : "TD Cloud Docs",
      },
    };
  }

  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

const Page: FC<PageProps> = async (props) => {
  const params = await props.params;
  const result = await importPage([
    params.lang,
    ...(params.mdxPath ?? []),
  ]);
  const { default: MDXContent, toc, metadata, sourceCode } = result;

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default Page;

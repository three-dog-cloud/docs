export default function RootPage() {
  return (
    <main className="redirect-page">
      <meta httpEquiv="refresh" content="0; url=/zh/" />
      <script
        dangerouslySetInnerHTML={{
          __html: "window.location.replace('/zh/');",
        }}
      />
      <p>
        正在进入中文文档。若未自动跳转，请访问
        <a href="/zh/">中文文档首页</a>。
      </p>
    </main>
  );
}

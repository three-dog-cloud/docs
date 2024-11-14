import zh_meta from "../../../src/pages/zh/_meta.ts";
import zh_currency_meta from "../../../src/pages/zh/currency/_meta.ts";
import zh_faqs_meta from "../../../src/pages/zh/faqs/_meta.ts";
export const pageMap = [{
  data: zh_meta
}, {
  name: "change-log",
  route: "/zh/change-log",
  frontMatter: {
    "sidebarTitle": "Change Log"
  }
}, {
  name: "currency",
  route: "/zh/currency",
  children: [{
    data: zh_currency_meta
  }, {
    name: "handling_charge",
    route: "/zh/currency/handling_charge",
    frontMatter: {
      "sidebarTitle": "Handling Charge"
    }
  }]
}, {
  name: "currency",
  route: "/zh/currency",
  frontMatter: {
    "sidebarTitle": "Currency"
  }
}, {
  name: "faqs",
  route: "/zh/faqs",
  children: [{
    data: zh_faqs_meta
  }, {
    name: "404",
    route: "/zh/faqs/404",
    frontMatter: {
      "sidebarTitle": "404"
    }
  }]
}, {
  name: "index",
  route: "/zh",
  frontMatter: {
    "title": "三狗文档"
  }
}, {
  name: "welcome",
  route: "/zh/welcome",
  frontMatter: {
    "sidebarTitle": "Welcome"
  }
}];
import en_meta from "../../../src/pages/en/_meta.ts";
import en_currency_meta from "../../../src/pages/en/currency/_meta.ts";
import en_faqs_meta from "../../../src/pages/en/faqs/_meta.ts";
export const pageMap = [{
  data: en_meta
}, {
  name: "change-log",
  route: "/en/change-log",
  frontMatter: {
    "sidebarTitle": "Change Log"
  }
}, {
  name: "currency",
  route: "/en/currency",
  children: [{
    data: en_currency_meta
  }, {
    name: "handling_charge",
    route: "/en/currency/handling_charge",
    frontMatter: {
      "sidebarTitle": "Handling Charge"
    }
  }]
}, {
  name: "currency",
  route: "/en/currency",
  frontMatter: {
    "sidebarTitle": "Currency"
  }
}, {
  name: "faqs",
  route: "/en/faqs",
  children: [{
    data: en_faqs_meta
  }, {
    name: "404",
    route: "/en/faqs/404",
    frontMatter: {
      "sidebarTitle": "404"
    }
  }]
}, {
  name: "index",
  route: "/en",
  frontMatter: {
    "title": "TDCloud Document"
  }
}, {
  name: "welcome",
  route: "/en/welcome",
  frontMatter: {
    "sidebarTitle": "Welcome"
  }
}];
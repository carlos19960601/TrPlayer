import en from "@/i18n/en.json";
import zh_CN from "@/i18n/zh-CN.json";
import * as i18n from "i18next";
// import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: en,
  },
  "zh-CN": {
    translation: zh_CN,
  },
}

i18n
  // .use(initReactI18next)
  .init({
    resources,
    lng: "zh-CN",
    supportedLngs: ["en", "zh-CN"],
    fallbackLng: "en",
  })

export default i18n
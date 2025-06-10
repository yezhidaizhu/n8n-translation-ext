import locales from "@/i18n";
import { MsgType, onVueReady, postMessage } from "./utils";

onVueReady(async () => {
  const { langCode = "en" } = await chrome.storage.local.get(["langCode"]);

  if (langCode == "en" || !langCode) return;

  postMessage(MsgType._N8N_LANG_MERGE_LOCAL_MESSAGE, {
    [langCode]: (locales as any)[langCode]
  });

  postMessage(MsgType._N8N_LANG_CHANGE_LANG, { locale: langCode })
})




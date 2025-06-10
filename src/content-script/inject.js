function injectedCheckVueI18n() {
  const symbolKey = "__VUE_I18N_SYMBOL__"
  const appSelector = "#app"
  const maxWait = 10000
  const interval = 200

  const start = Date.now()

  function check() {
    const appRoot = document.querySelector(appSelector)
    const app = appRoot && appRoot.__vue_app__
    const hasI18n = app && app[symbolKey]

    if (hasI18n) {
      window.postMessage({ type: "__VUE_I18N_READY__" }, "*")
    } else if (Date.now() - start < maxWait) {
      setTimeout(check, interval)
    } else {
      console.warn("Timeout waiting for Vue + i18n")
    }
  }

  check()
}

if (document.querySelector("#n8n-app")) {
  injectedCheckVueI18n()
}

const MsgType = {
  _N8N_LANG_MERGE_LOCAL_MESSAGE: "_N8N_LANG_MERGE_LOCAL_MESSAGE",
  _N8N_LANG_CHANGE_LANG: "_N8N_LANG_CHANGE_LANG",
}
window.addEventListener("message", function (event) {
  if (event.source !== window) return
  const { type, payload } = event?.data || {}

  // 检查 i18n
  const I18N_SYMBOL =
    document.querySelector("#app")?.__vue_app__?.__VUE_I18N_SYMBOL__
  const app = document.querySelector("#app")?.__vue_app__?._context
  const i18n = app?.provides?.[I18N_SYMBOL]?.global
  if (!i18n) {
    // console.error(`[n8n lang] i18n context is undefine`)
    return
  }

  // 加入语言
  if (type === MsgType._N8N_LANG_MERGE_LOCAL_MESSAGE) {
    const localeMessages = payload
    if (!localeMessages) {
      console.error(
        `[n8n lang][${MsgType._N8N_LANG_MERGE_LOCAL_MESSAGE}] payload is undefine`,
      )
      return
    }

    Object.keys(localeMessages)?.map((locale) => {
      i18n?.mergeLocaleMessage(locale, localeMessages[locale])
    })

    // i18n?.mergeLocaleMessage(event.data?.payload);
  }

  // 设置语言
  if (type === MsgType._N8N_LANG_CHANGE_LANG) {
    // console.warn(`switch lang:${payload?.locale}`)
    i18n.locale = payload?.locale
    forceLanguageUpdate()
  }
})

function forceLanguageUpdate() {
  const app = document.querySelector("#app")?.__vue_app__
  if (!app) return

  // 拿到 i18n 实例
  // const i18nSymbol = Object.getOwnPropertySymbols(app._context.provides).find(s => s.toString().includes('I18N'));
  // const i18n = app._context.provides[i18nSymbol];

  // if (!i18n) return;

  // // 切换语言
  // i18n.locale.value = 'fr';

  // 遍历刷新所有组件（触发 reactive 更新）
  const instance = app._instance
  const queue = [instance]

  while (queue.length > 0) {
    const current = queue.pop()
    if (!current) continue

    // 强制更新（本质是 effect.run()）
    current?.update?.()

    // 收集子组件
    if (current.subTree?.component) {
      queue.push(current.subTree.component)
    }

    if (Array.isArray(current.subTree?.children)) {
      for (const child of current.subTree.children) {
        if (child?.component) queue.push(child.component)
      }
    }
  }
}

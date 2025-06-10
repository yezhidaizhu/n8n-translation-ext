export function onVueReady(callback: () => any) {
  // 监听从页面中发来的消息
  window.addEventListener('message', function handler(event) {
    if (event.source !== window) return;
    if (event.data?.type === '__VUE_I18N_READY__') {
      window.removeEventListener('message', handler);
      callback();
    }
  });

  // 注入监听
  const src = chrome.runtime.getURL("src/content-script/inject.js");
  const script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  document.documentElement.appendChild(script);
  script.remove();
}


export enum MsgType {
  _N8N_LANG_MERGE_LOCAL_MESSAGE = "_N8N_LANG_MERGE_LOCAL_MESSAGE",
  _N8N_LANG_CHANGE_LANG = "_N8N_LANG_CHANGE_LANG",
}

export function postMessage(msgType: MsgType, payload: { [key: string]: any }) {
  window.postMessage({
    type: msgType,
    payload: payload
  }, '*');
}
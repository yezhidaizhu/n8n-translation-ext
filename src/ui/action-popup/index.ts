import { createApp } from "vue"
import App from "./app.vue"
import ui from "@nuxt/ui/vue-plugin"
import "./index.css"

const app = createApp(App).use(ui)

app.mount("#app")

export default app

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

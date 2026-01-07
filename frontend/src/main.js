import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// ✅ Thêm Toast notification
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// ✅ CSS chung (Tailwind)
import "./assets/main.css";

const app = createApp(App);

// Pinia + Router
app.use(router);
app.use(createPinia());

// ✅ Cấu hình Toast
app.use(Toast, {
  position: "top-right",
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: "Vue-Toastification__fade",
});

// Mount app
app.mount("#app");

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar + Footer chỉ hiển thị ở phần public -->
    <Navbar v-if="!isAdminLayout && !isEmployerLayout" />

    <main class="flex-grow">
      <RouterView />
    </main>

    <Footer v-if="!isAdminLayout && !isEmployerLayout" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();

// Ẩn Navbar + Footer khi đang ở layout Nhà tuyển dụng
const isEmployerLayout = computed(() => {
  return route.path.startsWith("/employer/dashboard")
    || route.path.startsWith("/employer/post-job")
    || route.path.startsWith("/employer/jobs")
    || route.path.startsWith("/employer/applicants")
    || route.path.startsWith("/employer/profile")
    || route.path.startsWith("/employer/change-password")
    || route.path.startsWith("/employer/talent")
    || route.path.startsWith("/employer/saved-candidates")
    || route.path.startsWith("/employer/notifications") 
    || route.path.startsWith("/employer/cv");           
});

// Ẩn Navbar + Footer khi đang ở layout Admin
const isAdminLayout = computed(() => {
  return route.path.startsWith("/admin");
});
</script>

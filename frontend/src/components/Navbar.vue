<template>
  <nav v-if="!isAdminPage" class="bg-[#0a0f24] text-white py-3 shadow-lg fixed w-full top-0 z-50">
    <div class="container mx-auto flex items-center justify-between px-6">

      <RouterLink to="/"
        class="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-200">
        <img src="/logo.png" alt="Logo" class="w-10 h-10 rounded-full ring-2 ring-indigo-500" />
        <span class="font-extrabold text-xl md:text-2xl tracking-wide">JobLink</span>
      </RouterLink>

      <div v-if="isEmployerLoggedInOnPublic" class="flex items-center space-x-4">
        <RouterLink to="/employer/dashboard"
          class="border border-white px-4 py-1.5 rounded-lg hover:bg-white hover:text-[#0a0f24] transition-all duration-200 font-medium">
          Dành cho Nhà tuyển dụng
        </RouterLink>
      </div>

      <div v-else class="flex-1 flex items-center justify-between md:justify-center space-x-3">

        <div v-if="!isEmployerPage" class="hidden md:flex items-center space-x-8 font-medium mx-auto">
          <RouterLink to="/" class="hover:text-indigo-400 transition-colors duration-200 text-lg">
            Trang chủ
          </RouterLink>
          <RouterLink to="/jobs" class="hover:text-indigo-400 transition-colors duration-200 text-lg">
            Tìm việc
          </RouterLink>
          <RouterLink to="/companies" class="hover:text-indigo-400 transition-colors duration-200 text-lg">
            Công ty
          </RouterLink>
        </div>

        <div class="flex items-center space-x-3 ml-auto">

          <template v-if="isEmployerPage">
            <template v-if="isLoggedIn">
              <RouterLink to="/employer/dashboard"
                class="font-semibold text-indigo-300 hover:text-indigo-400 transition">
                {{ user?.name }}
              </RouterLink>
              <button @click="logout" :disabled="isLoggingOut" class="border border-white text-white hover:bg-white hover:text-[#0a0f24] 
                       px-4 py-1.5 rounded-lg font-medium transition-all duration-200 
                       disabled:opacity-60">
                {{ isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất" }}
              </button>
            </template>

            <template v-else>
              <RouterLink to="/employer/register"
                class="border border-white px-4 py-1.5 rounded-lg hover:bg-white hover:text-[#0a0f24] transition-all duration-200 font-medium">
                Đăng ký
              </RouterLink>
              <RouterLink to="/employer/login"
                class="bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-500 transition-all duration-200 font-medium">
                Đăng nhập
              </RouterLink>
              <RouterLink to="/"
                class="border border-white px-4 py-1.5 rounded-lg hover:bg-white hover:text-[#0a0f24] transition-all duration-200 font-medium">
                Dành cho Ứng viên
              </RouterLink>
            </template>
          </template>

          <template v-else>
            <template v-if="isLoggedIn && user?.role === 'candidate'">

              <RouterLink to="/candidate/dashboard"
                class="font-semibold text-indigo-300 hover:text-indigo-400 transition">
                {{ user?.name }}
              </RouterLink>

              <div v-if="showNotificationBell" class="relative">
                <div @click.stop="toggleNotifications" class="relative p-2 cursor-pointer">
                  <i class="fa-solid fa-bell text-white text-lg hover:text-indigo-300 transition"></i>
                  <span v-if="notificationCount > 0"
                    class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {{ notificationCount }}
                  </span>
                </div>

                <div v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
                  <div class="p-3 font-bold border-b bg-gray-50 flex justify-between items-center text-sm">
                    <span>Trung tâm thông báo</span>
                    <button @click.stop="markAllAsRead" class="text-[10px] text-indigo-600 hover:underline">Đọc tất
                      cả</button>
                  </div>

                  <div v-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm">
                    Không có thông báo mới
                  </div>

                  <ul v-else class="max-h-80 overflow-y-auto">
                    <li v-for="n in notifications" :key="n._id" @click="handleClickNoti(n)"
                      class="p-3 border-b hover:bg-indigo-50 cursor-pointer transition-colors relative"
                      :class="{ 'bg-blue-50/40': !n.isRead }">

                      <div v-if="!n.isRead"
                        class="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>

                      <div class="text-xs font-bold mb-1" :class="n.isRead ? 'text-gray-500' : 'text-slate-900'">
                        {{ n.message }}
                      </div>
                      <div class="text-[10px] text-gray-400">{{ formatDate(n.createdAt) }}</div>
                    </li>
                  </ul>

                  <RouterLink to="/candidate/notifications" @click="showNotifications = false"
                    class="block p-2 text-center text-[11px] font-bold text-indigo-600 hover:bg-gray-50 border-t uppercase">
                    Xem tất cả
                  </RouterLink>
                </div>
              </div>

              <button @click="logout" :disabled="isLoggingOut" class="border border-white text-white hover:bg-white hover:text-[#0a0f24] 
                       px-4 py-1.5 rounded-lg font-medium transition-all duration-200 
                       disabled:opacity-60">
                {{ isLoggingOut ? "Đăng xuất" : "Đăng xuất" }}
              </button>
            </template>

            <template v-else>
              <RouterLink to="/register"
                class="border border-white px-4 py-1.5 rounded-lg hover:bg-white hover:text-[#0a0f24]">Đăng ký
              </RouterLink>
              <RouterLink to="/login" class="bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-500">Đăng nhập
              </RouterLink>
              <RouterLink to="/employer"
                class="border border-white px-4 py-1.5 rounded-lg hover:bg-white hover:text-[#0a0f24]">Dành cho Nhà
                tuyển dụng</RouterLink>
            </template>
          </template>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import api from "@/api/axios";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const { user, isLoggedIn } = storeToRefs(auth);
const isLoggingOut = ref(false);

/* ===================== PAGE DETECTION ===================== */
const isAdminPage = computed(() => route.path.startsWith("/admin"));
const isEmployerPage = computed(() =>
  route.path.startsWith("/employer") &&
  (!isLoggedIn.value || user.value?.role === "employer")
);

const isEmployerLoggedInOnPublic = computed(() =>
  isLoggedIn.value && user.value?.role === "employer" && !isEmployerPage.value
);

const showNotificationBell = computed(() =>
  isLoggedIn.value &&
  user.value?.role === "candidate" &&
  route.path.startsWith("/candidate")
);

/* ===================== NOTIFICATIONS LOGIC (FIXED) ===================== */
const notifications = ref([]);
const notificationCount = ref(0);
const showNotifications = ref(false);

const fetchNotifications = async () => {
  if (!isLoggedIn.value || user.value?.role !== 'candidate') return;
  try {
    const res = await api.get("/notifications");
    const list = Array.isArray(res.data) ? res.data : (res.data.notifications || []);
    notifications.value = list;
    // Chỉ đếm những cái chưa đọc
    notificationCount.value = list.filter(n => !n.isRead).length;
  } catch (err) {
    console.error("Lỗi lấy thông báo:", err);
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

// Đóng dropdown khi click ngoài
const closeNotiDropdown = (e) => {
  if (showNotifications.value && !e.target.closest('.relative')) {
    showNotifications.value = false;
  }
};

// Hàm xử lý khi click vào thông báo cụ thể
const handleClickNoti = async (n) => {
  if (!n.isRead) {
    try {
      await api.put(`/notifications/${n._id}/read`);
      n.isRead = true;
      notificationCount.value = Math.max(0, notificationCount.value - 1);
    } catch (err) {
      console.error(err);
    }
  }
  showNotifications.value = false;

  // Điều hướng (Ví dụ: dẫn đến trang mời ứng tuyển hoặc dashboard)
  if (n.message.toLowerCase().includes("mời")) {
    router.push("/candidate/invitations");
  } else {
    router.push("/candidate/notifications");
  }
};

const markAllAsRead = async () => {
  try {
    await api.put("/notifications/mark-all-read");
    notifications.value.forEach(n => n.isRead = true);
    notificationCount.value = 0;
  } catch (err) {
    console.error(err);
  }
};

const formatDate = (date) => new Date(date).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

/* ===================== LOGOUT ===================== */
const logout = async () => {
  isLoggingOut.value = true;
  const role = user.value?.role;

  setTimeout(async () => {
    await auth.logout();
    toast.success("Đăng xuất thành công!");

    if (role === "employer") {
      router.replace("/employer/login");
    } else {
      router.replace("/");
    }
    isLoggingOut.value = false;
  }, 500);
};

/* ===================== LIFECYCLE & WATCH ===================== */
watch([() => route.path, isLoggedIn], ([path, loggedIn]) => {
  if (loggedIn && user.value?.role === "candidate" && path.startsWith("/candidate")) {
    fetchNotifications();
  }
});

onMounted(() => {
  if (isLoggedIn.value && user.value?.role === "candidate") {
    fetchNotifications();
  }
  window.addEventListener('click', closeNotiDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeNotiDropdown);
});
</script>
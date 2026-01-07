<template>
    <div class="min-h-screen bg-gray-50 text-gray-800 flex">
        <aside v-if="!isLoginPage" class="w-72 bg-white border-r min-h-screen p-4 hidden md:flex flex-col">
            <div class="flex items-center gap-3 px-2 mb-8">
                <div class="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                    AD
                </div>
                <div>
                    <div class="font-semibold text-lg">Admin Panel</div>
                    <div class="text-sm text-gray-500">Quản trị hệ thống</div>
                </div>
            </div>

            <nav class="space-y-1 flex-1">
                <router-link to="/admin/dashboard" class="menu-item" active-class="menu-active">Dashboard</router-link>
                <router-link to="/admin/applications" class="menu-item" active-class="menu-active">Ứng
                    tuyển</router-link>
                <router-link to="/admin/companies" class="menu-item" active-class="menu-active">Công ty</router-link>
                <router-link to="/admin/jobs" class="menu-item" active-class="menu-active">Tin tuyển dụng</router-link>
                <router-link to="/admin/users" class="menu-item" active-class="menu-active">Người dùng</router-link>
            </nav>
        </aside>

        <div class="flex-1 flex flex-col">
            <header v-if="!isLoginPage" class="bg-white border-b p-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button class="md:hidden p-2 rounded-md hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 class="text-2xl font-semibold">{{ pageTitle }}</h1>
                </div>

                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-600">Xin chào, {{ username }}</span>
                    <button
                        class="px-3 py-1.5 rounded-md hover:bg-red-50 text-red-600 font-medium text-sm transition-colors"
                        @click="handleLogout">
                        Đăng xuất
                    </button>
                </div>
            </header>

            <main class="p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps } from "vue"; // Thêm defineProps
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";

// 1. KHAI BÁO PROPS ĐỂ SỬA LỖI "pageTitle accessed during render but not defined"
defineProps({
    pageTitle: {
        type: String,
        default: "Hệ thống quản trị"
    }
});

const auth = useAuthStore();
const router = useRouter();

// Lấy thông tin user từ store (đã được fetch từ sessionStorage)
const user = computed(() => auth.user);
const username = computed(() => user.value?.name || "Admin");

// Kiểm tra trang login
const isLoginPage = computed(() => router.currentRoute.value.path === "/admin/login");

// Logout
async function handleLogout() {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc này?")) return;

    try {
        // Gọi API logout nếu cần
        await api.post("/auth/logout").catch(() => { });

        // 2. ĐỒNG BỘ SESSION STORAGE: Xóa sạch dữ liệu của riêng tab này
        auth.logout(); // Hàm logout trong store đã có sessionStorage.removeItem

        // Đảm bảo xóa triệt để các key quan trọng
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        // Xóa header mặc định của axios cho tab này
        delete api.defaults.headers.common["Authorization"];

        // Chuyển về trang login admin
        router.push("/admin/login");
    } catch (err) {
        console.error("Logout error:", err);
    }
}
</script>

<style scoped>
.menu-item {
    @apply block rounded-md px-4 py-2.5 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 text-sm font-medium;
}

.menu-active {
    @apply bg-indigo-600 font-bold text-white shadow-md shadow-indigo-100;
}
</style>
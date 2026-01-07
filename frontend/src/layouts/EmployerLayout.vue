<template>
    <div class="h-screen flex overflow-hidden bg-gray-100">
        <aside class="w-64 bg-[#0b1741] text-white flex flex-col flex-shrink-0">
            <div class="p-5 text-2xl font-bold border-b border-indigo-700 flex items-center space-x-2">
                <RouterLink to="/employer/dashboard" class="flex items-center space-x-2 hover:opacity-80 transition">
                    <img src="/logo.png" alt="Logo" class="w-10 h-10 rounded-full" />
                    <span>JobLink</span>
                </RouterLink>
            </div>

            <nav class="flex-1 p-4 space-y-2 text-sm overflow-y-auto">
                <RouterLink to="/employer/dashboard" class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path === '/employer/dashboard' }">
                    <i class="fa-solid fa-house mr-2"></i>Trang chủ
                </RouterLink>

                <RouterLink to="/employer/post-job" class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path.startsWith('/employer/post-job') }">
                    <i class="fa-solid fa-plus-circle mr-2"></i>Đăng tuyển dụng
                </RouterLink>

                <RouterLink to="/employer/jobs" class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path.startsWith('/employer/jobs') }">
                    <i class="fa-solid fa-clipboard-list mr-2"></i>Danh sách tin đã đăng
                </RouterLink>

                <RouterLink to="/employer/applicants"
                    class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path.startsWith('/employer/applicants') || $route.path.startsWith('/employer/applicant/') }">
                    <i class="fa-solid fa-user-group mr-2"></i>Ứng viên của tôi
                </RouterLink>

                <RouterLink to="/employer/saved-candidates"
                    class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path.startsWith('/employer/saved-candidates') }">
                    <i class="fa-solid fa-bookmark mr-2"></i>Ứng viên đã lưu
                </RouterLink>

                <RouterLink to="/employer/talents" class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path.startsWith('/employer/talents') }">
                    <i class="fa-solid fa-magnifying-glass mr-2"></i>Tìm kiếm tài năng
                </RouterLink>

                <RouterLink to="/employer/profile" class="block py-2.5 px-4 rounded-lg hover:bg-indigo-600 transition"
                    :class="{ 'bg-indigo-600': $route.path.startsWith('/employer/profile') }">
                    <i class="fa-solid fa-user mr-2"></i>Chỉnh sửa hồ sơ
                </RouterLink>
            </nav>
        </aside>

        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b sticky top-0 z-10">
                <h1 class="text-lg font-semibold text-gray-800">
                    {{ getPageTitle() }}
                </h1>

                <div class="flex items-center space-x-6 relative">
                    <div class="relative">
                        <button @click.stop="toggleNoti"
                            class="text-gray-700 hover:text-indigo-600 transition relative p-2">
                            <i class="fa-solid fa-bell text-xl"></i>
                            <span v-if="unreadCount > 0"
                                class="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {{ unreadCount }}
                            </span>
                        </button>

                        <div v-if="openNoti"
                            class="absolute right-0 mt-2 w-80 bg-white border shadow-2xl rounded-2xl z-50 overflow-hidden">
                            <div
                                class="p-4 border-b font-bold text-sm text-slate-900 bg-slate-50 flex justify-between items-center">
                                <span>Thông báo</span>
                                <button v-if="unreadCount > 0" @click.stop="markAllAsRead"
                                    class="text-[10px] text-indigo-600 hover:underline font-black uppercase tracking-tighter">
                                    Đọc tất cả
                                </button>
                            </div>

                            <div class="max-h-96 overflow-y-auto">
                                <div v-if="notifications.length === 0"
                                    class="p-10 text-center text-slate-400 text-sm italic">
                                    Không có thông báo nào.
                                </div>

                                <div v-for="n in notifications" :key="n._id"
                                    class="p-4 text-sm border-b hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-3 relative"
                                    :class="{ 'bg-indigo-50/50': !n.isRead }" @click="handleClickNoti(n)">

                                    <div v-if="!n.isRead"
                                        class="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>

                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs leading-snug mb-1"
                                            :class="n.isRead ? 'text-slate-500 font-medium' : 'text-slate-900 font-bold'">
                                            {{ n.message }}
                                        </p>
                                        <p class="text-[10px] text-slate-400 italic">
                                            {{ new Date(n.createdAt).toLocaleString('vi-VN') }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-3 text-center text-indigo-600 text-[11px] font-bold cursor-pointer hover:bg-slate-50 border-t uppercase tracking-widest"
                                @click="goToNotiPage">
                                Xem tất cả
                            </div>
                        </div>
                    </div>

                    <span class="font-medium text-gray-700 hidden md:block">{{ employerName }}</span>

                    <button @click="handleLogout"
                        class="border px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm font-medium">
                        <i class="fa-solid fa-right-from-bracket mr-1"></i>Đăng xuất
                    </button>
                </div>
            </header>

            <main class="flex-1 p-8 overflow-y-auto bg-gray-50">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const employerName = ref("Nhà tuyển dụng");
const notifications = ref([]);
const unreadCount = ref(0);
const openNoti = ref(false);

// Hàm đổi tên tiêu đề header tự động theo đường dẫn
function getPageTitle() {
    const path = route.path;
    if (path === '/employer/dashboard') return 'Bảng điều khiển';
    if (path.includes('/employer/applicants')) return 'Quản lý ứng viên';
    if (path.includes('/employer/jobs')) return 'Danh sách tin tuyển dụng';
    if (path.includes('/employer/notifications')) return 'Thông báo hệ thống';
    if (path.includes('/employer/profile')) return 'Hồ sơ công ty';
    return 'Nhà tuyển dụng';
}

/* ================== NOTIFICATION LOGIC ================== */
function toggleNoti() {
    openNoti.value = !openNoti.value;
}

function handleClickOutside(e) {
    if (!e.target.closest(".fa-bell") && !e.target.closest(".absolute")) {
        openNoti.value = false;
    }
}

function goToNotiPage() {
    openNoti.value = false;
    router.push("/employer/notifications");
}

async function fetchNotifications() {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
        const res = await api.get("/notifications");
        const list = Array.isArray(res.data) ? res.data : (res.data.notifications || []);
        notifications.value = list;
        unreadCount.value = list.filter(n => !n.isRead).length;
    } catch (err) {
        console.error("Lỗi lấy thông báo", err);
    }
}

async function markAsRead(id) {
    try {
        await api.put(`/notifications/${id}/read`);
        notifications.value = notifications.value.map(n =>
            n._id === id ? { ...n, isRead: true } : n
        );
        unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (err) {
        console.error("Lỗi đánh dấu đã đọc", err);
    }
}

async function markAllAsRead() {
    try {
        await api.put("/notifications/mark-all-read");
        notifications.value = notifications.value.map(n => ({ ...n, isRead: true }));
        unreadCount.value = 0;
    } catch (err) {
        console.error("Không thể đánh dấu tất cả", err);
    }
}

async function handleClickNoti(n) {
    if (!n.isRead) {
        await markAsRead(n._id);
    }
    openNoti.value = false;
    const msg = n.message.toLowerCase();
    if (msg.includes("ứng tuyển")) {
        router.push("/employer/applicants");
    } else if (msg.includes("tin tuyển dụng") || msg.includes("phê duyệt")) {
        router.push("/employer/jobs");
    } else {
        goToNotiPage();
    }
}

/* ================== LIFECYCLE ================== */
let notificationInterval = null;

onMounted(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
        employerName.value = user.companyName || user.name || user.email;
    }
    fetchNotifications();
    notificationInterval = setInterval(fetchNotifications, 30000);
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    if (notificationInterval) clearInterval(notificationInterval);
    document.removeEventListener("click", handleClickOutside);
});

function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi tab này?")) {
        auth.logout();
    }
}
</script>
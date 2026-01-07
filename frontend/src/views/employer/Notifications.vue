<template>
    <EmployerLayout>
        <div class="p-6">
            <div class="bg-white rounded-xl shadow-sm border p-6">
                <h2 class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <i class="fa-solid fa-bell text-indigo-600"></i>
                    Tất cả thông báo
                </h2>

                <div v-if="notifications.length === 0" class="text-center py-20 text-slate-400 italic">
                    Bạn chưa có thông báo nào.
                </div>

                <div class="space-y-3">
                    <div v-for="n in notifications" :key="n._id" @click="handleClickNoti(n)"
                        class="p-4 border rounded-lg hover:bg-slate-50 transition-all cursor-pointer flex justify-between items-center"
                        :class="{ 'bg-indigo-50/30 border-indigo-100': !n.isRead }">

                        <div class="flex-1 min-w-0">
                            <p class="text-sm leading-snug mb-1"
                                :class="n.isRead ? 'text-slate-600' : 'text-slate-900 font-bold'">
                                {{ n.message }}
                            </p>
                            <p class="text-[10px] text-slate-400 italic">
                                {{ new Date(n.createdAt).toLocaleString('vi-VN') }}
                            </p>
                        </div>

                        <div v-if="!n.isRead" class="w-2.5 h-2.5 bg-indigo-600 rounded-full flex-shrink-0 ml-4"></div>
                    </div>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from "@/api/axios";
// Import EmployerLayout từ thư mục layouts của bạn
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const router = useRouter();
const notifications = ref([]);

// Lấy toàn bộ danh sách thông báo từ API
async function fetchAllNotifications() {
    try {
        const res = await api.get("/notifications");
        // Kiểm tra cấu trúc data trả về từ API của bạn
        notifications.value = Array.isArray(res.data) ? res.data : (res.data.notifications || []);
    } catch (err) {
        console.error("Lỗi lấy danh sách thông báo:", err);
    }
}

// Đánh dấu đã đọc trên Server
async function markAsRead(id) {
    try {
        await api.put(`/notifications/${id}/read`);
    } catch (err) {
        console.error("Lỗi cập nhật trạng thái đã đọc:", err);
    }
}

// Xử lý khi click vào từng thông báo
async function handleClickNoti(n) {
    // 1. Nếu chưa đọc thì gọi API đánh dấu đã đọc
    if (!n.isRead) {
        await markAsRead(n._id);
        n.isRead = true; // Cập nhật giao diện ngay lập tức
    }

    // 2. Điều hướng dựa trên nội dung tin nhắn (Logic từ Layout của bạn)
    const msg = n.message.toLowerCase();

    if (msg.includes("ứng tuyển")) {
        router.push("/employer/applicants");
    } else if (msg.includes("tin tuyển dụng") || msg.includes("phê duyệt") || msg.includes("gỡ xuống")) {
        router.push("/employer/jobs");
    } else if (msg.includes("tài khoản")) {
        router.push("/employer/profile");
    }
}

onMounted(() => {
    fetchAllNotifications();
});
</script>
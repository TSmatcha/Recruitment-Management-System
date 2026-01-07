<template>
    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-16 px-6 font-sans text-slate-900">
        <div class="max-w-5xl mx-auto space-y-10 animate-fade-in">

            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
                <div>
                    <h1 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Lịch sử <span class="text-indigo-600">Ứng tuyển</span>
                    </h1>
                    <p class="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mt-3">Theo dõi tiến độ hồ
                        sơ của bạn</p>
                </div>
                <button @click="$router.back()"
                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                    Quay lại trang chủ
                </button>
            </div>

            <div v-if="loading" class="py-24 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p class="text-slate-900 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Đang đồng bộ
                    dữ liệu hồ sơ...</p>
            </div>

            <div v-else-if="apps.length === 0"
                class="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
                <p class="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mb-8 italic">Hệ thống chưa ghi
                    nhận hồ sơ ứng tuyển nào</p>
                <RouterLink to="/candidate/home"
                    class="px-10 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                    Khám phá cơ hội ngay
                </RouterLink>
            </div>

            <div v-else class="space-y-4">
                <div v-for="app in apps" :key="app._id"
                    class="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">

                    <div
                        class="absolute -right-4 -bottom-6 text-slate-50 text-6xl font-black opacity-40 select-none group-hover:scale-110 transition-transform">
                        ENTRY
                    </div>

                    <div class="space-y-2 relative z-10 flex-1">
                        <div class="flex items-center gap-3">
                            <span class="w-2 h-2 bg-indigo-600 rounded-full"></span>
                            <h3
                                class="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                                {{ app.jobId?.title || "Vị trí không xác định" }}
                            </h3>
                        </div>
                        <p class="text-slate-400 text-[11px] font-black uppercase tracking-widest ml-5">
                            Nộp ngày: {{ formatDate(app.createdAt) }}
                        </p>
                    </div>

                    <div class="flex items-center gap-6 w-full md:w-auto relative z-10">
                        <span
                            class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
                            :class="statusClass(app.status)">
                            {{ statusText(app.status) }}
                        </span>

                        <RouterLink v-if="app.jobId?._id" :to="`/job/${app.jobId._id}`"
                            class="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-90 shadow-lg shadow-slate-200">
                            Xem chi tiết
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/api/axios";

const apps = ref([]);
const loading = ref(true);

const statusText = (s) =>
    s === "applied"
        ? "Chờ duyệt"
        : s === "accepted"
            ? "Đã chấp nhận"
            : "Từ chối";

const statusClass = (s) =>
    s === "applied"
        ? "bg-amber-50 text-amber-600 border-amber-100"
        : s === "accepted"
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-rose-50 text-rose-600 border-rose-100";

const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "-";

onMounted(async () => {
    try {
        const res = await axios.get("/applications");
        apps.value = res.data || [];
    } catch (err) {
        console.error("Lỗi lấy danh sách ứng tuyển:", err);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
</style>
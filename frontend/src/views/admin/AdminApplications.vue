<template>
    <AdminLayout pageTitle="Hồ sơ">
        <div class="mb-12 animate-fade-in">
            <h1 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Hồ sơ <span class="text-slate-400">Ứng tuyển</span>
            </h1>
            <div class="h-[1px] w-12 bg-slate-900 mt-6"></div>
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-6 flex items-center gap-2">
                Danh sách ứng tuyển toàn hệ thống
            </p>
        </div>

        <div v-if="loading"
            class="py-32 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-sm shadow-sm">
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">Syncing data...
            </p>
        </div>

        <div v-else-if="applications.length === 0"
            class="py-32 text-center bg-white border border-dashed border-slate-200 rounded-sm">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Không tìm thấy bản ghi
                ứng tuyển nào</p>
        </div>

        <div v-else class="overflow-hidden bg-white border border-slate-200 rounded-sm shadow-sm animate-fade-in">
            <table class="min-w-full border-collapse text-left">
                <thead class="bg-slate-50/50 border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ứng viên
                        </th>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin
                            liên hệ</th>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Công việc</th>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Công ty </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="a in applications" :key="a._id" class="hover:bg-slate-50 transition-colors group">
                        <td
                            class="px-6 py-6 text-sm font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors">
                            {{ a.userId?.name || "N/A" }}
                        </td>
                        <td class="px-6 py-6 text-xs font-bold text-slate-500 italic tracking-tight">
                            {{ a.userId?.email || "N/A" }}
                        </td>
                        <td class="px-6 py-6 text-sm font-bold text-slate-700 tracking-tight leading-snug">
                            {{ a.jobId?.title || "N/A" }}
                        </td>
                        <td class="px-6 py-6">
                            <span
                                class="inline-block border border-slate-200 px-3 py-1 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-md bg-white group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                                {{ a.jobId?.company?.name || "N/A" }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-12 flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] px-2">
            <span>Query status: Successful</span>
            <span>Total records: {{ applications.length }}</span>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout.vue";

const applications = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const res = await api.get("/admin/applications");
        applications.value = res.data || [];
    } catch (err) {
        console.error("Lỗi tải applications:", err);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Đảm bảo bảng không bị vỡ bố cục khi zoom */
table {
    table-layout: fixed;
}

td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
<template>
    <AdminLayout pageTitle="Tuyển dụng">
        <div class="mb-12 animate-fade-in">
            <h1 class="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Quản lý <span class="text-slate-400">Tin tuyển dụng</span>
            </h1>
            <div class="h-[1px] w-12 bg-slate-900 mt-6"></div>
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-6 flex items-center gap-2">
                Kiểm soát luồng dữ liệu việc làm toàn hệ thống
            </p>
        </div>

        <div v-if="loading"
            class="py-32 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-sm">
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">Fetching
                records...</p>
        </div>

        <div v-else-if="jobs.length === 0"
            class="py-32 text-center bg-white border border-dashed border-slate-200 rounded-sm">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Hệ thống trống / Chưa có
                tin đăng</p>
        </div>

        <div v-else class="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden animate-fade-in">
            <table class="min-w-full border-collapse text-left text-sm">
                <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vị trí ứng
                            tuyển</th>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị
                            đăng tin</th>
                        <th class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái
                        </th>
                        <th
                            class="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                            Tác vụ</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="job in jobs" :key="job._id" class="hover:bg-slate-50 transition-colors group">
                        <td class="px-6 py-6 max-w-xs">
                            <p
                                class="font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                                {{ job.title }}
                            </p>
                        </td>

                        <td class="px-6 py-6 text-slate-500 font-bold italic text-xs tracking-tight">
                            {{ job.company?.name || "N/A" }}
                        </td>

                        <td class="px-6 py-6">
                            <span
                                class="px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all"
                                :class="job.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'">
                                {{ job.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
                            </span>
                        </td>

                        <td class="px-6 py-6 text-right">
                            <router-link :to="`/admin/jobs/${job._id}`"
                                class="inline-block px-5 py-2 border border-slate-200 rounded-md text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all active:scale-95 shadow-sm">
                                Xem chi tiết
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

       
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout.vue";

const jobs = ref([]);
const loading = ref(true);

const load = async () => {
    loading.value = true;
    try {
        const res = await api.get("/admin/jobs");
        jobs.value = res.data || [];
    } catch (err) {
        console.error("Lỗi khi tải jobs:", err);
    } finally {
        loading.value = false;
    }
};

onMounted(load);
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

table {
    table-layout: fixed;
}
</style>
<template>
    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
        <div class="max-w-4xl mx-auto">

            <div class="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Việc làm <span class="text-indigo-600">đã lưu</span>
                    </h1>
                    <p class="text-slate-500 mt-2 font-medium italic">
                        Danh sách các cơ hội nghề nghiệp bạn đang quan tâm.
                    </p>
                </div>
                <div v-if="jobs.length > 0"
                    class="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 hidden md:block">
                    <span class="text-indigo-600 font-black text-lg">{{ jobs.length }}</span>
                    <span class="text-indigo-400 text-[10px] font-black uppercase tracking-widest ml-2">Vị trí</span>
                </div>
            </div>

            <div v-if="loading"
                class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
                <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600"></i>
                <p class="mt-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Đang trích xuất dữ
                    liệu...</p>
            </div>

            <div v-else-if="jobs.length === 0"
                class="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200 shadow-sm">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa-regular fa-bookmark text-slate-300 text-3xl"></i>
                </div>
                <h3 class="text-slate-800 font-bold text-xl">Chưa có công việc nào được lưu</h3>
                <p class="text-slate-400 mt-2 text-sm">Hãy khám phá thêm các vị trí mới và lưu lại để ứng tuyển sau.</p>
                <RouterLink to="/jobs"
                    class="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest">
                    Khám phá việc làm
                </RouterLink>
            </div>

            <div v-else class="space-y-4 animate-fade-in">
                <div v-for="job in jobs" :key="job._id"
                    class="group bg-white border border-slate-100 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">

                    <div class="flex items-center gap-6 flex-1 w-full min-w-0">
                        <div
                            class="w-16 h-16 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 transition-colors shadow-sm overflow-hidden">
                            <img v-if="job.jobId?.company?.logo" :src="job.jobId.company.logo"
                                class="w-12 h-12 object-contain" />
                            <span v-else class="text-slate-300 font-black text-xs tracking-tighter uppercase">N/A</span>
                        </div>

                        <div class="min-w-0 flex-1">
                            <h2
                                class="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {{ job.jobId?.title || 'Vị trí chưa xác định' }}
                            </h2>
                            <p class="text-sm font-bold text-slate-500 mt-0.5 truncate">
                                {{ job.jobId?.company?.name || 'Công ty ẩn danh' }}
                            </p>

                            <div class="flex flex-wrap gap-3 mt-3">
                                <span
                                    class="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100 flex items-center gap-1.5">
                                    <i class="fa-solid fa-location-dot text-[8px]"></i>
                                    {{ job.jobId?.location || 'Việt Nam' }}
                                </span>
                                <span v-if="job.jobId?.salary"
                                    class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                    {{ job.jobId.salary }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 shrink-0 w-full md:w-auto">
                        <RouterLink :to="`/job/${job.jobId?._id}`"
                            class="flex-1 md:flex-none text-center px-6 py-3 bg-slate-900 text-white font-black text-[10px] rounded-xl hover:bg-indigo-600 transition-all uppercase tracking-widest shadow-lg shadow-slate-200">
                            Chi tiết
                        </RouterLink>

                        <button @click="remove(job.jobId?._id)"
                            class="flex-1 md:flex-none text-center px-6 py-3 bg-white text-rose-500 border border-rose-100 font-black text-[10px] rounded-xl hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest active:scale-95">
                            Bỏ lưu
                        </button>
                    </div>

                </div>
            </div>

            <p v-if="jobs.length > 0"
                class="mt-12 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                Danh sách được cập nhật theo thời gian thực
            </p>
        </div>
    </div>
</template>

<script setup>
import axios from "@/api/axios";
import { ref, onMounted } from "vue";

const jobs = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const res = await axios.get("/saved-jobs");
        jobs.value = res.data;
    } catch (err) {
        console.error("Lỗi khi lấy danh sách việc làm:", err);
    } finally {
        loading.value = false;
    }
});

async function remove(jobId) {
    if (!confirm("Bạn muốn bỏ lưu công việc này?")) return;

    try {
        await axios.delete(`/saved-jobs/${jobId}`);
        // Hiệu ứng xóa mượt mà
        jobs.value = jobs.value.filter(j => j.jobId?._id !== jobId);
    } catch (error) {
        console.error("Xóa thất bại", error);
    }
}
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
    animation: fade-in 0.4s ease-out forwards;
}

/* Custom thanh cuộn tối giản */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #F8FAFC;
}

::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #CBD5E1;
}
</style>
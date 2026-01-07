<template>
    <EmployerLayout>
        <div class="h-auto bg-gray-50 flex justify-center items-start py-10 pt-24 overflow-visible">
            <div
                class="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-8 space-y-6 border border-gray-100 mb-10 animate-fade-in">

                <div class="flex flex-col items-center space-y-4 border-b border-gray-50 pb-6">
                    <div class="relative">
                        <img v-if="application && application.avatar" :src="application.avatar"
                            class="w-24 h-24 rounded-[2rem] object-cover border-4 border-white shadow-md ring-1 ring-gray-100"
                            alt="Avatar ứng viên" />

                        <div v-else
                            class="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-100">
                            {{ application?.name ? application.name.charAt(0).toUpperCase() : '?' }}
                        </div>

                        <div
                            class="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full">
                        </div>
                    </div>

                    <div class="text-center">
                        <h2 class="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            {{ application?.name || 'Chi tiết ứng viên' }}
                        </h2>
                        <p class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">
                            {{ application?.jobTitle || 'Hồ sơ ứng tuyển' }}
                        </p>
                    </div>
                </div>

                <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p class="mt-4 text-gray-500 text-sm font-medium">Đang trích xuất dữ liệu...</p>
                </div>

                <div v-else-if="error"
                    class="bg-rose-50 p-6 rounded-2xl text-rose-600 text-center font-bold border border-rose-100">
                    <i class="fas fa-circle-exclamation text-xl mb-2 block"></i>
                    <p>{{ error }}</p>
                </div>

                <div v-else-if="application" class="space-y-4">
                    <div class="grid grid-cols-1 gap-3">
                        <div class="flex items-center gap-4 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                            <div
                                class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <i class="fas fa-envelope text-indigo-500 text-sm"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[9px] font-black text-gray-400 uppercase mb-0.5 tracking-wider">Email</p>
                                <p class="font-bold text-slate-700 text-sm break-all leading-tight">{{ application.email
                                    }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                            <div
                                class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <i class="fas fa-phone text-indigo-500 text-sm"></i>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[9px] font-black text-gray-400 uppercase mb-0.5 tracking-wider">Số điện
                                    thoại</p>
                                <p class="font-bold text-slate-700 text-sm">{{ application.phone || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>

                  <div class="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                        <p class="text-[9px] font-black text-indigo-400 uppercase mb-3 tracking-widest text-center">Tài
                            liệu</p>
                        <div class="font-bold">
                            <a v-if="application.cvUrl && application.cvUrl !== 'pending' && application.cvUrl !== 'null'"
                                :href="application.cvUrl" target="_blank"
                                class="flex items-center justify-center gap-2 bg-white text-indigo-600 px-4 py-3 rounded-xl border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all text-xs uppercase tracking-widest">
                                <i class="fas fa-file-pdf text-base"></i> Mở tệp CV gốc
                            </a>

                            <RouterLink v-else-if="application.cvId"
                                :to="`/employer/cv/${application.cvId._id || application.cvId}`"
                                class="flex items-center justify-center gap-2 bg-white text-emerald-600 px-4 py-3 rounded-xl border border-emerald-100 shadow-sm hover:bg-emerald-600 hover:text-white transition-all text-xs uppercase tracking-widest">
                                 Xem CV hệ thống
                            </RouterLink>

                            <span v-else
                                class="block text-center text-gray-300 italic text-xs py-2 uppercase font-black">
                                Chưa có hồ sơ
                            </span>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between p-4 bg-slate-900 rounded-[1.5rem] shadow-lg shadow-slate-200">
                        <p class="text-[9px] font-black text-white/40 uppercase tracking-widest italic">Quy trình hiện
                            tại</p>
                        <span :class="statusColor(application.status)"
                            class="font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-white/10 rounded-lg">
                            {{ statusText(application.status) }}
                        </span>
                    </div>

                    <button @click="goBack"
                        class="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] active:scale-[0.98]">
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<style scoped>
/* FIX: Triệt tiêu hoàn toàn scrollbar thứ 2 */
.overflow-visible {
    overflow: visible !important;
}

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
    animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/api/axios';

const route = useRoute();
const router = useRouter();
const application = ref(null);
const loading = ref(false);
const error = ref(null);

function statusColor(status) {
    if (status === 'accepted') return 'text-green-600';
    if (status === 'rejected') return 'text-red-600';
    if (status === 'reviewed' || status === 'interview') return 'text-yellow-600';
    return 'text-gray-500'; // applied
}

function statusText(status) {
    switch (status) {
        case 'applied': return 'Chưa duyệt';
        case 'reviewed': return 'Đã xem';
        case 'interview': return 'Phỏng vấn';
        case 'accepted': return 'Đã duyệt';
        case 'rejected': return 'Từ chối';
        default: return status;
    }
}

async function fetchApplication() {
    loading.value = true;
    error.value = null;
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/applications/${route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        application.value = res.data;
    } catch (err) {
        console.error(err);
        error.value = err.response?.data?.message || 'Lỗi khi tải dữ liệu';
    } finally {
        loading.value = false;
    }
}

function goBack() {
    router.push('/employer/applicants');
}

onMounted(fetchApplication);
</script>

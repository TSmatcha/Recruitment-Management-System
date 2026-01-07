<template>
    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6 font-sans text-slate-900">
        <div class="max-w-5xl mx-auto">

            <div v-if="loading"
                class="bg-white rounded-[2.5rem] p-24 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600 mb-4"></i>
                <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Đang trích xuất dữ liệu đối
                    tác...</p>
            </div>

            <div v-else-if="error"
                class="bg-rose-50 p-12 rounded-[2.5rem] border border-rose-100 text-center animate-fade-in">
                <i class="fa-solid fa-circle-exclamation text-rose-400 text-3xl mb-4"></i>
                <p class="text-rose-600 font-black uppercase text-xs tracking-widest">{{ error }}</p>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">

                <aside class="lg:col-span-4 space-y-6">
                    <div
                        class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

                        <div
                            class="w-28 h-28 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black mx-auto mb-8 shadow-2xl ring-8 ring-slate-50 relative z-10">
                            {{ employer.company?.charAt(0).toUpperCase() || employer.name?.charAt(0).toUpperCase() }}
                        </div>

                        <h1 class="text-2xl font-black text-slate-800 leading-tight mb-2 uppercase tracking-tighter">
                            {{ employer.company || employer.name }}
                        </h1>
                        <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-10">
                            Đối tác tuyển dụng chiến lược
                        </p>

                        <div class="space-y-6 pt-8 border-t border-slate-50 text-left">
                            <div class="group">
                                <p class="text-[9px] font-black text-slate-300 uppercase mb-1.5 tracking-[0.15em]">Đại
                                    diện nhân sự</p>
                                <p
                                    class="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {{ employer.name }}</p>
                            </div>
                            <div class="group">
                                <p class="text-[9px] font-black text-slate-300 uppercase mb-1.5 tracking-[0.15em]">Địa
                                    chỉ Email</p>
                                <p
                                    class="text-sm font-bold text-slate-700 break-all leading-snug group-hover:text-indigo-600 transition-colors">
                                    {{ employer.email || "N/A" }}</p>
                            </div>
                            <div class="group">
                                <p class="text-[9px] font-black text-slate-300 uppercase mb-1.5 tracking-[0.15em]">Đường
                                    dây nóng</p>
                                <p
                                    class="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {{ employer.phone || "N/A" }}</p>
                            </div>
                        </div>
                    </div>

                    <button @click="$router.back()"
                        class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
                        Quay lại danh sách
                    </button>
                </aside>

                <main class="lg:col-span-8 space-y-6">
                    <div
                        class="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 relative h-full">

                        <div class="relative z-10 space-y-12">
                            <div class="grid md:grid-cols-2 gap-10">
                                <div class="space-y-2">
                                    <h3
                                        class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <i class="fa-solid fa-location-dot text-indigo-500"></i> Trụ sở chính
                                    </h3>
                                    <p class="text-base font-bold text-slate-700 leading-relaxed italic">
                                        {{ employer.address || "Thông tin địa chỉ đang được cập nhật..." }}
                                    </p>
                                </div>
                                <div class="space-y-2">
                                    <h3
                                        class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <i class="fa-solid fa-globe text-indigo-500"></i> Website công ty
                                    </h3>
                                    <a v-if="employer.website" :href="employer.website" target="_blank"
                                        class="text-base font-black text-indigo-600 hover:underline break-all uppercase tracking-tighter">
                                        {{ employer.website.replace(/^https?:\/\//, '') }}
                                    </a>
                                    <p v-else class="text-base font-bold text-slate-300 italic">N/A</p>
                                </div>
                            </div>

                            <div class="pt-10 border-t border-slate-50">
                                <h3
                                    class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <i class="fa-solid fa-circle-info text-indigo-500"></i> Câu chuyện thương hiệu
                                </h3>
                                <div class="prose prose-slate max-w-none">
                                    <p
                                        class="text-slate-600 leading-loose text-justify whitespace-pre-line font-medium">
                                        {{ employer.description || "Nhà tuyển dụng này chưa cung cấp thông tin giới thiệu chi tiết về văn hóa và câu chuyện của doanh nghiệp." }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <i
                            class="fa-solid fa-building-shield absolute -bottom-10 -right-8 text-[18rem] text-slate-50 opacity-80 pointer-events-none select-none"></i>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const auth = useAuthStore();

const employer = ref({});
const loading = ref(true);
const error = ref("");

const fetchEmployer = async () => {
    loading.value = true;
    error.value = "";
    try {
        const res = await axios.get(`http://localhost:5000/api/employer/${route.params.id}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        employer.value = res.data;
    } catch (err) {
        console.error(err);
        error.value = "Hệ thống gặp sự cố khi trích xuất thông tin đối tác.";
    } finally {
        loading.value = false;
    }
};

onMounted(fetchEmployer);
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

/* Tùy chỉnh thanh cuộn tối giản */
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
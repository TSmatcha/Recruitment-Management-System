<template>
    <EmployerLayout>
        <div class="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div
                class="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">

                <div class="bg-indigo-700 p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight uppercase">Hồ sơ ứng viên</h1>
                        <p class="text-indigo-100 text-sm mt-1 opacity-90">{{ cvData?.title || 'Đang tải thông tin...'
                            }}</p>
                    </div>
                    <button @click="$router.back()"
                        class="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all">
                        <i class="fas fa-times text-lg"></i>
                    </button>
                </div>

                <div v-if="loading" class="p-20 text-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                    <p class="mt-4 text-slate-500 text-sm font-medium">Đang tải dữ liệu hồ sơ...</p>
                </div>

                <div v-else-if="cvData" class="p-8 space-y-10">

                    <section v-if="cvData.summary">
                        <h3 class="text-sm font-bold text-indigo-700 uppercase mb-4 flex items-center gap-2">
                            <i class="fas fa-user text-xs"></i> Giới thiệu bản thân
                        </h3>
                        <div
                            class="ml-6 p-4 bg-slate-50 rounded-lg border border-slate-100 italic text-slate-600 leading-relaxed">
                            "{{ cvData.summary }}"
                        </div>
                    </section>

                    <section>
                        <h3 class="text-sm font-bold text-indigo-700 uppercase mb-4 flex items-center gap-2">
                            <i class="fas fa-address-book text-xs"></i> Thông tin liên hệ
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                            <div
                                class="flex items-center gap-3 text-slate-700 p-3 bg-white border border-slate-100 rounded-lg">
                                <i class="fas fa-envelope text-indigo-500 w-4 text-center"></i>
                                <span class="font-medium text-sm">{{ cvData.contact?.email }}</span>
                            </div>
                            <div
                                class="flex items-center gap-3 text-slate-700 p-3 bg-white border border-slate-100 rounded-lg">
                                <i class="fas fa-phone text-indigo-500 w-4 text-center"></i>
                                <span class="font-medium text-sm">{{ cvData.contact?.phone }}</span>
                            </div>
                            <div
                                class="flex items-center gap-3 text-slate-700 p-3 bg-white border border-slate-100 rounded-lg md:col-span-2">
                                <i class="fas fa-map-marker-alt text-indigo-500 w-4 text-center"></i>
                                <span class="font-medium text-sm">{{ cvData.contact?.address }}</span>
                            </div>
                        </div>
                    </section>

                    <section v-if="cvData.education?.length">
                        <h3 class="text-sm font-bold text-indigo-700 uppercase mb-6 flex items-center gap-2">
                            <i class="fas fa-graduation-cap text-xs"></i> Học vấn
                        </h3>
                        <div class="ml-6 space-y-6">
                            <div v-for="edu in cvData.education" :key="edu._id"
                                class="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-2">
                                <div
                                    class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-500">
                                </div>
                                <h4 class="font-bold text-slate-800 text-sm uppercase">{{ edu.school }}</h4>
                                <p class="text-indigo-600 text-xs font-semibold mt-1">{{ edu.degree }}</p>
                                <p class="text-slate-400 text-[11px] font-bold mt-1 tracking-tight">
                                    {{ edu.startYear }} — {{ edu.endYear }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section v-if="cvData.experience?.length">
                        <h3 class="text-sm font-bold text-indigo-700 uppercase mb-6 flex items-center gap-2">
                            <i class="fas fa-briefcase text-xs"></i> Kinh nghiệm làm việc
                        </h3>
                        <div class="ml-6 space-y-8">
                            <div v-for="exp in cvData.experience" :key="exp._id"
                                class="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-2">
                                <div
                                    class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-500">
                                </div>
                                <h4 class="font-bold text-slate-800 text-sm uppercase leading-none">{{ exp.position }}
                                </h4>
                                <p class="text-emerald-600 text-xs font-bold mt-2 italic">{{ exp.company }}</p>
                                <p class="text-slate-400 text-[11px] font-bold mt-1">{{ exp.duration }}</p>
                                <p class="mt-3 text-slate-600 text-sm leading-relaxed">{{ exp.description }}</p>
                            </div>
                        </div>
                    </section>

                    <section v-if="cvData.skills?.length">
                        <h3 class="text-sm font-bold text-indigo-700 uppercase mb-4 flex items-center gap-2">
                            <i class="fas fa-tools text-xs"></i> Kỹ năng chuyên môn
                        </h3>
                        <div class="flex flex-wrap gap-2 ml-6">
                            <span v-for="skill in cvData.skills" :key="skill"
                                class="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-bold uppercase tracking-wider">
                                {{ skill }}
                            </span>
                        </div>
                    </section>
                </div>

                <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                    <button @click="$router.back()"
                        class="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-xs font-bold uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        Quay lại 
                    </button>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/api/axios';

const route = useRoute();
const cvData = ref(null);
const loading = ref(false);

const fetchCvDetail = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('token'); // Lấy token từ storage
        const res = await axios.get(`/cv/${route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` } // Gửi kèm token
        });
        cvData.value = res.data;
    } catch (err) {
        console.error("Lỗi lấy CV:", err);
        // Thông báo lỗi chi tiết hơn để debug
        alert(err.response?.data?.message || "Không thể tải nội dung CV hệ thống.");
    } finally {
        loading.value = false;
    }
};
onMounted(fetchCvDetail);
</script>
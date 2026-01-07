<template>
    <EmployerLayout>
        <div class="p-8 pt-6 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
                            Ứng viên <span class="text-indigo-600">đã lưu</span>
                        </h1>
                        <p class="text-slate-500 mt-1 italic text-sm">Quản lý danh sách các nhân tài bạn đang quan tâm.
                        </p>
                    </div>
                    <div
                        class="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
                        Tổng cộng: <span class="text-indigo-600">{{ candidates.length }}</span>
                    </div>
                </div>

                <div v-if="loading"
                    class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600"></i>
                    <p class="mt-4 text-slate-500 font-medium">Đang tải danh sách nhân tài...</p>
                </div>

                <div v-else>
                    <div v-if="candidates.length === 0"
                        class="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                        <div
                            class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <i class="fa-solid fa-bookmark text-3xl"></i>
                        </div>
                        <h3 class="text-slate-800 font-bold text-xl">Danh sách trống</h3>
                        <p class="text-slate-400 mt-2 text-sm">Bạn chưa lưu ứng viên nào. Hãy khám phá thêm tài năng
                            mới!</p>
                        <router-link to="/employer/talents"
                            class="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg active:scale-95">
                            Tìm kiếm ứng viên ngay
                        </router-link>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div v-for="candidate in candidates" :key="candidate.id"
                            class="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative flex flex-col animate-fade-in">

                            <button @click="toggleSave(candidate)"
                                class="absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white z-10"
                                title="Bỏ lưu">
                                <i class="fa-solid fa-trash-can text-sm"></i>
                            </button>

                            <div class="flex items-start gap-5 mb-6">
                                <img :src="candidate.avatar || '/default-avatar.png'"
                                    class="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500" />
                                <div class="min-w-0 pt-1">
                                    <h2
                                        class="font-bold text-lg text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                        {{ candidate.name }}
                                    </h2>
                                    <p class="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                                        <i class="fa-solid fa-graduation-cap text-indigo-400"></i>
                                        {{ getFirstEducation(candidate.education) }}
                                    </p>
                                    <div class="flex items-center gap-3 mt-2">
                                        <span
                                            class="text-[10px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                                            <i class="fa-solid fa-venus-mars mr-1"></i>{{ candidate.gender || 'N/A' }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <span
                                    class="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100">
                                    {{ candidate.industry || 'Ngành nghề chưa cập nhật' }}
                                </span>
                            </div>

                            <div class="mb-6 flex-grow">
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="(skill, index) in (candidate.skills || []).slice(0, 4)" :key="index"
                                        class="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        {{ skill }}
                                    </span>
                                </div>
                            </div>

                            <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div class="flex flex-col">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kinh
                                        nghiệm</span>
                                    <p class="text-xl font-black text-slate-900 leading-none mt-1">
                                        {{ calculateTotalExp(candidate.experience) }}<span
                                            class="text-sm ml-0.5 font-bold">năm</span>
                                    </p>
                                </div>
                                <router-link :to="`/employer/talents/${candidate.id}`"
                                    class="h-11 px-6 flex items-center justify-center bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                                    Xem chi tiết
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from "@/api/axios";
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const candidates = ref([]);
const loading = ref(true);
const error = ref("");

const getFirstEducation = (eduArray) => {
    if (!Array.isArray(eduArray) || eduArray.length === 0) return 'Chưa cập nhật học vấn';
    return eduArray[0].school;
};

const calculateTotalExp = (expArray) => {
    if (!Array.isArray(expArray) || expArray.length === 0) return 0;
    if (typeof expArray === 'number') return expArray;

    let totalMonths = 0;
    expArray.forEach(exp => {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        if (!isNaN(start.getTime())) {
            totalMonths += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        }
    });
    const years = totalMonths / 12;
    return years > 0 ? years.toFixed(1) : 0;
};

const fetchSavedCandidates = async () => {
    try {
        loading.value = true;
        const { data } = await api.get("/talents/saved");

        candidates.value = data.data.map((c) => ({
            ...c,
            id: c._id,
            skills: Array.isArray(c.skills) ? c.skills : [],
            education: Array.isArray(c.education) ? c.education : [],
            experience: Array.isArray(c.experience) ? c.experience : [],
        }));
    } catch (err) {
        console.error("❌ Lỗi lấy danh sách:", err);
        error.value = "Không thể tải danh sách ứng viên.";
    } finally {
        loading.value = false;
    }
};

const toggleSave = async (candidate) => {
    if (!confirm(`Bạn có chắc muốn bỏ lưu ứng viên ${candidate.name}?`)) return;
    try {
        await api.post("/talents/unsave", { candidateId: candidate.id });
        candidates.value = candidates.value.filter((c) => c.id !== candidate.id);
    } catch (err) {
        console.error("❌ Lỗi bỏ lưu:", err);
    }
};

onMounted(() => {
    fetchSavedCandidates();
});
</script>

<style scoped>
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

.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}
</style>
<template>
    <EmployerLayout>
        <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

            <header class="bg-white border-b border-slate-100 py-10">
                <div class="max-w-7xl mx-auto px-8">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">
                                Tìm kiếm <span class="text-indigo-600">tài năng</span>
                            </h2>
                            <p class="text-slate-500 mt-1">Kết nối với mạng lưới ứng viên tiềm năng cho doanh nghiệp của
                                bạn.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="text-right hidden sm:block">
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang hiển thị
                                </p>
                                <p class="text-sm font-black text-slate-700">{{ results.length }} ứng viên</p>
                            </div>
                            <div class="w-px h-8 bg-slate-200 mx-2"></div>
                            <button @click="fetchTalents"
                                class="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <i class="fa-solid fa-rotate-right" :class="{ 'animate-spin': loading }"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div class="max-w-7xl mx-auto px-8 py-10">
                <div class="flex flex-col lg:flex-row gap-10">

                    <aside class="w-full lg:w-72 shrink-0">
                        <div
                            class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="text-sm font-bold text-slate-900 uppercase tracking-widest">Bộ lọc</h3>
                                <button @click="resetFilters"
                                    class="text-xs font-bold text-rose-500 hover:opacity-70">Xóa lọc</button>
                            </div>

                            <form @submit.prevent="searchTalent" class="space-y-6">
                                <div class="space-y-2">
                                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1">Tìm
                                        nhanh</label>
                                    <input v-model="filters.q" type="text" placeholder="Tên, học vấn..."
                                        class="filter-input" />
                                </div>

                                <div class="space-y-2">
                                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1">Lĩnh vực</label>
                                    <select v-model="filters.industry"
                                        class="filter-input cursor-pointer appearance-none">
                                        <option value="">Tất cả ngành</option>
                                        <option v-for="(label, key) in industryLabel" :key="key" :value="key">{{ label
                                            }}</option>
                                    </select>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1">Kỹ năng</label>
                                    <input v-model="filters.skills" type="text" placeholder="React, Figma..."
                                        class="filter-input" />
                                </div>

                                <div class="space-y-2">
                                    <label class="text-[11px] font-black text-slate-400 uppercase ml-1">Kinh nghiệm
                                        (năm)</label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <input v-model.number="filters.minExp" type="number" placeholder="Từ"
                                            class="filter-input text-center" />
                                        <input v-model.number="filters.maxExp" type="number" placeholder="Đến"
                                            class="filter-input text-center" />
                                    </div>
                                </div>

                                <button type="submit" :disabled="loading"
                                    class="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-4">
                                    {{ loading ? 'Đang tìm...' : 'Áp dụng bộ lọc' }}
                                </button>
                            </form>
                        </div>
                    </aside>

                    <div class="flex-1">
                        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="i in 4" :key="i"
                                class="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>
                        </div>

                        <div v-else-if="results.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="candidate in results" :key="candidate._id"
                                class="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl transition-all relative flex flex-col">

                                <div class="absolute top-8 right-8">
                                    <span
                                        class="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100">
                                        {{ industryLabel[candidate.industry] || "Chuyên gia" }}
                                    </span>
                                </div>

                                <div class="flex items-start gap-5 mb-6">
                                    <div class="relative shrink-0">
                                        <img :src="candidate.avatar || '/default-avatar.png'"
                                            class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500" />
                                        <div
                                            class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full">
                                        </div>
                                    </div>
                                    <div class="min-w-0 pt-1">
                                        <h3
                                            class="font-bold text-lg text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                            {{ candidate.name }}
                                        </h3>
                                        <p class="text-xs font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                                            <i class="fa-solid fa-graduation-cap"></i>
                                            {{ candidate.education && candidate.education.length > 0 ?
                                                candidate.education[0].school : "Chưa cập nhật học vấn" }}
                                        </p>
                                    </div>
                                </div>

                                <div class="space-y-4 flex-grow">
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="skill in (candidate.skills || []).slice(0, 3)" :key="skill"
                                            class="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-100">
                                            {{ skill }}
                                        </span>
                                        <span v-if="candidate.skills?.length > 3"
                                            class="text-[10px] text-slate-300 font-bold self-center">
                                            +{{ candidate.skills.length - 3 }}
                                        </span>
                                    </div>
                                </div>

                                <div class="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kinh
                                            nghiệm</span>
                                        <p class="text-xl font-black text-slate-900 leading-none mt-1">
                                            {{ calculateTotalExp(candidate.experience) }}<span
                                                class="text-sm ml-0.5">năm</span>
                                        </p>
                                    </div>
                                    <RouterLink :to="`/employer/talents/${candidate._id}`"
                                        class="h-11 px-6 flex items-center justify-center bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                                        Hồ sơ chi tiết
                                    </RouterLink>
                                </div>
                            </div>
                        </div>

                        <div v-else
                            class="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                            <div
                                class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <i class="fa-solid fa-user-ninja text-3xl"></i>
                            </div>
                            <h3 class="text-slate-800 font-bold text-xl">Không tìm thấy ứng viên</h3>
                            <p class="text-slate-400 mt-2 text-sm">Hãy thử điều chỉnh lại bộ lọc để có kết quả tốt hơn.
                            </p>
                            <button @click="resetFilters" class="mt-6 text-indigo-600 font-bold hover:underline">Xóa tất
                                cả lọc</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/axios"; // Sử dụng axios instance của bạn
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const loading = ref(false);
const results = ref([]);

const industryLabel = {
    it: "IT",
    sales: "Bán hàng",
    accounting: "Kế toán",
    marketing: "Marketing",
    education: "Giáo dục",
    hr: "Nhân sự",
    healthcare: "Y tế",
    production: "Sản xuất",
};

const filters = ref({
    q: "",
    skills: "",
    minExp: null,
    maxExp: null,
    industry: "",
});

// HÀM TÍNH TỔNG KINH NGHIỆM ĐỂ HIỂN THỊ
const calculateTotalExp = (expArray) => {
    if (!Array.isArray(expArray) || expArray.length === 0) return 0;

    // Nếu dữ liệu cũ vẫn là số, trả về số đó
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

const resetFilters = () => {
    filters.value = { q: "", skills: "", minExp: null, maxExp: null, industry: "" };
    fetchTalents();
};

const searchTalent = async () => {
    await fetchTalents({ ...filters.value });
};

const fetchTalents = async (filterParams = {}) => {
    try {
        loading.value = true;
        const token = localStorage.getItem("token");
        const res = await api.get("/talents/search", {
            params: filterParams,
            headers: { Authorization: `Bearer ${token}` },
        });
        results.value = res.data.data || [];
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => fetchTalents());
</script>

<style scoped>
.filter-input {
    @apply w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-700 font-bold placeholder:text-slate-300 text-xs outline-none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
<template>
    <div class="min-h-screen bg-[#F1F5F9] pt-28 pb-20 font-sans text-[#1E293B]">
        <div class="max-w-6xl mx-auto px-4">

            <div class="bg-white p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(15,23,42,0.08)] mb-10 border border-white">
                <div class="flex flex-col md:flex-row md:items-center gap-3">
                    <div class="relative flex-[1.5] group">
                        <i
                            class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 transition-colors"></i>
                        <input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
                            placeholder="Nhập công việc, công ty..."
                            class="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-0 text-sm font-bold transition-all" />
                    </div>

                    <div class="relative flex-1 group">
                        <i class="fas fa-map-marker-alt absolute left-5 top-1/2 -translate-y-1/2 text-red-500"></i>
                        <input v-model="searchLocation" @keyup.enter="handleSearch" type="text"
                            placeholder="Tỉnh / Thành phố"
                            class="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-0 text-sm font-bold transition-all" />
                    </div>

                    <button @click="handleSearch"
                        class="bg-[#0F172A] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
                        Tìm kiếm 
                    </button>
                </div>
            </div>

            <section class="mb-10">
                <div class="flex flex-wrap gap-3 justify-center">

                    <div class="filter-wrapper">
                        <select v-model="careerFilter" class="filter-pill-v3" @change="handleSearch">
                            <option value="">Ngành nghề</option>
                            <option value="it">IT</option>
                            <option value="sales">Bán hàng</option>
                            <option value="accounting">Kế toán</option>
                            <option value="marketing">Marketing</option>
                            <option value="hr">Nhân sự</option>
                            <option value="education">Giáo dục</option>
                            <option value="healthcare">Y tế</option>
                            <option value="production">Sản xuất</option>
                        </select>
                    </div>

                    <div class="filter-wrapper">
                        <select v-model="levelFilter" class="filter-pill-v3" @change="handleSearch">
                            <option value="">Cấp bậc</option>
                            <option value="Intern">Thực tập sinh</option>
                            <option value="Fresher">Mới tốt nghiệp</option>
                            <option value="Junior">Nhân viên</option>
                            <option value="Middle">Chuyên viên</option>
                            <option value="Manager">Quản lý</option>
                        </select>
                    </div>

                    <div class="filter-wrapper">
                        <select v-model="experienceFilter" class="filter-pill-v3" @change="handleSearch">
                            <option value="">Kinh nghiệm</option>
                            <option value="0-1">0-1 năm</option>
                            <option value="1-2">1-2 năm</option>
                            <option value="2-3">2-3 năm</option>
                            <option value="3-5">3-5 năm</option>
                            <option value="5+">Trên 5 năm</option>
                        </select>
                    </div>

                    <div class="filter-wrapper">
                        <select v-model="salaryFilter" class="filter-pill-v3" @change="handleSearch">
                            <option value="">Mức lương</option>
                            <option value="under7">Dưới 7 triệu</option>
                            <option value="7-10">7 - 10 triệu</option>
                            <option value="10-15">10 - 15 triệu</option>
                            <option value="15-20">15 - 20 triệu</option>
                            <option value="20+">Trên 20 triệu</option>
                        </select>
                    </div>

                    <div class="filter-wrapper">
                        <select v-model="educationFilter" class="filter-pill-v3" @change="handleSearch">
                            <option value="">Học vấn</option>
                            <option value="Trung cấp">Trung cấp</option>
                            <option value="Cao đẳng">Cao đẳng</option>
                            <option value="Đại học">Đại học</option>
                            <option value="Thạc sĩ">Thạc sĩ</option>
                            <option value="Tiến sĩ">Tiến sĩ</option>
                        </select>
                    </div>

                    <div class="filter-wrapper">
                        <select v-model="jobTypeFilter" class="filter-pill-v3" @change="handleSearch">
                            <option value="">Loại công việc</option>
                            <option value="fulltime">Toàn thời gian</option>
                            <option value="parttime">Bán thời gian</option>
                            <option value="internship">Thực tập</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>

                </div>
            </section>

            <div v-if="jobs.length === 0"
                class="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">Không tìm thấy công việc nào phù
                    hợp</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="job in jobs" :key="job._id"
                    class="group bg-white border border-transparent hover:border-blue-500 rounded-[2rem] p-6 shadow-sm hover:shadow-[0_30px_60px_rgba(15,23,42,0.1)] transition-all duration-300">

                    <div class="flex items-start gap-4">
                        <div
                            class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                            <img v-if="job.company?.logo" :src="job.company.logo" class="w-10 h-10 object-contain" />
                            <i v-else class="fas fa-building text-slate-300 text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <h3
                                class="text-lg font-black text-[#0F172A] group-hover:text-blue-600 transition-colors leading-tight mb-1">
                                <RouterLink :to="`/job/${job._id}`">{{ job.title }}</RouterLink>
                            </h3>
                            <p class="text-blue-600 text-[11px] font-black uppercase tracking-wider">
                                {{ job.company?.name || "Công ty ẩn" }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 flex flex-wrap gap-2">
                        <span
                            class="px-3 py-1.5 bg-blue-50 text-[#1E40AF] rounded-xl text-[10px] font-black border border-blue-100 uppercase">
                            <i class="fas fa-map-marker-alt mr-1 text-blue-400"></i> {{ job.location }}
                        </span>
                        <span
                            class="px-3 py-1.5 bg-emerald-50 text-[#065F46] rounded-xl text-[10px] font-black border border-emerald-100 uppercase">
                            <i class="fas fa-wallet mr-1 text-emerald-400"></i> {{ job.salary || "Thỏa thuận" }}
                        </span>
                        <span v-if="job.jobType"
                            class="px-3 py-1.5 bg-amber-50 text-[#92400E] rounded-xl text-[10px] font-black border border-amber-100 uppercase">
                            <i class="fas fa-briefcase mr-1 text-amber-400"></i> {{ job.jobType }}
                        </span>
                    </div>

                    <div class="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                        <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tin tuyển dụng
                            mới</span>
                        <RouterLink :to="`/job/${job._id}`"
                            class="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-md">
                            Xem chi tiết
                        </RouterLink>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
/* GIỮ NGUYÊN 100% LOGIC CỦA BẠN */
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const searchQuery = ref(route.query.q || "");
const searchLocation = ref(route.query.location || "");

const careerFilter = ref(route.query.career || "");
const levelFilter = ref(route.query.level || "");
const experienceFilter = ref(route.query.experience || "");
const salaryFilter = ref(route.query.salary || "");
const educationFilter = ref(route.query.education || "");
const jobTypeFilter = ref(route.query.jobType || "");

const jobs = ref([]);

const fetchJobs = async () => {
    try {
        const params = {};
        if (searchQuery.value?.trim()) params.q = searchQuery.value.trim();
        if (searchLocation.value?.trim()) params.location = searchLocation.value.trim();
        if (careerFilter.value) params.career = careerFilter.value;
        if (levelFilter.value) params.level = levelFilter.value;
        if (experienceFilter.value) params.experience = experienceFilter.value;
        if (salaryFilter.value) params.salary = salaryFilter.value;
        if (educationFilter.value) params.education = educationFilter.value;
        if (jobTypeFilter.value) params.jobType = jobTypeFilter.value;

        const res = await axios.get("http://localhost:5000/api/jobs/search", { params });
        jobs.value = res.data;
    } catch (err) {
        console.error("Lỗi fetch jobs:", err);
    }
};

const handleSearch = () => {
    const query = {};
    if (searchQuery.value?.trim()) query.q = searchQuery.value.trim();
    if (searchLocation.value?.trim()) query.location = searchLocation.value.trim();
    if (careerFilter.value) query.career = careerFilter.value;
    if (levelFilter.value) query.level = levelFilter.value;
    if (experienceFilter.value) query.experience = experienceFilter.value;
    if (salaryFilter.value) query.salary = salaryFilter.value;
    if (educationFilter.value) query.education = educationFilter.value;
    if (jobTypeFilter.value) query.jobType = jobTypeFilter.value;
    router.push({ path: route.path, query });
};

watch(() => route.query, () => {
    searchQuery.value = route.query.q || "";
    searchLocation.value = route.query.location || "";
    careerFilter.value = route.query.career || "";
    levelFilter.value = route.query.level || "";
    experienceFilter.value = route.query.experience || "";
    salaryFilter.value = route.query.salary || "";
    educationFilter.value = route.query.education || "";
    jobTypeFilter.value = route.query.jobType || "";
    fetchJobs();
});

onMounted(fetchJobs);
</script>

<style scoped>
.filter-pill-v3 {
    @apply px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-700 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer appearance-none pr-8 shadow-sm uppercase tracking-wider hover:border-blue-500;
    background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
    background-size: 0.9em;
}
</style>
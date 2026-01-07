<template>
    <div class="min-h-screen bg-[#F8FAFC]">

        <section class="bg-white border-b border-slate-100 relative overflow-hidden">
            <div
                class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30">
            </div>
            <div class="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
                <span
                    class="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
                    Directory
                </span>
                <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                    Khám phá <span class="text-indigo-600 underline decoration-indigo-200 underline-offset-8">đối tác sự
                        nghiệp</span>
                </h1>
                <p class="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    Tìm hiểu văn hóa, môi trường làm việc và cơ hội phát triển tại những doanh nghiệp hàng đầu Việt Nam.
                </p>
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-6 py-12">

            <div class="relative -mt-24 mb-16 z-20">
                <div
                    class="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 p-2 border border-slate-100 flex flex-col md:flex-row items-center gap-2">
                    <div class="flex items-center flex-1 w-full px-5 py-3">
                        <i class="fa-solid fa-magnifying-glass text-slate-400 mr-3"></i>
                        <input v-model="keyword" @input="onInput" type="text" placeholder="Tên công ty, ngành nghề..."
                            class="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-medium placeholder:text-slate-400" />
                    </div>
                    <button @click="searchCompanies"
                        class="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95">
                        Tìm kiếm 
                    </button>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-10">

                <aside class="w-full lg:w-72 space-y-8 sticky top-24 self-start">
                    <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <div class="flex items-center justify-between mb-6">
                            <h5 class="font-bold text-slate-900 flex items-center gap-2">
                                <i class="fa-solid fa-filter text-indigo-600 text-xs"></i>
                                Bộ lọc khu vực
                            </h5>
                            <button v-if="selectedLocations.length" @click="clearFilters"
                                class="text-xs text-rose-500 hover:text-rose-600 font-bold uppercase tracking-tighter">
                                Xóa bộ lọc
                            </button>
                        </div>

                        <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            <label v-for="loc in locations" :key="loc" class="flex items-center group cursor-pointer">
                                <div class="relative flex items-center">
                                    <input type="checkbox" :value="loc" v-model="selectedLocations"
                                        class="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-200 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" />
                                    <i
                                        class="fa-solid fa-check absolute text-white opacity-0 peer-checked:opacity-100 left-1 text-[10px] pointer-events-none"></i>
                                </div>
                                <span
                                    class="ml-3 text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
                                    {{ loc }}
                                </span>
                            </label>
                        </div>
                    </div>
                </aside>

                <div class="flex-1">
                    <div class="flex items-center justify-between mb-8">
                        <p class="text-slate-500 font-medium">Kết quả: <span class="text-slate-900 font-bold">{{
                                companies.length }} công ty</span></p>
                    </div>

                    <div v-if="loading" class="grid sm:grid-cols-2 gap-6">
                        <div v-for="i in 6" :key="i" class="h-40 bg-white rounded-[2rem] animate-pulse"></div>
                    </div>

                    <div v-else-if="!companies.length"
                        class="bg-white rounded-[2rem] p-20 text-center border border-dashed border-slate-200">
                        <div
                            class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <i class="fa-solid fa-building-circle-exclamation text-3xl"></i>
                        </div>
                        <p class="text-slate-500 font-bold text-lg">Oops! Không tìm thấy công ty nào.</p>
                        <p class="text-slate-400 text-sm mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                    </div>

                    <div v-else class="grid sm:grid-cols-2 gap-6">
                        <router-link v-for="company in companies" :key="company._id" :to="`/company/${company._id}`"
                            class="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all p-6 flex flex-col relative overflow-hidden">

                            <div
                                class="absolute top-0 right-0 w-2 h-0 bg-indigo-600 group-hover:h-full transition-all duration-300">
                            </div>

                            <div class="flex items-center gap-5 mb-6">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <img :src="company.logo || fallbackLogo"
                                        class="max-w-full max-h-full object-contain" />
                                </div>
                                <div class="min-w-0">
                                    <h3
                                        class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate text-lg">
                                        {{ company.name }}
                                    </h3>
                                    <p class="text-slate-400 text-xs flex items-center gap-1 mt-1">
                                        <i class="fa-solid fa-location-dot"></i>
                                        <span class="truncate">{{ company.address }}</span>
                                    </p>
                                </div>
                            </div>

                            <div class="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span
                                    class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase rounded-lg">
                                    {{ company.jobsCount || 0 }} vị trí đang tuyển
                                </span>
                                <i
                                    class="fa-solid fa-arrow-right text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"></i>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* Scrollbar tinh tế cho Sidebar */
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #c7d2fe;
}
</style>
<script setup>
import { ref, watch } from "vue";
import axios from "axios";

const keyword = ref("");
const companies = ref([]);
const loading = ref(false);
const error = ref("");
const fallbackLogo = "/default-logo.png";

const locations = [
    "Hà Nội", "Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "Huế",
    "Lai Châu", "Điện Biên", "Sơn La", "Lạng Sơn", "Cao Bằng",
    "Tuyên Quang", "Lào Cai", "Thái Nguyên", "Phú Thọ", "Bắc Ninh",
    "Hưng Yên", "Ninh Bình", "Quảng Ninh", "Thanh Hóa", "Nghệ An",
    "Hà Tĩnh", "Quảng Trị", "Quảng Ngãi", "Gia Lai", "Khánh Hòa",
    "Lâm Đồng", "Đắk Lắk", "Đồng Nai", "Tây Ninh", "Vĩnh Long",
    "Đồng Tháp", "An Giang", "Cà Mau"
];

const selectedLocations = ref([]);
let debounceTimer = null;

/* FETCH */
const fetchCompanies = async (params = {}) => {
    loading.value = true;
    error.value = "";
    try {
        const res = await axios.get("http://localhost:5000/api/companies", { params });
        companies.value = res.data || [];
    } catch {
        error.value = "Không thể tải danh sách công ty.";
        companies.value = [];
    } finally {
        loading.value = false;
    }
};

/* SEARCH + FILTER */
const searchCompanies = () => {
    const params = {};

    if (keyword.value.trim()) {
        params.search = keyword.value.trim();
    }

    if (selectedLocations.value.length) {
        params.locations = selectedLocations.value.join(",");
    }

    fetchCompanies(params);
};

/* AUTO FILTER WHEN CHECKBOX CHANGE */
watch(selectedLocations, () => {
    searchCompanies();
});

/* DEBOUNCE SEARCH */
const onInput = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchCompanies, 400);
};

/* CLEAR FILTER */
const clearFilters = () => {
    selectedLocations.value = [];
    searchCompanies();
};

/* INIT */
fetchCompanies();
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c7d2fe;
    border-radius: 4px;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

<template>
    <div class="min-h-screen bg-white font-sans text-gray-900">
        <section class="relative bg-indigo-900 py-16 md:py-24 overflow-hidden">
            <div
                class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent">
            </div>

            <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <h1 class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                    Tìm kiếm công việc <span class="text-yellow-400">phù hợp nhất</span>
                </h1>
                <p class="text-lg text-indigo-100/80 mb-10 max-w-2xl mx-auto font-medium">
                    Nền tảng kết nối ứng viên và nhà tuyển dụng nhanh chóng, hiệu quả.
                </p>

                <div
                    class="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2">
                    <div class="flex items-center flex-1 w-full px-4 py-3 md:border-r border-gray-100">
                        <i class="fa-solid fa-magnifying-glass text-indigo-500 mr-3"></i>
                        <input v-model="searchQuery" type="text" placeholder="Vị trí tuyển dụng, kỹ năng..."
                            class="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-bold" />
                    </div>
                    <div class="flex items-center flex-1 w-full px-4 py-3">
                        <i class="fa-solid fa-location-dot text-red-500 mr-3"></i>
                        <input v-model="searchLocation" type="text" placeholder="Thành phố, khu vực"
                            class="w-full bg-transparent border-none focus:ring-0 text-gray-700 font-bold" />
                    </div>
                    <button @click="handleSearch"
                        class="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all">
                        TÌM KIẾM
                    </button>
                </div>
            </div>
        </section>

        <section class="py-20 bg-slate-50">
            <div class="max-w-6xl mx-auto px-6">
                <div class="flex justify-between items-end mb-10">
                    <h2 class="text-3xl font-black text-gray-900 uppercase tracking-tight">Việc làm mới nhất</h2>
                    <router-link to="/jobs/search" class="text-indigo-600 font-black hover:underline">Xem tất
                        cả</router-link>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="job in latestJobs" :key="job._id"
                        class="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div class="flex items-center gap-4 mb-4">
                                <div class="w-14 h-14 rounded-xl border p-1 bg-white shrink-0">
                                    <img :src="job.company?.logo || 'https://placehold.co/60x60?text=Logo'"
                                        class="w-full h-full object-contain" />
                                </div>
                                <div class="min-w-0">
                                    <h3 class="text-lg font-black text-gray-900 truncate leading-tight">{{ job.title }}
                                    </h3>
                                    <p class="text-indigo-600 font-bold text-sm truncate">{{ job.company?.name }}</p>
                                </div>
                            </div>
                            <p class="text-gray-500 text-sm mb-6 line-clamp-2 h-10">{{ job.description }}</p>
                        </div>
                        <div class="pt-4 border-t border-gray-50 flex justify-between items-center text-sm font-bold">
                            <span class="text-gray-400 italic">📍 {{ job.location }}</span>
                            <span class="text-green-600">💰 {{ job.salary || "Thỏa thuận" }}</span>
                        </div>
                        <router-link :to="`/job/${job._id}`"
                            class="mt-4 block text-center py-3 bg-indigo-50 text-indigo-700 font-black rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                            Chi tiết
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-white">
            <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl font-black text-center text-gray-900 mb-12 uppercase">Khám phá ngành nghề</h2>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    <div v-for="cat in categories" :key="cat.key"
                        class="group bg-slate-50 p-6 rounded-2xl text-center hover:bg-indigo-600 transition-all cursor-pointer shadow-sm"
                        @click="searchByCategory(cat)">
                        <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">{{ cat.icon }}</div>
                        <h3 class="font-black text-gray-800 group-hover:text-white text-sm mb-1 uppercase">{{ cat.name
                            }}</h3>
                        <p class="text-indigo-500 group-hover:text-white font-bold text-xs">{{ cat.jobs || 0 }} việc làm
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-20 bg-slate-50 border-t border-gray-100">
            <div class="max-w-6xl mx-auto px-6">
                <h2 class="text-3xl font-black text-center text-gray-900 mb-12 uppercase tracking-tight">Nhà tuyển dụng
                    hàng đầu</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <router-link v-for="company in featuredCompanies" :key="company._id" :to="`/company/${company._id}`"
                        class="bg-white p-6 rounded-2xl border hover:shadow-xl transition-all text-center group">
                        <div class="h-16 flex items-center justify-center mb-4">
                            <img :src="company.logo || 'https://placehold.co/150x80?text=Logo'"
                                class="max-h-full object-contain group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 class="font-black text-gray-800 truncate">{{ company.name }}</h4>
                        <p class="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{{ company.jobsCount
                            || 0 }} việc đang tuyển</p>
                    </router-link>
                </div>
            </div>
        </section>

        <section class="py-20 bg-indigo-600 text-white text-center">
            <div class="max-w-4xl mx-auto px-6">
                <h2 class="text-3xl font-black mb-4 uppercase tracking-tighter italic">Bắt đầu sự nghiệp của bạn!</h2>
                <p class="mb-8 text-indigo-100 font-medium">Đăng ký tài khoản để không bỏ lỡ những cơ hội việc làm hấp
                    dẫn nhất.</p>
                <router-link to="/register"
                    class="inline-block bg-yellow-400 hover:bg-white text-gray-900 font-black px-12 py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest text-sm">
                    Đăng ký miễn phí
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const searchQuery = ref("");
const searchLocation = ref("");
const latestJobs = ref([]);
const featuredCompanies = ref([]);

const CATEGORY_LIST = [
    { key: "it", name: "IT - Phần mềm", icon: "💻" },
    { key: "accounting", name: "Tài chính", icon: "📊" },
    { key: "marketing", name: "Marketing", icon: "📣" },
    { key: "hr", name: "Nhân sự", icon: "👥" },
    { key: "sales", name: "Kinh doanh", icon: "🛒" },
    { key: "production", name: "Kỹ thuật", icon: "🏭" },
    { key: "education", name: "Giáo dục", icon: "🎓" },
    { key: "healthcare", name: "Y tế", icon: "⚕️" },
];

const categories = ref(CATEGORY_LIST.map(c => ({ ...c, jobs: 0 })));

const handleSearch = () =>
    router.push({ path: "/jobs/search", query: { q: searchQuery.value, location: searchLocation.value } });

const searchByCategory = (category) => {
    router.push({ path: "/jobs/search", query: { career: category.key } });
};

onMounted(async () => {
    try {
        const [jobsRes, companiesRes] = await Promise.all([
            axios.get("http://localhost:5000/api/jobs"),
            axios.get("http://localhost:5000/api/companies/featured"),
        ]);
        const jobs = jobsRes.data.jobs || [];
        latestJobs.value = jobs.slice(0, 6);
        categories.value.forEach(cat => {
            cat.jobs = jobs.filter(job => job.career === cat.key).length;
        });
        featuredCompanies.value = companiesRes.data.map(c => ({
            ...c,
            jobsCount: c.jobsCount || 0
        }));
    } catch (err) {
        console.error("Lỗi:", err);
    }
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>
<template>
  <div class="min-h-screen bg-[#F1F5F9]">
    <section class="bg-[#0F172A] pt-24 pb-16 px-4 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]"></div>

      <div class="max-w-6xl mx-auto text-center relative z-10">
        <h1 class="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight uppercase">
          Khám phá <span class="text-blue-500">việc làm</span> hàng đầu
        </h1>

        <div class="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-5xl mx-auto">
          <div class="flex items-center flex-[1.5] border-b md:border-b-0 md:border-r border-slate-100 px-4 py-2">
            <i class="fa-solid fa-magnifying-glass text-blue-600 mr-3"></i>
            <input v-model="searchQuery" @keyup.enter="applyFilter" type="text" placeholder="Vị trí, công ty..."
              class="w-full py-3 text-sm focus:outline-none font-bold text-slate-700" />
          </div>

          <div class="flex items-center flex-1 px-4 py-2">
            <i class="fa-solid fa-location-dot text-red-500 mr-3"></i>
            <select v-model="locationFilter" @change="applyFilter"
              class="w-full py-3 text-sm focus:outline-none bg-transparent font-black text-slate-700 cursor-pointer appearance-none">
              <option value="">Tất cả địa điểm</option>
              <option>Hà Nội</option>
              <option>Hồ Chí Minh</option>
              <option>Hải Phòng</option>
              <option>Đà Nẵng</option>
              <option>Cần Thơ</option>
              <option>Huế</option>
              <option>Lai Châu</option>
              <option>Điện Biên</option>
              <option>Sơn La</option>
              <option>Lạng Sơn</option>
              <option>Cao Bằng</option>
              <option>Tuyên Quang</option>
              <option>Lào Cai</option>
              <option>Thái Nguyên</option>
              <option>Phú Thọ</option>
              <option>Bắc Ninh</option>
              <option>Hưng Yên</option>
              <option>Ninh Bình</option>
              <option>Quảng Ninh</option>
              <option>Thanh Hóa</option>
              <option>Nghệ An</option>
              <option>Hà Tĩnh</option>
              <option>Quảng Trị</option>
              <option>Quảng Ngãi</option>
              <option>Gia Lai</option>
              <option>Khánh Hòa</option>
              <option>Lâm Đồng</option>
              <option>Đắk Lắk</option>
              <option>Đồng Nai</option>
              <option>Tây Ninh</option>
              <option>Vĩnh Long</option>
              <option>Đồng Tháp</option>
              <option>An Giang</option>
              <option>Cà Mau</option>
            </select>
          </div>

          <button @click="applyFilter"
            class="bg-[#FACC15] hover:bg-yellow-500 text-slate-900 font-black px-10 py-4 rounded-xl transition-all uppercase text-xs tracking-widest shadow-lg active:scale-95">
            Tìm kiếm
          </button>
        </div>
      </div>
    </section>

    <main class="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

      <aside class="lg:col-span-3 space-y-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-28">
          <div class="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
            <i class="fa-solid fa-sliders text-blue-600"></i>
            <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Bộ lọc tìm kiếm</h3>
          </div>

          <div class="space-y-5">
            <div class="filter-group">
              <label class="filter-label">Ngành nghề</label>
              <select v-model="careerFilter" class="modern-select" @change="applyFilter">
                <option value="">Chọn ngành nghề</option>
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

            <div class="filter-group">
              <label class="filter-label">Cấp bậc</label>
              <select v-model="levelFilter" class="modern-select" @change="applyFilter">
                <option value="">Chọn cấp bậc</option>
                <option value="Intern">Thực tập sinh</option>
                <option value="Fresher">Mới tốt nghiệp</option>
                <option value="Junior">Nhân viên</option>
                <option value="Middle">Chuyên viên</option>
                <option value="Manager">Quản lý</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Kinh nghiệm</label>
              <select v-model="experienceFilter" class="modern-select" @change="applyFilter">
                <option value="">Chọn kinh nghiệm</option>
                <option value="0-1">0-1 năm</option>
                <option value="1-2">1-2 năm</option>
                <option value="2-3">2-3 năm</option>
                <option value="3-5">3-5 năm</option>
                <option value="5+">Trên 5 năm</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Mức lương</label>
              <select v-model="salaryFilter" class="modern-select" @change="applyFilter">
                <option value="">Chọn mức lương</option>
                <option value="under7">Dưới 7 triệu</option>
                <option value="7-10">7 - 10 triệu</option>
                <option value="10-15">10 - 15 triệu</option>
                <option value="15-20">15 - 20 triệu</option>
                <option value="20+">Trên 20 triệu</option>
                <option value="negotiable">Thỏa thuận</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Học vấn</label>
              <select v-model="educationFilter" class="modern-select" @change="applyFilter">
                <option value="">Chọn học vấn</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Đại học">Đại học</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Loại công việc</label>
              <select v-model="jobTypeFilter" class="modern-select" @change="applyFilter">
                <option value="">Chọn loại công việc</option>
                <option value="fulltime">Toàn thời gian</option>
                <option value="parttime">Bán thời gian</option>
                <option value="internship">Thực tập</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <button @click="resetFilters"
            class="w-full mt-6 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
            Xóa tất cả bộ lọc
          </button>
        </div>
      </aside>

      <div class="lg:col-span-9 space-y-5">
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl">
          <div class="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="jobs.length" class="space-y-4">
          <div v-for="job in jobs" :key="job._id"
            class="group bg-white border border-transparent hover:border-blue-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row gap-6 items-center">

            <div
              class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 group-hover:scale-105 transition-transform shrink-0">
              <img :src="job.company?.logo || '/default-logo.png'" class="max-w-full max-h-full object-contain" />
            </div>

            <div class="flex-1 min-w-0 text-center md:text-left">
              <h3 class="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                <RouterLink :to="`/job/${job._id}`">{{ job.title }}</RouterLink>
              </h3>
              <p class="text-blue-600 text-[11px] font-black uppercase tracking-[0.1em] mt-1">
                {{ job.company?.name || "Công ty ẩn" }} <span class="text-slate-300 mx-2">•</span> {{ job.location }}
              </p>

              <p class="text-slate-500 text-sm mt-3 line-clamp-1 font-medium">{{ job.description }}</p>

              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <span
                  class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase border border-slate-200">{{
                  job.level }}</span>
                <span
                  class="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase border border-emerald-100">{{
                  job.salary }}</span>
                <span
                  class="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg uppercase border border-blue-100">{{
                  job.jobType }}</span>
              </div>
            </div>

            <RouterLink :to="`/job/${job._id}`"
              class="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 shadow-md transition-all shrink-0">
              Chi tiết
            </RouterLink>
          </div>
        </div>

        <div v-else class="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-slate-200">
          <p class="text-slate-400 font-black uppercase tracking-widest text-sm">Không tìm thấy công việc phù hợp</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const searchQuery = ref(route.query.q || "");
const locationFilter = ref(route.query.location || "");
const careerFilter = ref(route.query.career || "");
const levelFilter = ref(route.query.level || "");
const experienceFilter = ref(route.query.experience || "");
const salaryFilter = ref(route.query.salary || "");
const educationFilter = ref(route.query.education || "");
const jobTypeFilter = ref(route.query.jobType || "");

const jobs = ref([]);
const loading = ref(false);

const fetchJobs = async () => {
  loading.value = true;
  try {
    const res = await axios.get("http://localhost:5000/api/jobs/search", { params: route.query });
    jobs.value = res.data;
  } catch (err) { console.error(err); }
  finally { loading.value = false; }
};

const applyFilter = () => {
  const query = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (locationFilter.value) query.location = locationFilter.value;
  if (careerFilter.value) query.career = careerFilter.value;
  if (levelFilter.value) query.level = levelFilter.value;
  if (experienceFilter.value) query.experience = experienceFilter.value;
  if (salaryFilter.value) query.salary = salaryFilter.value;
  if (educationFilter.value) query.education = educationFilter.value;
  if (jobTypeFilter.value) query.jobType = jobTypeFilter.value;
  router.push({ path: route.path, query });
};

const resetFilters = () => {
  router.push({ path: route.path });
}

watch(() => route.query, fetchJobs, { immediate: true });
</script>

<style scoped>
.modern-select {
  @apply w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer px-4 uppercase tracking-wider appearance-none;
  background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%233b82f6' stroke-width='3' viewBox='0 0 24 24'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 0.8em;
}

.filter-label {
  @apply block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1;
}

.filter-group {
  @apply space-y-1;
}
</style>
<template>
  <div class="bg-slate-50 min-h-screen pb-20 font-sans">

    <section class="relative bg-[#0F172A] pt-24 pb-20 overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[100px]"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center md:items-end gap-8">
          <div class="shrink-0">
            <img :src="company.logo || '/default-logo.png'" alt="Logo"
              class="w-32 h-32 object-contain bg-white rounded-2xl border-[6px] border-white/10 shadow-2xl shadow-black/20" />
          </div>

          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
              <span
                class="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider border border-indigo-500/30">
                Đối tác uy tín
              </span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {{ company.name || 'Tên công ty' }}
            </h1>
            <div class="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-300">
              <span class="flex items-center gap-2">
                <i class="fa-solid fa-briefcase text-indigo-400"></i>
                {{ company.industry || company.field || 'Ngành nghề' }}
              </span>
              <span v-if="company.address" class="flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-rose-400"></i>
                {{ company.address.split(',').pop() }} </span>
            </div>
          </div>

          <div class="hidden lg:block">
            <a v-if="company.website" :href="company.website" target="_blank"
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all font-bold flex items-center gap-2">
              Truy cập Website <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto -mt-0 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span class="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Thông tin chung
          </h2>

          <div v-if="loading" class="animate-pulse space-y-4">
            <div class="h-4 bg-slate-100 rounded w-3/4"></div>
            <div class="h-4 bg-slate-100 rounded"></div>
            <div class="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>

          <div v-else class="space-y-6">
            <div class="space-y-4 text-slate-600">
              <div class="flex gap-4 group">
                <div
                  class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                  <i class="fa-solid fa-map-location-dot text-indigo-500"></i>
                </div>
                <div>
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Địa chỉ</p>
                  <p class="text-sm font-medium text-slate-700 leading-snug">{{ company.address || "Đang cập nhật" }}
                  </p>
                </div>
              </div>
              <div v-if="company.email" class="flex gap-4 group">
                <div
                  class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                  <i class="fa-solid fa-envelope text-indigo-500"></i>
                </div>
                <div>
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email liên hệ</p>
                  <a :href="`mailto:${company.email}`"
                    class="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                    {{ company.email }}
                  </a>
                </div>
              </div>

              <div v-if="company.website" class="flex gap-4 group">
                <div
                  class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                  <i class="fa-solid fa-globe text-indigo-500"></i>
                </div>
                <div>
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Website công ty</p>
                  <a :href="company.website" target="_blank"
                    class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                    {{ company.website.replace(/^https?:\/\//, '') }}
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>
            </div>

            <hr class="border-slate-100" />

            <div>
              <h3 class="text-sm font-bold text-slate-900 mb-3">Giới thiệu</h3>
              <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {{ company.description || "Chưa có mô tả chi tiết" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
       <div class="flex justify-between items-center mb-2 mt-4">
          <h2 class="text-xl font-bold text-slate-900">
            Việc làm đang tuyển
          </h2>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="h-48 bg-white rounded-3xl animate-pulse"></div>
        </div>

        <div v-else-if="filteredJobs.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="job in filteredJobs" :key="job._id"
            class="group bg-white rounded-[2rem] border border-slate-100 p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">

            <div class="flex justify-between items-start mb-4">
           <div
                class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100">
                <span v-if="job.salary">
                  {{ job.salary }} triệu
                </span>
                <span v-else>
                  Thỏa thuận
                </span>
              </div>
            </div>

            <h3
              class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
              {{ job.title }}
            </h3>

            <div class="flex flex-wrap gap-y-2 text-slate-500 text-sm mb-5">
              <span class="w-1/2 flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-slate-300"></i> {{ job.location || "Toàn quốc" }}
              </span>
              <span class="w-1/2 flex items-center gap-2">
                <i class="fa-solid fa-clock text-slate-300"></i> {{ new Date(job.expiresAt).toLocaleDateString('vi-VN')
                }}
              </span>
            </div>

            <router-link :to="`/job/${job._id}`"
              class="block text-center w-full py-3 bg-slate-50 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white font-bold rounded-xl transition-all border border-slate-100 group-hover:border-indigo-600">
              Xem chi tiết
            </router-link>
          </div>
        </div>

        <div v-else class="bg-white rounded-[2rem] p-16 text-center border border-dashed border-slate-300">
          <div
            class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
            <i class="fa-solid fa-box-open"></i>
          </div>
          <p class="text-slate-500 font-medium text-lg">Hiện tại công ty chưa có vị trí đang tuyển</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const company = ref({});
const loading = ref(true);
const error = ref("");

// Filter chỉ job approved và chưa hết hạn
const filteredJobs = computed(() => {
  return (company.value.jobs || []).filter(
    (j) => j.status === "approved" && new Date(j.expiresAt) > new Date()
  );
});

onMounted(async () => {
  const companyId = route.params.id;
  try {
    const res = await axios.get(`http://localhost:5000/api/companies/${companyId}`);
    company.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = "Không thể tải thông tin công ty";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>

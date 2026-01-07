<template>
    <EmployerLayout>
        <div class="p-6 pt-4 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div class="max-w-6xl mx-auto">

                <!-- HEADER -->
                <header
                    class="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="flex items-center gap-6">
                        <div class="relative">
                            <img :src="avatar || '/avatar-default.png'"
                                class="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
                                @error="onAvatarError" />
                            <div
                                class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full">
                            </div>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-slate-800 tracking-tight">{{ employer.name }}</h2>
                            <p class="text-slate-500 text-sm">{{ employer.email }}</p>
                            <div
                                class="mt-2 flex items-center text-indigo-600 font-semibold text-[11px] uppercase tracking-wider">
                                <i class="fa-solid fa-calendar-check mr-2"></i> Thành viên: {{
                                    formatDate(employer.joinDate) }}
                            </div>
                        </div>
                    </div>

                    <router-link to="/employer/post-job"
                        class="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 flex items-center gap-2">
                        <i class="fa-solid fa-plus text-xs"></i> Đăng tin mới
                    </router-link>
                </header>

                <!-- STATS -->
                <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div
                        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-briefcase text-sm"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang kích hoạt
                                </p>
                                <p class="text-2xl font-extrabold text-slate-800 leading-none mt-1">{{ stats.activeJobs
                                    }}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-user-plus text-sm"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chờ duyệt</p>
                                <p class="text-2xl font-extrabold text-slate-800 leading-none mt-1">{{
                                    stats.newApplicants }}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-coins text-sm"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tín dụng còn
                                </p>
                                <p class="text-2xl font-extrabold text-slate-800 leading-none mt-1">{{ stats.credits }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- RECENT APPLICATIONS -->
                <section class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-bold text-slate-800">Ứng tuyển gần đây</h3>
                        <router-link to="/employer/applicants"
                            class="text-xs font-bold text-indigo-600 hover:text-indigo-700">Xem tất cả</router-link>
                    </div>

                    <div v-if="recentApplications.length" class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr
                                    class="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] border-b border-slate-50">
                                    <th class="pb-4 px-2">Ứng viên</th>
                                    <th class="pb-4 px-2">Vị trí</th>
                                    <th class="pb-4 px-2 text-right">Ngày gửi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="(app, index) in recentApplications" :key="index"
                                    class="hover:bg-slate-50 transition-colors">
                                    <td class="py-4 px-2">
                                        <div class="font-bold text-slate-700 text-sm">{{ app.candidate || "N/A" }}</div>
                                    </td>
                                    <td class="py-4 px-2">
                                        <span
                                            class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">
                                            {{ app.position || "N/A" }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-2 text-right text-slate-400 text-xs font-medium">
                                        {{ formatDate(app.date) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-center py-12">
                        <p class="text-slate-400 text-sm font-medium italic">Chưa có đơn ứng tuyển mới</p>
                    </div>
                </section>
            </div>
        </div>
    </EmployerLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import EmployerLayout from "@/layouts/EmployerLayout.vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";

const toast = useToast();
const auth = useAuthStore();

// ================= STATE =================
const employer = ref({
    name: "",
    email: "",
    joinDate: "",
});
const avatar = ref("/avatar-default.png"); // avatar realtime
const stats = ref({ activeJobs: 0, newApplicants: 0, credits: 0 });
const recentApplications = ref([]);

// ================= HELPERS =================
function formatDate(dateStr) {
    if (!dateStr) return "Không rõ";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Không rõ" : date.toLocaleDateString("vi-VN");
}

function onAvatarError(e) {
    e.target.src = "/avatar-default.png";
}

// ================= MAP DATA =================
function mapProfileData(data) {
    employer.value = {
        name: data.companyName || data.name || "Công ty chưa cập nhật",
        email: data.email || "Chưa có email",
        joinDate: data.createdAt || new Date().toISOString(),
    };
    avatar.value = data.avatar || "/avatar-default.png";
}

// ================= FETCH DASHBOARD =================
async function fetchDashboard() {
    try {
        // 1️⃣ Lấy profile mới nhất
        const { data: profile } = await api.get("/employer/profile");
        mapProfileData(profile);

        // 2️⃣ Lấy stats + recent applications
        const { data } = await api.get("/employer/dashboard");
        stats.value.activeJobs = data.activeJobs ?? 0;
        stats.value.newApplicants = data.newApplicants ?? 0;
        stats.value.credits = data.credits ?? 0;
        recentApplications.value = Array.isArray(data.recentApplications) ? data.recentApplications : [];

        // 3️⃣ Update store luôn (để avatar realtime ở profile/dashboard)
        auth.user.avatar = profile.avatar;
    } catch (err) {
        console.error("Lỗi lấy dashboard:", err);
        toast.error("Không thể tải dashboard");
    }
}

// ================= ON MOUNT =================
onMounted(async () => {
    if (!auth.token) await auth.fetchUser();
    if (auth.isLoggedIn && auth.userRole === "employer") {
        fetchDashboard();
    }
});
</script>

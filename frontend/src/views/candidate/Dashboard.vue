<template>
    <nav
        class="bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <RouterLink to="/candidate/home" @click="loadAll" class="flex items-center space-x-3 group">
            <img src="/logo.png" alt="Logo" class="w-9 h-9 object-contain group-hover:scale-110 transition-transform" />
            <span class="text-xl font-black text-slate-900 tracking-tighter uppercase">
                Job<span class="text-indigo-600">Link</span>
            </span>
        </RouterLink>

        <div class="hidden lg:flex items-center space-x-2 w-full max-w-2xl mx-8">
            <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 flex items-center shadow-sm">
                <i class="fa-solid fa-magnifying-glass text-slate-400 mr-3 text-sm"></i>
                <input type="text" placeholder="Vị trí, công ty..."
                    class="w-full bg-transparent outline-none text-sm font-bold text-slate-700" v-model="searchQuery"
                    @keyup.enter="handleSearch" />
            </div>
            <div class="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 h-11 flex items-center shadow-sm">
                <i class="fa-solid fa-location-dot text-slate-400 mr-3 text-sm"></i>
                <input type="text" placeholder="Địa điểm"
                    class="w-full bg-transparent outline-none text-sm font-bold text-slate-700" v-model="searchLocation"
                    @keyup.enter="handleSearch" />
            </div>
            <button @click="handleSearch"
                class="bg-slate-900 text-white px-6 h-11 rounded-xl hover:bg-indigo-600 transition-all text-xs font-black uppercase tracking-widest active:scale-95">Tìm
                kiếm</button>
        </div>

        <div class="flex items-center gap-6 whitespace-nowrap">
            <div class="relative group">
                <div @click="toggleNotifications"
                    class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-indigo-50 border border-slate-100">
                    <i class="fa-solid fa-bell text-slate-600 text-lg"></i>
                </div>
                <span v-if="notificationCount > 0"
                    class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {{ notificationCount }}
                </span>

                <div v-if="showNotifications"
                    class="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
                    <div
                        class="p-4 font-black text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50">
                        Trung tâm thông báo</div>
                    <div class="max-h-80 overflow-y-auto">
                        <div v-if="notifications.length === 0"
                            class="p-6 text-center text-slate-300 font-bold text-xs uppercase italic">Hộp thư trống
                        </div>
                        <ul>
                            <li v-for="n in notifications" :key="n._id"
                                class="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all"
                                @click="markNotificationRead(n)">
                                <div class="text-sm font-bold text-slate-800 leading-snug"
                                    :class="{ 'opacity-50': n.isRead }">{{ n.message }}</div>
                                <div class="text-[9px] font-black text-indigo-400 uppercase mt-2 tracking-tighter">{{
                                    formatDate(n.createdAt) }}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <button @click="handleLogout" :disabled="isLoggingOut"
                class="flex items-center space-x-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95">
                <i class="fa-solid fa-right-from-bracket text-slate-400 group-hover:text-rose-500"></i>
                <span>{{ isLoggingOut ? "..." : "Đăng xuất" }}</span>
            </button>
        </div>
    </nav>

    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-20 px-6 font-sans text-slate-900">
        <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">

            <div
                class="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                <div class="flex items-center space-x-6 relative z-10">
                    <img :src="avatarUrl" alt="Avatar"
                        class="w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl object-cover ring-1 ring-slate-100" />
                    <div>
                        <p class="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Hồ sơ ứng viên
                        </p>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tighter leading-none">{{ auth.user?.name
                            || "Ứng viên" }}</h2>
                        <p
                            class="text-slate-400 font-bold text-sm mt-2 italic underline decoration-indigo-200 underline-offset-4">
                            {{ auth.user?.email }}</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-3 relative z-10">
                    <RouterLink to="/candidate/profile"
                        class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-id-card"></i> Xem hồ sơ
                    </RouterLink>
                    <RouterLink to="/candidate/profile/edit"
                        class="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                        <i class="fa-solid fa-user-pen"></i> Chỉnh sửa
                    </RouterLink>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <RouterLink v-for="(val, key) in statDisplay" :key="key" :to="val.link"
                    class="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-300 hover:shadow-xl transition-all group text-center flex flex-col items-center relative">

                    <span v-if="key === 'invitations' && stats[key] > 0" class="absolute top-4 right-4 flex h-3 w-3">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>

                    <p class="text-3xl font-black tracking-tighter group-hover:scale-110 transition-transform"
                        :class="val.color">
                        {{ stats[key] || 0 }}
                    </p>
                    <p class="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-3">
                        {{ val.label }}
                    </p>
                </RouterLink>

                <RouterLink to="/candidate/cvs"
                    class="bg-slate-900 p-6 rounded-[2rem] hover:bg-indigo-600 transition-all group relative overflow-hidden flex flex-col items-center justify-center">
                    <div class="relative z-10 text-center text-white">
                        <p
                            class="text-2xl font-black tracking-tighter group-hover:scale-110 transition-transform italic">
                            CV</p>
                        <p class="text-[8px] text-white/50 font-black uppercase tracking-[0.2em] mt-3">Năng lực</p>
                    </div>
                </RouterLink>
            </div>

            <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-black text-slate-900 uppercase tracking-tighter">Hoạt động ứng tuyển gần đây
                    </h3>
                    <RouterLink to="/candidate/applied-jobs"
                        class="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Xem tất
                        cả</RouterLink>
                </div>

                <div v-if="recentApplications.length === 0"
                    class="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <img src="/no-data.png" alt="No data" class="w-16 opacity-20 mb-4 grayscale" />
                    <p class="text-slate-400 font-black text-[9px] uppercase tracking-widest italic">Hệ thống chưa ghi
                        nhận hồ sơ</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="app in recentApplications" :key="app._id"
                        class="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between h-40">
                        <div>
                            <h4
                                class="text-md font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
                                {{ app.jobId?.title || "N/A" }}</h4>
                            <div
                                class="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                <span>{{ app.jobId?.location }}</span>
                                <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span class="text-emerald-600 font-black">{{ app.jobId?.salary }}</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-4">
                            <span
                                class="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:text-indigo-600 transition-all">{{
                                formatStatus(app.status) }}</span>
                            <span
                                class="text-slate-200 group-hover:text-indigo-300 transition-all transform group-hover:translate-x-1">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";

const router = useRouter();
const auth = useAuthStore();
const isLoggingOut = ref(false);

const stats = ref({ viewed: 0, saved: 0, applied: 0, invitations: 0 });

// Giữ nguyên 4 ô này + 1 ô CV ở template = 5 ô
const statDisplay = {
    viewed: { label: "Lượt xem hồ sơ", link: "/candidate/profile/viewed", color: "text-indigo-600" },
    saved: { label: "Việc đã lưu", link: "/candidate/saved-jobs", color: "text-purple-600" },
    applied: { label: "Việc đã nộp", link: "/candidate/applied-jobs", color: "text-amber-600" },
    invitations: { label: "Lời mời mới", link: "/candidate/invitations", color: "text-rose-600" }
};

const recentApplications = ref([]);
const notifications = ref([]);
const notificationCount = ref(0);
const showNotifications = ref(false);
const searchQuery = ref("");
const searchLocation = ref("");

const toggleNotifications = () => showNotifications.value = !showNotifications.value;
const avatarUrl = computed(() => auth.user?.avatar ? `${auth.user.avatar}` : "/avatar-default.png");

const fetchStats = async () => {
    try {
        const [statsRes, appsRes] = await Promise.all([
            api.get("/candidate/stats"),
            api.get("/applications")
        ]);
        const inviteCount = (appsRes.data || []).filter(app => app.status === 'invited').length;
        stats.value = {
            viewed: statsRes.data.viewed || 0,
            saved: statsRes.data.saved || 0,
            applied: statsRes.data.applied || 0,
            invitations: inviteCount
        };
    } catch (e) { console.error(e); }
};

const fetchApplications = async () => {
    try {
        const res = await api.get("/applications");
        recentApplications.value = (res.data || []).filter(app => app.status !== 'invited').slice(0, 4);
    } catch (e) { }
};

const fetchNotifications = async () => {
    try {
        const res = await api.get("/notifications");
        notifications.value = res.data || [];
        notificationCount.value = notifications.value.filter(n => !n.isRead).length;
    } catch (err) { }
};

const markNotificationRead = async (n) => {
    try {
        await api.post(`/candidate/notifications/${n._id}/read`);
        if (n.message.toLowerCase().includes('mời')) router.push("/candidate/invitations");
        await fetchNotifications();
        showNotifications.value = false;
    } catch (err) { }
};

const handleSearch = () => {
    router.push({ path: "/jobs/search", query: { q: searchQuery.value, location: searchLocation.value } });
};

const formatStatus = (s) => {
    const m = { 'applied': 'Đã nộp', 'reviewed': 'Đã xem', 'interview': 'Phỏng vấn', 'accepted': 'Đã nhận', 'rejected': 'Từ chối' };
    return m[s] || s;
};

const formatDate = (ds) => {
    const d = new Date(ds);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} • ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const loadAll = async () => { await Promise.all([fetchStats(), fetchApplications(), fetchNotifications()]); };

onMounted(async () => {
    try {
        await auth.fetchUser();
        await loadAll();
    } catch (err) { if (err.response?.status === 401) router.push("/login"); }
});

onBeforeRouteUpdate(async (to, from, next) => {
    if (to.path === "/candidate/dashboard") await loadAll();
    next();
});

const handleLogout = () => {
    isLoggingOut.value = true;
    setTimeout(() => { auth.logout(); router.push("/login"); isLoggingOut.value = false; }, 500);
};
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
</style>
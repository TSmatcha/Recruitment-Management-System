<template>
    <AdminLayout pageTitle="Hệ thống">
        <div class="mb-12 animate-fade-in">
            <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Bảng <span class="text-indigo-600">Điều khiển</span>
            </h1>
            <p class="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                <span class="w-8 h-[2px] bg-slate-200"></span>
                Tổng quan hiệu suất hệ thống JobLink
            </p>
        </div>

        <div v-if="loading"
            class="py-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang trích xuất dữ liệu...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">

            <button @click="goTo('users')" class="metric-card group">
                <div class="flex flex-col items-start space-y-1">
                    <p class="metric-label group-hover:text-indigo-600 transition-colors">Người dùng</p>
                    <p class="metric-number text-slate-900">{{ stats.users }}</p>
                </div>
            
                <span
                    class="absolute -right-4 -bottom-6 text-slate-50 text-7xl font-black select-none group-hover:text-indigo-50/50 transition-colors">USER</span>
            </button>

            <button @click="goTo('jobs')" class="metric-card group">
                <div class="flex flex-col items-start space-y-1">
                    <p class="metric-label group-hover:text-amber-600 transition-colors">Tin chờ duyệt</p>
                    <p class="metric-number text-slate-900">{{ stats.pendingJobs }}</p>
                </div>
                
                <span
                    class="absolute -right-4 -bottom-6 text-slate-50 text-7xl font-black select-none group-hover:text-amber-50/50 transition-colors">WORK</span>
            </button>

            <button @click="goTo('companies')" class="metric-card group">
                <div class="flex flex-col items-start space-y-1">
                    <p class="metric-label group-hover:text-emerald-600 transition-colors">Công ty</p>
                    <p class="metric-number text-slate-900">{{ stats.companies }}</p>
                </div>
               
                <span
                    class="absolute -right-4 -bottom-6 text-slate-50 text-7xl font-black select-none group-hover:text-emerald-50/50 transition-colors">CORP</span>
            </button>

        </div>
    </AdminLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import AdminLayout from "@/layouts/AdminLayout.vue";

const router = useRouter();
const loading = ref(true);
const stats = reactive({
    users: 0,
    pendingJobs: 0,
    companies: 0,
});

onMounted(async () => {
    try {
        const [usersRes, jobsRes, companiesRes] = await Promise.all([
            api.get("/admin/users"),
            api.get("/admin/jobs"),
            api.get("/admin/companies"),
        ]);

        const users = usersRes.data || [];
        const jobs = jobsRes.data || [];
        const companies = companiesRes.data || [];

        stats.users = users.length;
        stats.pendingJobs = jobs.filter((j) => j.status === "pending").length;
        stats.companies = companies.length;
    } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
    } finally {
        loading.value = false;
    }
});

const goTo = (type) => {
    router.push(`/admin/${type}`);
};
</script>

<style scoped>
.metric-card {
    @apply relative w-full bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-start justify-between min-h-[180px] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 active:scale-[0.98];
}

.metric-label {
    @apply text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 relative z-10;
}

.metric-number {
    @apply text-6xl font-black tracking-tighter relative z-10;
}

.metric-status {
    @apply px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border relative z-10 mt-4;
}

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

button:focus {
    @apply outline-none;
}
</style>
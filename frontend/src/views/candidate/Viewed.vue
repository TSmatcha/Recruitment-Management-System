<template>
    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6">
        <div class="max-w-4xl mx-auto">

            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Lượt xem <span class="text-indigo-600">Hồ sơ</span>
                    </h1>
                    <p class="text-slate-500 mt-1 font-medium italic">
                        Những nhà tuyển dụng đang quan tâm đến năng lực của bạn.
                    </p>
                </div>
                <div v-if="viewedList.length > 0" class="bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                    <span class="text-indigo-600 font-black text-lg">{{ viewedList.length }}</span>
                    <span class="text-indigo-400 text-[10px] font-black uppercase tracking-widest ml-2">Lượt xem</span>
                </div>
            </div>

            <div v-if="loading"
                class="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                <i class="fa-solid fa-circle-notch animate-spin text-3xl text-indigo-600"></i>
                <p class="mt-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest">Đang trích xuất dữ
                    liệu...</p>
            </div>

            <div v-else-if="error"
                class="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] text-rose-600 text-center animate-fade-in">
                <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                <p class="font-bold uppercase text-xs tracking-widest">{{ error }}</p>
            </div>

            <div v-else-if="viewedList.length === 0"
                class="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fa-regular fa-eye-slash text-slate-300 text-3xl"></i>
                </div>
                <h3 class="text-slate-800 font-bold text-lg">Chưa có lượt xem nào</h3>
                <p class="text-slate-400 text-sm mt-2">Đừng lo lắng, hãy tối ưu lại từ khóa hồ sơ để thu hút nhà tuyển
                    dụng hơn.</p>
            </div>

            <div v-else class="space-y-4 animate-fade-in">
                <div v-for="item in viewedList" :key="item._id"
                    @click="$router.push({ name: 'EmployerDetail', params: { id: item.employerId } })"
                    class="group bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center justify-between hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all cursor-pointer">

                    <div class="flex items-center gap-5">
                        <div
                            class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                            {{ item.companyName?.charAt(0).toUpperCase() }}
                        </div>

                        <div>
                            <h3
                                class="font-bold text-slate-800 text-lg leading-none group-hover:text-indigo-600 transition-colors">
                                {{ item.companyName }}
                            </h3>
                            <div class="flex items-center gap-2 mt-2">
                                <span
                                    class="px-2.5 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                                    Nhà tuyển dụng
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="text-right">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thời gian xem
                        </p>
                        <p class="text-sm font-bold text-slate-600">
                            {{ formatDate(item.dateViewed) }}
                        </p>
                    </div>
                </div>
            </div>

            <p v-if="viewedList.length > 0"
                class="mt-10 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Dữ liệu được cập nhật tự động sau mỗi 5 giây
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const viewedList = ref([]);
const loading = ref(true);
const error = ref("");

// Format ngày giờ chuyên nghiệp hơn
const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} • ${hours}:${minutes}`;
};

const fetchViewed = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/candidate/viewed", {
            headers: { Authorization: `Bearer ${auth.token}` },
        });

        viewedList.value = res.data.map(v => ({
            _id: v._id,
            employerId: v.employerId?._id || v.employerId,
            companyName: v.companyName,
            dateViewed: v.dateViewed,
        }));
    } catch (err) {
        console.error(err);
        error.value = "Hệ thống gặp sự cố khi tải danh sách lượt xem.";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchViewed();
    const interval = setInterval(fetchViewed, 5000);
    onUnmounted(() => clearInterval(interval));
});
</script>

<style scoped>
@keyframes fade-in {
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
    animation: fade-in 0.4s ease-out forwards;
}

/* Ẩn scrollbar cho Chrome/Safari */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f8fafc;
}

::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
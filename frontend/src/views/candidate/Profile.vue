<template>
    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-6 font-sans text-slate-900">
        <div class="max-w-5xl mx-auto">

            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Hồ sơ <span
                            class="text-indigo-600">của tôi</span></h1>
                    <p class="text-slate-500 mt-2 font-medium italic">Quản lý thông tin cá nhân và năng lực chuyên môn
                        của bạn.</p>
                </div>
            </div>

            <div v-if="loading"
                class="bg-white rounded-[2.5rem] p-24 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Đang trích xuất dữ liệu...
                </p>
            </div>

            <div v-else class="space-y-8 animate-fade-in">

                <div
                    class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <div class="relative group">
                            <img :src="profile.avatar || '/default-avatar.png'"
                                class="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl object-cover ring-1 ring-slate-100" />
                            <div
                                class="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 border-4 border-white rounded-full shadow-sm">
                            </div>
                        </div>

                        <div class="text-center md:text-left">
                            <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tighter">{{ profile.name }}
                            </h2>
                            <p
                                class="text-indigo-600 font-bold text-sm mt-1 flex items-center justify-center md:justify-start gap-2">
                                <i class="fa-solid fa-envelope opacity-60"></i> {{ profile.email }}
                            </p>
                            <div class="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                <span
                                    class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                    {{ industryLabel[profile.industry] || 'Tự do' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <RouterLink to="/candidate/profile/edit"
                        class="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3">
                        <i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa hồ sơ
                    </RouterLink>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div class="lg:col-span-2 space-y-8">
                        <div class="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-12">

                            <div>
                                <h3
                                    class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span class="w-8 h-[1px] bg-slate-200"></span> Thông tin cá nhân
                                </h3>
                                <div class="grid sm:grid-cols-2 gap-6">
                                    <div v-for="(item, index) in basicInfo" :key="index"
                                        class="flex items-center gap-4 group">
                                        <div
                                            class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            <i :class="item.icon"></i>
                                        </div>
                                        <div>
                                            <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">{{
                                                item.label }}</p>
                                            <p class="font-bold text-slate-700 text-sm">{{ item.value }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3
                                    class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span class="w-8 h-[1px] bg-slate-200"></span> Học vấn & Chuyên môn
                                </h3>
                                <div v-if="profile.education?.length" class="space-y-4">
                                    <div v-for="(edu, index) in profile.education" :key="index"
                                        class="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 border-dashed">
                                        <div class="flex justify-between items-start">
                                            <div>
                                                <p class="text-indigo-900 font-black text-base">{{ edu.school }}</p>
                                                <p class="text-indigo-600 font-bold text-sm">{{ edu.degree }}</p>
                                            </div>
                                            <span
                                                class="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                                                {{ edu.startYear }} - {{ edu.endYear || 'Nay' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p v-else class="text-slate-300 italic text-sm">Chưa cập nhật học vấn</p>
                            </div>

                            <div>
                                <h3
                                    class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span class="w-8 h-[1px] bg-slate-200"></span> Kinh nghiệm làm việc
                                </h3>
                                <div v-if="profile.experience?.length" class="space-y-8">
                                    <div v-for="(exp, index) in profile.experience" :key="index"
                                        class="relative pl-8 border-l-2 border-slate-100 pb-2">
                                        <div
                                            class="absolute -left-[9px] top-0 w-4 h-4 bg-white border-4 border-indigo-600 rounded-full">
                                        </div>
                                        <p class="text-slate-900 font-black text-base">{{ exp.position }}</p>
                                        <p class="text-indigo-600 font-bold text-sm">{{ exp.companyName }}</p>
                                        <p class="text-slate-400 text-[9px] font-bold mt-1 uppercase">
                                            {{ formatDate(exp.startDate) }} — {{ exp.endDate ? formatDate(exp.endDate) :
                                            'Hiện tại' }}
                                        </p>
                                        <p class="text-slate-500 text-xs mt-3 leading-relaxed">{{ exp.description }}</p>
                                    </div>
                                </div>
                                <p v-else class="text-slate-300 italic text-sm">Chưa có kinh nghiệm thực chiến</p>
                            </div>

                            <div>
                                <h3
                                    class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span class="w-8 h-[1px] bg-slate-200"></span> Kỹ năng cốt lõi
                                </h3>
                                <div v-if="profile.skills?.length" class="flex flex-wrap gap-2">
                                    <span v-for="(skill, i) in profile.skills" :key="i"
                                        class="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 border border-slate-200 shadow-sm uppercase">
                                        {{ skill }}
                                    </span>
                                </div>
                                <p v-else class="text-slate-300 italic text-sm">Chưa cập nhật kỹ năng</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-8">
                        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-xs font-black text-slate-700 uppercase tracking-widest">Trạng thái hồ sơ
                                </p>
                                <button @click="toggleProfilePublic"
                                    class="relative w-12 h-6 rounded-full transition-all"
                                    :class="profile.isProfilePublic ? 'bg-emerald-500' : 'bg-slate-300'">
                                    <span class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all"
                                        :class="profile.isProfilePublic ? 'translate-x-6' : ''"></span>
                                </button>
                            </div>
                            <p class="text-[10px] text-slate-400 leading-relaxed">{{ profile.isProfilePublic ? 'Hồ sơ đang ở chế độ công khai cho nhà tuyển dụng.' : 'Hồ sơ đang ẩn với nhà tuyển dụng.' }}
                            </p>
                        </div>

                        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">CV đính
                                kèm</h3>
                            <div v-if="profile.cv" class="text-center group">
                                <div
                                    class="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500 text-3xl transition-transform group-hover:scale-110">
                                    <i class="fa-solid fa-file-pdf"></i>
                                </div>
                                <p class="text-xs font-black text-slate-700 uppercase mb-1">Curriculum Vitae</p>
                                <a :href="profile.cv" target="_blank"
                                    class="block w-full py-3 mt-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                                    Xem / Tải CV
                                </a>
                            </div>
                            <div v-else class="p-6 bg-rose-50 rounded-3xl border border-rose-100 text-center">
                                <p class="text-[9px] font-black text-rose-400 uppercase mb-4">Chưa có CV đính kèm</p>
                                <RouterLink to="/candidate/profile/edit"
                                    class="text-[10px] font-black text-indigo-600 uppercase hover:underline">Tải lên
                                    ngay</RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import axios from "@/api/axios";

const loading = ref(true);
const profile = ref({ skills: [], education: [], experience: [] });

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : `${date.getMonth() + 1}/${date.getFullYear()}`;
};

const formatBirthdate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const industryLabel = {
    it: "Công nghệ thông tin",
    sales: "Bán hàng",
    accounting: "Kế toán - Tài chính",
    marketing: "Marketing",
    education: "Giáo dục",
    hr: "Nhân sự",
    healthcare: "Y tế",
    production: "Sản xuất",
};

const basicInfo = computed(() => [
    { icon: 'fa-solid fa-venus-mars', label: 'Giới tính', value: profile.value.gender || 'N/A' },
    { icon: 'fa-solid fa-calendar-days', label: 'Ngày sinh', value: formatBirthdate(profile.value.birthdate) },
    { icon: 'fa-solid fa-house', label: 'Địa chỉ', value: profile.value.address || 'N/A' },
    { icon: 'fa-solid fa-phone', label: 'Liên hệ', value: profile.value.phone || 'N/A' },
]);

onMounted(async () => {
    try {
        const res = await axios.get("/candidate/profile");
        const data = res.data;
        profile.value = {
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            education: Array.isArray(data.education) ? data.education : [],
            experience: Array.isArray(data.experience) ? data.experience : [],
        };
    } catch (err) {
        console.error("Lỗi fetch profile:", err);
    } finally {
        loading.value = false;
    }
});

const toggleProfilePublic = async () => {
    try {
        const res = await axios.put("/candidate/profile/status");
        profile.value.isProfilePublic = res.data.isProfilePublic;
    } catch (err) {
        console.error("Lỗi đổi trạng thái hồ sơ:", err);
    }
};
</script>

<style scoped>
.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

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

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
</style>
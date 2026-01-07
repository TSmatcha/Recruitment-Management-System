<template>
    <EmployerLayout>
        <div class="max-w-4xl mx-auto p-8 pt-2 font-sans text-slate-900">

            <button @click="goBack" class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-white border border-slate-200 shadow-sm
                       text-sm font-bold text-slate-600
                       hover:bg-indigo-50 hover:text-indigo-600 transition">
                <i class="fa-solid fa-arrow-left"></i>
                Quay lại
            </button>

            <div v-if="loading"
                class="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                <i class="fa-solid fa-circle-notch animate-spin text-3xl text-indigo-600"></i>
                <p class="mt-4 text-slate-500 font-medium">Đang tải hồ sơ chuyên gia...</p>
            </div>

            <div v-else-if="candidate" class="space-y-8 animate-fade-in">

                <div
                    class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-40">
                    </div>

                    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <img :src="candidate.avatar || '/default-avatar.png'"
                            class="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-md ring-1 ring-slate-100" />

                        <div class="flex-1 text-center md:text-left">
                            <div
                                class="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
                                {{ industryLabel[candidate.industry] || 'Chuyên gia' }}
                            </div>
                            <h1 class="text-3xl font-extrabold mb-2">{{ candidate.name }}</h1>
                            <p class="text-slate-500 text-sm font-medium">
                                <i class="fa-solid fa-graduation-cap mr-2"></i>
                                {{ candidate.education?.length ? candidate.education[0].school : 'Chưa cập nhật học vấn'
                                }}
                            </p>

                            <div class="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                                <button @click="openInviteModal"
                                    class="min-w-[160px] px-6 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                                    <i class="fa-solid fa-paper-plane"></i>
                                    MỜI ỨNG TUYỂN
                                </button>

                                <button @click="toggleSave"
                                    class="min-w-[180px] px-8 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 border"
                                    :class="isSaved ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white' : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-lg shadow-indigo-100'">
                                    <i class="fa-solid fa-bookmark"></i>
                                    <span>{{ isSaved ? 'HỦY LƯU ỨNG VIÊN' : 'LƯU ỨNG VIÊN' }}</span>
                                </button>

                                <a v-if="candidate.cv" :href="candidate.cv" target="_blank"
                                    class="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center">
                                    XEM CV ỨNG VIÊN
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="space-y-8">
                        <div class="bg-white rounded-[2rem] p-8 border border-slate-100">
                            <h3 class="text-[10px] font-black text-slate-400 uppercase mb-6">Thông tin liên hệ</h3>
                            <div class="space-y-5 text-sm font-bold text-slate-700">
                                <div class="flex items-center gap-3"><i
                                        class="fa-solid fa-envelope text-indigo-500 w-4"></i> {{ candidate.email }}
                                </div>
                                <div class="flex items-center gap-3"><i
                                        class="fa-solid fa-phone text-indigo-500 w-4"></i> {{ candidate.phone || 'N/A'
                                        }}</div>
                                <div class="flex items-center gap-3"><i
                                        class="fa-solid fa-location-dot text-indigo-500 w-4"></i> {{ candidate.address
                                            || 'Việt Nam' }}</div>
                                <div class="flex items-center gap-3"><i
                                        class="fa-solid fa-venus-mars text-indigo-500 w-4"></i> {{ candidate.gender ||
                                            'Bảo mật' }}</div>
                            </div>
                        </div>

                        <div class="bg-white rounded-[2rem] p-8 border border-slate-100">
                            <h3 class="text-[10px] uppercase font-black text-slate-400 mb-4">Kỹ năng</h3>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="skill in candidate.skills || []" :key="skill"
                                    class="px-4 py-2 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100">
                                    {{ skill }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="md:col-span-2 space-y-8">
                        <div class="bg-white rounded-[2rem] p-8 border border-slate-100">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="text-[10px] uppercase font-black text-slate-400">Kinh nghiệm làm việc</h3>
                                <span class="text-2xl font-black text-indigo-600">{{
                                    calculateTotalExp(candidate.experience) }} Năm</span>
                            </div>

                            <div v-if="candidate.experience?.length"
                                class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-100 before:to-transparent">
                                <div v-for="(exp, index) in candidate.experience" :key="index"
                                    class="relative pl-12 group">
                                    <div
                                        class="absolute left-0 w-10 h-10 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center group-hover:border-indigo-500 transition-colors z-10 shadow-sm">
                                        <i
                                            class="fa-solid fa-briefcase text-slate-400 group-hover:text-indigo-600 text-xs"></i>
                                    </div>
                                    <div class="pt-1">
                                        <h4 class="font-bold text-slate-900">{{ exp.position }}</h4>
                                        <p class="text-indigo-600 font-bold text-sm">{{ exp.companyName }}</p>
                                        <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                            {{ formatDate(exp.startDate) }} — {{ exp.endDate ? formatDate(exp.endDate) :
                                                'Hiện tại' }}
                                        </p>
                                        <p class="mt-3 text-slate-500 text-sm leading-relaxed italic">{{ exp.description
                                        }}</p>
                                    </div>
                                </div>
                            </div>
                            <p v-else class="text-slate-400 italic text-sm text-center py-4">Chưa cập nhật kinh nghiệm
                            </p>
                        </div>

                        <div class="bg-white rounded-[2rem] p-8 border border-slate-100">
                            <h3 class="text-[10px] uppercase font-black text-slate-400 mb-8">Học vấn & Bằng cấp</h3>
                            <div v-if="candidate.education?.length" class="grid gap-6">
                                <div v-for="(edu, index) in candidate.education" :key="index"
                                    class="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-dashed hover:border-indigo-300 transition-colors">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h4 class="font-black text-slate-800">{{ edu.school }}</h4>
                                            <p class="text-indigo-600 font-bold text-sm">{{ edu.degree }}</p>
                                        </div>
                                        <span
                                            class="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                                            {{ edu.startYear }} - {{ edu.endYear || 'Nay' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p v-else class="text-slate-400 italic text-sm text-center py-4">Chưa cập nhật học vấn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showInviteModal"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div class="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 animate-fade-in">
                <h3 class="text-xl font-black text-slate-800 mb-2">Mời ứng tuyển</h3>
                <p class="text-slate-400 text-xs font-bold mb-6 uppercase">Chọn vị trí bạn muốn mời {{ candidate?.name
                    }}</p>

                <div v-if="myJobs.length" class="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                    <div v-for="job in myJobs" :key="job._id" @click="selectedJobId = job._id"
                        :class="selectedJobId === job._id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200'"
                        class="p-4 border-2 rounded-2xl cursor-pointer transition-all">
                        <p class="font-bold text-slate-800 text-sm">{{ job.title }}</p>
                        <p class="text-[10px] text-slate-500 uppercase mt-1">
                            <i class="fa-solid fa-location-dot mr-1"></i> {{ job.location }}
                            <span class="mx-1">•</span>
                            <i class="fa-solid fa-wallet mr-1"></i> {{ job.salary }}
                        </p>
                    </div>
                </div>
                <div v-else class="text-center py-8 bg-slate-50 rounded-2xl mb-6">
                    <i class="fa-solid fa-briefcase-medical text-slate-300 text-2xl mb-2"></i>
                    <p class="text-slate-400 italic text-sm">Bạn chưa có tin tuyển dụng nào đang hoạt động.</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <button @click="showInviteModal = false"
                        class="py-3 text-slate-400 font-bold uppercase text-[11px] tracking-widest hover:text-slate-600 transition">Hủy
                        bỏ</button>
                    <button @click="sendInvite" :disabled="!selectedJobId || inviting"
                        class="py-4 bg-emerald-600 text-white rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-emerald-100 disabled:opacity-50 active:scale-95 transition-all">
                        {{ inviting ? 'Đang gửi...' : 'Gửi lời mời' }}
                    </button>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/axios";
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const route = useRoute();
const router = useRouter();

const candidate = ref(null);
const loading = ref(false);
const isSaved = ref(false);

// ✅ MỚI: Biến cho tính năng Mời
const showInviteModal = ref(false);
const inviting = ref(false);
const myJobs = ref([]);
const selectedJobId = ref(null);

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

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : `${date.getMonth() + 1}/${date.getFullYear()}`;
};

const calculateTotalExp = (expArray) => {
    if (!Array.isArray(expArray) || expArray.length === 0) return 0;
    let totalMonths = 0;
    expArray.forEach(exp => {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        if (!isNaN(start.getTime())) {
            totalMonths += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        }
    });
    return (totalMonths / 12).toFixed(1);
};

const fetchCandidateDetail = async () => {
    try {
        loading.value = true;
        const { data } = await api.get(`/talents/${route.params.id}`);
        candidate.value = data;
        isSaved.value = data.savedByCurrentEmployer || false;
    } catch (err) {
        console.error("Không thể tải hồ sơ", err);
    } finally {
        loading.value = false;
    }
};

const openInviteModal = async () => {
    try {
        const res = await api.get("/jobs/my");

        // Kiểm tra nếu data là Object và có chứa mảng jobs
        if (res.data && res.data.jobs) {
            // ✅ Chỉ lấy những tin đã được duyệt (status === 'approved') để mời
            myJobs.value = res.data.jobs.filter(job => job.status === 'approved');
        } else if (Array.isArray(res.data)) {
            // Phòng hờ nếu sau này bạn đổi Backend trả về mảng thẳng
            myJobs.value = res.data.filter(job => job.status === 'approved');
        }

        if (myJobs.value.length === 0) {
            console.warn("Không có tin tuyển dụng nào trạng thái 'approved' để mời.");
        }

        showInviteModal.value = true;
    } catch (err) {
        console.error("Lỗi khi tải danh sách job:", err);
        alert("Không thể tải danh sách tin tuyển dụng.");
    }
};

// ✅ MỚI: Hàm gửi lời mời
const sendInvite = async () => {
    if (!selectedJobId.value) return;
    inviting.value = true;
    try {
        const res = await api.post("/applications/invite", {
            jobId: selectedJobId.value,
            candidateId: route.params.id
        });
        // Sử dụng message từ res.data nếu có
        alert(res.data?.message || "Đã gửi lời mời ứng tuyển thành công!");
        showInviteModal.value = false;
    } catch (err) {
        // 🔥 QUAN TRỌNG: Lấy chính xác message lỗi từ Backend trả về (400 Bad Request)
        const errorMessage = err.response?.data?.message || "Lỗi khi mời ứng viên. Vui lòng thử lại.";
        alert(errorMessage);

        // Tùy chọn: Đóng modal nếu lỗi là do đã mời rồi để tránh bấm nhầm
        if (err.response?.status === 400) {
            showInviteModal.value = false;
        }
    } finally {
        inviting.value = false;
    }
};

const toggleSave = async () => {
    try {
        if (isSaved.value) {
            await api.post("/talents/unsave", { candidateId: route.params.id });
            isSaved.value = false;
            if (route.query.from === "saved") router.push("/employer/saved-candidates");
        } else {
            await api.post("/talents/save", { candidateId: route.params.id });
            isSaved.value = true;
        }
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi cập nhật");
    }
};

const goBack = () => {
    if (route.query.from === "saved") router.push("/employer/saved-candidates");
    else router.back();
};

onMounted(fetchCandidateDetail);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
<template>
    <EmployerLayout>
        <div class="p-8 pt-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div class="max-w-6xl mx-auto">

                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">
                            Quản lý <span class="text-indigo-600">tin tuyển dụng</span>
                        </h2>
                        <p class="text-slate-500 mt-1 italic">Theo dõi, chỉnh sửa và cập nhật trạng thái các vị trí đang
                            tuyển dụng của bạn.</p>
                    </div>

                    <button @click="fetchJobs" :disabled="loading"
                        class="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm active:scale-95 disabled:opacity-50">
                        <i class="fa-solid fa-arrows-rotate transition-transform group-hover:rotate-180"
                            :class="{ 'animate-spin': loading }"></i>
                        Làm mới danh sách
                    </button>
                </div>

                <div v-if="error"
                    class="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium flex items-center gap-3 animate-fade-in">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    {{ error }}
                </div>
                <div v-if="success"
                    class="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-medium flex items-center gap-3 animate-fade-in">
                    <i class="fa-solid fa-circle-check"></i>
                    {{ success }}
                </div>

                <div v-if="loading"
                    class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600"></i>
                    <p class="mt-4 text-slate-500 font-medium tracking-wide">Đang đồng bộ dữ liệu hệ thống...</p>
                </div>

                <div v-else-if="jobs.length" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div v-for="job in jobs" :key="job._id"
                        class="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all relative flex flex-col h-full">

                        <div class="flex justify-between items-center mb-6">
                            <div class="flex gap-2">
                                <span v-if="isNew(job.createdAt)"
                                    class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                    Mới đăng
                                </span>
                                <span :class="statusClasses(job.status)"
                                    class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                                    {{ statusLabel(job.status) }}
                                </span>
                            </div>
                            <p class="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                ID: {{ job._id.slice(-6).toUpperCase() }}
                            </p>
                        </div>

                        <div class="flex-grow">
                            <h3
                                class="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                                {{ job.title }}
                            </h3>

                            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-xs mb-5">
                                <span class="flex items-center gap-1.5 font-medium">
                                    <i class="fa-solid fa-location-dot text-rose-400"></i> {{ job.location || "Chưa xác định" }}
                                </span>
                                <span class="flex items-center gap-1.5 font-medium">
                                    <i class="fa-solid fa-briefcase text-indigo-400"></i> {{ formatJobType(job.jobType)
                                    }}
                                </span>
                            </div>

                            <div class="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                                <div
                                    class="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    <span>Thông tin thời gian</span>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-xs text-slate-600 flex justify-between">
                                        <span>Ngày tạo:</span> <span class="font-bold text-slate-700">{{
                                            formatDate(job.createdAt) }}</span>
                                    </p>
                                    <p v-if="job.expiresAt" class="text-xs text-slate-600 flex justify-between">
                                        <span>Hết hạn:</span> <span class="font-bold text-rose-500">{{
                                            formatDate(job.expiresAt) }}</span>
                                    </p>
                                </div>
                            </div>

                            <p class="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                                {{ job.description || "Tin tuyển dụng này hiện chưa có mô tả chi tiết từ nhà tuyển dụng." }}
                            </p>
                        </div>

                        <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                            <div class="flex flex-col min-w-0">
                                <span class="text-[10px] font-bold text-slate-400 uppercase">Doanh nghiệp</span>
                                <span class="text-sm font-bold text-slate-700 truncate capitalize">{{ job.companyName ||
                                    "N/A" }}</span>
                            </div>

                            <div class="flex gap-2">
                                <button @click="editJob(job._id)"
                                    class="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-600 font-bold rounded-xl border border-amber-100 hover:bg-amber-600 hover:text-white transition-all text-xs">
                                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                                </button>
                                <button @click="deleteJob(job._id)"
                                    class="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all text-xs">
                                    <i class="fa-solid fa-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                    <div
                        class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <i class="fa-solid fa-file-circle-plus text-3xl"></i>
                    </div>
                    <h3 class="text-slate-800 font-bold text-xl">Bạn chưa đăng tin tuyển dụng nào</h3>
                    <p class="text-slate-400 mt-2 text-sm">Hãy bắt đầu hành trình tìm kiếm tài năng bằng cách tạo tin
                        tuyển dụng đầu tiên.</p>
                    <router-link to="/employer/post-job"
                        class="mt-8 inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95">
                        Đăng tin ngay
                    </router-link>
                </div>

            </div>
        </div>
    </EmployerLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
// 1. Sử dụng api đã cấu hình sẵn sessionStorage ở các bước trước
import api from "@/api/axios";
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const jobs = ref([]);
const loading = ref(false);
const error = ref("");
const success = ref("");
const router = useRouter();

// 2. XÓA đoạn khởi tạo axios cũ (api cũ) vì đã dùng file import ở trên

// Lấy danh sách tin của tôi
const fetchJobs = async () => {
    loading.value = true;
    error.value = "";
    try {
        // API sẽ tự động đính kèm token từ sessionStorage của tab hiện tại
        const res = await api.get("/jobs/my");

        // Xử lý dữ liệu trả về
        jobs.value = (res.data.jobs || []).map(job => ({
            ...job,
            companyName: job.company?.name || "Công ty chưa cập nhật"
        }));
    } catch (err) {
        console.error("Lỗi fetch jobs:", err);
        error.value = "Hệ thống gặp sự cố khi tải danh sách. Vui lòng thử lại sau.";
    } finally {
        loading.value = false;
    }
};

// Xử lý xóa tin
const deleteJob = async (id) => {
    if (!confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa tin này không?")) return;
    try {
        await api.delete(`/jobs/${id}`);
        success.value = "Đã xóa tin tuyển dụng thành công!";
        fetchJobs();
    } catch (err) {
        error.value = "Không thể thực hiện xóa. Vui lòng kiểm tra lại quyền hạn.";
    }
};

// Chuyển hướng đến trang chỉnh sửa
const editJob = (id) => {
    router.push(`/employer/post-job/${id}`);
};

// --- Helpers định dạng hiển thị (Giữ nguyên logic của bạn) ---
const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN", {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
};

const formatJobType = (type) => {
    const map = { fulltime: "Toàn thời gian", parttime: "Bán thời gian", internship: "Thực tập", remote: "Remote" };
    return map[type] || type;
};

const isNew = (createdAt) => {
    const diff = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    return diff <= 24;
};

const statusClasses = (status) => {
    const map = {
        pending: "bg-amber-50 text-amber-600 border-amber-100",
        approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rejected: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return map[status] || "bg-slate-50 text-slate-600 border-slate-100";
};

const statusLabel = (status) => {
    const map = { pending: "Chờ duyệt", approved: "Đã hiển thị", rejected: "Từ chối" };
    return map[status] || status;
};

onMounted(fetchJobs);
</script>

<style scoped>
/* Hiệu ứng cắt chữ nếu mô tả quá dài */
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Animation khi hiện thông báo */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.4s ease-out forwards;
}
</style>
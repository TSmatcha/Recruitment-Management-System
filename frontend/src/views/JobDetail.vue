<template>
    <div class="bg-slate-50 pt-24 pb-20 min-h-screen font-sans">
        <div class="max-w-5xl mx-auto p-6">

            <div class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                <div class="p-8 md:p-10">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                        <div class="flex-1">
                            <h1 class="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                                {{ job.title }}
                            </h1>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-indigo-100">
                                    {{ jobTypeMap[job.jobType] || 'Hình thức khác' }}
                                </span>
                                <span v-if="isExpiringSoon(job.expiresAt)" class="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-red-100 animate-pulse">
                                    Sắp hết hạn
                                </span>
                            </div>
                        </div>

                        <button @click="toggleSaveJob" 
                            class="group flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm whitespace-nowrap" 
                            :class="isSaved 
                                ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' 
                                : 'bg-white text-gray-600 border border-gray-300 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md'">
                            <i :class="isSaved ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart group-hover:scale-110 transition-transform'"></i>
                            {{ isSaved ? 'Đã lưu' : 'Lưu tin' }}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 pb-10 border-b border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                <i class="fa-solid fa-building text-xl"></i>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Công ty</p>
                                <p class="font-bold text-gray-800">{{ job.company?.name || 'Đang cập nhật' }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                                <i class="fa-solid fa-money-bill-wave text-xl"></i>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Mức lương</p>
                                <p class="font-bold text-green-700">{{ job.salary ? job.salary + ' triệu' : 'Thỏa thuận' }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                                <i class="fa-solid fa-location-dot text-xl"></i>
                            </div>
                            <div>
                                <p class="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">Địa điểm</p>
                                <p class="font-bold text-gray-800">{{ job.location || 'Chưa có địa điểm' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p class="text-[10px] text-indigo-500 font-black uppercase mb-1">Ngành nghề</p>
                            <p class="font-bold text-gray-700 truncate">{{ job.career || "Không yêu cầu" }}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p class="text-[10px] text-indigo-500 font-black uppercase mb-1">Cấp bậc</p>
                            <p class="font-bold text-gray-700">{{ levelMap[job.level] || job.level || "Nhân viên" }}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p class="text-[10px] text-indigo-500 font-black uppercase mb-1">Kinh nghiệm</p>
                            <p class="font-bold text-gray-700">{{ experienceMap[job.experience] || job.experience || "N/A" }}</p>
                        </div>
                        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p class="text-[10px] text-indigo-500 font-black uppercase mb-1">Học vấn</p>
                            <p class="font-bold text-gray-700">{{ educationMap[job.education] || job.education || "N/A" }}</p>
                        </div>
                    </div>

                    <div class="space-y-12">
                        <section>
                            <h2 class="inline-flex items-center text-xl font-black text-gray-900 mb-5">
                                <span class="w-2 h-7 bg-indigo-600 rounded-full mr-3"></span>
                                Mô tả công việc
                            </h2>
                            <div class="whitespace-pre-line text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                                {{ job.description || "Không có mô tả" }}
                            </div>
                        </section>

                        <section>
                            <h2 class="inline-flex items-center text-xl font-black text-gray-900 mb-5">
                                <span class="w-2 h-7 bg-purple-600 rounded-full mr-3"></span>
                                Yêu cầu công việc
                            </h2>
                            <div class="whitespace-pre-line text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                                {{ job.requirements || "Không có yêu cầu cụ thể" }}
                            </div>
                        </section>
                    </div>

                    <div class="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-calendar-check text-indigo-400"></i>
                            Ngày đăng: <span class="font-medium text-gray-700">{{ formatDate(job.createdAt) }}</span>
                            <span class="mx-2 text-gray-300">|</span>
                            Hạn nộp: <span :class="isExpiringSoon(job.expiresAt) ? 'text-red-500 font-bold' : 'font-medium text-gray-700'">{{ formatDate(job.expiresAt) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-user-pen text-purple-400"></i>
                            Đăng bởi: <span class="font-bold text-gray-800">{{ job.postedBy?.name || "Nhà tuyển dụng" }}</span>
                        </div>
                    </div>

                    <div class="mt-12">
                        <button @click="handleApply"
                            class="group relative w-full flex items-center justify-center py-5 rounded-2xl text-lg font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all duration-300 overflow-hidden"
                            :disabled="isApplying">
                            <div class="absolute inset-0 w-1/3 h-full bg-white/10 skew-x-[-25deg] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                            <i class="fa-solid fa-paper-plane mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                            {{ isApplying ? "ĐANG XỬ LÝ HỒ SƠ..." : auth.user ? "ỨNG TUYỂN NGAY" : "ĐĂNG NHẬP ĐỂ ỨNG TUYỂN" }}
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <Transition name="fade">
            <div v-if="showLoginModal || showCvModal"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                <!-- Overlay -->
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    @click="showLoginModal = false; showCvModal = false"></div>

                <!-- MODAL BOX -->
                <div class="relative bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white z-10">
                    <!-- ===== LOGIN MODAL ===== -->
                    <div v-if="showLoginModal">
                        <div
                            class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fa-solid fa-shield-halved text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-black text-gray-900 text-center mb-1">Đăng nhập</h3>
                        <p class="text-gray-500 text-sm text-center mb-8">
                            Bạn cần là ứng viên để tiếp tục ứng tuyển
                        </p>

                        <form @submit.prevent="login" class="space-y-4">
                            <div>
                                <label class="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                                <input v-model="loginForm.email" type="email"
                                    class="w-full px-5 py-3.5 bg-gray-50 border rounded-xl" />
                            </div>
                            <div>
                                <label class="text-xs font-bold text-gray-400 uppercase ml-1">Mật khẩu</label>
                                <input v-model="loginForm.password" type="password"
                                    class="w-full px-5 py-3.5 bg-gray-50 border rounded-xl" />
                            </div>

                            <div class="flex gap-3 pt-6">
                                <button type="button" @click="showLoginModal = false"
                                    class="flex-1 py-3 rounded-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-100">
                                    Hủy
                                </button>

                                <button type="submit" class="flex-[2] py-3 rounded-xl bg-indigo-600 text-white">
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- ===== CV MODAL ===== -->
                    <div v-if="showCvModal">
                        <h2 class="text-xl font-bold text-gray-800 text-center mb-4">
                            Nộp CV để ứng tuyển
                        </h2>

                        <label class="block font-medium text-gray-700 mb-1">
                            Chọn CV đã tạo
                        </label>

                        <select v-model="selectedCvId" class="w-full mb-3 p-3 border rounded-lg" :disabled="cvFile">
                            <option value="">-- Chọn CV --</option>
                            <option v-for="cv in myCvs" :key="cv._id" :value="cv._id">
                                {{ cv.title }}
                            </option>
                        </select>

                        <p class="text-center text-gray-400 my-2">HOẶC</p>

                        <label class="block font-medium text-gray-700 mb-1">
                            Upload CV
                        </label>

                        <input type="file" accept=".pdf,.doc,.docx" @change="handleFileUpload"
                            class="w-full mb-3 p-3 border rounded-lg" :disabled="!!selectedCvId" />

                        <p v-if="cvFile" class="text-sm text-green-700 mb-4">
                            {{ cvFile.name }}
                        </p>

                        <div class="flex justify-end gap-3">
                            <button @click="showCvModal = false" class="px-4 py-2 rounded-lg bg-gray-200">
                                Hủy
                            </button>
                            <button @click="applyJob" class="px-5 py-2 rounded-lg bg-green-600 text-white">
                                Gửi hồ sơ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

/* ================== STATE (Logic Giữ Nguyên) ================== */
const job = ref({});
const isApplying = ref(false);
const isSaved = ref(false);
const showLoginModal = ref(false);
const showCvModal = ref(false);

const loginForm = ref({ email: "", password: "" });

// CV
const cvFile = ref(null); 
const myCvs = ref([]); 
const selectedCvId = ref("");

/* ================== MAP (Logic Giữ Nguyên) ================== */
const levelMap = {
    Intern: "Thực tập sinh",
    Fresher: "Mới tốt nghiệp",
    Junior: "Nhân viên",
    Middle: "Chuyên viên",
    Manager: "Quản lý",
};

const experienceMap = {
    "No experience": "Chưa có kinh nghiệm",
    "0-1": "0-1 năm",
    "1-2": "1-2 năm",
    "1-3": "1-3 năm",
    "3-5": "3-5 năm",
    "5+": "Trên 5 năm",
};

const educationMap = {
    "Trung cấp": "Trung cấp",
    "Cao đẳng": "Cao đẳng",
    Bachelor: "Đại học",
    Master: "Thạc sĩ",
    Doctor: "Tiến sĩ",
};

const jobTypeMap = {
    fulltime: "Toàn thời gian",
    parttime: "Bán thời gian",
    internship: "Thực tập",
    remote: "Làm việc từ xa",
};

/* ================== UTIL (Logic Giữ Nguyên) ================== */
const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const isExpiringSoon = (expiresAt) => {
    if (!expiresAt) return false;
    const now = new Date();
    const expire = new Date(expiresAt);
    const diffDays = (expire - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
};

/* ================== ON MOUNT (Logic Giữ Nguyên) ================== */
onMounted(async () => {
    const token = localStorage.getItem("token");

    if (token && !auth.user) {
        try {
            const res = await axios.get("http://localhost:5000/api/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            auth.user = res.data;
            auth.token = token;
        } catch {
            localStorage.removeItem("token");
        }
    }

    await fetchJob();

    if (auth.token && auth.user?.role === "candidate") {
        try {
            const res = await axios.get("http://localhost:5000/api/saved-jobs", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            isSaved.value = res.data.some(
                (item) => item.jobId._id === route.params.id
            );
        } catch { }
    }

    if (auth.token && auth.user?.role === "candidate") {
        try {
            const res = await axios.get("http://localhost:5000/api/cv", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            myCvs.value = Array.isArray(res.data) ? res.data : (res.data.data || []);
        } catch {
            console.log("Không lấy được CV");
        }
    }
});

/* ================== API & ACTIONS (Logic Giữ Nguyên) ================== */
const fetchJob = async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${route.params.id}`);
        job.value = res.data;
    } catch {
        alert("Không tìm thấy công việc");
        router.back();
    }
};

const handleApply = () => {
    if (!auth.user) {
        showLoginModal.value = true;
        return;
    }
    showCvModal.value = true;
};

const handleFileUpload = (e) => {
    cvFile.value = e.target.files[0];
    selectedCvId.value = ""; 
};

const applyJob = async () => {
    if (!cvFile.value && !selectedCvId.value) {
        alert("Vui lòng chọn CV đã tạo hoặc upload CV");
        return;
    }

    try {
        isApplying.value = true;
        const formData = new FormData();
        if (cvFile.value) formData.append("cv", cvFile.value);
        if (selectedCvId.value) formData.append("cvId", selectedCvId.value);

        const res = await axios.post(
            `http://localhost:5000/api/jobs/${job.value._id}/apply`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        alert(res.data.message || "Ứng tuyển thành công!");
        showCvModal.value = false;
        router.push("/candidate/dashboard");
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi ứng tuyển!");
    } finally {
        isApplying.value = false;
    }
};

const login = async () => {
    try {
        const res = await axios.post("http://localhost:5000/api/auth/login", loginForm.value);
        if (res.data.user.role !== "candidate") {
            alert("Chỉ ứng viên mới được ứng tuyển!");
            return;
        }
        auth.setUser(res.data.user);
        auth.token = res.data.token;
        localStorage.setItem("token", res.data.token);
        showLoginModal.value = false;
        alert("Đăng nhập thành công!");
        window.location.reload(); // Reload để lấy danh sách CV mới
    } catch {
        alert("Sai email hoặc mật khẩu!");
    }
};

const toggleSaveJob = async () => {
    if (!auth.user) {
        showLoginModal.value = true;
        return;
    }
    try {
        if (isSaved.value) {
            await axios.delete(`http://localhost:5000/api/saved-jobs/${job.value._id}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            isSaved.value = false;
        } else {
            await axios.post("http://localhost:5000/api/saved-jobs",
                { jobId: job.value._id },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            isSaved.value = true;
        }
    } catch {
        alert("Không thể lưu công việc");
    }
};
</script>

<style scoped>
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
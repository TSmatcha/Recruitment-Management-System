<template>
    <EmployerLayout>
        <div class="p-8 pt-6 bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 class="text-3xl font-extrabold tracking-tight text-slate-900">
                            Danh sách <span class="text-indigo-600">ứng viên</span>
                        </h2>
                        <p class="text-slate-500 mt-1 italic text-sm">
                            Quản lý và xét duyệt hồ sơ từ các ứng viên tiềm năng.
                        </p>
                    </div>
                    <div
                        class="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng hồ sơ:</span>
                        <span class="text-lg font-black text-indigo-600">{{ applicants.length }}</span>
                    </div>
                </div>

                <div v-if="loading"
                    class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600"></i>
                    <p class="mt-4 text-slate-500 font-medium tracking-wide">Đang đồng bộ danh sách ứng viên...</p>
                </div>

                <div v-else-if="applicants.length > 0" class="grid grid-cols-1 gap-6">
                    <div v-for="app in applicants" :key="app._id"
                        class="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">

                        <div class="flex items-center gap-5">
                            <div
                                class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100 shrink-0">
                                {{ app.userId?.name ? app.userId.name.charAt(0).toUpperCase() : '?' }}
                            </div>

                            <div class="min-w-0">
                                <h3
                                    class="font-bold text-lg text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                    {{ app.userId?.name || "Hồ sơ chưa cập nhật tên" }}
                                </h3>
                                <p class="text-sm font-bold text-slate-500 flex items-center gap-2 truncate">
                                    <i class="fa-solid fa-briefcase text-slate-300 text-xs"></i>
                                    {{ app.jobId?.title || "Vị trí không xác định" }}
                                </p>

                                <div v-if="app.rating?.score"
                                    class="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                                    <div class="flex items-center gap-2 mb-1">
                                        <div class="flex text-amber-400 text-[10px]">
                                            <i v-for="s in 5" :key="s" class="fa-star"
                                                :class="s <= app.rating.score ? 'fa-solid' : 'fa-regular'"></i>
                                        </div>
                                        <span
                                            class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Đánh
                                            giá chuyên gia</span>
                                    </div>
                                    <p v-if="app.rating.comment" class="text-[11px] text-slate-500 italic leading-snug">
                                        "{{ app.rating.comment }}"
                                    </p>
                                </div>

                                <div class="mt-2 flex flex-wrap gap-3 items-center">
                                    <span
                                        class="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                                        <i class="fa-regular fa-calendar text-xs"></i> {{ formatDate(app.createdAt) }}
                                    </span>
                                    <span :class="statusClasses(app.status)"
                                        class="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border">
                                        {{ statusText(app.status) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                            <button @click="goToApplicationDetail(app)"
                                class="flex-1 md:flex-none px-5 py-2.5 bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-wider">
                                Xem đơn ứng tuyển
                            </button>

                            <button v-if="!app.rating?.score" @click="openRatingModal(app)"
                                class="flex-1 md:flex-none px-5 py-2.5 bg-amber-50 text-amber-600 font-bold text-[11px] rounded-xl border border-amber-100 hover:bg-amber-500 hover:text-white transition-all uppercase tracking-wider">
                                <i class="fa-solid fa-star-half-stroke mr-1"></i> Đánh giá
                            </button>

                            <template v-if="app.status === 'applied' || app.status === 'reviewed'">
                                <button @click="approve(app)"
                                    class="flex-1 md:flex-none px-5 py-2.5 bg-emerald-50 text-emerald-600 font-bold text-[11px] rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-wider">
                                    Duyệt
                                </button>
                                <button @click="reject(app)"
                                    class="flex-1 md:flex-none px-5 py-2.5 bg-rose-50 text-rose-600 font-bold text-[11px] rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all uppercase tracking-wider">
                                    Từ chối
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <div v-else class="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                    <div
                        class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <i class="fa-solid fa-user-slash text-3xl"></i>
                    </div>
                    <h3 class="text-slate-800 font-bold text-xl">Chưa có ứng viên mới</h3>
                    <p class="text-slate-400 mt-2 text-sm">Các hồ sơ ứng tuyển vào vị trí bạn đăng sẽ xuất hiện tại đây.
                    </p>
                </div>
            </div>
        </div>

        <div v-if="showRatingModal"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div class="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 text-center animate-fade-in">
                <h3 class="text-xl font-black text-slate-800 mb-2">Đánh giá chuyên gia</h3>
                <p class="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-8">
                    {{ selectedApp?.userId?.name || 'Ứng viên' }}
                </p>
                <div class="flex justify-center gap-3 mb-8">
                    <i v-for="star in 5" :key="star" @click="ratingData.score = star"
                        :class="star <= ratingData.score ? 'fa-solid text-amber-400' : 'fa-regular text-slate-200'"
                        class="fa-star text-4xl cursor-pointer hover:scale-110 transition-transform"></i>
                </div>
                <textarea v-model="ratingData.comment" placeholder="Nhận xét chi tiết về năng lực ứng viên..."
                    class="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 ring-indigo-500 mb-6 h-32 outline-none"></textarea>
                <div class="grid grid-cols-2 gap-4">
                    <button @click="showRatingModal = false"
                        class="py-3 text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-600">Đóng</button>
                    <button @click="submitRating" :disabled="submitting"
                        class="py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all active:scale-95">
                        {{ submitting ? 'Đang lưu...' : 'Lưu kết quả' }}
                    </button>
                </div>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios";
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const router = useRouter();
const applicants = ref([]);
const loading = ref(false);
const showRatingModal = ref(false);
const submitting = ref(false);
const selectedApp = ref(null);
const ratingData = ref({ score: 5, comment: "" });

async function fetchApplicants() {
    // Đổi sang sessionStorage để đồng bộ
    const token = sessionStorage.getItem("token");
    if (!token) { router.push("/employer/login"); return; }

    loading.value = true;
    try {
        const res = await axios.get("/applications/employer/applicants");
        let data = res.data || [];
        if (data.length && data[0].applicants) {
            applicants.value = data.flatMap(job => job.applicants);
        } else {
            applicants.value = Array.isArray(data) ? data : [];
        }
    } catch (err) {
        console.error("Lỗi lấy danh sách ứng viên:", err);
        applicants.value = [];
    } finally { loading.value = false; }
}

function goToApplicationDetail(app) {
    if (!app?._id) return;
    router.push(`/employer/applicant/${app._id}`);
}

function openRatingModal(app) {
    selectedApp.value = app;
    ratingData.value = {
        score: app.rating?.score || 5,
        comment: app.rating?.comment || ""
    };
    showRatingModal.value = true;
}

async function submitRating() {
    if (!selectedApp.value) return;
    submitting.value = true;
    try {
        const applicationId = selectedApp.value._id;
        await axios.post(`/jobs/rate-app/${applicationId}`, ratingData.value);
        showRatingModal.value = false;
        alert("Đã lưu đánh giá thành công!");
        await fetchApplicants();
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi lưu đánh giá");
    } finally {
        submitting.value = false;
    }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "N/A";

const statusClasses = (s) => {
    const map = {
        accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rejected: 'bg-rose-50 text-rose-600 border-rose-100',
        interview: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        reviewed: 'bg-amber-50 text-amber-600 border-amber-100',
        applied: 'bg-slate-50 text-slate-500 border-slate-100'
    };
    return map[s] || map.applied;
};

const statusText = (s) => {
    const map = {
        applied: 'Mới ứng tuyển',
        reviewed: 'Đã xem',
        interview: 'Hẹn phỏng vấn',
        accepted: 'Chấp nhận',
        rejected: 'Từ chối'
    };
    return map[s] || s;
};

async function approve(app) {
    const t = prompt("Giờ hẹn phỏng vấn (Ví dụ: 09:00 25/12):");
    if (!t) return;
    try {
        await axios.put(`/applications/${app._id}/approve`, { interviewTime: t });
        alert("Đã duyệt và gửi thông báo hẹn phỏng vấn!");
        await fetchApplicants();
    } catch (e) { console.error(e); }
}

async function reject(app) {
    const r = prompt("Lý do từ chối:");
    if (!r) return;
    try {
        await axios.put(`/applications/${app._id}/reject`, { reason: r });
        alert("Đã gửi thông báo từ chối ứng viên.");
        await fetchApplicants();
    } catch (e) { console.error(e); }
}

onMounted(fetchApplicants);
</script>

<style scoped>
@keyframes fadeIn {
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
    animation: fadeIn 0.4s ease-out forwards;
}
</style>
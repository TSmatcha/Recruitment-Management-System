<template>
    <EmployerLayout>
        <div class="max-w-4xl mx-auto p-4 md:p-8">
            <div
                class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

                <h2 class="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight relative">
                    {{ isEdit ? "Chỉnh sửa" : "Đăng tin" }} <span class="text-indigo-600">tuyển dụng</span>
                </h2>

                <div v-if="errors.general"
                    class="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-medium flex items-center gap-3">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    {{ errors.general }}
                </div>

                <div v-if="success"
                    class="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-medium flex items-center gap-3">
                    <i class="fa-solid fa-circle-check"></i>
                    {{ success }}
                </div>

                <form v-if="hasCompany" @submit.prevent="handleSubmit" class="space-y-8 relative">

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="label-pro">Tên công việc *</label>
                            <input v-model="title" class="input-pro"
                                placeholder="Ví dụ: Senior Frontend Developer (ReactJS)" />
                            <p v-if="errors.title" class="text-rose-500 text-[11px] font-bold ml-1 uppercase">{{
                                errors.title }}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="label-pro">Lĩnh vực *</label>
                                <select v-model="category" class="input-pro cursor-pointer">
                                    <option value="">Chọn lĩnh vực</option>
                                    <option value="it">IT</option>
                                    <option value="sales">Bán hàng</option>
                                    <option value="accounting">Kế toán</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="hr">Nhân sự</option>
                                    <option value="education">Giáo dục</option>
                                    <option value="healthcare">Y tế</option>
                                    <option value="production">Sản xuất</option>
                                </select>
                            </div>

                            <div class="space-y-2">
                                <label class="label-pro">Ngành nghề *</label>
                                <select v-model="career" class="input-pro cursor-pointer">
                                    <option value="">Chọn ngành nghề</option>
                                    <option value="it">IT</option>
                                    <option value="sales">Bán hàng</option>
                                    <option value="accounting">Kế toán</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="education">Giáo dục</option>
                                    <option value="hr">Nhân sự</option>
                                    <option value="healthcare">Y tế</option>
                                    <option value="production">Sản xuất</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="space-y-2">
                                <label class="label-pro">Cấp bậc *</label>
                                <select v-model="level" class="input-pro cursor-pointer">
                                    <option value="">Chọn cấp bậc</option>
                                    <option value="Intern">Thực tập sinh</option>
                                    <option value="Fresher">Mới tốt nghiệp</option>
                                    <option value="Junior">Nhân viên</option>
                                    <option value="Middle">Chuyên viên</option>
                                    <option value="Manager">Quản lý</option>
                                </select>
                            </div>

                            <div class="space-y-2">
                                <label class="label-pro">Kinh nghiệm *</label>
                                <select v-model="experience" class="input-pro cursor-pointer">
                                    <option value="">Chọn kinh nghiệm</option>
                                    <option value="No experience">Chưa có kinh nghiệm</option>
                                    <option value="0-1">Dưới 1 năm</option>
                                    <option value="1-2">1 - 2 năm</option>
                                    <option value="2-3">2 - 3 năm</option>
                                    <option value="3-5">3 - 5 năm</option>
                                    <option value="5+">Trên 5 năm</option>
                                </select>
                            </div>

                            <div class="space-y-2">
                                <label class="label-pro">Học vấn *</label>
                                <select v-model="education" class="input-pro cursor-pointer">
                                    <option value="">Chọn học vấn</option>
                                    <option value="Trung cấp">Trung cấp</option>
                                    <option value="Cao đẳng">Cao đẳng</option>
                                    <option value="Đại học">Đại học</option>
                                    <option value="Thạc sĩ">Thạc sĩ</option>
                                    <option value="Tiến sĩ">Tiến sĩ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                        <div class="space-y-2">
                            <label class="label-pro">Địa điểm làm việc *</label>
                            <input v-model="location" class="input-pro" placeholder="Ví dụ: Ninh Kiều, Cần Thơ" />
                        </div>

                        <div class="space-y-2">
                            <label class="label-pro">Mức lương *</label>
                            <select v-model.number="salary" class="input-pro cursor-pointer">
                                <option :value="null">Chọn mức lương</option>
                                <option :value="6">Dưới 7 triệu</option>
                                <option :value="9">7 - 10 triệu</option>
                                <option :value="12">10 - 15 triệu</option>
                                <option :value="18">15 - 20 triệu</option>
                                <option :value="20">Trên 20 triệu</option>
                                <option :value="0">Thỏa thuận</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-6 pt-6 border-t border-slate-100">
                        <div class="space-y-2">
                            <label class="label-pro">Mô tả công việc *</label>
                            <textarea v-model="description" rows="6" class="input-pro resize-none py-4"
                                placeholder="Nhiệm vụ và trách nhiệm hằng ngày..."></textarea>
                        </div>

                        <div class="space-y-2">
                            <label class="label-pro">Yêu cầu ứng viên</label>
                            <textarea v-model="requirements" rows="4" class="input-pro resize-none py-4"
                                placeholder="Kỹ năng, chứng chỉ hoặc thái độ cần thiết..."></textarea>
                        </div>

                        <div class="space-y-2">
                            <label class="label-pro">Loại hình công việc</label>
                            <div class="flex flex-wrap gap-3">
                                <label
                                    v-for="type in [['fulltime', 'Toàn thời gian'], ['parttime', 'Bán thời gian'], ['internship', 'Thực tập'], ['remote', 'Làm việc từ xa']]"
                                    :key="type[0]" class="flex-1 min-w-[140px] relative group cursor-pointer">
                                    <input type="radio" :value="type[0]" v-model="jobType" class="peer hidden" />
                                    <div
                                        class="p-3 text-center rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-500 font-bold text-xs peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all group-hover:border-indigo-200">
                                        {{ type[1] }}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-8">
                        <button type="submit" :disabled="loading"
                            class="w-full md:w-auto bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
                            <i v-if="loading" class="fa-solid fa-circle-notch animate-spin"></i>
                            {{ isEdit ? "CẬP NHẬT TIN ĐĂNG" : "ĐĂNG TIN NGAY" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </EmployerLayout>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// 1. Sử dụng api chuẩn đã cấu hình sessionStorage ở bước trước
import api from "@/api/axios";
import EmployerLayout from "@/layouts/EmployerLayout.vue";

const route = useRoute();
const router = useRouter();
const jobId = route.params.id;
const isEdit = ref(!!jobId);
const loading = ref(false);

const title = ref("");
const location = ref("");
const salary = ref(null);
const description = ref("");
const requirements = ref("");
const jobType = ref("fulltime");
const category = ref("");
const career = ref("");
const level = ref("");
const experience = ref("");
const education = ref("");

const errors = ref({});
const success = ref("");
const hasCompany = ref(false);

// 2. XÓA đoạn khởi tạo axios cũ tại đây vì đã import api từ @/api/axios

onMounted(async () => {
    try {
        loading.value = true;
        // Kiểm tra thông tin user/company
        // Dùng api mới sẽ tự đính kèm token từ sessionStorage
        const me = await api.get("/users/me");

        if (!me.data.company) {
            errors.value.general = "Tài khoản của bạn chưa liên kết với công ty. Vui lòng cập nhật hồ sơ trước khi đăng tin.";
            loading.value = false;
            return;
        }
        hasCompany.value = true;

        if (isEdit.value) {
            const { data: job } = await api.get(`/jobs/${jobId}`);
            title.value = job.title;
            location.value = job.location;
            salary.value = job.salary;
            description.value = job.description;
            requirements.value = job.requirements;
            jobType.value = job.jobType;
            category.value = job.category;
            career.value = job.career;
            level.value = job.level;
            experience.value = job.experience;
            education.value = job.education;
        }
    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        errors.value.general = "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.";
    } finally {
        loading.value = false;
    }
});

const handleSubmit = async () => {
    errors.value = {};

    if (!title.value) {
        errors.value.title = "Tên công việc không được để trống";
        return;
    }

    loading.value = true;
    const payload = {
        title: title.value,
        location: location.value,
        salary: salary.value,
        description: description.value,
        requirements: requirements.value,
        jobType: jobType.value,
        category: category.value,
        career: career.value,
        level: level.value,
        experience: experience.value,
        education: education.value
    };

    try {
        if (isEdit.value) {
            await api.put(`/jobs/${jobId}`, payload);
        } else {
            await api.post("/jobs", payload);
        }

        success.value = "Tin tuyển dụng đã được lưu thành công!";
        setTimeout(() => router.push("/employer/jobs"), 1500);
    } catch (err) {
        errors.value.general = err.response?.data?.message || "Lưu tin thất bại. Vui lòng kiểm tra lại thông tin.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.label-pro {
    @apply block text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1 mb-2;
}

.input-pro {
    @apply w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-slate-700 font-medium placeholder:text-slate-300 outline-none text-sm;
}

textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>
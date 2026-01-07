<template>
    <div class="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 font-sans text-slate-900">
        <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div
                class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">Cập nhật <span
                            class="text-indigo-600">hồ sơ</span></h2>
                    <p class="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1 italic">Hoàn thiện thông
                        tin để thu hút nhà tuyển dụng</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <RouterLink to="/candidate/dashboard"
                        class="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">
                        <i class="fa-solid fa-arrow-left mr-2"></i> Quay lại
                    </RouterLink>
                    <RouterLink to="/candidate/profile"
                        class="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all">
                        <i class="fa-solid fa-id-card mr-2"></i> Xem hồ sơ
                    </RouterLink>
                </div>
            </div>

            <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
                <div v-if="loading" class="flex flex-col items-center justify-center py-20">
                    <i class="fa-solid fa-circle-notch animate-spin text-3xl text-indigo-600"></i>
                    <p class="mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Đang trích xuất dữ
                        liệu...</p>
                </div>

                <form v-else @submit.prevent="handleSave" class="space-y-12">
                    <div class="flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div class="relative group">
                            <div
                                class="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
                                <img :src="preview || profile.avatar || '/default-avatar.png'"
                                    class="w-full h-full object-cover" />
                            </div>
                            <label
                                class="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
                                <i class="fa-solid fa-camera text-sm"></i>
                                <input type="file" class="hidden" @change="onFileChange" accept="image/*" />
                            </label>
                        </div>

                        <div class="flex-1 w-full space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Họ
                                        và tên</label>
                                    <input v-model="profile.name" type="text" class="custom-input"
                                        placeholder="Nhập họ tên..." />
                                </div>
                                <div>
                                    <label
                                        class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Email
                                        (Cố định)</label>
                                    <input v-model="profile.email" type="email" disabled
                                        class="custom-input bg-slate-50 text-slate-400 cursor-not-allowed border-dashed" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Giới
                                        tính</label>
                                    <select v-model="profile.gender" class="custom-input text-xs font-bold">
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Ngày
                                        sinh</label>
                                    <input v-model="profile.birthdate" type="date"
                                        class="custom-input text-xs font-bold" />
                                </div>
                                <div>
                                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Liên
                                        hệ</label>
                                    <input v-model="profile.phone" type="text" class="custom-input text-xs font-bold"
                                        placeholder="0xxx..." />
                                </div>
                                <div>
                                    <label class="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Địa
                                        điểm</label>
                                    <input v-model="profile.address" type="text" class="custom-input text-xs font-bold"
                                        placeholder="Tỉnh/Thành..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-slate-50">
                        <div class="space-y-8">
                            <h3
                                class="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center">
                                <span class="w-1.5 h-4 bg-indigo-600 rounded-full mr-3"></span> Ngành nghề & Kỹ năng
                            </h3>
                            <div class="space-y-6">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Ngành
                                        nghề</label>
                                    <select v-model="profile.industry" class="custom-input text-xs font-bold">
                                        <option value="it">IT</option>
                                        <option value="sales">Bán hàng</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="accounting">Kế toán</option>
                                        <option value="healthcare">Y tế</option>
                                        <option value="hr">Nhân sự</option>
                                        <option value="education">Giáo dục</option>
                                        <option value="healthcare">Y tế</option>
                                        <option value="production">Sản xuất</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 uppercase mb-2 block ml-1">Kỹ
                                        năng</label>
                                    <div class="flex flex-wrap gap-2 mb-3">
                                        <span v-for="(skill, i) in profile.skills" :key="i"
                                            class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100 flex items-center uppercase transition-all">
                                            {{ skill }}
                                            <button type="button" class="ml-2 hover:text-rose-500"
                                                @click="removeSkill(i)">×</button>
                                        </span>
                                    </div>
                                    <input v-model="newSkill" @keyup.enter.prevent="addSkill"
                                        placeholder="Nhập kỹ năng rồi Enter..." class="custom-input text-xs" />
                                </div>
                            </div>
                        </div>

                        <div class="space-y-8">
                            <h3
                                class="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center">
                                <span class="w-1.5 h-4 bg-indigo-600 rounded-full mr-3"></span> Hồ sơ đính kèm
                            </h3>
                            <div class="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
                                <div class="flex items-center justify-between gap-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                                            <i class="fa-solid fa-file-pdf text-indigo-500"></i>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-[10px] font-black text-slate-700 uppercase truncate">{{
                                                profile.cvName || 'Tệp hồ sơ hiện tại' }}</p>
                                            <a v-if="profile.cv" :href="profile.cv" target="_blank"
                                                class="text-[9px] font-bold text-indigo-600 hover:underline uppercase">Xem
                                                tài liệu</a>
                                        </div>
                                    </div>
                                    <label
                                        class="px-4 py-2 bg-slate-900 text-white text-[9px] font-black rounded-lg cursor-pointer hover:bg-indigo-600 transition-all uppercase shadow-md">
                                        Tải lên
                                        <input type="file" class="hidden" @change="onCvChange"
                                            accept=".pdf,.doc,.docx" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-slate-50">
                        <div class="space-y-6">
                            <div class="flex justify-between items-center">
                                <h3
                                    class="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center">
                                    <span class="w-1.5 h-4 bg-amber-500 rounded-full mr-3"></span> Kinh nghiệm
                                </h3>
                                <button type="button" @click="addExperience"
                                    class="text-indigo-600 text-[10px] font-black uppercase hover:underline">+ Thêm
                                    việc</button>
                            </div>
                            <div v-for="(exp, index) in profile.experience" :key="index"
                                class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                                <button type="button" @click="removeExperience(index)"
                                    class="absolute top-2 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">×</button>
                                <div class="grid grid-cols-2 gap-3">
                                    <input v-model="exp.companyName" placeholder="Công ty"
                                        class="custom-input text-xs" />
                                    <input v-model="exp.position" placeholder="Vị trí" class="custom-input text-xs" />
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <input v-model="exp.startDate" type="date" class="custom-input text-xs" />
                                    <input v-model="exp.endDate" type="date" class="custom-input text-xs" />
                                </div>
                                <textarea v-model="exp.description" placeholder="Mô tả ngắn..."
                                    class="custom-input text-xs h-20"></textarea>
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div class="flex justify-between items-center">
                                <h3
                                    class="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center">
                                    <span class="w-1.5 h-4 bg-emerald-500 rounded-full mr-3"></span> Học vấn
                                </h3>
                                <button type="button" @click="addEducation"
                                    class="text-indigo-600 text-[10px] font-black uppercase hover:underline">+ Thêm
                                    trường</button>
                            </div>
                            <div v-for="(edu, index) in profile.education" :key="index"
                                class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                                <button type="button" @click="removeEducation(index)"
                                    class="absolute top-2 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-all">×</button>
                                <input v-model="edu.school" placeholder="Tên trường học" class="custom-input text-xs" />
                                <div class="grid grid-cols-2 gap-3">
                                    <input v-model="edu.degree" placeholder="Bằng cấp" class="custom-input text-xs" />
                                    <div class="flex gap-2">
                                        <input v-model="edu.startYear" type="number" placeholder="Từ"
                                            class="custom-input text-xs" />
                                        <input v-model="edu.endYear" type="number" placeholder="Đến"
                                            class="custom-input text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center pt-10">
                        <button type="submit"
                            class="min-w-[240px] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                            :disabled="isSaving">
                            <i v-if="isSaving" class="fa-solid fa-spinner animate-spin mr-2"></i>
                            {{ isSaving ? "Đang xử lý..." : "Cập nhật hồ sơ" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const loading = ref(true);
const isSaving = ref(false);
const newSkill = ref("");
const preview = ref("/default-avatar.png");

const profile = ref({
    name: "", email: "", gender: "Khác", birthdate: "", phone: "", address: "", industry: "",
    skills: [], education: [], experience: [],
    avatar: null, cv: null, avatarFile: null, cvFile: null, cvName: null,
});

const fetchProfile = async () => {
    loading.value = true;
    try {
        const res = await api.get("/candidate/profile");
        const data = res.data;

        // Format date for <input type="date">
        if (data.birthdate) {
            data.birthdate = new Date(data.birthdate).toISOString().split('T')[0];
        }

        profile.value = {
            ...profile.value,
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            education: Array.isArray(data.education) ? data.education : [],
            experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ""
            })) : [],
        };
        preview.value = data.avatar || "/default-avatar.png";
    } catch (err) {
        console.error("Fetch profile error:", err);
    } finally { loading.value = false; }
};

const addExperience = () => profile.value.experience.push({ companyName: "", position: "", startDate: "", endDate: "", description: "" });
const removeExperience = (i) => profile.value.experience.splice(i, 1);
const addEducation = () => profile.value.education.push({ school: "", degree: "", startYear: null, endYear: null });
const removeEducation = (i) => profile.value.education.splice(i, 1);
const addSkill = () => { if (newSkill.value && !profile.value.skills.includes(newSkill.value)) { profile.value.skills.push(newSkill.value.trim()); newSkill.value = ""; } };
const removeSkill = (i) => profile.value.skills.splice(i, 1);

const onFileChange = (e) => { const file = e.target.files[0]; if (file) { preview.value = URL.createObjectURL(file); profile.value.avatarFile = file; } };
const onCvChange = (e) => { const file = e.target.files[0]; if (file) { profile.value.cvFile = file; profile.value.cvName = file.name; } };

const handleSave = async () => {
    isSaving.value = true;
    try {
        const formData = new FormData();
        Object.keys(profile.value).forEach(key => {
            if (['skills', 'education', 'experience'].includes(key)) {
                formData.append(key, JSON.stringify(profile.value[key]));
            } else if (key === 'avatarFile' && profile.value.avatarFile) {
                formData.append('avatar', profile.value.avatarFile);
            } else if (key === 'cvFile' && profile.value.cvFile) {
                formData.append('cv', profile.value.cvFile);
            } else if (!['avatarFile', 'cvFile', 'avatar', 'cv'].includes(key)) {
                formData.append(key, profile.value[key] || "");
            }
        });

        const res = await api.put("/candidate/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });
        auth.setUser(res.data.user);
        alert("Cập nhật thành công!");
        router.push("/candidate/profile");
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi cập nhật!");
    } finally { isSaving.value = false; }
};

onMounted(fetchProfile);
</script>

<style scoped>
.custom-input {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 0.75rem 1rem;
    outline: none;
    transition: all 0.2s;
    background-color: #fff;
}

.custom-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05);
}

.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
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
</style>
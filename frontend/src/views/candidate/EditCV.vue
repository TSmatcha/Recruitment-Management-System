<template>
    <div class="min-h-screen bg-[#F1F5F9] pt-24 pb-12 px-6 font-sans text-slate-900">
        <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">

            <div
                class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                        Chỉnh sửa <span class="text-indigo-600">Hồ sơ</span>
                    </h2>
                    <p class="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">
                        Cập nhật thông tin 
                    </p>
                </div>
                <button @click="$router.back()"
                    class="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-[11px] uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-all">
                    Quay lại
                </button>
            </div>

            <div v-if="loading" class="bg-white rounded-[2.5rem] p-24 text-center shadow-sm border border-slate-200">
                <p class="text-slate-900 font-black uppercase text-xs tracking-[0.2em] animate-pulse">Đang tải dữ liệu
                    hồ sơ...</p>
            </div>

            <div v-else
                class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/40 border border-slate-200 p-8 md:p-12 space-y-12 relative overflow-hidden">

                <div class="space-y-10">
                    <div class="space-y-3">
                        <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                            1. Tiêu đề hồ sơ chuyên nghiệp
                        </label>
                        <input v-model="form.title" type="text" class="custom-input font-black text-xl text-slate-900"
                            placeholder="VD: Senior Frontend Developer..." />
                    </div>

                    <div class="space-y-3">
                        <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                            2. Giới thiệu chuyên môn
                        </label>
                        <textarea v-model="form.summary"
                            class="custom-input h-32 leading-relaxed text-base font-bold text-slate-800"
                            placeholder="Tóm tắt ngắn gọn về kinh nghiệm..."></textarea>
                    </div>
                </div>

                <div class="pt-10 border-t border-slate-100">
                    <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6 block ml-1">
                        3. Kỹ năng & Công nghệ (Nhấn Enter)
                    </label>
                    <div class="flex flex-col md:flex-row gap-4 mb-6">
                        <input v-model="skillInput" @keyup.enter="addSkill"
                            class="custom-input flex-1 font-black text-slate-800 px-8"
                            placeholder="Nhập tên kỹ năng..." />
                        <button @click="addSkill"
                            class="px-10 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                            Thêm mới
                        </button>
                    </div>

                    <div v-if="form.skills.length" class="flex flex-wrap gap-2 pt-2">
                        <span v-for="(s, i) in form.skills" :key="i"
                            class="group px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-[11px] font-black border border-indigo-100 flex items-center gap-3 uppercase tracking-tighter transition-all hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                            {{ s }}
                            <button @click="removeSkill(i)"
                                class="opacity-30 group-hover:opacity-100 transition-opacity font-bold">Bỏ</button>
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-slate-100">
                    <div class="space-y-10">
                        <div class="space-y-3">
                            <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                                4. Kinh nghiệm làm việc
                            </label>
                            <textarea v-model="expInput"
                                class="custom-input h-48 bg-slate-50/50 text-sm font-bold text-slate-800"
                                placeholder="Mô tả quá trình công tác..."></textarea>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                                5. Học vấn & Bằng cấp
                            </label>
                            <textarea v-model="eduInput"
                                class="custom-input h-32 bg-slate-50/50 text-sm font-bold text-slate-800"
                                placeholder="Thông tin trường học..."></textarea>
                        </div>
                    </div>

                    <div class="space-y-10">
                        <div class="space-y-3">
                            <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                                6. Dự án tiêu biểu
                            </label>
                            <textarea v-model="projectInput"
                                class="custom-input h-48 bg-slate-50/50 text-sm font-bold text-slate-800"
                                placeholder="Mô tả các dự án thực tế..."></textarea>
                        </div>

                        <div
                            class="p-8 bg-slate-900 rounded-[2.5rem] shadow-xl text-white space-y-6 border border-slate-800">
                            <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400 opacity-80">
                                Thông tin liên lạc</h3>
                            <div class="space-y-4">
                                <div class="space-y-2">
                                    <p class="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-1">Email
                                    </p>
                                    <input v-model="form.contact.email" class="contact-input px-6"
                                        placeholder="Địa chỉ email..." />
                                </div>
                                <div class="space-y-2">
                                    <p class="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-1">Số
                                        điện thoại</p>
                                    <input v-model="form.contact.phone" class="contact-input px-6"
                                        placeholder="Số máy liên hệ..." />
                                </div>
                                <div class="space-y-2">
                                    <p class="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-1">Địa
                                        chỉ</p>
                                    <input v-model="form.contact.address" class="contact-input px-6"
                                        placeholder="Tỉnh / Thành phố..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center pt-10">
                    <button @click="submitForm"
                        class="group min-w-[320px] py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center">
                        Lưu thay đổi 
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCVById, updateCV } from "@/services/cv.service";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const loading = ref(true);

const form = ref({
    title: "",
    summary: "",
    skills: [],
    contact: { email: "", phone: "", address: "" },
});

const expInput = ref("");
const eduInput = ref("");
const projectInput = ref("");
const skillInput = ref("");

const addSkill = () => {
    const val = skillInput.value.trim();
    if (val && !form.value.skills.includes(val)) {
        form.value.skills.push(val);
        skillInput.value = "";
    }
};

const removeSkill = (i) => {
    form.value.skills.splice(i, 1);
};

const loadCV = async () => {
    try {
        const res = await getCVById(id);
        const cv = res.data;

        form.value.title = cv.title;
        form.value.summary = cv.summary;
        form.value.skills = cv.skills || [];
        form.value.contact = cv.contact || { email: "", phone: "", address: "" };

        expInput.value = cv.experience?.[0]?.description || "";
        eduInput.value = cv.education?.[0]?.school || "";
        projectInput.value = cv.projects?.[0]?.description || "";
    } catch (err) {
        alert("Không tìm thấy CV");
    } finally {
        loading.value = false;
    }
};

onMounted(loadCV);

const submitForm = async () => {
    const payload = {
        title: form.value.title,
        summary: form.value.summary,
        skills: form.value.skills,
        experience: [{ company: expInput.value, description: expInput.value, startDate: null, endDate: null }],
        education: [{ school: eduInput.value, degree: "", startYear: null, endYear: null }],
        projects: [{ name: projectInput.value, description: projectInput.value, link: "" }],
        contact: form.value.contact,
    };

    try {
        await updateCV(id, payload);
        alert("Đã lưu thay đổi!");
        router.push("/candidate/cvs");
    } catch (error) {
        alert("Lỗi khi cập nhật CV");
    }
};
</script>

<style scoped>
.custom-input {
    @apply w-full border border-slate-300 rounded-2xl px-6 py-4 outline-none transition-all duration-300 bg-white placeholder-slate-400 shadow-sm shadow-slate-100;
}

.custom-input:focus {
    @apply border-indigo-600 ring-[12px] ring-indigo-500/5 shadow-lg shadow-indigo-100/50;
}

.contact-input {
    @apply w-full bg-slate-800 border border-slate-700 rounded-xl py-4 text-[13px] font-black text-white focus:outline-none focus:border-indigo-400 focus:bg-slate-700 transition-all placeholder-slate-500;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

textarea::-webkit-scrollbar {
    width: 6px;
}

textarea::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
</style>
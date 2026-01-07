<template>
    <div class="min-h-screen bg-[#F1F5F9] pt-24 pb-12 px-6 font-sans text-slate-900">
        <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">

            <div
                class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-black tracking-tighter text-slate-900 leading-none">Khởi tạo <span
                            class="text-indigo-600">Hồ sơ</span></h2>
                    <p class="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">Thiết lập nền tảng sự
                        nghiệp chuyên gia</p>
                </div>
                <button @click="$router.back()"
                    class="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-[11px] uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-all">
                    Quay lại
                </button>
            </div>

            <div
                class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/40 border border-slate-200 p-8 md:p-12 space-y-12 relative overflow-hidden">

                <div class="space-y-10">
                    <div class="space-y-3">
                        <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                            1. Tiêu đề hồ sơ chuyên nghiệp
                        </label>
                        <input v-model="form.title" type="text" class="custom-input font-black text-xl text-slate-900"
                            placeholder="VD: Senior Frontend Developer / UI-UX Designer..." />
                    </div>

                    <div class="space-y-3">
                        <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                            2. Giới thiệu chuyên môn (Executive Summary)
                        </label>
                        <textarea v-model="form.summary"
                            class="custom-input h-40 leading-relaxed text-base font-bold text-slate-800 placeholder:font-medium"
                            placeholder="Tóm tắt ngắn gọn về kinh nghiệm, thành tựu và giá trị bạn mang lại..."></textarea>
                    </div>
                </div>

                <div class="pt-10 border-t border-slate-100">
                    <label
                        class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-6 block ml-1 text-center md:text-left">
                        3. Kỹ năng & Công nghệ (Nhấn Enter để thêm)
                    </label>
                    <div class="flex flex-col md:flex-row gap-4 mb-6">
                        <input v-model="skillInput" @keyup.enter="addSkill"
                            class="custom-input flex-1 font-black text-slate-800 px-8"
                            placeholder="Nhập tên kỹ năng tại đây..." />
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
                            <textarea v-model="form.experience"
                                class="custom-input h-48 bg-slate-50/50 text-sm font-bold text-slate-800"
                                placeholder="Mô tả quá trình công tác, vị trí..."></textarea>
                        </div>
                        <div class="space-y-3">
                            <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                                5. Học vấn & Bằng cấp
                            </label>
                            <textarea v-model="form.education"
                                class="custom-input h-32 bg-slate-50/50 text-sm font-bold text-slate-800"
                                placeholder="Thông tin trường học, chuyên ngành..."></textarea>
                        </div>
                    </div>

                    <div class="space-y-10">
                        <div class="space-y-3">
                            <label class="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] block ml-1">
                                6. Dự án tiêu biểu
                            </label>
                            <textarea v-model="form.projects"
                                class="custom-input h-48 bg-slate-50/50 text-sm font-bold text-slate-800"
                                placeholder="Mô tả các dự án thực tế bạn đã tham gia..."></textarea>
                        </div>

                        <div
                            class="p-8 bg-slate-900 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white space-y-6 border border-slate-800">
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
                                        placeholder="Sđt liên hệ..." />
                                </div>
                                <div class="space-y-2">
                                    <p class="text-[8px] font-black uppercase text-slate-500 tracking-widest ml-1">Địa
                                        chỉ</p>
                                    <input v-model="form.contact.address" class="contact-input px-6"
                                        placeholder="Tỉnh / Thành phố hiện tại..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center pt-10">
                    <button @click="submitForm"
                        class="group min-w-[320px] py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center">
                        Tạo hồ sơ
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

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

textarea::-webkit-scrollbar-track {
    background: transparent;
}

textarea::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
</style>

<script setup>
import { ref } from "vue";
import { createCV } from "@/services/cv.service";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
    title: "",
    summary: "",
    skills: [],
    experience: "",
    education: "",
    projects: "",
    contact: { email: "", phone: "", address: "" },
});

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

const submitForm = async () => {
    if (!form.value.title) return alert("Vui lòng nhập tiêu đề hồ sơ");

    const payload = {
        title: form.value.title,
        summary: form.value.summary,
        skills: form.value.skills,
        experience: [{ company: form.value.experience || "", position: "", startDate: null, endDate: null, description: form.value.experience || "" }],
        education: [{ school: form.value.education || "", degree: "", startYear: null, endYear: null }],
        projects: [{ name: form.value.projects || "", description: form.value.projects || "", link: "" }],
        contact: form.value.contact,
    };

    try {
        await createCV(payload);
        alert("Tạo hồ sơ thành công!");
        router.push({ name: "CandidateCVList" });
    } catch (err) {
        alert("Lỗi khi đồng bộ dữ liệu hồ sơ");
    }
};
</script>
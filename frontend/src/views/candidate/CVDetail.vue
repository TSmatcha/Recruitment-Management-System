<template>
    <div class="min-h-screen bg-[#F1F5F9] pt-24 pb-12 px-6 font-sans text-slate-900">
        <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">

            <div
                class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <button @click="$router.push('/candidate/cvs')"
                    class="group px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-2">
                    <i class="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Quay lại danh
                    sách
                </button>
                <h1 class="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    Chi tiết <span class="text-indigo-600">Hồ sơ</span>
                </h1>
                <div class="hidden md:block w-[120px]"></div>
            </div>

            <div v-if="loading" class="bg-white rounded-[2.5rem] p-24 text-center border border-slate-200 shadow-sm">
                <p class="text-slate-900 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Đang trích xuất dữ
                    liệu hồ sơ...</p>
            </div>

            <div v-else-if="cv"
                class="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/40 border border-slate-200 p-8 md:p-12 space-y-12 relative overflow-hidden">

                <section class="space-y-4">
                    <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                        {{ cv.title }}
                    </h2>
                    <p
                        class="text-slate-600 text-base font-bold leading-relaxed max-w-3xl border-l-4 border-indigo-500 pl-6 py-2">
                        {{ cv.summary || "Bản thảo này chưa có nội dung giới thiệu bản thân." }}
                    </p>
                </section>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-slate-100">

                    <section v-if="cv.education?.length" class="space-y-6">
                        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">I. Học vấn &
                            Bằng cấp</h3>
                        <div class="space-y-8">
                            <div v-for="(edu, i) in cv.education" :key="i" class="relative pl-8 group">
                                <div
                                    class="absolute left-0 top-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-4 ring-indigo-50">
                                </div>
                                <div class="absolute left-[4px] top-4 w-[1px] h-full bg-slate-100 group-last:hidden">
                                </div>
                                <p class="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">
                                    {{ edu.startYear }}  {{ edu.endYear }}
                                </p>
                                <p class="text-lg font-black text-slate-900 leading-tight">{{ edu.school }}</p>
                                <p class="text-sm font-bold text-slate-500 italic mt-1">{{ edu.degree }}</p>
                            </div>
                        </div>
                    </section>

                    <section v-if="cv.experience?.length" class="space-y-6">
                        <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">II. Kinh
                            nghiệm </h3>
                        <div class="space-y-8">
                            <div v-for="(exp, i) in cv.experience" :key="i" class="relative pl-8 group">
                                <div
                                    class="absolute left-0 top-1 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-4 ring-indigo-50">
                                </div>
                                <div class="absolute left-[4px] top-4 w-[1px] h-full bg-slate-100 group-last:hidden">
                                </div>
                                <p class="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">
                                    {{ exp.startDate?.slice(0, 10) }}  {{ exp.endDate?.slice(0, 10) }}
                                </p>
                                <p class="text-lg font-black text-slate-900 leading-tight">{{ exp.position }}</p>
                                <p class="text-xs font-black text-slate-400 uppercase mt-1 tracking-wider">{{
                                    exp.company }}</p>
                                <p
                                    class="text-sm font-bold text-slate-600 leading-relaxed mt-4 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    {{ exp.description }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <section v-if="cv.skills?.length" class="pt-10 border-t border-slate-100">
                    <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">III. Năng lực &
                        Công nghệ</h3>
                    <div class="flex flex-wrap gap-3">
                        <span v-for="(skill, i) in cv.skills" :key="i"
                            class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-indigo-600 hover:-translate-y-1 shadow-lg shadow-slate-200">
                            {{ skill }}
                        </span>
                    </div>
                </section>

                <section v-if="cv.contact" class="pt-10 border-t border-slate-100">
                    <div
                        class="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                            <div>
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Email
                                    liên lạc</p>
                                <p class="text-base font-black text-slate-900">{{ cv.contact.email }}</p>
                            </div>
                            <div>
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                                <p class="text-base font-black text-slate-900">{{ cv.contact.phone }}</p>
                            </div>
                            <div class="sm:col-span-2">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Địa chỉ
                                    thường trú</p>
                                <p class="text-base font-black text-slate-900 leading-tight">{{ cv.contact.address }}
                                </p>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 w-full md:w-auto">
                            <button @click="editCV"
                                class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                                Chỉnh sửa
                            </button>
                            <button @click="removeCV"
                                class="px-8 py-4 bg-white text-rose-600 border border-rose-100 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-50 transition-all">
                                Xoá 
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <div v-else class="bg-white rounded-[2.5rem] p-24 text-center border border-slate-200">
                <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">Không tìm thấy dữ liệu hồ sơ này.
                </p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCVById, deleteCVById } from "@/services/cv.service";

const route = useRoute();
const router = useRouter();

const cv = ref(null);
const loading = ref(true);

const loadDetail = async () => {
    try {
        const res = await getCVById(route.params.id);
        cv.value = res.data.data || res.data;
    } catch (err) {
        console.error("Lỗi tải CV:", err);
    } finally {
        loading.value = false;
    }
};

const editCV = () => {
    router.push(`/candidate/cv/edit/${route.params.id}`);
};

const removeCV = async () => {
    if (!confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá vĩnh viễn hồ sơ này?")) return;
    try {
        await deleteCVById(route.params.id);
        router.push("/candidate/cvs");
    } catch (err) {
        alert("Xoá hồ sơ thất bại!");
    }
};

onMounted(loadDetail);
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Ẩn thanh cuộn nhưng vẫn cho phép cuộn */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
</style>
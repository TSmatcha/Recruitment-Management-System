<template>
    <div class="bg-[#F1F5F9] min-h-screen pt-28 pb-16 px-6 font-sans text-slate-900">

        <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">

            <div
                class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="text-center md:text-left">
                    <h1 class="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                        Quản lý <span class="text-indigo-600">Hồ sơ</span>
                    </h1>
                    <p class="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">
                        Danh sách các hồ sơ của bạn
                    </p>
                </div>

                <button @click="goCreate"
                    class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                    Tạo hồ sơ mới
                </button>
            </div>

            <div v-if="loading" class="bg-white rounded-[2.5rem] p-24 text-center border border-slate-200 shadow-sm">
                <p class="text-slate-900 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Đang trích xuất dữ
                    liệu...</p>
            </div>

            <div v-else-if="!cvs.length"
                class="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-300 shadow-sm">
                <p class="text-slate-400 font-bold uppercase text-[11px] tracking-[0.3em] mb-8">
                    Bạn chưa có bản hồ sơ nào trong hệ thống
                </p>
                <button @click="goCreate"
                    class="px-10 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-600 transition-all">
                    Bắt đầu khởi tạo ngay
                </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div v-for="cv in cvs" :key="cv._id"
                    class="group bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all p-8 flex flex-col relative overflow-hidden">

                    <div
                        class="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700">
                    </div>

                    <router-link :to="{ name: 'CandidateCVDetail', params: { id: cv._id } }"
                        class="flex-1 block relative z-10">

                        

                        <h2
                            class="text-xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                            {{ cv.title }}
                        </h2>

                        <p class="text-slate-600 text-sm font-bold leading-relaxed line-clamp-3">
                            {{ cv.summary || "Bản thảo này chưa được bổ sung nội dung giới thiệu chuyên môn." }}
                        </p>
                    </router-link>

                    <div class="flex items-center justify-between mt-8 pt-6 border-t border-slate-50 relative z-10">
                        <div class="flex gap-4">
                            <button @click.stop="goEdit(cv._id)"
                                class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                                Chỉnh sửa
                            </button>
                            <button @click.stop="deleteCV(cv._id)"
                                class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors">
                                Xóa 
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMyCVs, deleteCVById } from "@/services/cv.service";
import { useRouter } from "vue-router";

const cvs = ref([]);
const loading = ref(true);
const router = useRouter();

const loadData = async () => {
    try {
        const res = await getMyCVs();
        cvs.value = res.data || [];
    } catch (err) {
        console.error("Lỗi tải CV:", err);
    } finally {
        loading.value = false;
    }
};

const goCreate = () => router.push({ name: "CreateCV" });
const goEdit = (id) => router.push({ name: "EditCV", params: { id } });

const deleteCV = async (id) => {
    if (!confirm("Hồ sơ này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn chắc chắn chứ?")) return;

    try {
        await deleteCVById(id);
        cvs.value = cvs.value.filter((cv) => cv._id !== id);
        alert("Đã xóa hồ sơ thành công!");
    } catch (err) {
        console.error("Lỗi xóa CV:", err);
        alert("Thao tác thất bại. Vui lòng thử lại!");
    }
};

onMounted(loadData);
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

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
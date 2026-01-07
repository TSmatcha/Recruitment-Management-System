<template>
    <div class="min-h-screen bg-slate-50/50 pt-24 pb-20 px-6 font-sans">
        <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div class="flex items-end justify-between border-b border-slate-200 pb-6">
                <div>
                    <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase">Lời mời ứng tuyển</h2>
                    <p class="text-slate-500 text-sm mt-1 font-medium">Bạn có <span class="text-indigo-600 font-bold">{{
                            invitations.length }} lời mời</span> chưa phản hồi</p>
                </div>
            </div>

            <div v-if="invitations.length === 0"
                class="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
                <i class="fa-solid fa-envelope-open text-slate-200 text-5xl mb-4"></i>
                <p class="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Hộp thư hiện đang trống</p>
            </div>

            <div v-else class="grid gap-5">
                <div v-for="inv in invitations" :key="inv._id"
                    class="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col md:flex-row justify-between items-center gap-6">

                    <div class="flex items-center gap-5 w-full">
                        <div
                            class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-50 transition-colors">
                            <i class="fa-solid fa-briefcase text-slate-400 group-hover:text-indigo-500 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-black text-lg text-slate-800 uppercase tracking-tight leading-tight">
                                {{ inv.jobId?.title || 'Đang tải...' }}
                            </h3>
                            <p class="text-slate-500 font-bold text-sm mt-0.5">{{ inv.jobId?.companyName || 'Nhà tuyển dụng' }}</p>
                            <div class="mt-2">
                                <span
                                    class="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg">
                                    Chờ xác nhận
                                </span>
                            </div>
                        </div>
                    </div>

                    <button v-if="inv.status === 'invited'" @click="openAcceptModal(inv)"
                        class="w-full md:w-auto whitespace-nowrap bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all active:scale-95">
                        Chấp nhận & Gửi CV
                    </button>
                </div>
            </div>
        </div>

        <Transition name="modal-fade">
            <div v-if="showModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div class="bg-white p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl relative border border-slate-100">
                    <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">Gửi hồ sơ</h3>
                    <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Phản hồi lời mời từ
                        Nhà tuyển dụng</p>

                    <div class="space-y-6">
                        <div>
                            <label
                                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Chọn
                                CV năng lực</label>
                            <select v-model="selectedCv"
                                class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700 text-sm">
                                <option :value="null" disabled>-- Chọn CV của bạn --</option>
                                <option v-for="cv in myCvs" :key="cv._id" :value="cv">
                                    {{ cv.title }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Thư
                                giới thiệu ngắn</label>
                            <textarea v-model="coverLetter" placeholder="Lời nhắn gửi đến nhà tuyển dụng..."
                                class="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none"></textarea>
                        </div>

                        <div class="flex items-center gap-4 pt-2">
                            <button @click="showModal = false"
                                class="text-slate-400 font-black text-[10px] uppercase tracking-widest px-4 hover:text-slate-900 transition-colors">Hủy</button>
                            <button @click="confirmAccept" :disabled="!selectedCv || isSubmitting"
                                class="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95">
                                {{ isSubmitting ? 'ĐANG GỬI...' : 'XÁC NHẬN GỬI' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

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
    animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>

<script setup>
// Logic giữ nguyên 100% như bạn đã viết
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const invitations = ref([]);
const myCvs = ref([]);
const showModal = ref(false);
const selectedInvitation = ref(null);
const selectedCv = ref(null);
const coverLetter = ref('');
const isSubmitting = ref(false);

const fetchData = async () => {
    try {
        const [invRes, cvRes] = await Promise.all([
            api.get('/applications'),
            api.get('/cv')
        ]);
        invitations.value = invRes.data.filter(app => app.status === 'invited');
        myCvs.value = cvRes.data;
    } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
    }
};

const openAcceptModal = (inv) => {
    selectedInvitation.value = inv;
    selectedCv.value = null;
    coverLetter.value = '';
    showModal.value = true;
};

const confirmAccept = async () => {
    if (!selectedCv.value) return;
    isSubmitting.value = true;
    try {
        await api.put('/applications/accept-invitation', {
            applicationId: selectedInvitation.value._id,
            cvId: selectedCv.value._id,
            cvUrl: selectedCv.value.cvUrl || selectedCv.value.url,
            coverLetter: coverLetter.value
        });
        alert("Gửi thành công!");
        showModal.value = false;
        fetchData();
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi không xác định");
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(fetchData);
</script>
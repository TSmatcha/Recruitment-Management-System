<template>
    <div class="min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 font-sans">
        <div
            class="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100 relative overflow-hidden animate-fade-in">

            <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

            <div class="mb-10 text-center">
                <h2 class="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                    Bảo mật <span class="text-indigo-600">Tài khoản</span>
                </h2>
                <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Cập nhật mật khẩu định kỳ để
                    an toàn hơn</p>
            </div>

            <form @submit.prevent="handleChangePassword" class="space-y-8">

                <div class="space-y-3">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Mật khẩu
                        hiện tại</label>
                    <input v-model="currentPassword" type="password" placeholder="••••••••" required
                        class="custom-input shadow-sm shadow-slate-100" />
                </div>

                <div class="space-y-3">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Mật khẩu
                        mới</label>
                    <input v-model="newPassword" type="password" placeholder="Nhập mã mới" required
                        class="custom-input shadow-sm shadow-slate-100" />
                </div>

                <div class="space-y-3">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Xác nhận
                        khẩu mới</label>
                    <input v-model="confirmPassword" type="password" placeholder="Nhập lại mã mới" required
                        class="custom-input shadow-sm shadow-slate-100" />
                </div>

                <div class="pt-4">
                    <button type="submit"
                        class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50">
                        Đổi mật khẩu
                    </button>
                </div>

                <div v-if="message || error" class="animate-fade-in">
                    <p v-if="message"
                        class="text-center text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 py-3 rounded-xl border border-emerald-100">
                        {{ message }}
                    </p>
                    <p v-if="error"
                        class="text-center text-[11px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 py-3 rounded-xl border border-rose-100">
                        {{ error }}
                    </p>
                </div>
            </form>

            <div class="mt-10 pt-6 border-t border-slate-50 text-center">
                <RouterLink to="/candidate/dashboard"
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
                    Quay lại Dashboard
                </RouterLink>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const error = ref("");

const handleChangePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        error.value = "Mật khẩu mới không khớp!";
        message.value = "";
        return;
    }

    try {
        const res = await api.put(
            "/candidate/change-password",
            {
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
            },
            { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        message.value = res.data.message;
        error.value = "";

        // Reset form
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        // Đăng xuất sau khi đổi thành công
        setTimeout(() => {
            auth.logout && auth.logout();
            localStorage.removeItem("token");
            router.push("/login");
        }, 1500);
    } catch (err) {
        error.value = err.response?.data?.message || "Đổi mật khẩu thất bại!";
        message.value = "";
    }
};
</script>

<style scoped>
.custom-input {
    @apply w-full border border-slate-200 rounded-2xl px-5 py-3.5 outline-none transition-all duration-300 bg-white text-sm font-bold text-slate-800 placeholder-slate-300;
}

.custom-input:focus {
    @apply border-indigo-600 ring-8 ring-indigo-600/5 shadow-md;
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

.animate-fade-in {
    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
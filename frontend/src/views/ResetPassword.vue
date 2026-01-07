<template>
    <div class="flex items-center justify-center min-h-screen bg-slate-50 px-4 font-sans">
        <div
            class="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100 relative overflow-hidden">

            <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

            <div class="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <i class="fa-solid fa-shield-halved text-3xl text-emerald-600"></i>
            </div>

            <div class="text-center mb-10">
                <h2 class="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                    Đặt lại mật khẩu
                </h2>
                <p class="text-slate-500 text-[15px] leading-relaxed">
                    Vui lòng thiết lập mật khẩu mới có độ bảo mật cao để bảo vệ tài khoản của bạn.
                </p>
            </div>

            <form @submit.prevent="handleResetPassword" class="space-y-6">
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 ml-1">Mật khẩu mới</label>
                    <div class="relative group">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <i class="fa-solid fa-lock"></i>
                        </span>
                        <input v-model="form.newPassword" :type="showPassword ? 'text' : 'password'"
                            class="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-slate-50/30 text-slate-700"
                            placeholder="••••••••" required />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 ml-1">Xác nhận mật khẩu mới</label>
                    <div class="relative group">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <i class="fa-solid fa-check-double"></i>
                        </span>
                        <input v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'"
                            class="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-slate-50/30 text-slate-700"
                            placeholder="••••••••" required />
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98] mt-2">
                    Cập nhật mật khẩu
                </button>
            </form>

            <div class="text-center mt-10">
                <router-link :to="redirectLoginPath"
                    class="text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors group">
                    <i class="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                    Quay lại đăng nhập
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue"; // Thêm ref cho showPassword
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const showPassword = ref(false); // State ẩn hiện mật khẩu

const form = reactive({
    newPassword: "",
    confirmPassword: "",
});

const token = route.params.token;

const isEmployer = computed(() => route.fullPath.includes("/employer"));
const redirectLoginPath = computed(() =>
    isEmployer.value ? "/employer/login" : "/login"
);

const handleResetPassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
        return alert("Mật khẩu xác nhận không khớp!");
    }

    try {
        await axios.put(
            `http://localhost:5000/api/auth/reset-password/${token}`,
            { password: form.newPassword }
        );
        alert("✨ Đặt lại mật khẩu thành công!");
        router.push(redirectLoginPath.value);
    } catch (err) {
        alert(err.response?.data?.message || "❌ Token không hợp lệ hoặc đã hết hạn");
    }
};
</script>
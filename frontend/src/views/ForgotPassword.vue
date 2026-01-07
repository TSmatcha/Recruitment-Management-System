<template>
    <div class="flex items-center justify-center min-h-screen bg-slate-50 px-4 font-sans">
        <div
            class="bg-white p-10 rounded-[2rem] shadow-2xl shadow-slate-200/60 w-full max-w-md border border-slate-100 relative overflow-hidden">

            <button @click="goBack"
                class="absolute top-6 left-6 text-slate-400 hover:text-indigo-600 transition-colors">
                <i class="fa-solid fa-arrow-left text-lg"></i>
            </button>

            <div class="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <i class="fa-solid fa-key text-3xl text-indigo-600"></i>
            </div>

            <div class="text-center mb-10">
                <h2 class="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                    Quên mật khẩu?
                </h2>
                <p class="text-slate-500 text-[15px] leading-relaxed">
                    Đừng lo lắng, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu vào email của bạn.
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                    <label class="block text-sm font-semibold text-slate-700 ml-1">Địa chỉ Email</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <i class="fa-solid fa-envelope"></i>
                        </span>
                        <input v-model="email" type="email"
                            class="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-slate-50/30 placeholder:text-slate-400 text-slate-700"
                            placeholder="email@gmail.com" required />
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98]">
                    Gửi liên kết đặt lại
                </button>
            </form>

            <div class="text-center mt-10">
                <p class="text-slate-500 text-sm">
                    Nhớ mật khẩu?
                    <button @click="goBack"
                        class="text-indigo-600 font-bold hover:text-indigo-800 transition-colors ml-1">
                        Quay lại đăng nhập
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const email = ref("");

const handleSubmit = async () => {
    if (!email.value) {
        return alert("❌ Vui lòng nhập email");
    }

    try {
        await axios.post(
            "http://localhost:5000/api/auth/forgot-password",
            {
                email: email.value,
            }
        );

        alert("📧 Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!");
        email.value = "";
    } catch (err) {
        alert(
            err.response?.data?.message ||
            "❌ Không gửi được email. Vui lòng thử lại"
        );
    }
};

const goBack = () => {
    if (route.path.includes("/employer")) {
        router.push("/employer/login");
    } else {
        router.push("/login");
    }
};
</script>

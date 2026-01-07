<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center">
        <section class="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div class="hidden lg:block space-y-8 animate-fade-in">
                <div class="space-y-5">
                    <h1 class="text-4xl font-extrabold text-indigo-900 tracking-tight">
                        Nâng tầm <span class="text-indigo-700">tuyển dụng</span> cùng JobLink
                    </h1>
                    <p class="text-lg text-slate-600 max-w-lg leading-relaxed">
                        Nền tảng giúp doanh nghiệp kết nối nhanh nhất với nguồn nhân lực chất lượng cao.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div v-for="(service, index) in services" :key="index"
                        class="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all duration-300 group">
                        <div class="flex items-center space-x-4">
                            <div
                                class="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                <component :is="service.icon" class="w-6 h-6" />
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800">{{ service.title }}</h3>
                                <p class="text-sm text-slate-600">{{ service.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full max-w-md mx-auto">
                <div
                    class="bg-white shadow-2xl shadow-indigo-200/50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0"></div>

                    <div class="relative z-10">
                        <div class="mb-8">
                            <h3 class="text-2xl font-bold text-slate-800">Chào mừng trở lại!</h3>
                            <p class="text-slate-500 mt-1">Dành riêng cho Nhà Tuyển Dụng</p>
                        </div>

                        <form @submit.prevent="handleLogin" class="space-y-5">
                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 ml-1">Email</label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </span>
                                    <input v-model="form.email" type="email"
                                        class="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all bg-slate-50/50"
                                        placeholder="hr@company.com" required />
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-sm font-semibold text-slate-700 ml-1">
                                    Mật khẩu
                                </label>

                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>

                                    <input v-model="form.password" type="password" class="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3
                   focus:ring-4 focus:ring-indigo-500/10
                   focus:border-indigo-500 focus:outline-none
                   transition-all bg-slate-50/50" placeholder="••••••••" required />
                                </div>

                                <!-- Quên mật khẩu -->
                                <div class="text-right mt-2 pr-1">
                                    <router-link to="/forgot-password"
                                        class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition">
                                        Quên mật khẩu?
                                    </router-link>
                                </div>
                            </div>

                            <transition name="shake">
                                <div v-if="errorMessage"
                                    class="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    {{ errorMessage }}
                                </div>
                            </transition>

                            <button type="submit"
                                class="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                :disabled="loading">
                                <span v-if="loading" class="flex justify-center items-center">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none"
                                        viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Đang xử lý...
                                </span>
                                <span v-else>Đăng nhập ngay</span>
                            </button>

                            <div class="pt-4 text-center">
                                <p class="text-sm text-slate-600">
                                    Chưa có tài khoản doanh nghiệp?
                                    <router-link to="/employer/register"
                                        class="text-indigo-600 font-bold hover:underline">
                                        Đăng ký ngay
                                    </router-link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth"; // Thêm AuthStore

// Icons for the UI
const services = [
    { title: "Đăng tin tuyển dụng", desc: "Tiếp cận hàng triệu ứng viên mỗi tháng.", icon: "💼" },
    { title: "Tìm kiếm hồ sơ", desc: "Bộ lọc thông minh giúp tìm đúng nhân tài.", icon: "🔍" },
    { title: "Quản lý quy trình", desc: "Hệ thống chuyên nghiệp, dễ sử dụng.", icon: "📊" }
];

const router = useRouter();
const auth = useAuthStore(); // Khởi tạo store
const form = reactive({ email: "", password: "" });
const errorMessage = ref("");
const loading = ref(false);

// Chặn truy cập nếu đã đăng nhập đúng vai trò ở tab này
onMounted(() => {
    if (auth.isLoggedIn && auth.userRole === "employer") {
        router.push("/employer/dashboard");
    }
});

const handleLogin = async () => {
    if (!form.email || !form.password) {
        errorMessage.value = "Vui lòng nhập đầy đủ email và mật khẩu!";
        return;
    }

    try {
        loading.value = true;
        errorMessage.value = "";

        // 1. Sử dụng action login từ store (Store này đã được sửa dùng sessionStorage)
        const data = await auth.login(form.email, form.password);
        const user = data.user;

        // 2. Kiểm tra vai trò
        if (user.role !== "employer") {
            errorMessage.value = "Tài khoản này không thuộc loại nhà tuyển dụng!";
            auth.logout(); // Xóa session nếu sai role
            return;
        }

        // 3. Cập nhật trạng thái tab hiện tại
        auth.setUser(user);
        auth.token = data.token;
        sessionStorage.setItem("token", data.token); // Đồng bộ vào sessionStorage

        // 4. Gắn header cho các request API tiếp theo của tab này
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        alert("Đăng nhập thành công!");
        router.push("/employer/dashboard");
    } catch (err) {
        console.error("Login error:", err);
        errorMessage.value = err.response?.data?.message || "Đăng nhập thất bại!";
    } finally {
        loading.value = false;
    }
};
</script>
<style scoped>
/* Hiệu ứng rung nhẹ khi có lỗi */
.shake-enter-active {
    animation: shake 0.4s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
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
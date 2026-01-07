<template>
    <div class="bg-[#f1f5f9] min-h-screen flex justify-center items-center py-12 px-4 font-sans">
        <div
            class="bg-white w-full max-w-4xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col md:flex-row overflow-hidden min-h-[550px]">

            <div class="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div class="mb-8">
                    <h2 class="text-2xl font-black text-slate-900 tracking-tight">
                        Nhà tuyển dụng đăng nhập
                    </h2>
                    <p class="text-slate-500 text-sm mt-1">Chào mừng bạn trở lại với hệ thống quản trị.</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email
                            công việc</label>
                        <input type="email" v-model="form.email" placeholder="hr@company.com"
                            class="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                            required />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Mật
                            khẩu</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="••••••••"
                            class="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all"
                            required />
                    </div>

                    <div class="flex items-center space-x-2 ml-1">
                        <input id="showPassword" type="checkbox" v-model="showPassword"
                            class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer" />
                        <label for="showPassword" class="text-slate-600 text-sm font-medium cursor-pointer select-none">
                            Hiển thị mật khẩu
                        </label>
                    </div>

                    <transition name="fade">
                        <div v-if="errorMessage"
                            class="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg border border-red-100 text-center">
                            {{ errorMessage }}
                        </div>
                    </transition>

                    <button type="submit" :disabled="loading"
                        class="w-full bg-slate-900 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-xs">
                        {{ loading ? "Đang xử lý..." : "Đăng nhập" }}
                    </button>

                    <div class="text-center mt-4">
                        <router-link to="/forgot-password"
                            class="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                            Quên mật khẩu?
                        </router-link>
                    </div>
                </form>
            </div>

            <div
                class="w-full md:w-1/2 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div class="relative z-10 text-center md:text-left">
                    <h3 class="text-xl font-bold mb-4">
                        Bạn chưa có tài khoản?
                    </h3>
                    <p class="text-slate-400 mb-8 text-sm leading-relaxed">
                        Tham gia ngay hôm nay để kết nối với mạng lưới hàng triệu ứng viên tiềm năng và tối ưu quy trình
                        tuyển dụng.
                    </p>

                    <router-link to="/employer/register"
                        class="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] text-sm">
                        Đăng ký ngay
                    </router-link>

                    <div class="mt-12 space-y-6">
                        <div class="h-px w-full bg-slate-800"></div>
                        <div>
                            <h4 class="font-bold text-blue-400 mb-4 text-xs uppercase tracking-widest">Lợi ích khi đăng
                                ký</h4>
                            <ul class="text-slate-400 text-sm space-y-4">
                                <li class="flex items-center gap-3">
                                    <div class="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center">
                                        <i class="fas fa-check text-blue-500 text-[10px]"></i>
                                    </div>
                                    Đăng tin tuyển dụng nhanh chóng
                                </li>
                                <li class="flex items-center gap-3">
                                    <div class="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center">
                                        <i class="fas fa-check text-blue-500 text-[10px]"></i>
                                    </div>
                                    Quản lý hồ sơ ứng viên thông minh
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const showPassword = ref(false);

const form = reactive({
    email: "",
    password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
    if (!form.email || !form.password) {
        errorMessage.value = "Vui lòng nhập đầy đủ thông tin đăng nhập!";
        return;
    }

    try {
        loading.value = true;
        errorMessage.value = "";

        const res = await api.post("/auth/login", {
            email: form.email,
            password: form.password,
        });

        const { token, user } = res.data;

        // Kiểm tra đúng vai trò Nhà tuyển dụng
        if (user.role !== "employer") {
            errorMessage.value = "Tài khoản này không thuộc loại nhà tuyển dụng!";
            return;
        }

        // --- PHẦN SỬA QUAN TRỌNG ĐỂ CHẠY SONG SONG ---
        // 1. Sử dụng hàm setUser từ store để lưu vào sessionStorage
        auth.setUser(user);

        // 2. Lưu token vào sessionStorage (thay vì localStorage)
        auth.token = token;
        sessionStorage.setItem("token", token);

        // 3. Gắn header Authorization cho các request tiếp theo của tab này
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // --------------------------------------------

        alert("Đăng nhập thành công!");
        router.push("/employer/dashboard");
    } catch (err) {
        console.error(err);
        errorMessage.value =
            err.response?.data?.message ||
            "Đăng nhập thất bại! Vui lòng kiểm tra lại.";
    } finally {
        loading.value = false;
    }
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 p-4">

        <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8 animate-fadeIn">

            <!-- Logo -->
            <div class="flex justify-center mb-6">
                <div
                    class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                    <i class="fas fa-shield-alt text-3xl text-white"></i>
                </div>
            </div>

            <h2 class="text-3xl font-bold text-center text-white mb-2 drop-shadow">
                Admin Panel
            </h2>
            <p class="text-center text-indigo-100 mb-8">
                Đăng nhập để quản lý hệ thống
            </p>

            <form @submit.prevent="handleLogin" class="space-y-5">

                <!-- EMAIL -->
                <div>
                    <label class="block text-indigo-100 mb-1 font-medium">Email</label>
                    <input v-model="form.email" type="email" class="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-indigo-200 rounded-lg 
                               focus:ring-2 focus:ring-white/60 outline-none transition"
                        placeholder="Nhập email quản trị" required>
                </div>

                <!-- PASSWORD -->
                <div>
                    <label class="block text-indigo-100 mb-1 font-medium">Mật khẩu</label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="w-full px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-indigo-200 
                                   rounded-lg focus:ring-2 focus:ring-white/60 outline-none transition"
                            placeholder="Nhập mật khẩu" required>

                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 inset-y-0 flex items-center text-indigo-200 hover:text-white transition">
                            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                    </div>
                </div>

                <!-- SUBMIT -->
                <button type="submit" class="w-full py-3 bg-white text-indigo-700 rounded-lg font-semibold shadow-lg hover:bg-indigo-100 
                           transition active:scale-95">
                    Đăng nhập
                </button>
            </form>

            <!-- Footer -->
            <p class="mt-8 text-center text-indigo-200 text-sm">
                © 2025 Admin System 
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"; // Thêm onMounted
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/api/axios";

const router = useRouter();
const auth = useAuthStore();
const showPassword = ref(false);

const form = reactive({
    email: "",
    password: "",
});

// 👉 Chờ component mount xong mới kiểm tra điều hướng để tránh màn hình trắng
onMounted(() => {
    if (auth.isLoggedIn && auth.userRole === "admin") {
        router.push("/admin/dashboard");
    }
});

const handleLogin = async () => {
    try {
        // Sử dụng action login đã được sửa để lưu vào sessionStorage
        const data = await auth.login(form.email, form.password);

        // Check role admin
        if (data.user.role !== "admin") {
            alert("Tài khoản này không có quyền quản trị!");
            auth.logout();
            return;
        }

        // Không cần gán api.defaults.headers vì axios interceptor đã tự xử lý
        alert("Đăng nhập quản trị thành công!");
        router.push("/admin/dashboard");
    } catch (err) {
        alert(err || "Sai email hoặc mật khẩu!");
    }
};
</script>
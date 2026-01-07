<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-white">
    <div class="hidden md:flex w-1/2 relative text-white items-center justify-center p-12 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1500&auto=format&fit=crop"
        alt="Office Building" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-indigo-900/70 backdrop-blur-[2px]"></div>

      <div class="relative z-10 text-center max-w-md">
        <h1 class="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Xây dựng<br />
          <span class="text-yellow-400">Sự nghiệp thành công</span><br />
          cùng JobLink
        </h1>
        <p class="text-blue-50 mt-3 text-lg font-light tracking-wide drop-shadow-md">
          Khám phá hàng ngàn cơ hội việc làm chất lượng, kết nối với nhà tuyển dụng uy tín hàng đầu.
        </p>

        <div class="grid grid-cols-2 gap-4 mt-10 border-t border-white/20 pt-8">
          <div class="text-center">
            <p class="text-2xl font-bold">10,000+</p>
            <p class="text-xs uppercase text-blue-200">Việc làm mới</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">5,000+</p>
            <p class="text-xs uppercase text-blue-200">Công ty uy tín</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12 md:py-0">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 border border-gray-100">
        <div class="flex justify-center mb-4">
          <div
            class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            J</div>
        </div>
        <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-2">Chào mừng trở lại</h2>
        <p class="text-center text-gray-500 mb-8 text-sm">
          Đăng nhập ứng viên để tiếp tục hành trình sự nghiệp
        </p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" placeholder="email@gmail.com" class="w-full bg-white text-gray-800 placeholder-gray-400 px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input v-model="form.password" type="password" placeholder="••••••••" class="w-full bg-white text-gray-800 placeholder-gray-400 px-4 py-3 border border-gray-300 rounded-xl
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
              required />
          </div>

          <div class="text-right">
            <router-link to="/forgot-password"
              class="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition">
              Quên mật khẩu?
            </router-link>
          </div>

          <transition name="fade">
            <p v-if="errorMessage"
              class="text-center text-red-500 bg-red-50 py-2 rounded-lg text-sm font-medium border border-red-100">
              {{ errorMessage }}
            </p>
          </transition>

          <button type="submit" :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold
                   transition-all duration-300 shadow-lg hover:shadow-indigo-200 disabled:opacity-70 active:scale-[0.98]">
            {{ loading ? "Đang xác thực..." : "Đăng nhập ngay" }}
          </button>
        </form>

        <p class="text-center text-gray-600 mt-8 text-sm">
          Chưa có tài khoản?
          <router-link to="/register" class="text-indigo-600 font-bold hover:underline">
            Đăng ký ứng viên
          </router-link>
        </p>
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

const form = reactive({ email: "", password: "" });
const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  if (!form.email || !form.password) {
    errorMessage.value = "Vui lòng nhập đầy đủ email và mật khẩu.";
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

    // Kiểm tra Role ngay tại trang login để tránh login nhầm
    if (user.role !== "candidate") {
      errorMessage.value = "Tài khoản này không thuộc loại ứng viên!";
      return;
    }

    // ⭐ CẬP NHẬT TẠI ĐÂY: Dùng auth store để lưu vào sessionStorage
    auth.setUser(user);
    auth.token = token;
    sessionStorage.setItem("token", token);

    // Gắn header ngay lập tức cho tab hiện tại
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    alert("Đăng nhập thành công!");
    router.push("/candidate/dashboard");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* CSS bổ trợ cho hiệu ứng */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
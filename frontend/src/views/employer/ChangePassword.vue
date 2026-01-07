<template>
    <EmployerLayout>
        <div class="max-w-md mx-auto mt-12">
            <div class="bg-white rounded-3xl shadow-xl p-8 space-y-6">

                <!-- Header -->
                <h2 class="text-3xl font-semibold text-gray-900 text-center">
                    Đổi mật khẩu
                </h2>

                <!-- Form -->
                <form @submit.prevent="handleChangePassword" class="space-y-5">

                    <!-- Current Password -->
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                        <input v-model="currentPassword" type="password" placeholder="Nhập mật khẩu hiện tại" required
                            class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    </div>

                    <!-- New Password -->
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input v-model="newPassword" type="password" placeholder="Nhập mật khẩu mới" required
                            class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    </div>

                    <!-- Confirm New Password -->
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input v-model="confirmPassword" type="password" placeholder="Nhập lại mật khẩu mới" required
                            class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" />
                    </div>

                    <!-- Submit Button -->
                    <button type="submit"
                        class="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium text-lg hover:bg-indigo-500 transition disabled:opacity-60"
                        :disabled="loading">
                        {{ loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu" }}
                    </button>

                    <!-- Messages -->
                    <p v-if="message" class="text-center mt-2 text-green-600 font-medium">{{ message }}</p>
                    <p v-if="error" class="text-center mt-2 text-red-600 font-medium">{{ error }}</p>

                </form>
            </div>
        </div>
    </EmployerLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/axios";
import EmployerLayout from "@/layouts/EmployerLayout.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const message = ref("");
const error = ref("");

const handleChangePassword = async () => {
    error.value = "";
    message.value = "";

    if (newPassword.value !== confirmPassword.value) {
        error.value = "Mật khẩu mới không khớp!";
        return;
    }

    loading.value = true;

    try {
        const res = await api.put(
            "/employer/change-password",
            {
                currentPassword: currentPassword.value,
                newPassword: newPassword.value,
            },
            { headers: { Authorization: `Bearer ${auth.token}` } }
        );

        // ✅ Thông báo thành công
        message.value = res.data.message;

        // 🔐 Logout & xóa token
        auth.logout(); // reset store
        localStorage.removeItem("token");

        // 🔄 Redirect về login sau 1.2s
        setTimeout(() => router.push("/employer/login"), 1200);

    } catch (err) {
        error.value = err.response?.data?.message || "Đổi mật khẩu thất bại!";
    } finally {
        loading.value = false;
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
    }
};
</script>
